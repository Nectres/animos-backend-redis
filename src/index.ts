import { createClient } from "redis";
import express from "express";
import { getYugenId } from "./scraper.js";
import axios from "axios";
import { encodeString } from "./helper.js";
export const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36";

export const client = createClient({
    url: "redis://default:100f7fc99ffb28360d0341bb1b69d107130ae7e42c5b0e58a928c9e150785124@150.230.134.151"
})

const app = express();

const yugenBase = `https://yugen.to/`;

await client.connect();

app.get("/source/:animeId/:epNum", async (req, res) => {
    const { animeId, epNum } = req.params;
    const REDIS_KEY = `source-${animeId}-${epNum}`;
    let data = await client.get(REDIS_KEY);
    if (data) {
        res.send(data);
        return;
    }
    let yugenId = await getYugenId(animeId);
    const result = await axios({
        method: "POST",
        url: `${yugenBase}api/embed/`,
        data: new URLSearchParams({ id: encodeString(`${yugenId}|${epNum}`), ac: '0' }),
        headers: {
            "x-requested-with": "XMLHttpRequest",
            "User-Agent": USER_AGENT
        }
    });
    let source = result.data.hls[0]
    await client.set(REDIS_KEY, source);
    res.send(source)
});

app.listen(5000, () => console.log('started'));