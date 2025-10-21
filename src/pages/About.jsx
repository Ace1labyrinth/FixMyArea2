import React from "react";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
const About = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <HeroSection>
        <Overlay />
        <HeroContent>
          <h1>About FixMyArea</h1>
          <p>
            Empowering citizens to report, track, and fix local problems
            together.
          </p>
        </HeroContent>
      </HeroSection>

      <Section>
        <h2>Our Mission</h2>
        <p>
          FixMyArea was created to connect citizens and government bodies
          through technology. Our goal is to make it easy for people to report
          issues like potholes, streetlights, and flooding and track their
          resolution. Together, we can build cleaner, safer, and more efficient
          communities.
        </p>
      </Section>

      <SectionGray>
        <h2>How It Works</h2>
        <Steps>
          <Step>
            <img
              src="https://cdn-icons-png.flaticon.com/512/786/786432.png"
              alt="Report"
            />
            <h3>1. Report an Issue</h3>
            <p>
              Describe the issue, upload a photo, and pin the exact location on
              the map.
            </p>
          </Step>
          <Step>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
              alt="Track"
            />
            <h3>2. Track Progress</h3>
            <p>
              Stay updated as issues move from “Not Fixed” to “In Progress” and
              finally “Fixed.”
            </p>
          </Step>
          <Step>
            <img
              src="https://cdn-icons-png.flaticon.com/512/992/992703.png"
              alt="Impact"
            />
            <h3>3. See the Impact</h3>
            <p>Watch your community improve with every report submitted.</p>
          </Step>
        </Steps>
      </SectionGray>

      <JoinSection>
        <h2>Join the Movement</h2>
        <p>
          Every report counts. Be part of the change, together we can fix our
          communities, one issue at a time.
        </p>
        <button onClick={() => navigate("/report")}>Report an Issue</button>
      </JoinSection>
    </Container>
  );
};
export default About;

const Container = styled.div`
  font-family: "Poppins", sans-serif;
  color: #333;
  line-height: 1.6;
`;

const HeroSection = styled.div`
  position: relative;
  background-image: url("https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=80");
  background-size: cover;
  background-position: center;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`;

const HeroContent = styled.div`
  position: relative;
  text-align: center;
  max-width: 700px;
  z-index: 2;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
`;

const Section = styled.section`
  max-width: 900px;
  margin: 3rem auto;
  text-align: center;
  padding: 0 1.5rem;

  h2 {
    color: #009688;
    margin-bottom: 1rem;
  }
`;

const SectionGray = styled(Section)`
  background: #f5f6f7;
  padding: 3rem 1.5rem;
  border-radius: 8px;
`;

const Steps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const Step = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  img {
    width: 70px;
    height: 70px;
    margin-bottom: 1rem;
  }

  h3 {
    color: #009688;
    margin-bottom: 0.5rem;
  }
`;

const JoinSection = styled.div`
  text-align: center;
  background: #009688;
  color: white;
  padding: 3rem 1.5rem;
  border-radius: 8px;
  margin: 3rem auto;

  button {
    background: white;
    color: #009688;
    border: none;
    padding: 0.8rem 1.5rem;
    font-weight: bold;
    border-radius: 5px;
    margin-top: 1rem;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }
`;
