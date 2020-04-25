import React from "react";
import { Box, Tooltip, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CopyToClipboard from "react-copy-to-clipboard";
import { FileCopyOutlined } from "@material-ui/icons";
import { useSnackbar } from "notistack";

export type CopyActionProps = {
  text: string
};

export const CopyAction: React.FC<CopyActionProps> = ({text}) => {
  const styles = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  return (
    <Box display="flex" className={styles.root}>
      <CopyToClipboard
        text={text}
        onCopy={() => enqueueSnackbar("已复制!", { autoHideDuration: 1500 })}
      >
        <Tooltip title="复制">
          <IconButton>
            <FileCopyOutlined />
          </IconButton>
        </Tooltip>
      </CopyToClipboard>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {},
}));
