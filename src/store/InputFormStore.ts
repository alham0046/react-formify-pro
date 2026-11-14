import { isArray } from "../functions/dataTypesValidation";
import type { FieldProps } from "../typeDeclaration/baseProps";
import { FlatFieldNode } from "../typeDeclaration/nodeProps";
import { resolveTargetNode } from "../Utils/NodeResolver";
import { getNodePath, setByDotPath } from "../Utils/PathUtils";
import { ArrayField, type ArrayFieldType, type ArrayItemType } from "./ArrayStore";
import { ContainerNode } from "./ContainerNode";
import { DependencyStore, type DependencyStoreType } from "./DependencyStore";
import { DropdownDependencyField, type DropdownDependencyFieldType } from "./DropdownDepStore";
import { DropdownField, type DropdownFieldType } from "./DropdownStore";
// import { FormContext } from "./FormContext";
// import { FormNode } from "./FormNode";
// import { FormNode } from "./FormNode";
import { FormObject, type FormObjectType } from "./FormObject";
import { InputField, type InputFieldType } from "./InputFieldStore";

export class InputForm extends ContainerNode {
  public readonly dependency: DependencyStoreType
  public mode: "edit" | "default" = "default"
  public data: Record<string, any> = {}
  public readonly parent: null = null
  public readonly isFlat = false as const
  private readonly dirtyFields = new Set<FlatFieldNode>()
  private readonly dirtyArrays = new Set<ArrayField>()

  private hiddenFields = new Set<string>()
  private disabledFields = new Set<string>()

  // private editedData: Record<string, any> = {}
  constructor(
    public readonly formId: string,
  ) {
    super("root", null as any);
    (this as any).root = this
    this.dependency = new DependencyStore(this)
    // FormContext.setActive(this.dependency, this.data)
  }

  // private inputFields = new Map<string, InputFieldType>()
  public readonly fields = new Map<string, InputFieldType | ArrayFieldType | FormObjectType | DropdownFieldType | DropdownDependencyFieldType>()


  //// Initialize the form. Mainly sets the mode and initial data
  initializeForm(mode: "edit" | "default" = "default", initialData?: Record<string, any>) {
    this.mode = mode
    this.populate(initialData)
  }

  createField(
    name: string,
    initialValue: any = ""
  ) {

    const existing = this.fields.get(name)

    if (existing instanceof InputField) {
      existing.value = initialValue
      return existing
    }

    const field = new InputField(
      name,
      initialValue,
      this,
      this.data
    )

    this.fields.set(name, field)

    this.data[name] = initialValue

    return field
  }

  createDropdown(
    name: string,
    options: { value: any, label: string }[] | string[],
    initialValue: any = "",
    initialLabel: string = 'Select',
    includeDefaultLabel: boolean = false
  ) {
    const existing = this.fields.get(name)

    if (existing instanceof DropdownField) {
      existing.options = options
      return existing
    }

    const field = new DropdownField(
      name,
      initialValue,
      options,
      this,
      this.data,
      initialLabel,
      includeDefaultLabel
    )

    this.fields.set(name, field)

    return field
  }

  createDependentDropdown(
    name: string,
    options: Record<string, { value: any, label: string }[] | string[]>,
    initialValue: any = "",
    initialLabel: string = 'Select',
    includeDefaultLabel: boolean = false,
    dependsOn: string
    // dependsOn?: InputFieldType | DropdownFieldType
  ) {
    const existing = this.fields.get(name)

    if (existing instanceof DropdownDependencyField) {
      existing.options = options
      return existing
    }

    const field = new DropdownDependencyField(
      name,
      initialValue,
      options,
      this,
      this.data,
      initialLabel,
      includeDefaultLabel,
      dependsOn
    )

    this.fields.set(name, field)

    return field
  }

  createObject(name: string) {

    const existing = this.fields.get(name)

    if (existing instanceof FormObject) {
      return existing
    }

    const object =
      new FormObject(name, this, this.data)

    this.fields.set(name, object)

    return object
  }


  field(name: string) {
    return this.fields.get(name)
  }

  createArray(name: string) {

    const existing = this.fields.get(name)

    if (existing instanceof ArrayField) {
      return existing
    }

    const array =
      new ArrayField(name, this, this.data)

    this.fields.set(name, array)

    return array
  }

  get formData() {
    return this.data
  }

  registerHidden(field: InputFieldType | ArrayFieldType | FormObjectType | DropdownFieldType | DropdownDependencyFieldType, expression: string | boolean) {
    if (this.hiddenFields.has(field.name)) return
    // console.log('the exp is', expression)
    if (typeof expression === "boolean") {
      field.hidden = expression
    } else if (typeof expression === "string") {
      this.dependency.register(field.name, 'hidden', expression)
    }
    this.hiddenFields.add(field.name)
  }

  registerDisabled(field: InputFieldType | DropdownFieldType | DropdownDependencyFieldType, expression: string | boolean) {
    if (this.disabledFields.has(field.name)) return
    if (typeof expression === "boolean") {
      field.disabled = expression
    } else if (typeof expression === "string") {
      this.dependency.register(field.name, 'disabled', expression)
    }
    this.disabledFields.add(field.name)
  }

