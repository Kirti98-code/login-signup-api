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

  const API = "https://login-signup-api-glvk.onrender.com";

  const handleSubmit = async () => {
    try {
      const url = isSignup
        ? `${API}/api/auth/signup`
        : `${API}/api/auth/login`;

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
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API}/api/profile`, {
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(JSON.stringify(data.user));
      } else {
        setProfile(data.message);
      }
    } catch (error) {
      setProfile("❌ Server Error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setProfile("");
    setMessage("Logged Out Successfully");
  };

  if (isLoggedIn) {
    return (
      <div className="container">
        <div className="login-box">
          <h1>Dashboard 🎉</h1>

          <p>Welcome! You are logged in.</p>

          <button onClick={getProfile}>View Profile</button>

          {profile && <p>{profile}</p>}

          <button onClick={logout}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="login-box">
        <h1>
          {isSignup ? "Create Account 🚀" : "Welcome Back 👋"}
        </h1>

        <p>
          {isSignup ? "Signup to continue" : "Login to continue"}
        </p>

        {isSignup && (
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {isSignup ? "Signup" : "Login"}
        </button>

        {message && <p>{message}</p>}

        <h4>
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <span
            style={{
              color: "blue",
              cursor: "pointer",
            }}
            onClick={() => {
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