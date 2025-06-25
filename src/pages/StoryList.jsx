import { Link, useParams } from "react-router-dom";

function StoryList() {
  const genre = useParams();

  return (
    <div>
      {genre.genre}
      <Link to="/library">Back to genres</Link>
    </div>
  );
}

export default StoryList;
