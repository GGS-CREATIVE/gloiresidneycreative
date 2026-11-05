# CLAUDE.md — GGS Creative

Contexte projet pour Claude Code. Lis ce fichier avant toute modification.

## Le projet

Site portfolio de Gloire Sidney Goniaga, directeur créatif & artistique basé à Bruxelles
(branding, web, photo, vidéo, mariage) : https://gloiresidneycreative.com

- HTML / CSS / JS pur, **aucun framework, aucun build, aucune dépendance**.
- Bilingue : chaque page FR à la racine a son double EN dans `en/` (mêmes noms de fichiers).
- Servi en production par `server.js` (Node, zéro dépendance) sur Hostinger.

## Lancer en local

```bash
node server.js        # http://localhost:3000 (URLs propres, vraie page 404)
```

## Mise en ligne

**Un push sur `main` met le site en ligne tout seul en ~30-40 s** (Hostinger lance `npm start`).

- Travailler sur une branche, vérifier, puis fusionner dans `main` et pousser **seulement
  avec l'accord explicite de Gloire**.
- Après le push, vérifier sur le site en ligne que les nouveaux fichiers répondent.
- `.htaccess` est un reste d'une ancienne config Apache : **il n'est pas utilisé**
  (c'est `server.js` qui gère redirections, cache et 404).

## Structure

```
.
├── index.html              # Accueil
├── a-propos.html           # À propos
├── ggs-photography.html    # Service photo (galerie + lightbox)
├── ggs-videography.html    # Service vidéo (films YouTube au clic)
├── ggs-mariage.html        # Mariage photo + vidéo (formules, FAQ, JSON-LD)
├── ggs-web-design.html     # Service web (projets + étude de cas BatiConception)
├── ggs-market.html         # Market : pop-up « bientôt » plein écran, page non navigable
├── contact.html            # Formulaire Formspree (AJAX, repli POST sans JS)
├── mentions-legales.html
├── 404.html                # <base href="/"> pour marcher à n'importe quelle profondeur
├── en/                     # Versions anglaises (même structure, chemins en ../)
├── css/styles-vN.css       # SOURCE UNIQUE du design (version N dans le nom)
├── js/main-vN.js           # Tous les comportements (version N dans le nom)
├── assets/                 # Images WebP ; thumbs/ (grilles) et large/ (lightbox)
│   └── fonts/              # Poppins + DM Sans auto-hébergées (woff2)
├── scripts/to-webp.py      # Conversion auto en WebP (hook Claude Code local)
├── sitemap.xml / robots.txt
└── server.js               # Serveur statique de production
```

## Conventions (à respecter impérativement)

- **Un seul CSS, un seul JS.** Pas de `<style>` ni de `<script>` inline, pas de fichier par page.
- **Versionner à chaque modification** : renommer `styles-vN.css` → `styles-vN+1.css` (idem
  `main-vN.js`) avec `git mv`, puis mettre à jour **toutes** les références FR + EN.
- **Tokens** : couleurs, rayons, largeurs dans `:root` en haut du CSS. Pas de couleur en dur.
  Accent magenta `--accent:#ff0a8c` (couleur officielle de la marque).
- **FR + EN toujours ensemble** : toute modif de contenu ou de structure se fait sur les deux.
  Pages FR : chemins `assets/…` ; pages EN : `../assets/…`.
- **Liens internes** relatifs en `.html` (le serveur redirige vers l'URL propre).
- **Ton** : tutoiement partout. Les slogans de clients cités entre guillemets gardent leur
  propre formulation.
- **Polices** : Poppins (titres) + DM Sans (corps), servies depuis `assets/fonts/`.
  **Jamais** de Google Fonts (RGPD).
- **Images** : WebP. `loading="lazy" decoding="async"` sur tout ce qui est sous l'écran ;
  jamais sur l'image du haut de page.
- **Animations** : classes `reveal`, `reveal-l`, `reveal-r`, `reveal-scale`, `reveal-title`.
- **Responsive** : 1180px (menu burger), 900px, 680px. Le menu mobile (`#mobileMenu`) doit
  rester synchronisé avec le menu desktop sur toutes les pages.
- **Grands titres** : interligne 1.14 minimum (les jambages g/p touchaient la ligne suivante).
  Titre long sur une page : classe `h1-long`.

## Règles de contenu

- **KYOOTA** : uniquement le site web d'un client. Jamais « e-commerce », « Shopify » ni
  « branding » pour ce projet.
- **Prix** : vidéo et web en « Sur devis ». Mariage : seulement « À partir de 1 400 € » ;
  les autres formules en « Sur devis ». Photo : grille validée par Gloire dans
  `ggs-photography.html` (`#tarifs`) et dans le formulaire (`#photo-type`), à garder
  identiques en FR et EN. 1 h dans son studio, 10 photos retouchées, TVA non applicable.
- **Ne rien inventer** : pas de faux avis, pas d'étoiles, pas de chiffres non fournis par
  Gloire, pas de placeholders ni de « [À CONFIRMER] » dans le contenu publié.
- **Choix volontaires de Gloire, à ne pas retirer** :
  - clic droit et glisser-déposer bloqués sur les images et vidéos (anti-téléchargement) ;
  - page Market en pop-up flouté non navigable (header/footer `inert`, scroll verrouillé).

## Vérifier avant de présenter une modification

1. Regarder le **rendu** (pas seulement le HTML), zoomé sur chaque bloc modifié :
   ordinateur (1440px), tablette (1024px), mobile (375px), en FR et en EN.
2. Passer les skills de revue adaptés (design-critique, accessibility-review, seo-audit…)
   et dire ce qu'ils ont trouvé.
3. Tester liens, images et polices (aucune erreur 404), console sans erreur.
4. Dans le navigateur intégré de Claude masqué, les animations et le lazy loading se figent :
   un écran noir ou une image vide n'y est pas forcément un bug, forcer l'état pour vérifier.

## Sécurité

`server.js` ne sert que les types de fichiers du site et refuse les fichiers internes
(fichiers cachés, `scripts/`, `.md`, `server.js`, `package.json`) avec la page 404.
Ajouter un nouveau type de fichier public → l'ajouter à `MIME` dans `server.js`.
