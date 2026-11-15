// ArrayItem.ts

// import type { AddArgs } from "../components/ArrayContainer"
import type { AddArgs, ArrayController } from "../typeDeclaration/arrayProps"
import { ContainerNode } from "./ContainerNode"
import { DropdownDependencyField, type DropdownDependencyFieldType } from "./DropdownDepStore"
import { DropdownField, type DropdownFieldType } from "./DropdownStore"
import { FormNode } from "./FormNode"
import { FormObject, type FormObjectType } from "./FormObject"
import { InputField, type InputFieldType } from "./InputFieldStore"
import type { InputFormType } from "./InputFormStore"
// import type { ArrayField } from "./ArrayField"

// ArrayField.ts


export class ArrayField extends FormNode {

    public items: ArrayItem[] = []

    public itemPerKey = new Map<string, ArrayItemType>()

    private _inputCode: number = 5

    private _hidden: boolean = false

    public _disabled: boolean = false

    public readonly isFlat = false as const

    public data: any[] = []

    private readonly parentData: Record<string, any>

    private listeners = new Set<() => void>()

    public readonly controller: ArrayController = {
        length: this.length,
        add: (args?: AddArgs) => this.addItem(args),
        remove: (index: number) => this.remove(index),
        clear: () => this.clear()
    };

    constructor(
        name: string,
        public readonly parent: InputFormType | FormObjectType | ArrayItemType,
        parentData: Record<string, any>
    ) {
        super(name, parent.root)
        // this.data = []
        this.parentData = parentData
        this.parentData[name] = this.data
    }

    subscribe = (cb: () => void) => {

        this.listeners.add(cb)

        return () => {
            this.listeners.delete(cb)
        }
    }

    getIndex(key: string) {
        return this.items.findIndex(item => item.name === key)
    }

    private notify() {
        this.listeners.forEach(listener => listener())
    }

    set hidden(v: boolean) {
        // console.log('hiding the array')
        v ? this.hide() : this.show()
    }

    set disabled(v: boolean) {
        this._disabled = v
    }

    // set displayCode(displayName ?: DisplayNames) {
    //     this._inputCode = 5
    // }

    private hide() {
        if (this._hidden) return
        delete this.parentData[this.name]
        this._hidden = true
    }

    private show() {
        if (!this._hidden) return
        this.parentData[this.name] = this.data
        this._hidden = false
    }

    get hidden() {
        return this._hidden
    }

    get length() {
        return this.items.length
    }

    get displayCode() {
        return this._inputCode
    }

    item(index: number) {
        return this.items[index]
    }

    /**
   * Sets values for items inside this ArrayField.
   * Can accept:
   * - Array of objects: [{ host: 'localhost', mediaId: '123' }, { host: 'cdn', mediaId: '456' }]
   * - Array of objects with explicit index: [{ index: 1, host: 'new-host' }]
   */
    setValue(itemsData: Record<string, any>[]) {
        if (!Array.isArray(itemsData)) return

        for (let i = 0; i < itemsData.length; i++) {
            const rowData = itemsData[i]
            if (!rowData || typeof rowData !== 'object') continue

            // Support explicit row targeting if provided ({ index: 1, ... }), otherwise fallback to array position i
            const targetIndex = typeof rowData.index === 'number' ? rowData.index : i

            // Auto-grow array if setting items beyond current length
            // while (this.items.length <= targetIndex) {
            //     this.add()
            // }
            if (this.items.length <= targetIndex) {
                return
            }

            const itemNode = this.items[targetIndex]
            if (itemNode) {
                itemNode.setValue(rowData)
            }
        }
    }
    // setValue(value : Record<string, any>[]) {
    //     for (let i = 0; i < value.length; i++) {
    //         const item = value[i]
    //         if (!item) continue
    //         const field = this.items[i]
    //         for (const [key, val] of Object.entries(item)) {
    //             const inputField = field.fields.get(key)
    //             if (inputField instanceof InputField) inputField.value = val
    //         }
    //     }
    // }

    reset(index?: number | number[]) {
        if (index) {
            if (Array.isArray(index)) {
                for (const i of index) {
                    this.items[i]?.reset()
                }
            } else {
                this.items[index]?.reset()
            }
            return
        }
        for (const item of this.items) {
            item.reset()
        }
    }

    initializeArrayItem(repeat: number, initialValue?: Record<string, any>) {
        for (let i = 0; i < repeat; i++) {
            const item = new ArrayItem(
                this,
                initialValue,
                this.data
            )
            // this.items.push(item)
            this.items = [...this.items, item]
        }
        this.notify()
    }

