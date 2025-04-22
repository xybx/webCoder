export const convertToCamelCase = (str: any) => {
  const parts = str.split('-')
  const capitalizedParts = []
  for (const part of parts) {
    capitalizedParts.push(part[0].toUpperCase() + part.slice(1))
  }
  return capitalizedParts.join('')
}
