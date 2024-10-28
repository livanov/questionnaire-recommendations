import AppBuilder from './app-builder';

const PORT = process.env.port || 3000;

const app = new AppBuilder().build();

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});