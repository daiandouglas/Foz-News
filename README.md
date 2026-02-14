# Planejamento do Projeto: Foz-News (Sul News AI Editor)

Este documento serve como guia central para o desenvolvimento, arquitetura e roteiro de implementação do projeto **Foz-News**.

## 1. Visão Geral
O **Foz-News** é um painel editorial inteligente focado em notícias locais e regionais. Ele utiliza Inteligência Artificial Generativa para automatizar a prospecção de pautas, redação de artigos e geração de imagens jornalísticas, oferecendo um fluxo de trabalho (workflow) completo desde o rascunho até a publicação.

## 2. Arquitetura e Tecnologias

### Frontend
*   **Framework:** React (via Vite)
*   **Linguagem:** TypeScript
*   **Estilização:** Tailwind CSS
*   **Gerenciamento de Estado:** React Hooks (useState, useContext, useReducer)
*   **Ícones:** Heroicons (SVG inline)

### Backend & Infraestrutura
*   **Hospedagem:** Vercel (Recomendado)
*   **API Layer:** Vercel Serverless Functions (Node.js)
*   **Segurança:** Variáveis de ambiente para proteção de chaves de API.

### Inteligência Artificial (Google Gemini)
*   **Modelo de Texto:** `gemini-2.5-flash` (Rápido e eficiente para redação e resumos).
*   **Modelo de Imagem:** `imagen-4.0-generate-001` (Geração de imagens fotorrealistas).
*   **Prospecção:** Google Search Grounding (via Gemini API) para dados em tempo real.

## 3. Funcionalidades Principais

1.  **Autenticação:** Login simples (simulado/mock) para editores e administradores.
2.  **Painel de Controle (Dashboard):**
    *   Configuração de palavras-chave para busca.
    *   Definição de tom (Neutro, Sério, Sensacionalista) e tamanho do texto.
    *   Filtros de visualização.
3.  **Prospecção Automática:** Busca de tendências na web e geração de rascunhos em lote.
4.  **Workflow Kanban:**
    *   Colunas: Novos Rascunhos -> Em Revisão -> Aprovadas -> Publicadas.
    *   Drag-and-drop (futuro) ou botões de ação para mover cards.
5.  **Editor/Revisor (Modal):**
    *   Edição de Título e Conteúdo.
    *   Visualização de Fontes (Links).
    *   **Geração/Regeneração de Imagens:** Com suporte a prompts customizados pelo usuário.
6.  **Publicação:** Simulação de deploy para repositório GitHub.

## 4. Roteiro de Desenvolvimento (Roadmap)

### ✅ Fase 1: Prototipagem e Estrutura (Concluído)
- [x] Configuração do ambiente Vite + Tailwind.
- [x] Criação da estrutura de componentes (Header, Kanban, Cards).
- [x] Implementação da lógica de Mock para testes visuais.
- [x] Integração inicial com Gemini (Client-side).

### ✅ Fase 2: Funcionalidades Core (Concluído)
- [x] Integração real com API Gemini para Texto.
- [x] Integração real com API Imagen para Imagens.
- [x] Sistema de Prospecção com Google Search Grounding.
- [x] Modal de Revisão funcional.
- [x] Autenticação básica (Context API).

### 🔄 Fase 3: Refinamento e Performance (Em Andamento)
- [x] Otimização de performance (Promise.all para geração paralela).
- [x] Separação de geração de texto e imagem (evitar timeouts).
- [x] Edição manual de prompts de imagem no Modal de Revisão.
- [ ] Implementação de Drag-and-Drop no Kanban.
- [ ] Melhoria no tratamento de erros de API.

### 🚀 Fase 4: Segurança e Deploy (A Fazer)
- [ ] Migração das chamadas de API para Serverless Functions (`/api` folder).
- [ ] Configuração de variáveis de ambiente na Vercel.
- [ ] Deploy oficial na Vercel.
- [ ] Integração real com GitHub API para "Publicar" (Commitar markdown no repo).

### 🔮 Fase 5: Futuro (Backlog)
- [ ] Banco de dados real (Firebase ou Supabase) para persistir notícias.
- [ ] Múltiplos usuários com permissões reais.
- [ ] Agendamento de publicações.
- [ ] Geração de posts para redes sociais a partir da notícia.

---
*Documento gerado em: 23/05/2024*
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1OHxRlnYZYvXxCHbVdrxX8hpELoKglof9

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
