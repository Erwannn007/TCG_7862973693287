# Direction artistique — règles absolues

> Ces règles sont **non négociables**. Tout nouveau sprite, écran ou animation
> doit les respecter. En cas de doute, c'est ce document qui fait foi.

Direction artistique : pixel art « chibi » dessiné entièrement en code, **sans image externe**.

## 1. Technique

- Chaque sprite est une grille, dessinée pixel par pixel avec la classe `Spr`
  (`js/spr.js`) :
  - **20×20** pour les personnages (héros jouables rangs 1 à 4, ennemis de base) ;
  - **24×24** pour les héros (forme Céleste rang 5) et les boss moyens ;
  - jusqu'à **~28×27** pour les gros boss.
- Méthodes de dessin :
  | Méthode | Rôle |
  |---|---|
  | `p(x, y, couleur)` | un pixel |
  | `r(x, y, w, h, couleur)` | rectangle plein |
  | `hl(x0, x1, y, couleur)` | ligne horizontale |
  | `v(x, y0, y1, couleur)` | ligne verticale |
  | `sline(x0, y0, x1, y1, couleur)` | ligne quelconque (Bresenham) |
  | `recolor(table)` | nouveau sprite avec une autre palette |
- Ombrage automatique à la génération (`build()`) :
  - contour sombre de 1 px autour de la silhouette : **`#1a1320`** (pas du noir pur) ;
  - pixels du bord bas/droite assombris (**×0,76**) ;
  - pixels du bord haut/gauche éclaircis (**×1,16**).
  - Un drapeau **`flat`** exclut de l'ombrage les yeux, les reflets, les gemmes et les glyphes.
- Rendu en canvas, `image-rendering: pixelated`, **échelle entière uniquement**,
  positions multiples de la taille d'un pixel. **Aucun lissage.**

## 2. Proportions des personnages

- Grosse tête (environ 6×6 px sur 20), corps trapu, jambes très courtes (**2 px**),
  pieds de **3 px**.
- Visage : peau claire **`#f0bf98`**, ombre de peau **`#cf8f6a`**, yeux = **2 pixels
  isolés `#21182a`**, bouche ou barbe d'**1 ligne**. **Pas de nez.**
- L'arme ou l'accessoire **dépasse de la silhouette sur le côté** (épée, arc, bâton
  avec un orbe…) pour qu'on reconnaisse la classe au premier coup d'œil.

## 3. Palette

- Couleurs chaudes, saturées mais pas fluo, contour violet-noir.
- Palette commune : or **`#e0a93a` / `#fbe08a`**, gemme rouge **`#e2334a`**, cheveux **`#6b4428`**.
- Métal selon le rang, chacun avec un pixel de reflet plus clair :

  | Rang | Métal | Couleur | Reflet |
  |---|---|---|---|
  | 1 | cuir | `#8a6a4a` | `#a8865f` |
  | 2 | fer | `#8e99a4` | `#b8c2cc` |
  | 3 | acier | `#b9c6d2` | `#e4ecf3` |
  | 4 | or | `#e0a93a` | `#fbe08a` |
  | 5 | ivoire | `#f2ead6` | `#ffffff` |

- Une couleur signature par classe :

  | Classe | Personnage | Signature |
  |---|---|---|
  | Épéiste | Kael | rouge `#c8323c` |
  | Archère | Lyra | vert `#4f9e3c` |
  | Mage | Elio | bleu `#3a64c8` |
  | Prêtresse | Séra | rose `#d9548c` |
  | Cyber-ninja | Volt | violet `#7a3cc8` (+ néon `#4ff0e8`) |

## 4. Progression des rangs

- Chaque rang ajoute des éléments **visibles** :

  | Rang | Ajouts |
  |---|---|
  | 1 | tenue de base, équipement en cuir |
  | 2 | casque / coiffe en fer |
  | 3 | épaulettes en acier, arme plus grande |
  | 4 | tout passe en or, cape, couronne, gemmes |
  | 5 | **Céleste** : recolor du rang 4 (blanc ivoire et or), ailes, auréole, étincelles, grille 24×24 |

- Les rangs supérieurs **recolorent le dernier dessin** avec une table de couleurs
  (`js/sprites.js`) : **mythril** cyan, **obsidienne** noir et lave, **céleste** blanc
  et or avec des ailes et une auréole, plus quelques pixels d'étincelles.
  Mythril et obsidienne sont prêts pour de futurs rangs 6 et 7 et servent déjà aux
  variantes de boss.
- Les variantes d'ennemis sont **le même dessin avec une autre palette**.

## 5. Animation

- Animations « pixel » uniquement : rebond d'1 px, clignotements par paliers.
- **Jamais** d'interpolation douce ni de rotation (pas de `transition` CSS,
  pas de `ease`, pas de `rotate`). Les déplacements se font par sauts de pixels entiers.

## 6. Interface

- Ambiance **donjon chaleureux** : pierre brun-violet, bois, parchemin, or, lumière de
  torche. Les décors (camp, prairie, crypte, volcan) sont dessinés en code
  (`js/scene.js`) avec un éclairage « par paliers » : 4 teintes par surface selon la
  distance aux torches ou au feu, tramage aux frontières, jamais de dégradé doux.
- Cadres **9-slice** dessinés en code (`js/ui-art.js`) : bois, parchemin, pierre,
  boutons bois / or / rouge, ruban. Les coins ne sont jamais étirés et les images sont
  générées directement à la taille des pixels de l'écran (aucun flou).
- Polices pixel (licence OFL, `fonts/`) : **Pixelify Sans** pour le texte, et
  **Jacquarda Bastarda 9** (gothique) pour les titres d'écran uniquement, car elle est
  moins lisible.
- Icônes 14×14 dessinées avec `Spr`, posées dans des **boutons rectangulaires** encadrés
  de bois (or quand l'action est visée). Pas de médaillons ronds ou octogonaux.
- Barres de vie et de stats **en segments** (plus lisibles qu'un remplissage continu).
- Repères de combat bien visibles : chevron doré contouré qui rebondit au-dessus du
  héros actif, anneau doré à ses pieds, coins de visée clignotants sur les cibles.
- Zones tactiles d'au moins 44 px ; actions fréquentes en bas, sous les pouces ;
  boutons dans la zone sûre (encoche et barre d'accueil de l'iPhone).
