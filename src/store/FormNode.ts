// FormNode.ts

// import type { FieldProps } from "../typeDeclaration/baseProps";
// import type { DependencyStoreType } from "./DependencyStore"
// import { FormContext } from "./FormContext";
// import type { ArrayFieldType } from "./ArrayStore";
// import type { FormObjectType } from "./FormObject";
import { resolveTargetNode } from "../Utils/NodeResolver";
import { getNodePath } from "../Utils/PathUtils";
import type { InputFormType } from "./InputFormStore";

export abstract class FormNode {
    constructor(public readonly name: string, public readonly root: InputFormType) { }
    /**
   * Prototype-level setValue: Single shared function across all nodes.
   * Can accept:
   * - Dictionary: setValue({ "city": "Ranchi", "age": 25 })
   * - Single path: setValue("user.name", "John")
   */
    public setValue(target: string | Record<string, any>, value?: any): void {
        if (target !== null && typeof target === "object") {
            for (const [key, val] of Object.entries(target)) {
                this.setSingleValue(key, val)
            }
            return
        }

        if (typeof target === "string") {
            this.setSingleValue(target, value)
        }
    }

    private setSingleValue(targetPath: string, newValue: any): void {
        // 1. Ultra-fast path for immediate local siblings without / or .
        if (!targetPath.includes("/") && !targetPath.includes(".")) {
            const container = (this as any).fields ? (this as any) : (this as any).parent
            const sibling = container?.fields?.get(targetPath)

            if (sibling) {
                if (sibling.isFlat) {
                    sibling.value = newValue
                } else {
                    sibling.setValue(newValue)
                }
                return
            }
        }

        // 2. Traverse relative or absolute path
        const node = resolveTargetNode(this as any, targetPath)
        if (!node) return

        if (node.isFlat) {
            node.value = newValue
        } else {
            node.setValue(newValue)
        }
    }

    public resetByKey(key: string | string[]) {
        if (Array.isArray(key)) {
            key.forEach(k => {
                const node = resolveTargetNode(this as any, k)
                if (node) node.reset()
            })
        } else {
            const node = resolveTargetNode(this as any, key)
            if (node) node.reset()
        }
    }
}

export type FormNodeType = FormNode















// FormNode.ts

// import type { FieldProps } from "../typeDeclaration/baseProps";
// import type { DependencyStoreType } from "./DependencyStore"
// import { FormContext } from "./FormContext";
// import type { ArrayFieldType } from "./ArrayStore";
// import type { FormObjectType } from "./FormObject";
// import type { InputFormType } from "./InputFormStore";

// export abstract class FormNode {

// public readonly name: string
// public dependency!: DependencyStoreType
// public readonly dependency: DependencyStoreType;
// public formData: Record<string, any> | null = null

// constructor(public readonly name: string, public readonly root: InputFormType) {
// this.name = name
// this.dependency = FormContext.getActive()
// this.formData = FormContext.getData()
// }

// }

// export type FormNodeType = FormNode