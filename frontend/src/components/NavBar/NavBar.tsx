import React from "react";

import './NavBar.css'
import {Link} from "react-router-dom";
import {useAuth} from "../../auth/AuthContect.tsx";

const NavBar: React.FC = () => {
    const { user,logout,loading } = useAuth();


    return (
        <div className="navbar-main">
            <ul className="navbar-list">
                <Link className="navbar-item" to={'/'}>Home</Link>


                <div className="navbar-item navbar-item-users">

                    {loading ? null : user ? (
                        <Link className="navbar-item" to={'/'} onClick={logout}>Logout</Link>
                    ) : (
                        <>
                            <Link className="navbar-item" to={'/login'}>Login</Link>
                            <Link className="navbar-item" to={'/'}>Register</Link>
                        </>
                    )}
                </div>

            </ul>
        </div>
    )
}

export default NavBar;
