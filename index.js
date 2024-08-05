
//index.js


import express from 'express';
import { initApp } from './src/initAPP.js';
const app = express();
const port = 3000

initApp(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
