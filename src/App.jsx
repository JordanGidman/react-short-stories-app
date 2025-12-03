import styled from "styled-components";
import Home from "./pages/Home";
import GlobalStyles from "./GlobalStyles";
import SignIn from "./pages/SignIn";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import SignUp from "./pages/SignUp";
import { AuthContextProvider } from "./context/AuthContext";
import About from "./pages/About";
import Account from "./pages/Account";
import WriteStory from "./pages/WriteStory";
import Library from "./pages/Library";
import StoryList from "./pages/StoryList";
import Book from "./pages/Story";
import MyStories from "./pages/MyStories";
import EditStory from "./pages/EditStory";
import ScrollToTop from "./helpers/ScrollToTop";
import Favorites from "./components/Favorites";
import EditAccount from "./components/EditAccount";
import ProtectedRoute from "./helpers/ProtectedRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Error from "./pages/Error";
import Spinner from "./components/Spinner";
import Drafts from "./components/Drafts";
import MainLayout from "./layouts/MainLayout";

const StyledApp = styled.div`
  .Toastify__toast-theme--colored.Toastify__toast--success {
  }
`;

const StyledContainer = styled(ToastContainer)`
  &&&.Toastify__toast-container {
    /* container overrides if needed */
  }

  .Toastify__toast {
    background-color: #1c1f2e;
    color: #fff;
    justify-content: center;
    align-items: center;
    text-transform: capitalize;
  }

  .Toastify__toast-body {
    color: #fff;
  }

  /* Progress bar */
  .Toastify__progress-bar {
    background-color: #ffee34; /* main bar */
    opacity: 1;
  }

  .Toastify__progress-bar--default {
    background-color: rgba(255, 238, 52, 0.3);
  }

  /* Close button */
  .Toastify__close-button {
    color: #fff;
  }

  .Toastify__close-button:hover {
    color: #fff;
    opacity: 0.8;
  }

  .Toastify__toast-theme--colored.Toastify__toast--success {
    background-color: red;
  }
  /* Success toast icon */
  .Toastify__toast-icon {
    svg {
      fill: #ffee34;
    }
  }
`;

