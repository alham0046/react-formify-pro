// import { type FC, memo, useCallback, useEffect, useRef } from "react";
// import { type DropdownStyleProp, type TWDropdownStyleProp, type TWInputStyleProp } from "../typeDeclaration/stylesProps";
// // import { createPortal } from 'react-dom'
// import type { InputStyle } from "./InputTemplate";
// import RotatingDropdown, { type RotatingDropdownRef } from "../Icons/RotatingDropdown";
// import DropdownLabel from "./DropdownLabel";
// import type { DropdownFieldType } from "../store/DropdownStore";
// import { useIsOpen } from "../hooks/ExternalSyncHooks";
// import DropdownOptions from "./DropdownOptions";


// interface DropdownOption {
//     label: string;
//     value: string;
// }
// interface DropdownModalProps {
//     // options: DropdownOption[];
//     // options: {optionsList: DropdownOption[], valueToLabel : Map<string, string>}
//     onSelect: (value: string) => void;
//     disabled: boolean;
//     field: DropdownFieldType
//     searchable: boolean;
//     initialLabel?: string
//     rotateRef: React.RefObject<RotatingDropdownRef | null>
//     // style: StyleProp
//     style: Partial<InputStyle & DropdownStyleProp>
//     twStyle: Partial<TWDropdownStyleProp & TWInputStyleProp>
//     name: string;
//     onToggleDropdown?: (isOpen: boolean) => void;
//     modalContainerRef?: React.RefObject<HTMLDivElement>;
//     // You should typically pass the current value in as a prop for a controlled component
//     initialValue?: string;
// }

// const DropdownModal: FC<DropdownModalProps> = ({
//     // options,
//     field,
//     onSelect,
//     onToggleDropdown,
//     disabled,
//     searchable,
//     initialLabel,
//     rotateRef,
//     name,
//     style,
//     twStyle
// }) => {
//     // const isOpen = useIsOpen(field)
    
//     const inputRef = useRef<HTMLDivElement>(null);

//     const popoverId = `dropdown-id-${field.name}`

//     const handleOptionSelect = useCallback((option: DropdownOption) => {
//         const selectedValue = option.value;
//         console.log('closing dropdown 3')
//         // console.log('selected value', option, isOpen)
//         onSelect(selectedValue);
//         closeDropdown();
//         // setLabel(selectedValue)
//     }, [onSelect]);

//     const openDropdown = useCallback(() => {
//         if (field._disabled) return
//         field.open()
//     }, [field])
    
//     const closeDropdown = useCallback(() => {
//         field.close()
//     }, [field])

//     const toggleDropdown = useCallback(() => {
//         field.toggle()
//     }, [field])

//     // useEffect(() => {
//     //     // console.log('dropdown state changed', isOpen)
//     //     onToggleDropdown?.(isOpen);
//     //     if (!isOpen) {
//     //         // inputStore.optionGraph.setSearch(name, "")
            
//     //     }
//     // }, [isOpen])

//     const handleTabToOpen = useCallback((e : React.FocusEvent<HTMLDivElement>) => {
//         if (!e.relatedTarget && document.activeElement === e.target) {
//             // If it's a window refocus, don't open the dropdown again if it's already closed intentionally
//             // You can just return early, or add a state check.
//         return;
//         }
//         openDropdown()
//     },[])

//     // useEffect(() => {
//     //     if (isOpen) {
//     //       console.log('focus', inputRef.current)
//     //       inputRef.current?.focus()
//     //     //   inputRef.current.focu
//     //     } 
//     //   }, [isOpen])


//     return (
//         <div className="select-container">
//             <button
//                 type="button"
//                 popoverTarget={popoverId}
//                 className="select-label"
//                 disabled={field._disabled}
//                 >
//                 <DropdownLabel field={field} />
//             </button>

//             <div
//                 id={popoverId}
//                 popover="auto"
//                 className="select-options-container"
//                 // style={{border : '1px solid red'}}
//             >
//                 <DropdownOptions field={field} />
//             </div>
//         </div>
//     )
// }

// export default memo(DropdownModal)





import { type FC, memo, useCallback, useRef } from "react";
import DropdownLabel from "./DropdownLabel";
import type { DropdownFieldType } from "../store/DropdownStore";
import type { DropdownDependencyFieldType } from "../store/DropdownDepStore";
import DropdownOpen from "./DropdownOpen";
import type { OnBlur } from "../typeDeclaration/baseProps";


