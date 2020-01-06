
import React from "react";
import {Box, GridList, GridListTile, ListSubheader, GridListTileBar, IconButton} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import PageLayout from 'layout/PageLayout'
import {useHistory} from 'react-router-dom'
import regexp from 'assets/regexp.svg'
import { Launch } from "@material-ui/icons";

const useStyles = makeStyles({
  clickable: {
    '&:hover': {
      cursor: 'pointer'
    }
  }
})

const IndexPage: React.FC = () => {
  const styles = useStyles()
  const history = useHistory()
  return (
    <PageLayout>
      <GridList cellHeight={200} cols={2}>
        <GridListTile className={styles.clickable} onClick={() => history.push('/regexp')}>
          <img src={regexp} alt='正则表达式' />
          <GridListTileBar
            title='正则表达式'
            actionIcon={<IconButton><Launch htmlColor='white'/></IconButton>}
          />
        </GridListTile>
        <GridListTile className={styles.clickable}>
          <Box bgcolor='primary.main' height={'100%'}/>
          <GridListTileBar
            title='开发中...'
          />
        </GridListTile>
      </GridList>
    </PageLayout>
  );
}

export default IndexPage;
