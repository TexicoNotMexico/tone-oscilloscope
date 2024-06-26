import { SyntheticEvent } from "react";
import * as Tone from "tone";

export let isInitialized: boolean = false;

export let loadStatus: [boolean, string] = [true, ""];
export let playStatus: [Tone.PlaybackState, number, number] = ["stopped", 0, 0];
export let player: Tone.Player;

export let toneAnalyser: Tone.Analyser;

export const initializeTone = async () => {
    await Tone.start();

    Tone.Transport.scheduleRepeat(() => {
        playStatus[1] = Tone.Transport.seconds;
    }, 0.05);

    console.info("initialized");

    isInitialized = true;
};

let transportStopper: number;

const setPlayer = async (file: File) => {
    const reader = new FileReader();

    const onLoad = new Promise<ArrayBuffer>((resolve, reject) => {
        reader.onload = () => {
            resolve(reader.result as ArrayBuffer);
        };
        reader.onerror = reject;
    });

    reader.readAsArrayBuffer(file);

    try {
        if (player) player.dispose();
        if (transportStopper) Tone.Transport.clear(transportStopper);

        const audioData = await onLoad;
        const audioBuffer = await Tone.context.decodeAudioData(audioData);
        const toneAudioBuffer = new Tone.ToneAudioBuffer(audioBuffer);

        player = new Tone.Player(toneAudioBuffer);
        playStatus[2] = player.buffer.duration;

        toneAnalyser = new Tone.Analyser({ type: "waveform", size: 512, channels: 2 });
        player.sync().start(0).stop(playStatus[2]).connect(toneAnalyser).toDestination();

        transportStopper = Tone.Transport.schedule(() => {
            console.log("audio ended");
            Tone.Transport.stop();
            playStatus[0] = Tone.Transport.state;
        }, playStatus[2]);

        await Tone.loaded();

        reader.onload = null;
        reader.onerror = null;
    } catch (error) {
        console.error("音声ファイルのデコードに失敗:", error);
        throw error;
    }
};

export const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        console.log("loading...");

        Tone.Transport.stop();
        playStatus[0] = Tone.Transport.state;

        Tone.Transport.seconds = 0;
        playStatus[1] = Tone.Transport.seconds;

        loadStatus = [false, ""];
        setPlayer(file).then(() => {
            loadStatus = [true, file.name];
            console.info(`loaded: ${file.name}`);
        });
    }
};

export const playPause = () => {
    if (loadStatus[0]) {
        if (Tone.Transport.state !== "started") {
            console.info("start");
            Tone.Transport.start();
        } else {
            console.info("pause");
            Tone.Transport.pause();
        }
        playStatus[0] = Tone.Transport.state;
    }
};

export const handleSeekbarChange = (_event: Event, value: number | number[]) => {
    if (loadStatus[0]) {
        if (Tone.Transport.state === "started") Tone.Transport.pause();

        Tone.Transport.seconds = Array.isArray(value) ? value[0] : value;
        playStatus[1] = Tone.Transport.seconds;
    }
};

export const handleSeekbarChangeCommitted = (_event: SyntheticEvent | Event, value: number | number[]) => {
    if (loadStatus[0]) {
        console.info("seeking:", value);

        Tone.Transport.seconds = Array.isArray(value) ? value[0] : value;
        playStatus[1] = Tone.Transport.seconds;

        playStatus[0] === "started" ? Tone.Transport.start() : Tone.Transport.pause();
    }
};

export const handleVolumeChange = (_event: Event, value: number | number[]) => {
    if (loadStatus[0]) {
        if (player) {
            player.volume.value = 20 * Math.log10((Array.isArray(value) ? value[0] : value) / 100);
        }
    }
};
