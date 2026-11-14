import { type FC, memo, useMemo, useRef } from 'react';
import InputTemplate from './InputTemplate';
import Input from './Input';
import { useContainerContext } from '../context/ContainerContext';
import type { OnInputChange } from '../typeDeclaration/baseProps';
import { useNameScope } from '../context/NameScopeContext';
import type { InputFieldType } from '../store/InputFieldStore';
import { createField } from '../Utils/FieldUtils';
import { getStyleClass, type FieldStyle } from '../Utils/StyleInjection';
import { useIsHidden } from '../hooks/ExternalSyncHooks';

interface DisabledInputProps {
    initialValue?: string;
    children?: React.ReactNode
    placeholder: string;
    style?: FieldStyle
    className?: string
    privacy?: boolean
    hideElement?: boolean | string
    onChange?: OnInputChange
    name?: string;
}


const DisabledInput: FC<DisabledInputProps> = ({
    initialValue = "",
    privacy = false,
    children,
    style,
    className = "",
    placeholder,
    hideElement = false,
    name,
    ...rest
}) => {
    const { inputStore } = useContainerContext()
    const scope = useNameScope()
    // const modifiedName = useFieldName(placeholder, name, inputStore)
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
        fieldInstance.displayCode = 'DisabledInput'
        hideElement && inputStore.registerHidden(fieldInstance, hideElement)
        field.current = fieldInstance
    }

    const styleClass = useMemo(() => {
            return getStyleClass(style)
          }, [style])

    const hiddenValue: boolean = useIsHidden(field.current!)

    if (hiddenValue) {
        return null;
    }


    return (
        <div className={`field-root ${styleClass} ${className}`}>
            {/* {console.log('rendering StrInput', modifiedName)} */}
            <InputTemplate
                name={field.current!.name}
                placeholder={placeholder}
                // childType="input"
            >
                <Input
                    field={field.current!}
                    placeholder={placeholder}
                    
                    disabled={true}
                    type={privacy ? 'password' : 'text'}
                    fixedValue={initialValue}
                    {...rest}
                />
            </InputTemplate>
            {children}
        </div>
    );
};

// 1. Export the memoized component
const MemoizedDisabledInput = memo(DisabledInput)

// 2. Set the displayName on the exported component
MemoizedDisabledInput.displayName = 'DisabledInput';

export default MemoizedDisabledInput;





// import { type FC, forwardRef, memo, useEffect } from 'react';
// import InputTemplate from './InputTemplate';
// import { useFieldName } from '../hooks/useFieldName';
// import { handleInitialValue } from '../Utils/setInitialValue';
// import type { InputRefProps } from '../typeDeclaration/inputProps';
// import { useComputedExpression } from '../hooks/useComputedExpression';

// interface FullDisabledProps {
//     initialValue?: string;
//     containerStyles?: string;
//     inputStyles?: string;
//     placeholderStyles?: string;
//     placeholder: string;
//     borderWidth?: number | string
//     hideElement?: false
//     onChange?: (value: string | number) => void
//     name?: string;
//     isArrayObject?: boolean;
//     arrayData?: {
//         arrayName: string;
//         arrayIndex: number;
//     };
//     onInputChange: (name: string, value: string) => void;
// }

// type DisabledInputProps = Omit<FullDisabledProps, "isArrayObject" | "arrayData" | "onInputChange">;

// const DisabledInput: FC<DisabledInputProps> = ({
//     initialValue = "",
//     containerStyles = "",
//     placeholder,
//     borderWidth = 1,
//     hideElement = false,
//     onChange = () => { },
//     inputStyles,
//     placeholderStyles,
//     name,
//     ...props
// }) => {
//     const modifiedName = useFieldName(placeholder, name)

//     useEffect(() => {
//         handleInitialValue(modifiedName, initialValue, true)
//     }, [])

//     const hiddenValue: boolean = useComputedExpression(hideElement)

//     // const value = useInputStore(modifiedName)

//     // useEffect(() => {
//     //     onChange(initialValue, null)
//     //     // inputStore.setValue(modifiedName, initialValue);
//     // }, [modifiedName]);
//     if (hiddenValue) {
//         return null;
//     }

//     return (
//         <>
//             <InputTemplate
//                 name={modifiedName}
//                 borderWidth={borderWidth}
//                 placeholder={placeholder}
//                 fixedValue={initialValue}
//                 // onChange={onChange}
//                 disabled={true}
//                 type='text'
//                 containerStyles={containerStyles}
//                 inputStyles={inputStyles}
//                 placeholderStyles={placeholderStyles}
//             // {...props}
//             />
//         </>
//     );
// };

// // 1. Export the memoized component
// const MemoizedDisabledInput = memo(DisabledInput)

// // 2. Set the displayName on the exported component
// MemoizedDisabledInput.displayName = 'DisabledInput';

// export default MemoizedDisabledInput;
















// export default memo(DisabledInput);
{/* <input
    type="text"
    id={`floating_input_${modifiedName}`}
    value={value}
    className="py-2 px-2 border-2 w-full rounded-lg bg-transparent appearance-none peer"
    placeholder=" "
    required
    disabled
/>
<label
    htmlFor={`floating_input_${modifiedName}`}
    className="absolute left-5 px-1 bg-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[85%] peer-focus:-translate-y-6"
>
    {placeholder}
</label> */}