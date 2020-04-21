import React, { useMemo, useState } from "react";
import { Box, TextField, Typography } from "@material-ui/core";
import { CodeBlock, CopyAction, OutLink } from "components";

export type RegExpTestPanelProps = {
  source: string;
  flags?: string;
};

export const RegExpTestPanel: React.FC<RegExpTestPanelProps> = ({
  source,
  flags,
}) => {
  const [text, setText] = useState("");
  const { result1, result2, code1, code2, error } = useMemo(() => {
    try {
      const regexp = new RegExp(source, flags);
      const result1 = regexp.test(text);
      const result2 = text.search(regexp);
      const escapedText = text.replace(/'/g, "\\'");
      const code1 = `${regexp}.test('${escapedText}')`;
      const code2 = `'${escapedText}'.search(${regexp})`;
      return { result1, code1, code2, result2 };
    } catch (error) {
      return { error: error as Error };
    }
  }, [flags, source, text]);
  if (error) return <Typography color="error">{error.message}</Typography>;
  return (
    <Box display="flex" flexDirection="column">
      <Box>
        <TextField
          variant="outlined"
          label="输入源文本"
          multiline
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Box>
      <Box overflow="auto">
        <Box mt={2} display="flex" alignItems="center" flexWrap="wrap">
          <Box flexGrow={1}>
            <CodeBlock
              code={`${code1!}\n// ${result1!}`}
              language="javascript"
            />
          </Box>
          <Box display='flex'>
            <OutLink
              title="RegExp.prototype.test() - MDN"
              href={
                "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test"
              }
            />
            <CopyAction text={code1!} />
          </Box>
        </Box>
        <Box mt={2} display="flex" alignItems="center" flexWrap="wrap">
          <Box flexGrow={1}>
            <CodeBlock
              code={`${code2!}\n// ${result2!}`}
              language="javascript"
            />
          </Box>
          <Box display='flex'>
            <OutLink
              title="String.prototype.search() - MDN"
              href={
                "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search"
              }
            />
            <CopyAction text={code2!} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
