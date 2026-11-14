// import type { OnInputChange } from "../components/Input";
import type { ArrayHelpers } from "../components/ArrayContainer";
// import type { DropdownOption } from "../components/BaseDropdown";
import type { InputStyle } from "../components/InputTemplate";
// import type { FieldProps } from "../Util/SetFieldValue";
import type { BaseInputProps, FieldProps } from "./baseProps";
import type { DropdownStyleProp, TWDropdownStyleProp, TWInputStyleProp } from "./stylesProps";

export interface FullInputProps extends BaseInputProps {
    maxLength?: number
    autoFocus?: boolean
    privacy?: boolean
    
}

export type InputProps = FullInputProps & Validation

export interface OnInputChangeArgs {
  value: string | number
  setValue: (field: FieldProps) => void
  // setOptions: (name : string, options: string[] | DropdownOption[], initialValue?: string) => void
  arrAction?: (path: string) => ArrayHelpers
}

export type OnInputChange = (args: OnInputChangeArgs) => void

export interface onEnterPressArgs extends OnInputChangeArgs {
  stopPropagation: () => void
  data: Record<string, any>
  submit: () => void
}

export type OnEnterPress = (args: onEnterPressArgs) => void

export interface OnBlurArgs extends OnInputChangeArgs {
  data: Record<string, any>
}

export type OnBlur = (args: OnBlurArgs) => void

export interface OnSubmitArgs {
  data: Record<string, any> | null
  edited: Record<string, any> | null
  reset: (key?: string[] | string) => void;
  clear: () => void
  stopPropagation: () => void
  preventDefault: () => void
}

export type OnSubmit = (args: OnSubmitArgs) => boolean | void | Promise<boolean | void>

export interface Validation {
  required?: boolean
}


export const DEFAULT_INPUT_STYLE: InputStyle = {
  borderWidth: '2px',
  boxHeight: '8px',
  boxWidth: '100%',
  placeHolderOffset: '16px',
  placeholderInlineStyle: {},
  inputInlineStyle: {},
  containerStyles: {},
}

export interface InputRefProps {
    focus: () => void
    blur: () => void
    reset: () => void
    position: () => DOMRect | undefined
}


type Year = `${number}${number}${number}${number}`
type Month = `0${1|2|3|4|5|6|7|8|9}` | `1${0|1|2}`
type Day =
  | `0${1|2|3|4|5|6|7|8|9}`
  | `${1|2}${number}`
  | `3${0|1}`

export type DateString = `${Year}-${Month}-${Day}`


export const DEFAULT_DROPDOWN_STYLE: DropdownStyleProp = {
  // borderWidth: '2px',
  // boxHeight: '8px',
  // boxWidth: '100%',
  // placeHolderOffset: '16px',
  dropdownOffset: 5,
  // containerStyles: {},
  selectedStyles: {},
  highlightedStyles: {},
  // inputStyles: {},
  // placeholderStyles: {},
  modalBoxStyles: {},
  optionBoxStyles: {},
  optionStyles: {}
}


export const TW_DEFAULT_DROPDOWN_STYLE: TWDropdownStyleProp = {
  twSelectedStyles: 'text-blue-600 bg-gray-100',
  twHighlightedStyles: '',
  // twInputStyles: 'w-full rounded-lg bg-transparent',
  // twPlaceholderStyles: '',
  // twContainerStyles: '',
  twModalBoxStyles: '',
  twOptionBoxStyles: 'bg-white border rounded-lg overflow-hidden shadow-xl',
  twOptionItemStyles: 'px-4 py-2 cursor-pointer hover:bg-blue-200'
}


export const TW_DEFAULT_INPUT_STYLE: TWInputStyleProp = {
  twInputStyles: 'outline-none w-full rounded-lg bg-transparent',
  twPlaceholderStyles: '',
  twContainerStyles: '',
}
// // import type { OnInputChange } from "../components/Input";
// import type { InputStyle } from "../components/InputTemplate";
// import type { FieldProps } from "../Utils/SetFieldValue";
// import type { BaseInputProps } from "./baseProps";
// import type { DropdownStyleProp, TWDropdownStyleProp, TWInputStyleProp } from "./stylesProps";

