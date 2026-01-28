export const getFileExtension = (filename: string = ""): string => {

    const toArray = filename.split('.')
    const l = toArray.length
    
    if (l == 0) return ""
    return toArray[l - 1]
}