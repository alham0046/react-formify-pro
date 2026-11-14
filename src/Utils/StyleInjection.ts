//// Suggested by gemini for better efficiency
import { injectCSS, styleCache } from "../store/StyleRegistry"
import type { CSSProperties } from "react"

export type StyleModifier = "focus" | "hover" | "active" | "disabled" | "focusWithin" | "selected"

export type ElementStyle = CSSProperties & {
    focus?: CSSProperties
    hover?: CSSProperties
    active?: CSSProperties
    disabled?: CSSProperties
    focusWithin?: CSSProperties
    selected?: CSSProperties
}

export type StrInputTarget =
    | "root"
    | "input"
    | "placeholder"
    | "line"
    | "template"
    | "options"
    | "option"
    | "search"

export type FieldStyle = {
    [K in StrInputTarget]?: ElementStyle
}

const UNITLESS = new Set([
    "opacity", "z-index", "font-weight", "line-height",
    "flex", "flex-grow", "flex-shrink", "order", "zoom"
])

const BASE_SELECTORS: Record<string, string> = {
    root: ".field-root",
    input: ".field-input",
    placeholder: ".placeholder-input",
    line: ".line-input",
    template: ".template-input",
    options: ".select-options-container",
    option: ".select-option",
    search: ".select-search",
}

const MODIFIER_SELECTORS: Record<string, string> = {
    focus: ":focus",
    hover: ":hover",
    active: '[data-active="true"]',
    disabled: ":disabled",
    focusWithin: ":focus-within",
    selected: '[aria-selected="true"]'
}

const kebabCache = new Map<string, string>()

function toKebab(str: string): string {
    let cached = kebabCache.get(str)
    if (cached) return cached
    if (str.startsWith("--")) return str
    cached = str.replace(/[A-Z]/g, m => "-" + m.toLowerCase())
    kebabCache.set(str, cached)
    return cached
}

// Level 1 Cache: Reference-based O(1) instantaneous lookup (Garbage-collected)
const objectRefCache = new WeakMap<object, string>()

// Ultra-fast 32-bit integer hasher
function hashObject(obj: FieldStyle): string {
    let hash = 0x811c9dc5
    const targets = Object.keys(obj).sort()

    for (let i = 0; i < targets.length; i++) {
        const target = targets[i]
        const targetStyle = obj[target as StrInputTarget]
        if (!targetStyle) continue

        // Hash target name
        for (let c = 0; c < target.length; c++) {
            hash = (hash ^ target.charCodeAt(c)) * 0x01000193
        }

        const keys = Object.keys(targetStyle).sort()
        for (let j = 0; j < keys.length; j++) {
            const key = keys[j]
            const val = (targetStyle as Record<string, any>)[key]
            if (val === undefined || val === null) continue

            // Hash key
            for (let c = 0; c < key.length; c++) {
                hash = (hash ^ key.charCodeAt(c)) * 0x01000193
            }

            if (typeof val === "object") {
                const subKeys = Object.keys(val).sort()
                for (let k = 0; k < subKeys.length; k++) {
                    const sk = subKeys[k]
                    const sv = val[sk]
                    const entry = `${sk}:${sv}`
                    for (let c = 0; c < entry.length; c++) {
                        hash = (hash ^ entry.charCodeAt(c)) * 0x01000193
                    }
                }
            } else {
                const valStr = String(val)
                for (let c = 0; c < valStr.length; c++) {
                    hash = (hash ^ valStr.charCodeAt(c)) * 0x01000193
                }
            }
        }
    }
    return (hash >>> 0).toString(36)
}

// Only invoked when a cache MISS occurs
function buildCSS(className: string, style: FieldStyle): string {
    let css = ""
    for (const [target, targetStyle] of Object.entries(style)) {
        if (!targetStyle) continue
        const baseSelector = BASE_SELECTORS[target]
        if (!baseSelector) continue

        let direct = ""
        const modifiers: Record<string, string> = {}

        for (const [key, value] of Object.entries(targetStyle)) {
            if (value === undefined || value === null) continue
            const modifier = MODIFIER_SELECTORS[key]

            if (modifier) {
                let modRules = ""
                for (const [subKey, subVal] of Object.entries(value as Record<string, any>)) {
                    if (subVal === undefined || subVal === null) continue
                    const cssKey = toKebab(subKey)
                    const formatted = typeof subVal === "number" && !UNITLESS.has(cssKey) && !cssKey.startsWith("--")
                        ? `${subVal}px`
                        : subVal
                    modRules += `${cssKey}:${formatted};`
                }
                if (modRules) modifiers[modifier] = modRules
            } else {
                const cssKey = toKebab(key)
                const formatted = typeof value === "number" && !UNITLESS.has(cssKey) && !cssKey.startsWith("--")
                    ? `${value}px`
                    : value
                direct += `${cssKey}:${formatted};`
            }
        }

        if (direct) {
            css += `.${className} ${baseSelector}{${direct}}`
        }
        for (const [pseudo, rules] of Object.entries(modifiers)) {
            css += `.${className} ${baseSelector}${pseudo}{${rules}}`
        }
    }
    return css
}

