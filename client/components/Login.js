import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../store';


const Login = ({ login })=> {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const onSubmit = ev => {
    ev.preventDefault();
    login({ email, password })
      .catch(ex => {
        if(ex.response.status){
          setError('Bad email and/or password');
        }
      });
  };
  return (
    <form onSubmit={ onSubmit }>
      {
        !!error && <div className='alert alert-danger'>{ error }</div>
      }
      <input placeholder='email' name='email' onChange={ ev=> setEmail(ev.target.value)}/>
      <input placeholder='password' name='password' onChange={ ev => setPassword(ev.target.value)}/>
      <button className='btn btn-primary' disabled={!email || !password}>Login</button>
    </form>
  );
};

const mapDispatchToProps = (dispatch, { history })=> {
  return {
    login: (credentials)=> dispatch(login(credentials, history))
  };
};

export default connect(null, mapDispatchToProps)(Login);

