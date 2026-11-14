import { getOrCreateFormStore } from "../InputStoreRegistry"

export const setEditData = (formId : string, data : Record<string, any>) => {
    const inputStore = getOrCreateFormStore(formId)
    inputStore?.setEditData(data)
}

