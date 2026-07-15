import styled from "styled-components";
import Navbar from "../components/Navbar";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import Error from "../pages/Error";
import { toast } from "react-toastify";

const StyledAccount = styled.main`
  width: 100%;
  min-height: 100vh;
  /* padding: 8% 2% 2% 2%; */
  padding-top: 6%;
  padding-bottom: 2%;
  display: grid;
  grid-template-columns: 25% 75%;

  /* 1485px */
  /* @media (max-width: 92.8em) {
    padding: 8% 3% 2% 2%;
  } */

  /* 1200px */
  @media (max-width: 75em) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    align-items: start;
    padding-top: 8%;
  }

  /* 930px */
  @media (max-width: 58.1em) {
    padding: 0%;
  }

  /* 525px */
  @media (max-width: 32.81em) {
    padding: 0rem;
    grid-template-rows: auto 1fr;
  }
`;

const StyledName = styled.h1`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: rgb(28, 31, 46, 0.8);
  padding-bottom: 2rem;
  text-transform: uppercase;
  font-family: "Playfair Display", serif;
  width: 100%;

  /* padding: 2rem; */

  /* 1200px */
  @media (max-width: 75em) {
    width: 100%;
    border-bottom: none;
    padding-bottom: 0rem;
    grid-column: span 2;
    /* padding-left: 4rem; */
    /* grid-row: 1 / 2;
    grid-column: span 2; */
    /* align-self: center; */
    /* justify-self: center; */
    /* margin-bottom: 4rem; */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 930px */
  @media (max-width: 58.1em) {
    padding-top: 0.4rem;
  }

  /* 645px */
  @media (max-width: 40.3em) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* align-self: center; */
    /* justify-self: flex-start; */
    /* padding-left: 0rem; */
    padding: 2rem 0rem;
    width: 100%;
    margin-top: 6rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  /* 525px */
  @media (max-width: 32.81em) {
    /* grid-column: span 2; */
  }

  /* 400px */
  @media (max-width: 25em) {
    /* font-size: 2.6rem; */
    /* margin-right: 1rem; */
    /* padding-right: 0.4rem; */
  }

  /* 425px */
  /* @media (max-width: 26.5em) {
    padding-top: 0rem;
    padding-bottom: 1rem;
  } */

  /* 335px */
  /* @media (max-width: 21em) {
    align-self: flex-end;
  } */
`;

const StyledNameButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  width: 3rem;
  border: none;
  background-color: transparent;
  /* background-color: red; */

  ion-icon {
    font-size: 2.4rem;
  }

  &:hover {
    cursor: pointer;
  }
`;

const StyledNameOptions = styled.ul`
  position: absolute;
  top: 3rem;
  right: 2rem;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  /* gap: 1rem; */

  list-style: none;
  color: #fff;

  /* padding: 1rem 2rem; */
  font-size: 1.4rem;
  font-family: "Montserrat", sans-serif;
  text-transform: capitalize;
  font-weight: 500;

  width: 16rem;
  transition: all 0.3s ease-in-out;

  li {
    background-color: #1c1f2e;
    width: 100%;
    padding: 1rem;

    .view-profile {
      color: #fff;
    }
  }

  li:hover {
    background-color: #ffee34;

    & .view-profile {
      color: #000;
    }
  }

  .delete:hover {
    background-color: #ff0000;
  }
