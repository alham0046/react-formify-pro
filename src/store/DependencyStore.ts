import { extractDependencies } from "../Utils/extractDeps"
import type { InputFormType } from "./InputFormStore"

type DependencyProperty =
    | "hidden"
    | "disabled"

interface DependencyNode {
    field: string
    property: DependencyProperty
    expression: string | boolean
    // deps : string[]
}

export class DependencyStore {
    private nodes = new Map<string, DependencyNode[]>()

    private listeners = new Map<string, Map<DependencyProperty, Set<() => void>>>()    ///// field -> property(hidden/disabled) -> listener

    constructor(private form: InputFormType) { }

    subscribe(field: string, property: DependencyProperty, cb: () => void) {

        if (!this.listeners.has(field)) {
            this.listeners.set(field, new Map())
        }

        if (!this.listeners.get(field)!.has(property)) {
            this.listeners.get(field)!.set(property, new Set())
        }

        this.listeners.get(field)!.get(property)!.add(cb)

        return () => {
            if (this.listeners.get(field)!.has(property)) {
                this.listeners.get(field)!.get(property)!.delete(cb)
            }
        }
    }

    notify(field: string, property: DependencyProperty) {
        // console.log('the lis', this.listeners.get(field))
        this.listeners.get(field)!.get(property)!.forEach(l => l())
    }

    register(field: string, property: DependencyProperty, expression: string) {
        const dependencies = extractDependencies(expression)
        for (const dep of dependencies) {
            let list: DependencyNode[] = this.nodes.get(dep) ?? []
            list.push({ field, property, expression })
            this.nodes.set(dep, list)
        }
    }

    notifyDependencyChanged(dependency: string) {
        const nodes = this.nodes.get(dependency)

        if (!nodes) {
            return
        }

        for (const node of nodes) {
            this.recompute(node)
        }
    }

    private recompute(node: DependencyNode) {

        const field = this.form.field(node.field)
        
        if (!field) {
            return
        }
        
        const value = this.evaluate(node.expression as string)
        
        if (node.property === "hidden") {
            if (field.hidden === value) {
                return
            }
            field.hidden = value
            console.log('the node is', node, value)
            this.notify(node.field, "hidden")
        }

        if (node.property === "disabled") {
            field.disabled = value
            this.notify(node.field, "disabled")
        }
    }

    private evaluate(expression: string): boolean {

        const resolvedExpression = expression.replace(
            /\$\{([^}]+)\}/g,
            (_, key: string) => {

                const field = this.form
                    .field(key.trim())

                if (!field) {
                    return ""
                }

                if (!field.isFlat) {
                    return ""
                }

                const value = field.value

                return JSON.stringify(value)
            }
        )

        try {
            return Boolean(
                Function(`"use strict"; return (${resolvedExpression})`)()
            )
        }
        catch (error) {
            console.error(
                "Failed to evaluate dependency:",
                expression,
                resolvedExpression,
                error
            )

            return false
        }
    }

    hasNode(name: string) {
        return this.nodes.has(name)
    }

    clear() {
        this.nodes.clear()
        this.listeners.clear()
    }
}

export type DependencyStoreType = DependencyStore