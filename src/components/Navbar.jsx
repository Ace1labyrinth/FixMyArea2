import React, { useState } from "react";
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import {auth} from "../firebase";


const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  }
  return (
    <Nav>
      <Logo>FixMyArea</Logo>
      <MenuIcon onClick={() => setMenuOpen(!menuOpen)}>
        <span />
        <span />
        <span />
      </MenuIcon>
      <NavLinks open={menuOpen}>
        <StyledLink to="/" onClick={() => setMenuOpen(false)}>
          Home
        </StyledLink>
        <StyledLink to="/about" onClick={() => setMenuOpen(false)}>
          About
        </StyledLink>
        <StyledLink to="/report" onClick={() => setMenuOpen(false)}>
          Report
        </StyledLink>
        {auth.currentUser ? (
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        ) : (
          <StyledLink to="/login" onClick={() => setMenuOpen(false)}>
            Login
          </StyledLink>
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

  @media (max-width: 768px) {
    position: absolute;
    top: 80px;
    right: 0;
    background: rgb(74, 149, 74);
    flex-direction: column;
    align-items: flex-start;
    width: 94%;
    padding: 1rem 2rem;
    gap: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease-in-out;
    transform: ${({open}) => (open ? "translateY(0)" : "translateY(-200%)")};
    opacity: ${({open}) => (open ? "1" : "0")};
    pointer-events: ${({open}) => (open ? "auto" : "none")};
  }
`;
const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const MenuIcon = styled.div `
display: none;
flex-direction: column;
cursor: pointer;
gap: 5px;

span {
  width: 25px;
  height: 3px;
  background: #fff;
  border-radius: 3px;
  transition: 0.3s;
}
@media (max-width: 768px) {
  display: flex;
}
`

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
