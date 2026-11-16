import {forwardRef, memo, useImperativeHandle, useMemo, useRef, type CSSProperties } from 'react';
// import { useSelectOptions } from '../hooks/useSelectOptions';
import InputTemplate from './InputTemplate';
import DropdownModal from './DropdownModal';
import { useContainerContext } from '../context/ContainerContext';
import type { DropdownRefType, SelectProps } from '../typeDeclaration/dropdownProps';
import { getStyleClass } from '../Utils/StyleInjection';
// import { useDropdownField } from '../hooks/useField';
import type { DropdownFieldType } from '../store/DropdownStore';
import { useIsHidden } from '../hooks/ExternalSyncHooks';
import { useNameScope } from '../context/NameScopeContext';
import { createDropdown } from '../Utils/DropdownUtils';

const SelectInput= forwardRef<DropdownRefType, SelectProps>((props, ref) => {
    const {
    name,
    placeholder,
    options,
    children,
    onChange,
    onToggleDropdown,
    includeDefaultLabel = false,
    initialLabel = 'Select',
    disabled = false,
    hideElement = false,
    searchable = false,
    initialValue = '',
    style,
    className = '',
    ...rest
} = props
    const {inputStore} = useContainerContext()
    const scope = useNameScope()

    const anchorName = useRef(
        `--field-anchor-${crypto.randomUUID()}`
    ).current;

    // const hasRendered = useRef<boolean>(false)
    // let field : InputFieldType | null = null
    const field = useRef<DropdownFieldType | null>(null)
    if (field.current === null) {
        const fieldInstance = createDropdown(
                placeholder,
                name,
                options,
                inputStore,
                initialValue,
                initialLabel,
                includeDefaultLabel,
                scope
        ) as DropdownFieldType
        // fieldInstance.displayCode = 'SelectInput'
        hideElement && inputStore.registerHidden(fieldInstance, hideElement)
        disabled && inputStore.registerDisabled(fieldInstance, disabled)
        fieldInstance.subscribe(() => {
            // const setFields = inputStore.setFields
            onChange?.({
                value : fieldInstance.value,
                setFields : (fields: Record<string, any>) => fieldInstance.setFields(fields),
                arrayAction : (path?: string) => fieldInstance.getArray(path),
                reset: (target?: string | string[]) => fieldInstance.reset(target)
            })
        })

        fieldInstance.subscribeToggle(() => {
            onToggleDropdown?.(fieldInstance.isOpen)
        })
        field.current = fieldInstance
        // hasRendered.current = true
    }
    // if (!hasRendered.current) {
    //     field.current = useDropdownField(
    //             placeholder,
    //             name,
    //             options,
    //             inputStore,
    //             initialValue,
    //             initialLabel,
    //             includeDefaultLabel
    //     ) as DropdownFieldType
    //     hideElement && inputStore.registerHidden(field.current, hideElement)
    //     disabled && inputStore.registerDisabled(field.current, disabled)
    //     field.current.subscribe(() => {
    //         const setFields = inputStore.setFields
    //         onChange && onChange({value : field.current?.value, setFields})
    //     })
    //     hasRendered.current = true
    // }

    
        
    const styleClass = useMemo(() => {
        return getStyleClass(style)
    }, [style])

    useImperativeHandle(
        ref,
        () => ({
            open: () => setTimeout(() => {
                field.current?.open()
            }, 0),
            close: () => setTimeout(() => {
                field.current?.close()
            }, 0),
        }), [])

    const hiddenValue: boolean = useIsHidden(field.current!)

    // console.log('the selectinput rerendering', hiddenValue)
    
    if (hiddenValue) {
        return null;
    }

    return (
            // <div className={`field-root field-select-root ${styleClass} ${className}`} style={{'--float' : 1, '--anchor-name': `${field.current!.name}`}}>
            <div className={`field-root field-select-root ${styleClass} ${className}`} style={{'--float' : 1, '--anchor-name': `${anchorName}`} as CSSProperties}>
                {/* {console.log('rendering StrInput', modifiedName)} */}
                <InputTemplate
                    name={field.current!.name}
                    placeholder={placeholder}
                >
                    {/* <Select options={field.current!.options} field={field.current!} /> */}
                    <DropdownModal
                        searchable={searchable}
                        field={field.current!}
                        {...rest}
                        // onToggleDropdown={onToggleDropdown}
                    />
                </InputTemplate>
                {children}
            </div>
    );
})

// export default memo(SelectInput, (prev, next) => prev.name === next.name);
// const MemoizedSelectInput = memo(SelectInput, (prev, next) => prev.placeholder === next.placeholder)
const MemoizedSelectInput = memo(SelectInput)
MemoizedSelectInput.displayName = 'SelectInput';
export default MemoizedSelectInput;















// import {forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react';
// import { useComputedExpression } from '../hooks/useComputedExpression';
// import { useFieldName } from '../hooks/useFieldName';
// // import { useSelectOptions } from '../hooks/useSelectOptions';
// import InputTemplate, { type InputStyle } from './InputTemplate';
// import DropdownModal from './DropdownModal';
// import { useContainerContext } from '../context/ContainerContext';
// import { DropdownContext } from '../context/DropdownContext';
// import type { SelectProps } from '../typeDeclaration/dropdownProps';
// import { useStyles } from '../hooks/useStylingMods';
// import { useFormHelpers } from '../hooks/useFormActions';
// import type { RotatingDropdownRef } from '../Icons/RotatingDropdown';

