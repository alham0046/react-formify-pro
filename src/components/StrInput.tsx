import { forwardRef, memo, useCallback, useMemo, useRef } from "react";
import { type InputProps, type InputRefProps } from "../typeDeclaration/inputProps";
import InputTemplate from "./InputTemplate";
import Input from "./Input";
import { useContainerContext } from "../context/ContainerContext";
import type { InputFieldType } from "../store/InputFieldStore";
import { useIsDisabled, useIsHidden } from "../hooks/ExternalSyncHooks";
import { getStyleClass } from "../Utils/StyleInjection";
// import { useField } from "../hooks/useField";
import { useNameScope } from "../context/NameScopeContext";
import { createField } from "../Utils/FieldUtils";


const StrInput = forwardRef<InputRefProps, InputProps>((props, ref) => {
    const {placeholder, name,children,style,className = "", initialValue="",required=false, disabled=false, hideElement=false, privacy=false, ...rest} = props
    const {inputStore} = useContainerContext()
    const scope = useNameScope()
    // const modifiedName = useFieldName(placeholder, name, inputStore)
    // const hasRendered = useRef<boolean>(false)
    // let field : InputFieldType | null = null
    const field = useRef<InputFieldType | null>(null)
    if (field.current === null) {
        const fieldInstance = createField(
                placeholder,
                name,
                inputStore,
                initialValue,
                scope
        ) as InputFieldType
        fieldInstance.displayCode = 'StrInput'
        hideElement && inputStore.registerHidden(fieldInstance, hideElement)
        disabled && inputStore.registerDisabled(fieldInstance, disabled)
        field.current = fieldInstance  //// Here field is mutating current only once. Not a big performance hit but still its faster and a point to learn
    }

    ////////// THE PERFORMANCE IS VERY IDENTICAL TO THE ABOVE CODE BUT STILL THE ABOVE ONE IS FASTER
    ///Reading and mutating field.current repeatedly requires walking the reference pointer on the heap (GetProperty(field, "current")) 4–5 times in a row.
    // if (field.current === null) {
    //     field.current = createField(
    //             placeholder,
    //             name,
    //             inputStore,
    //             initialValue,
    //             scope
    //     ) as InputFieldType
    //     field.current.displayCode = 'StrInput'
    //     hideElement && inputStore.registerHidden(field.current, hideElement)
    //     disabled && inputStore.registerDisabled(field.current, disabled)
    //     // hasRendered.current = true
    // }

    const styleClass = useMemo(() => {
        return getStyleClass(style)
      }, [style])
        
    // useEffect(() => {
    //     inputStore.validatorStore.register(modifiedName, {required, validators: []})
    // }, [required])

    const disabledValue: boolean = useIsDisabled(field.current!)
    
    const hiddenValue: boolean = useIsHidden(field.current!)
    
    const handleChange = useCallback((value : string | number) => {
        // inputStore.field(modifiedName)!.value = value
        const fieldValue = field.current
        if (!fieldValue) return
        fieldValue.value = value
    }, [])
    
    if (hiddenValue) {
        // inputStore.setSilentValue(modifiedName, "")
        return null
    }
    
    return (
        <div className={`field-root ${styleClass} ${className}`} /* style={{...containerStyles, width: boxWidth}} */ /* style={{ display: hiddenValue ? 'none' : 'block', position : 'relative' }} */>
            {/* {console.log('rendering StrInput', field.current)} */}
            <InputTemplate
                name={field.current!.name}
                placeholder={placeholder}
                // childType="input"
            >
                <Input
                    ref={ref}
                    // name={field.current!.name}
                    field={field.current!}
                    placeholder={placeholder}
                    disabled={disabledValue}
                    type={privacy ? 'password' : 'text'}
                    handleChange={handleChange}
                    {...rest}
                />
            </InputTemplate>
            {children}
        </div>
    );
});

// 1. Export the memoized component
const MemoizedStrInput = memo(StrInput)

// 2. Set the displayName on the exported component
MemoizedStrInput.displayName = 'StrInput';

export default MemoizedStrInput;
























///// CODE FOR STRINPUT WITHOUT THE <InputContainer>

