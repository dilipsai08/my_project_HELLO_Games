import React from "react";
import { Link } from "react-router-dom";
import Header from "../Components/header";
import Footer from "../Components/footer";

const abt_pge_css =
    "min-h-screen flex flex-col bg-linear-to-b from-green-950 via-gray-950 to-black font-sans text-orange-100 overflow-x-hidden selection:bg-orange-500 selection:text-white";
const glow_orange =
    "absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full pointer-events-none z-0";
const glow_green =
    "absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-green-500/5 blur-[120px] rounded-full pointer-events-none z-0";
const title_gradi =
    "bg-linear-to-r from-orange-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-sm hover:from-yellow-300 hover:to-orange-500 transition-all duration-500";
const overview_crd =
    "relative overflow-hidden rounded-3xl border border-orange-500/15 bg-white/5 p-8 sm:p-12 backdrop-blur-md shadow-2xl mb-16 max-w-4xl mx-auto";
const sta_play_btn =
    "inline-flex px-8 py-4 rounded-full bg-linear-to-r from-orange-500 to-yellow-500 text-white font-extrabold text-lg hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-lg";

function About() {
    return (
        <div className={abt_pge_css}>
            {/* background_glowing deco */}
            <div className={glow_orange}></div>
            <div className={glow_green}></div>

            <Header />

            <main className="grow max-w-5xl mx-auto px-6 sm:px-8 py-16 md:py-24 relative z-10 w-full flex flex-col justify-center">

                {/* Hero Section */}
                <section className="text-center mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 backdrop-blur-md mb-6">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        <span className="text-xs font-semibold text-orange-300 uppercase tracking-widest">About the Platform</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 cursor-default">
                        About{" "}
                        <span className={title_gradi}>
                            HELLO Games
                        </span>
                    </h1>

                    <p className="max-w-2xl text-lg md:text-xl text-orange-200/80 mx-auto leading-relaxed">
                        We design beautiful, lightweight, and engaging browser games that require no downloads and provide pure instant brainstorming fun.
                    </p>
                </section>

                {/* overview_section */}
                <div className={overview_crd}>
                    <div className="absolute inset-0 bg-green-500/5 blur-3xl rounded-full pointer-events-none"></div>
                    <div className="relative z-10 text-center space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What We Do</h2>
                        <p className="text-orange-200/75 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
                            HELLO Games is a high-performance web gaming ecosystem built directly for modern web browsers.
                            We host simple yet intensely satisfying mini-games designed to test your focus, reflex times, math speed, and mental focus.
                            Our core goal is to deliver an arcade that is completely free, secure, and easily playable instantly on any desktop or mobile device.
                        </p>
                    </div>
                </div>

                <section className="text-center pt-8 border-t border-green-800/20 max-w-3xl mx-auto w-full">
                    <h2 className="text-3xl font-extrabold text-white mb-4">Join the Arcade</h2>
                    <p className="text-orange-200/70 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
                        Register a free HELLO Games account today to track your stats, beat high scores, compete with the global community, and climb the scoreboard!
                    </p>
                    <Link
                        to="/sign-up"
                        className={sta_play_btn}
                    >
                        Start Playing Now
                    </Link>
                </section>

            </main>

            <Footer />
        </div>
    );
}

export default About;
