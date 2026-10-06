const Usuario = require("../models/Usuario")
const crypto = require("crypto-js")
const CHAVESECRETA = "Senha"

const login = async (req, res) => {
	const valores = req.body

	if (!valores.email || !valores.senha) return res.status(400).json({ message: "Todos os campos precisam ser preenchidos" })

	try {
		const usuario = await Usuario.findOne({ where: { email: valores.email } })

		if (!usuario) return res.status(404).json({ message: "Usuario não encontrado" })

		const bytes = crypto.AES.decrypt(usuario.senha, CHAVESECRETA)
		const senha = bytes.toString(crypto.enc.Utf8)

		if (valores.senha !== senha) return res.status(401).json({ message: "senha incorreta!" })

		const noventaMin = 90 * 60 * 1000
		const tempoExpira = Date.now() + noventaMin

		const payload = {
			idUsuario: usuario.codUsuario,
			nome: usuario.nome,
			expiraEm: tempoExpira
		}
		const token = crypto.AES.encrypt(JSON.stringify(payload), CHAVESECRETA).toString()

		return res.status(200).json({
			message: "Login realizado com sucesso",
			nome: usuario.nome,
			token: token
		})
	} catch (err) {
		console.error("erro ao realizar o login", err)
		res.status(500).json({ message: "erro ao realizar o login" })
	}
}

module.exports = { login }
