// src/pages/Home.jsx
import React, {useState, useEffect} from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {db} from "../firebase";
import {getAuth} from "firebase/auth";
import styled from "styled-components";
import {toast} from "react-toastify";

const Home = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    description: "",
    category: "",
    status: "",
    image: "",
  });

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);

    const fetchReports = async () => {
      const querySnapshot = await getDocs(collection(db, "myreport"));
      const allReports = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(allReports);
    };
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      await deleteDoc(doc(db, "myreport", id));
      setReports(reports.filter((r) => r.id !== id));
      toast.info("Report deleted successfully✅!");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const reportRef = doc(db, "myreport", id);
    await updateDoc(reportRef, {status: newStatus});
    setReports(
      reports.map((r) => (r.id === id ? {...r, status: newStatus} : r))
    );
    toast.success(`Status updated to "${newStatus}"`);
  };

  const openEditModal = (report) => {
    setCurrentReport(report);
    setUpdatedData({
      description: report.description,
      category: report.category,
      status: report.status || "not-fixed",
      image: report.image || "",
    });
    setEditModal(true);
  };

  const handleEditSubmit = async () => {
    const reportRef = doc(db, "myreport", currentReport.id);
    await updateDoc(reportRef, {
      description: updatedData.description,
      category: updatedData.category,
      status: updatedData.status,
      image: updatedData.image,
    });
    setReports(
      reports.map((r) =>
        r.id === currentReport.id ? {...r, ...updatedData} : r
      )
    );
    setEditModal(false);
    toast.success("Report updated successfully ✅");
  };

  const filteredReports =
    filter === "all" ? reports : reports.filter((r) => r.status === filter);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedData((prev) => ({...prev, image: reader.result}));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container>
      <Hero>
        <h1>Welcome To FixMyArea</h1>
        <p className="para">Help Fix Lagos. Report a Problem in Your Area.</p>
        <p className="para">
          Join thousands of Lagos citizens working together to improve our
          infrastructure. Report issues, track progress, and make a difference
          in your community.
        </p>
      </Hero>

      <FilterBar>
        <FilterButton
          $active={filter === "all"}
          onClick={() => setFilter("all")}>
          All
        </FilterButton>
        <FilterButton
          $active={filter === "not-fixed"}
          onClick={() => setFilter("not-fixed")}>
          Not Fixed
        </FilterButton>
        <FilterButton
          $active={filter === "in-progress"}
          onClick={() => setFilter("in-progress")}>
          In Progress
        </FilterButton>
        <FilterButton
          $active={filter === "fixed"}
          onClick={() => setFilter("fixed")}>
          Fixed
        </FilterButton>
      </FilterBar>

      <IssuesContainer>
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <IssueCard key={report.id}>
              {report.image && <img src={report.image} alt="issue" />}
              <h3>{report.category}</h3>
              <Description>{report.description}</Description>
              <small>
                📍 {report.location} ({report.lga})
              </small>
              <StatusBadge $status={report.status || "not-fixed"}>
                {report.status || "Not Fixed"}
              </StatusBadge>

              {user && report.userId === user.uid && (
                <ActionButtons>
                  <select
                    value={report.status || "not-fixed"}
                    onChange={(e) =>
                      handleStatusChange(report.id, e.target.value)
                    }>
                    <option value="not-fixed">Not Fixed</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="fixed">Fixed</option>
                  </select>
                  <button onClick={() => openEditModal(report)}>Edit</button>
                  <button onClick={() => handleDelete(report.id)}>
                    Delete
                  </button>
                  {/* {add edit modal} */}
                </ActionButtons>
              )}
            </IssueCard>
          ))
        ) : (
          <p>No issues reported yet.</p>
        )}
      </IssuesContainer>

      {/* {Edit Modal} */}

      {editModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>Edit report</h2>
            <label>Category</label>
            <input
              type="text"
              value={updatedData.category}
              onChange={(e) =>
                setUpdatedData({...updatedData, category: e.target.value})
              }
            />
            <label>Description</label>
            <input
              type="text"
              value={updatedData.description}
              onChange={(e) =>
                setUpdatedData({...updatedData, description: e.target.value})
              }
            />

            <label>Status</label>
            <select
              value={updatedData.status}
              onChange={(e) =>
                setUpdatedData({...updatedData, status: e.target.value})
              }>
              <option value="not-fixed">Not-Fixed</option>
              <option value="in-progress">In-Progress</option>
              <option value="fixed">Fixed</option>
            </select>

            <label>Update Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {updatedData.image && (
              <img src={updatedData.image} alt="preview" width="100%" />
            )}

            <ModalButtons>
              <button onClick={handleEditSubmit}>Save</button>
              <button onClick={() => setEditModal(false)}>Cancel</button>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Home;

// ================= Styled Components =================

const Container = styled.div`
  font-family: "Poppins", sans-serif;
  // background: #f5f6f9;
  // color: #333;
  min-height: 100vh;
  padding: 2rem;
  background: #f5f6f9;
`;

/* Hero */
const Hero = styled.div`
  text-align: center;
  color: #333;
  margin: auto;
  max-width: 800px;
  padding: 2rem;

  h1 {
    font-size: 2rem;
    color: green;
  }

  .para {
    margin: 0.5rem 0;
  }
`;

/* Filter Bar */
const FilterBar = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  button {
    background: green;
    color: #fff;
    border: none;
    margin: 0 0.5rem;
    padding: 0.7rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;

    &:hover {
      background: #fff;
      color: green;
    }
  }
`;

const FilterButton = styled.button`
  background: ${({$active}) => ($active ? "#333" : "#000")};
  color: ${({$active}) => ($active ? "#fff" : "#222")};
  border: none;
  margin: 0.3rem;
  padding: 0.7rem 1.2rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s ease;

  &:hover {
    background: green;
    color: #fff;
  }
`;

/* Issues Grid */
const IssuesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.2rem;
  padding: 0 2rem;
`;

/* Issue Card */
const IssueCard = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }

  img {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 0.7rem;
    height: 180px;
    object-fit: cover;
  }

  h3 {
    margin-bottom: 0.5rem;
    color: green;
  }

  small {
    display: block;
    margin-top: 0.4rem;
    color: #666;
  }
`;

/* Description text neatly wraps */
const Description = styled.p`
  color: #555;
  font-size: 0.9rem;
  line-height: 1.4;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* Status Badge with transient prop fix */
const StatusBadge = styled.span`
  display: inline-block;
  margin-top: 0.7rem;
  background: ${({$status}) =>
    $status === "fixed"
      ? "#4CAF50"
      : $status === "in-progress"
      ? "#FFA500"
      : "#FF4C4C"};
  color: #fff;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  margin-top: 0.8rem;
  display: flex;
  gap: 0.5rem;

  select {
    padding: 0.4rem;
    border-radius: 5px;
  }

  button {
    background: red;
    color: #fff;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background: darkred;
    }
    &:nth-child(3){
      background: red;
      &:hover {
        background: darkred;
      }
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  width: 50%;
  max-width: 500px;

  input,
  textarea,
  select {
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.7rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  img {
    border-radius: 8px;
    margin-bottom: 1rem;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }

  button:first-child {
    background: green;
    color: white;
  }

  button:last-child {
    background: gray;
    color: white;
  }
`;

