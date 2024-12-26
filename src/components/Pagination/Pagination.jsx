import React, { useState, useEffect } from "react";
import "./Pagination.css";
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [inputPage, setInputPage] = useState(currentPage);

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value >= 1 && value <= totalPages) {
      setInputPage(value);
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    handleClick(inputPage);
  };

  const pageNumbers = [];
  const maxVisiblePages = 4; // Max number of page numbers to display
  const ellipsis = "...";

  if (totalPages <= maxVisiblePages) {
    // Show all pages if total pages are less than the limit
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Show first few, last few, and the current page with ellipsis
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push(ellipsis);
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) pageNumbers.push(ellipsis);
    pageNumbers.push(totalPages);
  }

  // UseEffect to prevent page from scrolling to the top when navigating pages
  useEffect(() => {
    window.scrollTo(0, 0); // Optionally, you can change this to another position if you want to keep the scroll position
  }, [currentPage]);

  return (
    <div className="pagination">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}>
        Previous
      </button>

      {pageNumbers.map((number, index) =>
        number === ellipsis ? (
          <span key={index} className="ellipsis">
            ...
          </span>
        ) : (
          <button
            key={number}
            onClick={() => handleClick(number)}
            className={currentPage === number ? "active" : ""}>
            {number}
          </button>
        )
      )}

      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}>
        Next
      </button>

      {/* Input for direct page number */}
      <form onSubmit={handleInputSubmit} className="page-input-form">
        <input
          type="number"
          value={inputPage}
          onChange={handleInputChange}
          min="1"
          max={totalPages}
        />
        <button type="submit">Go</button>
      </form>
    </div>
  );
};

export default Pagination;
