import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <Foot>
      <p>© {new Date().getFullYear()} FixMyArea. All rights reserved.</p>
    </Foot>
  )
}
export default Footer;

const Foot = styled.footer`
  text-align: center;
  background: rgb(74, 149, 74);
  color: #fff;
  padding: 1rem 0;
  margin-top: 2rem;
`;