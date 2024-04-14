import { Layer, Line, Stage, Text } from "react-konva";
import { loadStatus, toneAnalyser, player } from "../controllers/audio";
import { useEffect, useState } from "react";

const Oscilloscope = () => {
    const [waveform, setWaveform] = useState<number[][]>([[0], [0]]);
    useEffect(() => {
        const updateWaveform = () => {
            requestAnimationFrame(updateWaveform);
            if (loadStatus) {
                if (player?.state === "started") {
                    const analyserValue = toneAnalyser.getValue();
                    if (analyserValue instanceof Float32Array) {
                        // audio.ts でアップミキシングしているためモノラルになることはないだろうが、型は依然 Float32Array の可能性を孕んでいるので念の為書いておく
                        setWaveform([Array.from(analyserValue), Array.from(analyserValue)]);
                    } else {
                        setWaveform(analyserValue.map((floatArray) => Array.from(floatArray)));
                    }
                }
            }
        };
        updateWaveform();
    }, []);

    return (
        <Stage width={500} height={500}>
            <Layer>
                <Line
                    points={waveform.reduce((acc, cur) => acc.concat(cur), []).map((pos) => pos * 250 + 250)}
                    stroke={"orange"}
                    strokeWidth={2}
                    tension={1}
                />
            </Layer>
        </Stage>
    );
};

export default Oscilloscope;
