import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";
import Header from "../header";
import Footer from "../footer";

const prof_page =
    "min-h-screen flex flex-col bg-linear-to-b from-green-950 to-zinc-950 text-orange-100 font-sans";
const state_Screen =
    "flex flex-col items-center justify-center min-h-[50vh]";
const prof_card =
    "rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-orange-500/20 transition-all duration-300";
const card_heading =
    "text-base font-bold text-white border-b border-white/5 pb-3 mb-4 flex items-center gap-2";
const field_label =
    "text-xs text-orange-200/50 block uppercase tracking-wider";
const err_icon =
    "w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 text-xl font-bold";
const avatar =
    "inline-flex w-20 h-20 rounded-full bg-orange-500 items-center justify-center text-3xl font-black text-white shadow-md select-none";
const online_bdge =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20";
const log_out_btn =
    "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer active:scale-95";

function Profile() {
    const navigate = useNavigate();
    const [user, setuser] = useState(null);
    const [isloading, setloading] = useState(true);
    const [err, seterr] = useState(null);

    useEffect(() => {
        API.get("/api/check-auth")
            .then((res) => {
                if (res.data.isAuthenticated) {
                    setuser(res.data.user);
                    setloading(false);
                } else {
                    seterr("Not Authenticated")
                    setloading(false);
                }
            })
            .catch((err) => {
                console.error("Error while fetching :(", err);
                seterr("Error while fetching profile...")
                setloading(false);
            });
    }, []);

    const handleLogout = () => {
        API.get("/logout")
            .then(() => {
                navigate("/");
            })
            .catch((err) => {
                console.error("Logout failed, redirecting anyway:", err);
                navigate("/profile");
            });
    };

    return (
        <div className={prof_page}>
            <Header />

            <main className="grow max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col justify-center">
                {isloading ? (
                    <div className={`${state_Screen} gap-3`}>
                        <div className="w-8 h-8 rounded-full border-3 border-orange-500/20 border-t-orange-500 animate-spin"></div>
                        <span className="text-orange-400 text-sm font-medium animate-pulse">Loading Profile...</span>
                    </div>
                ) : err ? (
                    <div className={`${state_Screen} gap-4 text-center`}>
                        <div className={err_icon}>!</div>
                        <h2 className="text-lg font-semibold text-red-400">{err}</h2>
                    </div>
                ) : user ? (
                    <div className="w-full space-y-8">
                        {/* Profile Header Block */}
                        <div className="text-center space-y-4 pb-6 border-b border-white/5">
                            {/* Simple Solid Circular Avatar */}
                            <div className={avatar}>
                                {(user.name || user.username || "?")[0].toUpperCase()}
                            </div>

                            {/* Clean Greeting */}
                            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
                                <span className="bg-linear-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                                    HELLO
                                </span>
                                <span>, {user.name || user.username}</span>
                            </h1>
                            {/* Status Indicator & Simple Red Logout Button */}
                            <div className="flex items-center justify-center gap-4">
                                <span className={online_bdge}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                    Online Player
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className={log_out_btn}
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </div>

                        {/* Cohesive Simple Grid Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Card 1: Account Information */}
                            <div className={prof_card}>
                                <h2 className={card_heading}>
                                    <span className="text-orange-400">⚙</span> Account Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <span className={`${field_label} mb-0.5`}>Name</span>
                                        <span className="text-white font-medium">{user.name || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className={`${field_label} mb-0.5`}>Username</span>
                                        <span className="text-white font-medium">@{user.username}</span>
                                    </div>
                                    <div>
                                        <span className={`${field_label} mb-0.5`}>Email Address</span>
                                        <span className="text-white font-medium truncate block">{user.email}</span>
                                    </div>
                                    <div>
                                        <span className={`${field_label} mb-0.5`}>Phone Number</span>
                                        <span className="text-white font-medium">{user.phone || "Not Configured"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Player Statistics */}
                            <div className={prof_card}>
                                <h2 className={card_heading}>
                                    <span className="text-yellow-400">🏆</span> Player Statistics
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <span className={`${field_label} mb-1`}>Total Games Played</span>
                                        <span className="text-orange-400 font-extrabold text-2xl">
                                            {user.total_played || "0"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className={`${field_label} mb-1`}>High Score</span>
                                        <span className="text-yellow-400 font-extrabold text-2xl">
                                            {user.high_score || "0"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className={`${field_label} mb-1`}>Player ID</span>
                                        <span className="text-orange-200/80 font-mono text-xs bg-white/10 px-2.5 py-1 rounded inline-block mt-0.5 select-all">
                                            {user.id}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </main>

            <Footer />
        </div>
    );
}

export default Profile;
