import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import SignUp from './components/Signup';
import './App.css';
import PostState from './context/PostContextState';
import Navbar from './components/Navbar';
import Posts from './components/Posts';
import YourPost from './components/YourPost';

function App() {
  const location = useLocation(); // Get the current location
  const [hideNavbar, setHideNavbar] = useState(false);

  // Hide navbar on '/' route
  React.useEffect(() => {
    if (location.pathname === '/') {
      setHideNavbar(true);
    } else {
      setHideNavbar(false);
    }
  }, [location.pathname]);

  return (
    <>
      <PostState>
        {!hideNavbar && <Navbar />}
        <Routes>
          <Route exact path="/" element={<SignUp />} />
          {/* <Route exact path="/home" element={<Home />} /> */}
            <Route exact path='/home' element={<Posts />}></Route>
            <Route exact path='/YourPost' element={<YourPost />}></Route>
        </Routes>
      </PostState>
    </>
  );
}

export default App;
