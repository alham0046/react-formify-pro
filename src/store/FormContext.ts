// FormContext.ts
import type { DependencyStoreType } from "./DependencyStore";
import { InputForm, type InputFormType } from "./InputFormStore";

let activeDependencyStore: DependencyStoreType | null = null;
let formData: Record<string, any> | null = null;
let baseNode: InputFormType | null = null
let setValue = () => { }

export const FormContext = {
  // Set the current global dependency store
  setActive(dependency: DependencyStoreType, data: Record<string, any>) {
    // console.log("the dependency is", dependency)
    activeDependencyStore = dependency;
    formData = data;

  },
  setBaseNode(node: InputFormType) { baseNode = node },

  // Get the current global dependency store
  getActive(): DependencyStoreType {
    if (!activeDependencyStore) {
      throw new Error(
        "FormNode instantiated without an active InputForm context! " +
        "Ensure InputForm is instantiated first."
      );
    }
    return activeDependencyStore;
  },
  getData(): Record<string, any> | null { return formData }
};


const formContextRegistry = new Map<string, InputFormType>();

// export class FromContext {
//   private _baseNode: InputFormType | null = null
//   constructor(baseNode: InputFormType, formId: string) {
//     formContextRegistry.set(formId, baseNode)
//     this._baseNode = baseNode
//   }

//   get baseNode() {
//     return this._baseNode
//   }
// }

export const getOrCreateContext = (formId: string) => {
  let context = formContextRegistry.get(formId)
  if (!context) {
    context = new InputForm(formId)
    formContextRegistry.set(formId, context)
  }
  return context
}

export const getFormContext = (formId: string) => formContextRegistry.get(formId)

