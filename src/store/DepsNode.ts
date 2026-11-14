import type { DependencyStoreType } from "./DependencyStore"

export class DepsNode {

    public readonly dependency : DependencyStoreType

    constructor(dependency: DependencyStoreType) {
        this.dependency = dependency
    }

}

export type DependencyType = DepsNode