  reset(key?: string[] | string) {
    if (key) {
      this.resetByKey(key)
      return
      // if (Array.isArray(key)) {
      //   key.forEach(k => {
      //     const node = resolveTargetNode(this, k)
      //     if (node) node.reset()
      //   })
      // } else {
      //   const node = resolveTargetNode(this, key)
      //   if (node) node.reset()
      // }
    }
    const fields = Array.from(this.fields.values())
    for (const field of fields) {
      field.reset()
    }
  }

  clear() {
    this.fields.clear()
    this.data = {}
    this.dirtyFields.clear()
    this.dirtyArrays.clear()

    this.hiddenFields.clear()
    this.disabledFields.clear()

    this.dependency.clear()
  }

  // public setFields = (fields: FieldProps) => {
  //   this.setInternalValue(fields, this)
  // }

  public setFields = (fields: Record<string, any>): void => {
    // Reuses the inherited prototype setValue method directly
    this.setValue(fields)
  }

  /**
   * Called by InputField / DropdownField when its value diverges from _initialValue
   */
  public markFieldDirty(field: FlatFieldNode, isDirty: boolean): void {
    if (this.mode !== "edit") return
    if (isDirty) {
      this.dirtyFields.add(field)
    } else {
      this.dirtyFields.delete(field)
    }
  }

  /**
   * Called by ArrayField when items are added, removed, or cleared in edit mode
   */
  public markArrayDirty(array: ArrayField): void {
    if (this.mode !== "edit") return
    this.dirtyArrays.add(array)
  }

  public get isDirty(): boolean {
    return this.dirtyFields.size > 0 || this.dirtyArrays.size > 0
  }


  /**
   * Builds a clean nested object containing ONLY modified fields/arrays.
   * Computed lazily on submit so keystrokes stay O(1).
   */
  public getEditedData(): Record<string, any> {
    if (this.mode !== "edit") return {}

    const edited: Record<string, any> = {}

    // 1. Collect all modified flat fields (e.g., "title", "user.email", "playlink.0.host")
    for (const field of this.dirtyFields) {
      if (field.hidden) continue // Skip hidden fields excluded from formData
      const path = field.getPath()
      setByDotPath(edited, path, field.value)
    }

    // 2. Include full array payload for structurally modified arrays (items added/removed)
    for (const array of this.dirtyArrays) {
      const path = getNodePath(array)
      setByDotPath(edited, path, array.data)
    }

    return edited
  }

  /**
   * 2. MongoDB-ready dot-notation format (safe for $set in findByIdAndUpdate):
   *    { title: "New Movie", "meta.quality": "4K", "playlink.0.host": "cdn2" }
   */
  public getFlatEditedData(): Record<string, any> {
    if (this.mode !== "edit") return {}

    const flatPatch: Record<string, any> = {}

    // Leaf fields map 1:1 to MongoDB dot paths!
    for (const field of this.dirtyFields) {
      if (field.hidden) continue
      const path = field.getPath()

      // Skip leaf edits if their parent array was structurally modified
      // (since the entire array is replaced below)
      if (this.isInsideDirtyArray(field)) continue

      flatPatch[path] = field.value
    }

    // Structurally modified arrays (items added/removed) replace the array field
    for (const array of this.dirtyArrays) {
      const path = getNodePath(array)
      flatPatch[path] = array.data
    }

    return flatPatch
  }

  private isInsideDirtyArray(field: FlatFieldNode): boolean {
    let curr: any = field.parent
    while (curr) {
      if (curr instanceof ArrayField && this.dirtyArrays.has(curr)) {
        return true
      }
      curr = curr.parent
    }
    return false
  }

  /**
   * Call after successful API save to reset dirty tracking to current values
   */
  public commitEdits(): void {
    for (const field of this.dirtyFields) {
      field.syncInitialValue(field.value)
    }
    this.dirtyFields.clear()
    this.dirtyArrays.clear()
  }
}

export type InputFormType = InputForm
















// import { isArray } from "../functions/dataTypesValidation";
// import type { FieldProps } from "../typeDeclaration/baseProps";
// import { resolveTargetNode } from "../Utils/NodeResolver";
// import { ArrayField, type ArrayFieldType, type ArrayItemType } from "./ArrayStore";
// import { ContainerNode } from "./ContainerNode";
// import { DependencyStore, type DependencyStoreType } from "./DependencyStore";
// import { DropdownDependencyField, type DropdownDependencyFieldType } from "./DropdownDepStore";
// import { DropdownField, type DropdownFieldType } from "./DropdownStore";
// // import { FormContext } from "./FormContext";
// // import { FormNode } from "./FormNode";
// // import { FormNode } from "./FormNode";
// import { FormObject, type FormObjectType } from "./FormObject";
// import { InputField, type InputFieldType } from "./InputFieldStore";

// export class InputForm extends ContainerNode {
//   public readonly dependency: DependencyStoreType
//   public mode: "edit" | "default" = "default"
//   public data: Record<string, any> = {}
//   public readonly parent: null = null
//   public readonly isFlat = false as const

//   private hiddenFields = new Set<string>()
//   private disabledFields = new Set<string>()

//   // private editedData: Record<string, any> = {}
//   constructor(
//     public readonly formId: string,
//   ) {
//     super("root", null as any);
//     (this as any).root = this
//     this.dependency = new DependencyStore(this)
//     // FormContext.setActive(this.dependency, this.data)
//   }

//   // private inputFields = new Map<string, InputFieldType>()
//   public readonly fields = new Map<string, InputFieldType | ArrayFieldType | FormObjectType | DropdownFieldType | DropdownDependencyFieldType>()


