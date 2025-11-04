import { motion } from "framer-motion";
import styled from "styled-components";

const StyledButton = styled(motion.button)`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  position: fixed;
  top: 2rem;
  left: 2rem;
  background-color: #1c1f2e;

  border: none;
  cursor: pointer;
  z-index: 9999;

  /* 425px */
  @media (max-width: 26.5em) {
    top: 1rem;
    left: 1rem;
  }
`;

const StyledBurgerMenu = styled.div`
  width: 5rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.4rem;

  /* 425px */
  /* @media (max-width: 26.5em) {
    width: 4rem;
    height: 4rem;
  } */
`;

const StyledBurgerLine = styled(motion.div)`
  background-color: #e7e7e7;

  height: 0.4rem;
  width: 4rem;
`;

function MobileNavButton({ setOpen, open }) {
  return (
    <StyledButton
      aria-label="toggle navigation open"
      onClick={() => setOpen((prevOpen) => !prevOpen)}
    >
      <StyledBurgerMenu>
        <StyledBurgerLine
          variants={{
            open: {
              position: "absolute",
              top: "50%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
              rotate: 45,
            },
          }}
        ></StyledBurgerLine>
        {!open && <StyledBurgerLine></StyledBurgerLine>}
        <StyledBurgerLine
          variants={{
            open: {
              position: "absolute",
              top: "50%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
              rotate: -45,
            },
          }}
          // transition={{ duration: 0.2 }}
        ></StyledBurgerLine>
      </StyledBurgerMenu>
    </StyledButton>
  );
}

export default MobileNavButton;
