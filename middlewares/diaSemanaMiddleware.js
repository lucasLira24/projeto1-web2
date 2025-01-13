exports.diaSemanaMiddleware = (req, res, next) => {
    const dataAtual = new Date();
    const diaAtual = dataAtual.getDay(); // 0 = Domingo, 1 = Segunda-feira, ..., 6 = Sábado

    if (diaAtual === 0 || diaAtual === 6) {
        return res.status(403).json({ message: 'A API está disponível apenas de segunda a sexta-feira' });
    }

    next();
};
