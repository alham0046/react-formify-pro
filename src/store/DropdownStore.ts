import { RefObject } from "react"
import { isArray } from "../functions/dataTypesValidation"
import type { ArrayController } from "../typeDeclaration/arrayProps"
import type { NodeWithFields } from "../typeDeclaration/nodeProps"
import { resolveTargetNode } from "../Utils/NodeResolver"
import { getNodePath } from "../Utils/PathUtils"
import { ArrayField, ArrayItem, type ArrayItemType } from "./ArrayStore"
import { FlatNode } from "./FlatNode"
import { FormNode } from "./FormNode"
import type { FormObjectType } from "./FormObject"
import { GlobalOptionStore } from "./GlobalOptionStore"
import { fieldCode, type DisplayNames } from "./InputFieldStore"
import type { InputFormType } from "./InputFormStore"

export class DropdownField extends FormNode {
    private _value: string = ""
    private _initialValue: string = ""
    public label: string = ""
    public dirty: boolean = false
    private _inputel: HTMLDivElement | null = null
    private _inputCode: number = 2
    public _options: { value: any, label: string }[] = []
    private valueOptionMap = new Map<any, { value: any, label: string }>()
    public _disabled: boolean = false
    public _hidden: boolean = false
    private _isOpen: boolean = false
    public readonly isFlat = true as const

