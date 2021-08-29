const express = require('express');

const database = require('../connection/database');

const loginAuth = require('../middlewares/loginAuth');

const router = express.Router();

router.post('/alunos/new', loginAuth, async (request, response) => {
    var { aluno_matricula, aluno_curso, aluno_nome, aluno_email, aluno_contato,
            aluno_linkedin, aluno_github } = request.body;

    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    if (isNaN(aluno_matricula)) {
        return response.json('A matrícula do aluno precisa ser um numeral!');
    }

    if (isNaN(aluno_curso)) {
        return response.json('O ID do curso do aluno precisa ser um numeral!');
    }

    var cursoId = await database('cursos')
                            .where('curso_id', aluno_curso)
                            .andWhere('curso_professor', idString)
                                .first('curso_id');

    if (cursoId != null) {
        var alunoMatricula = await database('alunos')
                                    .where('aluno_matricula', aluno_matricula)
                                    .andWhere('aluno_professor', idString)
                                        .first('aluno_matricula');

        if (alunoMatricula == null) {
            var alunoEmail = await database('alunos')
                                    .where('aluno_email', aluno_email)
                                    .andWhere('aluno_professor', idString)
                                        .first('aluno_email');

            if (alunoEmail == null) {
                var result = await database('alunos')
                                    .insert({
                                        aluno_matricula: aluno_matricula,
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
                return response.json('O email de aluno já está sendo utilizado!');
            }
        } else {
            return response.json('Número de matrícula já está sendo utilizado!');
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
                            .select('*');

    if (alunos) {
        return response.json(alunos);
    } else {
        return response.json('Erro ao listar alunos!');
    }
});

// router.put('/alunos/update/:aluno_id', loginAuth, async (request, response) => {
    
// });

router.delete('/alunos/delete/:aluno_id', loginAuth, async (request, response) => {
    var { aluno_id } = request.params;

    var userId = request.session.user.id;

    var idString = JSON.stringify(userId);

    if (isNaN(aluno_id)) {
        return response.json('O ID da disciplina precisa ser um numeral!');
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

module.exports = router;