//   //// Initialize the form. Mainly sets the mode and initial data
//   initializeForm(mode: "edit" | "default", initialData?: Record<string, any>) {
//     this.mode = mode
//     this.populate(initialData)
//     // if (!initialData) return
//     // for (
//     //   const [name, value]
//     //   of Object.entries(initialData)
//     // ) {

//     //   if (Array.isArray(value)) {

//     //     const array = this.createArray(name)

//     //     for (const item of value) {

//     //       // array.add(item)
//     //       array.addItem({ initialValue: item })
//     //     }

//     //     continue
//     //   }

//     //   if (
//     //     value !== null &&
//     //     typeof value === "object"
//     //   ) {

//     //     const object =
//     //       this.createObject(name)

//     //     this.initializeObject(
//     //       object,
//     //       value
//     //     )

//     //     continue
//     //   }

//     //   this.createField(name, value)
//     // }
//   }

//   // private initializeObject(
//   //   object: FormObjectType,
//   //   data: Record<string, any>
//   // ) {

//   //   for (
//   //     const [name, value]
//   //     of Object.entries(data)
//   //   ) {

//   //     if (Array.isArray(value)) {

//   //       const array =
//   //         object.createArray(name)

//   //       for (const item of value) {
//   //         // array.add(item)
//   //         array.addItem({ initialValue: item })
//   //       }

//   //     } else if (
//   //       value !== null &&
//   //       typeof value === "object"
//   //     ) {

//   //       const child =
//   //         object.createObject(name)

//   //       this.initializeObject(
//   //         child,
//   //         value
//   //       )

//   //     } else {

//   //       object.createField(
//   //         name,
//   //         value
//   //       )
//   //     }
//   //   }
//   // }

//   createField(
//     name: string,
//     initialValue: any = ""
//   ) {

//     const existing = this.fields.get(name)

//     if (existing instanceof InputField) {
//       existing.value = initialValue
//       return existing
//     }

//     const field = new InputField(
//       name,
//       initialValue,
//       this,
//       this.data
//     )

//     this.fields.set(name, field)

//     this.data[name] = initialValue

//     return field
//   }

//   createDropdown(
//     name: string,
//     options: { value: any, label: string }[] | string[],
//     initialValue: any = "",
//     initialLabel: string = 'Select',
//     includeDefaultLabel: boolean = false
//   ) {
//     const existing = this.fields.get(name)

//     if (existing instanceof DropdownField) {
//       existing.options = options
//       return existing
//     }

//     const field = new DropdownField(
//       name,
//       initialValue,
//       options,
//       this,
//       this.data,
//       initialLabel,
//       includeDefaultLabel
//     )

//     this.fields.set(name, field)

//     return field
//   }

//   createDependentDropdown(
//     name: string,
//     options: Record<string, { value: any, label: string }[] | string[]>,
//     // initialValue: any = "",
//     initialLabel: string = 'Select',
//     includeDefaultLabel: boolean = false,
//     dependsOn: string
//     // dependsOn?: InputFieldType | DropdownFieldType
//   ) {
//     const existing = this.fields.get(name)

//     if (existing instanceof DropdownDependencyField) {
//       existing.options = options
//       return existing
//     }

//     const field = new DropdownDependencyField(
//       name,
//       // initialValue,
//       options,
//       this,
//       this.data,
//       initialLabel,
//       includeDefaultLabel,
//       dependsOn
//     )

//     this.fields.set(name, field)

//     return field
//   }

//   createObject(name: string) {

//     const existing = this.fields.get(name)

//     if (existing instanceof FormObject) {
//       return existing
//     }

//     const object =
//       new FormObject(name, this, this.data)

//     this.fields.set(name, object)

//     return object
//   }


//   field(name: string) {
//     return this.fields.get(name)
//   }

//   createArray(name: string) {

//     const existing = this.fields.get(name)

//     if (existing instanceof ArrayField) {
//       return existing
//     }

//     const array =
//       new ArrayField(name, this, this.data)

//     this.fields.set(name, array)

//     return array
//   }

//   get formData() {
//     return this.data
//   }

//   registerHidden(field: InputFieldType | ArrayFieldType | FormObjectType | DropdownFieldType | DropdownDependencyFieldType, expression: string | boolean) {
//     if (this.hiddenFields.has(field.name)) return
//     // console.log('the exp is', expression)
//     if (typeof expression === "boolean") {
//       field.hidden = expression
//     } else if (typeof expression === "string") {
//       this.dependency.register(field.name, 'hidden', expression)
//     }
//     this.hiddenFields.add(field.name)
//   }

//   registerDisabled(field: InputFieldType | DropdownFieldType | DropdownDependencyFieldType, expression: string | boolean) {
//     if (this.disabledFields.has(field.name)) return
//     if (typeof expression === "boolean") {
//       field.disabled = expression
//     } else if (typeof expression === "string") {
//       this.dependency.register(field.name, 'disabled', expression)
//     }
//     this.disabledFields.add(field.name)
//   }

//   public setFields = (fields: FieldProps) => {
//     this.setInternalValue(fields, this)
//   }

