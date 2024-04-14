import { Layer, Rect, Shape, Stage } from "react-konva";
import { loadStatus, toneAnalyser, player } from "../controllers/audio";
import { useEffect, useState } from "react";

const Oscilloscope = () => {
    const [waveform, setWaveform] = useState<number[][]>([[0], [0]]);
    useEffect(() => {
        const updateWaveform = () => {
            requestAnimationFrame(updateWaveform);
            if (loadStatus[0]) {
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
                <Rect x={0} y={0} width={500} height={500} fill={"black"} />
            </Layer>
            <Layer>
                <Shape
                    width={500}
                    height={500}
                    sceneFunc={(context, shape) => {
                        const width = shape.width();
                        const height = shape.height();

                        const diagonal = Math.hypot(width, height);

                        const analyserSize = waveform[0].length;

                        for (let i = 1; i <= analyserSize; i++) {
                            const beforeX = waveform[0][i - 1] * (width / 2) + width / 2;
                            const beforeY = waveform[1][i - 1] * -(height / 2) + height / 2;
                            const currentX = waveform[0][i] * (width / 2) + width / 2;
                            const currentY = waveform[1][i] * -(height / 2) + height / 2;

                            const distance = 1 - Math.hypot(currentX - beforeX, currentY - beforeY) / diagonal;

                            const strength = distance ** 50;

                            context.beginPath();

                            context.moveTo(beforeX, beforeY);
                            context.lineTo(currentX, currentY);

                            context.strokeStyle = `rgba(255, 128, 0, ${strength})`;

                            context.stroke();
                        }
                    }}
                />
            </Layer>
        </Stage>
    );
};

export default Oscilloscope;
