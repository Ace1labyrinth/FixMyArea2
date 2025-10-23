import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {motion} from "framer-motion";
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {auth, db} from "../firebase";
// import {useNavigate} from "react-router-dom";

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState(null);
  const [updatedDescription, setUpdatedDescription] = useState("");
  // const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) {
        console.log("No user logged in");
        return;
      }
      // ✅ Match the collection name from Report.jsx
      const q = query(
        collection(db, "myreport"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);

      const fetchedReports = [];

      querySnapshot.forEach((doc) => {
        fetchedReports.push({id: doc.id, ...doc.data()});
      });

      setReports(fetchedReports);
      setLoading(false);
    };

    fetchReports();
  }, [user]);

  //Delete a report
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "reports", id));
      setReports((prev) => prev.filter((r) => r.id !== id));
      setMessage("Report deleted successfully!");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  //Start editing
  const handleEdit = (report) => {
    setEditingReport(report);
    setUpdatedDescription(report.description);
  };

  //Update report
  const handleUpdate = async () => {
    try {
      const reportRef = doc(db, "reports", editingReport.id);
      await updateDoc(reportRef, {
        description: updatedDescription,
        updatedAt: new Date(),
      });

      setReports((prev) =>
        prev.map((r) =>
          r.id === editingReport.id
            ? {...r, description: updatedDescription}
            : r
        )
      );
      setEditingReport(null);
      setUpdatedDescription("");
      setMessage("Report updated successfully!");
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  if (loading) return <p>Loading your reports...</p>;
  if (reports.length === 0) return <p>No reports submitted yet.</p>;

  return (
    <Container
      as={motion.div}
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={{duration: 0.4}}>
      <Title>My Reports</Title>

      {message && <SuccessMsg>{message}</SuccessMsg>}

      <ReportsGrid>
        {reports.map((report) => (
          <ReportCard key={report.id}>
            {editingReport && editingReport.id === report.id ? (
              <>
                <EditArea
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                />
                <ButtonRow>
                  <SaveButton onClick={handleUpdate}>Save</SaveButton>
                  <CancelButton onClick={() => setEditingReport(null)}>
                    Cancel
                  </CancelButton>
                </ButtonRow>
              </>
            ) : (
              <>
                <h3>{report.category}</h3>
                <p>
                  <strong>Description:</strong> {report.description}
                </p>
                <p>
                  <strong>Location:</strong> {report.location}
                </p>
                <p>
                  <strong>LGA:</strong> {report.lga}
                </p>

                {report.image && <Image src={report.image} alt="Report" />}

                {report.reportedBy && (
                  <small>
                    Reported by {report.reportedBy.fullname} (
                    {report.reportedBy.email})
                  </small>
                )}

                <p>
                  <small>
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleString()
                      : ""}
                  </small>
                </p>

                <ButtonRow>
                  <EditButton onClick={() => handleEdit(report)}>
                    Edit
                  </EditButton>
                  <DeleteButton onClick={() => handleDelete(report.id)}>
                    Delete
                  </DeleteButton>
                </ButtonRow>
              </>
            )}
          </ReportCard>
        ))}
      </ReportsGrid>
    </Container>
  );
};

export default MyReports;

const Container = styled.div`
  padding: 2rem;
  max-width: 1300px;
  margin: 0 auto;
  min-height: 100vh;

  @media (max-width: 1024px) {
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
  @media (max-width: 480px) {
    padding: 0.8rem;
  }
`;
const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 1024px) {
    font-size: 1.8rem;
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const SuccessMsg = styled.p`
  color: #16a34a;
  font-weight: 500;
  margin-bottom: 1rem;
  text-align: center;
`;

const ReportsGrid = styled.div`
  display: grid;
  width: 100%;
  box-sizing: border-box;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.2rem;
  justify-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.2rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    gap: 0.8rem;
  }
`;

const ReportCard = styled.div`
  width: 100%;
  max-width: 300px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.8);
  border-box: border-box;
  padding: 1.2rem 1.5rem;
  transition: 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
  }

  h3 {
    margin-bottom: 0.4rem;
    color: #333;
    font-size: 1.2rem;
  }
  p {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    line-height: 1rem;
  }
  small {
    color: gray;
    display: block;
    margin-top: 0.3rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;

    h3 {
      font-size: 1.05rem;
    }
    p {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    padding: 0.9rem;
    h3 {
      font-size: 1rem;
    }
    p {
      font-size: 0.85rem;
    }
  }
`;

const Image = styled.img`
  width: 250px;
  max-height: 220px;
  object-fit: cover;
  border-radius: 10px;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    max-height: 180px;
  }

  @media (max-width: 480px) {
    max-height: 160px;
  }
`;

const EditArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  resize: vertical;
  margin-bottom: 0.7rem;

  @media (max-width: 768px) {
    font-size: 0.5rem;
    padding: 8px;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ButtonBase = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const EditButton = styled(ButtonBase)`
  background-color: #3b82f6;
  color: white;

  &:hover {
    background-color: #2563eb;
  }
`;

const DeleteButton = styled(ButtonBase)`
  background-color: #ef4444;
  color: white;

  &:hover {
    background-color: #dc2626;
  }
`;

const SaveButton = styled(ButtonBase)`
  background-color: #16a34a;
  color: white;

  &:hover {
    background-color: #15803d;
  }
`;

const CancelButton = styled(ButtonBase)`
  background-color: #9ca3af;
  color: white;

  &:hover {
    background-color: #6b7280;
  }
`;
