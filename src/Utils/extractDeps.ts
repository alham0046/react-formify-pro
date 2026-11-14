const DEPENDENCY_REGEX = /\$\{([^}]+)\}/g

export function extractDependencies(expression: string): string[] {
    const dependencies = new Set<string>()

    for (const match of expression.matchAll(DEPENDENCY_REGEX)) {
        dependencies.add(match[1].trim())
    }

    return [...dependencies]
}