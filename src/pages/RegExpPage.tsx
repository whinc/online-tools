import React, {useCallback, useState} from "react";
import PageLayout from "layout/PageLayout";
import { Grid, TextField, Input , Button, Typography} from "@material-ui/core";
import {useSnackbar} from 'notistack'

type RegExpPageProps = {};

const RegExpPage = (props: RegExpPageProps) => {
  const [source, setSource] = useState({pattern: '', flags: ''})
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState('')
  const {enqueueSnackbar} = useSnackbar()

  const onClickTest = useCallback(() => {
    if (!source.pattern) {
      enqueueSnackbar("请输入正则表达式", {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 1500
      });
      return
    }
    const regexp = new RegExp(source.pattern, source.flags)
    const matches = regexp.test(inputText)
    setResult(String(matches))
  }, [source.pattern, source.flags, inputText, enqueueSnackbar])

  return (
    <PageLayout>
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Grid container>
            <Grid item xs={9} sm={10}>
              <Input
                style={{ height: "100%" }}
                startAdornment={<div style={{padding: "0 10px"}}>/</div>}
                placeholder="正则表达式"
                fullWidth
                value={source.pattern}
                onChange={e => setSource({...source, pattern: e.target.value})}
              />
            </Grid>
            <Grid item xs={2} sm>
              <Input
                startAdornment={<div style={{ padding: "0 10px" }}>/</div>}
                placeholder="标志位"
                fullWidth
                style={{ height: "100%" }}
                value={source.flags}
                onChange={e => setSource({...source, flags: e.target.value})}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
              <Button color="primary" variant="contained" onClick={onClickTest} fullWidth>
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
      </Grid>
    </PageLayout>
  );
};

export default RegExpPage;
