import React, {useState} from "react";
import { getUserByEmail } from "./databaselogin";
//import { useHistory } from 'react-router-dom';
import { Main } from "./Main";
import { Register } from './Register';


export const Login =  ({onFormSwitch}) => {
    const [email, setEmail] = useState('');
    const [pass, setPassword] = useState('');
    const [error, setError] = useState('');
    const [redirect, setRedirection] = useState(false);
    const [redirect1, setRedirection1] = useState(false);
    const [user, setUserName] = useState(null);
    
    const handleSubmitbtn = (e) => {
        e.preventDefault();
        getUserByEmail(email, pass, (err, user) => {
          if (err) {
            console.error('Login failed', err);
            setError(err.message);
            alert("Login Failed. Email/password is invalid or either of the credentials are missing.Please enter valid credentials");
            

          } else {
            console.log('Login successful', user);
            //onFormSwitch('main' , user.user_name);
            setRedirection(true);
            setUserName(user);
            setEmail(user.email)
            
          }
        });
      };

      if (redirect) {
        return <Main user_name={user.user_name} email={email} subscribedartist= {user.subscribedartist} />;
      }



      const handleRegisterClick = () => {
        setRedirection1(true);
        
        
      };

      if (redirect1) {
        return <Register />;
      }

      

    
    return (
        <div className="auth-form">
            <h2>Login </h2>
            <form className="login-form" onSubmit={handleSubmitbtn}>
            <label htmlFor = "email">Email</label>
            <input value={email} type= "email" placeholder="youremail@gmail.com" id="email" name= "email" onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor = "password">Password</label>
            <input value={pass} type= "password" placeholder="**********" id="password" name= "password" onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit">Submit</button>
            
        </form>
        {/* <button className="link-btn" onClick={() => onFormSwitch('register')}>Don't have an account? Register</button> */}
        
        <button className="link-btn" onClick={handleRegisterClick}>Don't have an account? Register</button>

        </div>
        
         
        
       
    )
}