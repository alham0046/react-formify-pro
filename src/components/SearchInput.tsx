import { CSSProperties, forwardRef, memo, useMemo, useRef } from "react"
import { type InputProps, type InputRefProps } from "../typeDeclaration/inputProps"
import InputTemplate from "./InputTemplate"
import Input from "./Input"
import { useContainerContext } from "../context/ContainerContext"
import { InputFieldType } from "../store/InputFieldStore"
import { createField } from "../Utils/FieldUtils"
import { useNameScope } from "../context/NameScopeContext"
import { getStyleClass } from "../Utils/StyleInjection"
import { useIsDisabled, useIsHidden } from "../hooks/ExternalSyncHooks"
import DropdownOpen from "./DropdownOpen"
import { DropdownField, DropdownFieldType } from "../store/DropdownStore"
import { GlobalOptionStore } from "../store/GlobalOptionStore"
type SearchOnChange<T> = (
    value: string | number
) => T[] | Promise<T[]>

type SearchInputBaseProps = Omit<InputProps, "onChange">

interface SearchInputProps<T> extends SearchInputBaseProps {
    onChange: SearchOnChange<T>
    renderItem?: (item: T, index: number, active: boolean) => React.ReactNode
    onSelect?: (item: T) => void
}

const SearchInput = forwardRef<InputRefProps, SearchInputProps<any>>(({ ...props }, ref) => {
    const { placeholder, name, children, onChange, style, className = "", renderItem, onSelect, initialValue = "", disabled = false, hideElement = false, privacy = false, ...rest } = props
    const { inputStore } = useContainerContext()
    const scope = useNameScope()

    const searchRef = useRef<HTMLDivElement | null>(null)

    const anchorName = useRef(
        `--field-anchor-${crypto.randomUUID()}`
    ).current;
    // const [search, setSearch] = useState<any[]>([])
    const timeOutObj = useRef<any>(null)
    const field = useRef<InputFieldType | null>(null)

    const dropdownField = useRef<DropdownFieldType | null>(null)
    if (field.current === null) {
        const fieldInstance = createField(
            placeholder,
            name,
            inputStore,
            initialValue,
            scope
        ) as InputFieldType
        fieldInstance.displayCode = 'StrInput'
        hideElement && inputStore.registerHidden(fieldInstance, hideElement)
        disabled && inputStore.registerDisabled(fieldInstance, disabled)
        const dropdownFieldInstance = new DropdownField('search-internal', "", [], null as any, null as any, "")
        dropdownFieldInstance.displayCode = 'SearchInput'
        dropdownFieldInstance.subscribe(() => {
            fieldInstance.value = dropdownFieldInstance.value
            onSelect?.(dropdownFieldInstance.value)
        })
        field.current = fieldInstance  //// Here field is mutating current only once. Not a big performance hit but still its faster and a point to learn
        dropdownField.current = dropdownFieldInstance
    }

    const styleClass = useMemo(() => {
        return getStyleClass(style)
    }, [style])

    // useEffect(() => {
    //     inputStore.validatorStore.register(modifiedName, {required, validators: []})
    // }, [required])

    const disabledValue: boolean = useIsDisabled(field.current!)

    const hiddenValue: boolean = useIsHidden(field.current!)

    const handleChange = (value: string | number) => {
        // const changedValue = e.target.value
        clearTimeout(timeOutObj.current)
        timeOutObj.current = setTimeout(async () => {
            // setSearch(value as string)
            if (!value) return
            const searchedData = await onChange(value)
            console.log('the searched data is', searchedData)
            const dropdownInstance = dropdownField.current
            if (!dropdownInstance) return
            dropdownInstance.options = searchedData
            dropdownInstance.open()
            // console.log('the options are', dropdownInstance._options)
        }, 800);
        const fieldValue = field.current
        if (!fieldValue) return
        fieldValue.value = value
    }

    if (hiddenValue) return null

    return (
        <div
            className={`field-root select-container ${styleClass} ${className}`}
            ref={(el) => {
                if (el) {
                    dropdownField.current!.el = el
                }
            }}
            onKeyDown={GlobalOptionStore.handleKeyDown}
            style={{ '--anchor-name': `${anchorName}` } as CSSProperties}
        >
            {/* {console.log('rendering StrInput', modifiedName)} */}
            
            <InputTemplate
                name={field.current.name}
                placeholder={placeholder}
            >
                <Input
                    ref={ref}
                    field={field.current}
                    refRequired={true}
                    placeholder={placeholder}
                    disabled={disabledValue}
                    type={'text'}
                    handleChange={handleChange}
                    {...rest}
                />
            </InputTemplate>
            {/* <DropdownSearchModal onSelect={handleSelect} twOptionBoxStyles={tw.twOptionBoxStyles!} twOptionItemStyles={tw.twOptionItemStyles!} renderItem={renderItem} name={modifiedName} dropdownOffset={resolvedStyle.dropdownOffset!} /> */}
            <DropdownOpen field={dropdownField.current!} inputRef={searchRef} searchable={false} renderItem={renderItem} />
            {/* <DropdownSearchModal onSelect={handleSelect} twStyle={tw} renderItem={renderItem} name={modifiedName} style={resolvedStyle} /> */}
            {/* <DropdownSearchModal options={search} onSelect={handleSelect} open={search.length > 0} renderItem={renderItem} /> */}
            {children}
        </div>
    )
})

