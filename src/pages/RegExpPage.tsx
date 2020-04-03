import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback
} from "react";
import PageLayout from "layout/PageLayout";
import {
  Select,
  Grid,
  TextField,
  Input,
  Typography,
  Box,
  Tabs,
  Tab,
  useMediaQuery,
  Checkbox,
  FormControlLabel,
  CardHeader,
  CardContent,
  CardActions,
  Card,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  Button,
  MenuItem
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { green, red, grey } from "@material-ui/core/colors";
import { useRegulex, useQuery } from "hooks";
import { debugErr } from "utils";
import SwipeableViews from "react-swipeable-views";
import { useLocation as useWindowLocation } from "react-use";
import { useSnackbar } from "notistack";
import { FileCopy, ExpandMore } from "@material-ui/icons";
import CopyToClipboard from "react-copy-to-clipboard";
import clsx from "clsx";
import {VisualRegExp, RegExpType, CodeBlock} from 'components'

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    codeFontFamily: string;
  }
}


enum Language {
  JavaScript = "JavaScript"
}

enum TabIndex {
  TEST,
  MATCH,
  REPLACE
}

const useStyles = makeStyles(theme => ({
  input: {
    height: "100%",
    fontFamily: theme.codeFontFamily
  },
  code: {
    fontFamily: theme.codeFontFamily
  },
  tags: {
    "& > *": {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1)
    }
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  }
}));

type PanelProps = {
  regexp: RegExpType;
  value: string;
  onChange: (newValue: string) => void;
};

const NameValue: React.FC<{ name: string; value: React.ReactNode }> = ({
  name,
  value
}) => {
  const styles = useStyles();
  return (
    <Box display="flex" className={styles.code} mt={1}>
      <Box whiteSpace="nowrap">{name}:&nbsp;</Box>
      <Box style={{ wordBreak: "break-all" }}>{value}</Box>
    </Box>
  );
};

const TabPanel: React.FC<{ id: number; value: number }> = ({
  children,
  id,
  value,
  ...props
}) => {
  return <Box {...props}>{id === value && <Box pt={3}>{children}</Box>}</Box>;
};

const RegExpTestPanel: React.FC<PanelProps> = ({ regexp, value, onChange }) => {
  const isEmpty = !value || !regexp.source;
  const matched = useMemo(() => {
    if (isEmpty) return false;

    let jsRegExp;
    try {
      jsRegExp = new RegExp(regexp.source, regexp.flags);
      return jsRegExp.test(value);
    } catch (err) {
      debugErr(err);
      return false;
    }
  }, [regexp, value, isEmpty]);
  return (
    <>
      <Box>
        <TextField
          variant="outlined"
          label="输入源文本"
          multiline
          fullWidth
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </Box>
      <Box mt={2} ml={1}>
        {isEmpty ? (
          <Box color={grey[500]}>--</Box>
        ) : matched ? (
          <Box color={green[500]}>匹配!</Box>
        ) : (
          <Box color={red[500]}>不匹配!</Box>
        )}
      </Box>
    </>
  );
};

