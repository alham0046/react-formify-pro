import React, { memo, useCallback, useEffect, useRef } from 'react'
import type { DropdownFieldType } from '../store/DropdownStore'
import { useGlobalOptions } from '../hooks/ExternalSyncHooks'
import { GlobalOptionStore } from '../store/GlobalOptionStore'
import type { DropdownDependencyFieldType } from '../store/DropdownDepStore'

const DropdownOptions: React.FC<{ field: DropdownFieldType | DropdownDependencyFieldType, searchable: boolean, parentRef: React.RefObject<HTMLDivElement | null> }> = ({ field, searchable = false, parentRef }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const options = useGlobalOptions(field)
  const lastIndex = options.length - 1
  const curValue = field.value
  useEffect(() => {
    if (!searchable && containerRef.current) {
      containerRef.current.focus()
    }
  }, [])


  // Click outside listener: Active only while DropdownOptions is mounted
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node

      // 1. Guard against clicks on elements that were unmounted during selection
      if (!document.contains(target)) return

      // 2. Check if click was outside BOTH the options list AND the parent trigger box
      const clickedInsideOptions = containerRef.current?.contains(target)
      const clickedInsideParent = parentRef.current?.contains(target)

      if (!clickedInsideOptions && !clickedInsideParent) {
        console.log('closing dropdown with outside click')
        field.close()
      }
    }

    // Use 'pointerdown' or 'click'
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [field, parentRef])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    GlobalOptionStore.setSearch(value)
  }, [field])

  const stopFocusPropagation = useCallback((e: React.FocusEvent<HTMLDivElement>) => {   /// this propagates to dropdown modal and triggers focus there
    e.stopPropagation()
  }, [])


  return (
    <div className='select-options-container' onKeyDown={GlobalOptionStore.handleKeyDown} onFocus={stopFocusPropagation} tabIndex={-1} ref={containerRef}>
      {searchable && (
        // <div style={{ paddingBlock: '5px', paddingInline: '10px', borderBottom: '1px solid red' }}>
          <input
            id={`search_${field.name}`}
            autoFocus
            onFocus={stopFocusPropagation}
            onChange={handleSearchChange}
            className="select-search"
            placeholder="Search..."
          />
        // </div>
      )}
      <div>
        {
          options.map((option, index) => {
            const optionValue = option.value
            const optionLabel = option.label
            const isSelected = optionValue === curValue
            return (
              <div
                key={optionLabel}
                role="option"
                aria-selected={isSelected}
                ref={el => {
                  if (!el) return
                  GlobalOptionStore.registerElement(index, el, isSelected, lastIndex === index)
                }}
                onMouseEnter={() => GlobalOptionStore.highlight(index)}
                className={`select-option`}
                onClick={() => GlobalOptionStore.select(index)}
              >
                {optionLabel}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default memo(DropdownOptions)








// import React, { memo, useCallback, useEffect, useRef, type KeyboardEvent } from 'react'
// import type { DropdownFieldType } from '../store/DropdownStore'
// import { useOptions } from '../hooks/ExternalSyncHooks'
// import { GlobalOptionStore } from '../store/GlobalOptionStore'

// const DropdownOptions: React.FC<{ field: DropdownFieldType, searchable: boolean, parentRef: React.RefObject<HTMLDivElement | null> }> = ({ field, searchable = false, parentRef }) => {
//   const optionRefs = useRef<(HTMLDivElement | null)[]>([])
//   const containerRef = useRef<HTMLDivElement | null>(null)
//   const activeElRef = useRef<HTMLDivElement | null>(null)
//   // const searchRef = useRef<HTMLInputElement | null>(null)
//   // const options = field.options
//   const options = useOptions(field)
//   const curValue = field.value
//   const handleOption = (value: any) => {
//     field.value = value
//     field.close()
//   }

//   const focusOption = useCallback((next: number) => {
//     // if (field.highlightedIndex === next) return
//     // const nextEl = optionRefs.current[next]
//     const nextEl = field.getElement(next)
//     // 1. Unset previous active directly via stored element ref
//     if (activeElRef.current) {
//       activeElRef.current.removeAttribute('data-active')
//     }
//     nextEl?.setAttribute('data-active', 'true')
//     nextEl?.scrollIntoView({ block: 'nearest' })
//     activeElRef.current = nextEl
//     // 2. Update active element ref to current element
//     field.highlightedIndex = next
//   }, [])

//   // Focus the currently selected item (or first item) as soon as options open
//   useEffect(() => {
//     focusOption(field.highlightedIndex)
//   }, [options]);

//   useEffect(() => {
//     if (!searchable && containerRef.current) {
//       containerRef.current.focus()
//     }
//   }, [])


//   // Click outside listener: Active only while DropdownOptions is mounted
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       const target = e.target as Node

//       // 1. Guard against clicks on elements that were unmounted during selection
//       if (!document.contains(target)) return

//       // 2. Check if click was outside BOTH the options list AND the parent trigger box
//       const clickedInsideOptions = containerRef.current?.contains(target)
//       const clickedInsideParent = parentRef.current?.contains(target)

//       if (!clickedInsideOptions && !clickedInsideParent) {
//         console.log('closing dropdown with outside click')
//         field.close()
//       }
//     }

//     // Use 'pointerdown' or 'click'
//     document.addEventListener('click', handleClickOutside)
//     return () => {
//       document.removeEventListener('click', handleClickOutside)
//     }
//   }, [field, parentRef])

//   // const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number, value: any) => {
//   const handleOptionKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
//     // console.log('key down', e)
//     const index = field.highlightedIndex
//     let nextIndex = index
//     if (e.key === 'ArrowUp') {
//       nextIndex = index === 0 ? options.length - 1 : index - 1
//       focusOption(nextIndex)
//     } else if (e.key === 'ArrowDown') {
//       // console.log('the index is', index)
//       nextIndex = index === options.length - 1 ? 0 : index + 1
//       focusOption(nextIndex)
//     } else if (e.key === 'Enter') {
//       e.preventDefault()
//       console.log('the options is', options, nextIndex)
//       handleOption(options[nextIndex].value)
//     }
//   }, [field, options, focusOption, handleOption])

//   const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value
//     field.setSearch(value)
//   }, [field])

//   return (
//     <div className='select-options-container' onKeyDown={handleOptionKeyDown} tabIndex={-1} ref={containerRef}>
//       {searchable && (
//         <div style={{ paddingBlock: '5px', paddingInline: '10px', borderBottom: '1px solid red' }}>
//           <input
//             id={`search_${field.name}`}
//             autoFocus
//             onChange={handleSearchChange}
//             className="select-search"
//             placeholder="Search..."
//           />
//         </div>
//       )}
//       <div>
//         {
//           options.map((option, index) => {
//             const optionValue = option.value
//             const optionLabel = option.label
//             const isSelected = optionValue === curValue
//             return (
//               <div
//                 key={optionLabel}
//                 role="option"
//                 aria-selected={isSelected}
//                 ref={el => {
//                   if (!el) return
//                   optionRefs.current[index] = el
//                   // field.setElement(index, el!, optionValue)
//                   GlobalOptionStore.registerElement(index, el, isSelected)
//                 }}
//                 onMouseEnter={() => focusOption(index)}
//                 className={`select-option ${isSelected ? 'previously-selected-option' : ''}`}
//                 onClick={() => handleOption(optionValue)}
//               >
//                 {optionLabel}
//               </div>
//             )
//           })
//         }
//       </div>
//     </div>
//   )
// }

// export default memo(DropdownOptions)






































// const focusOption = useCallback((prev: number, next: number) => {
//     if (prev === next) return
//     // console.log('requesting highlight on', prev, next)
//     // const prevEl = optionRefs.current[prev]
//     const nextEl = optionRefs.current[next]
//     requestAnimationFrame(() => {
//       // optionRefs.current[index]?.focus()
//       // prevEl?.removeAttribute('data-active')
//       containerRef.current?.querySelector('[data-active]')?.removeAttribute('data-active')
//       nextEl?.setAttribute('data-active', 'true')
//       nextEl?.scrollIntoView({ block: 'nearest' })
//     })
//     field.highlightedIndex = next
//   }, [])








// import React, { memo, useCallback, useEffect, useRef } from 'react'
// import type { DropdownFieldType } from '../store/DropdownStore'
// import { useOptions } from '../hooks/ExternalSyncHooks'

// const DropdownOptions: React.FC<{ field: DropdownFieldType, searchable: boolean }> = ({ field, searchable = false }) => {
//   const optionRefs = useRef<(HTMLDivElement | null)[]>([])
//   // const searchRef = useRef<HTMLInputElement | null>(null)
//   // const options = field.options
//   const options = useOptions(field)
//   const curValue = field.value
//   const handleOption = (index: number) => {
//     field.value = index
//   }

//   const focusOption = useCallback((prev: number, next: number) => {
//     if (prev === next) return
//     console.log('requesting highlight on', prev, next)
//     const prevEl = optionRefs.current[prev]
//     const nextEl = optionRefs.current[next]
//     requestAnimationFrame(() => {
//       // optionRefs.current[index]?.focus()
//       prevEl?.removeAttribute('data-active')
//       nextEl?.setAttribute('data-active', 'true')
//       nextEl?.scrollIntoView({ block: 'nearest' })
//     })
//     field.highlightedIndex = next
//   }, [])

//   // Focus the currently selected item (or first item) as soon as options open
//   useEffect(() => {
//     // if (searchRef.current) {
//     //   // console.log('focusing search', searchRef.current)
//     //   searchRef.current.focus()
//     // }
//     const selectedIdx = options.findIndex((opt) => opt.value === curValue);
//     const initialIndex = selectedIdx !== -1 ? selectedIdx : 0;
//     focusOption(-1, initialIndex);
//   }, []);

//   // useEffect(() => {
//   //   const clickedOutside = (e: MouseEvent) => {
//   //     if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
//   //       console.log('closing dropdown with outside click')
//   //       closeDropdown()
//   //     }
//   //   }
//   //   document.addEventListener('click', clickedOutside)
//   //   return () => {
//   //     document.removeEventListener('click', clickedOutside)
//   //   }
//   // }, [])

//   // const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number, value: any) => {
//   const handleOptionKeyDown = useCallback((e: KeyboardEvent) => {
//     console.log('key down', e)
//     const index = field.highlightedIndex
//     let nextIndex = index
//     // const value = options[index]
//     if (e.key === 'ArrowUp') {
//       nextIndex = index === 0 ? options.length - 1 : index - 1
//       focusOption(index, nextIndex)
//     } else if (e.key === 'ArrowDown') {
//       // console.log('the index is', index)
//       nextIndex = index === options.length - 1 ? 0 : index + 1
//       focusOption(index, nextIndex)
//     } else if (e.key === 'Enter') {
//       e.preventDefault()
//       console.log('the options is', options, nextIndex)
//       handleOption(nextIndex)
//       // handleOption(value)
//       field.close()
//     }
//   },[field, options, focusOption, handleOption])

//   // useEffect(() => {
//   //   console.log('the ref is', optionRefs.current)
//   //   const registerKeyboard = (e: KeyboardEvent) => {
//   //     if (e.key === 'Escape') {
//   //       field.close()
//   //     }
//   //     if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter') {
//   //       handleOptionKeyDown(e)
//   //     }
//   //   }
//   //   document.addEventListener('keydown', registerKeyboard)
//   //   return () => {
//   //     document.removeEventListener('keydown', registerKeyboard)
//   //   }
//   // }, [])

//   const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value
//     // inputStore.optionGraph.setSearch(name, value)
//     // onSearchChange?.(value)
//   }, [name])

//   return (
//     <div className='select-options-container' onKeyDown={handleOptionKeyDown}>
//       {searchable && (
//         <div style={{ paddingBlock: '5px', paddingInline: '10px', borderBottom: '1px solid red' }}>
//           <input
//             id={`search_${field.name}`}
//             // ref={searchRef}
//             autoFocus
//             // value={search}
//             onChange={handleSearchChange}
//             className="select-search"
//             placeholder="Search..."
//           />
//         </div>
//       )}
//       <div>
//         {
//           options.map((option, index) => {
//             const optionValue = option.value
//             const optionLabel = option.label
//             const isSelected = optionValue === curValue
//             return (
//               <div
//                 key={optionLabel}
//                 role="option"
//                 tabIndex={-1}
//                 ref={el => {
//                   optionRefs.current[index] = el
//                 }}
//                 // onKeyDown={(e) => handleOptionKeyDown(e, index, optionValue)}
//                 onMouseEnter={() => focusOption(field.highlightedIndex, index)}
//                 className={`select-option ${isSelected ? 'previously-selected-option' : ''}`}
//                 onClick={() => handleOption(optionValue)}
//               >
//                 {optionLabel}
//               </div>
//             )
//           })
//         }
//       </div>
//     </div>
//   )
// }

// export default memo(DropdownOptions)
