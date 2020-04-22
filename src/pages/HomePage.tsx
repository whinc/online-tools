
import React from "react";
import {Box, GridList, GridListTile, GridListTileBar} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import PageLayout from 'layout/PageLayout'
import {useHistory} from 'react-router-dom'
import regexp from 'assets/regexp.svg'

const useStyles = makeStyles({
  clickable: {
    '&:hover': {
      cursor: 'pointer'
    }
  }
})

const HomePage: React.FC = () => {
  const styles = useStyles()
  const history = useHistory()
  return (
    <PageLayout>
      <GridList cellHeight={200} cols={2}>
        <GridListTile className={styles.clickable} onClick={() => history.push('/regexp')}>
          <img src={regexp} alt='正则表达式' />
          <GridListTileBar
            title='正则表达式'
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

export default HomePage;
