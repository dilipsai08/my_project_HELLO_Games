import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card.jsx";
import Header from "../header.jsx";
import Footer from "../footer.jsx";
import Games_available from "./list_of_games_avbl.js";
import comingSoonGames from "./list_of_coming_soon.js";
import { useDebounce } from "./useDebounce.js";
import { contentSection, heroSection, pageShell } from "../uiClasses.js";

const hero_glow_class =
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none";
const hero_title_style =
    "block mt-1 bg-linear-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent";
const tap_btn =
    "flex items-center gap-2 px-6 py-3 border-b-2 text-sm uppercase tracking-wider font-semibold transition-all duration-300 cursor-pointer";
const search_ip =
    "w-full pl-10 pr-10 py-2.5 rounded-full bg-white/5 border border-orange-500/20 text-orange-100 placeholder-orange-200/30 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition-all duration-300 backdrop-blur-md text-sm";
const comming_soon_crd =
    "relative group w-72 h-80 flex flex-col rounded-2xl overflow-hidden bg-white/5 border border-white/5 shadow-lg backdrop-blur-sm select-none";
const clear_search_btn =
    "absolute inset-y-0 right-0 flex items-center pr-3 text-orange-200/40 hover:text-orange-100 transition-colors";
const teaserBadge =
    "absolute top-3 right-3 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full z-20";

function Play() {
    const [play_section, setplay_section] = useState(true);
    const [coming_soon_section, setcoming_soon_section] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    function handle_section_tap(section) {
        if (section === "play") {
            setplay_section(true);
            setcoming_soon_section(false);
        } else {
            setplay_section(false);
            setcoming_soon_section(true);
        }
    }

    const filteredGames = useMemo(() => {
        return Games_available.filter((game) =>
            game.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
    }, [debouncedSearchQuery]);



    return (
        <div className={pageShell}>
            <Header />

            <main className="grow flex flex-col items-center w-full pb-16">
                {/* header Section */}
                <section className={`${heroSection} py-12`}>
                    <div className={hero_glow_class}></div>
                    
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 relative z-10">
                        <span className="block text-white">Choose Your</span>
                        <span className={hero_title_style}>
                            Adventure
                        </span>
                    </h1>
                    <p className="max-w-xl text-orange-200/70 text-sm md:text-base relative z-10 leading-relaxed">
                        Challenge your focus, logic, and speed. Play immediately in your browser—no downloads, no hassle.
                    </p>
                </section>

                {/*Tab navi */}
                <div className={`${contentSection} mb-10 relative z-10`}>
                    <div className="flex justify-center border-b border-orange-500/20 max-w-md mx-auto">
                        <button
                            onClick={() => handle_section_tap("play")}
                            className={`${tap_btn} ${
                                play_section
                                    ? "border-orange-500 text-orange-400"
                                    : "border-transparent text-orange-200/50 hover:text-orange-200"
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Active Games ({Games_available.length})
                        </button>
                        <button
                            onClick={() => handle_section_tap("coming")}
                            className={`${tap_btn} ${
                                coming_soon_section
                                    ? "border-orange-500 text-orange-400"
                                    : "border-transparent text-orange-200/50 hover:text-orange-200"
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Coming Soon
                        </button>
                    </div>
                </div>

                {/* content*/}
                <div className={contentSection}>
                    {play_section ? (
                        <div className="flex flex-col items-center">
                            {/* Search bar */}
                            <div className="relative w-full max-w-md mb-10 z-10">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-orange-200/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search active games..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={search_ip}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className={clear_search_btn}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/*grid*/}
                            {filteredGames.length > 0 ? (
                                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                                    {filteredGames.map((game) => (
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
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="text-5xl mb-4">🔍</div>
                                    <h3 className="text-xl font-bold text-orange-200">No games found</h3>
                                    <p className="text-orange-200/50 mt-1">Try another query or clear the filter.</p>
                                </div>
                            )}
                        </div>
                    ) : ( /* comming soon */
                        <div className="flex flex-wrap justify-center gap-6 md:gap-8 opacity-75">
                            {comingSoonGames.map((game) => (
                                <div
                                    key={game.id}
                                    className={comming_soon_crd}
                                >
                                    <div className={teaserBadge}>
                                        Teaser
                                    </div>
                                    
                                    <div className="h-52 w-full overflow-hidden relative grayscale">
                                        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent z-10"></div>
                                        <img
                                            src={game.image}
                                            alt={game.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-col grow p-4 relative z-20 -mt-8">
                                        <h3 className="text-xl font-bold text-orange-200/80">
                                            {game.title}
                                        </h3>
                                        <p className="text-xs text-orange-200/40 mt-1 leading-relaxed line-clamp-2">
                                            {game.description}
                                        </p>
                                        
                                        <div className="mt-auto flex items-end justify-between w-full">
                                            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider">
                                                Coming Soon
                                            </span>
                                            <p className="text-[10px] text-orange-200/30">
                                                Stay Tuned
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Play;
