// Utils/nodeResolver.ts

import { ArrayField, type ArrayItem } from "../store/ArrayStore"
import type { FormObject} from "../store/FormObject"
import type { InputField } from "../store/InputFieldStore"
import type { InputForm } from "../store/InputFormStore"
import type { AnyFieldNode, FlatFieldNode } from "../typeDeclaration/nodeProps"

/**
 * Resolves any target node from an arbitrary starting node.
 * Supports:
 * - Root paths:      "/user.profile.city"
 * - Parent climbing: "../../place.city"
 * - Array indices:   "../items.1.code" or "../items.[1].code"
 * - Local siblings:  "city"
 */

type CurrentNodeType = AnyFieldNode | InputForm | ArrayItem | undefined
// type CurrentNodeType = AnyFieldNode | InputFormType | ArrayItemType | undefined
type NodeWithFieldType = ArrayItem | FormObject | InputForm

export function resolveTargetNode(startNode: FlatFieldNode | InputForm, path: string): AnyFieldNode | undefined {
    if (!path) return undefined

    // let current: InputFormType | FormObjectType | ArrayItemType | undefined
    let current: CurrentNodeType

    // 1. Root Escape
    if (path.startsWith('/')) {
        current = startNode.root
        path = path.slice(1)
    } else {
        // Relative paths start at the parent container (ArrayItem, FormObject, or Root)
        current = startNode.parent ?? startNode
    }

    const walkUp = path.split('/')
    const tokenPostion = walkUp.length - 1
    const tokens = walkUp[tokenPostion].split('.')

    if (tokenPostion > 0) {
        for (let i = 0; i < tokenPostion; i++) {
            current = current?.parent ?? current
        }
    }

    for (let i = 0; i < tokens.length; i++) {
        if (!current) return undefined
        const token = tokens[i]

        // Step DOWN (Array index)
        if (current instanceof ArrayField) {
            if (!isNaN(Number(token))) {
                // if (!(current instanceof ArrayField)) return undefined
                const idx = Number(token)
                current = (current as ArrayField).items[idx]
                continue
            }
        } else {
            current = (current as NodeWithFieldType)?.fields.get(token)
        }
    }

    return current as AnyFieldNode | undefined
}







// // Utils/nodeResolver.ts

// import { ArrayField, type ArrayItemType } from "../store/ArrayStore"
// import type { FormObjectType } from "../store/FormObject"
// import type { InputFieldType } from "../store/InputFieldStore"
// import type { InputFormType } from "../store/InputFormStore"

// export type FlatFieldNode = InputFieldType // or your FlatField union
// export type ContainerFieldNode = ArrayField | FormObjectType
// export type AnyFieldNode = FlatFieldNode | ContainerFieldNode

// type TraversableNode = AnyFieldNode | InputFormType | ArrayItemType

// export function resolveTargetNode(startNode: InputFieldType, path: string): AnyFieldNode | undefined {
//     if (!path) return undefined

//     let current: TraversableNode | undefined

//     // 1. Root Escape
//     if (path.startsWith('/')) {
//         current = startNode.root
//         path = path.slice(1)
//     } else {
//         // Relative paths start at parent container
//         current = (startNode.parent ?? startNode) as TraversableNode
//     }

//     const walkUp = path.split('/')
//     const tokenPosition = walkUp.length - 1
//     const tokens = walkUp[tokenPosition].split('.')

//     // Step UP
//     if (tokenPosition > 0) {
//         for (let i = 0; i < tokenPosition; i++) {
//             current = (current as any)?.parent ?? current
//         }
//     }

//     // Step DOWN
//     for (let i = 0; i < tokens.length; i++) {
//         if (!current) return undefined
//         const token = tokens[i]

//         // Case A: Downward into Array Index
//         if (current instanceof ArrayField) {
//             const idx = Number(token)
//             if (!isNaN(idx)) {
//                 current = current.items[idx]
//                 continue
//             }
//             return undefined
//         }

//         // Case B: Downward into Object / Map Field
//         if ('fields' in current && current.fields instanceof Map) {
//             // Explicitly cast to AnyFieldNode to keep ArrayField in the type union
//             current = current.fields.get(token) as AnyFieldNode | undefined
//         } else {
//             return undefined
//         }
//     }

//     return current as AnyFieldNode | undefined
// }