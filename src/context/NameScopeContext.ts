// NameScopeContext.ts
// import { createContext, useContext } from "react";

// export const NameScopeContext = createContext<string | null>(null);

// export const useNameScope = () => useContext(NameScopeContext);


// NameScopeContext.ts
import { createContext, useContext } from "react";
import type { FormNodeType } from "../store/FormNode";
import type { ArrayItemType } from "../store/ArrayStore";
import type { FormObjectType } from "../store/FormObject";

export interface NameScopeContextProps {
    // parent: string;
    // parentIndex : number
    // parentKey : string
    // parentType : string
    // node: FormNodeType
    node : ArrayItemType | FormObjectType
}

// export const NameScopeContext = createContext<string | null>(null);
export const NameScopeContext = createContext<NameScopeContextProps | null>(null);

export const useNameScope = () => useContext(NameScopeContext);
