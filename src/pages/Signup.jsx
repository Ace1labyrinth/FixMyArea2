import React, {useState} from "react";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth, db} from "../firebase";
import {doc, setDoc} from "firebase/firestore";
import {toast} from "react-toastify";

const Signup = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    //Validation
    if (!fullname || !email || !password || !location) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      //Get the created user from the userCredential object
      const user = userCredential.user;
      

      //Save additional data in firestore
        await setDoc(doc(db, "users", user.uid), {
          fullname,
          email,
          location,
          createdAt: new Date().toISOString(),
        });
      toast.success("Account created successfully! Welcome to FixMyArea!", {
        position: "top-center",
      });
      console.log("User created and saved in Firestore!");
      //Redirect to report page
      window.location.href = "/report";
    } catch (err) {
      console.error(err);
      toast.error(err.message, {
        position: "bottom-center",
      });
      //   alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h1>
          Welcome To <span>FixMyArea</span>
        </h1>
        <h2>Create Account</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        <br />
        <input
          type="name"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>
        <p>
          Already registered? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};
export default Signup;
