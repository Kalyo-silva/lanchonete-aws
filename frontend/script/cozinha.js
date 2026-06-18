async function loadPedidos(){
    try{
        const container = document.getElementById('pedidos-container');
        container.innerHTML = '';

        const resposta = await fetch(window.env.URL_API_GATEWAY);

        const pedidos = await resposta.json();

        pedidos.forEach(pedido => {
            let div = document.createElement('div')
            div.className = "pedido-card"
        
            let h3 = document.createElement('h3')
            h3.innerText = "Cliente: "+pedido.cliente

            let sub = document.createElement('sub')
            sub.innerText = `#${pedido.pedido_id}`

            let ul = document.createElement('ul')

            let strong = document.createElement('strong')
            strong.innerText = `R$ ${pedido.valor_total}` 
            
            let h4 = document.createElement('h4')
            h4.innerHTML = `Status: <strong>${pedido.status}</strong>` 

            let button = document.createElement('button')
            button.addEventListener("click", function() {entregaPedido(pedido.pedido_id)})
            button.innerText = "Entregue!"

            container.appendChild(div)
            div.appendChild(h3)
            div.appendChild(sub)
            div.appendChild(ul)
            div.appendChild(strong)
            div.appendChild(h4)
            div.append(button)

            pedido.itens.forEach(item => {
                let li = document.createElement('li')
                li.innerText = item.nome + " | R$ " + item.preco

                ul.appendChild(li)
            })
        });
    } catch (erro) {
        document.getElementById('cardapio-container').innerHTML = `<p style="color:red;">Erro ao conectar ao Back-end: ${erro.message}</p>`;
    } 
} 

async function entregaPedido(id) {
    try {
        const resposta = await fetch(window.env.URL_API_GATEWAY,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pedido_id: id,
                    status: "CONCLUIDO"
                })
            }
        );

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        console.log('Pedido atualizado:', dados);

        loadPedidos()

        return dados;

    } catch (erro) {
        console.error('Erro ao atualizar pedido:', erro);
    }
}

loadPedidos()