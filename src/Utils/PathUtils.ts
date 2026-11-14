// getNodePath.ts

import { ArrayField, ArrayItem } from "../store/ArrayStore"
import { FormObject } from "../store/FormObject"
import { InputForm } from "../store/InputFormStore"



export function getNodePath(node: any): string {

    if (node instanceof InputForm) {
        return ""
    }

    if (node instanceof ArrayItem) {

        const parentPath = getNodePath(node.array)

        const index = node.index

        return parentPath
            ? `${parentPath}.${index}`
            : String(index)
    }

    if (node instanceof FormObject) {

        const parentPath = getNodePath(node.parent)

        return parentPath
            ? `${parentPath}.${node.name}`
            : node.name
    }

    if (node instanceof ArrayField) {

        const parentPath = getNodePath(node.parent)

        return parentPath
            ? `${parentPath}.${node.name}`
            : node.name
    }

    return ""
}


// utils/setByDotPath.ts
export function setByDotPath(target: Record<string, any>, path: string, value: any): void {
  const keys : string[] = path.split(".")
  let current = target

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    const nextKey = keys[i + 1]

    if (key === undefined || key === null) continue

    if (!(key in current) || typeof current[key] !== "object" || current[key] === null) {
      // Create an array if the next segment is a numeric index, otherwise an object
      current[key] = !isNaN(Number(nextKey)) ? [] : {}
    }
    current = current[key]
  }

  current[keys[keys.length - 1]!] = value
}