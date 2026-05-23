import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Games_available from './list_of_games_avbl';
import Card from './Card';
import Header from '../header.jsx';
import Footer from '../footer.jsx';
import { contentSection, heroSection, pageShell } from '../uiClasses.js';

const hero_glow_class =
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none";
const hero_title_style =
    "block mt-2 bg-linear-to-r from-orange-600 to-yellow-400 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-orange-600 transition-all duration-500 tracking-tight";
const home_btn =
    "px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 cursor-pointer";
const pri_home_btn =
    `${home_btn} bg-linear-to-r from-orange-500 to-yellow-500 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:-translate-y-1`;
const sec_home_btn =
    `${home_btn} bg-white/5 border border-orange-500/30 text-orange-300 hover:bg-orange-500/10 backdrop-blur-sm`;
const viewAllButton =
    "text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 group bg-transparent border-none cursor-pointer";

function Home_page() {
    const navigate = useNavigate();

    return (
        <div className={pageShell}>
            <Header />

            <main className="grow flex flex-col items-center w-full pb-16">
                {/* Hero Section */}
                <section className={`${heroSection} py-16 md:py-24`}>
                    <div className={hero_glow_class}></div>
                    <h1 className="group text-4xl md:text-6xl font-extrabold tracking-tight mb-6 relative z-10 cursor-default">
                        <span className="block text-white">Welcome to</span>
                        <span className={hero_title_style}>
                            HELLO Games
                        </span>
                    </h1>

                    <p className="max-w-2xl text-lg md:text-xl text-orange-200/80 mb-10 relative z-10 leading-relaxed">
                        A destination for fun and brainstorming. Discover interactive challenges, push your limits, or even publish your own games here.
                        <Link
                            to="/publish"
                            className="text-orange-400 underline ml-1.5 font-semibold cursor-pointer"
                        >
                            Know more
                        </Link>
                    </p>

                    <div className="flex gap-4 relative z-10">
                        <button
                            onClick={() => navigate("/play")}
                            className={pri_home_btn}
                        >
                            Start Playing
                        </button>
                        <button
                            onClick={() => navigate("/about")}
                            className={sec_home_btn}
                        >
                            Explore
                        </button>
                    </div>
                </section>

                {/* Games Grid Section */}
                <section className={`${contentSection} py-12`}>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                            <span className="w-8 h-1 bg-orange-500 rounded-full"></span>
                            Trending Now
                        </h2>
                        <button
                            onClick={() => navigate("/play")}
                            className={viewAllButton}
                        >
                            View All
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                        {Games_available.map((game) => (
                            <Card
                                key={game.id}
                                title={game.title}
                                image={game.image}
                                onClick={() => {
                                    if (game.path) navigate(game.path);
                                }}
                            />
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Home_page;
