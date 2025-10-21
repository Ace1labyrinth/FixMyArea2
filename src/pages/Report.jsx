import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {motion} from "framer-motion";
import {useNavigate} from "react-router-dom";
import {auth, db, storage} from "../firebase";
import {toast} from "react-toastify";

import {
  collection,
  addDoc,
  // serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import LeafletPicker from "../components/LeafletPicker";
import {lgaOptions} from "../data/lgas";

const Report = () => {
  const [category, setCategory] = useState("Pothole");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [lga, setLga] = useState("");
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [geoLocation, setGeoLocation] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Fetch user details from Firestore
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData({uid: user.uid, ...userSnap.data()});
        } else {
          console.error("No user data found!");
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData) {
      toast.error("Please fill in all fields.", {position: "top-center"});
      alert("User data not loaded yet. Please wait...");
      return;
    }

    try {
      let imageUrl = "";

      if (image) {
        const safeFileName = `${
          userData.uid
        }_${Date.now()}_${image.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const imageRef = ref(storage, `myreport/${safeFileName}`);

        const uploadTask = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(uploadTask.ref);
      }

      // Save issue report with user info
      await addDoc(collection(db, "myreport"), {
        category,
        description,
        location,
        lga,
        image: imageUrl || null,
        geo: geoLocation || null,
        userId: auth.currentUser ? auth.currentUser.uid : null,
        createdAt: new Date().toISOString(),
        status: "not-fixed", //Default status

        // 🧠 Add user details here
        reportedBy: {
          uid: userData.uid,
          fullname: userData.fullname,
          email: userData.email,
          location: userData.location,
        },
      });

      setSuccess(true);
      setCategory("Pothole");
      setDescription("");
      setLocation("");
      setLga("");
      setImage(null);
      setGeoLocation(null);

      setTimeout(() => navigate("/myreport"), 2000);
    } catch (err) {
      console.error("Error submitting issue:", err);
      alert("Failed to submit issue");
    }
  };

  return (
    <Container>
      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.4}}>
        <BackButton onClick={() => navigate(-1)}>Previous</BackButton>
        <Title>Report an Issue</Title>

        {userData ? (
          <form onSubmit={handleSubmit}>
            <p>
              Reporting as: <strong>{userData.fullname}</strong>
            </p>

            <Label>Issue Type</Label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}>
              <option value="Pothole">Pothole</option>
              <option value="Streetlight">Broken Streetlight</option>
              <option value="Flooding">Flooding</option>
              <option value="Blocked Gutter">Blocked Gutter</option>
              <option value="Other">Other</option>
            </Select>

            <Label>Description</Label>
            <Textarea
              placeholder="Describe the issue briefly..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <Label>Location</Label>
            <Input
              type="text"
              placeholder="E.g., Sangotedo under bridge, near Shoprite"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            <Label>LGA</Label>
            <Select
              value={lga}
              onChange={(e) => setLga(e.target.value)}
              required>
              <option value="">-- Select LGA --</option>
              {lgaOptions.map((lga) => (
                <option key={lga} value={lga}>
                  {lga}
                </option>
              ))}
            </Select>

            <Label>Pin Fault Location (Optional)</Label>
            <LeafletPicker onLocationSelect={(loc) => setGeoLocation(loc)} />

            <Label>Upload Photo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />

            {success && <Success>✅ Issue reported successfully!</Success>}

            <Button type="submit">Submit Report</Button>
          </form>
        ) : (
          <p>Loading your profile...</p>
        )}
      </motion.div>
    </Container>
  );
};

export default Report;

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
  }
  @media (max-width: 480px){
    margin: 1rem;
    padding: 1rem;
  }
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #2e2e2e;
  font-size: 1.8rem;
  text-align: center;

  @media (max-width: 480px){
    font-size: 1.5rem;
  }
`;

const Label = styled.label`
  font-weight: bold;
  margin-top: 1rem;
  display: block;
  font-size: 1rem;

  @media (max-width: 480px){
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  padding: 0.8rem;
  width: 90%;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 0.3rem;
  font-size: 1rem;

  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.9rem;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 0.3rem;
  resize: vertical;
  font-size: 1rem;
  min-height: 100px;

  @media (max-width: 480px){
    padding: 0.7rem;
    font-size: 0.9rem;
  }
`;

const Select = styled.select`
  padding: 0.8rem;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-top: 0.3rem;
  font-size: 1rem;

  @media(max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.9rem;
  }
`;

const BackButton = styled.button`
  background: transparent;
  color: green;
  border: 1px solid green;
  border-radius: 5px;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover {
    background: green;
    color: #fff;
  }

  @media(max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  background: green;
  color: #fff;
  padding: 0.9rem 1.5rem;
  border: none;
  border-radius: 5px;
  margin-top: 2rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 480px){
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;

const Success = styled.p`
  color: green;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
`;
