// FormObject.ts

import { ArrayField, type ArrayItemType } from "./ArrayStore"
import { ContainerNode } from "./ContainerNode"
import { DropdownDependencyField, type DropdownDependencyFieldType } from "./DropdownDepStore"
import { DropdownField } from "./DropdownStore"
// import { FormNode } from "./FormNode"
import { InputField } from "./InputFieldStore"
// import { ArrayField } from "./ArrayField"
import { type InputFormType } from "./InputFormStore"

export class FormObject extends ContainerNode {

    public readonly fields =
        new Map<string, InputField | FormObject | ArrayField | DropdownField | DropdownDependencyFieldType>()

    private _hidden: boolean = false

    public _disabled: boolean = false

    public readonly isFlat = false as const

    public readonly data: Record<string, any>

    constructor(
        name: string,
        public readonly parent: InputFormType | FormObjectType | ArrayItemType,
        parentData: Record<string, any>

    ) {
        super(name, parent.root)
        this.data = {}
        parentData[name] = this.data
    }

    field(name: string) {
        return this.fields.get(name)
    }

    set hidden(v: boolean) {
        this._hidden = v
    }

    get hidden() {
        return this._hidden
    }

    set disabled( v: boolean ) {
        this._disabled = v
    }

    initialize(initialValue: Record<string, any>) {
        this.populate(initialValue)
        // for (const [name, value] of Object.entries(initialValue)) {
        //     if (Array.isArray(value)) {
        //         const array = this.createArray(name)
        //         for (const item of value) {
        //             // array.add(item)
        //             array.addItem({ initialValue: item })
        //         }
        //         continue
        //     }
        //     if (value !== null && typeof value === "object") {
        //         const object = this.createObject(name)
        //         object.initialize(value)
        //         continue
        //     }
        //     this.createField(name, value)
        // }
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

    setValue(objectValue: Record<string, any>) {
        for (const [name, value] of Object.entries(objectValue)) {
            const field = this.fields.get(name)
            if (!field) continue
            if (field.isFlat) {
                field.value = value
            } else {
                field.setValue(value)
            }
        }
    }

    reset() {
        for (const field of this.fields.values()) {
            field.reset()
        }
    }
}

export type FormObjectType = FormObject