CREATE DATABASE IF NOT EXISTS 11Frai;
USE 11frai;

-- Tabela Login
CREATE TABLE Login (
    Email VARCHAR(100) PRIMARY KEY,
    Senha VARCHAR(100) NOT NULL
);

-- Tabela Cliente
CREATE TABLE Cliente (
    ID_Cliente INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Endereco VARCHAR(255),
    Telefone VARCHAR(20),
    Email VARCHAR(100) UNIQUE,
    FOREIGN KEY (Email) REFERENCES Login(Email)
);

-- Tabela Notificacao
CREATE TABLE Notificacao (
    ID_Notificacao INT AUTO_INCREMENT PRIMARY KEY,
    Tipo VARCHAR(50),
    Mensagem TEXT,
    ID_Cliente INT NOT NULL,
    FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente)
);

-- Tabela Pedido
CREATE TABLE Pedido (
    ID_Pedido INT AUTO_INCREMENT PRIMARY KEY,
    Data_hora_pedido DATETIME NOT NULL,
    Data_hora_entrega DATETIME,
    Status VARCHAR(50),
    ID_Cliente INT NOT NULL,
    FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente)
);

-- Tabela Pagamento
CREATE TABLE Pagamento (
    ID_Pagamento INT AUTO_INCREMENT PRIMARY KEY,
    Valor_Total DECIMAL(10, 2) NOT NULL,
    Status_Pagamento ENUM('Pago', 'Pendente', 'Cancelado') DEFAULT 'Pendente',
    ID_Pedido INT UNIQUE NOT NULL,
    FOREIGN KEY (ID_Pedido) REFERENCES Pedido(ID_Pedido)
);

-- Tabela Produto
CREATE TABLE Produto (
    ID_Produto INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Descricao TEXT,
    Preco DECIMAL(10, 2) NOT NULL
);

-- Tabela Item_Pedido
CREATE TABLE Item_Pedido (
    ID_Item_Pedido INT AUTO_INCREMENT PRIMARY KEY,
    ID_Pedido INT NOT NULL,
    ID_Produto INT NOT NULL,
    Quantidade INT NOT NULL,
    FOREIGN KEY (ID_Pedido) REFERENCES Pedido(ID_Pedido),
    FOREIGN KEY (ID_Produto) REFERENCES Produto(ID_Produto)
);
