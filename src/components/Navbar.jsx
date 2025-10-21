import React from "react";
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import {auth} from "../firebase";
const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  }
  return (
    <Nav>
      <Logo>FixMyArea</Logo>
      <NavLinks>
        <StyledLink to="/">Home</StyledLink>
        <StyledLink to="/about">About</StyledLink>
        <StyledLink to="/report">Report</StyledLink>
        {auth.currentUser ? (
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        ) : (
          <StyledLink to="/login">Login</StyledLink>
        )}
      </NavLinks>
    </Nav>
  );
};
export default Navbar;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(74, 149, 74);
  color: #fff;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;
const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;
const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
  border-radius: 5px;
  padding: 0.3rem 0.8rem;
  cursor: pointer;

  &:hover {
    background: white;
    color: #4cb8b3;
  }
`;
