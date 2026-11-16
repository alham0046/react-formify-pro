import { forwardRef, useImperativeHandle, useMemo, useRef, type CSSProperties } from 'react'
import InputTemplate from './InputTemplate'
import DropdownModal from './DropdownModal'
import { useContainerContext } from '../context/ContainerContext'
import { getStyleClass } from '../Utils/StyleInjection'
import type { DropdownRefType } from './SelectInput'
import type { SelectDependentProps } from '../typeDeclaration/dropdownProps'
import type { DropdownDependencyFieldType } from '../store/DropdownDepStore'
// import { useDropdownDependentField } from '../hooks/useField'
import { useIsHidden } from '../hooks/ExternalSyncHooks'
import { useNameScope } from '../context/NameScopeContext'
import { createDependentDropdown } from '../Utils/DropdownUtils'

const SelectDependentInput = forwardRef<DropdownRefType, SelectDependentProps>((props, ref) => {
    const {
    name,
    placeholder,
    options,
    children,
    onChange,
    onToggleDropdown,
    dependsOn,
    includeDefaultLabel = false,
    initialLabel = 'Select',
    disabled = false,
    hideElement = false,
    searchable = false,
    initialValue = '',
    style,
    className = '',
    ...rest
} = props
    const { inputStore } = useContainerContext()
    const scope = useNameScope()

    const anchorName = useRef(
        `--field-anchor-${crypto.randomUUID()}`
    ).current;

    // const hasRendered = useRef<boolean>(false)
    // let field : InputFieldType | null = null
    const field = useRef<DropdownDependencyFieldType | null>(null)
    if (field.current === null) {
        const fieldInstance = createDependentDropdown(
            placeholder,
            name,
            options,
            inputStore,
            initialValue,
            initialLabel,
            includeDefaultLabel,
            dependsOn,
            scope
        ) as DropdownDependencyFieldType
        // fieldInstance.displayCode = 'SelectInput'
        hideElement && inputStore.registerHidden(fieldInstance, hideElement)
        disabled && inputStore.registerDisabled(fieldInstance, disabled)
        fieldInstance.subscribe(() => {
            // const setFields = inputStore.setFields
            onChange?.({
                value: fieldInstance.value,
                setFields : (field : Record<string, any>) => fieldInstance.setFields(field),
                arrayAction : (path?: string) => fieldInstance.getArray(path),
                reset: (target?: string | string[]) => fieldInstance.reset(target)
            })
        })
        fieldInstance.subscribeToggle(() => {
            onToggleDropdown?.(fieldInstance.isOpen)
        })
        field.current = fieldInstance
    }
    // if (!hasRendered.current) {
    //     field.current = useDropdownDependentField(
    //         placeholder,
    //         name,
    //         options,
    //         inputStore,
    //         // initialValue,
    //         initialLabel,
    //         includeDefaultLabel,
    //         dependsOn,
    //     ) as DropdownDependencyFieldType
    //     hideElement && inputStore.registerHidden(field.current, hideElement)
    //     disabled && inputStore.registerDisabled(field.current, disabled)
    //     field.current.subscribe(() => {
    //         const setFields = inputStore.setFields
    //         onChange && onChange({ value: field.current?.value, setFields })
    //     })
    //     hasRendered.current = true
    // }

    const styleClass = useMemo(() => {
        return getStyleClass(style)
    }, [style])

    useImperativeHandle(
        ref,
        () => ({
            open: () => setTimeout(() => {
                field.current?.open()
            }, 0),
            close: () => setTimeout(() => {
                field.current?.close()
            }, 0),
        }), [])

    const hiddenValue: boolean = useIsHidden(field.current!)

    if (hiddenValue) {
        return null;
    }
    return (
        <div className={`field-root field-select-root ${styleClass} ${className}`} style={{ '--float': 1, '--anchor-name': `${anchorName}` } as CSSProperties}>
            {/* {console.log('rendering StrInput', modifiedName)} */}
            <InputTemplate
                name={field.current!.name}
                placeholder={placeholder}
            >
                {/* <Select options={field.current!.options} field={field.current!} /> */}
                <DropdownModal
                    // onToggleDropdown={onToggleDropdown}
                    searchable={searchable}
                    field={field.current!}
                    {...rest}
                />
            </InputTemplate>
            {children}
        </div>
    )
})

export default SelectDependentInput
