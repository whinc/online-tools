import React, { useState, useMemo, useCallback } from 'react'
import PageLayout from 'layout/PageLayout'
import {
  Select,
  Input,
  Box,
  Tabs,
  Tab,
  useMediaQuery,
  Checkbox,
  FormControlLabel,
  CardContent,
  CardActions,
  Card,
  Collapse,
  Button,
  MenuItem,
  IconButton,
  Tooltip,
  Popper,
  RadioGroup,
  Radio,
  Paper,
  FormLabel,
  Switch,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { useQuery } from 'hooks'
import { ExpandMore, Settings } from '@material-ui/icons'
import clsx from 'clsx'
import { VisualRegExp, RegExpType, CodeBlock, CopyAction, OutLink } from 'components'
import { RegExpChips } from './RegExpChips'
import { RegExpTestPanel } from './RegExpTestPanel'
import { RegExpMatchPanel } from './RegExpMatchPanel'
import { RegExpReplacePanel } from './RegExpReplacePanel'
import { TQuote } from './types'

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    codeFontFamily: string
  }
}

enum Language {
  JavaScript = 'JavaScript',
}

enum TabIndex {
  TEST,
  MATCH,
  REPLACE,
  COMMONLY_USED_REGEXP,
}

const useStyles = makeStyles((theme) => ({
  regexpInput: {
    fontSize: '1.4em',
    fontFamily: theme.codeFontFamily,
  },
  code: {
    fontFamily: theme.codeFontFamily,
  },
  tags: {
    '& > *': {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}))


const TabPanel: React.FC<{ id: number; value: number }> = ({ children, id, value, ...props }) => {
  return <Box {...props}>{id === value && <Box pt={3}>{children}</Box>}</Box>
}

const flagItems = [
  {
    flag: 'g',
    label: '全局匹配',
  },
  {
    flag: 'i',
    label: '忽略大小写',
  },
  {
    flag: 'm',
    label: '多行匹配',
  },
] as const

const useRegExp = () => {
  const [query, setQuery] = useQuery()
  const source = query.source || ''
  const flags = query.flags || ''
  const regexp: RegExpType = { source, flags }
  const setRegExp = useCallback(
    (regexp: RegExpType) => {
      setQuery({ ...query, ...regexp })
    },
    [query, setQuery]
  )
  return [regexp, setRegExp] as const
}

const useTabIndex = (defaultValue: number = TabIndex.TEST) => {
  const [query, setQuery] = useQuery()
  const tabIndex = parseInt(query.tab ?? defaultValue)
  const setTabIndex = useCallback(
    (tabIndex: number) => {
      setQuery({ ...query, tab: String(tabIndex) })
    },
    [query, setQuery]
  )
  return [tabIndex, setTabIndex] as const
}

const RegExpPage: React.FC = () => {
  const styles = useStyles()
  const [tabIndex, setTabIndex] = useTabIndex(TabIndex.TEST)
  const [regexp, setRegexp] = useRegExp()
  const [text] = useState('')
  const [newText] = useState('')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))
  const [expanded, setExpanded] = useState(false)
  const [language, setLanguage] = useState(Language.JavaScript)
  const [quote, setQuote] = useState<TQuote>('`')
  /**
   * 是否转义，默认 false
   * 为 false 时，输入'\n'，程序取到的是'\n'
   * 为 true  时，输入'\n'，程序取到的是'\\n'
   */
  const [escape, setEscape] = useState(false)

  // 单个标志位变化
  const onFlagChange = (flag: 'g' | 'i' | 'm', checked: boolean) => {
    let newFlags = regexp.flags.replace(new RegExp(flag, 'g'), '')
    newFlags += checked ? flag : ''
    setRegexp({ ...regexp, flags: newFlags })
  }

  // 一组标志位变化
  const onFlagsChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    let newFlags = e.target.value
    // 去除无效标志位
    newFlags = newFlags.replace(/[^gim]/, '')
    // 去重
    'gim'.split('').forEach((flag) => {
      if (newFlags.includes(flag)) {
        newFlags = newFlags.replace(new RegExp(flag, 'g'), '') + flag
      }
    })
    setRegexp({ ...regexp, flags: newFlags })
  }

  const separator = (
    <Box pt="6px" pb="7px" color="primary.main">
      /
    </Box>
  )

  const code = useMemo(() => {
    let code = ''
    if (!expanded) return code
    if (tabIndex === TabIndex.TEST) {
      code = `const str = "${text}";
/${regexp.source}/${regexp.flags}.test(str)`
    } else if (tabIndex === TabIndex.MATCH) {
      code = `const str = "${text}";
/${regexp.source}/${regexp.flags}.exec(str)`
    } else if (tabIndex === TabIndex.REPLACE) {
      code = `const str = "${text}";
str.replace(/${regexp.source}/${regexp.flags}, "${newText}")`
    }
    return code
  }, [expanded, newText, regexp, tabIndex, text])
  return (
    <PageLayout title="正则表达式">
      <Box display="flex" flexDirection="column">
        <Box display="flex">
          <Box flexGrow={{ xs: 2, md: 4 }} flexBasis={0}>
            <Input
              className={styles.regexpInput}
              startAdornment={separator}
              placeholder="pattern"
              fullWidth
              value={regexp.source}
              onChange={(e) => setRegexp({ ...regexp, source: e.target.value })}
            />
          </Box>
          <Box flexGrow={{ xs: 1, md: 1 }} flexBasis={0}>
            <Input
              className={styles.regexpInput}
              startAdornment={separator}
              placeholder="flags"
              fullWidth
              value={regexp.flags}
              onChange={onFlagsChange}
            />
          </Box>
        </Box>

        <Box display="flex" mt={1} flexWrap="wrap">
          {flagItems.map((item) => (
            <FormControlLabel
              key={item.flag}
              control={
                <Checkbox
                  checked={regexp.flags.includes(item.flag)}
                  onChange={(_, checked) => onFlagChange(item.flag, checked)}
                  color="primary"
                />
              }
              label={item.label}
            />
          ))}
          <Box flexGrow={1} display="flex" justifyContent="flex-end" alignItems="center" mr={1}>
            <OutLink
              title="RegExp - MDN"
              href={
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp'
              }
            />
            <OutLink
              title="Regular expressions - MDN"
              href={
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions'
              }
            />
            <CopyAction text={`/${regexp.source}/${regexp.flags}`} />
          </Box>
        </Box>

        <Box mt={1}>
          <VisualRegExp regexp={regexp} />
          {/* <Tooltip title="分享" arrow placement="top">
            <CopyToClipboard
              text={href || ""}
              onCopy={() =>
                enqueueSnackbar(
                  <span>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "white" }}
                    >
                      {href}
                    </a>{" "}
                    已复制，快去分享吧！
                  </span>
                )
              }
            >
              <IconButton>
                <Share />
              </IconButton>
            </CopyToClipboard>
          </Tooltip> */}
        </Box>

        <Box mt={2}>
          <Tabs
            value={tabIndex}
            onChange={(_, value) => value !== undefined && setTabIndex(value)}
            textColor="primary"
            indicatorColor="primary"
            variant={matches ? 'fullWidth' : 'standard'}
          >
            <Tab label="测试"></Tab>
            <Tab label="匹配"></Tab>
            <Tab label="替换"></Tab>
            <Tab label="常用正则"></Tab>
            <Box>
              <Tooltip title="设置">
                <IconButton onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}>
                  <Settings />
                </IconButton>
              </Tooltip>
              <Popper open={!!anchorEl} anchorEl={anchorEl} placement="left-start">
                <Paper>
                  <Box p={1}>
                    <RadioGroup value={quote} onChange={(e, value) => setQuote(value as TQuote)}>
                      <FormControlLabel value='"' control={<Radio />} label='双引号(")' />
                      <FormControlLabel value="'" control={<Radio />} label="单引号(')" />
                      <FormControlLabel value="`" control={<Radio />} label="反引号(`)" />
                    </RadioGroup>
                  </Box>
                  <Box p={1}>
                    <FormLabel>自动转义字符：</FormLabel>
                    <FormControlLabel
                      control={
                        <Switch
                          color="primary"
                          checked={escape}
                          onChange={(_, checked) => setEscape(checked)}
                        />
                      }
                      label={escape ? '是' : '否'}
                    />
                  </Box>
                </Paper>
              </Popper>
            </Box>
          </Tabs>
          <TabPanel id={TabIndex.TEST} value={tabIndex}>
            <RegExpTestPanel
              source={regexp.source}
              flags={regexp.flags}
              quote={quote}
              escape={escape}
            />
          </TabPanel>
          <TabPanel id={TabIndex.MATCH} value={tabIndex}>
            <RegExpMatchPanel source={regexp.source} flags={regexp.flags} quote={quote} escape={escape} />
          </TabPanel>
          <TabPanel id={TabIndex.REPLACE} value={tabIndex}>
            <RegExpReplacePanel source={regexp.source} flags={regexp.flags} quote={quote} escape={escape}/>
          </TabPanel>
          <TabPanel id={TabIndex.COMMONLY_USED_REGEXP} value={tabIndex}>
            <RegExpChips onSelect={(regexp) => setRegexp(regexp)} />
          </TabPanel>
        </Box>
      </Box>

      {/* 测试/匹配/替换 */}
      <Box my={2} display="none">
        <Card>
          <CardContent></CardContent>
          <CardActions>
            {expanded && (
              <Box ml={1}>
                <Select value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
                  <MenuItem value={Language.JavaScript}>JavaScript</MenuItem>
                </Select>
              </Box>
            )}
            <Button
              style={{ marginLeft: 'auto' }}
              endIcon={
                <ExpandMore
                  className={clsx(styles.expand, {
                    [styles.expandOpen]: expanded,
                  })}
                />
              }
              onClick={() => setExpanded(!expanded)}
            >
              生成代码
            </Button>
          </CardActions>
          {/* 生成代码 */}
          <Collapse in={expanded}>
            <CardContent>
              <CodeBlock code={code} language="javascript" />
            </CardContent>
            <CardActions>
              <CopyAction text={code} />
            </CardActions>
          </Collapse>
        </Card>
      </Box>
    </PageLayout>
  )
}

export default RegExpPage