//   //// field can be dot separated like school.class.subject
//   // getField(path: string): InputFieldType | DropdownFieldType | undefined {
//   //   const parts = path.split('.')
//   //   let currentNode = this
//   //   for (let i = 0; i < parts.length; i++) {
//   //     const part = parts[i]
//   //     const nextPart = parts[i + 1]
//   //     //// handle case array like school.0.class.subject if school is an array
//   //     if (currentNode instanceof ArrayField) {
//   //       if (nextPart && isNumber(nextPart)) {
//   //         currentNode = currentNode.items[parseInt(nextPart)]
//   //       }
//   //     } else {
//   //       currentNode = currentNode.fields.get(part)
//   //     }
//   //     if (!currentNode) {
//   //       return undefined
//   //     }
//   //   }
//   //   return currentNode
//   // }

//   // setValue = (target: string | Record<string, any>, value?: any) => {
//   //   // 1. Batch dictionary update
//   //   if (target !== null && typeof target === 'object') {
//   //     for (const [key, val] of Object.entries(target)) {
//   //       this.setSingleValue(key, val)
//   //     }
//   //     return
//   //   }

//   //   // 2. Single key update
//   //   if (typeof target === 'string') {
//   //     this.setSingleValue(target, value)
//   //   }
//   // }

//   // private setSingleValue(targetPath: string, newValue: any) {
//   //   // Ultra-fast path for immediate siblings without slashes or dots: "city"
//   //   if (!targetPath.includes('/') && !targetPath.includes('.')) {
//   //     // console.log('immediate sibling', targetPath, newValue)
//   //     const sibling = this.fields?.get(targetPath)
//   //     if (!sibling) return
//   //     if (sibling.isFlat) {
//   //       sibling.value = newValue
//   //     } else sibling.setValue(newValue)
//   //   }

//   //   // Traverse relative/nested path
//   //   const node = resolveTargetNode(this, targetPath)
//   //   if (!node) return
//   //   if (node.isFlat) {
//   //     node.value = newValue
//   //   } else node.setValue(newValue)
//   // }

//   private setInternalValue = (field: Record<string, any>, node: InputFormType | ArrayItemType) => {
//     // console.log('the value of node is', node)
//     for (const key in field) {
//       const value = field[key]
//       if (isArray(value)) {
//         const newNode = node.fields.get(key)
//         if (!newNode || !(newNode instanceof ArrayField)) {
//           continue
//         }
//         for (const item of value) {
//           const index = item.index
//           const fieldNode = newNode.items[index]
//           this.setInternalValue(item, fieldNode)
//         }
//       } else {
//         const newNode = node.fields.get(key)
//         if (!newNode || !(newNode instanceof InputField)) {
//           continue
//         }
//         newNode.value = value
//       }
//     }
//   }
//   // private setInternalValue = (field: Record<string, any>, node: InputFormType | ArrayItemType) => {
//   //   // console.log('the value of node is', node)
//   //   for (const key in field) {
//   //     const value = field[key]
//   //     if (isArray(value)) {
//   //       const newNode: ArrayFieldType = node.fields.get(key)
//   //       if (!newNode) {
//   //         continue
//   //       }
//   //       for (const item of value) {
//   //         const index = item.index
//   //         const fieldNode = newNode.items[index]
//   //         this.setInternalValue(item, fieldNode)
//   //       }
//   //     } else {
//   //       const newNode: InputFieldType | undefined = node.fields.get(key)
//   //       if (!newNode) {
//   //         continue
//   //       }
//   //       newNode.value = value
//   //     }
//   //   }
//   // }

// }

// export type InputFormType = InputForm















































// import { DependencyStore, type DependencyStoreType } from "./DependencyStore";
// import { InputField, type InputFieldType } from "./InputFieldStore";

// export class InputForm {
//   public readonly dependency: DependencyStoreType
//   public mode: "edit" | "default" = "default"
//   private data: Record<string, any> = {}

//   private editedData: Record<string, any> = {}
//   constructor(
//     private formId: string,
//   ) {
//     this.dependency = new DependencyStore(this)
//   }

//   private inputFields = new Map<string, InputFieldType>()

//   initializeForm(mode: "edit" | "default", initialData?: Record<string, any>) {
//     this.mode = mode
//     if (!initialData) return
//     for (const [name, value] of Object.entries(initialData)) {
//       this.initializeField(name, value)
//     }
//   }

//   initializeField(name: string, initialValue: any, hidden: boolean | string = false, disabled: boolean | string = false) {
//     const existing = this.inputFields.get(name)

//     if (existing) {

//       existing.registerHidden(hidden)
//       existing.registerDisabled(disabled)

//       return existing
//     }

//     const field = new InputField(
//       name,
//       initialValue,
//       this.dependency
//     )

//     this.inputFields.set(name, field)

//     // this.data[name] = field.value

//     // Initial value goes directly into the materialized data.
//     this.setNestedValue(
//       this.data,
//       name,
//       initialValue
//     )

//     // field.onValueChange = (value) => {
//     //   this.updateFieldValue(name, value)
//     // }

//     return field
//   }

//   field(name: string) {
//     return this.inputFields.get(name)
//   }

//   setNestedValue(
//     target: Record<string, any>,
//     path: string,
//     value: any
//   ) {
//     const parts = path.split(".")

//     let current: any = target

//     for (let i = 0; i < parts.length - 1; i++) {

//       const part = parts[i]
//       const nextPart = parts[i + 1]

//       if (!(part in current)) {
//         current[part] =
//           /^\d+$/.test(nextPart)
//             ? []
//             : {}
//       }

