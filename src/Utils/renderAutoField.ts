import { fromCamelCase } from "../functions/camelCase"
import StrInput from '../components/StrInput'

const renderField = (
  key: string,
  value: any
): React.ReactNode => {
  const commonProps = {
    name: key,
    placeholder: fromCamelCase(key),
  }

  // primitive
  if (typeof value === 'string') {
    return <StrInput key={key} {...commonProps} />
  }

  if (typeof value === 'number') {
    return <NumInput key={key} {...commonProps} />
  }

  // array
  if (Array.isArray(value)) {
    return (
      <ArrayContainer
        key={key}
        name={key}
        items={value}
        getKey={(_, i) => i.toString()}
      >
        {(item) => (
          <AutoInput initialData={item} />
        )}
      </ArrayContainer>
    )
  }

  // object
  if (isPlainObject(value)) {
    return (
      <ObjectContainer key={key} name={key}>
        <AutoInput initialData={value} />
      </ObjectContainer>
    )
  }

  return null
}
