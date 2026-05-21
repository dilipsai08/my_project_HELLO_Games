import React, { useState, useEffect } from 'react'
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Games_available from './list_of_games_avbl';
import Card from './Card';
import Header_from_jsx from '../header.jsx';
import Footer_from_jsx from '../footer.jsx';

function Home_page() {
    return (
        <div className="min-h-screen flex flex-col bg-linear-to-b from-green-950 to-gray-950 font-sans text-orange-100 overflow-x-hidden">
                <Header_from_jsx />

                <main className="grow flex flex-col items-center w-full pb-16">
                    {/* Hero Section */}
                    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center text-center relative">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>
                         {/* bold text section */}
                        <h1 className="group text-4xl md:text-6xl font-extrabold tracking-tight mb-6 relative z-10 cursor-default">
                            <span className="block text-white">Welcome to</span>
                            <span className="block mt-2 bg-linear-to-r from-orange-600 to-yellow-400 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-orange-600 transition-all duration-500 tracking-tight">
                                HELLO Games
                            </span>
                        </h1>

                        <p className="max-w-2xl text-lg md:text-xl text-orange-200/80 mb-10 relative z-10 leading-relaxed">
                            A premium destination for fun and brainstorming. Discover interactive challenges, push your limits, or even publish your own games here.<a href="#" className='text-orange-500 underline cursor-pointer hover:text-orange-300/80 transition-colors'>know more</a> 
                        </p>

                        <div className="flex gap-4 relative z-10">
                            <button className="px-8 py-3 rounded-full bg-linear-to-r from-orange-500 to-yellow-500 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:-translate-y-1 transition-all duration-300">
                                Start Playing
                            </button>
                            <button className="px-8 py-3 rounded-full bg-white/5 border border-orange-500/30 text-orange-300 font-bold text-lg hover:bg-orange-500/10 transition-all duration-300 backdrop-blur-sm">
                                Explore
                            </button>
                        </div>
                    </section>

                    {/* Games Grid Section */}
                    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                                <span className="w-8 h-1 bg-orange-500 rounded-full"></span>
                                Trending Now
                            </h2>
                            <a href="#" className="text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 group">
                                View All
                                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                            {Games_available.map((game) => (
                                <Card
                                    key={game.id}
                                    title={game.title}
                                    image={game.image}
                                    onClick={() => console.log('Tapped game:', game.title)}
                                />
                            ))}
                        </div>
                    </section>
                </main>

                <Footer_from_jsx />
            </div>
    );
}
export default Home_page;