//       current = current[part]
//     }

//     current[parts[parts.length - 1]] = value
//   }

//   /////  This is recommended by chatgpt
//   // setValue(name: string, value: any) {

//   //   const field = this.field(name)

//   //   if (!field) {
//   //     return
//   //   }

//   //   field.value = value

//   //   this.dependency.notifyDependencyChanged(name)
//   // }

// }

// export type InputFormType = InputForm











// import { DependencyStore, type DependencyStoreType } from "./DependencyStore";
// import { InputField, type InputFieldType } from "./InputFieldStore";

// export class InputForm {
//   public readonly dependency: DependencyStoreType
//   public mode: "edit" | "default" = "default"
//   private data: Record<string, any> = {}

//   private editedData: Record<string, any> = {}
//   constructor(
//     private formId: string,
//   ) {
//     this.dependency = new DependencyStore(this)
//   }

//   private inputFields = new Map<string, InputFieldType>()

//   initializeForm(mode: "edit" | "default", initialData?: Record<string, any>) {
//     this.mode = mode
//     if (!initialData) return
//     for (const [name, value] of Object.entries(initialData)) {
//       this.initializeField(name, value)
//     }
//   }

//   initializeField(name: string, initialValue: any, hidden: boolean | string = false, disabled: boolean | string = false) {
//     if (this.inputFields.has(name)) {
//       const field = this.inputFields.get(name)!
//       field.registerHidden(hidden)
//       field.registerDisabled(disabled)
//       return field
//     }
//     const field = new InputField(name, initialValue, this.dependency, hidden, disabled)

//     this.inputFields.set(name, field)

//     return field
//     // this.inputFields.set(name, new InputField(name, initialValue, this.dependency))
//   }

//   field(name: string) {
//     return this.inputFields.get(name)
//   }

//   /////  This is recommended by chatgpt
//   // setValue(name: string, value: any) {

//   //   const field = this.field(name)

//   //   if (!field) {
//   //     return
//   //   }

//   //   field.value = value

//   //   this.dependency.notifyDependencyChanged(name)
//   // }

// }

// export type InputFormType = InputForm









// import type React from "react";
// import { isArray, isEmptyObject } from "../functions/dataTypesValidation";
// import { InputStyles } from "./InputStyles";
// import { isIndex } from "../Utils/Helper";
// import { Validator } from "../validatorStore";
// import { ComputedStore } from "./computedStore";
// import { OptionGraph } from "../store/OptionGraph";

// type Listener = () => void

// const EMPTY_ARRAY: any[] = []

// const EMPTY_REF: React.RefObject<HTMLDivElement | null> = { current: null }

// export class InputStore {
//   private formId: string; // Declare it here
//   private styles: InputStyles
//   private validator: Validator
//   private computedStore: ComputedStore
//   optionGraph: OptionGraph

//   constructor(formId: string) {
//     this.formId = formId
//     this.styles = new InputStyles()
//     this.validator = new Validator()
//     this.optionGraph = new OptionGraph(this)
//     this.computedStore = new ComputedStore(
//       () => this.state.inputData
//     )
//   }

//   private mainContainer: HTMLDivElement | null = null

//   setContainerRef(el: HTMLDivElement) {
//     this.mainContainer = el
//   }

//   get stylesStore() {
//     return this.styles
//   }

//   get validatorStore() {
//     return this.validator
//   }

//   getFormId() {
//     return this.formId
//   }
//   // private formId: string

//   private rawData = {} as Record<string, any>
//   private state = {
//     inputData: null as Record<string, any> | null,
//     initialData: null as Record<string, any> | null,
//     editedKeys: new Set<string>()
//   }

//   sharedContext = new Map<string, any>()     /////// this will be used to share data between inputs which do not involve in inputData(for side effects)

//   dropdownSearch = new Map<string, any[]>()

//   dropdownContext = new Map<string, React.RefObject<HTMLDivElement | null>>()

//   getDropdownContext(key: string) {
//     return this.dropdownContext.get(key) ?? EMPTY_REF
//   }

//   setDropdownContext(key: string, value: React.RefObject<HTMLDivElement | null>) {
//     this.dropdownContext.set(key, value)
//     // this.notify(key)
//   }

//   getDropdownSearch(key: string) {
//     // if (!this.dropdownSearch.has('si')) return EMPTY_ARRAY
//     return this.dropdownSearch.get(key) || EMPTY_ARRAY
//   }

//   setDropdownSearch(key: string, value: any[]) {
//     this.dropdownSearch.set(key, value)
//     this.notify(key)
//   }

//   private isBatching = false
//   private pendingKeys = new Set<string>()


//   currentValue = ""

//   private _isEditMode = false;

//   set isEditMode(value: boolean) {
//     if (this._isEditMode !== value) {
//       this._isEditMode = value;

//       // // RUN YOUR METHOD HERE
//       this.state.initialData = {}
//     }
//   }

//   get isEditMode() {
//     return this._isEditMode
//   }

//   backgroundColor = 'white'

//   private listeners = new Map<string, Set<Listener>>()     /////// can fix this. can do new Map<string, Listener>() instead.

//   private changeListeners = new Map<string, Set<(value: any) => void>>()

//   subscribe(key: string, listener: Listener) {
//     if (!this.listeners.has(key)) {
//       this.listeners.set(key, new Set())
//     }

