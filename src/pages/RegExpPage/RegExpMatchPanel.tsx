import React, { useMemo, useState } from 'react'
import { Box, TextField, Typography } from '@material-ui/core'
import { CodeBlock, CopyAction, OutLink } from 'components'

export type RegExpMatchPanelProps = {
  source: string
  flags?: string
}

const supportMatchAll = 'matchAll' in String.prototype

export const RegExpMatchPanel: React.FC<RegExpMatchPanelProps> = ({ source, flags }) => {
  const [text, setText] = useState('')
  const { result1, result2, code1, code2, result3, code3, error, error3 } = useMemo(() => {
    try {
      const regexp = new RegExp(source, flags)
      const escapedText = text.replace(/'/g, "\\'")

      const result1 = regexp.exec(text)
      const code1 = `const result = ${regexp}.exec('${escapedText}')`

      const result2 = text.match(regexp)
      const code2 = `const result = '${escapedText}'.match(${regexp})`

      let result3
      let error3
      const code3 = `const result ='${escapedText}'.matchAll(${regexp})`
      if (supportMatchAll) {
        try {
          result3 = text.matchAll(regexp)
        } catch (err) {
          error3 = err
        }
      } else {
        error3 = new Error('String.proptype.matchAll is not supported in your browser')
      }
      return { result1, code1, code2, result2, result3, code3, error3 }
    } catch (error) {
      return { error: error as Error }
    }
  }, [flags, source, text])
  if (error) return <Typography color="error">{error.message}</Typography>
  // console.log('result1:', result1)
  // console.log('result2:', result2)
  console.log('result3:', result3)
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
          <CodeBlock code={'// result\n' + stringifyRegExpExecArray(result1)} language="javascript" />
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
          <CodeBlock code={'// result\n' + stringifyRegExpMatchArray(result2)} language="javascript" />
        </Box>
        {supportMatchAll && (
          <>
            <Box
              mt={2}
              display="flex"
              alignItems="center"
              flexWrap="wrap"
              bgcolor="rgb(246, 248, 250)"
            >
              <Box flexGrow={1}>
                <CodeBlock code={`${code3!}`} language="javascript" />
              </Box>
              <Box display="flex">
                <OutLink
                  title="String.prototype.search() - MDN"
                  href={
                    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search'
                  }
                />
                <CopyAction text={code3!} />
              </Box>
            </Box>
            <Box>
              {error3 ? (
                <Typography color="error">{String(error3)}</Typography>
              ) : (
                <CodeBlock
                  code={stringifyRegExpMatchAllResult(result3!)}
                  language="javascript"
                />
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
  str += `\n  groups: ${JSON.stringify(result.groups, null, 2).replace(/\n/g, '\n  ')},`
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
  // for (const item of result) {
  //   str += stringifyRegExpMatchArray(item) + '\n'
  // }
  let item: IteratorResult<RegExpMatchArray, undefined>
  do {
    item = result.next()
    str += `// result.next()\n`
    str +=`{
  value: ${stringifyRegExpMatchArray(item.value)?.replace(/\n/g, '\n  ')},
  done: ${item.done}
}\n`
  } while (!item.done)
  return str
}
