import { useState, useEffect } from "react";
import styled from "styled-components";

const StyledForm = styled.form`
  display: grid;
  gap: 12px;

  #search {
    flex: 1;
    min-width: 260px;
  }
`;
const StyledRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;
const StyledRow2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: end;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;
const StyledField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StyledLabel = styled.label`
  color: var(--muted);
  font-weight: 700;
`;


function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500)
    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);
  function preventRefresh(e) {
    e.preventDefault();
  }
  return (
    <StyledForm onSubmit={preventRefresh}>
      <StyledRow>
        <StyledLabel htmlFor="search">Search todos:</StyledLabel>
        <input
          className="input"
          id="search"
          type="text"
          value={localQueryString}
          onChange={(e) => {
            setLocalQueryString(e.target.value);
          }}
        ></input>
        <button
          className="btn btnDanger"
          type="button"
          onClick={() => setLocalQueryString('')}
        >
          Clear
        </button>
      </StyledRow>
      <StyledRow2>
        <StyledField>
          <StyledLabel htmlFor="sotr-by">Sort by</StyledLabel>
          <select
            className="select"
            id="sotr-by"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="title">{'Title'}</option>
            <option value="createdTime">{'Time added'}</option>
          </select>
        </StyledField>
        <StyledField>
          <StyledLabel htmlFor="direction">Direction</StyledLabel>
          <select
            className="select"
            id="direction"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="asc">{'Ascending'}</option>
            <option value="desc">{'Descending'}</option>
          </select>
        </StyledField>
      </StyledRow2>
    </StyledForm>
  );
}

export default TodosViewForm
