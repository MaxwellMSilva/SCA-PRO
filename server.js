const express = require('express');
const session = require('express-session');

const routes = require('./routes');

const app = express();

app.use(session({
    secret: "senhaSecreta",
    maxAge: 100000000000000000000,
}));

app.use(express.json());
app.use(routes);

app.listen(3333);
