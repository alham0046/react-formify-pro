import React, { memo, useMemo, type ReactNode } from 'react'
import type { ArrayItemType } from '../store/ArrayStore'
import type { FormObjectType } from '../store/FormObject'
import { NameScopeContext } from '../context/NameScopeContext'

interface NodeProviderProps {
    node: ArrayItemType | FormObjectType
    children: ReactNode
}

const ItemNodeProvider: React.FC<NodeProviderProps> = ({ node, children }) => {
    const value = useMemo(() => ({ node }), [node])
    return (
        <NameScopeContext value={value}>{children}</NameScopeContext>
    )
}

export default memo(ItemNodeProvider)
