import type { CSSProperties } from "react";
import type React from "react";

export interface DropdownStyleProp {
    dropdownOffset: number;
    selectedStyles: CSSProperties;
    highlightedStyles: CSSProperties;
    // inputStyles: CSSProperties
    // placeholderStyles: CSSProperties
    modalBoxStyles: CSSProperties
    optionBoxStyles: CSSProperties
    optionStyles: CSSProperties
}

export interface TWDropdownStyleProp {
    twSelectedStyles: string;
    twHighlightedStyles: string
    // twInputStyles: string;
    // twPlaceholderStyles: string;
    // twContainerStyles: string;
    twModalBoxStyles: string;
    twOptionBoxStyles: string;
    twOptionItemStyles: string;
}

export interface TWInputStyleProp {
    twInputStyles: string
    twPlaceholderStyles: string
    twContainerStyles: string
}
// export interface StyleProp {
//     inputStyles?: string;
//     placeholderStyles?: string;
//     containerStyles?: string;
//     modalBoxStyles?: string;
//     optionBoxStyles?: string;
//     optionStyles?: string;
//     dropdownOffset?: number;
// }

// type StyleChoice<TW extends string, CSS extends string> =
//     | { [K in TW]?: string;[K in CSS]?: never }
//     | { [K in TW]?: never;[K in CSS]?: React.CSSProperties };

// export interface DropdownStyleProp2 extends
//     StyleChoice<'twHighlightedStyles', 'highlightedStyles'>,
//     StyleChoice<'twSelectedStyles', 'selectedStyles'>,
//     StyleChoice<'twInputStyles', 'inputStyles'>,
//     StyleChoice<'twPlaceholderStyles', 'placeholderStyles'>,
//     StyleChoice<'twContainerStyles', 'containerStyles'>,
//     StyleChoice<'twModalBoxStyles', 'modalBoxStyles'>,
//     StyleChoice<'twOptionBoxStyles', 'optionBoxStyles'>,
//     StyleChoice<'twOptionStyles', 'optionStyles'> { }

type StyleChoice<TW extends string, CSS extends string> = 
    ({ [K in TW]?: string } & { [K in CSS]?: never }) 
    | 
    ({ [K in TW]?: never } & { [K in CSS]?: React.CSSProperties });

export type DropdownStyleProp2 = 
    StyleChoice<'twHighlightedStyles', 'highlightedStyles'> &
    StyleChoice<'twSelectedStyles', 'selectedStyles'> &
    StyleChoice<'twInputStyles', 'inputStyles'> &
    StyleChoice<'twPlaceholderStyles', 'placeholderStyles'> &
    StyleChoice<'twContainerStyles', 'containerStyles'> &
    StyleChoice<'twModalBoxStyles', 'modalBoxStyles'> &
    StyleChoice<'twOptionBoxStyles', 'optionBoxStyles'> &
    StyleChoice<'twOptionStyles', 'optionStyles'>;

// type Highlighted = {
//     twHighlightedStyles?: string
// } | {
//     highlightedStyles?: React.CSSProperties
// }

// type Selected = {
//     twSelectedStyles?: string
// } | {
//     selectedStyles?: React.CSSProperties
// }

// type Input = {
//     twInputStyles?: string
// } | {
//     inputStyles?: React.CSSProperties
// }

// type Placeholder = {
//     twPlaceholderStyles?: string
// } | {
//     placeholderStyles?: React.CSSProperties
// }

// type Container = {
//     twContainerStyles?: string
// } | {
//     containerStyles?: React.CSSProperties
// }

// type ModalBox = {
//     twModalBoxStyles?: string
// } | {
//     modalBoxStyles?: React.CSSProperties
// }

// type OptionBox = {
//     twOptionBoxStyles?: string
// } | {
//     optionBoxStyles?: React.CSSProperties
// }

// type Option = {
//     twOptionStyles?: string
// } | {
//     optionStyles?: React.CSSProperties
// }


// export interface DropdownStyleProp2 extends Highlighted, Selected, Input, Placeholder, Container, ModalBox, OptionBox, Option {}
// export interface DropdownStyleProp2 = Highlighted & Selected & Input & Placeholder & Container & ModalBox & OptionBox & Option