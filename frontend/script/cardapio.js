// 1. BUSCAR CARDÁPIO DO BACKEND (DOCKER / KUBERNETES)
async function buscarCardapio() {
    try {
        const resposta = await fetch(window.env.URL_BACKEND);
        const lanches = await resposta.json();
        
        const container = document.getElementById('cardapio-container');
        container.innerHTML = '';

        lanches.forEach(lanche => {
            container.innerHTML += `
                <div class="cardapio-card">
                    <div>
                        <h3>${lanche.nome}</h3>
                        <p>${lanche.descricao}</p>
                        <strong>R$ ${lanche.preco}</strong>
                    </div>

                    <div class="button-group">
                        <button onclick='openRemove(${JSON.stringify(lanche)})'>Remover</button>
                        <button onclick='openEdit(${JSON.stringify(lanche)})'>Editar</button>
                    </div>
                </div>
            `;
        });
    } catch (erro) {
        document.getElementById('cardapio-container').innerHTML = `<p style="color:red;">Erro ao conectar ao Back-end: ${erro.message}</p>`;
    }
}

function openRemove(lanche){
    document.getElementById('modal-remove').style.display = "flex"
    document.getElementById('id').value = lanche.id

    document.getElementById('lanche-nome').innerText = lanche.nome
}

function openEdit(lanche){
    form = document.getElementById('formCreate')

    // form.action = window.env.URL_BACKEND

    document.getElementById('modal-create').style.display = "flex"

    document.getElementById('lanche-title').innerText = "Editar Lanche"
    document.getElementById('create-button').innerText = "Salvar"


    document.getElementById('tipo').value = "edit"
    document.getElementById('id').value = lanche.id
    document.getElementById('nome').value = lanche.nome
    document.getElementById('descricao').value = lanche.descricao
    document.getElementById('preco').value = lanche.preco

}

function openCreate(){
    form = document.getElementById('formCreate')

    // form.action = window.env.URL_BACKEND

    document.getElementById('modal-create').style.display = "flex"

    document.getElementById('lanche-title').innerText = "Novo Lanche"
    document.getElementById('create-button').innerText = "Criar"


    document.getElementById('id').value = 0
    document.getElementById('tipo').value = "create"
    document.getElementById('nome').value = ""
    document.getElementById('descricao').value = ""
    document.getElementById('preco').value = 0
}

async function requestLanche(){
    let id = document.getElementById('id').value
    let tipo = document.getElementById('tipo').value
    let nome = document.getElementById('nome').value
    let descricao = document.getElementById('descricao').value 
    let preco = document.getElementById('preco').value

    const payload = {
        "id" : id,
        "tipo" : tipo,
        "nome" : nome,
        "descricao" : descricao,
        "preco" : preco
    }

    const resposta = await fetch(window.env.URL_BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const retorno = await resposta.json();

    console.log(retorno)

    closeModal('modal-create')
    closeModal('modal-remove')
    buscarCardapio()
}

function closeModal(idmodal){
    modal = document.getElementById(idmodal)

    modal.style = "display: none";
}

buscarCardapio()