interface DropdownModalProps {
    field: DropdownFieldType | DropdownDependencyFieldType
    searchable: boolean;
    // onToggleDropdown?: (isOpen: boolean) => void;
    onBlur?: OnBlur
    onFocus?: (key: string) => void
}

const DropdownModal: FC<DropdownModalProps> = ({
    field,
    onBlur,
    onFocus,
    searchable,
}) => {
    // const isOpen = useIsOpen(field)

    // const disabled = useIsDisabled(field)
    
    const inputRef = useRef<HTMLDivElement>(null);

    const openDropdown = useCallback(() => {
        if (field._disabled) return
        // console.log('tab to open')
        field.open()
    }, [])
    
    const closeDropdown = useCallback(() => {
        field.close()
    }, [])

    const handleTabKey = useCallback((e : React.KeyboardEvent<HTMLDivElement>) => {
        console.log('the pressed key is', e.key)
        if (e.key === "Enter") {
            openDropdown()
        //   closeDropdown()
        //   onBlur?.({value: field.value, data: field.root.data as Record<string, any>, setFields : field.setFields, arrayAction : field.getArray})
        //   console.log('tab to close')
          return // allow normal tab navigation
        }
    },[])

    const handleTabToOpen = useCallback((e : React.FocusEvent<HTMLDivElement>) => {
        if (!e.relatedTarget && document.activeElement === e.target) {
            return;
        }
        // 1. Ignore if focus came from inside the dropdown container
        // if (e.currentTarget.contains(e.relatedTarget as Node)) {
        //   return
        // }
    
        // 2. Ignore bubbled focus events from children (like the autoFocus search input)
        // Only the container itself should trigger opening when navigated to via keyboard
        // if (e.target !== e.currentTarget) {
        //   return
        // }
        console.log('tab to open')
        onFocus?.(field.name)
        openDropdown()
    },[])

    return (
        <div
            ref={(el) => {
                if (!el) return
                field.el = el
                // const mainRef = field.inputref;
                // if (mainRef) mainRef.current = el;
                inputRef.current = el
            }}
            onMouseDown={(e) => e.preventDefault()}
            onFocus={handleTabToOpen}
            onKeyDown={handleTabKey}
            tabIndex={0} // Makes the div focusable for keyboard navigation
            className={`select-container`}
        >
            {/* {console.log('rendering dropdown modal with options', name)} */}
            <DropdownLabel field={field} />
            <DropdownOpen field={field} inputRef={inputRef} searchable={searchable} />
            {/* {isOpen && (
                <DropdownOptions field={field} searchable={searchable} parentRef={inputRef} />
            )} */}
        </div>
    )
}

export default memo(DropdownModal)














// import { type FC, memo, useCallback, useEffect, useRef } from "react";
// import { type DropdownStyleProp, type TWDropdownStyleProp, type TWInputStyleProp } from "../typeDeclaration/stylesProps";
// // import { createPortal } from 'react-dom'
// import type { InputStyle } from "./InputTemplate";
// import BaseDropdown from "./BaseDropdown";
// import RotatingDropdown, { type RotatingDropdownRef } from "../Icons/RotatingDropdown";
// import { useContainerContext } from "../context/ContainerContext";
// import DropdownLabel from "./DropdownLabel";
// import { useIsOpen } from "../hooks/useIsDropdownOpen";


// interface DropdownOption {
//     label: string;
//     value: string;
// }
// interface DropdownModalProps {
//     // options: DropdownOption[];
//     // options: {optionsList: DropdownOption[], valueToLabel : Map<string, string>}
//     onSelect: (value: string) => void;
//     disabled: boolean;
//     searchable: boolean;
//     initialLabel?: string
//     rotateRef: React.RefObject<RotatingDropdownRef | null>
//     // style: StyleProp
//     style: Partial<InputStyle & DropdownStyleProp>
//     twStyle: Partial<TWDropdownStyleProp & TWInputStyleProp>
//     name: string;
//     onToggleDropdown?: (isOpen: boolean) => void;
//     modalContainerRef?: React.RefObject<HTMLDivElement>;
//     // You should typically pass the current value in as a prop for a controlled component
//     initialValue?: string;
// }

