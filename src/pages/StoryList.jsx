import { Link, useParams } from "react-router-dom";

function StoryList() {
  const genre = useParams();

  //Here we run into a problem, the db has only the test stories i have added. Meaning theres nothing to pull, i have 2 options here i can either fill the db manually or programatically with random stories
  //Or i can use an api, however the only free one i have found returns a random short story that has no genre, so i would have to assign them randomly just to have some sample data.

  return (
    <div>
      {genre.genre}
      <Link to="/library">Back to genres</Link>
    </div>
  );
}

export default StoryList;