export function getStyleClass(style?: FieldStyle): string {
    if (!style) return ""
    // console.log('generating css')

    // 1. Check Level 1 Reference Cache (0ms lookup)
    const refMatch = objectRefCache.get(style)
    if (refMatch) return refMatch

    // 2. Compute lightweight hash only
    const hash = hashObject(style)
    const className = `input-style-${hash}`

    // 3. Check Level 2 Registry Cache
    if (styleCache.has(hash)) {
        objectRefCache.set(style, className)
        return className
    }

    // 4. Cache MISS: Build CSS string and inject
    const css = buildCSS(className, style)
    injectCSS(css)
    styleCache.set(hash, className)
    objectRefCache.set(style, className)

    return className
}

















///// Suggested By Gemini
// import { injectCSS, styleCache } from "../store/StyleRegistry"
// import type { CSSProperties } from "react"

// export type StyleModifier = "focus" | "hover" | "active" | "disabled" | "focusWithin"

// export type ElementStyle = CSSProperties & {
//     focus?: CSSProperties
//     hover?: CSSProperties
//     active?: CSSProperties
//     disabled?: CSSProperties
//     focusWithin?: CSSProperties
// }

// export type StrInputTarget =
//     | "root"
//     | "input"
//     | "placeholder"
//     | "line"
//     | "template"
//     | "options"
//     | "option"
//     | "search"

// export type FieldStyle = {
//     [K in StrInputTarget]?: ElementStyle
// }

// // Stored in kebab-case to match converted keys directly
// const UNITLESS = new Set([
//     "opacity",
//     "z-index",
//     "font-weight",
//     "line-height",
//     "flex",
//     "flex-grow",
//     "flex-shrink",
//     "order",
//     "zoom",
// ])

// const BASE_SELECTORS: Record<string, string> = {
//     root: ".field-root",
//     input: ".field-input",
//     placeholder: ".placeholder-input",
//     line: ".line-input",
//     template: ".template-input",
//     options: ".select-options-container",
//     option: ".select-option",
//     search: ".select-search",
// }

// const MODIFIER_SELECTORS: Record<string, string> = {
//     focus: ":focus",
//     hover: ":hover",
//     active: '[data-active="true"]',
//     disabled: ":disabled",
//     focusWithin: ":focus-within",
// }

// // Fast string cache for kebab-case transformations
// const kebabCache = new Map<string, string>()

// function toKebab(str: string): string {
//     let cached = kebabCache.get(str)
//     if (cached) return cached

//     if (str.startsWith("--")) {
//         kebabCache.set(str, str)
//         return str
//     }

//     cached = str.replace(/[A-Z]/g, m => "-" + m.toLowerCase())
//     kebabCache.set(str, cached)
//     return cached
// }

// // Fast 32-bit FNV-1a inline string hasher
// function fnv1a(str: string, seed = 0x811c9dc5): number {
//     let hval = seed
//     for (let i = 0; i < str.length; i++) {
//         hval ^= str.charCodeAt(i)
//         hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24)
//     }
//     return hval >>> 0
// }

// /**
//  * Single-pass: Builds CSS rules and generates hash simultaneously in deterministic order.
//  */
// function compileStyle(style: FieldStyle): { css: string; hash: string } {
//     let cssRules = ""
//     let hash = 0x811c9dc5

//     // Sort targets to guarantee stable hashing without JSON.stringify overhead
//     const targets = Object.keys(style).sort()

//     for (let i = 0; i < targets.length; i++) {
//         const target = targets[i]
//         const targetStyle = style[target as StrInputTarget]
//         if (!targetStyle) continue

//         const baseSelector = BASE_SELECTORS[target]
//         if (!baseSelector) continue

//         let directCSS = ""
//         const modifierCSS: Record<string, string> = {}

