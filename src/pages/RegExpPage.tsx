import React, { useState, useRef, useMemo, useEffect } from "react";
import PageLayout from "layout/PageLayout";
import {
  Grid,
  TextField,
  Input,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Box
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";
import { green, red, grey } from "@material-ui/core/colors";
import { useRegulex } from "hooks";
import { debugErr } from "utils";

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

const RegExpVisualPanel: React.FC<{ regexp: RawRegExp }> = ({ regexp }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const styles = useStyles();
  const [expanded, setExpanded] = useState(true);
  const { value: regulex } = useRegulex();
  const [error, setError] = useState<Error>();
  useEffect(() => {
    if (!expanded || !regulex || !containerRef.current) return;

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
  }, [regexp, regulex, expanded]);
  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={(event, expanded) => setExpanded(expanded)}
    >
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography>可视化</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ flexDirection: "column" }}>
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
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const RegExpTestPanel: React.FC<{ regexp: RawRegExp }> = ({ regexp }) => {
  const [text, setText] = useState("");
  const isEmpty = !text || !regexp.source;
  const matched = useMemo(() => {
    if (isEmpty) return false;

    let jsRegExp;
    try {
      jsRegExp = new RegExp(regexp.source, regexp.flags);
      return jsRegExp.test(text);
    } catch (err) {
      debugErr(err);
      return false;
    }
  }, [regexp, text, isEmpty]);
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography>测试</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container direction="column">
          <Grid item>
            <TextField
              variant="outlined"
              label="输入测试文本"
              multiline
              fullWidth
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Box mt={2} ml={1}>
              {isEmpty ? (
                <Box color={grey[500]}>--</Box>
              ) : matched ? (
                <Box color={green[500]}>匹配!</Box>
              ) : (
                <Box color={red[500]}>不匹配!</Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const RegExpMatchPanel: React.FC<{ regexp: RawRegExp }> = ({ regexp }) => {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState('');
  const styles = useStyles();
  const isEmpty = !text || !regexp.source;
  const matches = useMemo(() => {
    if (isEmpty) return null;

    let jsRegExp;
    try {
      jsRegExp = new RegExp(regexp.source, regexp.flags);
      return jsRegExp.exec(text);
    } catch (err) {
      debugErr(err);
      return null;
    }
  }, [isEmpty, regexp, text]);
  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={(event, expanded) => setExpanded(expanded)}
    >
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography>匹配</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ flexDirection: "column" }}>
        <Box>
          <TextField
            variant="outlined"
            label="输入测试文本"
            multiline
            fullWidth
            value={text}
            onChange={e => setText(e.target.value)}
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
                  <Box display="flex" mt={1}>
                    <Box whiteSpace="nowrap">{`Group #${n}:`}&nbsp;</Box>
                    {n === 0 ? (
                      <Box style={{ wordBreak: "break-all" }}>
                        <Box component="span" color={grey[300]}>
                          {matches.input.substr(0, matches.index)}
                        </Box>
                        <Box component="span">
                          {matches.input.substr(
                            matches.index,
                            matches[0].length
                          )}
                        </Box>
                        <Box component="span" color={grey[300]}>
                          {matches.input.substr(
                            matches.index + matches[0].length
                          )}
                        </Box>
                      </Box>
                    ) : (
                      <Box style={{ wordBreak: "break-all" }}>{group}</Box>
                    )}
                  </Box>
                ))}
              </Box>
              <Box mt={2}>JavaScript 代码：</Box>
              <Box style={{ overflow: "auto" }}>
                <Box component="pre" className={styles.code}>
                  {`/${regexp.source}/${regexp.flags}.exec("${
                    matches.input.length <= 6
                      ? matches.input
                      : matches.input.substr(0, 3) +
                        "..." +
                        matches.input.substr(matches.input.length - 3)
                  }")`}
                </Box>
                <Box component="pre" className={styles.code}>
                  {JSON.stringify(matches, null, 2)}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const RegExpReplacePanel: React.FC<{ regexp: RawRegExp }> = () => {
  const [expanded, setExpanded] = useState(false);
  const [error] = useState<Error>();
  const styles = useStyles();
  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={(event, expanded) => setExpanded(expanded)}
    >
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Typography>替换</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ flexDirection: "column" }}>
        {error && (
          <Typography className={styles.error} component="pre">
            <code>{error.message}</code>
          </Typography>
        )}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

const RegExpPage: React.FC = () => {
  const styles = useStyles();
  const [regexp, setRegexp] = useState({ source: "\\w+", flags: "" });

  const separator = (
    <Box pt="6px" pb="7px" color="primary.main">
      /
    </Box>
  );
  return (
    <PageLayout title="正则表达式">
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Grid container>
            <Grid item xs={9} sm={10}>
              <Input
                className={styles.code}
                startAdornment={separator}
                placeholder="source"
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
                onChange={e => setRegexp({ ...regexp, flags: e.target.value })}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box height={16} />
      <RegExpVisualPanel regexp={regexp} />
      <RegExpTestPanel regexp={regexp} />
      <RegExpMatchPanel regexp={regexp} />
      <RegExpReplacePanel regexp={regexp} />
    </PageLayout>
  );
};

export default RegExpPage;
