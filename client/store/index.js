import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import pages from './pages'
import auth, { exchangeTokenForAuth as _exchangeTokenForAuth } from './auth'
import images, { fetchImages } from './images'

const reducer = combineReducers({ pages, auth, images })
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

//do same for login?
const exchangeTokenForAuth = (...args)=> {
  return (dispatch)=> {
    return dispatch(_exchangeTokenForAuth(...args))
      .then(()=> {
        dispatch(fetchImages());
      })
      .catch(ex => console.log(ex));
  };
};

export default store
export * from './pages';
export * from './auth';
export * from './images';
export { exchangeTokenForAuth };
