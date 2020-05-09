import { TQuote } from 'pages/RegExpPage/types'

export const debugErr = (...args: any[]) =>
  process.env.NODE_ENV !== 'production' && console.error(...args)
export const debugLog = (...args: any[]) =>
  process.env.NODE_ENV !== 'production' && console.log(...args)
export const debugWarn = (...args: any[]) =>
  process.env.NODE_ENV !== 'production' && console.warn(...args)

export const escapeQuote = (str: string, quote: TQuote) =>str.replace(new RegExp(quote, 'g'), '\\' + quote)

/**
 * 转义字符串
 * @param str
 * @param quote
 */
export const escapeStr = (str: string) => str.replace(/\n|\\/g, (match) => {
    if (match === '\n') return '\\n'
    else if (match === '\\') return '\\\\'
    else return match
  })

// export const unescapeStr = (str: string) => str.replace('\\n', '\n')
export const unescapeStr = (str: string) => str.replace(/\\\\|\\n/g, (match) => {
  if (match === '\\\\') return '\\'
  else if (match === '\\n') return '\n'
  else return match
})

/**
 * 复制到剪切板
 * @param text
 */
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
