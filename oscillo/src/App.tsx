import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, Paper, Stack, Typography, Grid } from "@mui/material";
import Oscilloscope from "./components/Oscilloscope";
import Controller from "./components/Controller";

const theme = createTheme({ palette: { mode: "dark" } });

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="xl" sx={{ p: 6 }}>
                <Stack direction={"column"} alignItems={"center"} spacing={2}>
                    <Typography variant="h2" fontWeight={"bold"}>
                        XY オシロスコープ
                    </Typography>
                    <Grid container direction="row" spacing={2}>
                        <Grid item xs="auto">
                            <Paper elevation={24} sx={{ height: "100%" }}>
                                <Oscilloscope />
                            </Paper>
                        </Grid>
                        <Grid item xs>
                            <Paper variant="outlined" sx={{ height: "100%", p: 2 }}>
                                <Controller />
                            </Paper>
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        </ThemeProvider>
    );
};

export default App;
