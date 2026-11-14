import type { AnyFieldNode } from "../typeDeclaration/nodeProps"
import type { ArrayFieldType } from "./ArrayStore"
import { FormNode } from "./FormNode"
import type { FormObjectType } from "./FormObject"
import type { InputFieldType } from "./InputFieldStore"

// store/ContainerNode.ts
export abstract class ContainerNode<TParent = any> extends FormNode {
  public abstract readonly data: Record<string, any>
  public readonly fields = new Map<string, AnyFieldNode>()

  /**
   * Universal recursive populator used by Root, FormObject, and ArrayItem
   */
  populate(initialData?: Record<string, any>) {
    if (!initialData || typeof initialData !== "object") return

    for (const [name, value] of Object.entries(initialData)) {
      if (Array.isArray(value)) {
        const array = this.createArray(name)
        for (const item of value) {
          array.addItem({ initialValue: item })
        }
        continue
      }

      if (value !== null && typeof value === "object") {
        const object = this.createObject(name)
        object.populate(value) // Recursion handles any depth
        continue
      }

      this.createField(name, value)
    }
  }

  abstract createField(name: string, initialValue?: any): InputFieldType
  abstract createObject(name: string): FormObjectType
  abstract createArray(name: string): ArrayFieldType
}