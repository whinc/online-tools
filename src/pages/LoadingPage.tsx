import React from 'react'
import PageLayout from 'layout/PageLayout'
import { CircularProgress } from '@material-ui/core'

const LoadingPage = () => {
  return (
    <PageLayout>
      <div style={{textAlign: 'center'}}>

      <CircularProgress />
      </div>
    </PageLayout>
  )
}

export default LoadingPage