import React, { forwardRef, memo, type MouseEvent, type ReactElement, type ReactNode, useCallback, useImperativeHandle, useMemo, useState } from 'react'
// import { getEditedData } from '../Utils/getEditedData';
import { useContainerContext } from '../context/ContainerContext';
import type { OnSubmit } from '../typeDeclaration/inputProps';

// Define the arguments object for clarity
type SubmitData = {
  data: Record<string, any> | null;
  edited: Record<string, any> | null;
  reset: (key?: string[] | string) => void;
};

// Define the exact type signature for the handler function
export type SubmitHandler = (args: SubmitData) => Promise<boolean | void>;

export interface ConfirmationRenderProps {
  success: (data?: any) => void
  cancel: () => void
  data: Record<string, any> | null
  edited: Record<string, any> | null
  isDisabled?: boolean
  reset: (key?: string[] | string) => void
  clear: () => void
}

export interface SubmitButtonRef {
  submit: (e: MouseEvent<HTMLDivElement>) => void
}


interface SubmitProps {
  children: ReactNode
  className?: string
  disabled?: boolean
  closeModal?: () => void
  // onClick?: SubmitHandler
  onClick?: OnSubmit
  /**
   * Configuration for enabling and customizing a confirmation modal.
   * If provided, the final action (onConfirm) is only executed after the user confirms inside the modal.
   * * @example
   * // Assuming ConfirmComponent is a function that takes ConfirmationRenderProps
   * modal: {
   * modalStyle: { width: '50%' }  // width and height can be in % or px or simple number
   * renderConfirmationModel: (props) => <ConfirmComponent {...props} />,  // prefered to be used as function
   * isDisabled : false    // if you want to disable the cornfirmation modal submit button conditionally
   * onConfirm: handleSubmitFunction,    
   * }
   */
  modal?: {
    modalStyle?: { height?: string | number, width?: string | number }
    renderConfirmationModel?: ((props: ConfirmationRenderProps) => ReactNode) | ReactElement<ConfirmationRenderProps>
    isDisabled?: boolean
    onConfirm?: (data: any) => void
  }
}

const SubmitButton = forwardRef<SubmitButtonRef, SubmitProps>((
  {
    children,
    className,
    closeModal,
    disabled = false,
    onClick,
    modal,
  },
  ref
) => {
  const { isDisabled = false, modalStyle, onConfirm, renderConfirmationModel } = modal || {}
  const { inputStore } = useContainerContext()
  // const resetForm = (key?: string[] | string) => inputStore.reset(key)
  // const clearForm = () => inputStore.clear()
  // const { height, width } = modal.modelStyle
  const [openModal, setOpenModal] = useState<boolean>(false)
  const formHelpers = useMemo(() => ({
    reset: (key?: string[] | string) => inputStore.reset(key),
    clear: () => inputStore.clear(),
    get edited() { return inputStore.getEditedData() },
  }), [inputStore])
  // const getSnapshot = () => inputStore.getSnapshot().inputData
  const success = (data?: any) => {
    onConfirm?.(data)
    setOpenModal(false)
    // resetForm()
    closeModal?.()
  }
  const cancel = () => {
    setOpenModal(false)
  }
  // const resetForm = useResetForm
  const handleSubmit = useCallback(async (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || openModal) return
    // if (!inputStore.validatorStore.isValid()) {
    //   console.log('form is not valid')
    //   return
    // }
    // if (renderConfirmationModel) setOpenModal(true)
    // const { inputData: data } = useInputStore.getState()
    // const { data, edited } = getEditedData(inputStore)

    // 🔹 CASE 1: No onClick → open modal directly
    if (!onClick && renderConfirmationModel) {
      setOpenModal(true)
      return
    }
    // console.log('the submit is', data)
    // onClick && onClick({ data, resetForm })
    // 🔹 CASE 2 & 3: onClick exists
    if (onClick) {
      // const shouldOpenModal = await onClick({ data, edited, resetForm, stopPropagation : () => e.stopPropagation(), preventDefault : () => e.preventDefault() })
      const shouldOpenModal = await Promise.resolve(
        onClick({ data : inputStore.data, ...formHelpers, stopPropagation: () => e.stopPropagation(), preventDefault: () => e.preventDefault() })
      )

      if (shouldOpenModal && renderConfirmationModel) {
        setOpenModal(true)
      }
    }
  }, [onClick, disabled, openModal, renderConfirmationModel, inputStore, formHelpers])

  // 🔑 Expose submit() safely
  useImperativeHandle(ref, () => ({
    submit: handleSubmit
  }), [handleSubmit])

  return (
    <div className={`${className}`} onClick={handleSubmit}>
      {children}
      {
        openModal ? (
          <div
            className={`fixed flex cursor-default justify-center items-center z-50 left-0 top-0 w-full h-full bg-gray-500/50 backdrop-blur-lg `}
          >
            <div
              className={`relative grid rounded-lg shadow-lg bg-gray-400 overflow-y-auto max-h-4/5`}
              style={{ height: modalStyle?.height, width: modalStyle?.width || '80%' }}
            >
              <div className=''>
                {typeof renderConfirmationModel === 'function'
                  ? renderConfirmationModel({ cancel, success, data: inputStore.data, isDisabled, ...formHelpers })
                  : React.isValidElement(renderConfirmationModel)
                    ? React.cloneElement(renderConfirmationModel, { cancel, success, data: inputStore.data, isDisabled, ...formHelpers })
                    : null}
              </div>
            </div>
          </div>
        ) : null
      }
    </div>
  )
})

// 1. Export the memoized component
const MemoizedSubmitButton = memo(SubmitButton)

// 2. Set the displayName on the exported component
MemoizedSubmitButton.displayName = 'SubmitButton';

export default MemoizedSubmitButton;

// export default memo(SubmitButton)





// import React, { FC, memo, useCallback } from 'react';
// import { useInputStore } from '../hooks/useInputStore';
// import { useResetForm } from 'src/hooks/useResetForm';

// // Define the exact type signature for the handler function
// // This is the type that will provide the suggestions!
// export type SubmitHandler = (args: {
//     data: Record<string, any>;
//     resetForm: () => void;
// }) => void;

// interface SubmitButtonProps {
//   children: React.ReactNode;
//   className?: string;
//   // onClick: (inputData: any) => void; // Replace 'any' with the actual type of inputData if known
//   onClick : SubmitHandler
// }

// const SubmitButton: FC<SubmitButtonProps> = ({ children, className, onClick }) => {
//   const resetForm = useResetForm()
//   const handleSubmit = useCallback(() => {
//     const { inputData : data } = useInputStore.getState();
//     onClick({data, resetForm});
//   }, [onClick]);

//   return (
//     <button className={className} onClick={handleSubmit}>
//       {children}
//     </button>
//   );
// };

// export default memo(SubmitButton);