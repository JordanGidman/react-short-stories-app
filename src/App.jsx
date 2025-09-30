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
import WriteBook from "./pages/WriteBook";
import Library from "./pages/Library";
import StoryList from "./pages/StoryList";
import Book from "./pages/Book";
import MyStories from "./pages/MyStories";
import EditStory from "./pages/EditStory";
import ScrollToTop from "./helpers/ScrollToTop";
import Favorites from "./components/Favorites";

const StyledApp = styled.div``;

function App() {
  //Need a check for a current user before allowing them to navigate to any page that requires one e.g write/account

  //i wanted to allow images to be used both for the book "cover" and within the post itself however firebase has paywalled its image uploading unfortunately. I will look into alternate db options for the next project.

  //For now im going to use this as a list of features i want to add -

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

  //WIP
  //1 - Form validation - Partially done
  //2 - Error handling and loading states (Need to use loading spinner) - Partially done
  //3 - Responsive design - Not done
  //4 - Search functionality - Not done
  //5 - Required Logins for certain actions/pages (write, like, favorite, mystories) - Not done
  //6 - Pagination or infinite scroll for story lists(maybe) - Not done
  //7 - Refactor Book/WriteBook to be Story/WriteStory for consistency - Not Done
  //8 - Add toast notifications for user feedback writing/deleting/commenting/liking- Not done
  //9 - Animations and transitions - Not done
  //10 - Night reader mode(Maybe) - Not done
  //11 - Finish home page - Partially done
  //12 - Clean console logs and comments - Not done
  //13 - About page - Not done
  //14 - Refactor homepage stories pulling so we only pull the amount we need and not the entire collection - Not done
  //15 - Refactor MyStories to be a part of the account page - Not done
  //16 - Maybe look into replacing none loaded images with a loading spinner instead of a temp image. This may be tricky as im using the images as a backgroundImage url. - Not done
  //16 - Implement delete account functionality - Not done
  //17 - Deployment - Not done

  return (
    <AuthContextProvider>
      <StyledApp>
        <GlobalStyles />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="about" element={<About />} />
            <Route path="account/:id" element={<Account />}>
              <Route path="account/:id/favorites" element={<Favorites />} />
            </Route>
            <Route path="write" element={<WriteBook />} />
            <Route path="edit/:id" element={<EditStory />} />
            <Route path="library" element={<Library />} />
            <Route path="mystories" element={<MyStories />} />
            <Route path="library/:genre" element={<StoryList />} />
            <Route path="library/:genre/book/:id" element={<Book />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </StyledApp>
    </AuthContextProvider>
  );
}

export default App;
