import styled, { keyframes } from "styled-components";

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* width: 100%; */
  height: ${(props) => props.$height};
`;

const StyledSpinner = styled.div`
  display: flex;
  width: 4.8rem;
  height: 4.8rem;
  border: 5px solid #1c1f2e;
  border-radius: 50%;
  box-sizing: border-box;
  position: relative;
  animation: pulse 1s linear infinite;

  &:after {
    content: "";
    position: absolute;
    width: 4.8rem;
    height: 4.8rem;
    border: 5px solid #1c1f2e;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    animation: scaleUp 1s linear infinite;
  }

  @keyframes scaleUp {
    0% {
      transform: translate(-50%, -50%) scale(0);
    }
    60%,
    100% {
      transform: translate(-50%, -50%) scale(1);
    }
  }
  @keyframes pulse {
    0%,
    60%,
    100% {
      transform: scale(1);
    }
    80% {
      transform: scale(1.2);
    }
  }
`;

function Spinner({ $height }) {
  return (
    <StyledWrapper $height={$height}>
      <StyledSpinner />
    </StyledWrapper>
  );
}

export default Spinner;
