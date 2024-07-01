# Todo App with DynamoDB and Clean Architecture


## Overview
Este projeto é um aplicativo de lista de tarefas (Todo App) que utiliza o banco de dados NoSQL DynamoDB da AWS e segue os princípios da Clean Architecture. Ele está sendo desenvolvido para proporcionar uma estrutura escalável e de fácil manutenção, utilizando as melhores práticas de desenvolvimento de software.

## Funcionalidades Principais
- Cadastro, edição e exclusão de tarefas.
- Marcação de tarefas como concluídas.
- Visualização detalhada e filtragem de tarefas.

## Tecnologias Utilizadas
- **AWS DynamoDB**: Banco de dados NoSQL utilizado para armazenamento das tarefas.
- **Clean Architecture**: Arquitetura que promove a separação de responsabilidades e facilita a manutenção e evolução do código.
- **Next.js**: Plataforma de execução de código JavaScript.

## Instalação e Uso
Para instalar e executar o projeto localmente, siga os passos abaixo:

1. Clone este repositório.
2. Instale as dependências usando `yarn`.
3. Configure suas credenciais da AWS no arquivo `.env`.
3. Configure suas credenciais do JWT_SECRET_KEY no arquivo `.env`.
4. Execute o projeto localmente com `yarn dev`.

## Ambiente de Produção
O projeto está hospedado em https://to-do-aws-clean-arch.vercel.app/. Você pode acessar e testar o aplicativo em produção.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue para reportar bugs ou sugerir melhorias. Se desejar contribuir com código, por favor, siga os padrões de estilo e estrutura já existentes no projeto.

## Estado do Projeto
Este projeto está em andamento. Futuramente, está previsto um processo de refatoramento para melhorar a estrutura do código, aumentar a cobertura de testes e otimizar o desempenho.
