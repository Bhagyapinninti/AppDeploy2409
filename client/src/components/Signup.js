import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
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

    let signupUsingJSON= async()=>{
        let dataToSendJSO={
            firstName: firstNameInputRef.current.value,
            lastName: lastNameInputRef.current.value,
            gender: genderInputRef.current.value,
            age: ageInputRef.current.value,
            email: emailInputRef.current.value,
            password: passwordInputRef.current.value,
            mobileNo: mobileNoInputRef.current.value,
        };
        let dataToSendJSON= JSON.stringify(dataToSendJSO);
        console.log(dataToSendJSO);
        console.log(dataToSendJSON);

        let myHeaders= new Headers();
        myHeaders.append("content-type","application/json");

        let reqOptions={
            method:"POST",
            body:dataToSendJSON,
            headers: myHeaders,
        };
        let JSONData= await fetch("http://localhost:1467/signup", reqOptions);
        let JSOData=await JSONData.json();

        console.log(JSOData);
        if(JSOData?.msg == "User created"){
            navigate("/");
        }
    }

    let signupUsingURLE=async()=>{
        let dataToSendURLE = new URLSearchParams();
        dataToSendURLE.append("firstName", firstNameInputRef.current.value);
        dataToSendURLE.append("lastName", lastNameInputRef.current.value);
        dataToSendURLE.append("gender", genderInputRef.current.value);
        dataToSendURLE.append("age", ageInputRef.current.value);
        dataToSendURLE.append("email", emailInputRef.current.value);
        dataToSendURLE.append("password",passwordInputRef.current.value);
        dataToSendURLE.append("mobileNo", mobileNoInputRef.current.value);

        let myHeaders =new Headers();
        myHeaders.append("content-type", "application/x-www-form-urlencoded")

        let reqOptions ={
            method:"POST",
            body:dataToSendURLE,
            headers:myHeaders
        };

        let JSONData= await fetch("http://localhost:1467/signup", reqOptions);
        let JSOData=await JSONData.json();
        console.log(JSOData);

        console.log(JSOData);
        if(JSOData?.msg == "User created"){
            navigate("/");
        }
    };

    let signupUsingFormData=async()=>{
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
            method:"POST",
            body:dataToSend,
        };

        let JSONData= await fetch("http://localhost:1467/signup", reqOptions);
        let JSOData=await JSONData.json();
        console.log(JSOData);

        console.log(JSOData);
        if(JSOData?.msg == "User created"){
            navigate("/");
        }
    };

    return (
        <div className='App'>
            <form>
                <h2>Signup</h2>
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
                    <input ref={emailInputRef}></input>
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

               {/* <div>
                    <button type='button' onClick={()=>{
                        signupUsingJSON();
                    }}>Signup(JSON)</button>
                </div>
                <div>
                    <button type='button' onClick={()=>{
                        signupUsingURLE();
                    }}>Signup(URLE)</button>
                </div>*/}
                <div>
                    <button type='button' onClick={()=>{
                        signupUsingFormData();
                    }}>Signup{/*(formData)*/}</button>    
                    <br></br>
                   Already have an account? <Link to="/">Login</Link>  
                </div>
            </form>
        </div>
    )
}

export default Signup
