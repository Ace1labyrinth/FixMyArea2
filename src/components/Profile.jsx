import React, {useEffect, useState} from "react";
import {auth, db} from "../firebase";
import {doc, getDoc} from "firebase/firestore";
// import {toast} from "react-toastify";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      } else {
        // console.log("User is not logged in");
      }
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
        console.error("Error logging out:", error.message);
    }
  }

  return (
    <div className="profile">
      {userDetails ? (
        <>
          <h3>Welcome {userDetails.fullname}</h3>
          <div className="profile-details">
            <p>Email: {userDetails.email}</p>
            <p>Full Name: {userDetails.fullname}</p>
            <p>Location: {userDetails.location}</p>
          </div>
          <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading....</p>
      )}
    </div>
  );
};
export default Profile;
