import { memo, useMemo, type FC, type ReactNode } from "react";
import { useNameScope } from "../context/NameScopeContext";
import { useContainerContext } from "../context/ContainerContext";
import type { ArrayFieldType } from "../store/ArrayStore";
import { useIsHidden } from "../hooks/ExternalSyncHooks";
// import ArrayItemProvider from "../providers/ArrayItemProvider";
// import { ArrayContext } from "../context/ArrayContext";
import { useArrayItems } from "../hooks/ArrayHooks";
import ItemNodeProvider from "../providers/ItemNodeProvider";
import type { AddArgs } from "../typeDeclaration/arrayProps";

// export interface AddArgs {
//     index?: number;
//     count?: number;
//     initialValue?: Record<string, any>[] | Record<string, any>;
// }

export interface ArrayHelpers {
    add: (args?: AddArgs) => void
    remove: (index: number) => void
    pop: () => void
    isLast: (index: number) => boolean
}

export interface ArrayContainerSlotProps {
    // helpers: ArrayHelpers
    add : (args?: AddArgs) => void
    itemsCount: number
}

interface ArrayContainerProps {
    name: string;
    repeat?: number;
    // getKey?: (item: any, index: number) => string;
    initialValue?: any[]
    hidden?: boolean | string
    append?: ((props: ArrayContainerSlotProps) => ReactNode)
    children: ReactNode
    style?: React.CSSProperties
    className?: string
}
const ArrayContainer: FC<ArrayContainerProps> = ({ name, repeat = 1, children, style, append, initialValue, hidden = false, className = "" }) => {
    const { inputStore } = useContainerContext()
    const parent = useNameScope()
    const array: ArrayFieldType = useMemo(() => {
        const parentNode =
            parent?.node ?? inputStore

        const field = parentNode.createArray(name)
        field.initializeArrayItem(repeat, initialValue)
        inputStore.registerHidden(field, hidden)
        return field

    }, [
        inputStore,
        name,
        parent
    ])

    const items = useArrayItems(array)

    // const helpers = useMemo<ArrayHelpers>(() => ({
    //     add: (args?: AddArgs) => {
    //         const count = args?.count ?? 1
    //         for (let i = 0; i < count; i++) {
    //             array.add(args?.initialValue?.[i] ?? {})
    //         }
    //     },
    //     remove: (index: number) => {
    //         if (index === -1) return
    //         array.remove(index)
    //         // const target = array.items[index]
    //         // if (target) array.removeItem(target)
    //     },
    //     pop: () => {
    //         array.pop()
    //     },
    //     isLast: (index: number) => {
    //         return index === array.items.length - 1
    //     }
    // }), [array])

    // const contextValue = useMemo(() => ({
    //     array,
    //     helpers
    // }), [array, helpers])

    const isHidden: boolean = useIsHidden(array)

    // console.log('the items array is', items)
    if (isHidden) {
        return null
    }

    return (
        // <ArrayContext value={contextValue}>
            <div className={`array-container ${className}`} style={style}>
                {
                    items.map((item) => {

                        return (
                            <ItemNodeProvider key={item.id} node={item}>
                                {children}
                            </ItemNodeProvider>
                            // <ArrayItemProvider key={item.id} item={item}>
                            //     {children}
                            // </ArrayItemProvider>
                        )
                    })
                }
                {typeof append === 'function' ? append({ add : array.addItem, itemsCount: items.length }) : append}
                {/* {typeof append === 'function' ? append({ helpers, itemsCount: items.length }) : append} */}
            </div>
        // </ArrayContext>
    )
}

export default memo(ArrayContainer)