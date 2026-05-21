import db from "../db.js";


export async function registerOAuthUser(email) {
    const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') || 'HELLOOOO';
    let username = baseUsername;
    let attempts = 0;
    
    while (attempts < 10) {
        username = (attempts === 0) ? baseUsername : `${baseUsername}_${attempts}${Math.floor(100 + Math.random() * 1000)}`;
        
        try {

            const checkResult = await db.query('SELECT * FROM users WHERE username = $1', [username]);
            if (checkResult.rows.length > 0) {
                attempts++;
                continue; 
            }
            return username; 
            
        } catch (err) {
            if (err.code === '23505') {
                attempts++;
                continue;
            }
            throw err;
        }
    }
    
    throw new Error("Failed to create a unique username even after multiple attempts");
}