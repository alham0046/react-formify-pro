export const stringValidation = (data: number, stringify: boolean) => {
    if (typeof data !== 'number') return null
    if (!stringify) return data
    else return data.toString()
}