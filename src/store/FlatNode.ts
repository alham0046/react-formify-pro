import { ArrayController } from "../typeDeclaration/arrayProps";
import { resolveTargetNode } from "../Utils/NodeResolver";
import { ArrayField, ArrayItem } from "./ArrayStore";
import { FormNode } from "./FormNode";

export abstract class FlatNode extends FormNode {
    public getArray(path?: string): (ArrayController & { currentIndex?: number }) | undefined {
        // 1. Walk up to find the nearest enclosing ArrayItem (handles nested ObjectContainer inside ArrayItem)
        let curr: any = (this as any).parent
        let enclosingItem: ArrayItem | undefined
        while (curr) {
            if (curr instanceof ArrayItem) {
                enclosingItem = curr
                break
            }
            curr = curr.parent
        }

        const currentIndex = enclosingItem?.index

        // 2. If no path is provided, target the enclosing array directly
        const targetArray = !path
            ? enclosingItem?.array
            : resolveTargetNode(this as any, path)

        if (!(targetArray instanceof ArrayField)) return undefined

        // 3. Inherit live getters (like `length`) from controller without cloning methods
        const scopedController = Object.create(targetArray.controller)
        scopedController.currentIndex = currentIndex
        return scopedController
    }
}