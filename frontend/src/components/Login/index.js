import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLogin, setUserId, setAdminLogin } from '../../redux/reducers/auth'
import GoogleLogin from 'react-google-login'
import { gapi } from "gapi-script";
import { FcGoogle } from "react-icons/fc";


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');
    const [value, setValue] = useState('');


    const clientId ="971735679119-ptsdkh5tirpodu47q1seh6tqu9cqjsr0.apps.googleusercontent.com";

    useEffect(() => {
        function start() {
          gapi.client.init({
            clientId: clientId,
            scope: "email",
          });
        }
        gapi.load("client:auth2", start);
      }, []);

  
      const onSuccess = (response) => {
        axios
          .post("http://localhost:5000/login/google", {
            firstName: response.wt.rV,
            lastName: response.wt.uT,
            email: response.wt.cu,
          })
          .then((result) => {
            console.log(result);
            dispatch(setLogin(result.data.token));
            dispatch(setUserId(result.data.userId));
            
          })
          .catch((err)=>{
            console.log(err);
          })
    
           
    
        navigate("/");
      };
      const onFailure = (response) => {
        console.log("FAILED", response);
      };



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
            // console.log(result.data.result[0].role_id);
            if(result.data.result[0].role_id == 1){
                dispatch(setAdminLogin(result.data.token));
                navigate('/admin')
                return
            }
            // console.log(result.data);
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
    <div className="register_page_container">
        <div>
        <img
                      className="register_image"
                      src={'https://thumbs.dreamstime.com/b/carpentry-background-22476057.jpg'}
                      alt="product"
                    />
        </div>
    <div className='login-container'>
        <h3>Login</h3>
        <input className='login_input' type='email' placeholder='Email' onChange={(e) => {setEmail(e.target.value)}}/>
        <input className='login_input' type='password' placeholder='Password' onChange={(e) => {setPassword(e.target.value)}}/>
        <legend>Joining us as:</legend>
        <label><input id="Customer" type="radio" name="Customer-Worker" value="customer"  onClick={(e) => {setValue(e.target.value);}}/> Customer</label>
        <label><input id="Worker" type="radio" name="Customer-Worker" value="worker" onClick={(e) => {setValue(e.target.value);}}/> Worker</label>
        <button className='login_btn' onClick={handleButton}>Sign In</button>
      
     
          <GoogleLogin 
            className='login_with_google_btn'
            clientId={clientId}
            onSuccess={onSuccess}
            onFailure={onFailure}
            render={(renderProps) => (
              <button className='buttonGoogle' onClick={renderProps.onClick}><span className='iconGoogle'><FcGoogle style={{height:'25px'}}/></span><span className='signin'>Sign in with Google</span></button>
            )}
           
          />
     
        
        {response && <h3>{response}</h3>}
    </div>
    </div>
  )
}

export default Login