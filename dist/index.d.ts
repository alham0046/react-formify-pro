import * as react from 'react';
import react__default, { ReactNode, CSSProperties, ReactElement, MouseEvent } from 'react';

type IndexedItem = {
    index: number;
} & Record<string, any>;
interface AddArgs {
    index?: number;
    count?: number;
    initialValue?: Record<string, any>[] | Record<string, any> | IndexedItem[];
}
interface ArrayController {
    readonly length: number;
    add: (args?: AddArgs) => void;
    remove: (index: number) => void;
    clear: () => void;
}

interface ArrayContainerSlotProps {
    add: (args?: AddArgs) => void;
    itemsCount: number;
}
interface ArrayContainerProps {
    name: string;
    repeat?: number;
    initialValue?: any[];
    hidden?: boolean | string;
    append?: ((props: ArrayContainerSlotProps) => ReactNode);
    children: ReactNode;
    style?: React.CSSProperties;
    className?: string;
}
declare const _default$4: react.NamedExoticComponent<ArrayContainerProps>;

type ElementStyle = CSSProperties & {
    focus?: CSSProperties;
    hover?: CSSProperties;
    active?: CSSProperties;
    disabled?: CSSProperties;
    focusWithin?: CSSProperties;
    selected?: CSSProperties;
};
type StrInputTarget = "root" | "input" | "placeholder" | "line" | "template" | "options" | "option" | "search";
type FieldStyle = {
    [K in StrInputTarget]?: ElementStyle;
};
type OptionSlotStyle = {
    base?: CSSProperties;
    active?: CSSProperties;
    selected?: CSSProperties;
};
declare function stateStyle(styles?: OptionSlotStyle): string;

interface BaseInputProps {
    placeholder: string;
    children?: React.ReactNode;
    initialValue?: string;
    className?: string;
    style?: FieldStyle;
    disabled?: string | boolean;
    hideElement?: string | boolean;
    onEnterPress?: OnEnterPress;
    onBlur?: OnBlur;
    onFocus?: (key: string) => void;
    name?: string;
    onChange?: OnInputChange;
    onDisableChange?: (args: {
        state: boolean;
        disabledKey?: string;
        disabledValue: any;
        storeValue: Record<string, any> | null;
        setValue: (value: any) => void;
    }) => void;
}
interface OnInputChangeArgs {
    value: string | number;
    setFields: (field: FieldProps) => void;
    arrayAction: (path?: string) => (ArrayController & {
        currentIndex?: number;
    }) | undefined;
    reset: (keys?: string[] | string) => void;
}
type OnInputChange = (args: OnInputChangeArgs) => void;
interface onEnterPressArgs extends OnInputChangeArgs {
    stopPropagation: () => void;
    data: Record<string, any>;
    submit?: () => void;
}
type OnEnterPress = (args: onEnterPressArgs) => void;
interface OnBlurArgs extends OnInputChangeArgs {
    data: Record<string, any>;
}
type OnBlur = (args: OnBlurArgs) => void;
interface FieldProps {
    [key: string]: any;
}

interface FullInputProps extends BaseInputProps {
    maxLength?: number;
    autoFocus?: boolean;
    privacy?: boolean;
}
type InputProps = FullInputProps & Validation;
interface OnSubmitArgs {
    data: Record<string, any> | null;
    edited: Record<string, any> | null;
    reset: (key?: string[] | string) => void;
    clear: () => void;
    stopPropagation: () => void;
    preventDefault: () => void;
}
type OnSubmit = (args: OnSubmitArgs) => boolean | void | Promise<boolean | void>;
interface Validation {
    required?: boolean;
}
interface InputRefProps {
    focus: () => void;
    blur: () => void;
    reset: () => void;
    position: () => DOMRect | undefined;
}
type Year = `${number}${number}${number}${number}`;
type Month = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `1${0 | 1 | 2}`;
type Day = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `${1 | 2}${number}` | `3${0 | 1}`;
type DateString = `${Year}-${Month}-${Day}`;

declare const MemoizedStrInput: react.NamedExoticComponent<FullInputProps & Validation & react.RefAttributes<InputRefProps>>;

interface NumInputProps extends InputProps {
    className?: string;
    stringify?: boolean;
}
declare const MemoizedNumInput: react.NamedExoticComponent<NumInputProps & react.RefAttributes<InputRefProps>>;

interface ObjContainerProps {
    name: string;
    children: ReactNode;
}
declare const MemoizedObjectContainer: react.NamedExoticComponent<ObjContainerProps>;

interface SelectProps extends BaseInputProps {
    /** NEW — generic dependent dropdown system */
    includeDefaultLabel?: boolean;
    dependsOn?: string;
    optionsMap?: Record<string, any>;
    options: SelectOption[] | string[];
    initialLabel?: string;
    searchable?: boolean;
    onToggleDropdown?: (isOpen: boolean) => void;
}
interface SelectOption {
    label: string;
    value: string;
}

interface DropdownRefType {
    open: () => void;
    close: () => void;
}
declare const MemoizedSelectInput: react.NamedExoticComponent<SelectProps & react.RefAttributes<DropdownRefType>>;