// export interface FullInputProps extends BaseInputProps {
//     placeholder: string;
//     maxLength?: number
//     children?: React.ReactNode;
//     initialValue?: string;
//     autoFocus?: boolean
//     borderWidth?: number | string
//     twStyle?: Partial<TWInputStyleProp>
//     style?: Partial<InputStyle>
//     privacy?: boolean
//     disabled?: string | boolean
//     hideElement?: string | boolean
//     onEnterPress?: OnEnterPress
//     // onEnterPress?: (args: { currentValue?: string | number, allData?: Record<string, any> }) => void
//     onBlur?: OnBlur
//     // onBlur?: (args: { currentValue?: string | number, allData?: Record<string, any> }) => void
//     name?: string;
//     onChange?: OnInputChange
//     onDisableChange?: (args: {
//         state: boolean,
//         disabledKey?: string,
//         disabledValue: any,
//         storeValue: Record<string, any> | null,
//         setValue: (value: any) => void
//     }) => void
// }

// // export type InputProps = Omit<FullInputProps, "isArrayObject" | "arrayData" | "onInputChange">;
// export type InputProps = FullInputProps & Validation

// export interface OnInputChangeArgs {
//   value: string | number
//   setValue: (field: FieldProps) => void
// }

// export type OnInputChange = (args: OnInputChangeArgs) => void

// export interface onEnterPressArgs extends OnInputChangeArgs {
//   stopPropagation: () => void
//   data: Record<string, any>
// }

// export type OnEnterPress = (args: onEnterPressArgs) => void

// export interface OnBlurArgs extends OnInputChangeArgs {
//   data: Record<string, any>
// }

// export type OnBlur = (args: OnBlurArgs) => void

// export interface OnSubmitArgs {
//   data: Record<string, any> | null
//   edited: Record<string, any> | null
//   resetForm: (key?: string[] | string) => void;
//   stopPropagation: () => void
//   preventDefault: () => void
// }

// export type OnSubmit = (args: OnSubmitArgs) => boolean | void | Promise<boolean | void>

// export interface Validation {
//   required?: boolean
// }


// export const DEFAULT_INPUT_STYLE: InputStyle = {
//   borderWidth: '2px',
//   boxHeight: '8px',
//   boxWidth: '100%',
//   placeHolderOffset: '16px',
//   placeholderInlineStyle: {},
//   inputInlineStyle: {},
//   containerStyles: {},
// }

// export interface InputRefProps {
//     focus: () => void
//     blur: () => void
//     reset: () => void
//     position: () => DOMRect | undefined
// }


// type Year = `${number}${number}${number}${number}`
// type Month = `0${1|2|3|4|5|6|7|8|9}` | `1${0|1|2}`
// type Day =
//   | `0${1|2|3|4|5|6|7|8|9}`
//   | `${1|2}${number}`
//   | `3${0|1}`

// export type DateString = `${Year}-${Month}-${Day}`


// export const DEFAULT_DROPDOWN_STYLE: DropdownStyleProp = {
//   // borderWidth: '2px',
//   // boxHeight: '8px',
//   // boxWidth: '100%',
//   // placeHolderOffset: '16px',
//   dropdownOffset: 5,
//   // containerStyles: {},
//   selectedStyles: {},
//   highlightedStyles: {},
//   // inputStyles: {},
//   // placeholderStyles: {},
//   modalBoxStyles: {},
//   optionBoxStyles: {},
//   optionStyles: {}
// }


// export const TW_DEFAULT_DROPDOWN_STYLE: TWDropdownStyleProp = {
//   twSelectedStyles: 'text-blue-600 bg-gray-100',
//   twHighlightedStyles: '',
//   // twInputStyles: 'w-full rounded-lg bg-transparent',
//   // twPlaceholderStyles: '',
//   // twContainerStyles: '',
//   twModalBoxStyles: '',
//   twOptionBoxStyles: 'bg-white border rounded-lg shadow-xl',
//   twOptionItemStyles: 'px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-200'
// }


// export const TW_DEFAULT_INPUT_STYLE: TWInputStyleProp = {
//   twInputStyles: 'outline-none w-full rounded-lg bg-transparent',
//   twPlaceholderStyles: '',
//   twContainerStyles: '',
// }