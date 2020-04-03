import React, { useRef, useState, useEffect } from 'react'
import { useRegulex } from 'hooks';
import { debugErr } from 'utils';
import { Typography, BoxProps, Box } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  regexpContainer: {
    width: "100%",
    overflow: "auto",
    textAlign: "center"
  },
  error: {
    width: "100%",
    color: "red",
    overflow: "auto"
  }
}));

export type RegExpType = {
  source: string;
  flags: string;
};

export type VisualRegExpProps = {
  regexp: RegExpType
} & BoxProps

export const VisualRegExp: React.FC<VisualRegExpProps> = ({ regexp, ...boxProps}) => {
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
    <Box {...boxProps}>
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