//     this.listeners.get(key)!.add(listener)

//     return () => {
//       this.listeners.get(key)?.delete(listener)
//     }
//   }

//   subscribeToValue(path: string, cb: (value: any) => void, shouldNotify: boolean = true) {
//     if (!this.changeListeners.has(path)) {
//       this.changeListeners.set(path, new Set())
//     }

//     this.changeListeners.get(path)!.add(cb)

//     if (shouldNotify) {
//       const value = this.getValue(path)
//       if (value) cb(value)
//     }

//     return () => {
//       this.changeListeners.get(path)?.delete(cb)
//     }
//   }

//   private notify(key: string | string[]) {
//     // console.log("notifying input store", key, this.getValue(key))
//     if (isArray(key)) {
//       key.forEach(k => this.notify(k))
//       return
//     }

//     if (this.isBatching) {
//       this.pendingKeys.add(key)
//       return
//     }

//     this.listeners.get(key)?.forEach(l => l())
//     // this.listeners.get(key)?.forEach(l => {console.log("notifying input store", key);l()})
//   }

//   private notifyAll() {
//     this.listeners.forEach(i => i.forEach(l => l()))
//   }

//   batch(fn: () => void) {
//     this.isBatching = true
//     fn()
//     this.isBatching = false

//     this.pendingKeys.forEach(k => {
//       this.listeners.get(k)?.forEach(l => l())
//     })
//     this.pendingKeys.clear()
//   }



//   getSnapshot = () => {
//     return this.state
//   }

//   // private pendingInitialData: Record<string, any> | null = null
//   private pendingInitialData = new Map<string, any>()

//   getPendingInitialData(key: string) {
//     const value = this.pendingInitialData.get(key)
//     if (!value) return
//     this.pendingInitialData.delete(key)
//     return value
//   }

//   initializeInputStore(mode: "edit" | "default", initialData: Record<string, any>) {
//     this.state.inputData = {}
//     if (mode === "edit") this.isEditMode = true
//     if (isEmptyObject(initialData)) return
//     console.log("initializing input store", initialData)
//     this.pendingInitialData = new Map(Object.entries(initialData))
//   }

//   setBackgroundColor(color: string) {
//     // console.log("setBackgroundColor", color)
//     this.backgroundColor = color
//     if (this.mainContainer) {
//       this.mainContainer.style.setProperty("--line-bg", color)
//     }
//   }

//   setEditData(data: Record<string, any>) {       ////// this is not working when using SelectInput(when initial value do not match the option) as this runs after the component mounts and after the initial value is set. so when the initial value is not in option then also it sets value in store
//     if (!this.isEditMode) return
//     this.batch(() => {
//       this.state = {
//         inputData: structuredClone(data),
//         initialData: structuredClone(data),
//         editedKeys: new Set()
//       }
//       console.log("hydrating arrays", this.state.inputData)
//       this.collectKeys(data)
//     })
//   }

//   private collectKeys(
//     obj: Record<string, any>,
//     prefix = "",
//     paths: string[] = []
//   ) {
//     for (const key in obj) {
//       const value = obj[key]
//       const path = prefix ? `${prefix}.${key}` : key

//       if (
//         typeof value === "object" &&
//         value !== null &&
//         !Array.isArray(value)
//       ) {
//         this.collectKeys(value, path, paths)
//       } else if (isArray(value)) {
//         const arrayItor = []
//         // this.arrayItems.set(path, [...value])
//         // this.notify(path)
//         for (let i = 0; i < value.length; i++) {
//           arrayItor.push(i)
//           this.collectKeys(value[i], `${path}.${i}`, paths)
//         }
//         this.arrayIterator.set(path, arrayItor)
//         this.notify(path)
//       }
//       else {
//         if (this.listeners.has(path)) {
//           this.currentValue = value
//           this.notify(path) // queued because batching = true
//         }
//       }
//     }
//   }

//   setFieldInitialData(key: string, value: any, isDisabledInput?: boolean) {
//     this.setNestedValue(this.state.inputData, key, value)
//     // console.log("setting initial value", key, value)
//     if (isDisabledInput) {
//       console.log("setting initial value disabled", key, value)
//       this.setNestedValue(this.rawData, key, value)
//       return
//     } else {
//       this.setNestedValue(this.rawData, key, "")
//     }
//     if (this.isEditMode) {
//       this.setNestedValue(this.state.initialData, key, value)
//     }
//     this.currentValue = value
//     this.notify(key)
//   }

//   /* ---------------- REGISTER COMPUTED ---------------- */

//   registerComputed(
//     key: string,
//     deps: string[],
//     evaluate: (data: Record<string, any> | null) => boolean
//   ) {
//     return this.computedStore.registerComputed(key, deps, evaluate)
//   }

