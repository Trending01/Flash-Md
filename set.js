const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;
module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT1BDYmJVSXRwVVArSUw5b0s3U1VOMVY1dkFyWS80ZE9BWGdkZkFJOGdGRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUzV2SjM5NC9xa1pmS1RLellwcmlwczJOWm5LbXRNcHZleVl1Q2hYaEZqaz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJNRXhzcHZQbXMraWRyV2pQUWNsQ0dPclRXY0lVMWEyem8yd01PWHpVMEVNPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJUYXpnMHZtbFAwZ0RvcG04L0hOMmkzMnBJb2VmNkZuL3liZUpoUlJISGg0PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNIMXhjNjZBOSttYWNvUGdnOGcvdDNiU0lxNTdsUkZscXJzRE9xQ3h5MkU9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ii90YWtWZEpNWTRncFU4YzZBN0tocWhSMm9GMkRReXozRlpCTzh5ay81ajg9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZUh5SFlFZjExZmZ1a3AzQUVUQ2gzVG93RlY5bVNOMjdsT1RwV1dFWTNIZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicmFrYytnczZlNnh3UkZDYnUxSzArdDNWZWNuaHRHMTFycG1qWEpVdDFDbz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InVnNjV6YlNkU0pzMVpiOExiTHQzc3lvNmRwOWRGQ01ZSnZMWGordHFocFZLUVR0bk1US0ZHOTlDZFRPQ2JQMXBmK0oyQ2lWUURWNkxpWnFSa0UxVURBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NTksImFkdlNlY3JldEtleSI6IlNzZEZkdFJPVGxLd1ArRGx3SFhBZXZDRm9GOFRxUkV5bXdLZHpNUzhEdUE9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IlR4MkpDc1llVEt1QmVRNU04X0NHbnciLCJwaG9uZUlkIjoiZThkZWY2NWMtYTYwNS00OGY3LTlhNTEtZWI5NDRjZjhjYTFmIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlVyVHc0ZHNTTzZZMU44Z1g0aU1MTVlMTkxTTT0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIyQVYxUWJQTktQaHpnYi94R1ZDOG5VTkQyRTA9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiMVpWNkhQN0siLCJtZSI6eyJpZCI6IjIzMzU1NzU2MDkxMTo2MEBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTkRpa004TEVLNjU5YmdHR0EwZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiYUJPajdISHJJalNZOWRTVU1sZ212QkVraHQ3U3BrQitENU5mSHFTL1BrMD0iLCJhY2NvdW50U2lnbmF0dXJlIjoid1dGNW9QWTNOZzZIK0htQVluYzY5a3hsWkZ5M2NNd1ZkOTJOV0NjRlBtZ0dJb1Zzc3pLT0UyM2E3SkR6b3VWbk9LRkZ6d3J5Q21vMWRnVFRsY3I5QUE9PSIsImRldmljZVNpZ25hdHVyZSI6IlpFaThodkhXWm1rN1Yrd3VsUE95bHF3WVU5aVFlL1FOUGhBS0JmUm1tRllLWForQ2tqSVFpQzBaQTEyOVVTbjNieXNKMVBSekVSRzF6NGhSSG0vZkFBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjMzNTU3NTYwOTExOjYwQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQldnVG8reHg2eUkwbVBYVWxESllKcndSSkliZTBxWkFmZytUWHg2a3Z6NU4ifX1dLCJwbGF0Zm9ybSI6ImlwaG9uZSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyOTk3NzUzMCwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFNMnAifQ==',
    PREFIXES: (process.env.PREFIX || '').split('.').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "Trending Boss",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "23557560911",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'on',
    A_REACT: process.env.AUTO_REACTION || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.BOT_MENU_LINKS || 'https://static.animecorner.me/2023/08/op2.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || 'online',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Asia/Dubai',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech"
        : "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech",
    /* new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
    })
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    }), */
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
