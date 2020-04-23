import React, { useMemo, useState, useEffect } from 'react'
import { Box, TextField, Typography } from '@material-ui/core'
import { CodeBlock, CopyAction, OutLink } from 'components'

export type RegExpReplacePanelProps = {
  source: string
  flags?: string
}

export const RegExpReplacePanel: React.FC<RegExpReplacePanelProps> = ({ source, flags }) => {
  const [text, setText] = useState('')
  const [replacer, setReplacer] = useState('')
  const { code1, result1, error1} = useMemo(() => {
    let regexp, result1, error1
    try {

      regexp = new RegExp(source, flags)
      result1 = text.replace(regexp, replacer.replace(/\\n/g, '\n'))
    } catch (error) {
      regexp = `/${source}/${flags}`
      error1 = error as Error
    }
    // 无论构建正则是否抛出异常，源码都要正确显示
    const escapedText = text.replace(/`/g, "\\`")
    const escapedReplacer = replacer.replace(/`/g, "\\`")
    const code1 = `const result = \`${escapedText}\`.replace(${regexp}, \`${escapedReplacer}\`);`
    return { code1, result1, error1}
  }, [flags, replacer, source, text])

  // 输出到控制台
  useEffect(() => {
    console.log(code1)
    console.log(result1)
  }, [code1, result1])

  return (
    <Box display="flex" flexDirection="column">
      <Box>
        <TextField
          variant="outlined"
          label="输入文本"
          multiline
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Box>
      <Box mt={1}>
        <TextField
          variant="outlined"
          label="输入替换内容"
          multiline
          fullWidth
          value={replacer}
          onChange={(e) => setReplacer(e.target.value)}
        />
      </Box>
      <Box overflow="auto">
        <Box mt={2} display="flex" alignItems="center" flexWrap="wrap" bgcolor="rgb(246, 248, 250)">
          <Box flexGrow={1}>
            <CodeBlock code={`${code1!}`} language="javascript" />
          </Box>
          <Box display="flex">
            <OutLink
              title="RegExp.prototype.replace() - MDN"
              href={
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace'
              }
            />
            <CopyAction text={code1!} />
          </Box>
        </Box>
        <Box>
          {error1 ? (
            <Typography color="error">{String(error1)}</Typography>
          ) : (
            <CodeBlock code={`// result\n\`${result1?.replace(/`/g, '\\`')}\``} language="javascript" />
          )}
        </Box>
      </Box>
    </Box>
  )
}
