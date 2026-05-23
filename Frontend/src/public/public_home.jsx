import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../Components/Protected compo/api";
import Footer from "../Components/footer";
import Games_available from "../Components/Protected compo/list_of_games_avbl";
// tailwind css classes
const pageShell =
    "min-h-screen flex flex-col bg-linear-to-b from-green-950 via-gray-950 to-black font-sans text-orange-100 overflow-x-hidden selection:bg-orange-500 selection:text-white";
const headerShell =
    "relative z-10 w-full backdrop-blur-md border-b border-green-800/20 bg-green-950/20 sticky top-0 transition-all duration-300";
const glowTop =
    "absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-green-500/10 blur-[150px] rounded-full pointer-events-none z-0";
const glowRight =
    "absolute top-1/3 right-0 w-[400px] h-[400px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none z-0";
const glowBottom =
    "absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-green-500/5 blur-[180px] rounded-full pointer-events-none z-0";
const logoBox =
    "overflow-hidden rounded-xl bg-white/5 border border-orange-500/10 p-1.5 backdrop-blur-xs group-hover:bg-white/10 transition-all duration-300";
const logoImage =
    "h-10 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300";
const logoText =
    "text-xl font-bold bg-linear-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-orange-500 transition-all duration-500 tracking-tight";
const navLink =
    "text-orange-200/80 hover:text-white text-sm font-semibold transition-colors duration-200 uppercase tracking-wider hidden sm:inline-block";
const signInButton =
    "px-5 py-2.5 rounded-xl text-orange-200 hover:text-white text-sm font-bold border border-orange-500/20 hover:border-orange-500/50 bg-white/5 hover:bg-orange-500/10 transition-all duration-300 cursor-pointer";
const signupButton =
    "px-5 py-2.5 rounded-xl bg-linear-to-r from-orange-500 to-yellow-500 text-white text-sm font-bold hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer";
const sectionWrap =
    "relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8";
const pillBadge =
    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 backdrop-blur-md mb-8 animate-fade-in";
const heroTitleGradient =
    "block bg-linear-to-r from-orange-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-sm";
const primaryCta =
    "px-8 py-4 rounded-full bg-linear-to-r from-orange-500 to-yellow-500 text-white font-extrabold text-lg hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] hover:-translate-y-1 transition-all duration-300 cursor-pointer";
const highlightCard =
    "relative group overflow-hidden rounded-2xl border border-orange-500/10 bg-white/5 p-6 backdrop-blur-md hover:border-orange-500/25 transition-all duration-300 flex items-center gap-5";
const highlightIcon =
    "w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0";
const bottomPanel =
    "relative rounded-3xl overflow-hidden border border-orange-500/20 bg-linear-to-b from-green-950/30 to-black/30 p-12 sm:p-16 backdrop-blur-md shadow-2xl";

export default function PublicHome() {
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await API.get("/api/check-auth");
                setIsAuth(response.data.isAuthenticated);
            } catch (err) {
                setIsAuth(false);
            }
        }
        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuth) {
            navigate("/home");
        }
    }, [isAuth, navigate]);

    return (
        <div className={pageShell}>
            {/* Background decor*/}
            <div className={glowTop}></div>
            <div className={glowRight}></div>
            <div className={glowBottom}></div>

            {/* header */}
            <header className={headerShell}>
                <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate("/")}>
                        <div className={logoBox}>
                            <img src="/images/logo.png" className={logoImage} alt="Logo" />
                        </div>
                        <span className={logoText}>
                            HELLO Games
                        </span>
                    </div>

                    {/* navi actions */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link to="/about" className={navLink}>
                            About
                        </Link>
                        <button
                            onClick={() => navigate("/sign-in")}
                            className={signInButton}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate("/sign-up")}
                            className={signupButton}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </header>

            {/* hero section */}
            <section className={`${sectionWrap} pt-24 pb-20 md:pt-36 md:pb-28 flex flex-col items-center text-center`}>
                <div className={pillBadge}>
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    <span className="text-xs font-semibold text-orange-300 uppercase tracking-widest">Instant Play Arcade</span>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 cursor-default max-w-4xl leading-tight">
                    <span className="block text-white mb-2">Welcome to</span>
                    <span className={heroTitleGradient}>
                        HELLO Games
                    </span>
                </h1>

                <p className="max-w-2xl text-lg sm:text-xl text-orange-200/80 mb-12 leading-relaxed">
                    A destination for instant brainstorming and casual fun. Challenge your mind with interactive,
                    in-browser games that are <span className="font-bold text-orange-400">completely free</span>,
                    and with <span className="font-bold text-orange-400">no downloads required</span>.
                </p>

                <div className="flex flex-col sm:flex-row gap-5">
                    <button
                        onClick={() => navigate("/sign-up")}
                        className={primaryCta}
                    >
                        Create Free Account
                    </button>

                </div>
            </section>

            {/* Explanation Section */}
            <section className={`${sectionWrap} py-20 border-t border-green-800/10`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div>
                        <span className="text-orange-400 font-extrabold text-xs uppercase tracking-widest block mb-3">About the Platform</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
                            Play Fun Browser Games Anytime
                        </h2>
                        <p className="text-orange-200/70 text-base sm:text-lg mb-6 leading-relaxed">
                            HELLO Games is a free web gaming platform where you can play simple and challenging games directly in your browser. No downloads are required.
                        </p>
                        <p className="text-orange-200/60 text-base mb-8 leading-relaxed">
                            You can register, play games, track your high scores, and publish your own games*.
                        </p>
                        <h6 className="text-orange-200/60 text-xs mt-2 italic">*T&C apply</h6>
                    </div>

                    {/* Highlights Cards (Beside the About text) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
                        {/* Highlight 1 */}
                        <div className={highlightCard}>
                            <div className={highlightIcon}>
                                <span className="text-xl font-bold">{Games_available.length}+</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white">Playable Games</h4>
                                <p className="text-orange-200/50 text-xs mt-0.5">Instant-play reflex and logic challenges</p>
                            </div>
                        </div>

                        {/* Highlight 2 */}
                        <div className={highlightCard}>
                            <div className={highlightIcon}>
                                <span className="text-xl font-bold">100%</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white">Free Platform</h4>
                                <p className="text-orange-200/50 text-xs mt-0.5">No paywalls or hidden fees</p>
                            </div>
                        </div>

                        {/* Highlight 3 */}
                        <div className={highlightCard}>
                            <div className={highlightIcon}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white">No Downloads</h4>
                                <p className="text-orange-200/50 text-xs mt-0.5">Play instantly in any browser</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*get started now*/}
            <section className={`${sectionWrap} py-20 text-center`}>
                <div className={bottomPanel}>
                    <div className="absolute inset-0 bg-green-500/5 blur-3xl rounded-full pointer-events-none z-0"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
                            Discover Your Genius Today
                        </h2>
                        <p className="text-orange-200/70 text-base sm:text-lg mb-10 leading-relaxed">
                            Get your absolute free HELLO Games profile in under a minute and start playing instantly.
                        </p>
                        <button
                            onClick={() => navigate("/sign-up")}
                            className={primaryCta}
                        >
                            Get Started Now
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
