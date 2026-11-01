# GGS Creative — Site portfolio

Site de Gloire Sidney Goniaga, directeur créatif & artistique à Bruxelles :
https://gloiresidneycreative.com

HTML / CSS / JS pur, bilingue FR (racine) + EN (`en/`), servi par un petit serveur Node
sans dépendance.

## Lancer en local

```bash
node server.js
```

Puis ouvrir http://localhost:3000.

## Mettre en ligne

Le site est relié à Hostinger : un push sur la branche `main` le met en ligne en moins
d'une minute. Travailler sur une branche et ne fusionner dans `main` qu'une fois la
modification vérifiée.

## Où modifier quoi

- Design (couleurs, polices, composants) : `css/styles-vN.css`
- Comportements (menu, galeries, vidéos, formulaires) : `js/main-vN.js`
- Contenu : les pages `.html` à la racine (FR) et dans `en/` (EN)

Le détail des conventions est dans `CLAUDE.md`.
