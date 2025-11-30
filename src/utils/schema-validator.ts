type ErrorObject = {
  message?: string
  [key: string]: ErrorObject | string | undefined
}

export const getErrorMessageByPropertyName = (
  obj: Record<string, unknown>,
  propertyPath: string
): string | undefined => {
  // let obj = errors
  // let propertyPath = "admin.name.firstName"
  // let propertyPath = "admin.name.lastName"

  const properties = propertyPath.split('.')
  // ["admin","name","firstName"]
  // ["admin","name","lastName"]
  let value: unknown = obj

  for (const prop of properties) {
    if (value && typeof value === 'object' && prop in value) {
      value = (value as Record<string, unknown>)[prop]
    } else {
      return undefined
    }
  }

  if (value && typeof value === 'object' && 'message' in value) {
    return (value as ErrorObject).message
  }

  return undefined
}
