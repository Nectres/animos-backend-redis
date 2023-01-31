import axios from "axios";
import { client } from "./index.js";

export function getAnimeInfo(malId) {
    return axios.get(`https://raw.githubusercontent.com/MALSync/MAL-Sync-Backup/master/data/myanimelist/anime/${malId}.json`)
}

export async function getYugenId(malId) {
    const REDIS_KEY = `anime-yugen-${malId}`; 
    let data = await client.get(REDIS_KEY);
    if (data) {
        return data;
    }
    let resp = await axios.get("https://api.malsync.moe/mal/anime/" + malId);
    let id = Object.keys(resp.data.Sites.YugenAnime)[0]
    await client.set(REDIS_KEY, id);
    return id;
}