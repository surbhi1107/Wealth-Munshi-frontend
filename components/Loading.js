import React from "react";

const Loading = ({ isWhiteSpinner = false }) => {
  return isWhiteSpinner ? (
    <div className="white-spinner"></div>
  ) : (
    <div className="spinner"></div>
  );
};

export default Loading;
