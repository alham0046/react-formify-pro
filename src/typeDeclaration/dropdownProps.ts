// import type { DropdownOption } from "../components/BaseDropdown";
// import { OptionMap } from "../hooks/useSelectOptions";
import type { BaseInputProps } from "./baseProps";
import type { DropdownStyleProp, TWDropdownStyleProp } from "./stylesProps";

export interface SelectProps extends BaseInputProps {
    /** NEW — generic dependent dropdown system */
    includeDefaultLabel?: boolean
    dependsOn?: string;
    optionsMap?: Record<string, any>;
    options: SelectOption[] | string[]
    initialLabel?: string
    searchable?: boolean
    onToggleDropdown?: (isOpen: boolean) => void
}


export interface SelectDependentProps extends BaseInputProps {
    includeDefaultLabel?: boolean
    dependsOn: string;
    options: Record<string, { value: any, label: string }[] | string[]>
    initialLabel?: string
    searchable?: boolean
    onToggleDropdown?: (isOpen: boolean) => void
}

// type SelectProps = Omit<FullInputProps, "isArrayObject" | "arrayData" | "onInputChange">

// export type OptionMap = Record<string, DropdownOption[]>
// export interface OptionMap {
//     [key: string]: string[];
// }

interface SelectOption {
    label: string;
    value: string;
}