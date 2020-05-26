import React, { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom';

import Page from './components/Page'
import Form from './components/Form'

const App = () => {
  return (
    <Fragment>
      <Switch>
        <Route path='/edit/:id?' component={ Form } />
        <Route path='/:id?' component={ Page } />
      </Switch>
    </Fragment>
  )
}

export default App
