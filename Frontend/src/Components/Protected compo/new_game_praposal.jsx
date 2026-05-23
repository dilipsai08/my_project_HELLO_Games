import React from "react";
import Header from "../header";
import Footer from "../footer";

const pageShell =
    "min-h-screen flex flex-col bg-linear-to-b from-green-950 via-gray-950 to-black text-orange-100 font-sans";
const wideSection =
    "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
const primaryLink =
    "inline-flex justify-center rounded-full bg-linear-to-r from-orange-500 to-yellow-500 px-8 py-3 font-bold text-white shadow-lg shadow-orange-950/40 hover:-translate-y-1 hover:shadow-orange-500/30 transition-all duration-300";
const secondaryLink =
    "inline-flex justify-center rounded-full border border-orange-400/30 bg-white/5 px-8 py-3 font-bold text-orange-200 hover:bg-orange-500/10 transition-colors duration-300";
const creatorBadge =
    "inline-flex w-fit rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-300";
const infoCard =
    "rounded-2xl border border-green-700/50 bg-green-900/35 p-6";
const glassPanel =
    "rounded-2xl border border-orange-400/20 bg-white/5 p-6";
const emailLink =
    "inline-flex rounded-full bg-linear-to-r from-orange-500 to-yellow-500 px-8 py-3 font-bold text-white hover:-translate-y-1 transition-transform duration-300";

function NewGamePraposal() {
    return (
        <div className={pageShell}>
            <Header />

            <main className="grow">
                <section className={`${wideSection} py-16 md:py-24 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center`}>
                    <div className="space-y-7">
                        <span className={creatorBadge}>
                            Creator Program
                        </span>

                        <div className="space-y-5">
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                                Publish your game on{" "}
                                <span className="bg-linear-to-r from-orange-500 to-yellow-300 bg-clip-text text-transparent">
                                    HELLO Games
                                </span>
                            </h1>
                            <p className="max-w-2xl text-lg md:text-xl text-orange-100/75 leading-relaxed">
                                Share your playable ideas with a growing community of casual players. Submit your game, tell us what makes it fun, and we will review it for quality, performance, and player safety before publishing.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="#submit-game"
                                className={primaryLink}
                            >
                                Submit Your Game
                            </a>
                            <a
                                href="#guidelines"
                                className={secondaryLink}
                            >
                                View Guidelines
                            </a>
                        </div>
                    </div>

                    <div className={`${glassPanel} shadow-2xl shadow-black/30 backdrop-blur`}>
                        <h2 className="text-2xl font-bold text-white mb-4">Why publish here?</h2>
                        <div className="space-y-4 text-orange-100/75">
                            <p>
                                HELLO Games is built for quick, creative, browser-friendly games that players can enjoy instantly.
                            </p>
                            <p>
                                Your game will be featured alongside beloved community favorites such as Dice Duel, Simon Says, Magma Maze, and Reaction Speed.                            </p>
                            <p>
                                We focus on clean gameplay, simple controls, fast loading, and ideas that are easy to understand but fun to replay.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={`${wideSection} py-12 grid md:grid-cols-3 gap-6`}>
                    <article className={infoCard}>
                        <h2 className="text-xl font-bold text-white mb-3">Reach players</h2>
                        <p className="text-orange-100/70">
                            Put your game in front of people who already visit HELLO Games to discover short, fun challenges.
                        </p>
                    </article>

                    <article className={infoCard}>
                        <h2 className="text-xl font-bold text-white mb-3">Show your skills</h2>
                        <p className="text-orange-100/70">
                            Add your name, game description, controls, screenshots, and creator notes so your work feels complete.
                        </p>
                    </article>

                    <article className={infoCard}>
                        <h2 className="text-xl font-bold text-white mb-3">Improve with feedback</h2>
                        <p className="text-orange-100/70">
                            Get review notes on bugs, loading issues, design clarity, and player experience before your game goes live.
                        </p>
                    </article>
                </section>

                <section id="guidelines" className={`${wideSection} py-12 grid lg:grid-cols-2 gap-8`}>
                    <div className={glassPanel}>
                        <h2 className="text-2xl font-bold text-white mb-5">Submission checklist</h2>
                        <ul className="space-y-3 text-orange-100/75">
                            <li>Game title and short description.</li>
                            <li>Playable game files or a working game link.</li>
                            <li>Clear controls and rules for new players.</li>
                            <li>One thumbnail image and optional screenshots.</li>
                            <li>Your creator name and contact email.</li>
                        </ul>
                    </div>

                    <div className={glassPanel}>
                        <h2 className="text-2xl font-bold text-white mb-5">What we look for</h2>
                        <ul className="space-y-3 text-orange-100/75">
                            <li>Fast loading and smooth performance.</li>
                            <li>Simple gameplay that works on desktop browsers.</li>
                            <li>No harmful, copied, or misleading content.</li>
                            <li>Original assets or assets you have permission to use.</li>
                            <li>A polished first impression for players.</li>
                        </ul>
                    </div>
                </section>

                <section id="submit-game" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <div className="rounded-2xl border border-orange-400/25 bg-orange-500/10 p-8 md:p-10">
                        <h2 className="text-3xl font-extrabold text-white mb-4">Ready to share your game?</h2>
                        <p className="text-orange-100/75 mb-8 max-w-2xl mx-auto">
                            Prepare your game details and send your proposal. Include the game link, screenshots, rules, and any notes that help us understand your idea.
                        </p>
                        <a
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=dilipsai045@gmail.com&su=Game%20Submission%20Proposal%20"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={emailLink}
                        >
                            Email Game Proposal
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default NewGamePraposal;
