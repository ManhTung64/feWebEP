////import từ thư viện bên ngoài
import React, { useState, useEffect } from "react"
import Modal from "react-modal"
import axios from 'axios'
import { io } from 'socket.io-client'

//import từ bên trong src
import style from './Homepage.module.css'
import Header from "../header/Header"
import SideBar from "../sidebar/Sidebar"
import { apiUrl, PROFILE_INFORMATION } from '../../../constants/constants'

Modal.setAppElement("#root")
const socket = io('https://server-enterprise.onrender.com', { transports: ['websocket'] })

function Homepage() {
    const profile_information = JSON.parse(localStorage.getItem(PROFILE_INFORMATION)) // chuyển json sang object để lấy thông tin profile người dùng
    const userId = profile_information._id // lấy ra user ID (không phải account ID)

    const [showAddModal, setShowAddModal] = useState(false) // trạng thái của modal hiển thị form add
    const [showUpdateModal, setShowUpdateModal] = useState(false) // trạng thái của modal hiển thị form update
    const [showCommentModal, setShowCommentModal] = useState(false) // trạng thái của modal hiển thị form comment
    const [showDeleteModal, setShowDeleteModal] = useState(false) // trạng thái của modal hiển thị xác nhận xóa

    const [ideas, setIdeas] = useState([]) // trạng thái danh sách các ideas
    global.ide = ideas
    const [categories, setCategories] = useState([]) // trạng thái danh sách các categories
    const [comments, setComments] = useState([]) // trạng thái danh sách các comment của 1 idea cụ thể

    const [downloadZipId, setDownloadZipId] = useState('') // trạng thái lưu trữ giá trị id của idea sẽ được tải file ZIP
    const [deleteIdeaId, setDeleteIdeaId] = useState('') // trạng thái lưu trữ giá trị id của idea sẽ bị xóa

    const [createIdeaForm, setCreateIdeaForm] = useState({ // trạng thái form tạo idea
        Title: '',
        Description: '',
        UserId: userId,
        CategoryId: null,
        Anonymous: false
    })

    const [updateIdeaForm, setUpdateIdeaForm] = useState({ // trạng thái form cập nhật idea
        updating_id: '',
        updatingTitle: '',
        updatingDescription: ''
    })

    const [likeState, setLikeState] = useState([]) // trạng thái danh sách các 
    const [dislikeState, setDislikeState] = useState([])
    const [viewState, setViewState] = useState([])
    const [thumbsIdeaId, setThumbsIdeaId] = useState(null)
    useEffect(() => {
        try {
            (async () => {
                const response = await axios.get(`${apiUrl}/idea/home`)
                if (response.data.success) {
                    console.log(response.data)
                    setIdeas(response.data.ideas)
                    setCategories(response.data.categories)
                    setComments(response.data.ideas[0].comments)
                    setCreateIdeaForm({
                        Title: '',
                        Description: '',
                        UserId: userId,
                        CategoryId: response.data.categories[0]._id,
                        Anonymous: false
                    })
                }
            })()
        } catch (error) {
            console.log(error.response.data)
        }
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
            setIdeas(global.ide)
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
            setIdeas(global.ide)
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
            setIdeas(global.ide)
        })
        return () => {
            socket.off('like')
            socket.off('dislike')
            socket.off('view')
        }
    }, [thumbsIdeaId])

    const onChangeCreateIdeaForm = event => setCreateIdeaForm({ ...createIdeaForm, [event.target.name]: event.target.value })

    const onChangeUpdateIdeaForm = event => setUpdateIdeaForm({ ...updateIdeaForm, [event.target.name]: event.target.value })

    const createIdea = () => {
        setShowAddModal(false);
        (async () => {
            try {
                const response = await axios.post(`${apiUrl}/idea/createIdea`, createIdeaForm)
                if (response.data.success) {
                    console.log(response.data.idea)
                    setCreateIdeaForm({
                        Title: '',
                        Description: '',
                        UserId: userId,
                        CategoryId: null,
                        Anonymous: false
                    })
                    setIdeas([...ideas, response.data.idea])
                }
            } catch (error) {
                console.log(error.response.data)
            }
        }
        )()
    }

    const showActionsWhenHoverAndGetCurrentIdea = idea => {
        console.log(idea)
        setUpdateIdeaForm({
            updating_id: idea._id,
            updatingTitle: idea.Title,
            updatingDescription: idea.Description
        })
        setDeleteIdeaId(idea._id)
        setDownloadZipId(idea._id)
    }

    const updateIdea = () => {
        setShowUpdateModal(false);
        (async () => {
            try {
                const response = await axios.put(`${apiUrl}/idea/update/${updateIdeaForm.updating_id}`, { Title: updateIdeaForm.updatingTitle, Description: updateIdeaForm.updatingDescription })
                if (response.data.success) {
                    console.log(response.data)
                    const newIdeas = ideas.map(idea => {
                        if (idea._id === response.data.idea._id) {
                            idea.Title = response.data.idea.Title
                            idea.Description = response.data.idea.Description
                        }
                        return idea
                    })
                    setIdeas(newIdeas)
                }
            } catch (error) {
                console.error(error.response.data)
            }
        })()
    }

    const deleteIdea = () => {
        setShowDeleteModal(false);
        (async () => {
            try {
                const response = await axios.delete(`${apiUrl}/idea/deleteIdea/${deleteIdeaId}`)
                if (response.data.success) {
                    console.log(response.data)
                    const afterDeletedIdeas = ideas.filter(idea => idea._id !== deleteIdeaId)
                    setIdeas(afterDeletedIdeas)
                }
            } catch (error) {
                console.error(error.response.data)
            }
        })()
    }

    const handleLikeClick = async (userId, ideaId) => {
        const data = { userId, ideaId, state: 'like' }
        socket.emit('like', data)
    }

    const handleDisLikeClick = async (userId, ideaId) => {
        const data = { userId, ideaId, state: 'dislike' }
        socket.emit('dislike', data)
    }

    const handleView = async (userId, ideaId) => {
        const data = { userId, ideaId, state: 'view' }
        socket.emit('view', data)
    }

    const [isChecked, setIsChecked] = useState(false)
    const [selectedOption, setSelectedOption] = useState('A')

    const handleOptionChange = event => setSelectedOption(event.target.value)

    const handleCheckboxChange = event => setIsChecked(event.target.checked)

    return (
        <>
            <div>
                <Header />
                <div className={style.container}>
                    <div className={style.leftSidebar}>
                        <SideBar />
                    </div>
                    <div className={style.middleSection}>
                        <h2 className={style.post}>Posts</h2>
                        <ul className={style.homepageUl}>
                            <li className={style.arialLabel}>
                                <img src={`https://server-enterprise.onrender.com/${profile_information.Avatar}`} alt="avatar" className={style.logoAvatar} />
                                <div className={style.inputContainer}>
                                    <button className={style.inputText} onClick={() => setShowAddModal(true)}>Create Idea</button>
                                    <span className={style.cameraIcon}><i className="fas fa-camera"></i></span>
                                </div>
                            </li>
                            <div className={style.line}></div>
                            {
                                ideas.map((idea, index) => {
                                    return (
                                        <li className={style.textInput} key={index}>
                                            <div className={style.avatarNameDate}>
                                                <div className={style.nameDateDot}>
                                                    <div className={style.nameDate}>
                                                        {idea.userPost.map((user, index) => (
                                                            <div key={index}>
                                                                <img src={`https://server-enterprise.onrender.com/${user.Avatar}`} alt="avatar" className={style.logoAvatar} />
                                                                <p>{user.Name}</p>
                                                            </div>
                                                        ))}
                                                        <div className={style.dateDisplay}>1 hour ago</div>
                                                    </div>
                                                    <div className={style.dropdown}>
                                                        <div className={style.dropdownToggle}>
                                                            <i className="fa fa-ellipsis-h" onClick={() => showActionsWhenHoverAndGetCurrentIdea(idea)}>
                                                                <div className={style.dropdownMenu}>
                                                                    <a><button className={style.btnidea} onClick={() => setShowUpdateModal(true)}>Update Idea</button></a>
                                                                    <a><button className={style.btnidea} onClick={() => setShowDeleteModal(true)}>Delete</button></a>
                                                                    <button className={style.btnidea} ><a href={`${apiUrl}/file/idea/downloadzip/${downloadZipId}`} >Download ZIP</a></button>
                                                                </div>
                                                            </i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={style.content}>{idea.Title}</div>
                                            <img className={style.imgBody} src={`https://server-enterprise.onrender.com/${profile_information.Avatar}`} />
                                            <div>{idea.Description}</div>
                                            <div className={style.line}></div>
                                            <div className={style.likeDislikeComment}>
                                                <div className={style.interactionButtons}>
                                                    {
                                                        thumbsIdeaId && thumbsIdeaId == idea._id ? <div>
                                                            <button className={style.like} onClick={() => handleLikeClick(userId, idea._id)}>{likeState.length}<i className="fa fa-thumbs-up"></i></button>
                                                            <button className={style.dislike} onClick={() => handleDisLikeClick(userId, idea._id)}>{dislikeState.length}<i className="fa fa-thumbs-down"></i></button></div>
                                                            : <div><button className={style.like} onClick={() => handleLikeClick(userId, idea._id)}>{idea.totallike}<i className="fa fa-thumbs-up"></i></button>
                                                                <button className={style.dislike} onClick={() => handleDisLikeClick(userId, idea._id)}>{idea.totaldislike}<i className="fa fa-thumbs-down"></i></button>
                                                            </div>
                                                    }
                                                    <button type="button" className={style.comment} onClick={() => { setShowCommentModal(true); handleView(userId, idea._id) }}><i className="fa fa-comment"></i></button>
                                                    {
                                                        thumbsIdeaId && thumbsIdeaId == idea._id ? <div><button disabled type="button" className={style.comment}>{viewState.length}<i className="fas fa-eye"></i></button> </div>
                                                            : <div><button type="button" disabled className={style.comment}>{idea.totalview}<i className="fas fa-eye"></i></button> </div>
                                                    }
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
                    <div className={style.rightSidebar}>
                        <ul className={style.homepageUl}>
                            {
                                categories.map((category, index) => {
                                    return (<li key={index} className={style.homepageLi}>{category.Title}</li>)
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
            {
                showAddModal && (
                    <div className={style.modalCreateIdea}>
                        <form className={style.modalBodyCreateIdea} onSubmit={createIdea}>
                            <div className={style.modalBodyCreateIdea}>
                                <div>
                                    <div className={style.CreateIdeaHeader}>
                                        <h1 className={style.CreateIdea}>Create Idea</h1>
                                    </div>
                                </div>
                                <div className={style.CreateIdeaContent}>
                                    <div className={style.CreateIdeaAvt} >
                                        <img className={style.avtIdea} src={`https://server-enterprise.onrender.com/${profile_information.Avatar}`} />
                                    </div>
                                    <div className={style.CreateIdeaName}>{profile_information.Name}</div>
                                    <div className={style.dropdownMode}>
                                        <div className={style.dropdown_content}>
                                            <select className={style.selectCate} value={createIdeaForm.CategoryId} name='CategoryId' onChange={onChangeCreateIdeaForm}>
                                                {categories.map((category, index) => (
                                                    <option key={index} value={category._id}>
                                                        {category.Title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className={style.formTitle}>
                                        <input type='text' className={style.addTile} name='Title' placeholder="Title" onChange={onChangeCreateIdeaForm} />
                                    </div>
                                    <hr className={style.gach}></hr>
                                </div>

                                <div className={style.CreateIdeaFooter}>
                                    <div className={style.footerLeft}>
                                        <div className={style.inputIdea}>
                                            <textarea rows={10} className={style.InputForm} name='Description' placeholder="Description" onChange={onChangeCreateIdeaForm}></textarea>
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
                                                <img src="https://cdn-icons-png.flaticon.com/512/2659/2659360.png" className={style.imgChange} />
                                            </div>
                                            <div className={style.footerLeftIcon}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-emoji-smile" viewBox="0 0 16 16">
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
                                                /> I agree to Condition
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
                            </div>
                        </form>
                    </div>
                )
            }

            {
                showUpdateModal && (
                    <div className={style.modalCreateIdea}>
                        <form className={style.modalBodyCreateIdea} onSubmit={updateIdea}>
                            <div className={style.modalBodyCreateIdea}>
                                <div className={style.modalInnerCreateIdea}>
                                    <div className={style.CreateIdeaHeader}>
                                        <h1 className={style.CreateIdea}>Update Idea </h1>
                                    </div>
                                </div>
                                <div className={style.CreateIdeaContent}>
                                    <div className={style.CreateIdeaAvt}>
                                        <img className={style.avtIdea} src={`https://server-enterprise.onrender.com/${profile_information.Avatar}`} />
                                    </div>
                                    <div className={style.CreateIdeaName}>{profile_information.Name}</div>
                                    <input type='hidden' name="updating_id" value={updateIdeaForm.updating_id} />
                                    <div className={style.formTitle}>
                                        <input type="text" className={style.addTile} name="updatingTitle" value={updateIdeaForm.updatingTitle} onChange={onChangeUpdateIdeaForm} placeholder='Title' />
                                    </div>
                                    <hr className={style.gach}></hr>
                                </div>
                                <div className={style.CreateIdeaFooter}>
                                    <div className={style.footerLeft}>
                                        <div className={style.inputIdea}>
                                            <textarea rows={10} className={style.InputFormU} name="updatingDescription" value={updateIdeaForm.updatingDescription} onChange={onChangeUpdateIdeaForm} placeholder='Description'></textarea>
                                        </div>
                                        <div className={style.addInforU}>
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
                                                <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" fill="currentColor" className="bi bi-emoji-smile" viewBox="0 0 16 16">
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                    <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className={style.submitIdea}>
                                            <div className={style.submitIdea2}>
                                                <button className={style.submitIdea3} type="submit">Update Idea</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.footerRight}>
                                        <button className={style.closeModalCreateIdea} onClick={() => setShowUpdateModal(false)}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )
            }

            {
                showDeleteModal && (
                    <div className={style.modalDeleteIdea}>
                        <div className={style.modalContentDeleteIdea}>
                            <img src="https://cdn-icons-png.flaticon.com/128/9789/9789276.png" className={style.imgResponsive} />
                            <h2 className={style.containerDelete}>Delete Idea</h2>
                            <p className={style.contextDeleteIdea}>Are you sure you want to delete your idea? This action cannot be undone.</p>
                            <button className="btn btn-secondary btn-lg mr-2 rounded-lg" onClick={deleteIdea}>Delete</button>
                            <button className="btn btn-danger btn-lg rounded-lg" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        </div>
                    </div>
                )
            }

            {
                showCommentModal && (
                    <div className={style.modalDiv}>
                        {
                            comments.map((comment, index) => {
                                return (
                                    <div key={index}>{comment.Content}</div>
                                )
                            })
                        }
                        <div>
                            <img src={`https://server-enterprise.onrender.com/${profile_information.Avatar}`} alt="avatar" className={style.logoAvatarComment} />
                            <input className={style.inputModalComment} type="text" name="comment" placeholder="Comment here" />
                            <button onClick={() => setShowCommentModal(false)} className={style.closeComment}><i className="fa fa-close"></i></button>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Homepage