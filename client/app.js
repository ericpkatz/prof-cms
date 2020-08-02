import React, { Fragment, useEffect } from 'react'
import { Route, Switch, Link, Redirect } from 'react-router-dom';
import {  fetchImages, fetchPages, exchangeTokenForAuth, logout } from './store';
import { connect } from 'react-redux';

import Page from './components/Page'
import FormUpdate from './components/FormUpdate'
import FormCreate from './components/FormCreate'
import Login from './components/Login'

const App = ({ exchangeTokenForAuth, fetchPages, auth, logout}) => {
  useEffect(()=> {
    exchangeTokenForAuth();
    fetchPages();
  }, []);
  return (
    <div>
      <h1><Link to='/'>{ SITE_TITLE }</Link></h1>
      <Switch>
        <Route path='/add/:id?' component={ FormCreate } />
        <Route path='/edit/:id?' component={ FormUpdate } />
        {
          !auth.id && <Route path='/login' component={ Login } />
        }
        <Route path='/:id?' component={ Page } />
      </Switch>
      {
        !auth.id && <Link to='/login'>Login</Link>
      }
      {
        auth.id && <a href='#' onClick={ logout }>Logout</a>
      }
    </div>
  )
}

const mapDispatchToProps = (dispatch, { history })=> {
  return {
    exchangeTokenForAuth: ()=> dispatch(exchangeTokenForAuth(history)),
    logout: ()=> dispatch(logout()),
    fetchPages: ()=> dispatch(fetchPages())
  };
};

const mapStateToProps = ({ auth })=> {
  return {
    auth
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
