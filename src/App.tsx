import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Paper, Stack } from "@mui/material";
import Oscilloscope from "./components/Oscilloscope";
import Controller from "./components/Controller";
import { useState } from "react";

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ff6600",
        },
        secondary: {
            main: "#1b5e20",
        },
    },
});

const App = () => {
    const [strength, setStrength] = useState(50);

    const handleStrengthChange = (_event: Event, value: number | number[]) => {
        setStrength(Array.isArray(value) ? value[0] : value);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container sx={{ p: 6 }}>
                <Stack alignItems="center" spacing={2}>
                    <Paper elevation={24} sx={{ width: "fit-content", overflow: "hidden" }}>
                        <Oscilloscope strength={strength} />
                    </Paper>
                    <Paper variant="outlined" sx={{ width: "100%", p: 2 }}>
                        <Controller oscilloCallback={handleStrengthChange} />
                    </Paper>
                </Stack>
            </Container>
        </ThemeProvider>
    );
};

export default App;
