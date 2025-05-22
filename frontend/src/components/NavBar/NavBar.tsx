import React from "react";

import './NavBar.css'
import {Link} from "react-router-dom";
import {useAuth} from "../../auth/AuthContect.tsx";

const NavBar: React.FC = () => {
    const {user, logout, loading} = useAuth();


    return (
        <nav className="navbar-main">
            <ul className="navbar-list">
                <li><Link className="navbar-item" to="/">Home</Link></li>

                <li>
                    <div className="navbar-item navbar-item-users">
                        {loading ? null : user ? (
                            <Link className="navbar-item" to="/" onClick={logout}>Logout</Link>
                        ) : (
                            <>
                                <Link className="navbar-item" to="/login">Login</Link>
                                <Link className="navbar-item" to="/register">Register</Link>
                            </>
                        )}
                    </div>
                </li>
            </ul>
        </nav>
    )
}

export default NavBar;