//   setValue(key: string, value: any) {
//     const inputData = this.state.inputData
//     if (!inputData) return
//     const prev = this.getNestedValue(inputData, key)
//     let nextValue = value
//     // const isDropdown = this.optionGraph.hasPath(key)
//     // if (isDropdown) {
//     // }
//     const isValid = this.optionGraph.doOptionExist(key, value)
//     // console.log("setting value", key, value, nextValue, isValid)
//     if (!isValid) nextValue = ""
//     if (prev === nextValue) return
//     this.setNestedValue(inputData, key, nextValue)
//     this.notify(key)
//     this.changeListeners.get(key)?.forEach(cb => cb(nextValue))
//     // if (!this.isEditMode) return
//     if (this.isEditMode) {
//       const initial = this.getNestedValue(this.state.initialData, key)
//       if (initial === undefined) this.setNestedValue(this.state.initialData, key, value)
//       const wasEdited = this.state.editedKeys.has(key)
//       const isEdited = value !== initial
//       if (isEdited) {
//         this.state.editedKeys.add(key)
//       }
//       else this.state.editedKeys.delete(key)
//       if (wasEdited !== isEdited) {
//         if (isEdited) {
//           this.styles.enable(key, 'edited')
//         } else {
//           this.styles.disable(key, 'edited')
//         }
//       }
//     }

//     const error = this.validator.validateField(
//       key,
//       value,
//       inputData
//     )

//     this.computedStore.trigger(key)
//   }

//   setSilentValue(key: string, value: any) {                  ////// SILENT. NO NOTIFICATION
//     this.setNestedValue(this.state.inputData, key, value)
//   }


//   getValue(key: string) {
//     // console.log("getting input store value", key)
//     return this.getNestedValue(this.state.inputData, key)
//     // console.log("getting input store value", key, value)
//     // return value
//   }

//   reset(key?: string | string[]) {
//     if (key) {
//       if (typeof key === "string") {
//         this.setValue(key, "")
//         return
//       }
//       if (isArray(key)) {
//         key.forEach(k => this.setValue(k, ""))
//         return
//       }
//     }
//     console.log("reset input store", this.rawData)
//     const data = structuredClone(this.rawData ?? {})
//     this.state = {
//       inputData: data,
//       initialData: this.isEditMode ? structuredClone(data) : null,
//       editedKeys: new Set()
//     }
//     this.currentValue = ""
//     // this.arrayItems.clear()
//     this.arrayIterator.clear()
//     this.arrayObject.clear()
//     this.sharedContext.clear()
//     this.notifyAll()
//     // console.log("reset input store success", this.arrayItems.size)
//   }

//   getRawData() {
//     return this.rawData
//   }

//   clear() {
//     this.state = {
//       inputData: null,
//       initialData: null,
//       editedKeys: new Set()
//     }
//     this.currentValue = ""
//     this.sharedContext.clear()
//     this.arrayObject.clear()
//     this.arrayIterator.clear()
//     // this.arrayItems.clear()
//   }

//   delete(key: string) {
//     const { [key]: _, ...rest } = this.state.inputData!
//     this.state.inputData = rest
//     // this.notify(key)
//   }

//   private setNestedValue(obj: any, path: string, value: any) {
//     const keys = path.split('.')
//     let curr = obj

//     for (let i = 0; i < keys.length - 1; i++) {
//       const key = keys[i]
//       const nextKey = keys[i + 1]

//       // Decide container type for current key
//       if (isIndex(key)) {
//         const index = Number(key)
//         if (!Array.isArray(curr)) {
//           throw new Error(`Expected array at ${keys.slice(0, i).join('.')}`)
//         }
//         curr[index] ??= isIndex(nextKey) ? [] : {}
//         curr = curr[index]
//       } else {
//         curr[key] ??= isIndex(nextKey) ? [] : {}
//         curr = curr[key]
//       }
//     }

//     const lastKey = keys.at(-1)!

//     if (isIndex(lastKey)) {
//       if (!Array.isArray(curr)) {
//         throw new Error(`Expected array at ${keys.slice(0, -1).join('.')}`)
//       }
//       curr[Number(lastKey)] = value
//     } else {
//       curr[lastKey] = value
//     }
//   }

//   private getNestedValue(obj: any, path: string) {
//     return path.split('.').reduce((curr, key) => {
//       if (curr == null) return undefined
//       return isIndex(key) ? curr[Number(key)] : curr[key]
//     }, obj)
//   }

//   private arrayItems = new Map<string, any[]>()   ////// path -> array items
//   private arrayObject = new Map<string, Set<any>>()
//   private arrayIterator = new Map<string, number[]>()

//   setArrayObject(path: string, value: string) {
//     if (!this.arrayObject.has(path)) {
//       this.arrayObject.set(path, new Set())
//     }
//     this.arrayObject.get(path)?.add(value)
//     console.log('the array object is', this.arrayObject.get(path), value)
//   }

//   getArrayItems(path: string) {
//     return this.arrayIterator.get(path)
//   }

//   getArrayLength(path: string) {
//     return this.arrayIterator.get(path)?.length ?? 0
//   }

//   addItorator(path: string, index: number) {
//     const prev = this.arrayIterator.get(path)
//     if (!isArray(prev)) return
//     if (index <= prev.length - 1) return
//     const next = [...prev, index]
//     this.arrayIterator.set(path, next)
//     // this.notify(path)
//   }

//   initArray(path: string, iterator: number[], initialValue?: Record<string, any>[]) {
//     // console.log('init array', path, iterator)
//     this.arrayIterator.set(path, iterator)
//     if (!initialValue) return
//     // this.addArrayItem(path, initialValue)
//     initialValue.forEach((element, index) => {
//       const keys = Object.keys(element)
//       keys.forEach(key => {
//         this.setSilentValue(`${path}.${index}.${key}`, element[key])
//       })
//     })
//   }