const RegExpMatchPanel: React.FC<PanelProps> = ({
  regexp,
  value,
  onChange
}) => {
  const isEmpty = !value || !regexp.source;
  const matches = useMemo(() => {
    if (isEmpty) return null;

    let jsRegExp;
    try {
      jsRegExp = new RegExp(regexp.source, regexp.flags);
      return jsRegExp.exec(value);
    } catch (err) {
      debugErr(err);
      return null;
    }
  }, [isEmpty, regexp, value]);
  return (
    <>
      <Box>
        <TextField
          variant="outlined"
          label="输入源文本"
          multiline
          fullWidth
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </Box>
      <Box mt={2}>
        {isEmpty && <Box color={grey[500]}>--</Box>}
        {!isEmpty && matches === null && <Box color={red[500]}>不匹配!</Box>}
        {!isEmpty && matches !== null && (
          <Box>
            <Box color={green[500]}>匹配!</Box>
            <Box style={{ overflow: "auto" }}>
              {matches.map((group, n) => (
                <NameValue name={`分组 #${n}`} value={group} />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

type RegExpReplacePanelProps = PanelProps & {
  newValue: string;
  onNewValueChange: (newValue: string) => void;
};
const RegExpReplacePanel: React.FC<RegExpReplacePanelProps> = ({
  regexp,
  value,
  onChange,
  newValue,
  onNewValueChange
}) => {
  const [newSubText, matches] = useMemo(() => {
    let jsRegExp;
    try {
      jsRegExp = new RegExp(regexp.source, regexp.flags);
    } catch (err) {
      debugErr(err);
      return ["", null];
    }
    const newSubText = value.replace(jsRegExp, newValue);
    const matches = jsRegExp.exec(value);
    console.log("matches:", matches);
    return [newSubText, matches];
  }, [regexp.flags, regexp.source, newValue, value]);
  return (
    <>
      <Box>
        <TextField
          variant="outlined"
          label="输入源文本"
          multiline
          fullWidth
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </Box>
      {matches !== null && (
        <Box mt={2}>
          <NameValue name="$$" value="$" />
          <NameValue name="$&" value={matches[0]} />
          <NameValue
            name="$`"
            value={matches.input.substring(0, matches.index)}
          />
          <NameValue
            name="$'"
            value={matches.input.substring(matches.index + matches[0].length)}
          />
          {matches.map((group, n) =>
            n >= 1 ? <NameValue name={"$" + n} value={group} /> : null
          )}
        </Box>
      )}
      <Box mt={2}>
        <TextField
          variant="outlined"
          label="输入替换文本"
          multiline
          fullWidth
          value={newValue}
          onChange={e => onNewValueChange(e.target.value)}
        />
      </Box>
      <Box mt={2}>
        <Box>{newSubText}</Box>
      </Box>
    </>
  );
};

const flagItems = [
  {
    flag: "g",
    label: "全局匹配"
  },
  {
    flag: "i",
    label: "忽略大小写"
  },
  {
    flag: "m",
    label: "多行匹配"
  }
] as const;

const useRegExp = () => {
  const [query, setQuery] = useQuery();
  const source = query.source || "";
  const flags = query.flags || "";
  const regexp: RegExpType = { source, flags };
  const setRegExp = useCallback(
    (regexp: RegExpType) => {
      setQuery(regexp);
    },
    [setQuery]
  );
  return [regexp, setRegExp] as const;
};

const RegExpPage: React.FC = () => {
  const styles = useStyles();
  const [tabIndex, setTabIndex] = useState(TabIndex.TEST);
  const [regexp, setRegexp] = useRegExp();
  const [text, setText] = useState("");
  const [newText, setNewText] = useState("");
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [language, setLanguage] = useState(Language.JavaScript);

  // 单个标志位变化
  const onFlagChange = (flag: "g" | "i" | "m", checked: boolean) => {
    let newFlags = regexp.flags.replace(new RegExp(flag, "g"), "");
    newFlags += checked ? flag : "";
    setRegexp({ ...regexp, flags: newFlags });
  };

  // 一组标志位变化
  const onFlagsChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    let newFlags = e.target.value;
    // 去除无效标志位
    newFlags = newFlags.replace(/[^gim]/, "");
    // 去重
    "gim".split("").forEach(flag => {
      if (newFlags.includes(flag)) {
        newFlags = newFlags.replace(new RegExp(flag, "g"), "") + flag;
      }
    });
    setRegexp({ ...regexp, flags: newFlags });
  };

  const separator = (
    <Box pt="6px" pb="7px" color="primary.main">
      /
    </Box>
  );

  const code = useMemo(() => {
    let code = "";
    if (!expanded) return code;
    if (tabIndex === TabIndex.TEST) {
      code = `const str = "${text}";
/${regexp.source}/${regexp.flags}.test(str)`;
    } else if (tabIndex === TabIndex.MATCH) {
      code = `const str = "${text}";
/${regexp.source}/${regexp.flags}.exec(str)`;
    } else if (tabIndex === TabIndex.REPLACE) {
      code = `const str = "${text}";
str.replace(/${regexp.source}/${regexp.flags}, "${newText}")`;
    }
    return code;
  }, [expanded, newText, regexp, tabIndex, text]);
  return (
    <PageLayout title="正则表达式">
      {/* 输入正则 */}
      <Card>
        <CardHeader title="正则表达式"></CardHeader>
        <CardContent>
          <Grid container>
            <Grid item xs={9} sm={10}>
              <Input
                className={styles.code}
                startAdornment={separator}
                placeholder="pattern"
                fullWidth
                value={regexp.source}
                onChange={e => setRegexp({ ...regexp, source: e.target.value })}
              />
            </Grid>
            <Grid item xs sm>
              <Input
                className={styles.code}
                startAdornment={separator}
                placeholder="flags"
                fullWidth
                value={regexp.flags}
                onChange={onFlagsChange}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container>
            {flagItems.map(item => (
              <Grid item key={item.flag}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={regexp.flags.includes(item.flag)}
                      onChange={(_, checked) =>
                        onFlagChange(item.flag, checked)
                      }
                      color="primary"
                    />
                  }
                  label={item.label}
                />
              </Grid>
            ))}
          </Grid>
        </CardActions>
      </Card>
      {/* 可视化 */}
      <Box mt={2}>
        <Card>
          <CardHeader title="可视化"></CardHeader>
          <CardContent>
            <VisualRegExp regexp={regexp} />
          </CardContent>
          {/* <CardActions>
            <Tooltip title="分享" arrow placement="top">
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
            </Tooltip>
          </CardActions> */}
        </Card>
      </Box>

      {/* 测试/匹配/替换 */}
      <Box my={2}>
        <Card>
          <CardContent>
            <Tabs
              value={tabIndex}
              onChange={(_, value) => setTabIndex(value as number)}
              textColor="primary"
              indicatorColor="primary"
              variant={matches ? "fullWidth" : "standard"}
            >
              <Tab label="测试"></Tab>
              <Tab label="匹配"></Tab>
              <Tab label="替换"></Tab>
            </Tabs>
            <SwipeableViews index={tabIndex} onChangeIndex={setTabIndex}>
              <TabPanel id={TabIndex.TEST} value={tabIndex}>
                <RegExpTestPanel
                  regexp={regexp}
                  value={text}
                  onChange={setText}
                />
              </TabPanel>
              <TabPanel id={TabIndex.MATCH} value={tabIndex}>
                <RegExpMatchPanel
                  regexp={regexp}
                  value={text}
                  onChange={setText}
                />
              </TabPanel>
              <TabPanel id={TabIndex.REPLACE} value={tabIndex}>
                <RegExpReplacePanel
                  regexp={regexp}
                  value={text}
                  onChange={setText}
                  newValue={newText}
                  onNewValueChange={setNewText}
                />
              </TabPanel>
            </SwipeableViews>
          </CardContent>
          <CardActions>
            {expanded && (
              <Box ml={1}>
                <Select
                  value={language}
                  onChange={e => setLanguage(e.target.value as Language)}
                >
                  <MenuItem value={Language.JavaScript}>JavaScript</MenuItem>
                </Select>
              </Box>
            )}
            <Button
              style={{ marginLeft: "auto" }}
              endIcon={
                <ExpandMore
                  className={clsx(styles.expand, {
                    [styles.expandOpen]: expanded
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
              <CodeBlock code={code} language='javascript' />
            </CardContent>
            <CardActions>
              <CopyToClipboard
                text={code}
                onCopy={() =>
                  enqueueSnackbar("已复制!", { autoHideDuration: 1500 })
                }
              >
                <Tooltip title="复制" placement="top">
                  <IconButton>
                    <FileCopy />
                  </IconButton>
                </Tooltip>
              </CopyToClipboard>
            </CardActions>
          </Collapse>
        </Card>
      </Box>
      {/* 常用正则 */}
      <Box mt={2}>
        <Card>
          <CardHeader title="常用正则表达式"></CardHeader>
          <CardContent>
            <Box display="flex" flexWrap="wrap" className={styles.tags}>
              {mostRegExps.map(({ label, source }) => (
                <Chip
                  key={label}
                  variant="outlined"
                  label={label}
                  onClick={() => setRegexp({ source, flags: "" })}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </PageLayout>
  );
};

const mostRegExps = [
  {
    label: "身份证号",
    source: /^\d{17}[0-9Xx]|\d{15}$/.source
  },
  {
    label: "Email地址",
    source: /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/.source
  },
  {
    label: "中文字符",
    source: /^[\u4e00-\u9fa5]+$/.source
  },
  {
    label: "双字节字符(含汉字)",
    // eslint-disable-next-line no-control-regex
    source: /^[^\x00-\xff]+$/.source
  },
  {
    label: "时间(时:分:秒)",
    source: /^([01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d$/.source
  },
  {
    label: "日期(年:月:日)",
    source: /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/
      .source
  },
  {
    label: "IPv4地址",
    source: /^\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3}$/.source
  },
  {
    label: "手机号",
    source: /^(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}$/.source
  }
];

export default RegExpPage;
