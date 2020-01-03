import React from "react";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  SvgIcon,
  SvgIconProps
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {GitHub, Home} from '@material-ui/icons'
import {Link} from 'react-router-dom'

const useStyles = makeStyles({
  root: {
    margin: "40px auto"
  },
  title: {
    flexGrow: 1
  }
});

type PageLayoutProps = {
  title?: string;
};

const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
  const styles = useStyles();
  return (
    <>
      <AppBar>
        <Toolbar>
          <IconButton component='a' href='#/home'>
            <Home htmlColor='white' />
          </IconButton>
          <Typography className={styles.title}>{title || "在线工具"}</Typography>
          <IconButton
            component="a"
            href="https://github.com/whinc/online-tools"
            target="_blank"
          >
            <GitHub htmlColor="white"/>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container className={styles.root} maxWidth="md">
        {children}
      </Container>
    </>
  );
};

export default PageLayout;
