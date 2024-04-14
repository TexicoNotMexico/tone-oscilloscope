import * as Tone from "tone";

export let isInitialized: boolean = false;

export const initializeTone = async () => {
    await Tone.start();

    console.info("initialized");

    isInitialized = true;
};

export let loadStatus: [boolean, string] = [false, ""];
export let player: Tone.Player;

export let toneAnalyser: Tone.Analyser;

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
        const audioData = await onLoad;
        const audioBuffer = await Tone.context.decodeAudioData(audioData);
        const toneAudioBuffer = new Tone.ToneAudioBuffer(audioBuffer);

        player = new Tone.Player(toneAudioBuffer).toDestination();

        toneAnalyser = new Tone.Analyser({ type: "waveform", size: 1024, channels: 2 });
        player.connect(toneAnalyser);

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
        setPlayer(file).then(() => {
            loadStatus = [true, file.name];
            console.info(`loaded: ${file.name}`);
        });
    }
};

export const playPause = () => {
    if (loadStatus[0]) {
        if (player.state === "stopped") {
            console.info("start");
            player.start("+0");
        } else if (player.state === "started") {
            console.info("pause");
            player.stop("+0");
        }
    }
};