// const DropdownModal: FC<DropdownModalProps> = ({
//     // options,
//     onSelect,
//     onToggleDropdown,
//     disabled,
//     searchable,
//     initialLabel,
//     rotateRef,
//     name,
//     style,
//     twStyle
// }) => {
//     // const rotateRef = useRef<RotatingDropdownRef | null>(null)
//     const {inputStore} = useContainerContext()
//     // const [isOpen, setIsOpen] = useState(false);
//     const isOpen = useIsOpen(inputStore, name)
//     // const [label, setLabel] = useState(value ||'Select an Option');
//     const {inputInlineStyle, dropdownOffset} = style
//     const {twOptionItemStyles, twInputStyles,twOptionBoxStyles="", twSelectedStyles} = twStyle
//     // console.log('inside dropdownmodal', isOpen)
    
//     const inputRef = useRef<HTMLDivElement>(null);

//     const handleOptionSelect = useCallback((option: DropdownOption) => {
//         const selectedValue = option.value;
//         console.log('closing dropdown 3')
//         // console.log('selected value', option, isOpen)
//         onSelect(selectedValue);
//         closeDropdown();
//         // setLabel(selectedValue)
//     }, [onSelect]);

//     const openDropdown = useCallback(() => {
//     //   if (isOpen) return
//     //   if (disabled) return
//     //   rotateRef.current?.open()
//       inputStore.optionGraph.open(name, rotateRef, disabled)
//     //   setIsOpen(true)
//     }, [isOpen, disabled])
    
//     const closeDropdown = useCallback(() => {
//         // console.log('closing dropdown 2')
//         // rotateRef.current?.close()
//     //   setIsOpen(false)
//         inputStore.optionGraph.close(name, rotateRef)
//     }, [isOpen])

//     useEffect(() => {
//         // console.log('dropdown state changed', isOpen)
//         onToggleDropdown?.(isOpen);
//         if (!isOpen) {
//             inputStore.optionGraph.setSearch(name, "")
            
//         }
//     }, [isOpen])

//     const handleTabToOpen = useCallback((e : React.FocusEvent<HTMLDivElement>) => {
//         if (!e.relatedTarget && document.activeElement === e.target) {
//             // If it's a window refocus, don't open the dropdown again if it's already closed intentionally
//             // You can just return early, or add a state check.
//         return;
//         }
//         openDropdown()
//     },[])

//     useEffect(() => {
//         if (isOpen) {
//           console.log('focus', inputRef.current)
//           inputRef.current?.focus()
//         //   inputRef.current.focu
//         } 
//       }, [isOpen])


//     return (
//         <div
//             ref={inputRef}
//             onClick={(e) => {
//               e.stopPropagation()
//               console.log('inside onclick open')
//             inputStore.optionGraph.toggleOpen(name, rotateRef, disabled)
//             }}

//             onMouseDown={(e) => e.preventDefault()}
//             onFocus={handleTabToOpen}
//             onKeyDown={(e) => {
//               if (e.key === "Tab") {
//                 closeDropdown()
//                 return // allow normal tab navigation
//               }
//             }}
//             tabIndex={0} // Makes the div focusable for keyboard navigation
//             className={`relative outline-none`}
//         >
//             {console.log('rendering dropdown modal with options', name)}
//             <DropdownLabel initialLabel={initialLabel} name={name} twInputStyles={twInputStyles} inputInlineStyle={inputInlineStyle} inputStore={inputStore} />
//             <div className="absolute right-4 top-1/2 transform -translate-y-1/2"><RotatingDropdown ref={rotateRef} /></div>
//             {isOpen && (
//                 <BaseDropdown
//                     open={isOpen}
//                     name={name}
//                     twOptionBoxStyles={twOptionBoxStyles}
//                     close={closeDropdown}
//                     onSelect={(opt) => {
//                       handleOptionSelect(opt as DropdownOption)
//                     }}
//                     // position={position}
//                     inputRef={inputRef}
//                     dropdownOffset={dropdownOffset}
//                     searchable={searchable}
//                     renderItem={(opt, index, highlighted, ref, onHover, isSelected) => {
//                         const option = opt as DropdownOption
//                         // console.log('rendering drpdown option', option)
//                         return (
//                         <div
//                           key={option.value}
//                           ref={ref}
//                           onMouseEnter={onHover}
//                           className={`${twOptionItemStyles} ${isSelected ? twSelectedStyles : ""}`}
//                           onClick={(e) => {
//                             e.preventDefault()
//                             handleOptionSelect(option)
//                         }}
//                         >
//                           {option.label}
//                         </div>
//                     )
//                 }}
//                 />
//             )}
//             {/* {isOpen && dropdownPanel} */}
//         </div>
//     )
// }

// export default memo(DropdownModal)