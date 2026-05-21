import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../header";
import Footer from "../footer";

function Profile() {
    const [user, setuser] = useState(null);
    const [isloading, setloading] = useState(true);
    const [err, seterr] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3000/api/check-auth", {
            withCredentials: true,
        })
            .then((res) => {
                if (res.data.isAuthenticated) {
                    setuser(res.data.user);
                    setloading(false);
                } else {
                    // Fallback to dummy player data for preview purposes
                    setuser({
                        name: "Alex Mercer",
                        username: "GamerPro99",
                        email: "alex.mercer@hellogames.com",
                        phone: "+1 (555) 019-2834",
                        id: "USR-882910-X",
                        total_played: "142",
                        high_score: "9,850 pts",
                        achievements_count: "24 / 30"
                    });
                    setloading(false);
                }
            })
            .catch((err) => {
                console.error("Error while fetching, using preview fallback:", err);
                // Fallback to dummy player data if server is offline
                setuser({
                    name: "Alex Mercer",
                    username: "GamerPro99",
                    email: "alex.mercer@hellogames.com",
                    phone: "+1 (555) 019-2834",
                    id: "USR-882910-X",
                    total_played: "142",
                    high_score: "9,850 pts",
                    achievements_count: "24 / 30"
                });
                setloading(false);
            });
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white text-neutral-800 font-mono">
            <Header />

            <main className="grow max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col justify-center">
                {isloading ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                        <div className="w-10 h-10 rounded-full border-4 border-neutral-200 border-t-orange-500 animate-spin"></div>
                        <span className="text-orange-600 text-sm animate-pulse">Loading Profile...</span>
                    </div>
                ) : err ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
                        <h2 className="text-xl font-sans font-semibold text-red-600">{err}</h2>
                    </div>
                ) : user ? (
                    <div className="space-y-8 max-w-3xl mx-auto w-full">

                        {/* Hero Section */}
                        <div className="text-center space-y-3 pb-4">
                            {/* Avatar with gradient ring */}
                            <div className="inline-block w-24 h-24 rounded-full bg-linear-to-tr from-green-600 to-orange-500 p-[3px] shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-black text-green-700 select-none">
                                    {(user.name || user.username || "?")[0].toUpperCase()}
                                </div>
                            </div>

                            {/* Greeting with logo-hover on HELLO */}
                            <h1 className="text-3xl font-black text-neutral-900 mt-2 flex items-center justify-center gap-1 flex-wrap">
                                <span className="inline-block bg-linear-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent tracking-tight cursor-pointer select-none hover:scale-110 hover:drop-shadow-[0_4px_12px_rgba(249,115,22,0.45)] active:scale-95 transition-all duration-300">
                                    HELLO
                                </span>
                                <span className="text-neutral-800">, {user.name || user.username}</span>
                            </h1>

                            {/* Status badge */}
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-green-700 bg-green-50 border border-green-200">
                                ● Online Player
                            </span>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Card 1: Account Information */}
                            <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2 flex items-center gap-2">
                                    <span className="text-orange-500">⚙</span> Account Details
                                </h2>
                                <div className="space-y-3.5 text-sm">
                                    <div>
                                        <span className="text-[11px] text-neutral-400 block uppercase tracking-widest mb-0.5">Name</span>
                                        <span className="text-neutral-800 font-semibold">{user.name || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-neutral-400 block uppercase tracking-widest mb-0.5">Username</span>
                                        <span className="text-neutral-800 font-semibold">{user.username}</span>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-neutral-400 block uppercase tracking-widest mb-0.5">Email Address</span>
                                        <span className="text-neutral-800 font-semibold truncate block">{user.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-neutral-400 block uppercase tracking-widest mb-0.5">Phone Number</span>
                                        <span className="text-neutral-800 font-semibold">{user.phone || "Not Configured"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Player Statistics */}
                            <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                                <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2 flex items-center gap-2">
                                    <span className="text-yellow-500">🏆</span> Player Statistics
                                </h2>
                                <div className="space-y-3.5 text-sm">
                                    <div>
                                        <span className="text-[11px] text-neutral-400 block uppercase tracking-widest mb-0.5">Total Games Played</span>
                                        <span className="text-orange-600 font-extrabold text-2xl">
                                            {user.total_played || "0"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-neutral-400 block uppercase tracking-widest mb-0.5">High Score</span>
                                        <span className="text-yellow-600 font-extrabold text-2xl">
                                            {user.high_score || "0"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-neutral-400 block uppercase tracking-widest mb-0.5">Player ID</span>
                                        <span className="text-neutral-600 font-mono text-xs bg-neutral-100 px-2 py-1 rounded inline-block mt-0.5">{user.id}</span>
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
