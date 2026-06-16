const URL_BACKEND = "http://localhost:3000/cardapio";
// URL Lambda/API Gateway
const URL_API_GATEWAY = "https://Lambda/API-Gateway.amazonaws.com/prod/pedidos"; 

let carrinho = [];
let total = 0;

// 1. BUSCAR CARDÁPIO DO BACKEND (DOCKER / KUBERNETES)
async function buscarCardapio() {
    try {
        const resposta = await fetch(URL_BACKEND);
        const lanches = await resposta.json();
        
        const container = document.getElementById('cardapio-container');
        container.innerHTML = '';

        lanches.forEach(lanche => {
            container.innerHTML += `
                <div class="lanche-card">
                    <div>
                        <h3>${lanche.nome}</h3>
                        <p>${lanche.descricao}</p>
                        <strong>R$ ${lanche.preco}</strong>
                    </div>
                    <button onclick="adicionarAoCarrinho('${lanche.nome}', ${lanche.preco})">Adicionar</button>
                </div>
            `;
        });
    } catch (erro) {
        document.getElementById('cardapio-container').innerHTML = `<p style="color:red;">Erro ao conectar ao Back-end: ${erro.message}</p>`;
    }
}

// 2. LÓGICA DO CARRINHO LOCAL
function adicionarAoCarrinho(nome, preco) {
    carrinho.push({ nome, preco });
    total += preco;
    
    document.getElementById('itens-carrinho').innerText = carrinho.map(i => i.nome).join(', ');
    document.getElementById('total-pedido').innerText = total.toFixed(2);
    document.getElementById('btn-finalizar').removeAttribute('disabled');
}

// 3. ENVIAR PEDIDO DIRETO PARA A API GATEWAY / LAMBDA / SQS
// async function enviarPedido() {
//     if (carrinho.length === 0) return;

//     const payloadPedido = {
//         id_pedido: Math.floor(Math.random() * 10000),
//         cliente: "Cliente Mesa 04",
//         itens: carrinho,
//         valor_total: total,
//         status: "PENDENTE",
//         timestamp: new Date().toISOString()
//     };

//     try {
//         document.getElementById('btn-finalizar').innerText = "Enviando...";
        
//         const resposta = await fetch(URL_API_GATEWAY, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payloadPedido)
//         });

//         if (resposta.ok || resposta.status === 200 || resposta.status === 201) {
//             alert("Sucesso! Seu pedido foi enviado para a fila SQS e será processado pela cozinha.");
//             // Reseta o carrinho
//             carrinho = [];
//             total = 0;
//             document.getElementById('itens-carrinho').innerText = "Nenhum item selecionado.";
//             document.getElementById('total-pedido').innerText = "0.00";
//             document.getElementById('btn-finalizar').setAttribute('disabled', 'true');
//         } else {
//             alert("A API Gateway respondeu, mas houve um erro no processamento.");
//         }
//     } catch (erro) {
//         // Como a URL da AWS ainda não existe, vai cair aqui no teste local
//         console.error("Erro ao enviar para AWS:", erro);
//         alert(`Pedido simulado com sucesso localmente!\n\nDados que iriam para o SQS/DynamoDB:\n${JSON.stringify(payloadPedido, null, 2)}`);
//     } finally {
//         document.getElementById('btn-finalizar').innerText = "Enviar Pedido para a Fila (SQS)";
//     }
// }

// Inicializa a busca ao abrir a página
buscarCardapio();