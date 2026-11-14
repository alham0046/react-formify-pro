// StyleRegistry.ts

const styleCache = new Map<string, string>()

let styleElement: HTMLStyleElement | null = null

function getStyleSheet() {
    if (!styleElement) {
        styleElement = document.createElement("style")
        styleElement.id = "input-library-styles"
        document.head.appendChild(styleElement)
    }

    return styleElement
}

export function injectCSS(css: string) {
    const sheet = getStyleSheet()

    sheet.appendChild(document.createTextNode(css))
}

export { styleCache }