//import từ thư viện bên ngoài
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom';

//import từ bên trong src
import style from "./Header.module.css"
import { LOCAL_STORAGE_TOKEN_NAME, ACCOUNT_ID, ROLE, PROFILE_INFORMATION } from '../../../constants/constants'

const Header = () => {
	const profile_information = JSON.parse(localStorage.getItem(PROFILE_INFORMATION))
	const navigate = useNavigate()
	const [fixed, setFixed] = useState(false)
	useEffect(() => {
		window.addEventListener("scroll", handleScroll)
		return () => {
			window.removeEventListener("scroll", handleScroll);
		}
	}, [])

	const logout = event => {
		event.preventDefault()
		localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
		localStorage.removeItem(ACCOUNT_ID)
		localStorage.removeItem(ROLE)
		localStorage.removeItem(PROFILE_INFORMATION)
		navigate('/')
	}

	const handleScroll = () => {
		if (window.pageYOffset >= 0) {
			setFixed(true)
		} else {
			setFixed(false)
		}
	}

	return (

		<header className={fixed ? style.fixed : ""}>
			<nav className={style.navbar}>
				<div className={style.logo}>
					<Link to="/homepage">
						<img src={`https://server-enterprise.onrender.com/${profile_information.Avatar}`} alt="avatar" />
					</Link>
				</div>
				<div className={style.searchContainer}>
					<input type="text" placeholder="Search" />
				</div>
				<div className={style.dropdown}>
					<div className={style.dropdownToggle}>
						<img src={`https://server-enterprise.onrender.com/${profile_information.Avatar}`} alt="avatar" className={style.avatar} />
						<i className="fa fa-caret-down">
							<div className={style.dropdownMenu}>
								<a href="/profile">Profile</a>
								<a href="#">Settings</a>
								<a href="#">Download file CSV</a>
								<a href="#">Download all idea</a>
								<a onClick={logout}>Logout</a>
							</div>
						</i>
					</div>
				</div>
			</nav>
		</header>
	)
}

export default Header