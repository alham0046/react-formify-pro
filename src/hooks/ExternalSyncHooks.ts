import { useCallback, useSyncExternalStore } from "react"
import type { InputFieldType } from "../store/InputFieldStore"
import type { ArrayFieldType } from "../store/ArrayStore"
import type { DropdownFieldType } from "../store/DropdownStore"
import { GlobalOptionStore } from "../store/GlobalOptionStore"
import type { DropdownDependencyFieldType } from "../store/DropdownDepStore"

export const useInputValue = (field: InputFieldType | DropdownFieldType) => {
  const subscribe = useCallback((cb: () => void) => field.subscribe(cb), [])
  return useSyncExternalStore(
    subscribe,
    () => field.value
  )
}

export const useIsHidden = (field : InputFieldType | ArrayFieldType | DropdownFieldType | DropdownDependencyFieldType) => {
    const subscribe = useCallback((cb: () => void) => field.root.dependency.subscribe(field.name, 'hidden', cb), [])
    return useSyncExternalStore(subscribe, () => field.hidden)
}

export const useIsDisabled = (field : InputFieldType | DropdownFieldType) => {
    const subscribe = useCallback((cb: () => void) => field.root.dependency.subscribe(field.name, 'disabled', cb), [])
    return useSyncExternalStore(subscribe, () => field.disabled)
}

// export const useArrayItems = (array : ArrayFieldType) => {
//     const subscribe = useCallback((cb: () => void) => array.subscribe(cb), [])
//     return useSyncExternalStore(subscribe, () => array.items)
// }

export const useIsOpen = (field: DropdownFieldType | DropdownDependencyFieldType) => {
    const subscribe = useCallback((cb: () => void) => field.subscribeToggle(cb), [])
    return useSyncExternalStore(subscribe, () => field.isOpen)
}

export const useDropdownLabel = (field: DropdownFieldType | DropdownDependencyFieldType) => {
  const subscribe = useCallback((cb: () => void) => field.subscribe(cb), [])
  return useSyncExternalStore(
    subscribe,
    () => field.label
  )
}

export const useOptions = (field: DropdownFieldType) => {
  const subscribe = useCallback((cb: () => void) => field.subscribeOptions(cb), [])
  return useSyncExternalStore(
    subscribe,
    () => field.options
  )
}


export const useGlobalOptions = (field: DropdownFieldType | DropdownDependencyFieldType) => {
  const subscribe = useCallback((cb: () => void) => GlobalOptionStore.subscribe(field.name, cb), [])
  return useSyncExternalStore(
    subscribe,
    () => GlobalOptionStore.options
  )
}