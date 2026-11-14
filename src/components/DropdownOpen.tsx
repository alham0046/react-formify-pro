import React from 'react'
import type { DropdownDependencyFieldType } from '../store/DropdownDepStore'
import type { DropdownFieldType } from '../store/DropdownStore'
import { useIsOpen } from '../hooks/ExternalSyncHooks'
import DropdownOptions from './DropdownOptions'

interface DropdownOpenProps {
    field: DropdownFieldType | DropdownDependencyFieldType
    inputRef: React.RefObject<HTMLDivElement | null>
    searchable: boolean
}

const DropdownOpen: React.FC<DropdownOpenProps> = ({ field, inputRef, searchable }) => {
    const isOpen = useIsOpen(field)
    if (!isOpen) return null
    return (
        <DropdownOptions field={field} searchable={searchable} parentRef={inputRef} />
    )
}

export default DropdownOpen
