export const isIndex = (key: string) => {
  return key !== "" && !isNaN(Number(key))
}

export interface FieldStyle extends React.CSSProperties {
    // Nothing special required initially.
}

export const toCSSUnit = (
  value: string | number | undefined
): string | undefined => {
  if (value === undefined) return undefined

  if (typeof value === "number") {
    return `${value}px`
  }

  return value
}

export function fieldStyleToCSS(
    style?: FieldStyle
): React.CSSProperties {
    if (!style) return {}

    return {
        "--field-height": toCSSUnit(style.height),
        "--field-border-width": toCSSUnit(style.borderWidth),
        "--field-radius": toCSSUnit(style.borderRadius),
        "--field-padding-x": toCSSUnit(style.paddingX),
        "--field-font-size": toCSSUnit(style.fontSize),
        "--field-font-weight": style.fontWeight,
    } as React.CSSProperties
}