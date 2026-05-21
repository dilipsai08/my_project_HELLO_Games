import React from "react";
function Card(props) {
    return (
        <div className="relative group w-72 h-80 flex flex-col rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-lg hover:shadow-orange-500/20 hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm cursor-pointer">
            {/* Game img */}
            <div className="h-52 w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent z-10"></div>
                <img 
                    src={props.image || props.game_img} 
                    alt={props.title} 
                    className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
            </div>
            
            <div className="flex flex-col grow p-4 relative z-20 -mt-8">
                {/*game title*/}
                <h3 className="text-xl font-bold bg-linear-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent group-hover:translate-x-1 transition-transform duration-300 drop-shadow-sm">
                    {props.title}
                </h3>
                
                <div className="mt-auto flex items-end justify-between w-full">
                    {/* it is the imgae of website logo located at bottom left corener */}
                    <img 
                        src="/images/logo.png" 
                        alt="Hello Games logo" 
                        className="w-10 h-auto drop-shadow-md opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    
                    {/*copy right at bottom right corner*/}
                    <p className="text-[10px] text-orange-200/50 mb-1">
                        Copyright © {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    )
}
export default Card