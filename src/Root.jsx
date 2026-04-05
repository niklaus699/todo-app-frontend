import { React, useState, useEffect } from "react";
import Auth from "./Auth";
import App from './App';

const Root = () => {
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        // force logout
      }
    }, []);
  
  return (
    isAuth ? <App /> : <Auth onAuthSuccess={() => setIsAuth(true)} />
  )
}

export default Root;