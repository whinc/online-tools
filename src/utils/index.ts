export const debugErr = (...args: any[]) =>
  process.env.NODE_ENV !== "production" && console.error(...args);
export const debugLog = (...args: any[]) =>
  process.env.NODE_ENV !== "production" && console.log(...args);
export const debugWarn = (...args: any[]) =>
  process.env.NODE_ENV !== "production" && console.warn(...args);

export const copyToClipboard = (text: string): boolean => {
  const textArea = document.createElement('textarea')

  textArea.style.position = 'fixed'
  textArea.style.visibility = '-10000px'
  textArea.value = text

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  if (!document.execCommand('copy')) {
    console.warn('浏览器不支持 document.execCommand("copy")')
    document.body.removeChild(textArea)
    return false
  } else {
    document.body.removeChild(textArea)
    return true
  }
}

export function comment (str: any) {
  return String(str).replace(/(^|\n)/g, '$1// ')
}