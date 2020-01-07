import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback
} from "react";
import PageLayout from "layout/PageLayout";
import {
  Grid,
  TextField,
  Input,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  useMediaQuery,
  Checkbox,
  FormControlLabel
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { green, red, grey } from "@material-ui/core/colors";
import { useRegulex } from "hooks";
import { debugErr } from "utils";
import SwipeableViews from "react-swipeable-views";

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    codeFontFamily: string;
  }
}

const useStyles = makeStyles(theme => ({
  regexpContainer: {
    width: "100%",
    overflow: "auto",
    textAlign: "center",
    padding: "20px 0"
  },
  error: {
    width: "100%",
    color: "red",
    overflow: "auto"
  },
  input: {
    height: "100%",
    fontFamily: theme.codeFontFamily
  },
  code: {
    fontFamily: theme.codeFontFamily
  }
}));

type RawRegExp = {
  source: string;
  flags: string;
};

type PanelProps = {
  regexp: RawRegExp;
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
  return <Box {...props}>{id === value && <Box p={3}>{children}</Box>}</Box>;
};

const RegExpVisualPanel: React.FC<{ regexp: RawRegExp }> = ({ regexp }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const styles = useStyles();
  const { value: regulex } = useRegulex();
  const [error, setError] = useState<Error>();
  useEffect(() => {
    if (!regulex || !containerRef.current) return;

    // 清除生成的图片
    containerRef.current.innerHTML = "";

    const { parse, visualize, Raphael } = regulex;
    var paper = Raphael(containerRef.current, 0, 0);
    try {
      // 重新生成图片
      visualize(parse(regexp.source), regexp.flags, paper);
      // 重置错误
      setError(undefined);
    } catch (err) {
      let _err = err;
      // 如果是语法错误，格式化错误
      if (err instanceof parse.RegexSyntaxError) {
        var msg = ["Error:" + err.message, ""];
        if (typeof err.lastIndex === "number") {
          msg.push(regexp.source);
          msg.push("-".repeat(err.lastIndex) + "^");
        }
        _err = new Error(msg.join("\n"));
      }
      setError(_err);
      debugErr(_err);
    }
  }, [regexp, regulex]);
  return (
    <Box>
      {error && (
        <Typography className={styles.error} component="pre">
          <code>{error.message}</code>
        </Typography>
      )}
      <div
        ref={containerRef}
        className={styles.regexpContainer}
        style={{ height: error ? 0 : "auto" }}
      />
    </Box>
  );
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

const RegExpReplacePanel: React.FC<PanelProps> = ({
  regexp,
  value,
  onChange
}) => {
  const [subText, setSubText] = useState("");
  const [newSubText, matches] = useMemo(() => {
    // if (isEmpty) return null;

    let jsRegExp;
    try {
      jsRegExp = new RegExp(regexp.source, regexp.flags);
    } catch (err) {
      debugErr(err);
      return ["", null];
    }
    const newSubText = value.replace(jsRegExp, subText);
    const matches = jsRegExp.exec(value);
    console.log("matches:", matches);
    return [newSubText, matches];
  }, [regexp.flags, regexp.source, subText, value]);
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
          value={subText}
          onChange={e => setSubText(e.target.value)}
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

const RegExpPage: React.FC = () => {
  const styles = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const [text, setText] = useState("");
  const [regexp, setRegexp] = useState({ source: "a(\\w+)c", flags: "" });
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  // 单个标志位变化
  const onFlagChange = (flag: "g" | "i" | "m", checked: boolean) => {
    let newFlags = regexp.flags.replace(new RegExp(flag, "g"), "");
    newFlags += checked ? flag : "";
    setRegexp({ ...regexp, flags: newFlags });
  };

  // 一组标志位变化
  const onFlagsChange:  React.ChangeEventHandler<HTMLInputElement> = (e) => {
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
  return (
    <PageLayout title="正则表达式">
      <Grid container direction="column" spacing={4}>
        <Grid item container>
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
        <Grid item container>
          {flagItems.map(item => (
            <Grid item>
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
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Paper elevation={2}>
        <Box my={2} px={2} py={0}>
          <RegExpVisualPanel regexp={regexp} />
        </Box>
      </Paper>

      <Paper elevation={2}>
        <Box my={2}>
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
            <TabPanel id={0} value={tabIndex}>
              <RegExpTestPanel
                regexp={regexp}
                value={text}
                onChange={setText}
              />
            </TabPanel>
            <TabPanel id={1} value={tabIndex}>
              <RegExpMatchPanel
                regexp={regexp}
                value={text}
                onChange={setText}
              />
            </TabPanel>
            <TabPanel id={2} value={tabIndex}>
              <RegExpReplacePanel
                regexp={regexp}
                value={text}
                onChange={setText}
              />
            </TabPanel>
          </SwipeableViews>
        </Box>
      </Paper>
    </PageLayout>
  );
};

export default RegExpPage;
