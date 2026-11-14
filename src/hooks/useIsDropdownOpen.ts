import { useCallback, useSyncExternalStore } from "react"
import type { InputStore } from "../InputStore"

export const useIsOpen = (inputStore: InputStore, path: string) => {
    const subscribe = useCallback((cb: () => void) => inputStore.optionGraph.subscribe(`isOpen_${path}`, cb), [])
    return useSyncExternalStore(subscribe, () => inputStore.optionGraph.isOpened(path))
}