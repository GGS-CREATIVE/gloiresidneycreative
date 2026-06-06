# CLAUDE.md — GGS Creative

Contexte projet pour Claude Code. Lis ce fichier avant toute modification.

## Le projet

Site portfolio **statique** (HTML / CSS / JS pur, **aucun framework, aucun build**) de
Gloire Sidney Goniaga — directeur créatif & artistique basé à Bruxelles (branding, web,
photo, vidéo). La version actuelle est une refonte d'un site WordPress/Elementor existant
(https://gloiresidneycreative.com), recodée en statique pour être déployée depuis VS Code.

Langue du contenu : **français**. Conserve le tutoiement déjà employé dans les textes.

## Lancer le projet

Pas de dépendances, pas de `npm install`. Ouvre `index.html` avec un serveur local
(extension **Live Server** de VS Code, ou `python3 -m http.server`). C'est tout.

## Structure

```
.
├── index.html              # Accueil
├── a-propos.html           # À propos
├── ggs-photography.html    # Service : Photo
├── ggs-videography.html    # Service : Vidéo
├── ggs-web-design.html     # Service : Web
├── ggs-market.html         # Boutique de ressources
├── contact.html            # Travaillons ensemble
├── css/styles.css          # SOURCE UNIQUE du design (tokens + tous les composants)
├── js/main.js              # Menu mobile, reveal au scroll, filtres/chips
└── assets/                 # Images locales (à remplir)
```

## Conventions (à respecter impérativement)

- **Un seul CSS** : `css/styles.css`. N'ajoute pas de `<style>` inline ni de fichier CSS par
  page. Toute nouvelle règle va dans `styles.css`, dans la section thématique adéquate.
- **Tokens** : toutes les couleurs/rayons/largeurs sont des variables CSS dans `:root` en haut
  de `styles.css`. N'écris jamais une couleur en dur — utilise `var(--accent)`, etc.
- **Liens internes** : toujours relatifs et en `.html` (`href="a-propos.html"`), jamais d'URL
  absolue vers gloiresidneycreative.com pour la navigation.
- **JS** : vanilla, pas de librairie. Les comportements répétés (chips, filtres) utilisent
  l'attribut `data-toggle-group` géré dans `main.js`.
- **Animations** : ajoute la classe `reveal` à un élément pour qu'il apparaisse au scroll.
- **Polices** : Poppins (titres) + DM Sans (corps), chargées via Google Fonts dans le `<head>`
  de chaque page. Ne change pas de police sans demande explicite.
- **Responsive** : breakpoints à 900px et 680px déjà gérés dans `styles.css`. Le menu mobile
  (`#burger` / `#mobileMenu`) existe sur chaque page — garde-le synchronisé avec le menu desktop.

## Système de design

- Fond noir `--bg:#000`, sections claires `--bg-light:#f4f2f3`.
- Accent rose magenta `--accent:#ff0a8c` (⚠️ valeur estimée — à confirmer avec le hex exact
  de la marque).
- Cartes en dégradé bordeaux `--card-from:#2a0a1c` → `--card-to:#46112f`.
- Composants signature : badges pilule (`.badge`), bandeaux `.marquee` inclinés à -2°,
  timeline à points roses (`.timeline`), surlignage rose (`.hl`), pilules d'outils (`.tools`).
- Footer identique sur toutes les pages (bloc nom/contact/réseaux + barre bordeaux).

## Source de vérité du contenu

`index.html` et `a-propos.html` reprennent le **contenu réel** du site en ligne (bio, parcours,
13 outils, 3 services). `ggs-photography.html` reprend le titre réel « Capturer l'instant.
Sublimer l'émotion. » + galerie 16 photos. Ne réécris pas ces textes sans raison ; les autres
pages (vidéo, web, market, contact) sont des propositions modifiables.

## État actuel & tâches ouvertes

Fait : 7 pages structurées, reliées, responsive, design unifié.

À faire (par ordre utile) :
1. **Localiser les images** : logo, photo hero, avatars et visuels projet pointent encore vers
   `https://gloiresidneycreative.com/wp-content/...`. Les télécharger dans `assets/` et
   remplacer les URLs pour un site 100 % autonome.
2. **Remplacer les placeholders** : les blocs `.ph` en dégradé (marqués « VOTRE PHOTO »,
   « APERÇU », « PHOTO 1 »…) attendent de vraies images.
3. **Brancher le formulaire** de `contact.html` (visuel pour l'instant) sur Formspree ou
   équivalent — statique = pas de PHP.
4. **Confirmer `--accent`** avec le hex exact de la marque.
5. Optionnel : factoriser nav + footer (actuellement dupliqués dans chaque page) si on passe à
   un générateur de site statique. **Ne pas** introduire de framework sans validation.

## Déploiement

Statique → Netlify (`app.netlify.com/drop`, glisser le dossier), GitHub Pages, ou Hostinger
(`public_html`). ⚠️ Sur Hostinger, ce dossier **remplace** l'install WordPress existante :
sauvegarder WordPress avant tout upload.
