// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import React from 'react';
import ChatWindow from './ChatWindow';
import './ChatWindow.css';
import { useLogoutFunction, useRedirectFunctions, withAuthInfo } from '@propelauth/react';
import Home from './Home';
import UserInfo from './UserInfo';
import logo from './assets/logo.png';
import hokieFeet from './assets/hokie_feet.png';
import { Routes, Route } from 'react-router-dom';
import './App.css';

const App = withAuthInfo(({isLoggedIn}) => {
  const logoutFn = useLogoutFunction()
  const {redirectToSignupPage, redirectToLoginPage} = useRedirectFunctions();

  const handleLogout = async () => {
    await logoutFn(true); // Ensure the logout function completes
    window.location.href = '/'; // Redirect to the home page
  };

  if (isLoggedIn) {
    return <div className="container">
      <img src={logo} alt="Logo" className="App-logo-1" />
      <div className="hello"><h1>Hello</h1></div>
      <div className="App">
        <ChatWindow />
      </div>
      <div className="logout-container">
        <div className="home_path">
            <Routes>
              <Route exact path="/" element={<Home/>}/>
              <Route path="/user_info" element={<UserInfo/>}/>
            </Routes>
        </div>
        <button onClick={handleLogout} className="logout-button">
            Log out
        </button>
      </div>
    </div>;
  } else {
    return <div className="container">
        <img src={hokieFeet} alt="Hookie Feet" className="top-right-image" />
        <img src={logo} alt="Logo" className="App-logo" />
        <div className="button-container">
        <button onClick={() => redirectToSignupPage()} className="signup-button">
            Sign up
        </button>
        <button onClick={() => redirectToLoginPage({ postLoginRedirectUrl: window.location.href })} className="login-button">
          Log in
        </button>
        </div>
    </div>
  }
})

// function App() {
//   return (
//     <div className="App">
//       <ChatWindow />
//     </div>
//   );
// }

export default App;
