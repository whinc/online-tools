import React from 'react'
import {Box, Chip} from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";

export type RegExpChipsProps = {
  onSelect?: (data: {source: string, flags: string}) => void
}

export const RegExpChips: React.FC<RegExpChipsProps> = ({onSelect}) => {
  const styles = useStyles()
  return (
    <Box display="flex" flexWrap="wrap" className={styles.tags}>
      {REG_EXP_ARR.map(({ label, source }) => (
        <Chip
          key={label}
          variant="outlined"
          label={label}
          onClick={() => onSelect?.({ source, flags: "" })}
        />
      ))}
    </Box>
  );
};

const useStyles = makeStyles(theme => ({
  tags: {
    "& > *": {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
}))

const REG_EXP_ARR = [
  {
    label: "身份证号",
    source: /^(\d{17}[0-9Xx]|\d{15})$/.source,
  },
  {
    label: "Email地址",
    source: /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/.source,
  },
  {
    label: "中文字符",
    source: /^[\u4e00-\u9fa5]+$/.source,
  },
  {
    label: "双字节字符(含汉字)",
    // eslint-disable-next-line no-control-regex
    source: /^[^\x00-\xff]+$/.source,
  },
  {
    label: "时间(时:分:秒)",
    source: /^([01]?\d|2[0-3]):[0-5]?\d:[0-5]?\d$/.source,
  },
  {
    label: "日期(年:月:日)",
    source: /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/
      .source,
  },
  {
    label: "IPv4地址",
    source: /^\d{0,3}\.\d{0,3}\.\d{0,3}\.\d{0,3}$/.source,
  },
  {
    label: "手机号",
    source: /^(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}$/.source,
  },
];
