import styled from "styled-components";
import Navbar from "../components/Navbar";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import Error from "../pages/Error";

const StyledAccount = styled.div`
  width: 100vw;
  min-height: 100vh;
  padding: 8% 2% 2% 2%;
  display: grid;
  grid-template-columns: 25% 75%;

  /* 1485px */
  @media (max-width: 92.8em) {
    padding: 8% 3% 2% 2%;
  }

  /* 1200px */
  @media (max-width: 75em) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    align-items: start;
  }

  /* 930px */
  @media (max-width: 58.1em) {
    padding: 1% 4% 2% 2%;
  }

  /* 525px */
  @media (max-width: 32.81em) {
    padding: 0rem;
    grid-template-rows: auto 1fr;
  }
`;
const StyledName = styled.h1`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: rgb(28, 31, 46, 0.8);
  padding-bottom: 2rem;
  text-transform: uppercase;
  font-family: "Playfair Display", serif;
  /* padding: 2rem; */

  /* 1200px */
  @media (max-width: 75em) {
    border-bottom: none;
    padding-bottom: 0rem;
    padding: 0rem;
    grid-row: 1 / 2;
    grid-column: 2/3;
    /* margin-bottom: 4rem; */
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
  }

  /* 930px */
  @media (max-width: 58.1em) {
    padding-top: 0.4rem;
  }

  /* 525px */
  @media (max-width: 32.81em) {
    grid-column: span 2;
  }

  /* 400px */
  @media (max-width: 25em) {
    font-size: 2.6rem;
    /* margin-right: 1rem; */
    padding-right: 0.4rem;
  }

  /* 425px */
  @media (max-width: 26.5em) {
    padding-top: 0rem;
    padding-bottom: 1rem;
  }

  /* 335px */
  @media (max-width: 21em) {
    align-self: flex-end;
  }
`;

const StyledWrapper = styled.div`
  padding: 2rem 4rem;
  display: flex;
  flex-direction: column;
  /* overflow-y: scroll; */
  min-height: 100%;
  width: auto;
  /* flex: 1; */
  min-height: 0;
  /* overflow-y: visible;  */

  /* 800px */
  @media (max-width: 50em) {
    padding: 1rem;
    padding-right: 2.2rem;
  }
`;

const StyledNav = styled.nav`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem;
  height: 100%; /* for large screens */
  /* 1200px */
  @media (max-width: 75em) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    height: auto;
    padding: 1rem;
    row-gap: 2rem;
  }
  /* 930px */
  @media (max-width: 58.1em) {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: auto;
    gap: 1rem;
    padding: 1.5rem;
  }
  /* 525px */
  @media (max-width: 32.81em) {
    height: auto;
    margin-right: 0;
  }
`;

const StyledNavList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: left;
  list-style: none;
  height: 100%;
  width: 100%;
  /* gap: 2rem; */

  /* 1200px */
  @media (max-width: 75em) {
    flex-direction: row;
    align-items: center;

    grid-row: 2 / 3;
    grid-column: span 2;
    padding: 2rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const StyledNavItem = styled.li`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
  padding: 2rem 0rem;
  color: #999;

  /* 1200px */
  @media (max-width: 75em) {
    border-bottom: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0rem;
  }
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

const StyledDropdown = styled.select`
  display: none;
  text-align: center;

  /* 525px */
  @media (max-width: 58.1em) {
    display: flex;
    width: 90vw;
    padding: 1rem;
    font-size: 1.6rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 0.8rem;
    background-color: #fff;
    color: #1c1f2e;
    font-weight: 500;
    outline: none;
    cursor: pointer;
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

  /* 1200px */
  @media (max-width: 75em) {
    font-size: 1.4rem;
    padding: 1rem 2rem;
    font-weight: 600;
    width: 50%;
    /* height: 50%; */
    justify-self: center;
    align-self: center;
    grid-row: 3 / 4;
    grid-column: span 2;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeRoute, setActiveRoute] = useState("favorites");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    //start loading before snapshot
    setLoading(true);

    const userRef = doc(db, "users", id);

    const unsub = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setUser({ id: docSnap.id, ...docSnap.data() });
          setError(null);
        } else {
          setError(new Error("User not found."));
        }
        //stop loading after snapshot resolves
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function handleDelete() {
    //1 Sign User out.
    //2 Delete user from users array
    //3 Delete the user from the authentication
    //4 Give user Notification
    console.log("Deleting Account...");
  }

  const handleDropdownChange = (route) => {
    setActiveRoute(route);
    navigate(route);
  };

  if (loading) {
    return <Spinner $height={"calc(100vh - 8rem)"} />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <>
      {/* <Navbar /> */}
      <StyledAccount>
        {windowWidth >= 525 ? (
          <StyledNav>
            <StyledName>{user?.displayName}</StyledName>
            <StyledNavList>
              {/* <StyledNavItem>Dashboard</StyledNavItem> */}
              <StyledNavItem>
                <StyledNavLink className="nav-link" to={`favorites`}>
                  Favorites
                </StyledNavLink>
              </StyledNavItem>
              <StyledNavItem>
                <StyledNavLink className="nav-link" to={`mystories`}>
                  My Stories
                </StyledNavLink>
              </StyledNavItem>
              <StyledNavItem>
                <StyledNavLink className="nav-link" to={`drafts`}>
                  Drafts
                </StyledNavLink>
              </StyledNavItem>
              <StyledNavItem>
                <StyledNavLink className="nav-link" to={`edit`}>
                  Edit Account
                </StyledNavLink>
              </StyledNavItem>
            </StyledNavList>
            <StyledButton onClick={() => setModalOpen(true)}>
              Delete account
            </StyledButton>
          </StyledNav>
        ) : (
          <StyledNav>
            <StyledName>{user?.displayName}</StyledName>
            <StyledDropdown
              value={activeRoute}
              onChange={(e) => handleDropdownChange(e.target.value)}
            >
              <option name="favorites" value="favorites">
                Favorites
              </option>
              <option name="mystories" value="mystories">
                My Stories
              </option>
              <option name="drafts" value="drafts">
                Drafts
              </option>
              <option name="edit" value="edit">
                Edit Account
              </option>
            </StyledDropdown>
          </StyledNav>
        )}
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
