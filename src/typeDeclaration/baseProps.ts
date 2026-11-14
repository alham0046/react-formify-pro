import type { ArrayHelpers } from "../components/ArrayContainer";
// import type { DropdownOption } from "../components/BaseDropdown";
// import type { InputStyle } from "../components/InputTemplate";
import type { FieldStyle } from "../Utils/StyleInjection";
import type { ArrayController } from "./arrayProps";
// import type { TWInputStyleProp } from "./stylesProps";

export interface BaseInputProps {
    placeholder: string;
    children?: React.ReactNode;
    initialValue?: string;
    // borderWidth?: number | string
    // twStyle?: Partial<TWInputStyleProp & T>
    className?: string
    style?: FieldStyle
    disabled?: string | boolean
    hideElement?: string | boolean
    onEnterPress?: OnEnterPress
    // onEnterPress?: (args: { currentValue?: string | number, allData?: Record<string, any> }) => void
    onBlur?: OnBlur
    onFocus?: (key: string) => void
    // onBlur?: (args: { currentValue?: string | number, allData?: Record<string, any> }) => void
    name?: string;
    onChange?: OnInputChange
    onDisableChange?: (args: {
        state: boolean,
        disabledKey?: string,
        disabledValue: any,
        storeValue: Record<string, any> | null,
        setValue: (value: any) => void
    }) => void
}

// type twBaseProp = Partial<TWInputStyleProp>

// type styleBaseProp = Partial<InputStyle>

export interface OnInputChangeArgs {
  value: string | number
  setFields: (field: FieldProps) => void
  // arrAction?: (path: string) => ArrayHelpers
  arrayAction: (path: string) => ArrayController | undefined
  // setOptions?: (name : string, options: string[] | DropdownOption[], initialValue?: string) => void
}

export type OnInputChange = (args: OnInputChangeArgs) => void

export interface onEnterPressArgs extends OnInputChangeArgs {
  stopPropagation: () => void
  data: Record<string, any>
  submit?: () => void
}

export type OnEnterPress = (args: onEnterPressArgs) => void

export interface OnBlurArgs extends OnInputChangeArgs {
  // arrayAction: (path: string) => ArrayController | undefined
  data: Record<string, any>
}

export type OnBlur = (args: OnBlurArgs) => void

export interface FieldProps {
    [key: string]: any;
}