import { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, type ComponentProps, type RefObject } from 'react'
import type { InputRefProps } from '../typeDeclaration/inputProps'
import { useFormLayout } from '../context/LabelLayoutContext'
import { useInputValue } from '../hooks/ExternalSyncHooks'
import type { InputFieldType } from '../store/InputFieldStore'
// import { useFormHelpers } from '../hooks/useFormActions'
import type { OnBlur, OnEnterPress, OnInputChange } from '../typeDeclaration/baseProps'
// import { useContainerContext } from '../context/ContainerContext'
// import type { FieldProps } from '../Utils/SetFieldValue'

type NonEnterKey = Exclude<React.KeyboardEvent<HTMLInputElement>['key'], 'Enter'>

type NonEnterKeyboardEvent =
    Omit<React.KeyboardEvent<HTMLInputElement>, 'key'> & {
        key: NonEnterKey
    }

// export interface OnInputChange {
//     value?: string | number
//     setValue?: (FieldCredentials: FieldProps) => void
// }


interface InputProps {
    onBlur?: OnBlur
    onFocus?: (key: string, ref?: RefObject<HTMLInputElement | null>) => void
    handleChange?: (value: string | number) => void;
    onChange?: OnInputChange
    // onChange?: (value: string | number) => void
    onEnterPress?: OnEnterPress
    // onEnterPress?: (args: { currentValue?: string | number, allData?: Record<string, any>, stopPropagation?: () => void }) => void
    onKeyDown?: (e: NonEnterKeyboardEvent) => void
    // onBeforeInput?: (e: React.InputEvent<HTMLInputElement>) => void
    fixedValue?: string
    refRequired?: boolean
    maxLength?: number
    autoFocus?: boolean
    inputStyles?: string
    disabled: boolean
    placeholder: string
    type: ComponentProps<'input'>['type']
    // name: string
    field: InputFieldType
    inputInlineStyle?: Omit<
        React.CSSProperties,
        'border' | 'borderWidth'
    >
}
const Input = forwardRef<InputRefProps, InputProps>(({
    // name,
    field,
    fixedValue,
    maxLength,
    autoFocus = false,
    onBlur,
    onFocus,
    inputStyles = "",
    refRequired = false,
    onKeyDown,
    handleChange,
    onChange,
    onEnterPress,
    disabled,
    placeholder,
    type,
    inputInlineStyle
}, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const { labelMode } = useFormLayout()
    // const form = useContainerContext().inputStore
    // const { setFields, setOptions, arrAction } = useFormHelpers()
    const value: string | number = fixedValue ?? useInputValue(field)
    // const value: string | number = fixedValue ?? useInputStore(field) ?? ""
    const handlePreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const evalue = e.target.value
        if (maxLength && evalue.length > maxLength) {
            return
        }
        handleChange?.(evalue)
    }

    // Inside StrInput.tsx (runs once per mounted component, not on every keystroke/blur)
    const fieldHelpers = useMemo(() => ({
        setFields: (fields: Record<string, any>) => field.setFields(fields),
        arrayAction: (path: string) => field.getArray(path),
        reset: (target?: string | string[]) => field.reset(target),
    }), [field])

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus()
        },
        blur: () => {
            inputRef.current?.blur()
        },
        reset: () => {
            // inputStore.reset(name)
        },
        position: () => {
            return inputRef.current?.getBoundingClientRect()
        }
    }), [inputRef.current])

    const handleBlur = () => {
        // inputStore.stylesStore.disable(name, FieldVisualState.Focus)
        onBlur?.({
            value: value ?? "",
            data: field.root.data as Record<string, any>,
            ...fieldHelpers
        })
    }
    const handleFocus = () => {
        // inputStore.stylesStore.enable(name, FieldVisualState.Focus)
        // console.log('blurred')
        // console.log('the display is', field.displayCode, inputRef)
        if (field.displayCode == 3) {
            onFocus?.(field.name, inputRef)
        } else {
            onFocus?.(field.name)
        }
    }

    const handleKeyPresses = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // console.log('inside keypress', event, event.getModifierState('Control'))
        if (event.key === 'Enter') {
            onEnterPress?.({
                value: value ?? "",
                data: field.root.data as Record<string, any>,
                stopPropagation : () => event.stopPropagation(),
                ...fieldHelpers
            })
            return
        }
        onKeyDown?.(event as NonEnterKeyboardEvent)
    }

    const onChangeRef = useRef(onChange)
    onChangeRef.current = onChange


    useEffect(() => {
        if (!onChangeRef.current) return
        const unsub = field.subscribe(() => {
            onChangeRef.current?.({ value: field.value, ...fieldHelpers })
        })
        return () => unsub?.()
    }, [field, fieldHelpers])

    return (
        <>
            {/* {console.log('the input value is', field.name)} */}
            <input
                type={type}
                id={`floating_input_${field.name}`}
                ref={inputRef}
                onBlur={handleBlur}
                onFocus={handleFocus}
                value={value}
                maxLength={maxLength}
                autoFocus={autoFocus}
                onKeyDown={handleKeyPresses}
                // onBeforeInput={handleBeforeInput}
                onChange={handlePreInput}
                className={labelMode ? inputStyles : `field-input`}
                // className={labelMode ? inputStyles : `input-border ${inputStyles}`}
                placeholder={labelMode ? placeholder : " "}
                disabled={disabled}
                required
            />
        </>
    )
})

export default memo(Input)
