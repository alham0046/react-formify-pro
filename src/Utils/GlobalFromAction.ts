import { isArray } from "../functions/dataTypesValidation";
import { getOrCreateFormStore } from "../store/InputStoreRegistry";
import type { FieldProps } from "../typeDeclaration/baseProps";

export const setEditData = (formId: string, data: Record<string, any>) => {
    const inputStore = getOrCreateFormStore(formId)
    inputStore?.setEditData(data)
}

export const setFieldValue = (formId: string, FieldCredentials: FieldProps) => {
    const inputStore = getOrCreateFormStore(formId)
    const keys = Object.keys(FieldCredentials);
    for (const key of keys) {
        inputStore?.setValue(key, FieldCredentials[key])
    }
}

export const resetForm = (formId: string, key: string[] | string) => {
    const inputStore = getOrCreateFormStore(formId)
    inputStore?.reset(key)
}

export const clearForm = (formId: string) => {
    const inputStore = getOrCreateFormStore(formId)
    inputStore.clear()
}

export const formGlobalAction = (formId: string) => {
    const inputStore = getOrCreateFormStore(formId)
    return {
        setEditData: (data: Record<string, any>) => inputStore?.setEditData(data),
        setValue: (FieldCredentials: FieldProps) => {
            const keys = Object.keys(FieldCredentials);
            for (const key of keys) {
                // inputStore?.setValue(key, FieldCredentials[key])
                const value = FieldCredentials[key]
                if (isArray(value)) {
                    // inputStore.setSilentValue(key, value)
                    inputStore.replaceArray(key, value)
                }
                else {
                    inputStore.setValue(key, FieldCredentials[key])
                }
            }
        },
        resetForm: (key?: string[] | string) => inputStore.reset(key),
        clearForm: () => inputStore.clear()
    }
}