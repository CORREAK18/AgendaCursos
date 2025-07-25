import React, { useState, useEffect } from "react";
import "../componenetes/css/header.css";



const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header" >
      <img className="logo"  alt="."/>
      <h1>EDUCA PRO</h1>
      <div className="clock" >{time.toLocaleTimeString()}</div>
    </header>
  );
};



export default Header;