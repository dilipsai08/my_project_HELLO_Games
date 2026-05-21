import React, { useState } from 'react';
import '../public/my_style.css';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-green-800 border-b border-green-700/50 shadow-lg transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="overflow-hidden rounded-xl bg-white/10 p-1 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300">
                            <img src="../images/logo.png" className="h-14 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300" alt="Logo" />
                        </div>
                        <span className="text-2xl font-bold bg-linear-to-r from-orange-600 to-yellow-400 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-orange-600 transition-all duration-500 tracking-tight">HELLO Games</span>
                    </div>
                    {/* Right Side Container */}
                    <div className="flex items-center gap-8">
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#" className="text-orange-100 hover:text-white font-medium text-sm uppercase tracking-wider transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-orange-400 hover:after:w-full after:transition-all after:duration-300">
                                Home
                            </a>
                            <a href="#" className="text-orange-100 hover:text-white font-medium text-sm uppercase tracking-wider transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-orange-400 hover:after:w-full after:transition-all after:duration-300">
                                About
                            </a>
                            <div className="relative group cursor-pointer">
                                <span className="text-orange-200/70 font-medium text-sm uppercase tracking-wider hover:text-orange-100 transition-colors">
                                    Play
                                </span>
                                <div className="absolute -top-2 -right-4">
                                    <span className="flex h-2.5 w-2.5 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                                    </span>
                                </div>
                            </div>
                        </nav>

                        {/* Action Button & Mobile Toggle */}
                        <div className="flex items-center gap-4">
                            {/* Profile Section */}
                            <div className="hidden sm:flex items-center gap-2 cursor-pointer group relative">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-orange-500 transition-all duration-300 bg-linear-to-tr from-orange-500 to-yellow-400 flex items-center justify-center shadow-md">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <svg className="w-4 h-4 text-orange-200 group-hover:text-white transition-colors transform group-hover:rotate-180 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            
                            {/* Mobile Menu Button */}
                            <button 
                                className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-orange-200 transition-colors focus:outline-none"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pt-2 pb-6 space-y-3 bg-green-800 backdrop-blur-xl border-t border-green-800/50">
                    <a href="#" className="block px-3 py-2 rounded-lg text-orange-100 hover:text-white hover:bg-white/10 font-medium transition-colors">
                        Home
                    </a>
                    <a href="#" className="block px-3 py-2 rounded-lg text-orange-100 hover:text-white hover:bg-white/10 font-medium transition-colors">
                        About
                    </a>
                    <div className="px-3 py-2 rounded-lg text-orange-200/70 font-medium flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                        Coming Soon!
                        <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30 font-bold">New</span>
                    </div>
                    <div className="pt-4 pb-2 sm:hidden border-t border-green-800/50 mt-2">
                        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-white/5 rounded-lg transition-colors">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent bg-linear-to-tr from-orange-500 to-yellow-400 flex items-center justify-center shadow-sm">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-medium text-sm">User Profile</span>
                                <span className="text-orange-200/70 text-xs hover:text-orange-400 transition-colors">Manage Profiles</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;