//   replaceArray(path: string, items: Record<string, any>[]) {
//     const currentItor = this.arrayIterator.get(path)
//     if (!currentItor) return
//     const iterator: number[] = []
//     const prevItorSize = currentItor.length
//     const prevArrKeys = this.arrayObject.get(path)
//     this.batch(() => {
//       items!.forEach((value, index) => {
//         if (index < prevItorSize) {
//           prevArrKeys?.forEach((val) => {
//             this.setValue(`${path}.${index}.${val}`, value[val])
//           })
//         } else {
//           prevArrKeys?.forEach((val) => {
//             this.setSilentValue(`${path}.${index}.${val}`, value[val])
//           })
//         }
//         // this.addItorator(path, index)
//         iterator.push(index)
//       })
//       this.arrayIterator.set(path, iterator)
//       this.notify(path)
//     })
//   }

//   addArrayItem(path: string, initialValue?: Record<string, any>[], repeat: number = 1) {
//     // console.log('add array item', path, repeat)
//     const currentItor = this.arrayIterator.get(path)
//     if (!currentItor) return
//     const prevItorSize = currentItor.length
//     const newItorArr: number[] = [...currentItor]

//     const prevArrKeys = this.arrayObject.get(path)
//     this.batch(() => {
//       for (let i = 0; i < repeat; i++) {
//         const newIndex = prevItorSize + i
//         newItorArr.push(newIndex)
//         prevArrKeys?.forEach((key) => {
//           this.setSilentValue(`${path}.${newIndex}.${key}`, initialValue?.[i]?.[key] ?? "")
//         })
//       }
//       this.arrayIterator.set(path, newItorArr)
//       this.notify(path)
//     })
//   }

//   addArrayItems(
//     path: string,
//     items: Record<string, any> | Record<string, any>[],
//     type: 'append' | 'replace' = 'append'
//   ) {
//     const data = this.state.inputData
//     if (!data) return

//     const prev = this.getValue(path) ?? []

//     const itemsArray = isArray(items) ? items : [items]

//     this.batch(() => {
//       let next: Record<string, any>[]

//       // 🔥 REPLACE
//       if (type === 'replace') {
//         next = itemsArray
//       }
//       // 🔥 APPEND
//       else {
//         next = [...prev, ...itemsArray]
//       }

//       // ✅ set full array
//       this.setSilentValue(path, next)

//       // ✅ update iterator (derived)
//       const nextIterator = Array.from({ length: next.length }, (_, i) => i)
//       this.arrayIterator.set(path, nextIterator)

//       // 🔥 notify only NEW items (important optimization)
//       if (type === 'append') {
//         const startIndex = prev.length

//         for (let i = startIndex; i < next.length; i++) {
//           const item = next[i]

//           for (const key in item) {
//             this.notify(`${path}.${i}.${key}`)
//           }
//         }
//       }

//       // 🔥 for replace → notify everything
//       else {
//         for (let i = 0; i < next.length; i++) {
//           const item = next[i]

//           for (const key in item) {
//             this.notify(`${path}.${i}.${key}`)
//           }
//         }
//       }

//       // 🔥 structure update
//       this.notify(path)
//     })
//   }

//   getArrayKeys(path: string) {
//     return this.arrayObject.get(path) ?? []
//   }

//   getArrayKeySize(path: string) {
//     return this.arrayObject.get(path)?.size ?? 0
//   }

//   removeArrayItem(path: string, index: number) {
//     const arrData = this.getValue(path)
//     if (!isArray(arrData)) return

//     const prev = this.arrayIterator.get(path)
//     if (!prev) return

//     const next = prev.slice(0, -1)
//     // this.arrayIterator.set(path, next)

//     const length = prev.length

//     this.batch(() => {
//       // 🔥 if last index → simple pop
//       if (index === length - 1) {
//         if (index === 0) {
//           for (const key in arrData[0]) {
//             this.setValue(`${path}.0.${key}`, "")
//           }
//           return
//         }
//         arrData.pop()
//         this.setSilentValue(path, arrData)

//         // this.arrayIterator.set(path, arrData.map((_, i) => i))
//         this.arrayIterator.set(path, next)

//         this.notify(path)
//         return
//       }

//       // 🔥 remove + shift
//       const newData = arrData.filter((_, i) => i !== index)

//       this.setSilentValue(path, newData)

//       // 🔥 notify shifted fields only
//       for (let i = index; i < newData.length; i++) {
//         for (const key in newData[i]) {
//           this.notify(`${path}.${i}.${key}`)
//         }
//       }

//       // 🔥 update iterator
//       // this.arrayIterator.set(path, newData.map((_, i) => i))
//       this.arrayIterator.set(path, next)

//       this.notify(path)
//     })
//   }

//   popArrayItem(path: string, iterator?: number[]) {
//     const prev = iterator ?? this.arrayIterator.get(path)
//     // console.log('going to pop item')
//     if (!isArray(prev)) return
//     const next = prev.slice(0, -1)
//     this.arrayIterator.set(path, next)
//     this.notify(path)
//     const arrData = this.getValue(path)
//     if (!isArray(arrData)) return
//     arrData.pop()
//   }

//   private submitHandler: null | ((e?: any) => void | Promise<void>) = null

//   registerSubmit(handler: (e?: any) => void | Promise<void>) {
//     this.submitHandler = handler
//   }

//   unregisterSubmit() {
//     this.submitHandler = null
//   }

//   triggerSubmit(e?: any) {
//     this.submitHandler?.(e)
//   }
// }