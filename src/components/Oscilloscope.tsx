import { Layer, Shape, Stage } from "react-konva";
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
                <Shape
                    width={500}
                    height={500}
                    sceneFunc={(context, shape) => {
                        const width = shape.width();
                        const height = shape.height();

                        context.strokeStyle = "green";
                        context.beginPath();

                        for (let i = 1; i <= waveform[0].length; i++) {
                            context.moveTo(
                                waveform[0][i - 1] * (width / 2) + width / 2,
                                waveform[1][i - 1] * (height / 2) + height / 2
                            );
                            context.lineTo(
                                waveform[0][i] * (width / 2) + width / 2,
                                waveform[1][i] * (height / 2) + height / 2
                            );
                            context.stroke();
                        }
                    }}
                />
            </Layer>
        </Stage>
    );
};

export default Oscilloscope;
