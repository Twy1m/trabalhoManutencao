const crypto = require("crypto-js")
const { DATE } = require("sequelize")
const CHAVESECRETA = "Senha"

function authMiddleware(req, res, next) {
	const token = req.headers["authorization"]

	if (!token) return res.status(401).json({ message: "Acesso negado! Faça o login!" })

	try {
		let bytes = crypto.AES.decrypt(token, CHAVESECRETA)
		let dadosDescriptografados = bytes.toString(crypto.enc.Utf8)

		if (!dadosDescriptografados) return res.status(403).json({ message: "Acesso Proibido!" })

		const payload = JSON.parse(dadosDescriptografados)

		if (DATE.now() > payload.ExpiraEm) return res.status(401).json({ message: "sessão expirada! faça login novamente" })

		req.usuario = payload

		next()
	} catch (err) {
		console.error("falha na autenticação", err)
		res.status(500).json({ message: "erroa ao autenticar" })
	}
}

module.exports = authMiddleware
