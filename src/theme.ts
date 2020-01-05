import { createMuiTheme } from "@material-ui/core/styles";

declare module "@material-ui/core/styles/createMuiTheme" {
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    codeFontFamily: string;
  }
}

export const theme = createMuiTheme({
  codeFontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"
});
