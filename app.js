import express from 'express';
// import tokenRoute from './app/router/token.js';
// import protectedRoute from './app/router/protected.js';

const app = express();
app.use(express.json());
app.get('/', async (req, res) => {
    res.json({message: 'Ok'});
});
// app.use(tokenRoute);
// app.use(protectedRoute);

export default app;