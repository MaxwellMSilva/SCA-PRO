function loginAuth(request, response, next) {
    if (request.session.user != undefined) {
        next();
    } else {
        response.status(401).json('Nenhum usuário logado');
    }
};

module.exports = loginAuth;
