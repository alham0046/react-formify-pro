import { RefObject } from "react";
import type { ArrayController } from "../typeDeclaration/arrayProps";
import type { FlatFieldNode, NodeWithFields } from "../typeDeclaration/nodeProps";
import { resolveTargetNode } from "../Utils/NodeResolver";
import { getNodePath } from "../Utils/PathUtils";
import { ArrayField, type ArrayItemType } from "./ArrayStore";
import { FormNode } from "./FormNode";
import type { FormObjectType } from "./FormObject";
import { GlobalOptionStore } from "./GlobalOptionStore";
import type { InputFormType } from "./InputFormStore";

export class DropdownDependencyField extends FormNode {
    private _value: string = ""
    private _initialValue: string = ""
    public label: string = ""
    public dirty: boolean = false
    private _inputel: HTMLDivElement | null = null
    public _cascadeOptionMap = new Map<any, { value: any, label: string }[]>()
    public _options: { value: any, label: string }[] = []
    private valueOptionMap = new Map<any, { value: any, label: string }>()
    public _disabled: boolean = false
    public _hidden: boolean = false
    private _isOpen: boolean = false
    private _inputCode: number = 7
    public readonly isFlat = true as const
    private _dependentField?: FlatFieldNode

    constructor(
        name: string,
        value: any, //// initial value
        options: Record<string, { value: any, label: string }[] | string[]>,
        public readonly parent: InputFormType | FormObjectType | ArrayItemType,
        public readonly _dataParent: Record<string, any>,
        public defaultLabel: string = "Select",
        private includeDefaultLabel: boolean = false,
        // dependsOn?: InputFieldType | DropdownFieldType
        dependsOn: string
    ) {
        super(name, parent.root)
        this._value = value || ""
        this._initialValue = value || ""
        this._dataParent[name] = this._value
        if (options) this.options = options
        // this._dependsOn = 
        this.label = this.valueOptionMap.get(this._value)?.label || this.defaultLabel
        const depField = resolveTargetNode(this, dependsOn) as FlatFieldNode
        this._dependentField = depField
        // this._dependentField = dependsOn
    }

    private listeners = new Set<() => void>()
    private toggleListener = new Set<() => void>()
    private optionsListeners = new Set<() => void>()

    subscribe = (cb: () => void) => {
        this.listeners.add(cb)
        return () => {
            this.listeners.delete(cb)
        }
    }

    subscribeToggle = (cb: () => void) => {
        this.toggleListener.add(cb)
        return () => {
            this.toggleListener.delete(cb)
        }
    }

    subscribeOptions = (cb: () => void) => {
        this.optionsListeners.add(cb)

        return () => {
            this.optionsListeners.delete(cb)
        }
    }

    notify() {           /////////  notify label
        this.listeners.forEach(l => l())
    }

    notifyToggle() {      ///////  notify opening and closing of dropdown
        this.toggleListener.forEach(l => l())
    }

    // Called if initialData arrives after field instantiation
    public syncInitialValue(value: any): void {
        this._value = value
        this._initialValue = value
        this.dirty = false
        this._dataParent[this.name] = value
    }

    set options(cascadeOptions: Record<string, { value: any, label: string }[] | string[]>) {
        for (const [parent, options] of Object.entries(cascadeOptions)) {
            let initOptions: { value: any, label: string }[] = []
            if (this.includeDefaultLabel) initOptions.push({ value: "", label: this.defaultLabel })
            if (typeof options[0] === "string") {
                for (const option of (options as string[])) {
                    initOptions.push({ value: option, label: option })
                }
            } else {
                initOptions = options as { value: any, label: string }[]
            }
            this._cascadeOptionMap.set(parent, initOptions)

            initOptions.forEach(opt => {
                this.valueOptionMap.set(opt.value, opt)
            })
        }
    }

    set el(el: HTMLDivElement | null) {
        this._inputel = el
    }

    get el(): HTMLDivElement | null {
        return this._inputel
    }

    open() {
        if (this._isOpen === true || this._disabled) return
        this._isOpen = true
        GlobalOptionStore.activate(this)
        // this.recomputeOptions()
        this.notifyToggle()
    }

    close() {
        if (this._isOpen === false) return
        this._isOpen = false
        GlobalOptionStore.deactivate(this)
        this.notifyToggle()
    }

    toggle() {
        if (this._isOpen) this.close()
        else this.open()
    }

    get isOpen() {
        return this._isOpen
    }

    set value(v: any) {
        if (this._value === v) return
        this._value = v
        this.label = this.valueOptionMap.get(v)?.label || ""
        this.root.dependency.notifyDependencyChanged(this.name)
        this.notify()
        this._dataParent[this.name] = v
        // this._filteredOptions = this._options
    }

    get value(): any {
        return this._value
    }

    set hidden(v: boolean) {
        v ? this.hide() : this.show()
    }

    get hidden() {
        return this._hidden
    }

    set disabled(v: boolean) {
        this._disabled = v
    }

    get disabled() {
        return this._disabled
    }

    get displayCode(): number {
        return this._inputCode
    }

    getPath(): string {

        const parentPath = getNodePath((this as any).parent)

        return parentPath
            ? `${parentPath}.${this.name}`
            : this.name
    }

    getArray = (path: string): ArrayController | undefined => {
        const node = resolveTargetNode(this, path);
        return node instanceof ArrayField ? node.controller : undefined;
    };

    public setFields = (fields: Record<string, any>): void => {
        // Reuses the inherited prototype setValue method directly
        this.setValue(fields)
    }

    public reset(key?: string[] | string) {
        const isCurrentNode = key === this.name
        if (!key || isCurrentNode) {
            this.value = this._initialValue
        } else {
            if (Array.isArray(key)) {
                key.forEach(k => {
                    const node = resolveTargetNode(this, k)
                    if (node) node.reset()
                })
            } else {
                const node = resolveTargetNode(this, key)
                if (node) node.reset()
            }
        }
    }

    // setValue = (target: string | Record<string, any>, value?: any) => {
    //     // 1. Batch dictionary update
    //     if (target !== null && typeof target === 'object') {
    //         for (const [key, val] of Object.entries(target)) {
    //             this.setSingleValue(key, val)
    //         }
    //         return
    //     }

    //     // 2. Single key update
    //     if (typeof target === 'string') {
    //         this.setSingleValue(target, value)
    //     }
    // }

    // private setSingleValue(targetPath: string, newValue: any) {
    //     // Ultra-fast path for immediate siblings without slashes or dots: "city"
    //     if (!targetPath.includes('/') && !targetPath.includes('.')) {
    //         // console.log('immediate sibling', targetPath, newValue)
    //         const sibling = (this.parent as NodeWithFields)?.fields?.get(targetPath) ?? (this.parent as NodeWithFields)?.field?.(targetPath)
    //         if (!sibling) return
    //         if (sibling.isFlat) {
    //             sibling.value = newValue
    //         } else sibling.setValue(newValue)
    //     }

    //     // Traverse relative/nested path
    //     const node = resolveTargetNode(this, targetPath)
    //     if (!node) return
    //     if (node.isFlat) {
    //         node.value = newValue
    //     } else node.setValue(newValue)
    // }

    private hide() {
        if (this._hidden) return
        delete this._dataParent[this.name]
        this._hidden = true
    }

    private show() {
        if (!this._hidden) return
        this._dataParent[this.name] = this._value
        this._hidden = false
    }
}


export type DropdownDependencyFieldType = DropdownDependencyField