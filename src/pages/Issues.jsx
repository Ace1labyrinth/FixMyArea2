import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {motion} from "framer-motion";
import {useNavigate} from "react-router-dom";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../firebase";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      const snapshot = await getDocs(collection(db, "issues"));
      const data = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
      setIssues(data);
    };
    fetchIssues();
  }, []);

  return (
    <Container>
      <motion.div
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.4}}>
        <BackButton onClick={() => navigate(-1)}>Previous</BackButton>
        <Title>Reported Issues In Your Area</Title>

        {issues.length === 0 ? (
          <EmptyMessage>No issues have been reported yet.</EmptyMessage>
        ) : (
          <Grid>
            {issues.map((issue) => (
              <Card key={issue.id}>
                {issue.image && <Image src={issue.image} alt="Issue" />}
                <Info>
                  <Category>{issue.category}</Category>
                  <Text>
                    <b>Location:</b> {issue.location}
                  </Text>
                  {issue.geo && (
                    <Text>
                      <b>Coordinates:</b> {issue.geo.lat.toFixed(4)},{" "}
                      {issue.geo.lng.toFixed(4)}
                    </Text>
                  )}
                  <Text>
                    <b>Description:</b> {issue.description}
                  </Text>
                  <Text>
                    <b>Date:</b>{" "}
                    {issue.createdAt?.toDate?.().toLocaleString?.()}
                  </Text>
                  <Text>
                    <b>LGA:</b> {issue.lga}
                  </Text>
                </Info>
              </Card>
            ))}
          </Grid>
        )}
      </motion.div>
    </Container>
  );
};

export default Issues;

// Styled components (same as your version)
const Container = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
`;
const Title = styled.h2`
  text-align: center;
  color: #2e2e2e;
  margin-bottom: 2rem;
`;
const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;
const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-left: 5px solid #0f52ba;
`;
const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 5px;
`;
const Info = styled.div`
  margin-top: 1rem;
`;
const Text = styled.p`
  margin: 0.3rem 0;
  color: #555;
  font-size: 0.95rem;
`;
const Category = styled.h3`
  margin: 0;
  color: #222831;
`;
const EmptyMessage = styled.p`
  text-align: center;
  color: #888;
  margin-top: 4rem;
`;
const BackButton = styled.button`
  background: transparent;
  color: #4cb8b3;
  border-radius: 5px;
  border: 1px solid #4cb8b3;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover {
    background: #4cb8b3;
    color: #fff;
  }
`;
