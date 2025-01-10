const jwt = require('jsonwebtoken');

exports.autenticacaoMiddleware = (req, res, next) => {
    const autorizacao = req.headers['authorization'];

    if (!autorizacao) {
        return res.status(401).json({ message: 'Sem token, autorização negada' });
    }
    const token = autorizacao.replace("Bearer ", "");
    try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodificado);
        
        req.usuario = decodificado;
        console.log(decodificado);
        
        next();
    } catch (erro) {
        res.status(401).json({ message: 'Token não é válido' });
    }
};

