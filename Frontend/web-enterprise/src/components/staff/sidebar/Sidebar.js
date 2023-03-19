//import từ bên trong src
import './Sidebar.css'
import { Link } from 'react-router-dom';

function SideBar() {
    return (
        <div className={`sidebar `}>
            <ul className="nav">
                <i className='bx bx-menu' id='btn'></i>
                <li>
                    <Link to="/homepage">
                        <i className="fa fa-home" aria-hidden="true"></i>
                        <span className="link_name">Home</span>
                    </Link>
                </li>
                <li>
                    <Link to="/profile">
                        <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                        <span className="link_name">Profile</span>
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default SideBar