    constructor(
        name: string,
        value: any, //// initial value
        options: { value: any, label: string }[] | string[],
        public readonly parent: InputFormType | FormObjectType | ArrayItemType,
        public readonly _dataParent: Record<string, any>,
        public defaultLabel: string = "Select",
        private includeDefaultLabel: boolean = false
    ) {
        super(name, parent?.root || null)
        this._value = value || ""
        this._initialValue = value || ""
        if (this._dataParent)this._dataParent[name] = this._value 
        if (options) this.options = options
        this.label = this.valueOptionMap.get(value)?.label || this.defaultLabel
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

    pushOptions(options: { value: any, label: string }[] | string[]) {
        if (!isArray(options)) return
        if (typeof options[0] === "string") {
            for (const option of (options as string[])) {
                this._options.push({ value: option, label: option })
                this.valueOptionMap.set(option, { value: option, label: option })
            }
        } else {
            for (const option of (options as { value: any, label: string }[])) {
                this._options.push(option)
                this.valueOptionMap.set(option.value, option)
            }
        }
    }

    insertOption(option: { value: any, label: string }, atIndex?: number) {
        if (atIndex === undefined || atIndex < 0) {
            this._options.push(option)
            return
        }
        this._options.splice(atIndex, 0, option)
        this.valueOptionMap.set(option.value, option)
    }

    removeOption(value: any) {
        this._options = this._options.filter(opt => opt.value !== value)
        this.valueOptionMap.delete(value)
    }

    set options(options: { value: any, label: string }[] | string[] | any[]) {
        if (!isArray(options)) return
        let initOptions: { value: any, label: string, raw?: any }[] = []
        if (this.includeDefaultLabel) initOptions.push({ value: "", label: this.defaultLabel })
        
        if (typeof options[0] === "string") {
            for (const option of (options as string[])) {
                initOptions.push({ value: option, label: option })
            }
        }
        else if (options[0] && "value" in options[0] && "label" in options[0]) {
            initOptions = options as { value: any, label: string }[]
        } else {
            for (const item of options) {
                const val = item.id ?? item.value ?? item
                const lbl = item.label ?? item.title ?? item.name ?? String(val)
                initOptions.push({ value: val, label: lbl, raw: item })
            }
        }
        
        this._options = initOptions

        initOptions.forEach(opt => {
            this.valueOptionMap.set(opt.value, opt)
        })
    }

    set el(el : HTMLDivElement | null) {
        this._inputel = el
    }

    get el() : HTMLDivElement | null {
        return this._inputel
    }

    open() {
        if (this._isOpen === true || this._disabled) return
        this._isOpen = true
        console.log('opening activate')
        GlobalOptionStore.activate(this)
        // this.recomputeOptions()
        this.notifyToggle()
    }

    close() {
        if (this._isOpen === false) return
        this._isOpen = false
        console.log('closing deactivate')
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
        this.label = this.valueOptionMap.get(v)?.label || this.defaultLabel
        if (!this.root) {
            this.notify()
            return
        }
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
        // this._filteredOptions = this._options
    }

    set displayCode(displayName: DisplayNames) {
            this._inputCode = fieldCode[displayName]
    }

    // getArray = (path?: string): ArrayController | undefined => {
    //     const node = resolveTargetNode(this, path);
    //     return node instanceof ArrayField ? node.controller : undefined;
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

    getPath(): string {

        const parentPath = getNodePath((this as any).parent)

        return parentPath
            ? `${parentPath}.${this.name}`
            : this.name
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

export type DropdownFieldType = DropdownField











////////// old code without new global option store
// import type { ArrayItemType } from "./ArrayStore"
// import { FormNode } from "./FormNode"
// import type { FormObjectType } from "./FormObject"
// import { GlobalOptionStore, type GlobalOptionType } from "./GlobalOptionStore"
// import type { InputFormType } from "./InputFormStore"

// export class DropdownField extends FormNode {
//     public _value: string = ""
//     public label: string = ""
//     public _options: { value: any, label: string }[] = []
//     private _filteredOptions: { value: any, label: string }[] = []
//     private _search = ""
//     private valueOptionMap = new Map<any, { value: any, label: string }>()
//     public _disabled: boolean = false
//     public _hidden: boolean = false
//     private _isOpen: boolean = false
//     private _highlightedIndex: number = 0
//     private fieldElementMap = new Map<number, HTMLDivElement>()
//     private globalOptions: GlobalOptionType

//     constructor(
//         name: string,
//         value: any, //// initial value
//         options: { value: any, label: string }[] | string[],
//         private readonly _parent: InputFormType | FormObjectType | ArrayItemType,
//         public readonly _dataParent: Record<string, any>,
//         public defaultLabel: string = "Select",
//         private includeDefaultLabel: boolean = false
//     ) {
//         super(name)
//         this._value = value || ""
//         this._dataParent[name] = this._value
//         this.globalOptions = GlobalOptionStore
//         if (options) this.options = options
//         // this.globalOptions.initialize(this._options)

//         // if (value === "") {
//         //     this.label = this.defaultLabel
//         // } else {
//         //     this.label = this.valueOptionMap.get(value)?.label || this.defaultLabel
//         // }
//         this.label = this.valueOptionMap.get(value)?.label || this.defaultLabel
//     }

//     private listeners = new Set<() => void>()
//     private toggleListener = new Set<() => void>()
//     private optionsListeners = new Set<() => void>()

//     subscribe = (cb: () => void) => {
//         this.listeners.add(cb)
//         return () => {
//             this.listeners.delete(cb)
//         }
//     }

//     subscribeToggle = (cb: () => void) => {
//         this.toggleListener.add(cb)
//         return () => {
//             this.toggleListener.delete(cb)
//         }
//     }

//     subscribeOptions = (cb: () => void) => {
//         this.optionsListeners.add(cb)

//         return () => {
//             this.optionsListeners.delete(cb)
//         }
//     }

//     notify() {           /////////  notify label
//         this.listeners.forEach(l => l())
//     }

//     notifyToggle() {      ///////  notify opening and closing of dropdown
//         this.toggleListener.forEach(l => l())
//     }

//     private notifyOptions() {       /////  notify options
//         if (!this._isOpen) return
//         this.optionsListeners.forEach(listener => listener())
//     }

//     addOptions(options: { value: any, label: string }[]) {
//         this._options = [...this._options, ...options]

//         this.notifyOptions()
//     }

//     set options(options: { value: any, label: string }[] | string[]) {
//         let initOptions: { value: any, label: string }[] = []
//         if (this.includeDefaultLabel) initOptions.push({ value: "", label: this.defaultLabel })
//         if (typeof options[0] === "string") {
//             for (const option of (options as string[])) {
//                 initOptions.push({ value: option, label: option })
//             }
//         }
//         else {
//             initOptions = options as { value: any, label: string }[]
//         }

//         // this.valueLabelMap = this.createLabelMap(initOptions)
//         this._filteredOptions = initOptions
        
//         this._options = initOptions

//         initOptions.forEach((opt, index) => {
//             if (opt.value === this._value) this._highlightedIndex = index
//             this.valueOptionMap.set(opt.value, opt)
//         })

//         // this.recomputeOptions()
//     }

//     setElement(index: number, el: HTMLDivElement, value : any) {
//         if (this._value === value) this._highlightedIndex = index
//         this.fieldElementMap.set(index, el)
//     }

//     getElement(index: number) {
//         return this.fieldElementMap.get(index) || null
//     }

//     get options(): { value: any, label: string }[] {
//         return this._filteredOptions
//         // return this._options
//     }

//     getOption(index: number) {
//         return this._filteredOptions[index]
//     }

//     open() {
//         if (this._isOpen === true) return
//         this._isOpen = true
//         GlobalOptionStore.activate(this)
//         // this.recomputeOptions()
//         this.notifyToggle()
//     }

//     close() {
//         if (this._isOpen === false) return
//         this._search = ""
//         this._filteredOptions = this._options
//         // this._filteredOptions = this._options
//         this._isOpen = false
//         this.notifyToggle()
//         // this._highlightedIndex = 0
//     }

//     toggle() {
//         if (this._isOpen) this.close()
//         else this.open()
//     }

//     get isOpen() {
//         return this._isOpen
//     }

//     set value(v: any) {
//         if (this._value === v) return
//         this._value = v
//         this.label = this.valueOptionMap.get(v)?.label || ""
//         this.dependency.notifyDependencyChanged(this.name)
//         this.notify()
//         this._dataParent[this.name] = v
//         // this._filteredOptions = this._options
//     }

//     get value(): any {
//         return this._value
//     }

//     get search() {
//         return this._search
//     }

//     setSearch(value: string) {

//         if (this._search === value) return

//         this._highlightedIndex = 0

//         this._search = value

//         this.recomputeOptions()
//     }

//     private recomputeOptions() {

//         const search = this._search.trim().toLowerCase()

//         // let highlighted: number = 0

//         if (!search) {
//             console.log('going to no search')
//             this._filteredOptions = this._options
//             // highlighted = this._selectedIndex
//         } else {
//             this._filteredOptions =
//                 this._options.filter(option =>
//                     option.label
//                         .toLowerCase()
//                         .includes(search)
//                 )

//         }
//         // const highlighted = this._filteredOptions.findIndex(
//         //     option => option.value === this._value
//         // )

//         // // console.log('the highligted is', highlighted)
//         // this._highlightedIndex = highlighted >= 0 ? highlighted : 0

//         // console.log('the hhigdios is', this._highlightedIndex)

//         this.notifyOptions()
//     }

//     get highlightedIndex() {
//         return this._highlightedIndex
//     }

//     set highlightedIndex(v: number) {
//         if (this._highlightedIndex === v) return
//         this._highlightedIndex = v
//     }

//     set hidden(v: boolean) {
//         v ? this.hide() : this.show()
//     }

//     private hide() {
//         if (this._hidden) return
//         delete this._dataParent[this.name]
//         this._hidden = true
//     }

//     private show() {
//         if (!this._hidden) return
//         this._dataParent[this.name] = this._value
//         this._hidden = false
//     }
// }

// export type DropdownFieldType = DropdownField