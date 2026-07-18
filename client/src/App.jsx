import { useState } from "react";
import "./App.css";

function App() {
  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );


  const handleSubmit = async () => {
    try {
      const url = isSignup
        ? "http://localhost:5000/api/auth/signup"
        : "http://localhost:5000/api/auth/login";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          isSignup
            ? { name, email, password }
            : { email, password }
        ),
      });

      const data = await response.json();

      if (response.ok) {

        if (!isSignup) {
          localStorage.setItem("token", data.token);
          setIsLoggedIn(true);
        }

        setMessage(data.message);

      } else {
        setMessage(data.message);
      }

    } catch (error) {
      setMessage("❌ Server Error");
    }
  };


  const getProfile = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5000/api/profile",
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const data = await response.json();

    setProfile(JSON.stringify(data.user));
  };


  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setProfile("");
    setMessage("Logged out successfully");
  };


  if (isLoggedIn) {
    return (
      <div className="container">
        <div className="login-box">

          <h1>Dashboard 🎉</h1>

          <p>
            Welcome! You are logged in.
          </p>

          <button onClick={getProfile}>
            View Profile
          </button>

          {profile && (
            <p>{profile}</p>
          )}

          <button onClick={logout}>
            Logout
          </button>

        </div>
      </div>
    );
  }


  return (
    <div className="container">
      <div className="login-box">

        <h1>
          {isSignup
            ? "Create Account 🚀"
            : "Welcome Back 👋"}
        </h1>

        {isSignup && (
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />


        <button onClick={handleSubmit}>
          {isSignup ? "Signup" : "Login"}
        </button>


        {message && <p>{message}</p>}


        <h4>
          {isSignup
            ? "Already have account?"
            : "Don't have an account?"}

          <span
            style={{
              color:"blue",
              cursor:"pointer"
            }}
            onClick={()=>{
              setIsSignup(!isSignup);
              setMessage("");
            }}
          >
            {isSignup ? " Login" : " Sign Up"}
          </span>

        </h4>

      </div>
    </div>
  );
}

export default App;