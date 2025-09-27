import styled from "styled-components";

const StyledCard = styled.li`
  display: flex;
  flex-direction: column;

  background-color: #f4f4f4;
  padding: 1.2rem;
`;

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  /* margin-bottom: 1rem; */
`;

const StyledAuthor = styled.div`
  font-weight: 700;
  font-size: 1.6rem;
`;

const StyledDate = styled.div`
  font-size: 1.6rem;
`;

const StyledComment = styled.div`
  font-style: italic;
  font-size: 1.4rem;
`;

function CommentCard({ comment }) {
  console.log(comment);

  return (
    <StyledCard>
      <StyledWrapper>
        <StyledAuthor>{comment?.author}</StyledAuthor>
        <StyledDate>
          {new Date(comment.createdAt?.seconds * 1000).toLocaleDateString(
            "en-US"
          )}
        </StyledDate>
      </StyledWrapper>
      <StyledComment dangerouslySetInnerHTML={{ __html: comment.comment }} />
    </StyledCard>
  );
}

export default CommentCard;
