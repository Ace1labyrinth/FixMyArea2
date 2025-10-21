import React, {useState} from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../firebase";
import {toast} from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href= "/report";
    //   alert("Logged in successfully!");
      toast.success("Logged in successfully!", {
        position: "top-center",
      });
    } catch (err) {
    //   setError(err.message);
      toast.error("Incorrect Email/Password!", {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>
          Welcome To <span>FixMyArea</span>
        </h1>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
        <p>
          Don't have an account ? <a href="/signup">Register</a>
        </p>
      </form>
      {/* {error && <p style={{color: "red"}}>{error}</p>} */}
    </div>
  );
};
export default Login;