// import { forwardRef, memo, useCallback, useMemo, useRef } from "react";
// import { type InputProps, type InputRefProps } from "../typeDeclaration/inputProps";
// import InputTemplate from "./InputTemplate";
// import Input from "./Input";
// import { useContainerContext } from "../context/ContainerContext";
// import type { InputFieldType } from "../store/InputFieldStore";
// import { useIsDisabled, useIsHidden } from "../hooks/ExternalSyncHooks";
// import { getStyleClass } from "../Utils/StyleInjection";
// // import { useField } from "../hooks/useField";
// import { useNameScope } from "../context/NameScopeContext";
// import { createField } from "../Utils/FieldUtils";


// const StrInput = forwardRef<InputRefProps, InputProps>((props, ref) => {
//     const {placeholder, name,children,style,className = "", initialValue="",required=false, disabled=false, hideElement=false, privacy=false, ...rest} = props
//     // const {inputStore} = useContainerContext()
//     const formContext = useContainerContext()
//     const inputStore = formContext?.inputStore
//     // console.log('the placeholder is', placeholder, 'and the inputstore is', inputStore)
//     const scope = useNameScope()
//     // const modifiedName = useFieldName(placeholder, name, inputStore)
//     // const hasRendered = useRef<boolean>(false)
//     // let field : InputFieldType | null = null
//     const field = useRef<InputFieldType | null>(null)
//     if (field.current === null) {
//         const fieldInstance = createField(
//                 placeholder,
//                 name,
//                 inputStore,
//                 initialValue,
//                 scope
//         ) as InputFieldType
//         fieldInstance.displayCode = 'StrInput'
//         if (inputStore) {
//             hideElement && inputStore.registerHidden(fieldInstance, hideElement)
//             disabled && inputStore.registerDisabled(fieldInstance, disabled)
//         } else {
//             if (typeof hideElement === 'boolean') fieldInstance.hidden = hideElement
//             if (typeof disabled === 'boolean') fieldInstance.disabled = disabled
//         }
//         // hideElement && inputStore.registerHidden(fieldInstance, hideElement)
//         // disabled && inputStore.registerDisabled(fieldInstance, disabled)
//         field.current = fieldInstance  //// Here field is mutating current only once. Not a big performance hit but still its faster and a point to learn
//     }

//     ////////// THE PERFORMANCE IS VERY IDENTICAL TO THE ABOVE CODE BUT STILL THE ABOVE ONE IS FASTER
//     ///Reading and mutating field.current repeatedly requires walking the reference pointer on the heap (GetProperty(field, "current")) 4–5 times in a row.
//     // if (field.current === null) {
//     //     field.current = createField(
//     //             placeholder,
//     //             name,
//     //             inputStore,
//     //             initialValue,
//     //             scope
//     //     ) as InputFieldType
//     //     field.current.displayCode = 'StrInput'
//     //     hideElement && inputStore.registerHidden(field.current, hideElement)
//     //     disabled && inputStore.registerDisabled(field.current, disabled)
//     //     // hasRendered.current = true
//     // }

//     const styleClass = useMemo(() => {
//         return getStyleClass(style)
//       }, [style])
        
//     // useEffect(() => {
//     //     inputStore.validatorStore.register(modifiedName, {required, validators: []})
//     // }, [required])

//     const disabledValue: boolean = useIsDisabled(field.current)
    
//     const hiddenValue: boolean = useIsHidden(field.current)
    
//     const handleChange = useCallback((value : string | number) => {
//         // inputStore.field(modifiedName)!.value = value
//         const fieldValue = field.current
//         if (!fieldValue) return
//         fieldValue.value = value
//     }, [])
    
//     if (hiddenValue) {
//         // inputStore.setSilentValue(modifiedName, "")
//         return null
//     }
    
//     return (
//         <div className={`field-root ${styleClass} ${className}`} /* style={{...containerStyles, width: boxWidth}} */ /* style={{ display: hiddenValue ? 'none' : 'block', position : 'relative' }} */>
//             {/* {console.log('rendering StrInput', field.current)} */}
//             <InputTemplate
//                 name={field.current!.name}
//                 placeholder={placeholder}
//                 // childType="input"
//             >
//                 <Input
//                     ref={ref}
//                     // name={field.current!.name}
//                     field={field.current!}
//                     placeholder={placeholder}
//                     disabled={disabledValue}
//                     type={privacy ? 'password' : 'text'}
//                     handleChange={handleChange}
//                     {...rest}
//                 />
//             </InputTemplate>
//             {children}
//         </div>
//     );
// });

// // 1. Export the memoized component
// const MemoizedStrInput = memo(StrInput)

// // 2. Set the displayName on the exported component
// MemoizedStrInput.displayName = 'StrInput';

// export default MemoizedStrInput;