function App() {
  //i wanted to allow images to be used both for the book "cover" and within the post itself however firebase has paywalled its image uploading unfortunately. I will look into alternate db options for the next project.

  //For now im going to use this as a trello board -

  //COMPLETED
  //1 - User authentication (signup/signin/signout) - Done
  //2 - User profile page (view/edit profile info, view user's stories) - Done
  //3 - Create a story (title, genre, synopsis, cover image, story text) - Done
  //4 - View a list of stories (filter by genre) - Done
  //5 - View a single story (title, author, genre, synopsis, cover image, story text) - Done
  //6 - Edit a story (title, genre, synopsis, cover image, story text) - Done
  //7 - Delete a story (Need to make sure logged in user can only delete their own stories) - Done
  //8 - My stories page to edit/delete user's own stories - Done
  //9 - Ability to share publicly or hide and keep private - Done
  //10 - Like/favorite stories - Done
  //11 - Footer - Done
  //12 - User comments on stories - Done
  //13 - Favorite stories - Done
  //14 - Display favorite stories - Done
  //15 - Refactor MyStories to be a part of the account page - Done
  //16 - Required Logins for certain actions/pages (write, like, favorite, mystories) - Done
  //17 - Edit account details - Done
  //18 - Refactor homepage stories pulling so we only pull the amount we need and not the entire collection - Done
  //19 - Search functionality - Done
  //20 - Form validation - Done
  //21 - Add toast notifications for user feedback writing/deleting/commenting/liking- Not done
  //22 - Page Not found page completed - Done
  //23 - Error handling - Done
  //24 - Delete comments - Done
  //25 - Loading states (Need to use loading spinner) - Done
  //26 - Put a loading spinner/component in place of a page that has not yet loaded.
  //27 - Refactor Book/WriteBook to be Story/WriteStory for consistency - Done
  //28 - Change styling of the navbar link we are currently on
  //29 - Finish home page - Done
  //30 - Maybe look into replacing none loaded images with a loading spinner instead of a temp image. This may be tricky as im using the images as a backgroundImage url. - Not done
  //31 - About page - Not done
  //32 - Save, edit, post drafts - Done
  //33 - Sorting bug where the 1st in the list is the newest the last should be the oldest. Yet if i change the sorting to be the oldest the one that was last is not now first for some reason and vice versa. - Done
  //34 - Show likes on storyCards - Done
  //36 - Make it so that the mystories and favorites dont get a seperate scroll but just increase the page size - Done
  //37 - Fixed Account page navbar, if the user clicks a link on a large viewport to open favorites for example and then shrinks the layout the dropdown will show the previous option when the mobile layout was rendered. - Done
  //38 - Featured section link to staff picks - Done
  //39 - Responsive design - Done
  //     - Mobile nav - Done
  //     - Home page - Done
  //     - Library - Done
  //     - WriteStory - Done
  //     - GenreCard - Done
  //     - About - Done
  //     - Account - Done
  //     - MyStories - Done
  //     - Favorites - Done
  //     - Edit Account - Done
  //     - Drafts - Done
  //     - StoryList - Done
  //     - StoryCard - Done
  //     - Story page - Done
  //     - Comments - Done
  //     - CommentCard - Done
  //     - PageNotFound - Done
  //     - Sign In - Done
  //     - Sign Up - Done
  //40 -  Need to take into account the scale of the app, there are 200+ stories already but that number can increase greatly and i should plan for that, with story pull limits/pagination - Done
  //41 - Buttons on the mystories/favorites/drafts page dont get the tooltip when hovered on mobile layout (Fixed by replacing the icons on smaller layouts as hovering is not an option and i want it to be accessible) - Done
  //42 - drafts and favorites expand button has a delay when closing and does not look smooth like mystories and favorites - Fixed - Done

  //WIP
  //1 - Animations and transitions - Not done
  //2 - Edit comments (maybe)
  //3 - Favicon - Not done
  //4 - Implement delete account functionality - Not done
  //5 - Optimizations(Img compression, lazy loading, code splitting, memoization, refactors, etc) - Not done
  //6 - Potentially use session storage to keep write book and other input fields filled - in the case that a user accidentally refreshes before saving we dont want to delete their entire story. - Not done
  //7 - Notify users when navigating away from pages if their changes/inputs will be saved i.e If they made edits to a story but did not post the changes and are trying to leave the page we should advise them that they havent saved the changes etc - Not done
  //8 - SEO Improvements - Not done
  //9 - Accessibility Improvements - Not done
  //10 - Ability to add multiple genres (maybe)- Not done
  //11 - Either add a dashboard or make a different page on the account the default outlet. - Not done
  //12 - Deployment - Not done

  //UNFIXED BUGS
  //on mobile layout the account page navbar is misaligned due to the scroll bar

  return (
    <AuthContextProvider>
      <StyledApp>
        <GlobalStyles />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Layout routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="library" element={<Library />} />
              <Route path="library/:genre" element={<StoryList />} />
              <Route path="library/:genre/story/:id" element={<Book />} />

              {/* Protected nested routes */}
              <Route
                path="account/:id"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              >
                <Route path="favorites" element={<Favorites />} />
                <Route path="mystories" element={<MyStories />} />
                <Route path="drafts" element={<Drafts />} />
                <Route path="edit" element={<EditAccount />} />
              </Route>

              <Route
                path="write"
                element={
                  <ProtectedRoute>
                    <WriteStory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <ProtectedRoute>
                    <EditStory />
                  </ProtectedRoute>
                }
              />

              {/* fallback */}
              <Route path="*" element={<PageNotFound />} />
            </Route>

            {/* Routes WITHOUT navbar (auth, spinner, etc.) */}
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="error" element={<Error />} />
            <Route path="spinner" element={<Spinner />} />
          </Routes>
        </BrowserRouter>

        <StyledContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </StyledApp>
    </AuthContextProvider>
  );
}

export default App;
