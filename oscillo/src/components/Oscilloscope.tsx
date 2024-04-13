import { Layer, Rect, Stage, Text } from "react-konva";

const Oscilloscope = () => {
    return (
        <Stage width={500} height={500}>
            <Layer>
                <Rect stroke="black" strokeWidth={5} fill="red" x={5} y={5} width={70} height={70} />
                <Text text={"canvas って\n透明にできるんだ"} x={30} y={180} fontSize={40} fill="white"/>
            </Layer>
        </Stage>
    );
};

export default Oscilloscope;
