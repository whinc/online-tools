import React, { useState, useMemo, useCallback } from "react";
import PageLayout from "layout/PageLayout";
import {
  Select,
  TextField,
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
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useQuery } from "hooks";
import { debugErr } from "utils";
import {
  ExpandMore,
} from "@material-ui/icons";
import clsx from "clsx";
import { VisualRegExp, RegExpType, CodeBlock, CopyAction, OutLink } from "components";
import { RegExpChips } from "./RegExpChips";
import { RegExpTestPanel } from "./RegExpTestPanel";
import {RegExpMatchPanel} from './RegExpMatchPanel'

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    codeFontFamily: string;
  }
}

enum Language {
  JavaScript = "JavaScript",
}

enum TabIndex {
  TEST,
  MATCH,
  REPLACE,
  COMMONLY_USED_REGEXP,
}

const useStyles = makeStyles((theme) => ({
  regexpInput: {
    fontSize: "1.4em",
    fontFamily: theme.codeFontFamily,
  },
  code: {
    fontFamily: theme.codeFontFamily,
  },
  tags: {
    "& > *": {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

type PanelProps = {
  regexp: RegExpType;
  value: string;
  onChange: (newValue: string) => void;
};

const NameValue: React.FC<{ name: string; value: React.ReactNode }> = ({
  name,
  value,
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

// const RegExpMatchPanel: React.FC<PanelProps> = ({
//   regexp,
//   value,
//   onChange,
// }) => {
//   const isEmpty = !value || !regexp.source;
//   const matches = useMemo(() => {
//     if (isEmpty) return null;

//     let jsRegExp;
//     try {
//       jsRegExp = new RegExp(regexp.source, regexp.flags);
//       return jsRegExp.exec(value);
//     } catch (err) {
//       debugErr(err);
//       return null;
//     }
//   }, [isEmpty, regexp, value]);
//   return (
//     <>
//       <Box>
//         <TextField
//           variant="outlined"
//           label="输入源文本"
//           multiline
//           fullWidth
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//         />
//       </Box>
//       <Box mt={2}>
//         {isEmpty && <Box color={grey[500]}>--</Box>}
//         {!isEmpty && matches === null && <Box color={red[500]}>不匹配!</Box>}
//         {!isEmpty && matches !== null && (
//           <Box>
//             <Box color={green[500]}>匹配!</Box>
//             <Box style={{ overflow: "auto" }}>
//               {matches.map((group, n) => (
//                 <NameValue name={`分组 #${n}`} value={group} />
//               ))}
//             </Box>
//           </Box>
//         )}
//       </Box>
//     </>
//   );
// };

type RegExpReplacePanelProps = PanelProps & {
  newValue: string;
  onNewValueChange: (newValue: string) => void;
};
const RegExpReplacePanel: React.FC<RegExpReplacePanelProps> = ({
  regexp,
  value,
  onChange,
  newValue,
  onNewValueChange,
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
          onChange={(e) => onChange(e.target.value)}
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
          onChange={(e) => onNewValueChange(e.target.value)}
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
    label: "全局匹配",
  },
  {
    flag: "i",
    label: "忽略大小写",
  },
  {
    flag: "m",
    label: "多行匹配",
  },
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
  const [language, setLanguage] = useState(Language.JavaScript);

  // 单个标志位变化
  const onFlagChange = (flag: "g" | "i" | "m", checked: boolean) => {
    let newFlags = regexp.flags.replace(new RegExp(flag, "g"), "");
    newFlags += checked ? flag : "";
    setRegexp({ ...regexp, flags: newFlags });
  };

  // 一组标志位变化
  const onFlagsChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    let newFlags = e.target.value;
    // 去除无效标志位
    newFlags = newFlags.replace(/[^gim]/, "");
    // 去重
    "gim".split("").forEach((flag) => {
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
          <Box
            flexGrow={1}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            mr={1}
          >
          <OutLink title='Regular expressions - MDN' href={'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions'} />
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
            onChange={(_, value) => setTabIndex(value as number)}
            textColor="primary"
            indicatorColor="primary"
            variant={matches ? "fullWidth" : "standard"}
          >
            <Tab label="测试"></Tab>
            <Tab label="匹配"></Tab>
            <Tab label="替换"></Tab>
            <Tab label="常用正则"></Tab>
          </Tabs>
          <TabPanel id={TabIndex.TEST} value={tabIndex}>
            <RegExpTestPanel source={regexp.source} flags={regexp.flags} />
          </TabPanel>
          <TabPanel id={TabIndex.MATCH} value={tabIndex}>
            <RegExpMatchPanel source={regexp.source} flags={regexp.flags} />
            {/* <RegExpMatchPanel regexp={regexp} value={text} onChange={setText} /> */}
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
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
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
  );
};

export default RegExpPage;
