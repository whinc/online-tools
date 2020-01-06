import { createMuiTheme } from "@material-ui/core/styles";
import {blue, pink} from '@material-ui/core/colors'

declare module "@material-ui/core/styles/createMuiTheme" {
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    codeFontFamily: string;
  }
}

export const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink
  },
  codeFontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"
});
