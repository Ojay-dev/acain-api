import app from './app';

const port = process.env.PORT;
app.listen(port || 4000, () => console.log(`server listening on ${port}`));
