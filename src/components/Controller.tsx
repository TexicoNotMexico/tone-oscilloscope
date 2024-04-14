import { Button, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { handleFileChange, initializeTone, isInitialized, playPause } from "../controllers/audio";
const Controller = () => {
    return (
        <>
            <Typography variant="h5" fontWeight={"bold"}>
                操作
            </Typography>
            <Button component="label">
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
            </Button>
            <LoadingButton
                onClick={async () => {
                    if (!isInitialized) await initializeTone();
                    playPause();
                }}
            >
                再生
            </LoadingButton>
        </>
    );
};

export default Controller;
