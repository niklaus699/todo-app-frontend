import React, { useEffect, useState } from 'react'

const useWindowWidth = () => {
  const isClient = typeof window !== "undefined";
  const [width, setWidth] = useState(isClient ? window.innerWidth : 0);

  useEffect(() => {
    if (!isClient) {return};
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);

    return () => {window.removeEventListener("resize", onResize);};
  },[isClient]);
  
  return width;
}

export default useWindowWidth;