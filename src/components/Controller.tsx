import { IconButton, Slider, Typography } from "@mui/material";
import {
    handleFileChange,
    initializeTone,
    isInitialized,
    loadStatus,
    playPause,
    playStatus,
} from "../controllers/audio";
import { Pause, PlayArrow, UploadFile } from "@mui/icons-material";
import * as Tone from "tone";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";

const Controller = () => {
    const [playbackState, setPlaybackState] = useState<[Tone.PlaybackState, number, number]>(["stopped", 0, 0]);
    const [loadingState, setLoadingState] = useState<[boolean, string]>([true, ""]);

    useEffect(() => {
        const sliderInterval = setInterval(() => {
            setLoadingState(loadStatus);
            setPlaybackState([playStatus[0], playStatus[1], playStatus[2]]);
        }, 50);
        return () => {
            clearInterval(sliderInterval);
        };
    }, []);

    const getTimestamp = (seconds: number, duration: number) => {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        const remMin = Math.ceil((duration - seconds) / 60);
        const remSec = Math.ceil((duration - seconds) % 60);
        return `${min}:${sec.toString().padStart(2, "0")} / ${remMin}:${remSec.toString().padStart(2, "0")}`;
    };

    return (
        <>
            <Typography variant="h5" fontWeight={"bold"} gutterBottom>
                操作
            </Typography>
            <LoadingButton component="label" variant="outlined" startIcon={<UploadFile />} loading={!loadingState[0]}>
                読込
                <input
                    type="file"
                    accept=".wav, .mp3"
                    onChange={async (e) => {
                        if (!isInitialized) await initializeTone();
                        handleFileChange(e);
                    }}
                    hidden
                />
            </LoadingButton>
            <br />
            <IconButton
                onClick={async () => {
                    if (!isInitialized) await initializeTone();
                    playPause();
                    setPlaybackState([playStatus[0], playStatus[1], playStatus[2]]);
                }}
            >
                {playbackState[0] === "started" ? <Pause /> : <PlayArrow />}
            </IconButton>
            <br />
            <Typography variant="caption">{getTimestamp(playbackState[1], playbackState[2])}</Typography>
            <Slider value={playbackState[1]} min={0} max={playbackState[2]} />
        </>
    );
};

export default Controller;