export default memo(SearchInput)






// import { forwardRef, memo, useEffect, useRef, useState } from "react"
// import type { InputProps, InputRefProps } from "../typeDeclaration/inputProps"
// import { useFieldName } from "../hooks/useFieldName"
// import { handleInitialValue } from "../Utils/setInitialValue"
// import { useComputedExpression } from "../hooks/useComputedExpression"
// import { inputStore } from "../InputStore"
// import InputTemplate from "./InputTemplate"
// import DropdownSearchModal from "./DropdownSearchModal"

// type SearchOnChange<T> = (
//     value: string | number
// ) => T[] | Promise<T[]>


// interface SearchInputProps<T> extends Exclude<InputProps, "onChange"> {
//     onChange: SearchOnChange<T>
//     renderItem?: (item: T, index: number, active: boolean) => React.ReactNode
//     onSelect?: (item: T) => void
// }

// const SearchInput = forwardRef<InputRefProps, SearchInputProps<any>>(({ ...props }, ref) => {
//     const { placeholder, name, children, onChange, renderItem, initialValue = "", disabled = false, hideElement = false, containerStyles = "", privacy = false, ...rest } = props
//     const [search, setSearch] = useState<any[]>([])
//     const timeOutObj = useRef<any>(null)
//     const modifiedName = useFieldName(placeholder, name)

//     useEffect(() => {
//         handleInitialValue(modifiedName, initialValue)
//     }, [])
//     const disabledValue: boolean = useComputedExpression(disabled, modifiedName)

//     const hiddenValue: boolean = useComputedExpression(hideElement)

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const changedValue = e.target.value
//         clearTimeout(timeOutObj.current)
//         timeOutObj.current = setTimeout(async () => {
//             // setSearch(value as string)
//             const searchedData = await onChange(changedValue)
//             setSearch(searchedData)
//         }, 500);
//         // const nativeEvent = e.nativeEvent as unknown as InputEvent; // Type assertion to InputEvent
//         // onChange?.(changedValue, nativeEvent.data);
//         inputStore.setValue(modifiedName, changedValue)
//     }

//     const onValueChange = (value: string | number) => {
//         if (value === "") return
//         // console.log('rendering searchinput', search.length)
//         // clearTimeout(timeOutObj.current)
//         // timeOutObj.current = setTimeout(async () => {
//         //     // setSearch(value as string)
//         //     const searchedData = await onChange(value)
//         //     setSearch(searchedData)
//         // }, 500);
//     }

//     const handleSelect = (value: string) => {
//         // onChange(value)
//         inputStore.setValue(modifiedName, value)
//         setSearch([])
//     }

//     if (hiddenValue) return null

//     return (
//         <div className={containerStyles} style={{ position: 'relative' }}>
//             <InputTemplate
//                 ref={ref}
//                 name={modifiedName}
//                 onChange={onValueChange}
//                 disabled={disabledValue}
//                 handleChange={handleChange}
//                 placeholder={placeholder}
//                 type={privacy ? 'password' : 'text'}
//                 {...rest}
//             />
//             <DropdownSearchModal options={search} onSelect={handleSelect} open={search.length > 0} renderItem={renderItem} />
//             {children}
//         </div>
//     )
// })

// export default memo(SearchInput)
