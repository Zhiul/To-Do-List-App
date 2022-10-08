import React, { useState } from "react";

const App = () => {
  return (
    <div className="duedate-tooltip">
      <span className="date"></span>
      <span className="when-is-date"></span>
      <hr className="duedate-tooltip-separator" />
      <span className="date-timezone"></span>
      <span className="tasks-due-number"></span>
    </div>
  );
};

export default App;
