import { InputForm, type InputFormType } from "./InputFormStore"

const formRegistry = new Map<string, InputFormType>()

export const registerForm = (formId: string, store: InputFormType) => {
  formRegistry.set(formId, store)
}

export const unregisterForm = (formId: string) => {
  console.log('unregistering form', formId)
  formRegistry.delete(formId)
}

export const getFormStore = (formId: string) => {
  return formRegistry.get(formId)
}

export const getOrCreateFormStore = (formId: string) => {
  let store = formRegistry.get(formId)

  if (!store) {
    store = new InputForm(formId)
    formRegistry.set(formId, store)
  }

  return store
}