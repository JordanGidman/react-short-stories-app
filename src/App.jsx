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

const StyledApp = styled.div``;

function App() {
  //Need a check for a current user before allowing them to navigate to any page that requires one e.g write/account

  //i wanted to allow images to be used both for the book "cover" and within the post itself however firebase has paywalled its image uploading unfortunately. I will look into alternate db options for the next project.

  //For now im going to use this as a list of features i want to add -
  //1 - User authentication (signup/signin/signout) - Done
  //2 - User profile page (view/edit profile info, view user's stories) - Done
  //3 - Create a story (title, genre, synopsis, cover image, story text) - Done
  //4 - View a list of stories (filter by genre) - Done
  //5 - View a single story (title, author, genre, synopsis, cover image, story text) - Done
  //6 - Edit a story (title, genre, synopsis, cover image, story text) - Not done
  //7 - Delete a story (Need to make sure logged in user can only delete their own stories) - Not done
  //8 - Responsive design - Not done
  //9 - Error handling and loading states (Need to use loading spinner) - Partially done
  //10 - Form validation - Partially done
  //11 - Search functionality - Not done
  //12 - User comments on stories - Not done
  //13 - Like/favorite stories - Not done
  //14 - Story ratings/reviews - Not done
  //15 - Pagination or infinite scroll for story lists - Not done
  //16 - Required Logins for certain actions/pages - Not done
  //17 - My stories page to view/edit/delete user's own stories - Partially done
  //18 - Ability to share publicly or hide and keep private - Not done
  //19 - Deployment - Not done

  return (
    <AuthContextProvider>
      <StyledApp>
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="about" element={<About />} />
            <Route path="account" element={<Account />} />
            <Route path="write" element={<WriteBook />} />
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
