import { useContext, useEffect, useState } from "react";
import MobileNavButton from "../components/MobileNavButton";
import { motion } from "framer-motion";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { doc, onSnapshot } from "firebase/firestore";
import Button from "./Button";

// 🔸 Variants
const bgVariants = {
  open: {
    clipPath: "circle(120rem at 4rem 4rem)",
    transition: { type: "spring", stiffness: 20 },
  },
  closed: {
    clipPath: "circle(1rem at 4rem 4rem)",
    transition: { type: "spring", stiffness: 400, damping: 40 },
  },
};

const listVariants = {
  open: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const linkVariants = {
  open: { opacity: 1, y: 0 },
  closed: { opacity: 0, y: 40 },
};

// 🔸 Styled components
const StyledMobileNav = styled(motion.nav)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1c1f2e;
`;

const StyledBg = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100vw;
  background: #1c1f2e;
  z-index: 10;
`;

const StyledList = styled(motion.ul)`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  list-style: none;
  color: #e7e7e7;
`;

const StyledNavLink = styled(NavLink)`
  text-transform: uppercase;
  font-weight: 500;
  color: #fff;
  font-size: 1.6rem;
  padding: 1rem 2rem;
  transition: all 0.3s ease-in-out;
  border-radius: 2rem;

  &:hover,
  &.active {
    background-color: #ffee34;
    color: #000;
    box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.2);
  }
`;

function MobileNav() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid) return;
    const unsub = onSnapshot(doc(db, "users", currentUser.uid), (snap) => {
      if (snap.exists()) setUserInfo({ id: snap.id, ...snap.data() });
    });
    return () => unsub();
  }, [currentUser]);

  function handleSignOut() {
    auth.signOut();
    toast.success("Signed out.");
  }

  return (
    <StyledMobileNav animate={open ? "open" : "closed"} initial={false}>
      <StyledBg variants={bgVariants}>
        <StyledList variants={listVariants}>
          {[
            { to: "/", text: "JG" },
            { to: "/write", text: "Write" },
            { to: "/library", text: "Library" },
            { to: "/about", text: "About" },
          ].map(({ to, text }) => (
            <motion.li key={to} variants={linkVariants}>
              <StyledNavLink to={to} onClick={() => setOpen(false)}>
                {text}
              </StyledNavLink>
            </motion.li>
          ))}

          {currentUser ? (
            <>
              <motion.li variants={linkVariants}>
                <StyledNavLink
                  to={`/account/${currentUser.uid}`}
                  onClick={() => setOpen(false)}
                >
                  {userInfo?.displayName || "Account"}
                </StyledNavLink>
              </motion.li>
              <motion.li variants={linkVariants}>
                <Button onClick={handleSignOut} text="Sign Out">
                  Sign Out
                </Button>
              </motion.li>
            </>
          ) : (
            <motion.li variants={linkVariants}>
              <StyledNavLink to="/signin" onClick={() => setOpen(false)}>
                Sign In
              </StyledNavLink>
            </motion.li>
          )}
        </StyledList>
      </StyledBg>

      <MobileNavButton setOpen={setOpen} open={open} />
    </StyledMobileNav>
  );
}

export default MobileNav;
