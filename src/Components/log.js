import React, { useState } from "react";

const LogInput = () => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    console.log("Current Input Value:", value); // Logs the value to the console
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Log Input Field</h2>
      
    </div>
  );
};

export default LogInput;
