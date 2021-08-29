const express = require('express');

const routes = express.Router();

const professoresController = require('./controllers/professoresController');
const cursosController = require('./controllers/cursosController');
const disciplinasController = require('./controllers/disciplinasController');
const alunosController = require('./controllers/alunosController');

routes.use(professoresController);
routes.use(cursosController);
routes.use(disciplinasController);
routes.use(alunosController);

module.exports = routes;
