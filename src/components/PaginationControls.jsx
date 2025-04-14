const PaginationControls = ({ currentPage, totalPages, onPrevPage, onNextPage, isLoading }) => {
  return (
    <div className="pagination-controls">
      <button onClick={onPrevPage} disabled={currentPage === 1 || isLoading}>
        Previous
      </button>
      <span style={{ margin: "0 10px" }}>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={onNextPage} disabled={currentPage === totalPages || isLoading}>
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
