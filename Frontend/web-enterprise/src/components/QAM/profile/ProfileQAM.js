import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
// import { io } from 'socket.io-client'

import style from "./ProfileQAM.module.css";
import HeaderQA from "../header/HeaderQA";
import SidebarQA from "../sidebar/SidebarQA";
import { apiUrl, PROFILE_INFORMATION } from "../../../constants/constants";

function ProfileQAM() {
  const profile_information = JSON.parse(
    localStorage.getItem(PROFILE_INFORMATION)
  );
  const userId = profile_information._id;
  const convertedDoB = new Date(profile_information.DoB);
  profile_information.DoB = convertedDoB.toISOString().substr(0, 10);
  const [profileIdeas, setProfileIdeas] = useState([]);
  global.profileide = profileIdeas;


  const [updateProfileForm, setUpdateProfileForm] = useState({
    Name: profile_information.Name,
    Gender: profile_information.Gender,
    PhoneNumber: profile_information.PhoneNumber,
    DoB: profile_information.DoB,
    Email: profile_information.Email,
    Department: profile_information.Department,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/idea/personalpage/${profile_information._id}`
        );
        if (response.data.success) {
          console.log(response.data.ideas);
          setProfileIdeas(response.data.ideas);
        }
      } catch (error) {
        console.log(error.response.data);
      }
    })();
    
  },);

  const onChangeUpdateProfileForm = (event) =>
    setUpdateProfileForm({
      ...updateProfileForm,
      [event.target.name]: event.target.value,
    });
 
    const handleFileChange = (event) => setSelectedFile(event.target.files[0]);
  const { Name, Gender, PhoneNumber, DoB, Email, Department } =
    updateProfileForm;
  const updateProfile = () => {
    const formData = new FormData();
    formData.append("Name", Name);
    formData.append("Gender", Gender);
    formData.append("PhoneNumber", PhoneNumber);
    formData.append("DoB", DoB);
    formData.append("Email", Email);
    formData.append("Department", Department);
    formData.append("Avatar", selectedFile);
    console.log(formData);
    setShowUpdateProfileModal(false);
    (async () => {
      try {
        const response = await axios.put(
          `${apiUrl}/user/updateProfile/${profile_information._id}`,
          formData
        );
        if (response.data.success) {
          console.log(response.data.updatedProfile);
          localStorage.setItem(
            PROFILE_INFORMATION,
            JSON.stringify(response.data.updatedProfile)
          );
        }
      } catch (error) {
        console.log(error.response.data);
      }
    })();
  };



  return (
    <div className={style.profileQam}>
      <SidebarQA />
      <div div className={style.proContainer}>
        <HeaderQA />
         <div className={style.proTop}>
          <img
            className={style.imgTop}
            src="https://th.bing.com/th/id/R.6af6fd9c37f0de4abb34ea0fd20acce3?rik=55mqMmrTutVR0Q&pid=ImgRaw&r=0"
          />
        </div>
        <div className={style.proBody}>
          <div className={style.bodyTop}>
            <div className={style.QamAvt}>
              <img
                // src="https://i.pinimg.com/originals/64/10/3e/64103eedb6c46cfa16439b4f286568aa.jpg"
                src={`https://server-enterprise.onrender.com/${profile_information.Avatar}`}
                alt="avatar"
                className={style.QamImg}
              />
            </div>
            <div className={style.QamName}>{updateProfileForm.Name} </div>
          </div>
          <div className={style.inforBoby}>
            <div className={style.inforQam}>
              <div className={style.flatformSetting}>
                <label className={style.fTilte}>Platform Settings</label>
                <label className={style.account}>ACOUNT</label>
              </div>
            </div>

            <div className={style.inforQam}>
              <div className={style.flatformSetting}>
                <label className={style.fTilte}>Profile Information</label>
                <i
                  className="fas fa-user-edit" title="Edit Profile"
                  onClick={() => setShowUpdateProfileModal(true)}
                ></i>

                <Modal
                  className={style.EditProfile}
                  isOpen={showUpdateProfileModal}
                  onRequestClose={() => setShowUpdateProfileModal(false)}
                >
                  <form onSubmit={updateProfile}>
                    <div className={style.modalEditProfile}>
                        {/* ?trai */}
                      <div className={style.avatarEditProfile}>
                        <div className={style.avtEdit}>
                          <img
                            // src="https://i.pinimg.com/originals/64/10/3e/64103eedb6c46cfa16439b4f286568aa.jpg" 
                            src={`https://server-enterprise.onrender.com/${profile_information.Avatar}`}
                            width="290" height="290"
                            alt="avatar"
                            className={style.imgEditProfile}
                          />
                        </div>
                        <div className={style.changeAvt}>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            required
                          />
                        </div>
                      </div>
                      {/* phai */}
                      <div className={style.modalEdit}>
                        <div className={style.modalName}>
                          <label className={style.editName}>Name: </label>
                          <input
                            type="text"
                            name="Name"
                            value={updateProfileForm.Name}
                            className={style.inputModalProfile}
                            onChange={onChangeUpdateProfileForm}
                          />
                        </div>

                        <div className={style.formEdit}>
                          <label>Gender: </label>
                          <select
                            value={updateProfileForm.Gender}
                            name="Gender"
                            className={style.inputModalProfileGender}
                            onChange={onChangeUpdateProfileForm}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                        <div className={style.formEdit}>
                          <label>Phone Number: </label>
                          <input
                            type="text"
                            name="PhoneNumber"
                            value={updateProfileForm.PhoneNumber}
                            className={style.inputModalProfile}
                            onChange={onChangeUpdateProfileForm}
                          />
                        </div>
                        <div className={style.formEdit}>
                          <label>Date of Birth: </label>
                          <input
                            type="date"
                            name="DoB"
                            value={updateProfileForm.DoB}
                            className={style.inputModalProfile}
                            onChange={onChangeUpdateProfileForm}
                          />
                        </div>
                        <div className={style.formEdit}>
                          <label>Email: </label>
                          <input
                            type="text"
                            name="Email"
                            value={updateProfileForm.Email}
                            className={style.inputModalProfile}
                            onChange={onChangeUpdateProfileForm}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={style.btnSubmitCancel}>
                      <div className={style.btnSubmit}>
                        <button type="submit" className="btn btn-success">
                          Submit
                        </button>
                      </div>
                      <div className={style.btnCancel}>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => setShowUpdateProfileModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </Modal>
                <div className={style.QamName}>
                  <h1 className={style.infor}>
                    Hi, I'm {updateProfileForm.Name}. As the person who
                    supervises, manages and ensures the quality of products
                    created and sets quality standards for each product as well
                    as establishes assessment and testing methods.
                  </h1>
                </div>
                <label className={style.NameAcc}>
                  {" "}
                  <b>Name: </b> {updateProfileForm.Name}{" "}
                </label>
                <label className={style.informationQAM}>
                  {" "}
                  <b>Gender: </b> {updateProfileForm.Gender}{" "}
                </label>
                <label className={style.informationQAM}>
                  {" "}
                  <b>Phone Number: </b> {updateProfileForm.PhoneNumber}{" "}
                </label>
                <label className={style.informationQAM}>
                  {" "}
                  <b>Date of Birth:</b> {updateProfileForm.DoB}{" "}
                </label>
                <label className={style.informationQAM}>
                  {" "}
                  <b>Email: </b> {updateProfileForm.Email}{" "}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileQAM;
