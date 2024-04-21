import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Paper, Stack } from "@mui/material";
import Oscilloscope from "./components/Oscilloscope";
import Controller from "./components/Controller";

const theme = createTheme({ palette: { mode: "dark" } });

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container sx={{ p: 6 }}>
                <Stack alignItems="center" spacing={2}>
                    <Paper elevation={24} sx={{ width: "fit-content", overflow: "hidden" }}>
                        <Oscilloscope />
                    </Paper>
                    <Paper variant="outlined" sx={{ width: "100%", p: 2 }}>
                        <Controller />
                    </Paper>
                </Stack>
            </Container>
        </ThemeProvider>
    );
};

export default App;
