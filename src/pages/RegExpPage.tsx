import React, { useCallback, useState, useRef, useMemo } from "react";
import PageLayout from "layout/PageLayout";
import {
  Grid,
  TextField,
  Input,
  Button,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { useRegulex } from "hooks";

const useStyles = makeStyles({
  regexpContainer: {
    width: "100%",
    overflow: "auto",
    textAlign: "center"
  },
  error: {
    width: '100%',
    color: 'red',
    overflow: 'auto'
  }
});

type RegExpPageProps = {};

const RegExpPage: React.FC = props => {
  const styles = useStyles();
  const [regexp, setRegexp] = useState({ source: ".*", flags: "" });
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  /** visual regexp */
  const containerRef = useRef<any>();
  const [visualPanelExpanded, setVisualPanelExpanded] = useState(false);
  const { value: regulex } = useRegulex();
  const [error, setError] = useState<Error>();

  const onClickTest = useCallback(() => {
    if (!regexp.source) {
      enqueueSnackbar("请输入正则表达式", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 1500
      });
      return;
    }
    const jsRegexp = new RegExp(regexp.source, regexp.flags);
    const matches = jsRegexp.test(inputText);
    setResult(String(matches));
  }, [regexp, inputText, enqueueSnackbar]);

  // update graph
  useMemo(() => {
    if (!visualPanelExpanded) return;

    if (!regulex) {
      return;
    }

    if (!containerRef.current) {
      return;
    }

    // clear previous generated graph
    containerRef.current.innerHTML = "";

    // try generate graph
    const { parse, visualize, Raphael } = regulex;
    var paper = Raphael(containerRef.current, 0, 0);
    try {
      visualize(parse(regexp.source), regexp.flags, paper);
      setError(undefined);
    } catch (err) {
      console.error(err);
      if (err instanceof parse.RegexSyntaxError) {
        var msg = ["Error:" + err.message, ""];
        if (typeof err.lastIndex === "number") {
          msg.push(regexp.source);
          msg.push("-".repeat(err.lastIndex) + "^");
        }
        setError(new Error(msg.join('\n')))
      } else {
        setError(err);
      }
    }
  }, [regexp, regulex, visualPanelExpanded]);

  return (
    <PageLayout title='正则表达式'>
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Grid container>
            <Grid item xs={9} sm={10}>
              <Input
                style={{ height: "100%" }}
                startAdornment={<div style={{ padding: "0 10px" }}>/</div>}
                placeholder="正则表达式"
                fullWidth
                value={regexp.source}
                onChange={e => setRegexp({ ...regexp, source: e.target.value })}
              />
            </Grid>
            <Grid item xs sm>
              <Input
                startAdornment={<div style={{ padding: "0 10px" }}>/</div>}
                placeholder="标志位"
                fullWidth
                style={{ height: "100%" }}
                value={regexp.flags}
                onChange={e => setRegexp({ ...regexp, flags: e.target.value })}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={onClickTest}
            fullWidth
          >
            测试
          </Button>
        </Grid>
        <Grid item>
          <TextField
            variant="outlined"
            label="输入测试文本"
            multiline
            fullWidth
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Typography>{result}</Typography>
        </Grid>
        <Grid item container></Grid>
      </Grid>
      <ExpansionPanel
        expanded={visualPanelExpanded}
        onChange={(event, expanded) => setVisualPanelExpanded(expanded)}
      >
        <ExpansionPanelSummary expandIcon={<ExpandMore />}>
          <Typography>可视化</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{flexDirection: 'column'}}>
          {error && (
            <Typography className={styles.error} component="pre"><code>{error.message}</code></Typography>
          )}
          <div
            ref={containerRef}
            className={styles.regexpContainer}
            style={{ height: error ? 0 : "auto" }}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </PageLayout>
  );
};

export default RegExpPage;
