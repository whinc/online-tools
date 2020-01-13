import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import githubTheme from "prism-react-renderer/themes/github";
import { Box } from "@material-ui/core";

export type Language =
  | "markup"
  | "bash"
  | "clike"
  | "c"
  | "cpp"
  | "css"
  | "javascript"
  | "jsx"
  | "coffeescript"
  | "actionscript"
  | "css-extr"
  | "diff"
  | "git"
  | "go"
  | "graphql"
  | "handlebars"
  | "json"
  | "less"
  | "makefile"
  | "markdown"
  | "objectivec"
  | "ocaml"
  | "python"
  | "reason"
  | "sass"
  | "scss"
  | "sql"
  | "stylus"
  | "tsx"
  | "typescript"
  | "wasm"
  | "yaml";

export type CodeBlockProps = {
  code: string;
  language: Language;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  return (
    <Highlight
      {...defaultProps}
      code={code}
      language={language}
      theme={githubTheme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Box
          component="pre"
          lineHeight={1.5}
          py={1}
          px={1}
          className={className}
          style={{...style, margin: 0}}
        >
          <Box component="code">
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </Box>
        </Box>
      )}
    </Highlight>
  );
};
