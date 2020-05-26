import React from 'react'
import { Route } from 'react-router-dom';

import Page from './components/Page'

const App = () => {
  return (
    <Route path='/:id?' component={ Page } />
  )
}

export default App
