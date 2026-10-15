let resposta = document.getElementById('resposta')
let btn_logar = document.getElementById('btn_logar')

btn_logar.addEventListener('click', (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, senha: senha })
    })
    .then(res => res.json().then(dados => ({ ok: res.ok, dados })))
    .then(({ ok, dados }) => {
        if (!ok) {
            resposta.innerHTML = `<p>${dados.message}</p>`
            return
        }
        localStorage.setItem('token', dados.token)
        localStorage.setItem('nomeUsuario', dados.nome)
        window.location.href = '../index.html'
    })
    .catch((err) => {
        console.error('Erro ao realizar o login', err)
        resposta.innerHTML = '<p>Erro ao tentar realizar o login.</p>'
    })
})