//         const keys = Object.keys(targetStyle).sort()
//         for (let j = 0; j < keys.length; j++) {
//             const key = keys[j]
//             const value = (targetStyle as Record<string, any>)[key]
//             if (value === undefined || value === null) continue

//             const modifier = MODIFIER_SELECTORS[key]
//             if (modifier) {
//                 // Nested modifier block (e.g., focus: { ... })
//                 let modBlock = ""
//                 const subKeys = Object.keys(value).sort()
//                 for (let k = 0; k < subKeys.length; k++) {
//                     const subKey = subKeys[k]
//                     const subVal = value[subKey]
//                     if (subVal === undefined || subVal === null) continue

//                     const cssKey = toKebab(subKey)
//                     const formatted = typeof subVal === "number" && !UNITLESS.has(cssKey) && !cssKey.startsWith("--")
//                         ? `${subVal}px`
//                         : subVal
//                     modBlock += `${cssKey}:${formatted};`
//                 }
//                 if (modBlock) {
//                     modifierCSS[modifier] = modBlock
//                 }
//             } else {
//                 // Direct CSS property
//                 const cssKey = toKebab(key)
//                 const formatted = typeof value === "number" && !UNITLESS.has(cssKey) && !cssKey.startsWith("--")
//                     ? `${value}px`
//                     : value
//                 directCSS += `${cssKey}:${formatted};`
//             }
//         }

//         // Accumulate Direct Styles
//         if (directCSS) {
//             const ruleFragment = ` __CLS__ ${baseSelector}{${directCSS}}`
//             cssRules += ruleFragment
//             hash = fnv1a(ruleFragment, hash)
//         }

//         // Accumulate Modifier Styles
//         for (const [pseudo, modBlock] of Object.entries(modifierCSS)) {
//             const ruleFragment = ` __CLS__ ${baseSelector}${pseudo}{${modBlock}}`
//             cssRules += ruleFragment
//             hash = fnv1a(ruleFragment, hash)
//         }
//     }

//     const hashStr = hash.toString(36)
//     return {
//         hash: hashStr,
//         css: cssRules.replace(/__CLS__/g, `.input-style-${hashStr}`),
//     }
// }

// export function getStyleClass(style?: FieldStyle): string {
//     if (!style) return ""

//     const { css, hash } = compileStyle(style)
//     const className = `input-style-${hash}`

//     if (styleCache.has(hash)) {
//         return className
//     }

//     injectCSS(css)
//     styleCache.set(hash, className)

//     return className
// }


















// import { injectCSS, styleCache } from "../store/StyleRegistry"

// import type { CSSProperties } from "react"

// export type StyleModifier = "focus" | "hover" | "active" | "disabled" | "focusWithin"

// // Base CSS properties + optional nested modifier states
// export type ElementStyle = CSSProperties & {
//     focus?: CSSProperties
//     hover?: CSSProperties
//     active?: CSSProperties
//     disabled?: CSSProperties
//     focusWithin?: CSSProperties
// }

// export type StrInputTarget = "root" | "input" | "placeholder" | "line" | "template" | "options" | "option" | "search"

// export type FieldStyle = {
//     [K in StrInputTarget]?: ElementStyle
// }

// const UNITLESS = new Set([
//     "opacity",
//     "zIndex",
//     "fontWeight",
//     "lineHeight",
//     "flex",
//     "flexGrow",
//     "flexShrink",
//     "order",
//     "zoom",
// ])

// const BASE_SELECTORS: Record<string, string> = {
//     root: ".field-root",
//     input: ".field-input",
//     placeholder: ".placeholder-input",
//     line: ".line-input",
//     template: ".template-input",
//     options: ".select-options-container",
//     option: ".select-option",
//     search: ".select-search",
// }

// const MODIFIER_SELECTORS: Record<string, string> = {
//     focus: ":focus",
//     hover: ":hover",
//     active: '[data-active="true"]',
//     disabled: ":disabled",
//     focusWithin: ":focus-within",
// }

// function stableStringify(value: any): string {
//     if (value === null || typeof value !== "object") {
//         return JSON.stringify(value)
//     }

//     if (Array.isArray(value)) {
//         return `[${value.map(stableStringify).join(",")}]`
//     }

//     return `{${Object.keys(value)
//         .sort()
//         .map(key =>
//             `${JSON.stringify(key)}:${stableStringify(value[key])}`
//         )
//         .join(",")}}`
// }

// function hashStyle(obj: any): string {
//     // const str = JSON.stringify(obj)
//     const str = stableStringify(obj)

//     let hash = 0

