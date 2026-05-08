# Site de Dia das Mães

Site interativo feito especialmente para a Mamãe querida, com fotos, música,
dedicatórias, carta e uma brincadeira interativa.

## Como abrir no VS Code

1. Abra esta pasta no VS Code:

   ```text
   C:\Users\isaca\Documents\Codex\2026-05-08\me-ajude-a-fazer-um-site
   ```

2. Abra o terminal do VS Code.

3. Rode:

   ```powershell
   node server.mjs
   ```

4. Abra no navegador:

   ```text
   http://127.0.0.1:4173
   ```

## Fotos

As fotos ficam em:

```text
assets/fotos
```

O site já usa:

```text
foto-1.jpg
foto-2.jpg
foto-3.jpg
```

## Música

O player está configurado para procurar:

```text
assets/musica/nao-quero-dinheiro.mp3
```

Importante: se for publicar o site no GitHub Pages, use apenas músicas que você
tem autorização para publicar.

## Arquivos principais

```text
index.html
styles.css
script.js
server.mjs
assets/
```

## GitHub Pages

Depois de subir o projeto para o GitHub:

1. Abra o repositório no GitHub.
2. Vá em **Settings**.
3. Clique em **Pages**.
4. Em **Branch**, escolha `main`.
5. Em **Folder**, escolha `/root`.
6. Salve.

O GitHub vai gerar um link público para o site.
