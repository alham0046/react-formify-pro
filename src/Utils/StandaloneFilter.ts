// utils/createStandaloneField.ts
import { InputForm } from '../store/InputFormStore'
import type { InputFieldType } from '../store/InputFieldStore'
import { createField } from './FieldUtils'
import { randomString } from '../functions/stringManiputation'

///// This is a filter if user wants to only use single or some StrInputs/anyfield without the <InputContainer>

export function standaloneRootFilter(
  placeholder: string,
  name: string | undefined,
  inputStore: InputForm | undefined,
  initialValue: any,
  scope: any
): InputFieldType {
  // If no <InputContainer> exists, spin up an isolated single-field store
  const store = inputStore ?? new InputForm(`standalone#root#${randomString()}`)

  return createField(
    placeholder,
    name,
    store,
    initialValue,
    scope
  ) as InputFieldType
}