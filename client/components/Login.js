import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../store';


const Login = ({ login })=> {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const onSubmit = ev => {
    ev.preventDefault();
    login({ email, password });
  };
  return (
    <form onSubmit={ onSubmit }>
      <input placeholder='email' name='email' onChange={ ev=> setEmail(ev.target.value)}/>
      <input placeholder='password' name='password' onChange={ ev => setPassword(ev.target.value)}/>
      <button>Button</button>
    </form>
  );
};

const mapDispatchToProps = (dispatch, { history })=> {
  return {
    login: (credentials)=> dispatch(login(credentials, history))
  };
};

export default connect(null, mapDispatchToProps)(Login);

