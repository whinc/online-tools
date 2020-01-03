import React, {
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect
} from "react";
import PageLayout from "layout/PageLayout";
import {
  Grid,
  TextField,
  Input,
  Button,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Box
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { useRegulex } from "hooks";
import { debugErr } from "utils";

const useStyles = makeStyles({
  regexpContainer: {
    width: "100%",
    overflow: "auto",
    textAlign: "center",
    padding: '20px 0'
  },
  error: {
    width: "100%",
    color: "red",
    overflow: "auto"
  }
});

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
    if (!isEmpty) return false;

    const jsRegExp = new RegExp(regexp.source, regexp.flags);
    return jsRegExp.test(text);
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
                <Box color="primary.main">--</Box>
              ) : matched ? (
                <Box color="primary.main">匹配!</Box>
              ) : (
                <Box color="error.main">不匹配!</Box>
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
  const [error, setError] = useState<Error>();
  const styles = useStyles();
  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={(event, expanded) => setExpanded(expanded)}
    >
      <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography>匹配</Typography>
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

const RegExpReplacePanel: React.FC<{ regexp: RawRegExp }> = () => {
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<Error>();
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
  const [regexp, setRegexp] = useState({ source: "\w+", flags: "" });

  return (
    <PageLayout title="正则表达式">
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Grid container>
            <Grid item xs={9} sm={10}>
              <Input
                style={{ height: "100%" }}
                startAdornment={<div style={{ padding: "0 10px" }}>/</div>}
                placeholder="source"
                fullWidth
                value={regexp.source}
                onChange={e => setRegexp({ ...regexp, source: e.target.value })}
              />
            </Grid>
            <Grid item xs sm>
              <Input
                startAdornment={<div style={{ padding: "0 10px" }}>/</div>}
                placeholder="flags"
                fullWidth
                style={{ height: "100%" }}
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
