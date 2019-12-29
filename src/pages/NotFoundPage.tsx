import React from 'react'
import PageLayout from 'layout/PageLayout'
import { Link } from '@material-ui/core'

const NotFoundPage = () => {
  return (
    <PageLayout>
      <h1>404</h1>
      <Link href='/'>返回首页</Link>
    </PageLayout>
  )
}

export default NotFoundPage