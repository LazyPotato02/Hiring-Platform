import React, { useEffect, useRef, useState } from "react";
import './NavBar.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContect.tsx";

const NavBar: React.FC = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [searchValue, setSearchValue] = useState("");
    const userTyped = useRef(false);
    const [isUserInterviewer, setIsUserInterviewer] = useState(false);

    useEffect(() => {
        if (user && user.role === 'interviewer') {
            setIsUserInterviewer(true);
        } else {
            setIsUserInterviewer(false);
        }
    }, [user]);


    useEffect(() => {
        if (!userTyped.current) return;

        const timeout = setTimeout(() => {
            const params = new URLSearchParams(location.search);
            if (searchValue) {
                params.set("search", searchValue);
            } else {
                params.delete("search");
            }

            if (location.pathname.startsWith("/jobs")) {
                navigate(`${location.pathname}?${params.toString()}`);
            } else {
                navigate(`/jobs?search=${encodeURIComponent(searchValue)}`);
            }
        }, 500);


        return () => clearTimeout(timeout);
    }, [searchValue]);

    return (
        <nav className="navbar-main">
            <ul className="navbar-list">
                <div className="navbar-left-items">
                    <li><Link className="navbar-item" to="/">Home</Link></li>
                    {isUserInterviewer && (
                        <li><Link className="navbar-item" to="/jobs/add">Add Job</Link></li>
                    )}
                </div>


                <li>
                    <form className="navbar-search-form" onSubmit={(e) => e.preventDefault()}>
                        <input
                            className="navbar-search-input"
                            type="text"
                            name="search"
                            value={searchValue}
                            onChange={(e) => {
                                userTyped.current = true;
                                setSearchValue(e.target.value);
                            }}
                            placeholder="Search jobs..."
                        />
                    </form>
                </li>

                <li>
                    <div className="navbar-item navbar-item-users">
                        {loading ? null : user ? (
                            <>
                                <Link className="navbar-item" to="/profile">Profile</Link>

                                <Link className="navbar-item" to="/" onClick={logout}>Logout</Link>
                            </>

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
    );
};

export default NavBar;
