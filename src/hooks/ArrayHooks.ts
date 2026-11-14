import { useCallback, useSyncExternalStore } from "react"
import { ArrayItem, type ArrayFieldType, type ArrayItemType } from "../store/ArrayStore"
import { useNameScope } from "../context/NameScopeContext"

export const useArrayItems = (array : ArrayFieldType) => {
    const subscribe = useCallback((cb: () => void) => array.subscribe(cb), [])
    return useSyncExternalStore(subscribe, () => array.items)
}


export const useArrayItem = () => {
  const scope = useNameScope();
  const currentItem = scope?.node;

  if (!(currentItem instanceof ArrayItem)) {
    throw new Error('useArrayItem must be used inside an ArrayContainer row');
  }

  return {
    item: currentItem,
    index: currentItem.index,
    remove: currentItem.remove,      // Stable class method closure
    isLast: currentItem.index === currentItem.array.length - 1,
    array: currentItem.array,          // Access to parent ArrayField if needed
    add: currentItem.array.addItem
  };
};