import styled from "styled-components";
import Navbar from "../components/Navbar";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";

const StyledAccount = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 8% 6% 2% 6%;
  display: grid;
  grid-template-columns: 25% 75%;
`;

const StyledName = styled.h1`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: rgb(28, 31, 46, 0.8);
  padding-bottom: 2rem;
  text-transform: uppercase;
  font-family: "Playfair Display", serif;
  /* padding: 2rem; */
`;

const StyledWrapper = styled.div`
  padding: 2rem 4rem;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  width: 100%;
`;

const StyledNav = styled.nav`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: left;
  /* justify-content: space-between; */
  /* padding: 4rem 0rem; */
  /* gap: 2rem; */
  height: auto;
  padding: 2rem;
`;

const StyledNavList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: left;
  list-style: none;
  height: 100%;
  width: 100%;
  /* gap: 2rem; */
`;

const StyledNavItem = styled.li`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
  padding: 2rem 0rem;
  color: #999;
`;

const StyledNavLink = styled(NavLink)`
  color: #999;
  transition: all 0.3s ease-in-out;

  &:hover {
    /* color: #85e9e1; */
    color: #1c1f2e;
    font-weight: 500;
  }

  &.active {
    color: #1c1f2e;
    font-weight: 500;
  }
`;

const StyledButton = styled.button`
  background-color: #ffee34;
  border: none;
  padding: 2rem;
  color: #1c1f2e;
  font-size: 1.6rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 2rem;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #ff0000;
    color: #fff;
    cursor: pointer;
  }
`;

const StyledModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  padding: 3rem;
  gap: 4rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  background-color: #1c1f2e;
  color: #fff;
  width: 50vw;
  height: 30vh;
  font-size: 2rem;
  box-shadow: 0rem 0.3rem 0.8rem -1rem rgba(0, 0, 0, 0.8);
  border-radius: 1.2rem;
  z-index: 1000;
`;

const StyledModal = styled.div`
  display: ${(props) => (props.$modalOpen ? "flex" : "none")};
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  backdrop-filter: blur(4px);
`;

const StyledModalButton = styled(Button)`
  font-weight: 600;
`;
const StyledButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  /* grid-column: 6 / -1; */
  .btn-delete {
    &:hover {
      background-color: #ff0000;
      color: #fff;
    }
  }
`;

function Account() {
  //Needs to be a user logged in before allowing access to this page.
  //name
  //username
  //list of their stories
  //Edit profile options e.g change username
  const { id } = useParams();
  const [user, setUser] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [loading, isLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const userRef = doc(db, "users", id);

    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUser({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No user found");
      }
    });

    return () => unsub();
  }, [id]);

  async function handleDelete() {
    //1 Sign User out.
    //2 Delete user from users array
    //3 Delete the user from the authentication
    //4 Give user Notification
    console.log("Deleting Account...");
  }

  return (
    <>
      <Navbar />
      <StyledAccount>
        <StyledNav>
          <StyledName>{user?.displayName}</StyledName>
          <StyledNavList>
            <StyledNavItem>Dashboard</StyledNavItem>
            <StyledNavItem>
              <StyledNavLink
                className="nav-link"
                to={`account/${id}/favorites`}
              >
                Favorites
              </StyledNavLink>
            </StyledNavItem>
            <StyledNavItem>My Stories</StyledNavItem>
            <StyledNavItem>Edit Account</StyledNavItem>
          </StyledNavList>
          <StyledButton onClick={() => setModalOpen(true)}>
            Delete account
          </StyledButton>
        </StyledNav>

        <StyledWrapper>
          <Outlet />
        </StyledWrapper>
        <StyledModal $modalOpen={modalOpen}>
          <StyledModalContent>
            <p>
              Are you sure you want to delete your account? Deleting is
              permanent and cannot be undone. All your stories will also be
              deleted as will any favorites. Please consider carefully before
              confirming.
            </p>
            <StyledButtons>
              <StyledModalButton onClick={() => setModalOpen(false)}>
                Cancel
              </StyledModalButton>
              <StyledModalButton
                disabled={loading}
                className="btn-delete"
                onClick={() => {
                  handleDelete(currentUser?.uid);
                  setModalOpen(false);
                }}
              >
                Confirm Delete
              </StyledModalButton>
            </StyledButtons>
          </StyledModalContent>
        </StyledModal>
      </StyledAccount>
    </>
  );
}

export default Account;