    addItem = (args?: AddArgs) => {
        const initialValue = args?.initialValue
        const count = args?.count ?? initialValue?.length ?? 1
        const index = args?.index
        const isMultiple = count > 1 || Array.isArray(initialValue)
        if (isMultiple) {
            this.addMultiple(count, (initialValue as Record<string, any>[]), index)
        } else {
            this.add(args?.initialValue, index)
        }
    }

    private add(initialValue?: Record<string, any>, index?: number) {
        const item = new ArrayItem(
            this,
            initialValue,
            this.data,
            index
        )
        if (index !== undefined) {
            this.items = this.items.toSpliced(index, 0, item)
        } else {
            this.items = [...this.items, item]
        }
        this.notify()
        return item
    }

    private addMultiple(count: number, initialValues?: Record<string, any>[], index?: number) {
        if (initialValues && initialValues[0]?.index) {
            return this.addMultipleViaIndex(count, initialValues)
        }
        const newItems: ArrayItem[] = []
        for (let i = 0; i < count; i++) {
            const initialValue = initialValues?.[i]
            const item = new ArrayItem(
                this,
                initialValue,
                this.data,
                index === undefined ? undefined : index + i
            )
            newItems.push(item)
        }

        if (index !== undefined) {
            this.items = this.items.toSpliced(index, 0, ...newItems)
        } else {
            this.items = [...this.items, ...newItems]
        }
        this.notify()
    }

    private addMultipleViaIndex(count: number, initialValues: Record<string, any>[]) {
        ////This method is for the format [{ index: 1, host: 'new-host' }, { index: 2, host: 'new-host2' }]
        for (let i = 0; i < count; i++) {
            const initialValue = initialValues[i]
            const index = initialValue?.index
            const item = new ArrayItem(
                this,
                initialValue,
                this.data,
                index
            )
            this.items = this.items.toSpliced(index, 0, item)
        }
        this.notify()
    }

    remove(index: number) {
        console.log('removing item', index)
        if (
            index < 0 ||
            index >= this.items.length
        ) {
            return
        }

        // this.items.splice(index, 1)
        this.items = this.items.toSpliced(index, 1)
        // this.items = this.items.filter((_, i) => i !== index)
        this.data.splice(index, 1)
        this.notify()
    }

    removeItem(item: ArrayItem) {

        const index = this.items.indexOf(item)

        // console.log('removing item', this.items[0])

        if (index === -1) return

        // this.items.splice(index, 1)
        this.items = this.items.filter(i => i !== item)

        // this.data = this.data.toSpliced(index, 1)
        this.data.splice(index, 1)

        // delete this.parentData[this.name]

        this.notify()
    }

    pop() {
        const item = this.items.pop()
        if (item) {
            this.notify()
        }
        return item
    }

    clear() {
        if (this.items.length === 0) return
        this.items.length = 0
        this.notify()
    }
}

export class ArrayItem extends ContainerNode {

    public readonly id = crypto.randomUUID()

    public readonly fields =
        new Map<string, InputFieldType | ArrayFieldType | FormObjectType | DropdownFieldType | DropdownDependencyFieldType>()
    // public readonly fields =
    //     new Map<string, FormNode>()

    public readonly data: Record<string, any>

    public readonly isFlat = false as const

    public readonly parent: ArrayItemType | FormObjectType | InputFormType

    constructor(
        public readonly array: ArrayFieldType,
        initialValue: Record<string, any> = {},
        arrayData: any[],
        targetIndex?: number
    ) {
        super("", array.root)
        this.data = {}
        this.parent = array.parent
        if (targetIndex !== undefined) {
            arrayData.splice(targetIndex, 0, this.data)
        } else {
            arrayData.push(this.data)
        }
        this.initialize(initialValue)
    }

    get index() {
        return this.array.items.indexOf(this)
    }

    initialize(
        initialValue: Record<string, any>
    ) {
        for (const [name, value] of Object.entries(initialValue)) {

            if (Array.isArray(value)) {

                const array = this.createArray(name)

                for (const item of value) {
                    // array.add(item)
                    array.addItem({ initialValue: item })
                }

                continue
            }

            if (
                value !== null &&
                typeof value === "object"
            ) {

                const object = this.createObject(name)

                object.initialize(value)

                continue
            }

            this.createField(name, value)
        }
    }

    createField(
        name: string,
        initialValue: any = ""
    ) {

        const existing = this.fields.get(name)

        // if (existing) {
        //     return existing
        // }
        if (existing instanceof InputField) {
            existing.value = initialValue
            return existing
        }

        const field = new InputField(
            name,
            initialValue,
            this,
            this.data
        )

        this.fields.set(name, field)

        // console.log("the created array is", field)

        return field
    }