interface FullAutoInputProps {
    initialData?: object;
    exclusionKeys?: string[];
    onInputChange?: () => void;
    sharedStyles?: object;
    name?: undefined;
    bgColor?: string;
}
type AutoInputProps = Omit<FullAutoInputProps, "sharedStyles" | "bgColor" | "onInputChange">;
declare const MemoizedAutoInput: react__default.NamedExoticComponent<AutoInputProps>;

interface DateProps extends InputProps {
    initial?: "todayDate" | (string & {}) | DateString;
    defaultTodayDate?: boolean;
    defaultDate?: DateString;
    seperator?: '-' | '/' | '.';
}
declare const memoizedDateInput: react.NamedExoticComponent<DateProps & react.RefAttributes<InputRefProps>>;

interface DisabledInputProps {
    initialValue?: string;
    children?: React.ReactNode;
    placeholder: string;
    style?: FieldStyle;
    className?: string;
    privacy?: boolean;
    hideElement?: boolean | string;
    onChange?: OnInputChange;
    name?: string;
}
declare const MemoizedDisabledInput: react.NamedExoticComponent<DisabledInputProps>;

interface RunningTextProps {
    children: react__default.ReactNode;
    width?: string;
    className?: string;
    speed?: number;
    maxAutoSpeed?: number;
}
declare const _default$3: react__default.NamedExoticComponent<RunningTextProps>;

interface FormRowProps {
    label: React.ReactNode;
    separator?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    labelWidth?: string | number;
}
declare const _default$2: react.NamedExoticComponent<FormRowProps>;

type SearchOnChange<T> = (value: string | number) => T[] | Promise<T[]>;
type SearchInputBaseProps = Omit<InputProps, "onChange">;
interface SearchInputProps<T> extends SearchInputBaseProps {
    onChange: SearchOnChange<T>;
    refinedKey?: string;
    renderItem?: (item: T, index: number, active: boolean) => React.ReactNode;
    onSelect?: (args: OnInputChangeArgs) => void;
}
declare const _default$1: react.NamedExoticComponent<SearchInputProps<any> & react.RefAttributes<InputRefProps>>;

interface ConfirmationRenderProps {
    success: (data?: any) => void;
    cancel: () => void;
    data: Record<string, any> | null;
    edited: Record<string, any> | null;
    isDisabled?: boolean;
    reset: (key?: string[] | string) => void;
    clear: () => void;
}
interface SubmitButtonRef {
    submit: (e: MouseEvent<HTMLDivElement>) => void;
}
interface SubmitProps {
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    closeModal?: () => void;
    onClick?: OnSubmit;
    /**
     * Configuration for enabling and customizing a confirmation modal.
     * If provided, the final action (onConfirm) is only executed after the user confirms inside the modal.
     * * @example
     * // Assuming ConfirmComponent is a function that takes ConfirmationRenderProps
     * modal: {
     * modalStyle: { width: '50%' }  // width and height can be in % or px or simple number
     * renderConfirmationModel: (props) => <ConfirmComponent {...props} />,  // prefered to be used as function
     * isDisabled : false    // if you want to disable the cornfirmation modal submit button conditionally
     * onConfirm: handleSubmitFunction,
     * }
     */
    modal?: {
        modalStyle?: {
            height?: string | number;
            width?: string | number;
        };
        renderConfirmationModel?: ((props: ConfirmationRenderProps) => ReactNode) | ReactElement<ConfirmationRenderProps>;
        isDisabled?: boolean;
        onConfirm?: (data: any) => void;
    };
}
declare const MemoizedSubmitButton: react__default.NamedExoticComponent<SubmitProps & react__default.RefAttributes<SubmitButtonRef>>;

interface InputContainerProps {
    children: ReactNode;
    style?: CSSProperties;
    className?: string;
    formId?: string;
    initialData?: Record<string, any>;
    mode?: "default" | "edit";
    fieldStyle?: FieldStyle;
}
declare const _default: react.NamedExoticComponent<InputContainerProps>;

declare class SharedMemory {
    private storage;
    get(key?: string): any;
    set(key: string, value: any): void;
    addMany(data: Record<string, any>): void;
    remove(key: string): void;
    clear(): void;
}
declare const sharedMemory: SharedMemory;

export { _default$4 as ArrayContainer, MemoizedAutoInput as AutoInput, memoizedDateInput as DateInput, MemoizedDisabledInput as DisabledInput, _default$2 as FormRow, _default as InputContainer, MemoizedNumInput as NumInput, MemoizedObjectContainer as ObjectContainer, _default$3 as RunningText, _default$1 as SearchInput, MemoizedSelectInput as SelectInput, MemoizedStrInput as StrInput, MemoizedSubmitButton as SubmitButton, sharedMemory, stateStyle };
export type { ConfirmationRenderProps, DropdownRefType, OnBlur, OnBlurArgs, OnEnterPress, OnInputChange, OnInputChangeArgs, OnSubmit, OnSubmitArgs, SubmitButtonRef, onEnterPressArgs };
