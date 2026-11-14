import { type CSSProperties, type FC, type ReactNode, type RefObject, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { memo } from 'react'
import { ContainerContext } from '../context/ContainerContext';
import type { TWInputStyleProp } from '../typeDeclaration/stylesProps';
import { getOrCreateFormStore } from '../store/InputStoreRegistry';
import { randomString } from '../functions/stringManiputation';
import type { InputFormType } from '../store/InputFormStore';
import { getStyleClass, type FieldStyle } from '../Utils/StyleInjection';

interface InputContainerProps {
  children: ReactNode;
  style?: CSSProperties
  className?: string
  formId?: string
  initialData?: Record<string, any>
  mode?: "default" | "edit"
  // colorScheme?: FieldVisualState[]
  fieldStyle?: FieldStyle
  // sharedTwStyles?: Partial<TWInputStyleProp>
  // modalContainerRef?: RefObject<HTMLDivElement>
}

const InputContainer: FC<InputContainerProps> = ({ children, className, style, formId, fieldStyle, mode = "default", initialData = {} }) => {

  const randomId = randomString()

  const id = formId || randomId

  const storeRef = useRef<InputFormType | null>(null)

  if (storeRef.current === null) {
    const store = getOrCreateFormStore(id)
    store.initializeForm(mode, initialData)
    storeRef.current = store
  }

  const containerRef = useRef<HTMLDivElement | null>(null)

  const styleClass = useMemo(() => {
    return getStyleClass(fieldStyle)
  }, [fieldStyle])


  /**
   * Provide stable context reference
   */
  const contextValue = useMemo(() => ({
    // modalContainerRef,
    inputStore: storeRef.current!
  }), [])

  useLayoutEffect(() => {
    const mainContainerEl = containerRef.current
    if (!(mainContainerEl instanceof HTMLElement)) return

    // storeRef.current?.setContainerRef(mainContainerEl)

    const updateVisualBackground = () => {
      let current: HTMLElement | null = mainContainerEl
      let backgroundColor: string = ''

      // Climb up to find the closest non-transparent background
      while (current) {
        const style = window.getComputedStyle(current)
        backgroundColor = style.backgroundColor
        if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
          break
        }
        current = current.parentElement
      }

      // Instead of setting it in the store, apply it directly as a CSS Variable on the container!
      if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === '') {
        mainContainerEl.style.setProperty('--line-bg', 'white')
      } else {
        mainContainerEl.style.setProperty('--line-bg', backgroundColor)
      }
    }

    // 1. Run initially on mount
    updateVisualBackground()

    // 2. Set up an observer so it responds instantly to Tailwind theme changes (like .dark toggles)
    const observer = new MutationObserver(() => {
      requestAnimationFrame(() => {
        updateVisualBackground()
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'] // Catches class changes or attribute updates
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    return () => {
      storeRef.current?.clear()
    }
  },[])

  return (
    <ContainerContext.Provider value={contextValue}>
      {/* {console.log('rendering input container', contextValue.sharedTw)} */}
      <div
        data-input-container
        ref={containerRef}
        // style={style}
        style={style}
        className={`input-container ${styleClass} ${className}`}
      >
        {children}
      </div>
    </ContainerContext.Provider>
  )
}

export default memo(InputContainer)



// style={{
//   ...style,
//   ['--line-bg' as any]: storeRef.current.backgroundColor
// }}

// import React, { FC, ReactNode, RefObject, useEffect, useMemo, useRef, useState } from 'react'
// import { memo } from 'react'
// import { useInputStore } from '../hooks/useInputStore'
// import { camelCase } from 'src/functions/camelCase';
// import { flattenChildren } from 'src/Utils/flattenChildren';
// import { handleInitialValue } from 'src/Utils/setInitialValue';

// interface InputContainerProps {
//   children: ReactNode;
//   inputContainerStyles?: string;
//   // sharedStyles?: object
//   sharedStyles?: {
//     placeholderStyles?: string
//     inputStyles?: string
//     [key: string]: any
//   }
//   modalContainerRef?: RefObject<HTMLDivElement>
// }

// interface InputChildProps {
//   onInputChange: (modifiedName: string, value: any) => void;
//   [key: string]: any; // optional if child has more props
// }

// const InputContainer: FC<InputContainerProps> = ({ children, inputContainerStyles, sharedStyles, modalContainerRef }) => {
//   const setInputValue = useInputStore((state) => state.setInputValue)

//   const containerRef = useRef<HTMLDivElement | null>(null)
//   const [bgColor, setBgColor] = useState("");

//   const handleInputChange = (modifiedName: string, value: any): void => {
//     setInputValue(modifiedName, value)
//   }
//   const childrenArray = useMemo(() => flattenChildren(children), [children]);

//   /////// This useeffect sets the background color so that strike-through effect in inputs are flawless
//   useEffect(() => {
//     if (containerRef.current instanceof HTMLElement) {
//       let current: HTMLElement | null = containerRef.current;
//       // let backgroundColor: string | null = null;
//       let backgroundColor: string = '';

//       while (current) {
//         const style = window.getComputedStyle(current);
//         // const bg = style.backgroundColor;
//         backgroundColor = style.backgroundColor;
//         if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
//           // backgroundColor = bg
//           break; // found non-transparent background
//         }
//         current = current.parentElement;
//       }
//       // console.log('the bg color is', backgroundColor)
//       if (backgroundColor == 'rgba(0, 0, 0, 0)' || backgroundColor == '') setBgColor('white')
//       else setBgColor(backgroundColor)
//       // setBgColor(backgroundColor ?? 'white')
//       // setContainerBgColor(backgroundColor || 'white'); // fallback just in case
//     }
//   }, []);

//   return (
//     <div ref={containerRef} className={inputContainerStyles}>
//       {
//         // React.Children.map(children, (child) => {
//         childrenArray.map((child, index) => {
//           if (!React.isValidElement<InputChildProps>(child)) return null;
//           const childType = child.type
//           // const childSafe = child as React.ReactElement<InputChildProps>
//           const isDOMElement = typeof childType === 'string';
//           if (isDOMElement) return child;
//           const childProps = child.props
//           const modifiedName = (childProps.name || childProps.placeholder) ? childProps.name || camelCase(childProps.placeholder) : undefined
//           if (childProps.placeholder) {
//             handleInitialValue(modifiedName, childProps.initialValue, setInputValue, (childType as any).type.name)
//           }
//           if (React.isValidElement(child)) {
//             return React.cloneElement(child, {
//               key: child.key ?? index,
//               onInputChange: handleInputChange,
//               name: modifiedName,
//               sharedStyles,
//               bgColor,
//               modalContainerRef
//             })
//           }
//           return child
//         })
//       }
//     </div>
//   )
// }

// export default memo(InputContainer)