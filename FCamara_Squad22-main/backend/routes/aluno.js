const express = require('express');
const alunoRouter = express.Router();
const Aluno = require('../models/aluno');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {alunoSchema} = require('../utils/schemasValidation');
const fileUpload = require('../middleware/fileUpload');

const estados = ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RO", "RS", "RR", "SC", "SE", "SP", "TO" ];

const fields = [
    {name: 'aluno[matricula]', maxCount: 1},
    {name: 'aluno[rg]', maxCount: 1}
];

const validateAluno = (req, res, next) => {
    const { error } = alunoSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

alunoRouter.get('/registrar', (req, res) => {
    res.render('registrar-aluno', {estados});
});

alunoRouter.post('/registrar', [validateAluno, fileUpload.fields(fields)], catchAsync(async (req, res) => {
    const aluno = (req.body.aluno);
    const criarAluno = new Aluno(aluno);
    const registrarAluno = await Aluno.register(criarAluno, aluno.password);
    res.redirect('/login');
}));

alunoRouter.get('/doacao/obrigado', (req, res) => {
    res.render('thanks');
});

module.exports = alunoRouter;



