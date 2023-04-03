import React, {useState} from "react";

import './App.css';
import { Login } from './Login';
import { Register } from './Register';
import { Main } from "./Main";

function App() {
  
  //const [currentForm, setCurrentForm] = useState('login');
   
  
  const [currentForm, setCurrentForm] = useState({formName: 'login', user_name: null});
  const toggleForm = (formName, user_name) => {
    setCurrentForm({formName: 'login', user_name});
  }
  
  
  
  
  
  
  
  // const toggleForm = (formName) => {
  //   setCurrentForm(formName);
  // }

  return (
    <div className="App" id="root">
  {/* {currentForm.formName === "login" ? (
    <Login onFormSwitch={toggleForm} />
  ) : currentForm.formName === "register" ? (
    <Register onFormSwitch={toggleForm} />
  ) : (
    <Main userName={currentForm.user_name} />
  )} */}

  <Login />
  {/* //<Register /> */}
</div>
  );
}

export default App;
