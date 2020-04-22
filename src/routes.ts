import React from 'react'
import NotFoundPage from 'pages/NotFoundPage'

type RouteConfig = {
  path: string,
  exact?: boolean,
  component: React.ElementType
}

const routes: RouteConfig[] = [
  {
    path: '/home',
    exact: true,
    component: React.lazy(() => import('pages/HomePage'))
  },
  {
    path: '/regexp',
    component: React.lazy(() => import('pages/RegExpPage'))
  },
  {
    path: '*',
    component: NotFoundPage
  }
]

export default routes