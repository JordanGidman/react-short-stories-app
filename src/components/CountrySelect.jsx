import styled from "styled-components";
import { getData } from "country-list";
import { useState } from "react";

const StyledCountrySelect = styled.select`
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.6rem;
  border: none;
  /* border-bottom: 1px solid rgb(0, 0, 0, 0.2); */
  box-shadow: 0rem 0.8rem 0.6rem -1rem rgba(0, 0, 0, 0.8);
  color: rgba(0, 0, 0, 0.5);
  border-radius: 1.6rem;
  font-family: "Montserrat", sans-serif;

  /* Quick fix for chevron styling */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: white;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath fill='rgba(0, 0, 0, 0.8)' d='M5 7l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.5rem center;
  background-size: 1.6rem;

  &::placeholder {
    color: rgb(0, 0, 0, 0.5);
    font-style: italic;
    text-transform: capitalize;
  }
`;

const StyledOption = styled.option`
  /* color: #1c1f2e; */
  color: #1c1f2e;
`;

function CountrySelect({ country, setCountry }) {
  //Get country codes and names from country-list package
  const countryData = getData();
  console.log(countryData);

  return (
    <>
      <StyledCountrySelect
        className="country-select"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      >
        <StyledOption name="placeholder" value="" disabled hidden>
          * Select Country
        </StyledOption>
        {countryData.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </StyledCountrySelect>
    </>
  );
}

export default CountrySelect;
