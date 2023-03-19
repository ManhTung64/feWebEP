//import từ thư viện bên ngoài
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

//import từ bên trong src
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME, ACCOUNT_ID, ROLE, PROFILE_INFORMATION } from "../../../constants/constants"
import style from './LoginForm.module.css'
import { Link } from 'react-router-dom'

const LoginForm = () => {
    const navigate = useNavigate()
    const [loginForm, setLoginForm] = useState({
        Username: "",
        Password: ""
    })
    const onChangeLoginForm = event => setLoginForm({ ...loginForm, [event.target.name]: event.target.value })
    const login = async event => {
        event.preventDefault()
        try {
            const response = await axios.post(`${apiUrl}/auth/account/login`, loginForm)
            if (response.data.success) {
                console.log(response.data)
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken)
                localStorage.setItem(ACCOUNT_ID, response.data.accountId)
                localStorage.setItem(ROLE, response.data.role)
                localStorage.setItem(PROFILE_INFORMATION, JSON.stringify(response.data.user))
                const role = response.data.role
                if (role === 'Staff')
                    navigate("/homepage")
                else if (role === 'QAM')
                    navigate("/qualityAssuranceManager")
                else if (role === 'Administrator')
                    navigate('/account')
            }
        } catch (error) {
            console.error(error.response.data.message)
        }
    }

    const { Username, Password } = loginForm
    return (
        <>
            <div className={style.loginWrapper}>
                <div className={style.loginContainer}>
                    <form className={style.loginForm} onSubmit={login}>
                        <h1 className={style.loginText}>Login Account</h1>
                        <div className={style.formGroup}>
                            <input
                                className={style.formControl}
                                type="text"
                                name="Username"
                                placeholder="Username"
                                required
                                value={Username}
                                onChange={onChangeLoginForm}
                            />
                        </div>

                        <div className={style.formGroup}>
                            <input
                                className={style.formControl}
                                type="password"
                                name="Password"
                                placeholder="Password"
                                required
                                value={Password}
                                onChange={onChangeLoginForm}
                            />

                            <div className={style.rememberme}>
                                <input className={style.formCheckInput} type="checkbox" id="rememberMe" />
                                <label className={style.lbRemember}>Remember me</label>
                            </div>

                        </div>
                        <div className={style.loginBtnWrapper}>
                            <input type="submit" className={style.loginBtn} value='Login' />
                        </div>

                        <div className={style.forgotpass}>
                            <Link to="/">Forgot password ? </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginForm
