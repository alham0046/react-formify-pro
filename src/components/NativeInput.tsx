import { ComponentProps, memo, RefObject } from "react"
import { InputFieldType } from "../store/InputFieldStore"
import { useInputValue } from "../hooks/ExternalSyncHooks"

interface NativeInputProps extends Omit<ComponentProps<'input'>, 'value'> {
    field: InputFieldType
    fixedValue?: string
    inputRef: RefObject<HTMLInputElement | null>
}

// const NativeInput = memo(({ field, fixedValue, inputRef, ...domProps }: NativeInputProps) => {
//   // Only this minimal component re-renders when field.value changes!
//   const storeValue = useInputValue(field)
//   const value = fixedValue ?? storeValue

//   return <input ref={inputRef} value={value} {...domProps} />
// })

const NativeInput : React.FC<NativeInputProps> = ({field, fixedValue, inputRef, ...domProps}) => {
    const value = fixedValue ?? useInputValue(field)
    // console.log('the value of domprop is')
    return (
        <input ref={inputRef} value={value} {...domProps} />
    )
}

export default memo(NativeInput)
