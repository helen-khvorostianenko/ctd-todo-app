function TodosViewForm({
  sortDirection,
  setSortDirection,
  sortField,
  setSortField,
  queryString,
  setQueryString,
}) {
  function preventRefresh(e) {
    e.preventDefault();
  }
  return (
    <form onSubmit={preventRefresh}>
      <div>
        <label htmlFor="search">Search todos:</label>
        <input
          id="search"
          type="text"
          value={queryString}
          onChange={(e) => {
            setQueryString(e.target.value);
          }}
        ></input>
        <button 
          type="button" 
          onClick={() => setQueryString('')}>
          Clear
        </button>
      </div>
      <div>
        <label htmlFor="sotr-by">Sort by</label>
        <select
          id="sotr-by"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">{'Title'}</option>
          <option value="createdTime">{'Time added'}</option>
        </select>
        <label htmlFor="direction">Direction</label>
        <select
          id="direction"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">{'Ascending'}</option>
          <option value="desc">{'Descending'}</option>
        </select>
      </div>
    </form>
  );
}

export default TodosViewForm
