//@ts-nocheck
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export const HeaderPortal = ({ children }) => {
  const [headerContainer, setHeaderContainer] = useState(null);

  useEffect(() => {
    const headerContainer = document.getElementById("header-container");
    setHeaderContainer(headerContainer);
  }, []);

  // const headerContainer = document.getElementById("header-container")

  if (!headerContainer) {
    return null;
  }

  return ReactDOM.createPortal(children, headerContainer);
};
