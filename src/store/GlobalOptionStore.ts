import type { DropdownDependencyFieldType } from "./DropdownDepStore"
import type { DropdownFieldType } from "./DropdownStore"

class OptionGlobal {
    private _field: DropdownFieldType | DropdownDependencyFieldType | null = null
    private _filteredOptions: { value: any, label: string, raw?: any }[] = []
    private _highlightedIndex: number = 0
    private _search = ""
    public optionElements = new Map<number, HTMLDivElement>()
    private optionsListeners = new Map<string, Set<() => void>>()
    private prevEl: HTMLDivElement | null = null

    activate(field: DropdownFieldType | DropdownDependencyFieldType) {
        this.deactivate(this._field!)
        console.log('activating')

        this._field = field

        this._search = ""

        this._filteredOptions = field._options
        // console.log('the fil opt', this._filteredOptions)

        // this._highlightedIndex =
        //     field.getInitialHighlightIndex()

        this.optionElements.clear()
    }

    deactivate(field: DropdownFieldType | DropdownDependencyFieldType) {

        if (this._field !== field) return

        this._field = null

        this._search = ""
        this._filteredOptions = []
        this._highlightedIndex = 0

        this.optionElements.clear()
        console.log('deactivating')
    }


    subscribe = (fieldName: string, cb: () => void) => {
        if (!this.optionsListeners.has(fieldName)) {
            this.optionsListeners.set(fieldName, new Set())
        }
        this.optionsListeners.get(fieldName)!.add(cb)

        console.log('the listeners are', this.optionsListeners)
        return () => {
            const listeners = this.optionsListeners.get(fieldName)

            if (!listeners) return

            listeners.delete(cb)

            // if (listeners.size === 0) {
            this.optionsListeners.delete(fieldName)
            // }
        }
    }

    private notify(key: string) {       /////  notify options
        this.optionsListeners.get(key)?.forEach(l => l())
    }

    registerElement(index: number, el: HTMLDivElement, isSelected: boolean, lastIndex: boolean) {
        this.optionElements.set(index, el)
        if (isSelected) {
            this._highlightedIndex = index
            this.highlight(index)
        } else if (lastIndex) {
            if (this._highlightedIndex > 0) return
            this._highlightedIndex = 0
            this.highlight(0)
        }
    }

    highlight = (next: number) => {
        const nextEl = this.optionElements.get(next)
        if (!nextEl) return
        // 1. Unset previous active directly via stored element ref
        if (this.prevEl) {
            this.prevEl.removeAttribute('data-active')
        }
        // console.log('the is selected element is', nextEl)
        nextEl?.setAttribute('data-active', 'true')
        nextEl?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
        this.highlightedIndex = next
        this.prevEl = nextEl
    }

    setSearch(value: string) {

        if (this._search === value) return

        this._highlightedIndex = 0

        this._search = value

        this.recomputeOptions()
    }

    private recomputeOptions() {
        if (!this._field) return

        const search = this._search.trim().toLowerCase()

        // let highlighted: number = 0

        if (!search) {
            console.log('going to no search')
            this._filteredOptions = this._field?._options
            // highlighted = this._selectedIndex
        } else {
            this._filteredOptions =
                this._field._options.filter(option =>
                    option.label
                        .toLowerCase()
                        .includes(search)
                )

        }
        this.notify(this._field.name)
    }

    set highlightedIndex(v: number) {
        if (this._highlightedIndex === v) return
        this._highlightedIndex = v
    }

    get highlightedIndex() {
        return this._highlightedIndex
    }

    get field() {
        return this._field
    }

    get options() {
        return this._filteredOptions
    }

    select(index: number) {
        if (this._field) {
            this._field.value = this._filteredOptions[index]?.value
            console.log('the selected value is', this._field)
            if (this._field.el) {
                this._field.el.focus()
            }
            this._field.close()
        }
    }

    handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {

        e.stopPropagation()

        const options = this._filteredOptions

        if (!options.length) return

        switch (e.key) {

            case "ArrowDown":
                e.preventDefault()

                this.highlight(
                    this._highlightedIndex === options.length - 1
                        ? 0
                        : this._highlightedIndex + 1
                )

                break

            case "ArrowUp":
                console.log('arr up is pressed')
                e.preventDefault()

                this.highlight(
                    this._highlightedIndex === 0
                        ? options.length - 1
                        : this._highlightedIndex - 1
                )

                break

            case "Enter":
                e.preventDefault()

                // this.selectHighlighted()
                this.select(this._highlightedIndex)

                break

            case "Escape":
                e.preventDefault()

                this._field?.close()

                break

            case "Tab":
                // e.preventDefault()

                this._field?.close()

                break
        }
    }

    destroy() {
        this.optionElements.clear()
        this.optionsListeners.clear()
    }
}

export const GlobalOptionStore = new OptionGlobal()
export type GlobalOptionType = typeof GlobalOptionStore