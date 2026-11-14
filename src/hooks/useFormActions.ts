import { useCallback, useMemo } from "react"
import { useContainerContext } from "../context/ContainerContext"
import type { FieldProps } from "../typeDeclaration/baseProps"
import { isArray } from "../functions/dataTypesValidation"
import type { DropdownOption } from "../components/BaseDropdown"
import type { ArrayHelpers } from "../components/ArrayContainer"
import type { InputFieldType } from "../store/InputFieldStore"
import type { InputFormType } from "../store/InputFormStore"
import type { ArrayFieldType, ArrayItemType } from "../store/ArrayStore"

export const useFormActions = () => {
    const { inputStore } = useContainerContext()
    return useMemo(() => ({
        setValue: (FieldCredentials: FieldProps) => {
            // const keys = Object.keys(FieldCredentials);
            for (const key in FieldCredentials) {
                // inputStore.setValue(key, FieldCredentials[key])
                const value = FieldCredentials[key]
                if (isArray(value)) {
                    // inputStore.setSilentValue(key, value)
                    inputStore.replaceArray(key, value)
                }
                else {
                    inputStore.setValue(key, value)
                }
            }
        },
        submit: () => inputStore.triggerSubmit(),
        reset: () => inputStore.reset()
    }), [inputStore])
}

const setInternalValue = (field: Record<string, any>, node : InputFormType | ArrayItemType) => {
    // console.log('the value of node is', node)
    for (const key in field) {
        const value = field[key]
        if (isArray(value)) {
            const newNode: ArrayFieldType = node.fields.get(key)
            if (!newNode) {
                continue
            }
            for (const item of value) {
                const index = item.index
                const fieldNode = newNode.items[index]
                setInternalValue(item, fieldNode)
            }
        } else {
            const newNode : InputFieldType = node.fields.get(key)
            if (!newNode) {
                continue
            }
            newNode.value = value
        }
    }
}


export const useFormHelpers = () => {
    const { inputStore } = useContainerContext()

    // const baseNode = inputStore.fields

    const setFields = useCallback((fields: FieldProps) => {
        setInternalValue(fields, inputStore)
    }, [inputStore])

    // const setArrayFields = useCallback((field : string, index : number, fields: FieldProps) => {
    //     setInternalValue(fields, inputStore)
    // }, [inputStore])


    // const setValue = useCallback((fields: FieldProps) => {
    //     for (const key in fields) {
    //         const value = fields[key]

    //         if (Array.isArray(value)) {
    //             inputStore.replaceArray(key, value)
    //         } else {
    //             inputStore.setValue(key, value)
    //         }
    //     }
    // }, [inputStore])

    const setOptions = useCallback(
        (name: string, options: string[] | DropdownOption[], initialValue?: string) => {
            inputStore.optionGraph.set(name, options, initialValue)
        },
        [inputStore]
    )

    const arrAction = useCallback((path: string) => {
        return {
            add: ({ count, initialValue } = {}) => inputStore.addArrayItem(path, initialValue, count),
            remove: (index) => inputStore.removeArrayItem(path, index),
            pop: () => inputStore.popArrayItem(path),
        } as ArrayHelpers
    }, [inputStore])

    return { setFields, setOptions, arrAction }
}