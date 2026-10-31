# Bases de données avancées · L2 IDS · SupNum

Site du cours (HTML, CSS et JavaScript, sans installation).

## Mettre le site en ligne avec GitHub Pages
1. Sur github.com, cliquez sur **New repository**, nommez-le par exemple `bda-l2ids`, cochez **Public**, puis **Create repository**.
2. Cliquez sur **uploading an existing file** et glissez **tout le contenu** de ce dossier (index.html, assets, docs, data, simulations, README.md). Cliquez sur **Commit changes**.
3. Allez dans **Settings → Pages**. Dans **Branch**, choisissez **main** et le dossier **/ (root)**, puis **Save**.
4. Après 1 à 2 minutes, le site est en ligne à l'adresse `https://VOTRE-NOM.github.io/bda-l2ids/`.

## Modifier le cours
- **Tout le contenu** (chapitres, parties, diapositives, quiz, glossaire, ressources) est dans `assets/js/content.js`.
- Pour publier un nouveau chapitre : remplacez `statut: "bientot"` par `statut: "ok"` et ajoutez ses `parties`, sur le modèle du chapitre 1.
- Les couleurs sont au début de `assets/css/style.css`.
- Les PDF se placent dans `docs/`, les fichiers SQL dans `data/`.

## Mode Présenter
Bouton **Présenter** sur chaque partie : → suivant, ← précédent, F plein écran, B écran noir, Échap pour quitter.
