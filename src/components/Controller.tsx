import { Grid, IconButton, Slider, Typography } from "@mui/material";
import {
    handleFileChange,
    handleSeekbarChange,
    handleSeekbarChangeCommitted,
    initializeTone,
    isInitialized,
    loadStatus,
    playPause,
    playStatus,
} from "../controllers/audio";
import { Pause, PlayArrow, UploadFile, VolumeDown } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { PlaybackState } from "tone";

const Controller = () => {
    const [playbackState, setPlaybackState] = useState<[PlaybackState, number, number]>(["stopped", 0, 0]);
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
        const remMin = Math.floor(duration / 60);
        const remSec = Math.floor(duration % 60);
        return `${min}:${sec.toString().padStart(2, "0")} / ${remMin}:${remSec.toString().padStart(2, "0")}`;
    };

    return (
        <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                XY オシロスコープ
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <LoadingButton
                        component="label"
                        variant="outlined"
                        startIcon={<UploadFile />}
                        loading={!loadingState[0]}
                    >
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
                </Grid>

                <Grid item>
                    <IconButton
                        onClick={async () => {
                            if (!isInitialized) await initializeTone();
                            playPause();
                            setPlaybackState([playStatus[0], playStatus[1], playStatus[2]]);
                        }}
                    >
                        {playbackState[0] === "started" ? <Pause /> : <PlayArrow />}
                    </IconButton>
                </Grid>

                <Grid item>
                    <Typography variant="caption">{getTimestamp(playbackState[1], playbackState[2])}</Typography>
                </Grid>

                <Grid item xs>
                    <Slider
                        value={playbackState[1]}
                        min={0}
                        max={playbackState[2]}
                        step={0.1}
                        size="small"
                        onChange={handleSeekbarChange}
                        onChangeCommitted={handleSeekbarChangeCommitted}
                    />
                </Grid>

                <Grid item>
                    <VolumeDown />
                </Grid>

                <Grid item xs>
                    <Slider min={0} max={100} step={1} size="small" valueLabelDisplay="auto" onChange={() => {}} />
                </Grid>
            </Grid>
        </>
    );
};

export default Controller;