    createObject(name: string) {

        const existing = this.fields.get(name)

        if (existing instanceof FormObject) {
            return existing
        }

        const object = new FormObject(
            name,
            this,
            this.data
        )

        this.fields.set(name, object)

        return object
    }

    createArray(name: string) {

        const existing = this.fields.get(name)

        if (existing instanceof ArrayField) {
            return existing
        }

        const array = new ArrayField(
            name,
            this,
            this.data
        )

        this.fields.set(name, array)

        return array
    }

    createDropdown(name: string, options: { value: any, label: string }[] | string[], initialValue: any = "", initialLabel: string = 'Select', includeDefaultLabel: boolean = false) {
        const existing = this.fields.get(name)

        if (existing instanceof DropdownField) {
            existing.options = options
            return existing
        }

        const field = new DropdownField(
            name,
            initialValue,
            options,
            this,
            this.data,
            initialLabel,
            includeDefaultLabel
        )

        this.fields.set(name, field)

        return field
    }

    createDependentDropdown(
        name: string,
        options: Record<string, { value: any, label: string }[] | string[]>,
        initialValue: any = "",
        initialLabel: string = 'Select',
        includeDefaultLabel: boolean = false,
        dependsOn: string
        // dependsOn?: InputFieldType | DropdownFieldType
    ) {
        const existing = this.fields.get(name)

        if (existing instanceof DropdownDependencyField) {
            existing.options = options
            return existing
        }

        const field = new DropdownDependencyField(
            name,
            initialValue,
            options,
            this,
            this.data,
            initialLabel,
            includeDefaultLabel,
            dependsOn
        )

        this.fields.set(name, field)

        return field
    }

    setValue(rowData: Record<string, any>) {
        if (!rowData || typeof rowData !== 'object') return

        console.log('itemsData', rowData)

        for (const [key, val] of Object.entries(rowData)) {
            if (key === 'index') continue // Skip the metadata index key

            const childField = this.fields.get(key)
            if (!childField) continue
            if (childField.isFlat) {
                childField.value = val
            } else {
                childField.setValue(val)
            }
        }
    }

    reset() {
        for (const field of this.fields.values()) {
            field.reset()
        }
    }

    add(initialValue = {}) {
        this.array.addItem(initialValue)
    }

    remove = () => {
        if (this.array.length === 1) return
        this.array.removeItem(this)
    }

    field(name: string) {
        return this.fields.get(name)
    }
}


export type ArrayFieldType = ArrayField

export type ArrayItemType = ArrayItem

















// //// PENDING TO MAKE ID BASED ARRAY INSTEAD OF INDEX BASED

// type ArrayState = {
//     order: string[]
//     entities: Record<string, any>
// }

// export class ArrayManager {
//     private arrays = new Map<string, ArrayState>()
//     private notify: (key: string) => void

//     constructor(notify: (key: string) => void) {
//         this.notify = notify
//     }

//     init(path: string, items: any[] = []) {
//         if (this.arrays.has(path)) return

//         const order: string[] = []
//         const entities: Record<string, any> = {}

//         items.forEach(item => {
//             const id = crypto.randomUUID()
//             order.push(id)
//             entities[id] = item
//         })

//         this.arrays.set(path, { order, entities })
//         this.notify(path)
//     }

//     getOrder(path: string) {
//         return this.arrays.get(path)?.order ?? []
//     }

//     getEntity(path: string, id: string) {
//         return this.arrays.get(path)?.entities[id]
//     }

//     private arrayHelpers = new Map<string, {
//         add: (item?: any) => void
//         remove: (id: string) => void
//         getIds: () => string[]
//     }>()

//     registerArrayHelpers(path: string, helpers: any) {
//         this.arrayHelpers.set(path, helpers)
//     }

//     getArrayHelpers(path: string) {
//         return this.arrayHelpers.get(path)
//     }

//     add(path: string, item: any = {}) {
//         const arr = this.arrays.get(path)
//         if (!arr) return

//         const id = crypto.randomUUID()

//         arr.order = [...arr.order, id]
//         arr.entities[id] = item

//         this.notify(path)
//     }

//     remove(path: string, id: string) {
//         const arr = this.arrays.get(path)
//         if (!arr) return

//         arr.order = arr.order.filter(i => i !== id)
//         delete arr.entities[id]

//         this.notify(path)
//     }

//     replaceAll(path: string, items: any[]) {
//         const order: string[] = []
//         const entities: Record<string, any> = {}

//         items.forEach(item => {
//             const id = crypto.randomUUID()
//             order.push(id)
//             entities[id] = item
//         })

//         this.arrays.set(path, { order, entities })
//         this.notify(path)
//     }
// }