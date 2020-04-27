import React, { useMemo, useState, useEffect, Fragment } from 'react'
import {
  Box,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormLabel,
  FormControlLabel,
  Switch,
} from '@material-ui/core'
import { CodeBlock, CopyAction, OutLink } from 'components'
import { escape } from 'utils'
import _ from 'lodash'
import { TQuote } from './types'

export type RegExpReplacePanelProps = {
  source: string
  flags?: string
  quote?: TQuote
}

export const RegExpReplacePanel: React.FC<RegExpReplacePanelProps> = ({ source, flags, quote = '`' }) => {
  const [text, setText] = useState('')
  const [replacer, setReplacer] = useState('')
  const [isReplacerInfoVisible, setIsReplacerInfoVisible] = useState(false)
  const [isReplacerStr, setIsReplaceStr] = useState(true)
  const { code1, result1, error1, matches } = useMemo(() => {
    let regexp, result1, error1
    let matches: RegExpExecArray[] = []
    // String.prototype.replace() 的第二参数的字面值(显示给用户)
    let replacerLiteral = ''
    try {
      regexp = new RegExp(source, flags)

      // 搜集匹配结果
      // 获取 String.prototype.replace(regexp, newStr) 中第二个参数可使用的特殊替换模式
      // RegExp.prototype.exec 和 String.prototype.replace 执行结果的 match 对象一致，
      // 使用 exec 的执行结果代表 replace 的结果
      // $$ 表示"$"
      // $& 表示匹配的子串
      // $` 表示匹配的子串之前的部分
      // $' 表示匹配的子串之后的部分
      // $n 表示第 n 个捕获组，索引从 1 开始
      // const matches: RegExpExecArray[] = []
      if (regexp.global) {
        let match
        while ((match = regexp.exec(text))) {
          matches.push(match)
        }
      } else {
        const match = regexp.exec(text)
        if (match) {
          matches.push(match)
        }
      }

      // String.prototype.replace() 的第二参数
      let _replacer: string | Function = ''
      if (isReplacerStr) {
        replacerLiteral = `${quote}${escape(replacer, quote)}${quote}`
        _replacer = replacer.replace(/\\n/g, '\n')
      } else {
        const groupsLiteral =
          matches.length > 0 ? matches[0].filter((v, i) => i > 0).reduce((str, b, n) => str + `, p${n + 1}`, '') : ''
        const indent = (source: string) => source.replace(/(^|\n)/g, '$&  ')
        replacerLiteral = `function replacer(match${groupsLiteral}, offset, input) {\n${indent(
          replacer
        )}\n}`
        // eslint-disable-next-line no-new-func
        _replacer = new Function(`return ${replacerLiteral}`)()
      }
      // 执行替换
      result1 = text.replace(regexp, _replacer as any)
    } catch (error) {
      console.error(error)
      regexp = `/${source}/${flags}`
      error1 = error as Error
    }
    // 无论构建正则是否抛出异常，源码都要正确显示
    const code1 = `${quote}${escape(text, quote)}${quote}.replace(${regexp}, ${replacerLiteral})`
    return { code1, result1, error1, matches }
  }, [flags, isReplacerStr, quote, replacer, source, text])

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
          label="源字符串"
          multiline
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Box>
      <Box mt={1}>
        <TextField
          variant="outlined"
          label={isReplacerStr ? "替换子串" : "替换函数"}
          placeholder={isReplacerStr ? "输入子串，支持 $$, $&, $`, $', $n 等特殊替换符" : '输入替换函数的内容'}
          multiline
          fullWidth
          value={replacer}
          onChange={(e) => setReplacer(e.target.value)}
        />
      </Box>
      <Box mt={1} display="flex" flexWrap="wrap">
        <Box>
          <FormLabel>替换类型：</FormLabel>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={isReplacerStr}
                onChange={(_, checked) => setIsReplaceStr(checked)}
              />
            }
            label={isReplacerStr ? '字符串' : '函数'}
          />
        </Box>
        <Box>
          <FormLabel>替换信息：</FormLabel>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={isReplacerInfoVisible}
                onChange={(_, checked) => setIsReplacerInfoVisible(checked)}
              />
            }
            label={isReplacerInfoVisible ? '显示' : '隐藏'}
          />
        </Box>
      </Box>
      {isReplacerInfoVisible && (
        <Box mt={1}>
          {isReplacerStr ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Replacer Patterns</TableCell>
                  <TableCell>Inserts</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <CodeBlock language="javascript">
                      {quote}$${quote}
                    </CodeBlock>
                  </TableCell>
                  <TableCell>
                    <CodeBlock language="javascript">
                      {quote}${quote}
                    </CodeBlock>
                  </TableCell>
                </TableRow>
                {matches
                  .map((match) => {
                    const result: Record<string, string> = {
                      '$&': match[0],
                      '$`': text.substring(0, match.index),
                      "$'": text.substring(match.index + match[0].length),
                    }
                    for (let i = 1; i < match.length; ++i) {
                      result['$' + i] = match[i]
                    }
                    return result
                  })
                  .map((patterns, i) => {
                    return (
                      <Fragment key={i}>
                        <TableRow>
                          <TableCell>
                            <strong>Group #{i + 1}</strong>
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        {Object.keys(patterns).map((key) => (
                          <TableRow key={key}>
                            <TableCell>
                              <CodeBlock language="javascript">
                                {quote + escape(key, quote) + quote}
                              </CodeBlock>
                            </TableCell>
                            <TableCell>
                              <CodeBlock language="javascript">
                                {quote + escape(patterns[key], quote) + quote}
                              </CodeBlock>
                            </TableCell>
                          </TableRow>
                        ))}
                      </Fragment>
                    )
                  })}
              </TableBody>
            </Table>
          ) : (
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Replacer Parameters</TableCell>
                  <TableCell>Values</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matches.map((match) => {
                  const result: Record<string, string | number> = {}
                  result['match'] = match[0]
                  for (let i = 1; i < match.length; ++i) {
                    result['p' + i] = match[i]
                  }
                  result['offset'] = match.index
                  result['input'] = match.input
                  return result
                }).map((record, i) => {
                  return (
                    <Fragment key={i}>
                      <TableRow>
                        <TableCell>
                          <strong>Group #{i + 1}</strong>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      {_.map(record, (value, key) => (
                        <TableRow key={key}>
                          <TableCell>
                            <CodeBlock language="javascript">
                              {key}
                            </CodeBlock>
                          </TableCell>
                          <TableCell>
                            <CodeBlock language="javascript">
                              {_.isNumber(value) ? String(value) : (quote + escape(value, quote) + quote)}
                            </CodeBlock>
                          </TableCell>
                        </TableRow>
                      ))}
                    </Fragment>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </Box>
      )}
      <Box overflow="auto">
        <Box mt={2} display="flex" alignItems="center" flexWrap="wrap" bgcolor="rgb(246, 248, 250)">
          <Box flexGrow={1}>
            <CodeBlock code={code1!} language="javascript" />
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
            <CodeBlock
              code={`// --- output ---\n\`${result1?.replace(/`/g, '\\`')}\``}
              language="javascript"
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}
