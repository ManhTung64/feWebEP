//import từ thư viện bên ngoài
import React, { useState, useEffect } from "react"
import Modal from "react-modal"
import axios from "axios"
import { io } from 'socket.io-client'

//import từ bên trong src
import Header from '../header/Header'
import Sidebar from "../sidebar/Sidebar"
import style from './Profile.module.css'
import { apiUrl, PROFILE_INFORMATION } from "../../../constants/constants"

Modal.setAppElement("#root")
const socket = io('https://server-enterprise.onrender.com', { transports: ['websocket'] })

function Profile() {
    const profile_information = JSON.parse(localStorage.getItem(PROFILE_INFORMATION))
    const userId = profile_information._id
    const convertedDoB = new Date(profile_information.DoB)
    profile_information.DoB = convertedDoB.toISOString().substr(0, 10)
    const [profileIdeas, setProfileIdeas] = useState([])
    global.profileide = profileIdeas
    const [categories, setCategories] = useState([])
    const [showActionsModal, setShowActionsModal] = useState(false) // trạng thái của modal hiển thị các hành động (update, delete, download CSV)
    const [showAddModal, setShowAddModal] = useState(false) // trạng thái của modal hiển thị form add
    const [showUpdateModal, setShowUpdateModal] = useState(false) // trạng thái của modal hiển thị form update
    const [showCommentModal, setShowCommentModal] = useState(false) // trạng thái của modal hiển thị form comment
    const [showDeleteModal, setShowDeleteModal] = useState(false) // trạng thái của modal hiển thị delete confirm
    const [createIdeaForm, setCreateIdeaForm] = useState({ // trạng thái form tạo idea
        Title: '',
        Description: '',
        UserId: userId,
        CategoryId: null
    })
    const [updateIdeaForm, setUpdateIdeaForm] = useState({ // trạng thái form cập nhật idea
        updating_id: '',
        updatingTitle: '',
        updatingDescription: ''
    })
    const [deleteIdeaId, setDeleteIdeaId] = useState('') // trạng thái lưu trữ giá trị id của idea sẽ bị xóa
    const [updateProfileForm, setUpdateProfileForm] = useState({
        Name: profile_information.Name,
        Gender: profile_information.Gender,
        PhoneNumber: profile_information.PhoneNumber,
        DoB: profile_information.DoB,
        Email: profile_information.Email,
        Department: profile_information.Department,
    })
    const [selectedFile, setSelectedFile] = useState(null)
    const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    const [selectedOption, setSelectedOption] = useState('')
    const [likeState, setLikeState] = useState([]);
    const [dislikeState, setDislikeState] = useState([]);
    const [viewState, setViewState] = useState([]);
    const [thumbsIdeaId, setThumbsIdeaId] = useState(null);
    const handleOptionChange = (event) => setSelectedOption(event.target.value)

    const handleCheckboxChange = (event) => setIsChecked(event.target.checked)

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`${apiUrl}/idea/personalpage/${profile_information._id}`)
                if (response.data.success) {
                    console.log(response.data.ideas)
                    setProfileIdeas(response.data.ideas)
                    setCategories(response.data.categories)
                }
            } catch (error) {
                console.log(error.response.data)
            }
        })()
        socket.on('like', (likedata, thumbsIdeaId) => {
            setLikeState(likedata)
            setThumbsIdeaId(thumbsIdeaId)
            global.ide.map(idea => {
                if (idea._id == thumbsIdeaId) {
                    idea.totaldislike = dislikeState.length
                    idea.totallike = likeState.length
                    // idea.totalview = viewState.length
                }
            })
            setProfileIdeas(global.ide)
        })
        socket.on('dislike', (dislikedata, thumbsIdeaId) => {
            setDislikeState(dislikedata)
            setThumbsIdeaId(thumbsIdeaId)
            global.ide.map(idea => {
                if (idea._id == thumbsIdeaId) {
                    idea.totaldislike = dislikeState.length
                    idea.totallike = likeState.length
                    // idea.totalview = viewState.length
                }
            })
            setProfileIdeas(global.ide)
        })
        socket.on('view', (viewdata, thumbsIdeaId) => {
            setViewState(viewdata)
            setThumbsIdeaId(thumbsIdeaId)
            global.ide.map(idea => {
                if (idea._id == thumbsIdeaId) {
                    idea.totalview = viewState.length
                    idea.totaldislike = dislikeState.length
                    idea.totallike = likeState.length

                }
            })
            setProfileIdeas(global.ide)
        })
        return () => {
            socket.off('like')
            socket.off('dislike')
            socket.off('view')
        }
    }, [thumbsIdeaId])

    const onChangeUpdateProfileForm = event => setUpdateProfileForm({ ...updateProfileForm, [event.target.name]: event.target.value })
    const onChangeCreateIdeaForm = event => setCreateIdeaForm({ ...createIdeaForm, [event.target.name]: event.target.value })
    const onChangeUpdateIdeaForm = event => setUpdateIdeaForm({ ...updateIdeaForm, [event.target.name]: event.target.value })
    const handleFileChange = event => setSelectedFile(event.target.files[0])
    const { Name, Gender, PhoneNumber, DoB, Email, Department } = updateProfileForm
    const updateProfile = () => {
        const formData = new FormData()
        formData.append('Name', Name)
        formData.append('Gender', Gender)
        formData.append('PhoneNumber', PhoneNumber)
        formData.append('DoB', DoB)
        formData.append('Email', Email)
        formData.append('Department', Department)
        formData.append('Avatar', selectedFile)
        console.log(formData)
        setShowUpdateProfileModal(false);
        (async () => {
            try {
                const response = await axios.put(`${apiUrl}/user/updateProfile/${profile_information._id}`, formData)
                if (response.data.success) {
                    console.log(response.data.updatedProfile)
                    localStorage.setItem(PROFILE_INFORMATION, JSON.stringify(response.data.updatedProfile))
                }
            } catch (error) {
                console.log(error.response.data)
            }
        })()
    }

    const createIdea = () => {
        setShowAddModal(false);
        (async () => {
            try {
                const response = await axios.post(`${apiUrl}/idea/`, createIdeaForm)
                if (response.data.success) {
                    console.log(response.data.idea)
                    setCreateIdeaForm({
                        Title: '',
                        Description: '',
                        UserId: userId,
                        CategoryId: null
                    })
                    setProfileIdeas([...profileIdeas, response.data.idea])
                }
            } catch (error) {
                console.log(error.response.data)
            }
        }
        )()
    }

    const showActionsModalAndGetCurrentIdea = idea => {
        setShowActionsModal(true)
        setUpdateIdeaForm({
            updating_id: idea._id,
            updatingTitle: idea.Title,
            updatingDescription: idea.Description
        })
        setDeleteIdeaId(idea._id)
    }

    const updateIdea = () => {
        setShowUpdateModal(false)
        setShowActionsModal(false);
        (async () => {
            try {
                const response = await axios.put(`${apiUrl}/idea/${updateIdeaForm.updating_id}`, { Title: updateIdeaForm.updatingTitle, Description: updateIdeaForm.updatingDescription })
                if (response.data.success) {
                    console.log(response.data)
                    const newIdeas = profileIdeas.map(idea => {
                        if (idea._id === response.data.idea._id) {
                            idea.Title = response.data.idea.Title
                            idea.Description = response.data.idea.Description
                        }
                        return idea
                    })
                    setProfileIdeas(newIdeas)
                }
            } catch (error) {
                console.error(error.response.data)
            }
        })()
    }

    const deleteIdea = () => {
        setShowDeleteModal(false)
        setShowActionsModal(false);
        (async () => {
            try {
                const response = await axios.delete(`${apiUrl}/idea/deleteIdea/${deleteIdeaId}`)
                if (response.data.success) {
                    console.log(response.data)
                    const afterDeletedIdeas = profileIdeas.filter(idea => idea._id !== deleteIdeaId)
                    setProfileIdeas(afterDeletedIdeas)
                }
            } catch (error) {
                console.error(error.response.data)
            }
        })()
    }

    const handleLikeClick = async (userId, ideaId) => {
        const data = {
            userId,
            ideaId,
            state: 'like'
        }
        socket.emit('like', data)
    }

    const handleDisLikeClick = async (userId, ideaId) => {
        const data = {
            userId,
            ideaId,
            state: 'dislike'
        }
        socket.emit('dislike', data)
    }
    const handleView = async (userId, ideaId) => {
        const data = {
            userId,
            ideaId,
            state: 'view'
        }
        socket.emit('view', data)
    }
    return (
        <>
            <div>
                <Header />
                <div className={style.container}>
                    <Sidebar />
                    <div className={style.section}>
                        <ul>
                            <div className={style.avatarProfile}>
                                <img src={`https://server-enterprise.onrender.com/${profile_information.Avatar}`} alt="avatar" className={style.logoProfile} />
                                <li className={style.profileName}>
                                    <div className={style.nameInfo}>
                                        <div className={style.nameAndBtn}>
                                            <p className={style.nameProfile}>{updateProfileForm.Name}</p>
                                            <button className={style.btnEditProfile} onClick={() => setShowUpdateProfileModal(true)}>Edit Profile</button>
                                            <Modal className={style.EditProfile} isOpen={showUpdateProfileModal} onRequestClose={() => setShowUpdateProfileModal(false)}>
                                                <form onSubmit={updateProfile}>
                                                    <div className={style.modalEditProfile}>
                                                        <div className={style.avatarEditProfile}>
                                                            <li><img src={`https://server-enterprise.onrender.com/${profile_information.Avatar}`} alt="avatar" className={style.logoEditProfile} /></li>
                                                        </div>
                                                        <div className={style.modalEdit}>
                                                            <div className={style.modalName}>
                                                                <label>Name: </label>
                                                                <input type="text" name="Name" value={updateProfileForm.Name} className={style.inputModalProfile} onChange={onChangeUpdateProfileForm} />
                                                            </div>
                                                            <div className={style.modalGender}>
                                                                <label>Gender: </label>
                                                                <select value={updateProfileForm.Gender} name='Gender' className={style.inputModalProfileGender} onChange={onChangeUpdateProfileForm} >
                                                                    <option value="Male">Male</option>
                                                                    <option value="Female">Female</option>
                                                                </select>
                                                            </div>
                                                            <div className={style.modalName}>
                                                                <label>Phone Number: </label>
                                                                <input type="text" name="PhoneNumber" value={updateProfileForm.PhoneNumber} className={style.inputModalProfile} onChange={onChangeUpdateProfileForm} />
                                                            </div>
                                                            <div className={style.modalName}>
                                                                <label>Date of Birth: </label>
                                                                <input type="date" name="DoB" value={updateProfileForm.DoB} className={style.inputModalProfile} onChange={onChangeUpdateProfileForm} />
                                                            </div>
                                                            <div className={style.modalName}>
                                                                <label>Email: </label>
                                                                <input type="text" name="Email" value={updateProfileForm.Email} className={style.inputModalProfile} onChange={onChangeUpdateProfileForm} />
                                                            </div>
                                                            <div className={style.modalName}>
                                                                <label>Department: </label>
                                                                <select value={updateProfileForm.Department} name='Department' className={style.inputModalProfileDepartment} onChange={onChangeUpdateProfileForm} >
                                                                    <option value="HR">HR</option>
                                                                    <option value="Marketing">Marketing</option>
                                                                    <option value="Sale">Sale</option>
                                                                    <option value="IT">IT</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label>Avatar: </label>
                                                                <input type='file' onChange={handleFileChange} required />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={style.btnSubmitCancel}>
                                                        <div className={style.btnSubmit}>
                                                            <button type="submit" className="btn btn-success" >Submit</button>
                                                        </div>
                                                        <div className={style.btnCancel}>
                                                            <button type="button" className="btn btn-danger" onClick={() => setShowUpdateProfileModal(false)}>Cancel</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </Modal>
                                        </div>
                                        <div className={style.profileDescription}>
                                            <p className={style.posts}>{profileIdeas.length} Posts</p>
                                            <p className={style.friends}>{profileIdeas.reduce((acc, cur) => { return acc + cur.totalview; }, 0)}<i className="fas fa-eye"></i></p>
                                            <p className={style.friends}>{profileIdeas.reduce((acc, cur) => { return acc + cur.totallike; }, 0)}<i className="fa fa-thumbs-up"></i></p>
                                            <p className={style.friends}>{profileIdeas.reduce((acc, cur) => { return acc + cur.totaldislike; }, 0)}<i className="fa fa-thumbs-down"></i></p>
                                        </div>
                                    </div>
                                </li>
                            </div>
                            <div className={style.line}></div>
                            <li className={style.arialLabel}>
                                <img src={`https://server-enterprise.onrender.com/${profile_information.Avatar}`} alt="avatar" className={style.logoAvatar} />
                                <div className={style.inputContainer}>
                                    <input type="text" name="comment" className={style.inputText} placeholder="Input nội dung" onClick={() => setShowAddModal(true)} />
                                    <span className={style.cameraIcon}><i className="fas fa-camera"></i></span>
                                </div>
                            </li>
                            <div className={style.line}></div>
                            {
                                profileIdeas.map((idea, index) => {
                                    return (
                                        <li className={style.textInput} key={index}>
                                            <div className={style.avatarNameDate}>
                                                <img src={`https://server-enterprise.onrender.com/${profile_information.Avatar}`} alt="avatar" className={style.logoAvatar} />
                                                <div className={style.nameDateDot}>
                                                    <div className={style.nameDate}>
                                                        {idea.userPost.map((user, index) => {
                                                            return (<div key={index}>
                                                                <p>{user.Name}</p>
                                                            </div>)
                                                        })}
                                                        <div className={style.dateDisplay}>1 hour ago</div>
                                                    </div>
                                                    <div className={style.dot}><h1 type="button" onClick={() => showActionsModalAndGetCurrentIdea(idea)}>...</h1></div>
                                                    <Modal className={style.modalComment} isOpen={showActionsModal} onRequestClose={() => setShowActionsModal(false)}>
                                                        <button onClick={() => setShowUpdateModal(true)}>Update Idea</button>
                                                        <button onClick={() => setShowDeleteModal(true)}>Delete</button>
                                                        <button>Download .CSV</button>
                                                        <div className={style.modalDiv}>
                                                            <button onClick={() => setShowActionsModal(false)} className={style.closeComment}><i className="fa fa-close"></i></button>
                                                        </div>
                                                    </Modal>
                                                </div>
                                            </div>
                                            <div className={style.content}>{idea.Title}</div>
                                            <img className={style.imgBody} src={`https://server-enterprise.onrender.com/${profile_information.Avatar}`} />
                                            <div>{idea.Description}</div>
                                            <div className={style.line}></div>
                                            <div className={style.likeDislikeComment}>
                                                <div className={style.interactionButtons}>
                                                    {
                                                        thumbsIdeaId && thumbsIdeaId == idea._id ? <div><button className={style.like} onClick={() => handleLikeClick(userId, idea._id)}>{likeState.length}<i className="fa fa-thumbs-up"></i></button>
                                                            <button className={style.dislike} onClick={() => handleDisLikeClick(userId, idea._id)}>{dislikeState.length} <i className="fa fa-thumbs-down"></i></button></div>
                                                            : <div><button className={style.like} onClick={() => handleLikeClick(userId, idea._id)}>{idea.totallike} <i className="fa fa-thumbs-up"></i></button>
                                                                <button className={style.dislike} onClick={() => handleDisLikeClick(userId, idea._id)}>{idea.totaldislike} <i className="fa fa-thumbs-down"></i></button></div>
                                                    }
                                                    <button type="button" className={style.comment} onClick={() => { setShowCommentModal(true); handleView(userId, idea._id) }}><i className="fa fa-comment"></i></button>
                                                    {
                                                        thumbsIdeaId && thumbsIdeaId == idea._id ? <div><button disabled type="button" className={style.comment}>{viewState.length}<i className="fas fa-eye"></i></button> </div>
                                                            : <div><button type="button" disabled className={style.comment}>{idea.totalview}<i className="fas fa-eye"></i></button> </div>
                                                    }
                                                    <Modal className={style.modalComment} isOpen={showCommentModal} onRequestClose={() => setShowCommentModal(false)}>
                                                        <div className={style.modalDiv}>
                                                            <img src={`https://server-enterprise.onrender.com/${profile_information.Avatar}`} alt="avatar" className={style.logoAvatarComment} />
                                                            <input className={style.inputModalComment} type="text" name="comment" placeholder="Comment here" />
                                                            <button className={style.like}> <i className="fa fa-thumbs-up"></i></button>
                                                            <button className={style.dislike}> <i className="fa fa-thumbs-down"></i></button>
                                                            <button onClick={() => setShowCommentModal(false)} className={style.closeComment}><i className="fa fa-close"></i></button>
                                                        </div>
                                                    </Modal>
                                                </div>
                                                <div className={style.commentSection}>
                                                    <form className={style.homepageForm}>
                                                        <input className={style.inputComment} type="text" name="comment" placeholder="Comment here" />
                                                        <span className={style.cameraIconComment}><i className="fas fa-camera"></i></span>
                                                    </form>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>

            {
                showAddModal && (
                    <div className={style.modalCreateIdea}>
                        <div className={style.modalBodyCreateIdea}>
                            <div className={style.modalInnerCreateIdea}>
                                <div className={style.CreateIdeaHeader}>
                                    <h1 className={style.CreateIdea}>Create Idea </h1>
                                </div>
                            </div>
                            <div className={style.CreateIdeaContent}>
                                <div className={style.CreateIdeaAvt} >
                                    <img className={style.avtIdea} src="https://th.bing.com/th/id/OIP.4xZbB1ML4raovv9lcrnXTQHaEK?w=311&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7" />
                                </div>
                                <div className={style.CreateIdeaName}>Phương Anh</div>
                                <hr className={style.gach}></hr>
                            </div>
                            <form onSubmit={createIdea}>
                                <div className={style.CreateIdeaFooter}>
                                    <div className={style.footerLeft}>
                                        <div className={style.inputIdea}>
                                            <input type='text' name='Title' placeholder="Title" onChange={onChangeCreateIdeaForm} />
                                            <textarea rows={10} className={style.InputForm} name='Description' placeholder="Description" onChange={onChangeCreateIdeaForm}></textarea>
                                            <select value={categories[0]._id} name='CategoryId' onChange={onChangeCreateIdeaForm}>
                                                {categories.map((category, index) => (
                                                    <option key={index} value={category._id}>
                                                        {category.Title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={style.addInfor}>
                                            <label className={style.lbPublic}>
                                                <input className={style.public} type="radio" name="option" value="A" checked={selectedOption === 'A'} onChange={handleOptionChange} />
                                                Public
                                            </label>
                                            <label className={style.lbAno}>
                                                <input className={style.anonymous} type="radio" name="option" value="B" checked={selectedOption === 'B'} onChange={handleOptionChange} />
                                                Anonymous
                                            </label>
                                            <div className={style.changeColor}>
                                                <img src="https://www.facebook.com/images/composer/SATP_Aa_square-2x.png" className={style.imgChange} />
                                            </div>
                                            <div className={style.footerLeftIcon}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-emoji-smile" viewBox="0 0 16 16">
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                    <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className={style.condition}>
                                            <label className={style.agreeCondition}>
                                                <input className={style.agreeCon}
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={handleCheckboxChange}
                                                /> I agree to Terms and Conditions

                                            </label>
                                        </div>
                                        <div className={style.submitIdea1}>
                                            <div className={style.submitIdea2}>
                                                <button className={style.submitIdea3} type="submit">
                                                    Create Idea
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.footerRight}>
                                        <button className={style.closeModalCreateIdea} onClick={() => setShowAddModal(false)}>Cancel</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {
                showUpdateModal && (
                    <div className={style.modalCreateIdea}>
                        <div className={style.modalBodyCreateIdea}>
                            <div className={style.modalInnerCreateIdea}>
                                <div className={style.CreateIdeaHeader}>
                                    <h1 className={style.CreateIdea}>Update Idea </h1>
                                </div>
                            </div>
                            <div className={style.CreateIdeaContent}>
                                <div className={style.CreateIdeaAvt}>
                                    <img src="https://th.bing.com/th/id/OIP.4xZbB1ML4raovv9lcrnXTQHaEK?w=311&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7" className={style.avtIdea} />
                                </div>
                                <div className={style.CreateIdeaName}>Phương Anh</div>
                                <div className={style.gach}></div>
                            </div>
                            <form onSubmit={updateIdea}>
                                <div className={style.CreateIdeaFooter}>
                                    <div className={style.footerLeft}>
                                        <input type='hidden' name="updating_id" value={updateIdeaForm.updating_id} />
                                        <div className={style.formTitle}>
                                            <input type="text" className={style.addTile} name="updatingTitle" value={updateIdeaForm.updatingTitle} onChange={onChangeUpdateIdeaForm} />
                                        </div>
                                        <div className={style.inputIdea}>
                                            <textarea rows={10} className={style.InputForm} name="updatingDescription" value={updateIdeaForm.updatingDescription} onChange={onChangeUpdateIdeaForm}></textarea>
                                        </div>
                                        <div className={style.addInfor}>
                                            <label>
                                                <input className={style.public} type="radio" name="option" value="A" checked={selectedOption === 'A'} onChange={handleOptionChange} />
                                                Public
                                            </label>
                                            <label className={style.chooseB}>
                                                <input className={style.Anonymous} type="radio" name="option" value="B" checked={selectedOption === 'B'} onChange={handleOptionChange} />
                                                Anonymous
                                            </label>
                                            <div className={style.changeColor}>
                                                <img src="https://www.facebook.com/images/composer/SATP_Aa_square-2x.png" className={style.imgChange} />
                                            </div>
                                            <div className={style.footerLeftIcon}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" class="bi bi-emoji-smile" viewBox="0 0 16 16">
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                    <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className={style.submitIdea1}>
                                            <div className={style.submitIdea2}>
                                                <button className={style.submitIdea3} type="submit">Update Idea</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.footerRight}>
                                        <button className={style.closeModalCreateIdea} onClick={() => setShowUpdateModal(false)}>Cancel</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {
                showDeleteModal && (
                    <div className={style.modalDeleteIdea}>
                        <div className={style.modalContentDeleteIdea}>
                            <h2 className={style.containerDelete}>Delete Idea</h2>
                            <p className={style.contextDeleteIdea}>Are you sure you want to delete your idea? This action cannot be undone.</p>
                            <button className={style.bntDeleteIdea} onClick={deleteIdea}>Delete</button>
                            <button className={style.bntcancelIdea} onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Profile