import React from 'react';
import '../public/my_style.css';

function Footer() {
    return (
        <>
            <footer className="w-full border-t border-green-700/50 bg-green-800 py-6 mt-auto">
                <div className='footer-content text-center text-orange-100 text-sm'>
                    <p>©{new Date().getFullYear()} HELLO Games. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}
export default Footer;