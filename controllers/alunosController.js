const express = require('express');

const database = require('../connection/database');

const loginAuth = require('../middlewares/loginAuth');

const router = express.Router();

router.post('/alunos/new', loginAuth, async (request, response) => {
    var { aluno_curso, aluno_nome, aluno_email, aluno_contato,
            aluno_linkedin, aluno_github } = request.body;

    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    if (isNaN(aluno_curso)) {
        return response.json('O ID do curso precisa ser um numeral!');
    }

    var cursoId = await database('cursos')
                            .where('curso_id', aluno_curso)
                            .andWhere('curso_professor', idString)
                                .first('curso_id');

    if (cursoId != null) {
        var result = await database('alunos')
                            .insert({
                                aluno_curso: aluno_curso,
                                aluno_nome: aluno_nome,
                                aluno_email: aluno_email,
                                aluno_contato: aluno_contato,
                                aluno_linkedin: aluno_linkedin,
                                aluno_github: aluno_github,
                                aluno_professor: idString,
                            });
            
        if (result) {
            return response.json('Aluno registrado');
        } else {
            return response.json('Erro ao registrar aluno!');
        }
    } else {
        return response.json('ID do curso não está registrado!');
    }
});

router.get('/alunos', loginAuth, async (request, response) => {
    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    var alunos = await database('alunos')
                        .where('aluno_professor', idString)
                            .select('*')
                                .orderBy('aluno_id', 'desc');

    if (alunos) {
        return response.json(alunos);
    } else {
        return response.json('Erro ao listar alunos!');
    }
});

router.put('/alunos/update/:aluno_id', loginAuth, async (request, response) => {
    var { aluno_id } = request.params;
    var { aluno_curso, aluno_nome, aluno_email, aluno_contato,
            aluno_linkedin, aluno_github } = request.body;

    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);
    
    if (isNaN(aluno_id)) {
        return response.json('O ID do aluno precisa ser um numeral!');
    }

    if (isNaN(aluno_curso)) {
        return response.json('O ID do curso precisa ser um numeral!');
    }
    
    var alunoId = await database('alunos')
                            .where('aluno_id', aluno_id)
                            .andWhere('aluno_professor', idString)
                                .first('aluno_id');

    if (alunoId == null) {
        return response.json('O ID do aluno não existe!');
    }

    var cursoId = await database('cursos')
                            .where('curso_id', aluno_curso)
                            .andWhere('curso_professor', idString)
                                .first('curso_id');

    if (aluno_curso != '') {
        if (cursoId != null) {
            var result = await database('alunos')
                                .where('aluno_id', aluno_id)
                                .andWhere('aluno_professor', idString)
                                    .update({
                                        aluno_curso: aluno_curso,
                                        aluno_nome: aluno_nome,
                                        aluno_email: aluno_email,
                                        aluno_contato: aluno_contato,
                                        aluno_linkedin: aluno_linkedin,
                                        aluno_github: aluno_github,
                                        aluno_professor: idString,
                                    });

            if (result) {
                return response.json('Aluno atualizado');
            } else {
                return response.json('Erro ao atualizar aluno!');
            }
        } else {
            return response.json('ID do curso não está registrado!');
        }
    } else {
        return response.json('Inserir um valor para o ID do curso!');
    }
});

router.delete('/alunos/delete/:aluno_id', loginAuth, async (request, response) => {
    var { aluno_id } = request.params;

    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    if (isNaN(aluno_id)) {
        return response.json('O ID do aluno precisa ser um numeral!');
    }

    var result = await database('alunos')
                        .where('aluno_id', aluno_id)
                        .andWhere('aluno_professor', idString)
                            .delete();

    if (result) {
        return response.json('Aluno deletado');
    } else {
        return response.json('Erro ao deletar aluno!');
    }
});

router.get('/alunos/search', loginAuth, async (request, response) => {
    var { aluno_nome } = request.body;

    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    var alunos = await database('alunos')
                        .where('aluno_nome', 'like', `%${ aluno_nome }%`)
                        .andWhere('aluno_professor', idString)
                            .select('*')
                                .orderBy('aluno_id', 'desc');

    if (alunos) {
        return response.json(alunos);
    } else {
        return response.json('Erro ao listar alunos!');
    }
});

module.exports = router;
