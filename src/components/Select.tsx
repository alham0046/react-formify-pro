import React, { memo, useCallback } from 'react'
import { useInputValue } from '../hooks/ExternalSyncHooks'
import type { DropdownFieldType } from '../store/DropdownStore'

const Select : React.FC<{options: {label: string, value: any}[], field: DropdownFieldType}> = ({options, field}) => {
    const value = useInputValue(field)
    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        field.value = e.target.value
    }, [field])
    return (
        <select value={value} onChange={handleChange} className='select-input'>
            {options.map((option) => (
                <option key={option.value} value={option.value} className='select-option'>
                    {option.label}
                </option>
            ))}
        </select>
    )
}

export default memo(Select)
