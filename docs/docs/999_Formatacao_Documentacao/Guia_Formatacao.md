---
sidebar_position: 1
slug: /formatacao/guia
title: Guia de Formatação da Documentação
description: Padrões de escrita, fontes, imagens, tabelas e colaboração
---

# Guia de Formatação da Documentação

## Pesquisa e escrita

- Priorize fontes primárias, institucionais e recentes.
- Diferencie fatos, interpretações e hipóteses.
- Explique o significado dos dados; não apresente apenas números.
- Registre premissas, limitações e possíveis vieses.
- Não inclua informações sensíveis, confidenciais ou dados da Atvos.
- Use linguagem objetiva e adequada a uma audiência executiva.

## Citações e referências

Toda fonte deve conter autor ou instituição, título, data ou ano, link e data de acesso. Ao usar um número, indique a fonte junto ao texto ou à tabela.

```markdown
Segundo [Instituição](https://exemplo.com.br) (2026), [síntese da evidência].

Fonte: Instituição (2026). Acesso em: 15/09/2026.
```

## Tabelas

```markdown
<p style={{textAlign: 'center'}}>Tabela 1 — Título descritivo</p>

| Coluna 1 | Coluna 2 | Coluna 3 |
|---|---|---|
| [Dado] | [Dado] | [Dado] |

<p style={{textAlign: 'center'}}>Fonte: Elaborado pelos autores (2026).</p>
```

## Imagens

Salve imagens em `static/img/` com nomes descritivos, em letras minúsculas e sem espaços. De uma página dentro de uma pasta de entregável, use:

```jsx
<p style={{textAlign: 'center'}}>Figura 1 — Título descritivo</p>

<div style={{textAlign: 'center'}}>
  <img
    src={require('../../static/img/nome-da-imagem.png').default}
    style={{width: 800, maxWidth: '100%'}}
    alt="Descrição acessível da imagem"
  />
</div>

<p style={{textAlign: 'center'}}>Fonte: Elaborado pelos autores (2026).</p>
```

## Organização dos arquivos

- Não altere os nomes das pastas sem atualizar links relacionados.
- Evite acentos, espaços e caracteres especiais em nomes de arquivos.
- Numere novas páginas no nome do arquivo e em `sidebar_position`.
- Execute `npm run build` antes de abrir o pull request.

## Colaboração

- Desenvolva cada alteração em uma branch própria.
- Faça commits pequenos e descritivos.
- Abra pull request para revisão antes de integrar à `main`.
- Não envie `node_modules`, `build` ou `.docusaurus` ao repositório.
