const express = require('express');
const bcrypt = require('bcryptjs');

const database = require('../connection/database');

const router = express.Router();

router.post('/cadastro', async (request, response) => {
    var { professor_nome, professor_email, professor_senha } = request.body;

    try {
        var hash = await bcrypt.hash(professor_senha, 10);

        var result = await database('professores')
                            .insert({
                                professor_nome: professor_nome,
                                professor_email: professor_email,
                                professor_senha: hash,
                            });

        if (result) {
            return response.json('Cadastro realizado');
        }
    } catch {
        return response.json('Email já registrado!');
    }
});

router.get('/login', async (request, response) => {
    var { professor_email, professor_senha } = request.body;

    try {
        var userEmail = await database('professores')
                            .where('professor_email', professor_email)
                                .first();

        if (userEmail) {
            var result = await bcrypt.compare(professor_senha, userEmail.professor_senha);

            if (result) {
                var userId = await database('professores')
                                    .where('professor_email', professor_email)
                                        .select('professor_id');

                request.session.user = { 
                    id: userId
                };

                return response.json('Login realizado');
            } else {
                return response.json('Email ou senha estão incorretos ou o usuário não está registrado!');
            }
        } else {
            return response.json('Email ou senha estão incorretos ou o usuário não está registrado!');
        }
    } catch {
        return response.json('ERRO INTERNO!!!');
    }
});

router.get('/logout', async (request, response) => {
    request.session.user = undefined;
    return response.json('Logout realizado!');
});

module.exports = router;
