
import React from "react";
import {Box, GridList, GridListTile, ListSubheader, GridListTileBar} from '@material-ui/core'
import PageLayout from 'layout/PageLayout'
import {useHistory} from 'react-router-dom'

const IndexPage: React.FC = () => {
  const history = useHistory()
  return (
    <PageLayout>
      <GridList cellHeight={200} cols={2}>
        <GridListTile style={{height: 'auto'}} cols={2}>
          <ListSubheader component="div">Online Tools</ListSubheader>
        </GridListTile>
        <GridListTile onClick={() => history.push('/regexp')}>
          <Box bgcolor='primary.main' height={'100%'}/>
          <GridListTileBar
            title='正则表达式'
          />
        </GridListTile>
        <GridListTile>
          <Box bgcolor='primary.main' height={'100%'}/>
          <GridListTileBar
            title='glob 模式'
          />
        </GridListTile>
      </GridList>
    </PageLayout>
  );
}

export default IndexPage;
