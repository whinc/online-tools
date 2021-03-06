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
import { escapeStr, unescapeStr, escapeQuote } from 'utils'
import _ from 'lodash'
import { TQuote} from './types'

export type RegExpReplacePanelProps = {
  source: string
  flags?: string
  quote: TQuote
  escape: boolean
}

export const RegExpReplacePanel: React.FC<RegExpReplacePanelProps> = ({
  source,
  flags,
  quote,
  escape,
}) => {
  const [text, setText] = useState('')
  const [replacer, setReplacer] = useState('')
  const [isReplacerInfoVisible, setIsReplacerInfoVisible] = useState(false)
  const [isReplacerStr, setIsReplaceStr] = useState(true)
  const _text = escape ? text : unescapeStr(text)
  const { code1, result1, error1, matches } = useMemo(() => {
    let regexp, result1, error1
    // 从输入框中取到的值是已经转义过了的
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
        while ((match = regexp.exec(_text))) {
          matches.push(match)
        }
      } else {
        const match = regexp.exec(_text)
        if (match) {
          matches.push(match)
        }
      }

      // String.prototype.replace() 的第二参数
      let _replacer: string | Function = ''
      if (isReplacerStr) {
        replacerLiteral = `${quote}${escapeQuote(escapeStr(replacer), quote)}${quote}`
        _replacer = escape ? replacer : unescapeStr(replacer)
      } else {
        const argsLiteral =
          matches.length > 0
            ? matches[0].filter((v, i) => i > 0).reduce((str, b, n) => str + `, p${n + 1}`, '')
            : ''
        const indent = (source: string) => source.replace(/(^|\n)/g, '$&  ')
        replacerLiteral = `function replacer(match${argsLiteral}, offset, input) {\n${indent(
          replacer
        )}\n}`
        // eslint-disable-next-line no-new-func
        _replacer = new Function(`return ${replacerLiteral}`)()
      }
      // 执行替换
      result1 = _text.replace(regexp, _replacer as any)
    } catch (error) {
      console.error(error)
      regexp = `/${source}/${flags}`
      error1 = error as Error
    }
    // 无论构建正则是否抛出异常，源码都要正确显示
    const code1 = `${quote}${escapeQuote(
      escapeStr(_text),
      quote
    )}${quote}.replace(${regexp}, ${replacerLiteral})`
    return { code1, result1, error1, matches }
  }, [_text, escape, flags, isReplacerStr, quote, replacer, source])

  // 输出到控制台
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('code1', code1)
      console.log('result1', result1)
      console.log('matches:', matches)
    }
  }, [code1, matches, result1])

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
          label={isReplacerStr ? '替换子串' : '替换函数'}
          placeholder={
            isReplacerStr ? "输入子串，支持 $$, $&, $`, $', $n 等特殊替换符" : '输入替换函数的内容'
          }
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
                      '$`': _text.substring(0, match.index),
                      "$'": _text.substring(match.index + match[0].length),
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
                                {quote + escapeQuote(key, quote) + quote}
                              </CodeBlock>
                            </TableCell>
                            <TableCell>
                              <CodeBlock language="javascript">
                                {quote + escapeQuote(escapeStr(patterns[key]), quote) + quote}
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
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Replacer Parameters</TableCell>
                  <TableCell>Values</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {matches
                  .map((match) => {
                    const result: Record<string, string | number> = {}
                    result['match'] = match[0]
                    for (let i = 1; i < match.length; ++i) {
                      result['p' + i] = match[i]
                    }
                    result['offset'] = match.index
                    result['input'] = match.input
                    return result
                  })
                  .map((record, i) => {
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
                                {_.isNumber(value)
                                  ? String(value)
                                  : quote + escapeQuote(escapeStr(value), quote) + quote}
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
        <Box
          mt={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          bgcolor="rgb(246, 248, 250)"
        >
          <CodeBlock>{`String.prototype.replace()`}</CodeBlock>
            <OutLink
              title="RegExp.prototype.replace() - MDN"
              href={
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace'
              }
            />
        </Box>
        <Box mt={1} display="flex" alignItems="center" flexWrap="wrap" bgcolor="rgb(246, 248, 250)">
          <Box flexGrow={1}>
            <CodeBlock code={code1!} language="javascript" />
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
              code={`// --- output ---\n${quote}${escapeQuote(escapeStr(result1!), quote)}${quote}`}
              language="javascript"
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}
