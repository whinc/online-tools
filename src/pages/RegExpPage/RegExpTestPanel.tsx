import React, { useMemo, useState, useEffect } from 'react'
import { Box, TextField, Typography } from '@material-ui/core'
import { CodeBlock, CopyAction, OutLink } from 'components'
import { TQuote } from './types'
import { escapeStr, unescapeStr, escapeQuote } from 'utils'

export type RegExpTestPanelProps = {
  source: string
  flags?: string
  quote: TQuote
  escape: boolean
}

export const RegExpTestPanel: React.FC<RegExpTestPanelProps> = ({ source, flags, quote, escape}) => {
  const [text, setText] = useState('')
  // const [text, setText] = useUnescapedText('')
  const { code1, result1, error1, code2, result2, error2 } = useMemo(() => {
    let regexp, result1, result2, error1, error2
    // 从输入框中取到的值是已经转义过了的
    const _text = escape ? text : unescapeStr(text)
    try {
      regexp = new RegExp(source, flags)
      result1 = regexp.test(_text)
      result2 = _text.search(regexp)
    } catch (error) {
      regexp = `/${source}/${flags}`
      error1 = error2 = error as Error
    }
    // 无论构建正则是否抛出异常，源码都要正确显示
    const escapedText = escapeQuote(escapeStr(_text), quote)
    const code1 = `${regexp}.test(${quote}${escapedText}${quote})`
    const code2 = `${quote}${escapedText}${quote}.search(${regexp})`
    return { code1, result1, error1, code2, result2, error2 }
  }, [flags, quote, source, text, escape])

  // 输出到控制台
  useEffect(() => {
    console.log(code1)
    console.log(result1)
    console.log(code2)
    console.log(result2)
  }, [code1, code2, result1, result2])

  return (
    <Box display="flex" flexDirection="column">
      <Box>
        <TextField
          variant="outlined"
          label="输入源文本"
          multiline
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Box>
      <Box overflow="auto">
        <Box mt={2} display="flex" alignItems="center" flexWrap="wrap" bgcolor="rgb(246, 248, 250)">
          <Box flexGrow={1}>
            <CodeBlock code={`${code1!}`} language="javascript" />
          </Box>
          <Box display="flex">
            <OutLink
              title="RegExp.prototype.test() - MDN"
              href={
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test'
              }
            />
            <CopyAction text={code1!} />
          </Box>
        </Box>
        <Box>
          {error1 ? (
            <Typography color="error">{String(error1)}</Typography>
          ) : (
            <CodeBlock code={'// returns\n' + result1} language="javascript" />
          )}
        </Box>
        <Box mt={2} display="flex" alignItems="center" flexWrap="wrap" bgcolor="rgb(246, 248, 250)">
          <Box flexGrow={1}>
            <CodeBlock code={`${code2!}`} language="javascript" />
          </Box>
          <Box display="flex">
            <OutLink
              title="String.prototype.search() - MDN"
              href={
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search'
              }
            />
            <CopyAction text={code2!} />
          </Box>
        </Box>
        <Box>
          {error2 ? (
            <Typography color="error">{String(error2)}</Typography>
          ) : (
            <CodeBlock code={'// returns\n' + result2} language="javascript" />
          )}
        </Box>
      </Box>
    </Box>
  )
}
