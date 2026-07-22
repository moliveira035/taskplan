# Task Plan

Sistema web para gerenciamento e acompanhamento de tarefas programadas em calendário.

## Arquitetura inicial

- Backend: NestJS com TypeScript
- Banco de dados: PostgreSQL
- ORM: Prisma
- Cache e filas: Redis
- Documentação da API: Swagger / OpenAPI
- Infraestrutura: Docker Compose

## Estrutura

- `backend/`: API REST
- `docs/`: documentação técnica
- `docker/`: arquivos auxiliares de contêineres
- `compose.yaml`: definição dos serviços

## Desenvolvimento

O backend será executado inicialmente em ambiente local e posteriormente em contêiner Docker.

## Status

Fase 1: preparação da infraestrutura e da aplicação base.