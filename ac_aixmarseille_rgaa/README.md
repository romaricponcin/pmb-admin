# Thème PMB « ac_aixmarseille_rgaa »
### Modernisation RGAA 4.1 — Base mutualisée Académie d'Aix-Marseille / DRANE PACA

Ce dossier est un **thème OPAC pour PMB** portant le nouveau design
(charte État + accents académiques, police Marianne, accessibilité RGAA 4.1).

---

## 1. Installation du thème

1. Copier **tout le dossier** `ac_aixmarseille_rgaa/` dans :
   `<votre-pmb>/opac_css/styles/`
   Vous devez obtenir : `opac_css/styles/ac_aixmarseille_rgaa/1-tokens.css`, etc.

2. Dans la **gestion PMB** (partie administration) :
   `Administration → Outils → Paramètres → OPAC`
   - Chercher le paramètre **`default_style`** (ou « Feuille de style par défaut »)
   - Remplacer la valeur (ex. `ac_aixmarseille`) par : **`ac_aixmarseille_rgaa`**
   - Enregistrer.

3. Recharger l'OPAC (Ctrl+F5). Le nouveau design s'applique.

> PMB charge automatiquement tous les fichiers `.css` du dossier du thème,
> par ordre alphabétique — d'où les préfixes `1-`, `2-`, `3-`…

## 2. Activer la barre d'accessibilité (RGAA)

Le fichier `js/a11y-bar.js` crée un bouton flottant « Accessibilité »
(taille de texte, contraste AAA, mode sombre, police adaptée, interligne)
avec réglages mémorisés. Deux façons de l'inclure :

**Option A — via un module HTML du CMS (recommandé, comme vos modules actuels) :**
Créer un module « Code HTML » placé sur toutes les pages, contenant :

    <script src="./styles/ac_aixmarseille_rgaa/js/a11y-bar.js"></script>

**Option B — via le paramètre OPAC d'en-tête HTML :**
`Administration → Outils → Paramètres → OPAC → opac_header` (ou équivalent
selon version) : y ajouter la même balise script.

## 3. Liens d'évitement (RGAA 12.7)

Ajouter dans un module HTML CMS placé EN PREMIER sur la page :

    <div class="skip-links">
      <ul>
        <li><a href="#main">Aller au contenu</a></li>
        <li><a href="#bandeau">Aller au menu latéral</a></li>
        <li><a href="#footer">Aller au pied de page</a></li>
      </ul>
    </div>

(Invisibles à l'écran, ils apparaissent à la navigation clavier Tab.)

## 4. Logos fournis

- `images/drane-paca.png` — logo DRANE PACA (en-tête)
- `images/republique-francaise.png` — bloc-marque Ministère (pied de page,
  à lier vers https://www.education.gouv.fr/)

Exemple pour le pied de page (module CMS « Code HTML ») :

    <a href="https://www.education.gouv.fr/" target="_blank" rel="noopener">
      <img src="./styles/ac_aixmarseille_rgaa/images/republique-francaise.png"
           alt="Ministère de l'Éducation nationale — education.gouv.fr (nouvelle fenêtre)"
           style="height:58px;background:#fff;padding:7px 9px;border-radius:6px">
    </a>

## 5. Police Marianne hors-ligne (optionnel)

Par défaut, Marianne est chargée depuis le CDN officiel DSFR (internet requis).
Pour un fonctionnement 100 % local : télécharger les `.woff2` depuis
https://github.com/GouvernementFR/dsfr (dossier fonts), les déposer dans
`ac_aixmarseille_rgaa/fonts/` et adapter les `@font-face` de `1-tokens.css`.

## 6. Ajustements

Ce thème cible les identifiants standard de PMB et ceux relevés sur la base
mutualisée (export 2026). Selon votre version exacte de PMB et vos modules
CMS, certains blocs peuvent nécessiter des ajustements fins : envoyer le
HTML généré (clic droit → code source) de la page concernée pour itérer.

Conçu en juin 2026. Couleurs : Bleu France #000091 · accents académiques
#ba1d76 / #26a48f / #afcd54 (assombris pour contraste AA sur fond clair).