//     for (let i = 0; i < str.length; i++) {
//         hash = ((hash << 5) - hash) + str.charCodeAt(i)
//         hash |= 0
//     }

//     return Math.abs(hash).toString(36)
// }

// function camelToKebab(str: string) {
//     return str.replace(/[A-Z]/g, m => "-" + m.toLowerCase())
// }

// function formatCSSValue(key: string, value: unknown) {
//     if (typeof value !== "number") {
//         return String(value)
//     }

//     return UNITLESS.has(key)
//         ? String(value)
//         : `${value}px`
// }

// function objectToCSS(style: Record<string, any>) {

//     return Object.entries(style)
//         .map(([key, value]) => {

//             const cssKey = camelToKebab(key)

//             return `${cssKey}: ${formatCSSValue(cssKey, value)};`

//             // if (typeof value === "number") {
//             //     return `${cssKey}:${value}px;`
//             // }

//             // return `${cssKey}:${value};`
//         })
//         .join("")
// }

// function generateCSS(
//     className: string,
//     style: FieldStyle
// ) {

//     let css = ""

//     for (const [target, targetStyle] of Object.entries(style)) {
//         if (!targetStyle) continue
//         const baseSelector = BASE_SELECTORS[target]
//         if (!baseSelector) continue

//         const directRules: Record<string, any> = {}
//         const modifierRules: Record<string, Record<string, any>> = {}

//         for (const [key, value] of Object.entries(targetStyle)) {
//             if (MODIFIER_SELECTORS[key]) {
//                 modifierRules[key] = value as Record<string, any>
//             } else {
//                 directRules[key] = value
//             }
//         }

//         // Output base element styles
//         if (Object.keys(directRules).length > 0) {
//             css += `.${className} ${baseSelector} { ${objectToCSS(directRules)} }`
//         }

//         // Output nested modifier styles
//         for (const [mod, modRules] of Object.entries(modifierRules)) {
//             const pseudo = MODIFIER_SELECTORS[mod]
//             css += `.${className} ${baseSelector}${pseudo} { ${objectToCSS(modRules)} }`
//         }
//     }

//     return css
// }

// export function getStyleClass(style?: FieldStyle) {

//     if (!style) return ""

//     const hash = hashStyle(style)

//     const className =
//         `input-style-${hash}`

//     if (styleCache.has(hash)) {
//         return className
//     }

//     const css =
//         generateCSS(className, style)

//     injectCSS(css)

//     styleCache.set(hash, className)

//     return className
// }

















// import { injectCSS, styleCache } from "../store/StyleRegistry"

// import type { CSSProperties } from "react"

// export interface FieldStyle {
//     input?: CSSProperties
//     placeholder?: CSSProperties
//     line?: CSSProperties
//     template?: CSSProperties
//     root?: CSSProperties
// }

// const selectorMap : Record<string, string> = {
//     root: ".field-root",
//     input: ".field-input",
//     placeholder: ".placeholder-input",
//     line: ".line-input",
//     template: ".template-input",
// }

// function hashStyle(obj: any): string {
//     const str = JSON.stringify(obj)

//     let hash = 0

//     for (let i = 0; i < str.length; i++) {
//         hash = ((hash << 5) - hash) + str.charCodeAt(i)
//         hash |= 0
//     }

//     return Math.abs(hash).toString(36)
// }

// function camelToKebab(str: string) {
//     return str.replace(/[A-Z]/g, m => "-" + m.toLowerCase())
// }

// function objectToCSS(style: Record<string, any>) {

//     return Object.entries(style)
//         .map(([key, value]) => {

//             const cssKey = camelToKebab(key)

//             if (typeof value === "number") {
//                 return `${cssKey}:${value}px;`
//             }

//             return `${cssKey}:${value};`
//         })
//         .join("")
// }

// function generateCSS(
//     className: string,
//     style: FieldStyle
// ) {

//     let css = ""

//     for (const [target, rules] of Object.entries(style)) {

//         if (!rules) continue

//         const selector =
//             `.${className} ${selectorMap[target]}`

//         css += `
//             ${selector}{
//                 ${objectToCSS(rules)}
//             }
//         `
//     }

//     return css
// }

// export function getStyleClass(style?: FieldStyle) {

//     if (!style) return ""

//     const hash = hashStyle(style)

//     const className =
//         `input-style-${hash}`

//     if (styleCache.has(hash)) {
//         return className
//     }

//     const css =
//         generateCSS(className, style)

//     injectCSS(css)

//     styleCache.set(hash, className)

//     return className
// }