import type { ArrayController } from "../typeDeclaration/arrayProps"
import type { NodeWithFields } from "../typeDeclaration/nodeProps"
import { resolveTargetNode } from "../Utils/NodeResolver"
import { getNodePath } from "../Utils/PathUtils"
import { ArrayField, ArrayItem, type ArrayItemType } from "./ArrayStore"
import { FormNode } from "./FormNode"
import type { FormObjectType } from "./FormObject"
import type { InputFormType } from "./InputFormStore"

export type DisplayNames = 'StrInput' | 'NumInput' | 'SelectInput' | 'DateInput' | 'DisabledInput' | 'ArrayInput' | 'ObjectInput' | 'SelectDependentInput'

export const fieldCode: Record<DisplayNames, number> = {
    StrInput: 0,
    NumInput: 1,
    SelectInput: 2,
    DateInput: 3,
    DisabledInput: 4,
    ArrayInput: 5,
    ObjectInput: 6,
    SelectDependentInput: 7
}

export class InputField extends FormNode {
    // public name: string
    private _value: any = ""
    private _initialValue: any = ""
    public error: string | null = null
    private _inputCode: number = 0
    public readonly isFlat = true as const     //// defines if the input has a string value or not
    public _touched: boolean = false
    public dirty: boolean = false
    public _disabled: boolean = false
    public _hidden: boolean = false
    public privacy: boolean = false
    public required: boolean = false
    // private _dataParent: Record<string, any>
    // public dependency: DependencyStoreType | null = null
    // private hasRegisteredHidden : boolean = false
    // private hasRegisteredDisabled : boolean = false
    // public validators: Validator[]


    constructor(
        name: string,
        value: any,
        // private readonly _parent: InputFormType | FormObjectType | ArrayItemType,
        public readonly parent: InputFormType | FormObjectType | ArrayItemType,
        public readonly _dataParent: Record<string, any>
        // dataParent: Record<string, any>
        // private readonly _parent: FormNodeType,
        // dependency: DependencyStoreType,
        // hidden: boolean | string = false,
        // disabled: boolean | string = false,
    ) {
        super(name, parent.root)
        // this.name = name
        this._value = value
        this._initialValue = value
        this._dataParent[name] = this._value
        // this._dataParent = dataParent
        // this.dependency = dependency
        // this.registerHidden(hidden)
        // this.registerDisabled(disabled)
    }

    // setDependency(dependency: DependencyStoreType) { this.dependency = dependency }

    private listeners = new Set<() => void>()

    subscribe = (cb: () => void) => {
        this.listeners.add(cb)
        return () => {
            this.listeners.delete(cb)
        }
    }

    notify() {
        this.listeners.forEach(l => l())
    }

    // Called if initialData arrives after field instantiation
    public syncInitialValue(value: any): void {
        this._value = value
        this._initialValue = value
        this.dirty = false
        this._dataParent[this.name] = value
    }

    set value(v: any) {
        if (this._value === v) return
        this._value = v
        // Track dirty state only when form is in "edit" mode
        if (this.root.mode === "edit") {
            const isNowDirty = v !== this._initialValue
            if (this.dirty !== isNowDirty) {
                this.dirty = isNowDirty
                this.root.markFieldDirty(this, isNowDirty)
            }
        }
        this.root.dependency.notifyDependencyChanged(this.name)
        this.notify()
        this._dataParent[this.name] = v
        // console.log('the formvalue is', this.formData)
    }

    //// THIS CODE IS FOR TRACKING VALUE WITHOUT A FORM(<InputContainer>)
    // set value(v: any) {
    //     if (this._value === v) return
    //     this._value = v
    //     if (!this.root) {
    //         this.notify()
    //         return
    //     }
    //     // Track dirty state only when form is in "edit" mode
    //     if (this.root.mode === "edit") {
    //         const isNowDirty = v !== this._initialValue
    //         if (this.dirty !== isNowDirty) {
    //             this.dirty = isNowDirty
    //             this.root.markFieldDirty(this, isNowDirty)
    //         }
    //     }
    //     this.root.dependency.notifyDependencyChanged(this.name)
    //     this.notify()
    //     this._dataParent![this.name] = v
    //     // console.log('the formvalue is', this.formData)
    // }

    set touched(v: boolean) {
        this._touched = v
    }

    set disabled(v: boolean) {
        this._disabled = v
    }

    set hidden(v: boolean) {
        v ? this.hide() : this.show()
    }

    set displayCode(displayName: DisplayNames) {
        this._inputCode = fieldCode[displayName]
    }

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

    get hidden() {
        return this._hidden
    }

    get displayCode(): number {
        return this._inputCode
    }

    // get displayName() {
    //     return Object.keys(fieldCode).find(key => fieldCode[key] === this._inputCode)
    // }

