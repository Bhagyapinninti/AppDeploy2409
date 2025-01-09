import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import { useSelector } from 'react-redux';



function EditProfile() {
    let navigate=useNavigate();

    let firstNameInputRef= useRef();
    let lastNameInputRef=useRef();
    let genderInputRef=useRef();
    let ageInputRef=useRef();
    let emailInputRef=useRef();
    let passwordInputRef=useRef();
    let mobileNoInputRef=useRef();
    let profilePicInputRef=useRef();

    let [profilePic, setProfilePic] =useState("./images/profilepic.jpg.webp");

    let userDetails= useSelector((store)=>{
     return store.userDetails;
    });

    useEffect(()=>{
    firstNameInputRef.current.value=userDetails.firstName;
    lastNameInputRef.current.value=userDetails.lastName;
    genderInputRef.current.value=userDetails.gender;
    ageInputRef.current.value=userDetails.age;
    emailInputRef.current.value=userDetails.email;
    mobileNoInputRef.current.value=userDetails.mobileNo;
    setProfilePic(`http://localhost:1467/uploads/${userDetails.profilePic}`);
    },[])

    let onUpdateProfile=async()=>{
        let dataToSend = new FormData();
        dataToSend.append("firstName", firstNameInputRef.current.value);
        dataToSend.append("lastName", lastNameInputRef.current.value);
        dataToSend.append("gender", genderInputRef.current.value);
        dataToSend.append("age", ageInputRef.current.value);
        dataToSend.append("email", emailInputRef.current.value);
        dataToSend.append("password",passwordInputRef.current.value);
        dataToSend.append("mobileNo", mobileNoInputRef.current.value);
        
      
        for (let i = 0; i < profilePicInputRef.current.files.length; i++) {
            dataToSend.append("profilePic", profilePicInputRef.current.files[i]);
        }
        let reqOptions ={
            method:"PATCH",
            body:dataToSend,
        };

        let JSONData= await fetch("http://localhost:1467/updateProfile", reqOptions);
        let JSOData= await JSONData.json();
        alert(JSOData.msg);

        console.log(JSOData);
        if(JSOData?.msg == "User created"){
            navigate("/");
        }
    };

    return (
        <div className='App'>
          <TopNavigation/>
            <form>
                <h2>Edit Profile</h2>
                <div>
                    <label>First Name</label>
                    <input ref={firstNameInputRef}></input>
                </div>
                <div>
                    <label>Last Name</label>
                    <input ref={lastNameInputRef}></input>
                </div>
                <div>
                    <label>Gender</label>
                    <input ref={genderInputRef}></input>
                </div>
                <div>
                    <label>Age</label>
                    <input type='number' ref={ageInputRef}></input>
                </div>
                <div>
                    <label>Email</label>
                    <input ref={emailInputRef} readOnly></input>
                </div>
                <div>
                    <label>Password</label>
                    <input ref={passwordInputRef}></input>
                </div>
                <div>
                    <label>Mobile No.</label>
                    <input ref={mobileNoInputRef}></input>
                </div>
                <div>
                    <label>Profile Pic</label>
                    <input ref={profilePicInputRef} type='file' 
                        onChange={(event)=>{
                            let selectedPicPath= URL.createObjectURL(event.target.files[0]);
                            setProfilePic(selectedPicPath);
                        }}
                    ></input>
                </div>

                <div>
                    <img className='profilePicPreview'src={profilePic}></img>
                </div>

                <div>
                    <button type='button' onClick={()=>{
                        onUpdateProfile();
                    }}>Update Profile</button>    
                    
                </div>
            </form>
        </div>
    )
}

export default EditProfile

