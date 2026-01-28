import React, { useState, createContext, useContext } from "react"
import type { IFile } from "../types"

type InputFileContextType = {
    file: File | null;
    setInputFile: (file: File | null) => void;
    getCSVColumns: () => Promise<string[]>;
}

const InputFileContext = createContext<InputFileContextType | undefined>(undefined)

export const InputFileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [ file, setFile ] = useState<File | null>(null)

    const setInputFile = (file: File | null) => setFile(file)

    const getCSVColumns = async (): Promise<string[]> => {
        if (!file) return []

        try {
            const text = await file.text()
            const firstLine = text.split(/\r?\n/)[0]

            if (!firstLine) return []

            return firstLine.split(',').map(
                header => header.trim().replace(/^["']|["']$/g, '')
            )
        }

        catch (err) {
            console.log(err)
            return []
        }
    }

    return (
        <InputFileContext.Provider value={{
            file,
            setInputFile,
            getCSVColumns
        }}>
            { children } 
        </InputFileContext.Provider>
    )
}

export const useInputFile = (): InputFileContextType => {
    const context = useContext(InputFileContext)
    if (!context) {
        throw new Error("error using input file context")
    }
    return context
}
