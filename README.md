# 🛡️ Idoso Seguro

Guia educativo e comunitário — em português — para ensinar pessoas idosas a reconhecer e evitar golpes digitais (WhatsApp, Pix, falsa central do banco e prêmios falsos).

## Como rodar

Não há build nem dependências. Basta abrir o `index.html` no navegador, ou subir um servidor estático:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## Funcionalidades

- **Barra de acessibilidade**: aumentar/diminuir/restaurar a fonte (80%–150%) e modo escuro — as preferências ficam salvas no `localStorage`.
- **Abas com 4 golpes**: cada golpe tem sinais de alerta, "regra de ouro", vídeo explicativo e quiz de fixação.
- **Gamificação**: barra de "Nível de Proteção" que avança a cada quiz certo, com opção de refazer.
- **Mito ou Verdade**: cards clicáveis que revelam a resposta.
- **Simulador prático**: conversa de WhatsApp suspeita com escolha entre ação segura e arriscada.
- **Certificado digital**: liberado ao acertar os 4 quizzes, com nome, data e impressão via CSS `@media print`.
- **Modal de emergência** "Caí em um golpe!": passos de reação (banco/MED, B.O., denúncias, senhas). Fecha com `Esc`, clique no fundo ou botão, e mantém o foco dentro do modal.

## Estrutura

| Arquivo | Descrição |
|---|---|
| `index.html` | Página única com todo o conteúdo |
| `style.css` | Estilo com variáveis CSS (tema claro/escuro) e layout responsivo |
| `script.js` | Lógica de abas, quizzes, progresso, certificado, simulador e modal |

## Observações

- O gabarito dos quizzes fica apenas em `script.js` (`RESPOSTAS_QUIZ`), não no HTML.
- O progresso é salvo no `localStorage` com as chaves `idosoSeguro_tamanho`, `idosoSeguro_modoEscuro` e `idosoSeguro_progresso`.
- Os vídeos são iframes do YouTube (fontes: Serasa Ensina, Record Goiás, FDR e g1).
