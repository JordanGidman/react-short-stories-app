import { useState } from "react";
import styled from "styled-components";

const StyledSorting = styled.div`
  display: flex;
  /* padding: 2rem 0rem; */
  align-items: center;
  justify-content: space-between;
  width: 100%;

  /* 600px */
  @media (max-width: 37.5em) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const StyledSearch = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin-right: 2rem;

  .icon {
    font-size: 2.4rem;
    color: #1c1f2e;
    /* 800px */
    @media (max-width: 50em) {
      display: none;
    }
  }
`;

const StyledSearchBar = styled.input`
  font-size: 1.6rem;
  border-radius: 1.6rem;
  /* width: 50%; */
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-bottom: 1px solid rgb(0, 0, 0, 0.2);
  /* text-transform: capitalize; */
  color: #1c1f2e;

  &:placeholder-shown {
    font-style: italic;
  }

  /* 800px */
  @media (max-width: 50em) {
    font-size: 1.4rem;
    text-align: center;
  }
`;

const StyledSelect = styled.select`
  font-size: 1.6rem;
  border-radius: 1.6rem;
  width: 20rem;
  padding: 1rem 2rem;
  border: none;
  border-bottom: 1px solid rgb(0, 0, 0, 0.2);
  text-transform: capitalize;
  font-style: italic;
  color: #1c1f2e;

  &[data-chosen-placeholder] {
    color: rgb(0, 0, 0, 0.5);
  }

  /* 800px */
  @media (max-width: 50em) {
    font-size: 1.4rem;
    width: auto;
  }
`;

const StyledOption = styled.option`
  color: #1c1f2e;
`;

function Search({ sortBy, setSortBy, search, setSearch }) {
  // const [search, setSearch] = useState("");
  const [loading, setLoading] = useState("");

  return (
    <StyledSorting>
      <StyledSearch>
        <ion-icon name="search-outline" className="icon"></ion-icon>
        <StyledSearchBar
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Type a title or author here... "
        />
      </StyledSearch>
      <StyledSelect
        onChange={(e) => setSortBy(e.target.value)}
        name="sortby"
        disabled={loading}
        value={sortBy}
      >
        <StyledOption disabled hidden name="placeholder" value="placeholder">
          Sort By
        </StyledOption>
        <StyledOption value="oldest">Oldest</StyledOption>
        <StyledOption value="newest">Newest</StyledOption>
        <StyledOption value="mostlikes">Most likes</StyledOption>
      </StyledSelect>
    </StyledSorting>
  );
}

export default Search;
