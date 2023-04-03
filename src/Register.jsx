import React, {useState} from "react";
import { Login } from './Login';
import { addUser } from "./databaselogin";

export const Register = (props) => {

   
    const [email, setEmail] = useState('');
    const [pass, setPassword] = useState('');
    const [user_name, setName] = useState('');
    const [error, setError] = useState('');
    const [redirect, setRedirection] = useState(false);
    const [redirect1, setRedirection1] = useState(false);
    const handleSubmitbtn = (e) => {

        e.preventDefault();
        addUser(user_name, email, pass , (err, data) => {
            if (err) {
                console.error('Unable to add user', err);
                setError(err.message);
                alert('User already exists and cannot be added again 1');
                //make logic for user already exists
                } else {
                console.log('User added successfully', data);
                //props.onFormSwitch('login');
                setRedirection(true);

                }
        })
        
    }

    if (redirect) {
        return <Login />;
      }


      const handleRegisterClick = () => {
        setRedirection1(true);
        
        
      };

      if (redirect1) {
        return <Login />;
      }




    return (
        <div className="auth-form">
            <h2>Register </h2>
            <form className="register-form" onSubmit={handleSubmitbtn}>
         <label htmlFor = "user_name">User Name</label>
        <input value={user_name} type= "user_name" placeholder="Full Name" id="user_name" name= "user_name" onChange={(e) => setName(e.target.value)} />


        <label htmlFor = "email">Email</label>
        <input value={email} type= "email" placeholder="youremail@gmail.com" id="email" name= "email" onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor = "password">Password</label>
        <input value={pass} type= "password" placeholder="**********" id="password" name= "password" onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit" >Submit</button>
        </form>
        <button className="link-btn" onClick={handleRegisterClick}>Already have an account? Login </button>
        </div>
        
         
        
    )
}