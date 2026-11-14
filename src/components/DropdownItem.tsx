import React, { memo } from 'react'
import type { DropdownFieldType } from '../store/DropdownStore'

interface DropdownItemProps {
    field: DropdownFieldType
    option: { label: string, value: string }
    isSelected: boolean
    handleRef: (el: HTMLDivElement) => void
    onClick: (value: string) => void
    onMouseEnter: () => void
}

const DropdownItem: React.FC<DropdownItemProps> = ({ field, option, isSelected, handleRef, onClick, onMouseEnter }) => {
    const optionLabel = option.label
    return (
        <div
            key={optionLabel}
            role="option"
            aria-selected={isSelected}
            ref={el => {
                if (!el) return
                handleRef(el)
                // field.setElement(option.label, el!)
            }}
            onMouseEnter={onMouseEnter}
            className={`select-option ${isSelected ? 'previously-selected-option' : ''}`}
            onClick={() => onClick(option.value)}
        >
            {optionLabel}
        </div>
    )
}

export default memo(DropdownItem)












// import React, { memo } from 'react'
// import type { BaseDropdownProps, DropdownOption } from './BaseDropdown'

// interface DropdownItemProps {
//     item: string | DropdownOption
//     index: number
//     highlighted?: boolean
//     isSelected: boolean
//     register: (el: HTMLDivElement | null) => void
//     renderItem: BaseDropdownProps["renderItem"]
//     updateHighlight: (index: number) => void
// }

// const DropdownItem: React.FC<DropdownItemProps> = ({ item, index, highlighted=false, register, renderItem, updateHighlight, isSelected }) => {
//     return (
//         <>
//             {renderItem(item, index, highlighted, register, () => updateHighlight(index), isSelected)}
//         </>
//     )
// }

// export default memo(DropdownItem)
