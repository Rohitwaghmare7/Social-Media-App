import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { CiLock } from "react-icons/ci";
import '../index.css';
import Alert from './Alert';
export default function SignUp() {

  const [showSignUpForm, setShowSignUpForm] = useState(true);
  const [showSignInForm, setShowSignInForm] = useState(false);
  let history = useNavigate();

  const toggleForms = () => {
    setShowSignUpForm(!showSignUpForm);
    setShowSignInForm(!showSignInForm);
  };

  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: signUpUsername, email: signUpEmail, password: signUpPassword }),
    });
    const json = await response.json();
  
    if (json.success) {
      localStorage.setItem("token", json.authToken);
      history("/home");
      showAlert(
        "Account Created Successfully",
        "success"
      )
    } else {
      let errorMessage = "Invalid Credentials";
      if (json.errors && json.errors.length > 0) {
        errorMessage = json.errors.map(error => error.msg).join(", ");
      }
      showAlert(
        errorMessage,
        "danger"
      )
    }
  };
  


  const [signInUsername, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const handleSignIn = async(e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username:signInUsername,password: signInPassword}),
      });
      const json = await response.json();
      console.log(json)
      if(json.success === true) {
        localStorage.setItem("token" , json.authToken);
        showAlert(
            "Logged in Successfully",
            "success"
            )
        history("/home")
      }
      else{
        showAlert(
            "Invalid Credentials",
            "danger"
            )
      }
  };

  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Alert alert={alert} />
      <div className='container p-5'>
        <h1 className='text-4xl font-bold text-center mt-4 mb-2' style={{ fontWeight: '800' }}>Sign up for an account</h1>
        <p className='text-center' style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={toggleForms}>
          {showSignUpForm ? 'Or sign in to your existing account' : 'Or sign up for a new account'}
        </p>

        {showSignUpForm && (
          <>
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="mb-3">
                  <input type="email" placeholder='Email Address' className="form-control form-control-lg" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="mb-3">
                  <input type="text" placeholder='Username' className="form-control form-control-lg" value={signUpUsername} onChange={(e) => setSignUpUsername(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="mb-3">
                  <input type="password" placeholder='Password' className="form-control form-control-lg" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-6">
                <button type="button" className="btn btn-dark btn-lg btn-block d-flex align-items-center justify-content-center" style={{ width: '100%' }} onClick={handleSignUp}>
                  <div className="d-flex align-items-center">
                    <CiLock className="me-2" style={{ color: 'white' }} />
                    <span>Sign Up</span>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {showSignInForm && (
          <>
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="mb-3">
                  <input type="text" placeholder='UserName' className="form-control form-control-lg" value={signInUsername} onChange={(e) => setSignInEmail(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="mb-3">
                  <input type="password" placeholder='Password' className="form-control form-control-lg" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-6">
                <button type="button" className="btn btn-dark btn-lg btn-block d-flex align-items-center justify-content-center" style={{ width: '100%' }} onClick={handleSignIn}>
                  <div className="d-flex align-items-center">
                    <CiLock className="me-2" style={{ color: 'white' }} />
                    <span>Sign In</span>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
