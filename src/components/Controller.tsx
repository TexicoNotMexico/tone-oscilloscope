import { IconButton, Slider, Stack, Typography } from "@mui/material";
import {
    handleFileChange,
    handleSeekbarChange,
    handleSeekbarChangeCommitted,
    handleVolumeChange,
    initializeTone,
    isInitialized,
    loadStatus,
    playPause,
    playStatus,
} from "../controllers/audio";
import { Flare, Pause, PlayArrow, UploadFile, VolumeUp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { PlaybackState } from "tone";

const Controller = (props: { oscilloCallback: (event: Event, value: number | number[]) => void }) => {
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
            <Stack spacing={2} direction="column" alignItems="stretch">
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
                <IconButton
                    disabled={loadStatus[1] === "" ? true : false}
                    onClick={async () => {
                        if (!isInitialized) await initializeTone();
                        playPause();
                        setPlaybackState([playStatus[0], playStatus[1], playStatus[2]]);
                    }}
                >
                    {playbackState[0] === "started" ? <Pause /> : <PlayArrow />}
                </IconButton>

                <Typography variant="body1">{getTimestamp(playbackState[1], playbackState[2])}</Typography>

                <Slider
                    disabled={loadStatus[1] === "" ? true : false}
                    value={playbackState[1]}
                    min={0}
                    max={playbackState[2]}
                    step={0.1}
                    onChange={handleSeekbarChange}
                    onChangeCommitted={handleSeekbarChangeCommitted}
                />
                <Stack spacing={2} direction="row">
                    <VolumeUp />
                    <Slider
                        defaultValue={100}
                        min={0}
                        max={100}
                        step={1}
                        valueLabelDisplay="auto"
                        onChange={handleVolumeChange}
                    />
                </Stack>
                <Stack spacing={2} direction="row">
                    <Flare />
                    <Slider
                        defaultValue={50}
                        min={1}
                        max={70}
                        step={1}
                        valueLabelDisplay="auto"
                        onChange={props.oscilloCallback}
                    />
                </Stack>
            </Stack>
        </>
    );
};

export default Controller;
