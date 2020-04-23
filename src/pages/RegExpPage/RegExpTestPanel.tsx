import React, { useMemo, useState, useEffect } from 'react'
import { Box, TextField, Typography } from '@material-ui/core'
import { CodeBlock, CopyAction, OutLink } from 'components'

export type RegExpTestPanelProps = {
  source: string
  flags?: string
}

export const RegExpTestPanel: React.FC<RegExpTestPanelProps> = ({ source, flags }) => {
  const [text, setText] = useState('')
  const { code1, result1, error1, code2, result2, error2 } = useMemo(() => {
    let regexp, result1, result2, error1, error2
    try {
      regexp = new RegExp(source, flags)
      result1 = regexp.test(text)
      result2 = text.search(regexp)
    } catch (error) {
      regexp = `/${source}/${flags}`
      error1 = error2 = error as Error
    }
    // 无论构建正则是否抛出异常，源码都要正确显示
    const escapedText = text.replace(/'/g, "\\'")
    const code1 = `const result = ${regexp}.test('${escapedText}');`
    const code2 = `const result = '${escapedText}'.search(${regexp});`
    return { code1, result1, error1, code2, result2, error2 }
  }, [flags, source, text])

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
            <CodeBlock code={'// result\n' + result1} language="javascript" />
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
            <CodeBlock code={'// result\n' + result2} language="javascript" />
          )}
        </Box>
      </Box>
    </Box>
  )
}
