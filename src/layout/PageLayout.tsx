import React from 'react'
import {Container} from '@material-ui/core'
import {makeStyles, createStyles} from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    margin: '40px auto'
  }
})

const PageLayout: React.FC = ({children}) => {
  const styles = useStyles()
  return (
    <Container className={styles.root} maxWidth='md'>
      {children}
    </Container>
  )
}

export default PageLayout