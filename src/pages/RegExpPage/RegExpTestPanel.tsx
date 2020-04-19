import React, { useMemo, useState } from "react";
import {
  Box,
  TextField,
  Tooltip,
  IconButton,
  Typography,
} from "@material-ui/core";
import { CodeBlock } from "components";
import CopyToClipboard from "react-copy-to-clipboard";
import { FileCopyOutlined } from "@material-ui/icons";
import { useSnackbar } from "notistack";

export type RegExpTestPanelProps = {
  source: string;
  flags?: string;
};

export const RegExpTestPanel: React.FC<RegExpTestPanelProps> = ({
  source,
  flags,
}) => {
  const [text, setText] = useState("");
  const { matched, code, error } = useMemo(() => {
    try {
      const regexp = new RegExp(source, flags);
      const matched = regexp.test(text);
      const code = `${regexp}.test('${text.replace(/'/g, "\\'")}')`
      return { matched, code };
    } catch (error) {
      return { error: error as Error };
    }
  }, [flags, source, text]);
  const { enqueueSnackbar } = useSnackbar();
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
      <Box mt={1} display="flex" alignItems="center">
        <Box flexGrow={1}>
          <CodeBlock code={`${code!}\n// ${matched!}`} language="javascript" />
        </Box>
        <CopyToClipboard
          text={code!}
          onCopy={() => enqueueSnackbar("已复制!", { autoHideDuration: 1500 })}
        >
          <Tooltip title="复制" placement="top">
            <IconButton>
              <FileCopyOutlined />
            </IconButton>
          </Tooltip>
        </CopyToClipboard>
      </Box>
    </Box>
  );
};
