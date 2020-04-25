import React from "react";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import githubTheme from "prism-react-renderer/themes/github";
import { Box } from "@material-ui/core";

export type CodeBlockProps = {
  code?: string;
  children?: string | string[]
  language?: Language;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code = '', language = 'json',  children = '' }) => {
  return (
    <Highlight
      {...defaultProps}
      code={code || (Array.isArray(children) ? children.join('') : children)}
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
