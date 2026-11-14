import { forwardRef, memo, useCallback, useMemo, useRef, type RefObject } from 'react';
// import PickDate from './PickDate';
import InputTemplate from './InputTemplate';
import { type DateString, type InputProps, type InputRefProps } from '../typeDeclaration/inputProps';
// import { useComputedExpression } from '../hooks/useComputedExpression';
// import { handleInitialValue } from '../Utils/setInitialValue';
import Input from './Input';
import { useContainerContext } from '../context/ContainerContext';
// import { useStyles } from '../hooks/useStylingMods';
// import type { FieldProps, OnInputChange } from '../typeDeclaration/baseProps';
import { useNameScope } from '../context/NameScopeContext';
import type { InputFieldType } from '../store/InputFieldStore';
import { createField } from '../Utils/FieldUtils';
import { useIsDisabled, useIsHidden } from '../hooks/ExternalSyncHooks';
import { getStyleClass } from '../Utils/StyleInjection';

// type DateSelection = 
//   | { defaultTodayDate: boolean; defaultDate?: never }
//   | { defaultDate: DateString; defaultTodayDate?: never }
//   | { defaultTodayDate?: never; defaultDate?: never }; // Allows neither to be passed

// interface DatePropsBase extends InputProps {
//     onDateSelect?: (date: string) => void;
// }

// type DateProps = DatePropsBase & DateSelection;

interface DateProps extends InputProps {
    // onDateSelect?: (date: string) => void
    // onDateSelect?: OnInputChange
    initial?: "todayDate" | (string & {}) | DateString
    defaultTodayDate?: boolean
    defaultDate?: DateString
    seperator?: '-' | '/' | '.'
}
// interface DateBase extends InputProps {
//     onDateSelect?: (date: string) => void
// }

// interface TodayProp extends DateBase {
//     defaultTodayDate?: boolean
// }

// interface DefaultDateProp extends DateBase {
//     defaultDate?: DateString
// }

// type DateProps = TodayProp | DefaultDateProp

const DateInput = forwardRef<InputRefProps, DateProps>((props, ref) => {
    const { defaultTodayDate, defaultDate, name, placeholder, hideElement, disabled, style, className, privacy, children, seperator = '/', onFocus, ...rest } = props
    // const modifiedName = useFieldName(placeholder, name)
    const { inputStore } = useContainerContext()
    const todayDate = new Date().toISOString().split('T')[0]
    const initialDate = defaultTodayDate ? todayDate : defaultDate ?? ""

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
            initialDate,
            scope
        ) as InputFieldType
        fieldInstance.displayCode = 'DateInput'
        hideElement && inputStore.registerHidden(fieldInstance, hideElement)
        disabled && inputStore.registerDisabled(fieldInstance, disabled)
        field.current = fieldInstance
        // hasRendered.current = true
    }

    const handleDateSelect = useCallback((value : string | number) => {
        console.log('handleDateSelect', value)
        field.current!.value = value
    }, [])

    // const value = useInputStore(modifiedName) ?? ""

    const styleClass = useMemo(() => {
        return getStyleClass(style)
    }, [style])

    const handleFocus = useCallback((key : string, inputRef?: RefObject<HTMLInputElement | null>) => {
        inputRef!.current?.showPicker()
        onFocus?.(key)
    }, [onFocus])

    const disabledValue: boolean = useIsDisabled(field.current!)

    const hiddenValue: boolean = useIsHidden(field.current!)

    if (hiddenValue) return null

    return (
        <div className={`field-root ${styleClass} ${className}`}>
            {/* {console.log('rendering StrInput', modifiedName)} */}
            <InputTemplate
                name={field.current!.name}
                placeholder={placeholder}
            >
                <Input
                    ref={ref}
                    // name={field.current!.name}
                    field={field.current!}
                    placeholder={placeholder}
                    disabled={disabledValue}
                    type={'date'}
                    handleChange={handleDateSelect}
                    onFocus={handleFocus}
                    // onBeforeInput={handleBeforeInput}
                    {...rest}
                />
            </InputTemplate>
            {children}
        </div>
    );
});

const memoizedDateInput = memo(DateInput)
memoizedDateInput.displayName = 'DateInput'
export default memoizedDateInput






















// import React, { type FC, memo, useEffect } from 'react';
// // import PickDate from './PickDate';
// import { getDate } from '../functions/dateHelper';
// import { useInputStore } from '../hooks/useInputStore';
// import InputTemplate from './InputTemplate';
// import { type InputProps } from '../typeDeclaration/inputProps';
// import { useComputedExpression } from '../hooks/useComputedExpression';
// import { useFieldName } from '../hooks/useFieldName';
// import { handleInitialValue } from '../Utils/setInitialValue';
// import { inputStore } from '../InputStore';

// interface DateProps extends InputProps {
//     onDateSelect?: (date: string) => void
//     defaultTodayDate?: boolean
//     defaultDate?: string
// }

// const DateInput: FC<DateProps> = ({
//     placeholder,
//     onDateSelect,
//     onEnterPress = () => { },
//     defaultTodayDate = true,
//     disabled = false,
//     hideElement = false,
//     containerStyles = "",
//     inputStyles = "",
//     placeholderStyles = "",
//     defaultDate,
//     name,
//     ...props
// }) => {
//     const modifiedName = useFieldName(placeholder, name)
//     const todayDate = new Date().toISOString().split('T')[0]

//     const initialDate = defaultTodayDate ? todayDate : ""
//     useEffect(() => {
//         handleInitialValue(modifiedName, initialDate)
//     }, [])
//     const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const newDate = e.target.value;
//         inputStore.setValue(modifiedName, newDate)
//         // (props as FullInputProps).onInputChange(name!, newDate)
//         onDateSelect?.(newDate)
//     };

//     // const value = useInputStore(modifiedName) ?? ""

//     const disabledValue: boolean = useComputedExpression(disabled)

//     const hiddenValue: boolean = useComputedExpression(hideElement)

//     if (hiddenValue) return null

//     return (
//         <div className={containerStyles}>
//             <InputTemplate
//                 name={modifiedName}
//                 handleChange={handleDateSelect}
//                 onEnterPress={onEnterPress}
//                 placeholder={placeholder}
//                 disabled={disabledValue}
//                 type='date'
//                 containerStyles={containerStyles}
//                 inputStyles={inputStyles}
//                 placeholderStyles={placeholderStyles}
//                 {...props}
//             />
//         </div>
//     );
// };

// const memoizedDateInput = memo(DateInput)
// memoizedDateInput.displayName = 'DateInput'
// export default memoizedDateInput

// export default memo(DateInput);
{/* <div className="relative w-full group border-2 rounded-lg">
    <input
        type="date"
        value={value}
        // defaultValue={initialDate}
        onChange={e => handleDateSelect(e.target.value)}
        id='customDate'
        className={'py-2 px-2 w-max bg-transparent appearance-none peer'} />
    <label
        htmlFor={'customDate'}
        className="absolute left-5 px-1 bg-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[85%] peer-focus:-translate-y-6"
        >
        {placeholder}
    </label>
</div> */}
{/* <PickDate onDateSelect={handleDateSelect} id={'customDate'} dateStyles={'py-2 px-2 w-full bg-transparent appearance-none peer'} /> */ }