    get value() {
        return this._value
    }

    // -------------------------
    // PARENT
    // -------------------------

    // get parent() {
    //     return this._parent
    // }

    // -------------------------
    // PATH
    // -------------------------

    getPath(): string {

        const parentPath = getNodePath(this.parent)

        return parentPath
            ? `${parentPath}.${this.name}`
            : this.name
    }

    // getArray = (path?: string): (ArrayController & { currentIndex: number | undefined }) | undefined => {
    //     const parent = this.parent
    //     const currentIndex = parent instanceof ArrayItem ? parent.index : undefined
    //     if (!path) return parent instanceof ArrayItem ? {...parent.array.controller, currentIndex} : undefined
    //     const node = resolveTargetNode(this, path);
    //     return node instanceof ArrayField ? {...node.controller, currentIndex} : undefined;
    // };

    public getArray(path?: string): (ArrayController & { currentIndex?: number }) | undefined {
        // 1. Walk up to find the nearest enclosing ArrayItem (handles nested ObjectContainer inside ArrayItem)
        let curr: any = this.parent
        let enclosingItem: ArrayItem | undefined
        while (curr) {
            if (curr instanceof ArrayItem) {
                enclosingItem = curr
                break
            }
            curr = curr.parent
        }

        const currentIndex = enclosingItem?.index

        // 2. If no path is provided, target the enclosing array directly
        const targetArray = !path
            ? enclosingItem?.array
            : resolveTargetNode(this as any, path)

        if (!(targetArray instanceof ArrayField)) return undefined

        // 3. Inherit live getters (like `length`) from controller without cloning methods
        const scopedController = Object.create(targetArray.controller)
        scopedController.currentIndex = currentIndex
        return scopedController
    }

    public setFields = (fields: Record<string, any>): void => {
        // Reuses the inherited prototype setValue method directly
        this.setValue(fields)
    }

    public reset(key?: string[] | string) {
        const isCurrentNode = key === this.name
        if (!key || isCurrentNode) {
            this.value = this._initialValue
        } else {
            this.resetByKey(key)
            // if (Array.isArray(key)) {
            //     key.forEach(k => {
            //         const node = resolveTargetNode(this, k)
            //         if (node) node.reset()
            //     })
            // } else {
            //     const node = resolveTargetNode(this, key)
            //     if (node) node.reset()
            // }
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
    //         // if (sibling) {
    //         //     if ('value' in sibling) sibling.value = newValue
    //         //     else if (sibling instanceof ArrayField) {
    //         //         // console.log('array sibling', sibling)
    //         //         sibling.setValue(newValue)
    //         //     }
    //         //     return
    //         // }
    //     }

    //     // Traverse relative/nested path
    //     const node = resolveTargetNode(this, targetPath)
    //     if (!node) return
    //     if (node.isFlat) {
    //         node.value = newValue
    //     } else node.setValue(newValue)
    // }
}

export type InputFieldType = InputField


















// import { type DependencyStoreType } from "./DependencyStore"

// export class InputField {
//     public name: string
//     private _value: any = ""
//     public error: string | null = null
//     public _touched: boolean = false
//     public dirty: boolean = false
//     public _disabled: boolean = false
//     public _hidden: boolean = false
//     public privacy: boolean = false
//     public required: boolean = false
//     public dependency: DependencyStoreType
//     // public validators: Validator[]


//     constructor(name: string, value: any, dependency: DependencyStoreType, hidden: boolean | string = false, disabled: boolean | string = false) {
//         this.name = name
//         this._value = value
//         this.dependency = dependency
//         this.registerHidden(hidden)
//         this.registerDisabled(disabled)
//     }

//     private listeners = new Set<() => void>()

//     subscribe = (cb: () => void) => {
//         this.listeners.add(cb)
//         return () => {
//             this.listeners.delete(cb)
//         }
//     }

//     notify() {
//         this.listeners.forEach(l => l())
//     }

//     registerHidden(expression: string | boolean) {
//         if (typeof expression === "boolean") {
//             this._hidden = expression
//             return
//         }
//         this.dependency.register(this.name, 'hidden', expression)
//     }

//     registerDisabled(expression: string | boolean) {
//         if (typeof expression === "boolean") {
//             this._disabled = expression
//             return
//         }
//         this.dependency.register(this.name, 'disabled', expression)
//     }

//     set value(v: any) {
//         if (this._value === v) return
//         this._value = v
//         this.notify()
//         this.dependency.notifyDependencyChanged(this.name)
//     }

//     set touched(v: boolean) {
//         this._touched = v
//     }

//     set disabled(v: boolean) {
//         this._disabled = v
//     }

//     set hidden(v: boolean) {
//         this._hidden = v
//     }

//     get value() {
//         return this._value
//     }
// }

// export type InputFieldType = InputField