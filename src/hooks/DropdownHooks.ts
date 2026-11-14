import { useCallback, useSyncExternalStore } from "react"
import type { InputStore } from "../InputStore"
import { useContainerContext } from "../context/ContainerContext"

export const useDropdownLabel = (inputStore: InputStore, path: string) => {
    const subscribe = useCallback(
        // (cb: () => void) => inputStore.optionGraph.subscribe(`label_${path}`, cb),
        (cb: () => void) => inputStore.subscribe(`${path}`, cb),
        []
    )

    return useSyncExternalStore(subscribe, () => inputStore.optionGraph.getLabel(path))
}

export const useOptions = (path: string) => {
    const { inputStore } = useContainerContext()

    const subscribe = useCallback(
        (cb: () => void) => inputStore.optionGraph.subscribe(path, cb),
        []
    )

    return useSyncExternalStore(subscribe, () => inputStore.optionGraph.getOptions(path))
}