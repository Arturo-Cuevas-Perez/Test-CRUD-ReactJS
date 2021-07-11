import React from 'react';
import Logo from '../assets/images/logo-white.png';

const Header = () => {
    return (
        <nav className="navbar navbar-expand-lg justify-content-between fixed-top">

            <div className="container">
                <a class="navbar-brand mx-auto m-0 p-0" href="#">
                    <img width="200px" height="auto" className="img-responsive" src={Logo} alt="logo" />
                </a>
            </div>
        </nav>
    );
}

export default Header;