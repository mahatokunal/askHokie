import {withRequiredAuthInfo} from "@propelauth/react";
import {Link} from "react-router-dom";
import React, { useState } from 'react';
import './Home.css'

function Home(props) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };
    return <div>
        <Link to="#" onClick={togglePopup}>
            Account Info
        </Link>
        {isPopupOpen && <Popup user={props.user} onClose={togglePopup} />}
    </div>
}

function Popup({ user, onClose }) {
    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>User Information</h2>
                <span>
                    <h2>User Info</h2>
                    {user && user.pictureUrl && <img src={user.pictureUrl} alt={"profile"} className="pictureUrl" />}
                    <pre>user: {JSON.stringify(user, null, 2)}</pre>
                </span>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default withRequiredAuthInfo(Home);