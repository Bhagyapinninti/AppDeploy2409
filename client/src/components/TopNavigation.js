import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
function TopNavigation() {

let navigate=useNavigate();

    let userDetails=useSelector((store)=>{
        console.log("TopNavigation");
        console.log(store);
        return store.userDetails;
    });

useEffect(()=>{
    if(userDetails && userDetails.email){

    }else{
navigate("/");
    }
},[])

const signout = ()=>{
  // localStorage.removeItem("token")
  navigate("/");
}

const handleSignout = () => {
  localStorage.removeItem("token");
  navigate("/");
};

  return (
    <div>
      <nav>
        <Link to="/dashboard">Dashborad</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/leaves">Leaves</Link>
        <Link to="/editProfile">EditProfile</Link>
        <Link to="/" onClick={handleSignout}>Signout</Link>
      </nav>
    </div>
  )
}

export default TopNavigation
