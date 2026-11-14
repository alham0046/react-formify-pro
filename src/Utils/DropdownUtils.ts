import type { NameScopeContextProps } from "../context/NameScopeContext"
import { camelCase } from "../functions/camelCase"
import { ArrayItem } from "../store/ArrayStore"
import { FormObject } from "../store/FormObject"
import type { InputFormType } from "../store/InputFormStore"

export const createDropdown = (
    placeholder: string,
    name: string | undefined,
    options: { value: any, label: string }[] | string[],
    inputStore: InputFormType,
    initialValue: any,
    initialLabel: string,
    includeDefaultLabel: boolean,
    scope?: NameScopeContextProps | null
) => {

    const localName =
        name ?? camelCase(placeholder)


    if (!scope) {

        return inputStore.createDropdown(
            localName,
            options,
            initialValue,
            initialLabel,
            includeDefaultLabel
        )
    }

    const parent = scope.node

    if (parent instanceof ArrayItem) {
        // console.log('the local name is', localName, scope)

        return parent.createDropdown(
            localName,
            options,
            initialValue,
            initialLabel,
            includeDefaultLabel
        )
    }

    if (parent instanceof FormObject) {

        return parent.createDropdown(
            localName,
            options,
            initialValue,
            initialLabel,
            includeDefaultLabel
        )
    }

    return inputStore.createDropdown(
        localName,
        options,
        initialValue
    )
}



export const createDependentDropdown = (
    placeholder: string,
    name: string | undefined,
    options: Record<string, { value: any, label: string }[] | string[]>,
    inputStore: InputFormType,
    initialValue: any,
    initialLabel: string,
    includeDefaultLabel: boolean,
    dependentPath: string,
    scope?: NameScopeContextProps | null
) => {

    const localName =
        name ?? camelCase(placeholder)

    // const dependentField = inputStore.getField(dependentPath)

    if (!scope) {

        return inputStore.createDependentDropdown(
            localName,
            options,
            initialValue,
            initialLabel,
            includeDefaultLabel,
            dependentPath
            // dependentField
        )
    }

    const parent = scope.node

    if (parent instanceof ArrayItem) {
        // console.log('the local name is', localName, scope)

        return parent.createDependentDropdown(
            localName,
            options,
            initialValue,
            initialLabel,
            includeDefaultLabel,
            dependentPath
        )
    }

    if (parent instanceof FormObject) {

        return parent.createDependentDropdown(
            localName,
            options,
            initialValue,
            initialLabel,
            includeDefaultLabel,
            dependentPath
        )
    }

    return inputStore.createDependentDropdown(
        localName,
        options,
        initialValue,
        initialLabel,
        includeDefaultLabel,
        dependentPath
    )
}