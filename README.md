# GGS Creative — Site statique

Site portfolio de Gloire Sidney Goniaga (HTML / CSS / JS, sans framework).

## Structure

```
ggs-creative/
├── index.html              → Accueil
├── a-propos.html           → À propos
├── ggs-photography.html    → GGS. Photography
├── ggs-videography.html    → GGS. Videography
├── ggs-web-design.html     → GGS. Web Design
├── ggs-market.html         → GGS. Market
├── contact.html            → Travaillons ensemble
├── css/
│   └── styles.css          → TOUT le design est ici (couleurs, polices, composants)
├── js/
│   └── main.js             → Menu mobile, animations, filtres
└── assets/                 → (à remplir avec tes images locales)
```

## Travailler dans VS Code

1. Ouvre le dossier `ggs-creative` dans VS Code (`Fichier → Ouvrir le dossier`).
2. Installe l'extension **Live Server**.
3. Clic droit sur `index.html` → **Open with Live Server**. Le site s'ouvre dans le navigateur et se recharge à chaque sauvegarde.

## Personnaliser

- **Couleurs / police** : tout est en haut de `css/styles.css`, dans le bloc `:root`. Change `--accent` pour ton rose exact. Les polices sont Poppins (titres) + DM Sans (corps), chargées depuis Google Fonts dans chaque page.
- **Images** : actuellement, le logo, la photo hero, les avatars et les visuels de projet pointent vers ton site WordPress en ligne (`https://gloiresidneycreative.com/wp-content/...`). Pour un site 100 % autonome, télécharge ces images dans `assets/` et remplace les URLs.
- **Placeholders** : les blocs en dégradé marqués « VOTRE PHOTO / APERÇU / PHOTO 1… » sont à remplacer par tes vraies images.
- **Formulaire de contact** : c'est un visuel. Pour qu'il envoie réellement un email, branche-le sur un service comme Formspree, ou un backend. (Sur du statique pur, pas de PHP.)

## Déployer

### Option A — Netlify (le plus simple, gratuit)
1. Va sur https://app.netlify.com/drop
2. Glisse-dépose le dossier `ggs-creative`.
3. En ligne en quelques secondes avec une URL gratuite. Idéal pour tester sans toucher à ton domaine.

### Option B — GitHub Pages
1. Crée un dépôt GitHub, pousse le contenu du dossier.
2. Settings → Pages → source = branche `main`. Le site est publié.

### Option C — Hostinger (ton domaine actuel)
⚠️ Ton domaine héberge actuellement WordPress. Déployer le site statique ici **remplacera** WordPress.
1. **Sauvegarde d'abord ton WordPress** (hPanel → Sauvegardes).
2. hPanel → Gestionnaire de fichiers → dossier `public_html`.
3. Mets de côté (ou supprime) les fichiers WordPress, puis uploade le contenu de `ggs-creative`.

## Notes

- Toutes les pages sont reliées entre elles via le menu.
- Le design est responsive (mobile + desktop), avec menu hamburger sous 680px.
- Aucune dépendance à installer : ce sont des fichiers statiques.
