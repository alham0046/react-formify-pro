import { memo, useMemo, type FC, type ReactNode } from "react"
// import type { ArrayHelpers } from "../components/ArrayContainer"
import type { ArrayItemType } from "../store/ArrayStore"
// import {ArrayItemContext} from "../context/ArrayContext"
import { NameScopeContext } from "../context/NameScopeContext"

interface ArrayItemProviderProps {
    item: ArrayItemType
    children: ReactNode
}

const ArrayItemProvider: FC<ArrayItemProviderProps> = ({
    item,
    children
}) => {

    const value = useMemo(() => ({ node: item }), [item])

    // const array = item.array

    // const index = item.index

    // const helpers = useMemo<ArrayHelpers>(() => ({

    //     add: (
    //         initialValue = {}
    //     ) => {
    //         array.add(initialValue)
    //     },

    //     remove: () => {
    //         array.removeItem(item)
    //     },

    //     pop: () => {
    //         array.pop()
    //     },

    //     isLast: () => {
    //         return item.index === array.length - 1
    //     }

    // }), [array, item])

    // const value = useMemo(
    //     () => ({
    //         item,
    //         array,
    //         index,
    //         helpers
    //     }),
    //     [
    //         item,
    //         array,
    //         index,
    //         helpers
    //     ]
    // )
    
    // console.log('rendering array item provider', item)

    return (
        // <ArrayItemContext.Provider value={value}>
            <NameScopeContext value={value}>{children}</NameScopeContext>
        // </ArrayItemContext.Provider>
    )
}

export default memo(ArrayItemProvider)







/*

should i remove helpers from the ArrayContainer component level and make it inside my arraystore. and also if any of users component need the helpers he can take it directly from the store and i can remove the ArrayContext also from the component. So this component

const RemoveArrItem = () => {
    const item = useArray()
    console.log('the remove items is', item)
  return (
    <div onClick={item.remove}>
      X
    </div>
  )
}

export default memo(RemoveArrItem)

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

i can do something that can import from the store maybe by using array item's id. then will that be efficient

*/