// // ArrayContext.ts
// import { createContext, useContext } from 'react'

import { createContext, useContext } from "react"
import type { ArrayHelpers } from "../components/ArrayContainer"
import type { ArrayFieldType, ArrayItemType } from "../store/ArrayStore"
import { useNameScope } from "./NameScopeContext"

// interface ArrayContextValue {
//   path: string
// }

// export const ArrayContext = createContext<ArrayContextValue | null>(null)

// export const useArrayContext = () => {
//   const ctx = useContext(ArrayContext)
//   if (!ctx) {
//     throw new Error('ArrayContainer.Add must be used inside ArrayContainer')
//   }
//   return ctx
// }


interface ArrayItemContextValue {

    item: ArrayItemType

    array: ArrayFieldType

    index: number

    helpers: ArrayHelpers
}
interface ArrayContextValue {

    // item: ArrayItemType

    array: ArrayFieldType

    // index: number

    helpers: ArrayHelpers
}

export const ArrayItemContext =
    createContext<ArrayItemContextValue | null>(null)

export const ArrayContext =
    createContext<ArrayContextValue | null>(null)

export const useArrayItem = () => {

    const context =
        useContext(ArrayItemContext)

    if (!context) {

        throw new Error(
            "useArrayItem() must be used inside <ArrayContainer>"
        )
    }

    return context
}
export const useArray = () => {

    const context =
        useContext(ArrayContext)

    const nameScope = useNameScope()

    if (!context) {
        throw new Error('useArrayItem must be used inside an ArrayContainer')
    }

    const currentItem = nameScope?.node as ArrayItemType | undefined
    const index = currentItem?.index ?? -1

    return {
        item: currentItem,
        index: index,
        // Zero-argument remove that forwards the scoped item to the container helper
        remove: () => {
            if (index !== -1) {
                context.helpers.remove(index)
            }
        },
        helpers: context.helpers
    }
}