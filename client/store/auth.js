import axios from 'axios'

const SET_AUTH = 'SET_AUTH';

const setAuth = auth => ({type: SET_AUTH, auth })

export const exchangeTokenForAuth = (history)=> {
  return (dispatch)=> {
    const token = window.localStorage.getItem('token');
    if(!token){
      return 
    }
    return axios.get('/api/auth', {
      headers: {
        authorization: token
      }
    })
    .then( response => response.data)
    .then( auth => {
      dispatch(setAuth(auth))
      if(history){
        history.push('/');
      }
    }) 
    .catch( ex => {
      console.log(ex.message);
      //window.localStorage.removeItem('token')
    })
  }
}

export const logout = ()=> {
  window.localStorage.removeItem('token');
  return setAuth({});
}

export const login = (credentials, history)=> {
  return (dispatch)=>{
    return axios.post('/api/auth', credentials)
    .then(response => response.data)
    .then( data => {
      window.localStorage.setItem('token', data.token);
      dispatch(exchangeTokenForAuth(history));
    })
  }
};

export default function(state = {}, action) {
  switch (action.type) {
    case SET_AUTH:
      return action.auth;
  }
  return state;
};
