// Controle de sessão no frontend (token guardado no localStorage)
const PAGINAS_PUBLICAS = ['index.html', 'logar.html', 'usuario_cadastrar.html', '']

const pagina = window.location.pathname.split('/').pop()
const dentroDeHtml = window.location.pathname.includes('/html/')
const urlLogin = dentroDeHtml ? './logar.html' : './html/logar.html'

// Faz o fetch já enviando o token no cabeçalho Authorization.
// Se a sessão expirou (ou não existe), limpa o token e manda para o login.
async function authFetch(url, opcoes = {}) {
    const token = localStorage.getItem('token')
    const headers = { ...(opcoes.headers || {}) }
    if (token) headers['Authorization'] = token

    const res = await fetch(url, { ...opcoes, headers })

    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token')
        localStorage.removeItem('nomeUsuario')
        alert('Sessão expirada ou acesso negado. Faça o login novamente.')
        window.location.href = urlLogin
        throw new Error('Não autorizado')
    }
    return res
}

// Páginas privadas só abrem com token
if (!PAGINAS_PUBLICAS.includes(pagina) && !localStorage.getItem('token')) {
    window.location.href = urlLogin
}

// Mostra "Olá, nome | Sair" ou "Login" no menu
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav')
    if (!nav) return

    const token = localStorage.getItem('token')
    const nome = localStorage.getItem('nomeUsuario')
    const area = document.createElement('div')
    area.style.marginTop = '10px'

    if (token) {
        area.innerHTML = `Olá, <b>${nome || ''}</b>&emsp;<a href="#" id="btn_logout">Sair</a>`
        nav.prepend(area)
        document.getElementById('btn_logout').addEventListener('click', (e) => {
            e.preventDefault()
            localStorage.removeItem('token')
            localStorage.removeItem('nomeUsuario')
            window.location.href = urlLogin
        })
    } else if (pagina !== 'logar.html') {
        area.innerHTML = `<a href="${urlLogin}">Login</a>`
        nav.prepend(area)
    }
})