// export interface DropdownRefType {
//     open: () => void
//     close: () => void
// }

// const SelectInput= forwardRef<DropdownRefType, SelectProps>(({
//     name,
//     placeholder,
//     options,
//     children,
//     onChange,
//     dependsOn,
//     onToggleDropdown,
//     optionsMap,
//     initialLabel,
//     twStyle,
//     disabled = false,
//     hideElement = false,
//     searchable = false,
//     onDisableChange,
//     initialValue = '',
//     style,
// }, ref) => {
//     const {inputStore, modalContainerRef} = useContainerContext()
//     const rotateRef = useRef<RotatingDropdownRef | null>(null)

//     const {setValue, setOptions} = useFormHelpers()
    
//     const modifiedName = useFieldName(placeholder, name, inputStore)

    
//     const hasRendered = useRef<boolean>(false)
//     if (!hasRendered.current) {
//         const existingValue = inputStore.getValue(modifiedName);
//         const pendingValue = inputStore.getPendingInitialData(modifiedName)
//         // const value = existingValue || (initialValue ?? pendingValue)
//         const value = [existingValue, initialValue, pendingValue]
//             .find(v => v !== "" && v !== undefined && v !== null) ?? "";
//         inputStore.optionGraph.register(modifiedName, {
//             options,
//             dependsOn,
//             initialSelected: value,
//             mapFn: optionsMap
//               ? (dep, base) => optionsMap[dep] ?? []
//               : undefined
//         })
//         hasRendered.current = true
//     }
    
//     const disabledValue: boolean = useComputedExpression(disabled, modifiedName)
//     useImperativeHandle(
//         ref,
//         () => ({
//             open: () => setTimeout(() => {
//                 inputStore.optionGraph.open(modifiedName, rotateRef, disabledValue)
//             }, 0),
//             close: () => setTimeout(() => {
//                 inputStore.optionGraph.close(modifiedName, rotateRef)
//             }, 0),
//         }), [])

//     const hiddenValue: boolean = useComputedExpression(hideElement)

//     const {resolvedStyle, tw} = useStyles(style, twStyle!, "dropdown")
    
//     const {boxWidth, containerStyles} = resolvedStyle



//     useEffect(() => {
//         if (onDisableChange) {
//             // const { inputData } = inputStore.getSnapshot()
//             const currentDisabled = inputStore.getValue(modifiedName)
//             onDisableChange({
//                 state: disabledValue,
//                 disabledKey: modifiedName,
//                 disabledValue: currentDisabled,
//                 storeValue: inputStore.getSnapshot().inputData,
//                 setValue: setValue
//             })
//         }
//     }, [disabledValue])

//     useEffect(() => {
//       if (!onChange) return
        
//       const unsubscribe = inputStore.subscribeToValue(modifiedName, (value) => {
//         onChange({ value, setValue, setOptions })
//       })
  
//       return unsubscribe
//     }, [onChange])

//     const handleSelect = (selectedValue: string) => {
//         // onChange?.({value: selectedValue, setValue, setOptions});
//         inputStore.setValue(modifiedName, selectedValue);
//         // inputStore.optionGraph.selectOption(modifiedName, selectedValue)
//     };

//     if (hiddenValue) {
//         return null;
//     }

//     return (
//         // <DropdownContext.Provider value={{style : resolvedStyle, twStyle : resolvedTwStyle, name: modifiedName}}>
//         <DropdownContext.Provider value={{twHighlightedStyles : tw.twHighlightedStyles, highlightedStyle : resolvedStyle.highlightedStyles}}>
//             <div className={`relative ${tw.twContainerStyles}`} style={{...containerStyles, width: boxWidth}} /* style={{ display: hiddenValue ? 'none' : 'block', position : 'relative' }} */>
//                 {console.log('rendering StrInput', modifiedName)}
//                 <InputTemplate
//                     name={modifiedName}
//                     placeholder={placeholder}
//                     style={resolvedStyle as InputStyle}
//                     placeholderStyles={twStyle?.twPlaceholderStyles}
//                     childType={'dropdown'}
//                 >
//                     <DropdownModal
//                         onSelect={handleSelect}
//                         // options={optionObject}
//                         name={modifiedName}
//                         style={resolvedStyle}
//                         twStyle={tw}
//                         onToggleDropdown={onToggleDropdown}
//                         searchable={searchable}
//                         disabled={disabledValue}
//                         rotateRef={rotateRef}
//                         modalContainerRef={modalContainerRef}
//                         initialLabel={initialLabel}
//                     />
//                 </InputTemplate>
//                 {children}
//             </div>
//         </DropdownContext.Provider>
//     );
// })

// // export default memo(SelectInput, (prev, next) => prev.name === next.name);
// // const MemoizedSelectInput = memo(SelectInput, (prev, next) => prev.placeholder === next.placeholder)
// const MemoizedSelectInput = memo(SelectInput)
// MemoizedSelectInput.displayName = 'SelectInput';
// export default MemoizedSelectInput;