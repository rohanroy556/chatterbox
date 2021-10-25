/**
 * Setting application wide constants, which can be loaded from environment or has defaults.
 */
const path = require('path');
const PORT = process.env.PORT || 8080;
const ROOT_DIR = path.join(__dirname + '../../../');
const OUTPUT_PATH = path.join(ROOT_DIR, './dist/chatterbox');
const SESSION_SECRET = process.env.SESSION_SECRET || '$2a$15$nokor35iRkyE6Vfhf6/lyeXacJJvCFTwnHPfuWxtsCiWZhOJaiKHW';
const MONGODB = {
    URL: process.env.MONGODB_URL || 'mongodb+srv://cluster556.v1vyu.mongodb.net/chat',
    USER: process.env.MONGODB_USER || 'chatterbox',
    PASS: process.env.MONGODB_PASS || 'pfKDYVqZczGFk95a'
};
const JWT_SECRET = process.env.JWT_SECRET || 'JxjA9LUsr9gB4GHwEfyJ4UNKqB2DBfRUCHrt2bm7zF2es8faVTm9aBecwhucNhNPT2TNtck8wsSLFUsKfvL58axnnear4gNtuCs2MaBAjHegakhYRVnHR29XwzyyG99St3wWQtAsrxJBfaw4JY33rEQ8M9bTam36FngwnRMwcX6AjsSKfW2aWAEe8zQrLfYWEfNbUrubQtrDs9jCwNetv3ReSNR8cywY27sKKn2ESJ2MWAKvjLvLs5fUgxkWT7dL';

const CONFIG = Object.freeze({
    JWT_SECRET,
    MONGODB,
    OUTPUT_PATH,
    PORT,
    ROOT_DIR,
    SESSION_SECRET
});

module.exports = CONFIG;