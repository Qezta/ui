<div id="top">
    <div align="center">
        <img alt='Animated Qezta torus logo' title='Qezta' height=250 width=250 src='https://qezta.com/qezta.gif' />
        <p>The Qezta torus logo, including its animated version, is a trademark of Qezta.</p>
        <h1 align='center'>ui</h1>
        <strong>Shared Svelte component library and design system for Qezta org sub-products</strong>
    </div>

</div>

---

<div align='center'>
    <a href="https://github.com/Qezta/ui/stargazers">
        <img src="https://img.shields.io/github/stars/Qezta/ui?&style=for-the-badge&logoColor=white&color=purple&logo=starship" alt="stars"/>
    </a>
    <a href="https://github.com/Qezta/ui/">
        <img src="https://img.shields.io/github/repo-size/Qezta/ui?&style=for-the-badge&logoColor=white&color=purple&logo=github" alt="size"/>
    </a>
    <a href="https://github.com/Qezta/ui/blob/main/LICENSE">
        <img src="https://img.shields.io/github/license/Qezta/ui?&style=for-the-badge&logoColor=white&color=purple&logo=unlicense" alt="license"/>
    </a>
    <a href="https://github.com/nixos/nixpkgs">
        <img src="https://img.shields.io/badge/Nixpkgs-unstable-blue.svg?style=for-the-badge&logo=NixOS&logoColor=white&color=purple" alt="nixpkgs"/>
    </a>
    <img src="https://img.shields.io/github/languages/top/Qezta/ui?style=for-the-badge&color=purple" alt="repo-top-language"/>
</div>

---

<div align='center'>
    <a href="https://github.com/Qezta/ui/actions/workflows/flake-check.yml">
        <img src="https://github.com/Qezta/ui/actions/workflows/flake-check.yml/badge.svg" alt="flake-check"/>
    </a>
</div>

---

## Contents

- [Overview](#overview)
- [Consumers](#consumers)
- [Usage](#usage)
- [Peer dependencies](#peer-dependencies)
- [License](#license)

---

## Overview

Shared Svelte component library and design system for Qezta org sub-products
(divit.qezta.com, qezta.com).

Consumed as a git dependency — not published to npm.

## Consumers

```mermaid
flowchart LR
  ui["Qezta/ui<br/>@qezta/ui"] --> divit["Qezta/divit"]
  ui --> site["Qezta/site"]
```

Both sites pin this repository by commit (`github:Qezta/ui#<sha>`) and are
deployed on Vercel from their own repositories, so bump the pin there after
changing a component.

## Usage

In a consumer's `package.json`:

```json
{
  "dependencies": {
    "@qezta/ui": "github:qezta/ui#v0.1.0"
  }
}
```

Pin to a git tag for reproducibility. Available exports:

- `@qezta/ui/components/atoms/*` — `Cursor`, `Image`, `Title`, `Social`, `SourceLink`, `TouchCursor`, `SectionHeader`
- `@qezta/ui/components/molecules/*` — `About`, `Socials`
- `@qezta/ui/components/organisms/*` — `Card`, `Chatbot`, `Metrics`, `Terminal`
- `@qezta/ui/cursor` — `burst`, `scale` Svelte stores
- `@qezta/ui/styles/{global,fonts}.scss`

## Peer dependencies

Consumers must provide `svelte ^3.59.2` and `three ^0.178.0`.

## License

MIT — see [LICENSE](./LICENSE).

<div align="right">

[![][back-to-top]](#top)

</div>

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square&color=purple