`;

const StyledWrapper = styled.div`
  padding: 2rem 4rem;
  /* padding: 2% 3% 2% 2%; */
  display: flex;
  flex-direction: column;

  min-height: 100%;
  width: auto;

  min-height: 0;

  /* 800px */
  @media (max-width: 50em) {
    padding: 1rem;
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
    column-gap: 2rem;
    width: 100%;
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
  /* 645px */
  @media (max-width: 40.3em) {
    align-items: center;
    justify-content: flex-start;
    padding: 2rem;
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

  /* 645px */
  @media (max-width: 40.3em) {
    padding-left: 0rem;
    padding-right: 0rem;
    flex-direction: column;
    gap: 1rem;
    border: none;
  }
`;

const StyledNavItem = styled.li`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
  padding: 2rem 0rem;

  /* 1200px */
  @media (max-width: 75em) {
    border-bottom: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0rem;
  }

  /* 645px */
  @media (max-width: 40.3em) {
    justify-content: flex-start;
  }
`;

const StyledNavLink = styled(NavLink)`
  color: #666;
  transition: all 0.3s ease-in-out;

  &:hover {
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

  /* 645px */
  @media (max-width: 645px) {
  }

  /* 525px */
  @media (max-width: 58.1em) {
    display: flex;
    /* width: 90%; */
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

  /* 1100px */
  @media (max-width: 68.75em) {
    width: 80vw;
  }

  /* 645px */
  @media (max-width: 40.3em) {
    width: 100vw;
    height: 100vh;
    margin-top: 9.1rem;
    border-radius: 0rem;
    justify-content: center;
  }
  /* 430px */
  @media (max-width: 26.875em) {
    font-size: 1.6rem;
  }
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

  /* 645px */
  @media (max-width: 40.3em) {
    width: 100%;
  }

  /* 430px */
  @media (max-width: 26.875em) {
    font-size: 1.4rem;
  }
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

  /* 645px */
  @media (max-width: 40.3em) {
    flex-direction: column;
  }
`;

const StyledLink = styled(Link)`
  background-color: #ffee34;
  border: none;
  color: rgb(28, 31, 46, 0.8);
  font-size: 1.6rem;
  letter-spacing: 0.1rem;
  padding: 0.8rem 0rem;
  transition: all 0.4s ease-in-out;
  font-weight: 700;
  margin-top: 2rem;
  border-radius: 2rem;
  text-transform: uppercase;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 100%;

  /* grid-column: 2/3; */
  grid-row: -2/-1;

  &:hover {
    background-color: #85e9e1;
    cursor: pointer;
  }

  &:visited {
    box-shadow: none;
  }

  &:active {
    box-shadow: none;
  }

  /* font-family: "Montserrat", sans-serif; */
`;

const StyledDeleteButton = styled(StyledLink)``;

const StyledNavWrapper = styled.div`
  display: grid;
  align-items: center;
  justify-content: space-between;
  grid-template-columns: auto 1fr auto;
  width: 100%;
  column-gap: 2rem;
  ion-icon {
    font-size: 3rem;

    &:hover {
      cursor: pointer;
    }
  }

  /* div {
    display: flex;
    align-items: center;
    gap: 1rem;

    
  } */
`;

function Account() {
  //Needs to be a user logged in before allowing access to this page.
  //name
  //username
  //list of their stories
  //Edit profile options e.g change username
  const { id } = useParams();
  const [user, setUser] = useState();
  const { currentUser } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeRoute, setActiveRoute] = useState("favorites");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    setActiveRoute(currentPath);
  }, [location]);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      },
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
    await currentUser?.delete();
    //3 Delete the user from the authentication
    //4 Give user Notification
    toast.success("Account deleted successfully. You have been signed out.");

    console.log("Deleting Account...");
  }

  const handleDropdownChange = (route) => {
    // switch (route) {
    //   case "profile":
    //     navigate(`/author/${currentUser.uid}`);
    //     break;

    //   case "delete":
    //     setModalOpen(true);
    //     break;

    //   default:
    //     setActiveRoute(route);
    //     navigate(route);
    // }

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
      <StyledAccount $modalOpen={modalOpen}>
        <StyledNav>
          <StyledName>
            {user?.displayName} {/* {windowWidth <= 645 && ( */}
            <StyledNameButton
              onClick={() => setMenuOpen(!menuOpen)}
              ref={menuRef}
            >
              <ion-icon name="ellipsis-vertical-outline"></ion-icon>

              {menuOpen && (
                <StyledNameOptions>
                  <li>
                    <Link
                      to={`/author/${currentUser.uid}`}
                      className="view-profile"
                    >
                      View Profile
                    </Link>
                  </li>
                  <li className="delete" onClick={() => setModalOpen(true)}>
                    Delete Account
                  </li>
                </StyledNameOptions>
              )}
            </StyledNameButton>
            {/* )}{" "} */}
          </StyledName>

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
              <StyledNavLink className="nav-link" to={`followed`}>
                Followed
              </StyledNavLink>
            </StyledNavItem>
            <StyledNavItem>
              <StyledNavLink className="nav-link" to={`edit`}>
                Edit Account
              </StyledNavLink>
            </StyledNavItem>
          </StyledNavList>
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
