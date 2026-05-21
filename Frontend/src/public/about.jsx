import React from "react";
import Header from "../Components/header";
import Footer from "../Components/footer";

function About() {
    return (
        <div>
            <Header />
            
            <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px", fontFamily: "system-ui, -apple-system, sans-serif", color: "#333" }}>
                
                {/* Hero Section */}
                <section style={{ textAlign: "center", marginBottom: "60px" }}>
                    <h1 className="group cursor-pointer" style={{ fontSize: "3.5rem", fontWeight: "bold", marginBottom: "20px", color: "#111" }}>
                        About <span className="bg-linear-to-r from-orange-600 to-yellow-400 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-orange-600 transition-all duration-500 tracking-tight">HELLO Games</span>
                    </h1>
                    <p style={{ fontSize: "1.3rem", color: "#666", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" }}>
                        We build browser games. No downloads, no hassle.
                    </p>
                </section>

                {/* Platform Overview */}
                <div style={{ backgroundColor: "#f9f9f9", padding: "40px", borderRadius: "16px", border: "1px solid #eee", marginBottom: "80px", textAlign: "center" }}>
                    <h2 style={{ fontSize: "2rem", marginBottom: "20px", color: "#222" }}>What We Do</h2>
                    <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "#555", maxWidth: "800px", margin: "0 auto" }}>
                        Hello Games is a simple platform for web games. You can play everything directly in your browser. 
                        We offer games that test your reflexes, memory, and logic. 
                        Our goal is to make games that are easy to play and fun to master.
                    </p>
                </div>

                {/* Call to Action */}
                <section style={{ textAlign: "center", borderTop: "2px solid #f0f0f0", paddingTop: "60px", paddingBottom: "40px" }}>
                    <h2 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#111" }}>Join the Arcade</h2>
                    <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "30px", maxWidth: "600px", margin: "0 auto 40px auto", lineHeight: "1.6" }}>
                        Create an account today to track your high scores across all our games, compete with friends, and climb the global leaderboards.
                    </p>
                    <a href="/sign-up" style={{ display: "inline-block", backgroundColor: "#000", color: "white", padding: "15px 40px", borderRadius: "30px", textDecoration: "none", fontSize: "1.1rem", fontWeight: "bold", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>
                        Start Playing Now
                    </a>
                </section>

            </main>

            <Footer />
        </div>
    );
}
export default About;