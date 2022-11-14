import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLogin, setUserId } from '../../redux/reducers/auth'
import GoogleLogin from 'react-google-login'
// import { GoogleOAuthProvider} from "@react-oauth/google"
import { gapi } from "gapi-script";



const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');
    const [value, setValue] = useState('');
//   /
  const [id, setId] = useState('')
    const handelFailure = (result)=>{
        console.log(result);
    }

    const handleLogin =(googleDate)=>{
        setEmail(googleDate.profileObj.email)
        console.log(googleDate.profileObj.email);
        setPassword('1234')
        
        console.log(googleDate.tokenId);
        console.log(googleDate);
        if(value === ''){
            setResponse('Please pick either customer or worker')
            return
        }
        axios.post(`http://localhost:5000/login/${value}`, {
            email,
            password
        })
        .then((result) => {
            dispatch(setLogin(result.data.token));
            dispatch(setUserId(result.data.token));
            if(value === 'customer'){
                navigate('/')
            }else{
                navigate('/worker')
            }
        })
        .catch((err) => {
            console.log(err);
            // setResponse(err.response.data.massage)
        })
    }
    
    useEffect(() => {
        function start() {
          gapi.client.init({
            clientId:"971735679119-ptsdkh5tirpodu47q1seh6tqu9cqjsr0.apps.googleusercontent.com",
            scope: 'email',
          });
        }
    
        gapi.load('client:auth2', start);
      }, []);




    const handleButton = () => {
        if(value === ''){
            setResponse('Please pick either customer or worker')
            return
        }
        axios.post(`http://localhost:5000/login/${value}`, {
            email,
            password
        })
        .then((result) => {
            dispatch(setLogin(result.data.token));
            dispatch(setUserId(result.data.result[0].id));
            if(value === 'customer'){
                navigate('/')
            }else{
                navigate('/worker')
            }
        })
        .catch((err) => {
            console.log(err.response.data.massage);
            setResponse(err.response.data.massage)
        })
    }




  return (
    <div className='login-container'>
        <h3>Login</h3>
        <input type='email' placeholder='Email' onChange={(e) => {setEmail(e.target.value)}}/>
        <input type='password' placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}/>
        <legend>Joining us as:</legend>
        <label><input id="Customer" type="radio" name="Customer-Worker" value="customer"  onClick={(e) => {setValue(e.target.value);}}/> Customer</label>
        <label><input id="Worker" type="radio" name="Customer-Worker" value="worker" onClick={(e) => {setValue(e.target.value);}}/> Worker</label>
        <button onClick={handleButton}>Sign In</button>
      <div>
     {/* <GoogleOAuthProvider clientId="971735679119-qg354t44ghuarsqi5apslk80hukfohi6.apps.googleusercontent.com"  */}
        <GoogleLogin
         clientId="971735679119-ptsdkh5tirpodu47q1seh6tqu9cqjsr0.apps.googleusercontent.com"
         buttonText="Login With Google"
         onSuccess={handleLogin}
         onFailure={handelFailure}
         cookiePolice={'single_host_origin'}
        />
          {/* </GoogleOAuthProvider> */}
        
        </div>
        {response && <h3>{response}</h3>}
    </div>
  )
}

export default Login