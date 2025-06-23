// Banco de dados simulado
const database = {
    restaurantes: [
        { id: 1, nome: "Burguer Master", categoria: "Lanches", telefone: "11 9999-8888", endereco: "Rua A, 123" },
        { id: 2, nome: "Pizza Prime", categoria: "Pizzas", telefone: "11 9999-7777", endereco: "Rua B, 456" },
        { id: 3, nome: "Sushi Delivery", categoria: "Japonês", telefone: "11 9999-6666", endereco: "Rua C, 789" }
    ],
    pedidos: [
        { id: 1001, restauranteId: 1, cliente: "João Silva", itens: ["X-Burger", "Refri"], total: 25.90, data: "10/06/2025", status: "preparando" },
        { id: 1002, restauranteId: 2, cliente: "Maria Souza", itens: ["Pizza Média"], total: 35.90, data: "11/06/2025", status: "entregue" }
    ],
    clientes: [
        { id: 1, nome: "João Silva", telefone: "11 99999-1111", email: "joao@email.com", endereco: "Rua X, 100" },
        { id: 2, nome: "Maria Souza", telefone: "11 99999-2222", email: "maria@email.com", endereco: "Rua Y, 200" }
    ],
    usuarios: [
        { username: "admin", password: "admin123" }
    ]
};

// Utilitários
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function mostrarAlerta(mensagem, tipo = 'sucesso') {
    const alerta = document.createElement('div');
    alerta.className = `alerta alerta-${tipo}`;
    alerta.textContent = mensagem;
    document.body.appendChild(alerta);
    setTimeout(() => alerta.remove(), 3000);
}

// Controle de Sessão
function verificarAutenticacao() {
    if (!sessionStorage.getItem('usuarioLogado') && !window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
    }
}

function carregarRestauranteAtual() {
    const restaurante = JSON.parse(sessionStorage.getItem('restauranteAtual'));
    if (restaurante) {
        document.querySelectorAll('#restauranteAtual, #restauranteNome').forEach(el => {
            if (el) el.textContent = restaurante.nome;
        });
    }
    return restaurante;
}

// Login e Logout
function configurarLogin() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const restauranteId = parseInt(document.getElementById('restaurante').value);

            const usuarioValido = database.usuarios.some(u => u.username === username && u.password === password);
            const restaurante = database.restaurantes.find(r => r.id === restauranteId);

            if (usuarioValido && restaurante) {
                sessionStorage.setItem('usuarioLogado', 'true');
                sessionStorage.setItem('restauranteAtual', JSON.stringify(restaurante));
                window.location.href = 'principal.html';
            } else {
                mostrarAlerta('Credenciais inválidas ou restaurante não selecionado', 'erro');
            }
        });
    }
}

function configurarLogout() {
    const btnLogout = document.getElementById('logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }
}

// Gerenciamento de Restaurantes
function renderizarRestaurantes() {
    const container = document.querySelector('.restaurante-grid');
    if (container) {
        container.innerHTML = '';
        const restauranteAtual = carregarRestauranteAtual();

        database.restaurantes.forEach(restaurante => {
            const card = document.createElement('div');
            card.className = `restaurante-card ${restauranteAtual?.id === restaurante.id ? 'selected' : ''}`;
            card.innerHTML = `
                <h3>${restaurante.nome}</h3>
                <p>${restaurante.categoria}</p>
                <p>${restaurante.telefone}</p>
                <div class="restaurante-actions">
                    <button class="btn-edit" onclick="abrirModalRestaurante('edit', ${restaurante.id})">Editar</button>
                    <button class="btn-select" onclick="selecionarRestaurante(${restaurante.id})">
                        ${restauranteAtual?.id === restaurante.id ? 'Selecionado' : 'Selecionar'}
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }
}

function selecionarRestaurante(id) {
    const restaurante = database.restaurantes.find(r => r.id === id);
    if (restaurante) {
        sessionStorage.setItem('restauranteAtual', JSON.stringify(restaurante));
        mostrarAlerta(`Restaurante ${restaurante.nome} selecionado!`);
        renderizarRestaurantes();
        carregarRestauranteAtual();
    }
}

// Gerenciamento de Pedidos
function renderizarPedidos() {
    const tbody = document.querySelector('.crud-table tbody');
    if (tbody) {
        tbody.innerHTML = '';
        const restauranteAtual = carregarRestauranteAtual();
        const pedidosRestaurante = database.pedidos.filter(p => p.restauranteId === restauranteAtual?.id);

        if (pedidosRestaurante.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="sem-registros">Nenhum pedido encontrado</td></tr>';
            return;
        }

        pedidosRestaurante.forEach(pedido => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.cliente}</td>
                <td>${pedido.itens.join(', ')}</td>
                <td>${formatarMoeda(pedido.total)}</td>
                <td>${pedido.data}</td>
                <td><span class="status ${pedido.status}">${
                    pedido.status === 'preparando' ? 'Preparando' : 
                    pedido.status === 'entregue' ? 'Entregue' : 'Cancelado'
                }</span></td>
                <td>
                    <button class="btn-edit" onclick="abrirModalPedido('edit', ${pedido.id})">Editar</button>
                    <button class="btn-delete" onclick="confirmarExclusaoPedido(${pedido.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao();
    configurarLogin();
    configurarLogout();
    carregarRestauranteAtual();
    renderizarRestaurantes();
    renderizarPedidos();
});

// Funções globais para chamadas via HTML
window.abrirModalRestaurante = function(acao, id) {
    const modal = document.getElementById('restauranteModal');
    if (modal) {
        modal.style.display = 'block';
        document.getElementById('restauranteModalTitle').textContent = 
            acao === 'add' ? 'Novo Restaurante' : 'Editar Restaurante';
        
        if (acao === 'edit') {
            const restaurante = database.restaurantes.find(r => r.id === id);
            if (restaurante) {
                document.getElementById('restauranteId').value = restaurante.id;
                document.getElementById('restauranteNome').value = restaurante.nome;
                document.getElementById('restauranteCategoria').value = restaurante.categoria;
                document.getElementById('restauranteTelefone').value = restaurante.telefone;
                document.getElementById('restauranteEndereco').value = restaurante.endereco;
            }
        }
    }
};

window.fecharModalRestaurante = function() {
    const modal = document.getElementById('restauranteModal');
    if (modal) modal.style.display = 'none';
};

window.confirmarExclusaoPedido = function(id) {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
        const index = database.pedidos.findIndex(p => p.id === id);
        if (index !== -1) {
            database.pedidos.splice(index, 1);
            mostrarAlerta('Pedido excluído com sucesso!');
            renderizarPedidos();
        }
    }
};

database: {
    usuarios: [
        { username: "admin", password: "admin123" }
    ]
}