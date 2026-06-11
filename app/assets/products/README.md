# Product photography

Drop assets here. They are picked up at build time by `app/lib/product-assets.ts`
via `import.meta.glob`, so adding or replacing a file is a one-step upgrade —
the bottle / gallery / scene backdrops update everywhere the moment the file
appears.

## Naming convention

```
<gender>-<variant>.<png|jpg|jpeg|webp>
```

| variant    | use                                                       |
| ---------- | --------------------------------------------------------- |
| `hero`     | clean studio bottle — gallery main shot, fallback hero    |
| `cutout`   | transparent PNG bottle — preferred for the homepage hero  |
| `rays`     | bottle in dramatic crimson light — gallery + His half     |
| `rock`     | bottle on rock/dark backdrop — Standard panel backdrop    |
| `smoke`    | bottle with smoke / atmosphere — Standard backdrop + Hers |
| `capsules` | macro of pills/pour shot — gallery "texture" slot         |
| `tilt`     | dynamic tilted bottle — gallery extra angle               |

`<gender>` is `male` or `female` (or `duo` if you ship a paired shot).

## Examples

- `male-cutout.png` → ProductVisual on the homepage hero
- `male-hero.jpg` → PDP gallery primary
- `male-rays.jpg` → His side of the homepage split scene
- `female-smoke.jpg` → Hers side of the homepage split scene
- `male-rock.jpg` → backdrop behind "The Standard" panel 1
- `female-smoke.jpg` → backdrop behind "The Standard" panel 3
- `male-capsules.jpg` → PDP gallery detail slot

## Compression

Save PNG cutouts with alpha. JPGs / WebPs at 80–85 quality —
Hydrogen's `<Image>` will reframe these into the right sizes via Shopify CDN.
