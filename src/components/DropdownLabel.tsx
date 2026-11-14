import React, { memo, useCallback } from 'react'
import { useDropdownLabel } from '../hooks/ExternalSyncHooks'
import type { DropdownFieldType } from '../store/DropdownStore'
import type { DropdownDependencyFieldType } from '../store/DropdownDepStore'

interface DropdownLabelProps {
    field: DropdownFieldType | DropdownDependencyFieldType
    // name: string
    // initialLabel?: string
    // twInputStyles?: string
    // inputInlineStyle?: React.CSSProperties
    // inputStore: InputStore
}

const DropdownLabel: React.FC<DropdownLabelProps> = ({ field }) => {
    // const {inputStore} = useContainerContext()
    const label = useDropdownLabel(field)
    const toggleDropdown = useCallback(() => {
        field.toggle()
    }, [field])
    // console.log('the label is', label)
    // const value = useInputStore(name, inputStore)
    return (
        <div
            className={`select-label field-input`}
            onClick={toggleDropdown}
        >
            {label}
        </div>
    )
}

export default memo(DropdownLabel)
