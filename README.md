# @qezta/ui

Shared Svelte component library and design system for Qezta org sub-products
(divit.qezta.com, qezta.com).

Consumed as a git dependency — not published to npm.

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
