import type { NameScopeContextProps } from "../context/NameScopeContext"
import { camelCase } from "../functions/camelCase"
import { ArrayItem } from "../store/ArrayStore"
import { FormObject } from "../store/FormObject"
import { InputField } from "../store/InputFieldStore"
import type { InputFormType } from "../store/InputFormStore"

export const createField = (
    placeholder: string,
    name: string | undefined,
    inputStore: InputFormType,
    initialValue?: any,
    scope?: NameScopeContextProps | null,
) => {

    const localName =
        name ?? camelCase(placeholder)

    // if (!inputStore) {
    //     return new InputField(localName, initialValue, null, null)
    // }

    if (!scope) {

        return inputStore.createField(
            localName,
            initialValue
        )
    }

    const parent = scope.node

    if (parent instanceof ArrayItem) {
        // console.log('the local name is', localName, scope)

        return parent.createField(
            localName,
            initialValue
        )
    }

    if (parent instanceof FormObject) {

        return parent.createField(
            localName,
            initialValue
        )
    }

    return inputStore.createField(
        localName,
        initialValue
    )
}