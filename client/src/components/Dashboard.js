import React from 'react'
import { useSelector } from 'react-redux'
import TopNavigation from './TopNavigation';
function Dashboard() {
    let userDetails =useSelector((store)=>{
return store.userDetails;
    });


    let deleteProfile=async()=>{
        let dataToSend = new FormData();
        dataToSend.append("email",userDetails.email);
        let reqOptions ={
            method:"DELETE",
            body:dataToSend,
        };

        let JSONData= await fetch("http://localhost:1467/deleteProfile", reqOptions);
        let JSOData= await JSONData.json();
        alert(JSOData.msg);
    }
  return (
    <div>
        <TopNavigation></TopNavigation>
      <h2>Dashboard</h2>
      <button onClick={()=>{
        deleteProfile();
      }}>Delete Profile</button>
      <h3>
        {userDetails.firstName}
        {userDetails.lastName}
      </h3>
      <img src={`http://localhost:1467/uploads/${userDetails.profilePic}`}></img>
    </div>
  )
}

export default Dashboard
