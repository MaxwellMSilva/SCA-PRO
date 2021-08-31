const express = require('express');

const database = require('../connection/database');

const loginAuth = require('../middlewares/loginAuth');

const router = express.Router();

router.post('/disciplinas/new', loginAuth, async (request, response) => {
    var { disciplina_codigo, disciplina_nome } = request.body;

    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    if (isNaN(disciplina_codigo)) {
        return response.json('O código da disciplina precisa ser um numeral!');
    }

    var disciplinaCodigo = await database('disciplinas')
                                    .where('disciplina_codigo', disciplina_codigo)
                                    .andWhere('disciplina_professor', idString)
                                        .first('disciplina_codigo');

    if (disciplinaCodigo == null) {
        var result = await database('disciplinas')
                            .insert({
                                disciplina_codigo: disciplina_codigo,
                                disciplina_nome: disciplina_nome,
                                disciplina_professor: idString,
                            });
                    
        if (result) {
            return response.json('Disciplina registrada');
        } else {
            return response.json('Erro ao registrar disciplina!');
        }
    } else {
        return response.json('Código da disciplina já está registrado!');
    }
});

router.get('/disciplinas', loginAuth, async (request, response) => {
    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    var disciplinas = await database('disciplinas')
                                .where('disciplina_professor', idString)
                                    .select('*')
                                        .orderBy('disciplina_id', 'desc');

    if (disciplinas) {
        return response.json(disciplinas);
    } else {
        return response.json('Erro ao listar disciplinas!');
    }
});

// router.put('/disciplinas/update/:disciplina_id', loginAuth, async (request, response) => {
//     var { disciplina_id } = request.params;
//     var { disciplina_codigo, disciplina_nome } = request.body;

//     var userId = request.session.user.id;

//     var idString = JSON.stringify(userId);

//     if (isNaN(curso_id)) {
//         return response.json('O ID da disciplina precisa ser um numeral!');
//     } 

//     if (isNaN(disciplina_codigo)) {
//         return response.json('O código da disciplina precisa ser um numeral!');
//     }

//     var result = await database('disciplinas')
//                         .where('disciplina_professor', idString)
//                         .andWhere('disciplina_id', disciplina_id)
//                             .update({
//                                 disciplina_codigo: disciplina_codigo,
//                                 disciplina_nome: disciplina_nome,
//                             });

//     if (result) {
//         return response.json('Disciplina atualizado');
//     } else {
//         return response.json('Erro ao atualizar disciplina!');
//     }
// });

router.delete('/disciplinas/delete/:disciplina_id', loginAuth, async (request, response) => {
    var { disciplina_id } = request.params;

    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    if (isNaN(disciplina_id)) {
        return response.json('O ID da disciplina precisa ser um numeral!');
    }

    var result = await database('disciplinas')
                        .where('disciplina_id', disciplina_id)
                        .andWhere('disciplina_professor', idString)
                            .delete();

    if (result) {
        return response.json('Disciplina atualizada');
    } else {
        return response.json('Erro ao deletar disciplina!');
    }
});

router.get('/disciplinas/search', loginAuth, async (request, response) => {
    var { disciplina_codigo, disciplina_nome } = request.body;

    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    var disciplinas = await database('disciplinas')
                                .where('disciplina_codigo','like', `%${ disciplina_codigo }%`)
                                .andWhere('disciplina_nome','like', `%${ disciplina_nome }%`)
                                .andWhere('disciplina_professor', idString)
                                    .select('*')
                                        .orderBy('disciplina_id', 'desc');

    if (disciplinas) {
        return response.json(disciplinas);
    } else {
        return response.json('Erro ao listar disciplinas!');
    }
});

module.exports = router;
