import {
    BrowserRouter as Router,
    Switch,
    useHistory,
    useLocation,
    Link
} from "react-router-dom";
import "./styles/Navbar.scss"
import { useUser } from "../contexts/user";
// import axios from "axios";
import { useEffect, useRef } from "react";

const Navbar = () => {

    const { user, authenticated, logout } = useUser();
    let history = useHistory();
    let location = useLocation();
    const { navListItem } = useRef();

    useEffect(() => {

    }, [location])

    return (
        <nav>

            <div className="container">
                <Link to="/"><h3>MTB Forum</h3></Link>
                <ul>
                    <li><Link to="/forum/uc-recent">Forum</Link></li>
                    {!user && <li><Link to="/register">Register</Link></li>}
                    
                    {
                        user ?
                            <>
                            <li><button onClick={(e) => logout(() => history.push("/"))}>Logout</button></li>                        <Link to="/profile" className="profileNameImageParent">
                            {/* <div className="profileImageDiv"> */}
                                <img className="placeholderImage" src="https://mtbforum.s3.amazonaws.com/placeholderPerson.png" alt="" />
                            {/* </div> */}
                            {/* <h4>&nbsp; {user.username}</h4> */}
                        </Link>
                            </>
                            :
                            <li ref={navListItem}><Link to="/login">Login</Link></li>
                    }

                </ul>
                {/* {
                    user ?

                        :
                        <></>
                } */}
            </div>
        </nav>
    )
}

export default Navbar;