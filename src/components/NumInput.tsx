import { forwardRef, memo, useCallback, useMemo, useRef } from 'react'
// import { useInputStore } from '../../../Hooks/useInputStore'
import { type InputProps, type InputRefProps } from "../typeDeclaration/inputProps";
import InputTemplate from "./InputTemplate";
import Input from './Input';
import { useContainerContext } from '../context/ContainerContext';
import type { InputFieldType } from '../store/InputFieldStore';
// import { useField } from '../hooks/useField';
import { getStyleClass } from '../Utils/StyleInjection';
import { useIsDisabled, useIsHidden } from '../hooks/ExternalSyncHooks';
import { createField } from '../Utils/FieldUtils';
import { useNameScope } from '../context/NameScopeContext';
import { stringValidation } from '../Utils/Stringify';

interface NumInputProps extends InputProps {
    className?: string
    stringify?: boolean
}

const NumInput = forwardRef<InputRefProps, NumInputProps>((props, ref) => {
    const { placeholder, name, children, style, className = "", onDisableChange, initialValue = "", required = false, disabled = false, hideElement = false, privacy = false, stringify = false, ...rest } = props
    const { inputStore } = useContainerContext()
    const scope = useNameScope()
    // const hasRendered = useRef<boolean>(false)
    // let field : InputFieldType | null = null
    const field = useRef<InputFieldType>(null)
    if (field.current === null) {
        const fieldInstance = createField(
            placeholder,
            name,
            inputStore,
            initialValue,
            scope
        ) as InputFieldType
        fieldInstance.displayCode = 'NumInput'
        hideElement && inputStore.registerHidden(fieldInstance, hideElement)
        disabled && inputStore.registerDisabled(fieldInstance, disabled)
        field.current = fieldInstance
    }

    const styleClass = useMemo(() => {
        return getStyleClass(style)
    }, [style])

    const disabledValue: boolean = useIsDisabled(field.current!)

    const hiddenValue: boolean = useIsHidden(field.current!)

    // useEffect(() => {
    //     inputStore.validatorStore.register(modifiedName, { required, validators: [] })
    // }, [required])

    // const stringValidation = (data: number) => {
    //     if (!stringify) return data
    //     else return data.toString()
    // }

    const handleChange = useCallback((value: string | number) => {
        // inputStore.field(modifiedName)!.value = value
        const newValue = value === "" ? "" : stringValidation(Number(value), stringify)
        if (newValue === null) return
        const fieldValue = field.current
        if (!fieldValue) return
        fieldValue.value = newValue
    }, [ stringify ])

    if (hiddenValue) return null

    return (
        <div className={`field-root ${styleClass} ${className}`}>  {/* style={{ display: hiddenValue ? 'none' : 'block', position : 'relative' } */}
            {/* {console.log('rendering StrInput', modifiedName)} */}
            <InputTemplate
                name={field.current!.name}
                placeholder={placeholder}
            >
                <Input
                    ref={ref}
                    field={field.current!}
                    placeholder={placeholder}
                    disabled={disabledValue}
                    type={privacy ? 'password' : 'number'}
                    handleChange={handleChange}
                    {...rest}
                />
            </InputTemplate>
            {children}
        </div>
    )
})

// 1. Export the memoized component
const MemoizedNumInput = memo(NumInput)

// 2. Set the displayName on the exported component
MemoizedNumInput.displayName = 'NumInput';

export default MemoizedNumInput;








// import React, { forwardRef, memo, useCallback, useEffect, useRef } from 'react'
// // import { useInputStore } from '../../../Hooks/useInputStore'
// import type { InputProps, InputRefProps } from "../typeDeclaration/inputProps";
// import { useInputStore } from "../hooks/useInputStore";
// import { useComputedExpression } from "../hooks/useComputedExpression";
// import { inputStore } from "../InputStore";
// import InputTemplate from "./InputTemplate";
// import { handleInitialValue } from '../Utils/setInitialValue';
// import { setFieldValue } from '../Utils/SetFieldValue';
// import { isIndex } from '../Utils/Helper';
// import { useFieldName } from '../hooks/useFieldName';

// interface NumInputProps extends InputProps {
//     stringify?: boolean
// }

// const NumInput = forwardRef<InputRefProps, NumInputProps>(({
//     placeholder,
//     onEnterPress,
//     onBlur,
//     containerStyles,
//     stringify = false,
//     autoFocus = false,
//     privacy = false,
//     disabled = false,
//     hideElement = false,
//     onDisableChange,
//     maxLength,
//     inputStyles,
//     placeholderStyles,
//     onChange,
//     initialValue = "",
//     name,
//     ...props
// }, ref) => {
//     // const parent = useNameScope();

//     // const localName = name || camelCase(placeholder);
//     // const modifiedName = parent ? `${parent}.${localName}` : localName;
//     const modifiedName = useFieldName(placeholder, name)

//     useEffect(() => {
//         handleInitialValue(modifiedName, initialValue)
//     }, [])

//     const value: string = useInputStore(modifiedName) ?? ""
//     const stringValidation = (data: number) => {
//         if (!stringify) {
//             return data
//         }
//         else {
//             return data.toString()
//         }
//     }

//     const handleOnDisableChange = useCallback((value: any) => {
//         setFieldValue({ [modifiedName]: value })
//     }, [modifiedName])

//     const disabledValue: boolean = useComputedExpression(disabled)

//     const hiddenValue: boolean = useComputedExpression(hideElement)

//     useEffect(() => {
//         if (onDisableChange) {
//             // const { inputData } = inputStore.getSnapshot()
//             const currentDisabled = inputStore.getInputNestedValue(modifiedName)
//             onDisableChange({
//                 state: disabledValue,
//                 disabledKey: name,
//                 disabledValue: currentDisabled,
//                 storeValue: inputStore.getSnapshot().inputData,
//                 setValue: handleOnDisableChange
//             })
//         }
//     }, [disabledValue])

//     const prevValueRef = useRef(value)
//     useEffect(() => {
//         if (!onChange) return
//         // console.log('the value of value is', value)
//         if (value !== prevValueRef.current) {
//             prevValueRef.current = value
//             if (isIndex(value)) {
//                 console.log('the value of value is', value)
//                 onChange(Number(value))  // Pass null as no event.data
//             }
//         }
//     }, [value])
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const inputVal = e.target.value
//         // // console.log('the number value is', inputVal)
//         const newValue = inputVal === "" ? "" : stringValidation(Number(inputVal))
//         // const nativeEvent = e.nativeEvent as unknown as InputEvent; // Type assertion to InputEvent
//         // onChange(newValue, nativeEvent.data);
//         // fullProps.onInputChange(modifiedName, newValue)
//         inputStore.setValue(modifiedName, newValue)
//     }
//     return (
//         <InputTemplate
//             ref={ref}
//             name={modifiedName}
//             value={value}
//             handleChange={handleChange}
//             autoFocus={autoFocus}
//             maxLength={maxLength}
//             onBlur={onBlur}
//             onEnterPress={onEnterPress}
//             placeholder={placeholder}
//             type={privacy ? 'password' : 'number'}
//             disabled={disabledValue}
//             hideElement={hiddenValue}
//             containerStyles={containerStyles}
//             inputStyles={inputStyles}
//             placeholderStyles={placeholderStyles}
//             {...props}
//         />
//     )
// })

// // 1. Export the memoized component
// const MemoizedNumInput = memo(NumInput)

// // 2. Set the displayName on the exported component
// MemoizedNumInput.displayName = 'NumInput';

// export default MemoizedNumInput;