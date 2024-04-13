import { Button, Typography } from "@mui/material";
import { handleFileChange, initializeTone, isInitialized, playPause } from "../controllers/audio";

const Controller = () => {
    return (
        <>
            <Typography variant="h5" fontWeight={"bold"}>
                鼓膜を
                <ruby>
                    嫐<rp>(</rp>
                    <rt>なぶ</rt>
                    <rp>)</rp>
                </ruby>
                るウェブアプリ
            </Typography>
            <Typography variant="body1">鼓膜を嫐るウェブアプリ</Typography>
            <br />
            <Typography variant="h5" fontWeight={"bold"}>
                鼓膜を犯すウェブアプリ
            </Typography>
            <Typography variant="body1">
                スーパーカリフラジリスティック
                <br />
                エクスピアリドーシャス
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
            <br />
            <Typography variant="h5" fontWeight={"bold"}>
                鼓膜を
                <ruby>
                    輪姦
                    <rp>(</rp>
                    <rt>まわ</rt>
                    <rp>)</rp>
                </ruby>
                すウェブアプリ
            </Typography>
            <Typography variant="body1">
                タウマタファカタンギハンガコアウ
                <br />
                アウオタマテアトゥリプカカピキマウンガホロヌクポカイフェヌアキタナタフ
            </Typography>
            <Button
                onClick={async () => {
                    if (!isInitialized) await initializeTone();
                    playPause();
                }}
            >
                再生
            </Button>
        </>
    );
};

export default Controller;
