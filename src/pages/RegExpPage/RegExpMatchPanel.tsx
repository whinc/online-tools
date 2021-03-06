  import React, { useMemo, useState, useEffect } from 'react'
  import { Box, TextField, Typography } from '@material-ui/core'
  import { CodeBlock, CopyAction, OutLink } from 'components'
  import { TQuote } from './types'
  import { escapeStr, unescapeStr, escapeQuote } from 'utils'

  export type RegExpMatchPanelProps = {
    source: string
    flags?: string
    quote: TQuote
    escape: boolean
  }

  const supportMatchAll = 'matchAll' in String.prototype

  export const RegExpMatchPanel: React.FC<RegExpMatchPanelProps> = ({ source, flags, quote, escape}) => {
    const [text, setText] = useState('')
    const { code1, result1, error1, code2, result2, error2, code3, result3, error3 } = useMemo(() => {
      let regexp, result1, result2, result3, error1, error2, error3
      // 从输入框中取到的值是已经转义过了的
      const _text = escape ? text : unescapeStr(text)
      try {
        // 抛出异常情况：
        // 1. 正则表达式不合法
        regexp = new RegExp(source, flags)
      } catch (error) {
        regexp = (`/${source}/${flags}` as any) as RegExp
        error1 = error2 = error3 = error as Error
      }

      if (!error1) {
        result1 = regexp.exec(_text)
        result2 = _text.match(regexp)
        try {
          // 抛出异常的情况：
          // 1. 浏览器不支持 matchAll 时抛异常
          // 2. 正则的 g 标志位未设置时抛异常
          result3 = _text.matchAll(regexp)
        } catch (error) {
          error3 = error as Error
        }
      }
      const escapedText = escapeQuote(escapeStr(_text), quote)
    const code1 = `${regexp}.exec(${quote}${escapedText}${quote})`
    const code2 = `${quote}${escapedText}${quote}.match(${regexp});`
    const code3 = `${quote}${escapedText}${quote}.matchAll(${regexp});`

    return { code1, result1, error1, code2, result2, error2, code3, result3, error3 }
  }, [escape, flags, quote, source, text])

  // 输出到控制台
  useEffect(() => {
    console.log(code1)
    console.log(result1)
    console.log(code2)
    console.log(result2)
    console.log(code3)
    console.log(result3)
  }, [code1, code2, code3, result1, result2, result3])

  return (
    <Box display="flex" flexDirection="column">
      <Box>
        <TextField
          variant="outlined"
          label="输入待匹配文本"
          multiline
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Box>
      <Box overflow="auto">
        <Box
          mt={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          bgcolor="rgb(246, 248, 250)"
        >
          <CodeBlock>{`RegExp.prototype.exec()`}</CodeBlock>
            <OutLink
              title="RegExp.prototype.exec() - MDN"
              href={
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec'
              }
            />
        </Box>
        <Box mt={1} display="flex" alignItems="center" flexWrap="wrap" bgcolor="rgb(246, 248, 250)">
          <Box flexGrow={1}>
            <CodeBlock code={`${code1!}`} language="javascript" />
          </Box>
          <Box display="flex">
            <CopyAction text={code1!} />
          </Box>
        </Box>
        <Box>
          {error1 ? (
            <Typography color="error">{String(error1)}</Typography>
          ) : (
            <CodeBlock
              code={'// result\n' + stringifyRegExpExecArray(result1)}
              language="javascript"
            />
          )}
        </Box>

        <Box
          mt={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          bgcolor="rgb(246, 248, 250)"
        >
          <CodeBlock>{`String.prototype.match()`}</CodeBlock>
            <OutLink
              title="String.prototype.match() - MDN"
              href={
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match'
              }
            />
        </Box>
        <Box mt={1} display="flex" alignItems="center" flexWrap="wrap" bgcolor="rgb(246, 248, 250)">
          <Box flexGrow={1}>
            <CodeBlock code={`${code2!}`} language="javascript" />
          </Box>
          <Box display="flex">
            <CopyAction text={code2!} />
          </Box>
        </Box>
        <Box>
          {error2 ? (
            <Typography color="error">{String(error2)}</Typography>
          ) : (
            <CodeBlock
              code={ '// result\n' + stringifyRegExpMatchArray(result2)}
              language="javascript"
            />
          )}
        </Box>
        {supportMatchAll && (
          <>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          bgcolor="rgb(246, 248, 250)"
        >
          <CodeBlock>{`String.prototype.matchAll()`}</CodeBlock>
                <OutLink
                  title="String.prototype.matchAll() - MDN"
                  href={
                    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll'
                  }
                />
        </Box>
            <Box
              mt={1}
              display="flex"
              alignItems="center"
              flexWrap="wrap"
              bgcolor="rgb(246, 248, 250)"
            >
              <Box flexGrow={1}>
                <CodeBlock code={`${code3!}`} language="javascript" />
              </Box>
              <Box display="flex">
                <CopyAction text={code3!} />
              </Box>
            </Box>
            <Box>
              {error3 ? (
                <Typography color="error">{String(error3)}</Typography>
              ) : (
                <CodeBlock code={stringifyRegExpMatchAllResult(result3!)} language="javascript" />
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

function stringifyRegExpExecArray(result: RegExpExecArray | null | undefined): string {
  if (!result) return JSON.stringify(result)
  let str = '['
  result.forEach((value, index) => (str += `\n  ${index}: ${JSON.stringify(value)},`))
  str += `\n  index: ${JSON.stringify(result.index)}`
  str += `\n  input: ${JSON.stringify(result.input)}`
  str += `\n  groups: ${JSON.stringify(result.groups, null, 2)?.replace(/\n/g, '\n  ')},`
  str += `\n  length: ${JSON.stringify(result.length)}`
  str += `\n]`
  return str
}

function stringifyRegExpMatchArray(result: RegExpMatchArray | null | undefined): string {
  if (!result || 'index' in result) {
    return stringifyRegExpExecArray(result as RegExpExecArray)
  } else {
    return JSON.stringify(result)
  }
}

function stringifyRegExpMatchAllResult(result: IterableIterator<RegExpMatchArray>): string {
  let str = ''
  let item: IteratorResult<RegExpMatchArray, undefined>
  do {
    item = result.next()
    str += `// result.next()\n`
    str += `{
  value: ${stringifyRegExpMatchArray(item.value)?.replace(/\n/g, '\n  ')},
  done: ${item.done}
}\n`
  } while (!item.done)
  return str
}
