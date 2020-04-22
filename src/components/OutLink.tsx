import React from "react";
import { Tooltip, IconButton } from "@material-ui/core";
import { OpenInNew } from "@material-ui/icons";

export type OutLinkProps = {
  href: string;
  title?: Exclude<React.ReactNode, null | undefined>;
};

export const OutLink: React.FC<OutLinkProps> = ({ href, title = "" }) => {
  return (
    <Tooltip title={title}>
      <IconButton component="a" href={href} target="_blank">
        <OpenInNew />
      </IconButton>
    </Tooltip>
  );
};
