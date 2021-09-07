const express = require('express');

const database = require('../connection/database');

const loginAuth = require('../middlewares/loginAuth');

const router = express.Router();

router.post('/cursos/new', loginAuth, async (request, response) => {
    var { curso_codigo, curso_nome } = request.body;

    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    if (isNaN(curso_codigo)) {
        return response.json('O código do curso precisa ser um numeral!');
    }

    var cursoCodigo = await database('cursos')
                                .where('curso_codigo', curso_codigo)
                                .andWhere('curso_professor', idString)
                                    .first('curso_codigo');

    if (cursoCodigo == null) {
        var result = await database('cursos')
                            .insert({
                                curso_codigo: curso_codigo,
                                curso_nome: curso_nome,
                                curso_professor: idString,
                            });
    
        if (result) {
            return response.json('Curso registrado');
        } else {
            return response.json('Erro ao registrar curso!');
        }
    } else {
        return response.json('Código do curso já está registrado!');
    }
});

router.get('/cursos', loginAuth, async (request, response) => {
    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    var cursos = await database('cursos')
                        .where('curso_professor', idString)
                            .select('*')
                                .orderBy('curso_id', 'desc');

    if (cursos) {
        return response.json(cursos);
    } else {
        return response.json('Erro ao listar cursos!');
    }
});

// Código do CURSO //
router.put('/cursos/updateCodigo/:curso_id', loginAuth, async (request, response) => {
    var { curso_id } = request.params;
    var { curso_codigo } = request.body;

    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    if (isNaN(curso_id)) {
        return response.json('O ID do curso precisa ser um numeral!');
    } 
    
    if (isNaN(curso_codigo)) {
        return response.json('O código do curso precisa ser um numeral!');
    }

    var cursoId = await database('cursos')
                            .where('curso_id', curso_id)    
                            .andWhere('curso_professor', idString)
                                .first('curso_id');
                                
    if (cursoId == null) {
        return response.json('O ID do curso não existe!');
    }

    var cursoCodigo = await database('cursos')
                                .where('curso_codigo', curso_codigo)
                                .andWhere('curso_professor', idString)
                                    .first('curso_codigo');

    if (curso_codigo != '') {
        if (cursoCodigo == null) {
            var result = await database('cursos')
                                .where('curso_id', curso_id)
                                .andWhere('curso_professor', idString)
                                    .update({
                                        curso_codigo: curso_codigo,
                                    });
            
            if (result) {
                return response.json('Código do curso atualizado');
            } else {
                return response.json('Erro ao atualizar código do curso!');
            } 
        } else {
            return response.json('Código do curso já está registrado!');
        }
    } else {
        return response.json('Inserir um valor para o código do curso!');
    }
});

// Nome do CURSO //
router.put('/cursos/updateNome/:curso_id', loginAuth, async (request, response) => {
    var { curso_id } = request.params;
    var { curso_nome } = request.body;

    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    if (isNaN(curso_id)) {
        return response.json('O ID do curso precisa ser um numeral!');
    } 

    var cursoId = await database('cursos')
                            .where('curso_id', curso_id)    
                            .andWhere('curso_professor', idString)
                                .first('curso_id');

    if (cursoId == null) {
        return response.json('O ID do curso não existe!');
    }

    if (curso_nome != '') {
        var result = await database('cursos')
                            .where('curso_id', curso_id)
                            .andWhere('curso_professor', idString)
                                .update({
                                    curso_nome: curso_nome,
                                });
            
        if (result) {
            return response.json('Nome do curso atualizado');
        } else {
            return response.json('Erro ao atualizar nome do curso!');
        } 
    } else {
        return response.json('Inserir um valor para o nome do curso!');
    }
});

router.delete('/cursos/delete/:curso_id', loginAuth, async (request, response) => {
    var { curso_id } = request.params;

    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    if (isNaN(curso_id)) {
        return response.json('O ID do curso precisa ser um numeral!');
    }

    var cursoId = await database('cursos')
                            .where('curso_id', curso_id)    
                            .andWhere('curso_professor', idString)
                                .first('curso_id');

    if (cursoId == null) {
        return response.json('O ID do curso não existe!');
    }                                

    var result = await database('cursos')
                        .where('curso_id', curso_id)
                        .andWhere('curso_professor', idString)
                            .delete();

    if (result) {
        return response.json('Curso deletado');
    } else {
        return response.json('Erro ao deletar curso!');
    }
});

router.get('/cursos/search', loginAuth, async (request, response) => {
    var { curso_codigo, curso_nome } = request.body;

    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    var cursos = await database('cursos')
                        .where('curso_codigo', 'like', `%${ curso_codigo }%`)
                        .andWhere('curso_nome', 'like', `%${ curso_nome }%`)
                        .where('curso_professor', idString)
                            .select('*')
                                .orderBy('curso_id', 'desc');

    if (cursos) {
        return response.json(cursos);
    } else {
        return response.json('Erro ao listar cursos!');
    }
});

module.exports = router;
