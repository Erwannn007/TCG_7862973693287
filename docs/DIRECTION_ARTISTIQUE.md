# Direction artistique — règles absolues

> Ces règles sont **non négociables**. Tout nouveau sprite, écran ou animation
> doit les respecter. En cas de doute, c'est ce document qui fait foi.

Direction artistique : pixel art « chibi » dessiné entièrement en code, **sans image externe**.

Le langage visuel des écrans (décors en parallaxe, pancartes de bois, magie, mise en scène)
est décrit dans la [charte design](CHARTE_DESIGN.md), qui prend le mode combat pour modèle.

## 1. Technique

- Chaque sprite est une grille, dessinée pixel par pixel avec la classe `Spr`
  (`js/spr.js`) :
  - **24×24** pour les héros jouables (rangs 1 à 4) et les boss moyens ;
  - **28×28** pour la forme Céleste des héros (rang 5) ;
  - **20×20** pour les ennemis de base ;
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

## 2. Les personnages

Le style des héros : **une silhouette chibi simple, reconnaissable en un coup d'œil, enrichie de
petits détails qu'on découvre en regardant de près** (la recette générale est dans la
[charte](CHARTE_DESIGN.md#2-bis-simple-mais-plein-de-détails--la-recette)). Pour voir tous les
sprites d'un coup : `node tools/sheet.mjs planche.png`.

### 2.1 Le gabarit 24×24

Tous les héros partagent le même corps (fonction `body` de `js/sprites.js`) ; ce qui change, c'est
la coiffe, l'arme, les couleurs et quelques accessoires. Voici Kael au rang 1, pixel par pixel :

```
      012345678901234567890123
y  0  ........................   ← rangées 0 à 4 : casques, chapeaux, couronnes,
y  1  ........................     pointes d'armes (vides au rang 1)
y  2  ........................
y  3  ..........C..C..........   C cheveux   c mèche claire
y  4  ........C..c...C........
y  5  ........CCcCCCCCC.......
y  6  .......CCCCCCcCCC.......
y  7  .......CCCCCCCCCC.......
y  8  .......CPCPPCPCCC.......   P peau      p ombre de peau
y  9  .......CPPPPPPPPC.......
y 10  .......CPPYPPYPPC.M.....   Y yeux (2 px de haut)
y 11  ........PPYPPYPP..M.....   M arme (cuir au rang 1)
y 12  ........PjPbPPjP..M.....   j joues     b bouche
y 13  ........PppppppP..M.....
y 14  ......TTTTBBBBTTTTM.....   T tunique   B broderie (col, poignets, ourlet)
y 15  ......TTOTTBTTTOTTM.....   O ombre de la tunique (sous les bras, ourlet)
y 16  ......TTOTTTTTTOTTM.....
y 17  ......BBOTTTTTTOBBM.....
y 18  ......PPGGGooGGGPGGG....   G ceinture et garde   o boucle d'or
y 19  ......p.OBOOBOOBp.G.....
y 20  .........JJ..JJ...G.....   J jambes
y 21  .........JJ..JJ...M.....
y 22  ........MMM..MMM........   bottes (métal du rang)
y 23  ........SSS..SSS........   S semelle
```

| Partie | Zone | Règle |
|---|---|---|
| tête | x 8–15, y 7–13 (8×7) | la plus grosse partie du corps ; menton ombré (rangée 13) |
| cheveux, coiffe | y 3–9, débordent de 1 px de chaque côté (x 7 et 16) | une forme simple + 2 ou 3 mèches claires |
| torse | x 8–15, y 14–19 (8×6) | col brodé, ombre sous les bras (x 8 et 15), ceinture y 18, ourlet brodé y 19 |
| bras | x 6–7 et 16–17, y 14–17 | 2 px de large, poignets brodés, mains de peau y 18 |
| jambes | x 9–10 et 13–14, y 20–21 | 2 px ; cachées par la robe pour un mage ou une prêtresse |
| bottes | x 8–10 et 13–15, y 22–23 | 3 px, métal du rang, semelle sombre, reflet sur la pointe |
| arme | à droite x 18–19, ou à gauche x 3–5 | dépasse toujours de la silhouette ; monte jusqu'en haut aux rangs élevés |

Les pieds touchent toujours le bas de la grille : le jeu pose les personnages par le bas.

### 2.2 Le visage

- Peau claire **`#f0bf98`**, ombre de peau **`#cf8f6a`** sous le menton.
- **Yeux : deux traits verticaux de 2 px `#21182a`** (x 10 et 13, y 10–11), sans reflet.
- **Joues roses `#f0907a`** sous les yeux (x 9 et 14, y 12).
- **Bouche d'1 pixel** `#a8584a` (x 11, y 12), remplacée par une barbe ou un masque.
- **Pas de nez, jamais.** Les sourcils sont réservés aux personnages âgés (Elio).
- Yeux, joues, reflets et gemmes sont dessinés `flat` (l'ombrage automatique ne les touche pas).

### 2.3 Tenue et textures

- **4 teintes par vêtement** : couleur signature (`main`), ombre (`dark`), broderie (`trim`) et la
  ceinture de cuir. L'ombrage automatique ajoute les reflets en haut à gauche et les ombres en
  bas à droite.
- **Détails obligatoires** : col et poignets brodés, ceinture à boucle d'or (avec un pixel de
  reflet), ourlet brodé d'un point tous les 3 px, bottes à semelle.
- **Cheveux** : une masse simple, 2 à 3 pointes ou une frange, 2 ou 3 mèches plus claires.
- **Pas de taches** : pas de pixels sombres isolés au milieu d'un tissu (ils ressemblent à des
  salissures). Les plis passent par les ombres sous les bras et l'ourlet.
- **Néon et couleurs vives** : un ou deux pixels seulement (boucle, ligne du masque), sinon ils
  mangent la silhouette.

### 2.4 Les armes

| Arme | Détails |
|---|---|
| épée | lame avec un reflet clair en haut et une gouttière plus sombre (2 px de large dès le rang 3), garde, poignée gainée de cuir, pommeau |
| arc | bois courbe sur 3 colonnes, corde claire, poignée gainée au milieu, reflet en haut |
| bâton | bois veiné (un pixel sombre toutes les 3 rangées), orbe avec un reflet blanc et une ombre bleue, griffes de métal dès le rang 3 |
| bâton à anneau | anneau de métal, gemme au centre aux rangs élevés, bois veiné |
| lame plasma | métal aux rangs 1–2, puis néon `#4ff0e8` avec un cœur blanc et un bord cyan sombre |

L'arme grandit avec le rang : sa pointe monte vers le haut de la grille.

### 2.5 Fiches des héros

| Héros | Silhouette | Signes distinctifs | Arme |
|---|---|---|---|
| **Kael**, épéiste | cheveux en pointes | casque à rivets (rang 2), plumet rouge (rang 3), couronne dorée à gemme (rang 4) | épée, à droite |
| **Lyra**, archère | capuche pointue | frange sous la capuche, carquois aux empennages blanc et rouge, plume rouge (rang 3) | arc, à gauche |
| **Elio**, mage | grand chapeau pointu dont la pointe retombe | étoile sur le chapeau, longue barbe blanche texturée, sourcils blancs, robe longue | bâton à orbe, à droite |
| **Séra**, prêtresse | voile blanc | liseré rose du voile, mèches dorées, étole blanche à croix d'or, robe longue | bâton à anneau, à gauche |
| **Volt**, cyber-ninja | cheveux noirs en pointes | bandeau aux pans qui flottent, masque à ligne néon, cimier doré en V (rang 4) | lame plasma, à droite |

### 2.6 Créer un nouveau héros

1. **Une silhouette à lui** : une coiffe ou un accessoire qu'on reconnaît même en ombre noire
   (le jeu affiche les héros verrouillés en silhouette).
2. **Une couleur signature** (`main`), son ombre (`dark`), une broderie (`trim`) et une couleur
   de jambes (`pants`) dans `CLASS`.
3. **Une arme qui dépasse** d'un côté, différente de celles des autres.
4. Partir de `body(s, {…})`, puis dessiner la coiffe, l'arme et 2 ou 3 détails propres au héros.
5. Prévoir les **4 rangs** (cuir, fer, acier, or) ; le rang 5 Céleste est automatique.
6. Vérifier sur la planche (`node tools/sheet.mjs`) : lisible en petit, sans taches, sans trop de
   pixels vifs, et la silhouette tient seule.

### 2.7 Les tenues (skins)

- Une tenue est un **dessin complet** du héros (24×24), qui remplace celui de son rang : pas de
  recoloration, on peut tout changer (silhouette, coiffe, arme, accessoire). Sans limite de
  thème, mais avec les mêmes règles que les héros : gabarit `body`, visage chibi, pas de nez,
  arme ou accessoire qui dépasse, détails de texture, peu de pixels vifs.
- On garde un trait reconnaissable du héros quand c'est possible (cheveux de Kael, barbe d'Elio,
  mèches dorées de Séra), pour qu'on sache qui la porte.
- Les Légendaires ont droit à quelques étincelles et à une cape.
- Thèmes sans limite, pop culture comprise : voir [`SKINS.md`](SKINS.md).

### 2.8 À éviter

- Agrandir un sprite pour le mettre en avant (les pixels doivent rester de la même taille).
- Un nez, des yeux d'un seul pixel, des pupilles avec reflet.
- Des pixels sombres isolés sur les vêtements, des motifs réguliers sur tout un tissu.
- Plus de deux pixels de néon ou de couleur fluo sur une tenue.
- Une arme qui reste à l'intérieur de la silhouette.

### 2.9 Animations et effets de combat

Chaque personnage a ses **poses** et ses **effets** à lui (`js/fx.js`).

**Poses** — fabriquées automatiquement à partir du sprite, en le penchant rangée par rangée
(les pieds restent au sol) : elles marchent pour **les 5 rangs, les tenues et tout futur héros**,
sans dessin en plus.

| Pose | Quand | Effet |
|---|---|---|
| élan (`windup`) | avant de frapper | recule d'un pas, penché en arrière de 2 px |
| frappe (`strike`) | au coup | bondit, penché en avant de 3 px |
| incantation (`cast`) | sorts, tirs magiques, soins | se redresse et lève les bras (+2 px) |
| garde (`guard`) | il se met en garde | se ramasse, reste en garde jusqu'à son tour |
| choc (`hurt`) | il encaisse | penché en arrière de 3 px un instant |

**Effets** — la fiche du personnage (`HERO_FX`) donne sa couleur, son effet d'attaque, son
effet de compétence, s'il attaque **à distance** (il ne s'avance pas, le tir part et frappe en
arrivant) et ses sons.

| Héros | Attaque | Compétence | Couleur |
|---|---|---|---|
| Kael | croissant de lame qui balaie, gerbe d'étincelles | **Taille croisée** : deux entailles en X qui s'illuminent | rouge |
| Lyra | flèche en cloche (pointe blanche, empennage vert) | **Flèche sonnante** : flèche lumineuse et onde qui assomme | vert |
| Elio | orbe magique avec traînée | **Météore** : un rocher de feu tombe sur chaque ennemi et explose | bleu |
| Séra | orbe de lumière qui scintille en croix | **Bénédiction** : colonnes de lumière sur l'équipe, croix qui montent | rose et or |
| Volt | double entaille de néon | **Lame plasma** : ruée en ligne de néon, entailles, éclat | cyan néon |
| (garde, tous) | bouclier de lumière devant le héros, de sa couleur | | |

Ennemis : éclaboussures (slime), griffes (gobelin, golem, dragon), lame d'os (squelette) ;
boss : **Séisme** (le sol se fend sous les héros), **Souffle de feu** (flot de flammes).

**Tenues** : chaque tenue a ses propres effets et sons (`SKIN_FX`, voir [`SKINS.md`](SKINS.md)),
avec les mêmes cibles que le héros ; ses couleurs ne changent pas avec le rang.

**Selon le rang** : les effets grandissent un peu à chaque rang ; au **rang 4** l'éclat devient
doré, au **rang 5** l'effet est blanc et or.

**Règles** : pixels entiers, animations par paliers (8 à 12 images), moins d'une demi-seconde
pour une attaque, moins d'une seconde pour une compétence ; peu de pixels, beaucoup de lisibilité ;
toujours un peu de blanc à la tête de l'effet. **Nouveau héros** : une ligne dans `HERO_FX`
(et, s'il le faut, un nouvel effet dans `FX`), un son dans `js/sfx.js`.

## 3. Palette

- Couleurs chaudes, saturées mais pas fluo, contour violet-noir `#1a1320`.
- Palette commune : or **`#e0a93a` / `#fbe08a`**, gemme rouge **`#e2334a`**, cheveux **`#6b4428`**.
- Métal selon le rang, chacun avec un pixel de reflet plus clair :

  | Rang | Métal | Couleur | Reflet |
  |---|---|---|---|
  | 1 | cuir | `#8a6a4a` | `#a8865f` |
  | 2 | fer | `#8e99a4` | `#b8c2cc` |
  | 3 | acier | `#b9c6d2` | `#e4ecf3` |
  | 4 | or | `#e0a93a` | `#fbe08a` |
  | 5 | ivoire | `#f2ead6` | `#ffffff` |

- Les couleurs de chaque classe (`CLASS` dans `js/sprites.js`) :

  | Classe | Personnage | Signature `main` | Ombre `dark` | Broderie `trim` | Jambes `pants` |
  |---|---|---|---|---|---|
  | Épéiste | Kael | rouge `#c8323c` | `#8c1f2e` | `#f08a7a` | `#4a3a52` |
  | Archère | Lyra | vert `#4f9e3c` | `#2f6a2a` | `#c8e08a` | `#5a4a3a` |
  | Mage | Elio | bleu `#3a64c8` | `#26408a` | or `#e0a93a` | `#26408a` (barbe `#e8e4dc`) |
  | Prêtresse | Séra | rose `#d9548c` | `#9a3264` | `#ffd0e0` | `#6a3a5a` |
  | Cyber-ninja | Volt | violet `#7a3cc8` | `#4a2386` | `#a878e8` | `#2e2440` (néon `#4ff0e8`) |

  Au rang 4, toutes les broderies passent à l'or.

## 4. Progression des rangs

- Chaque rang ajoute des éléments **visibles** :

  | Rang | Ajouts |
  |---|---|
  | 1 | tenue de base, équipement en cuir |
  | 2 | casque / coiffe en fer |
  | 3 | épaulettes en acier, arme plus grande |
  | 4 | tout passe en or, cape, couronne, gemmes |
  | 5 | **Céleste** : recolor du rang 4 (blanc ivoire et or), ailes, auréole, étincelles, grille 28×28 |

- Les rangs supérieurs **recolorent le dernier dessin** avec une table de couleurs
  (`js/sprites.js`) : **mythril** cyan, **obsidienne** noir et lave, **céleste** blanc
  et or avec des ailes et une auréole, plus quelques pixels d'étincelles.
  Mythril et obsidienne sont prêts pour de futurs rangs 6 et 7 et servent déjà aux
  variantes de boss.
- Les variantes d'ennemis sont **le même dessin avec une autre palette**.

## 5. Animation

- Animations « pixel » uniquement : rebond d'1 px, clignotements par paliers.
- **Jamais** d'interpolation douce (pas de `transition` CSS, pas de `ease`). Les déplacements
  se font par sauts de pixels entiers.
- Pas de rotation des sprites. Seule exception : les pancartes d'action, inclinées de ±5° au
  plus selon leur place dans l'arc (voir la [charte design](CHARTE_DESIGN.md)).

## 6. Interface

- Ambiance **donjon chaleureux** : pierre brun-violet, bois, parchemin, or, lumière de
  torche. Les décors (camp, prairie, crypte, volcan) sont dessinés en code
  (`js/scene.js`) avec un éclairage « par paliers » : 4 teintes par surface selon la
  distance aux torches ou au feu, tramage aux frontières, jamais de dégradé doux.
- Cadres **9-slice** dessinés en code (`js/ui-art.js`) : bois, parchemin, pierre,
  boutons bois / or / rouge, ruban. Les coins ne sont jamais étirés et les images sont
  générées directement à la taille des pixels de l'écran (aucun flou).
- **Toutes les pancartes** (boutons, plaques, fenêtres, fiche…) suivent le style des pancartes
  d'action : bois brun veiné, écriture crème en gras contourée. Voir la règle unique de la
  [charte](CHARTE_DESIGN.md#5-bis-la-règle-unique--toute-pancarte-ressemble-aux-pancartes-daction).
- **Lisibilité** : texte clair sur bois ou décor = contour sombre de 1 px tout autour
  (`--txt-out`) ; texte sombre sur bois doré ou parchemin = liseré clair (`--txt-gold`) ;
  jamais moins de 13 px, toujours en gras sur une pancarte.
- Polices pixel (licence OFL, `fonts/`) : **Pixelify Sans** pour le texte, et
  **Jacquarda Bastarda 9** (gothique) pour les titres d'écran uniquement, car elle est
  moins lisible.
- Icônes 14×14 dessinées avec `Spr`, posées sur des **pancartes de bois** disposées en arc
  (bois doré quand l'action est visée). Pas de médaillons ronds ou octogonaux.
- Barres de vie et de stats **en segments** (plus lisibles qu'un remplissage continu).
  En combat, la jauge de PV est un petit objet en pixel art sous les pieds :
  - cadre de **bois à rivet d'or** et **cœur** pour un héros, cadre de **fer sombre** et
    **crâne** pour un ennemi ; 8 segments (14 pour un boss) de 2 px avec reflet et ombre ;
  - vert, puis ambre sous 50 %, rouge sous 25 % (le cœur bat alors) ;
  - **traînée crème** : les PV qu'on vient de perdre restent visibles un instant, puis la
    traînée se vide par paliers ; au soin, les segments clignotent en blanc-vert.

  Dans l'interface, les barres (stats, pitié) reprennent le même cadre de bois et des
  segments avec reflet et ombre.
- Repères de combat bien visibles : chevron doré contouré qui rebondit au-dessus du
  héros actif, anneau doré à ses pieds, coins de visée clignotants sur les cibles.
- Zones tactiles d'au moins 44 px ; actions fréquentes en bas, sous les pouces ;
  boutons dans la zone sûre (encoche et barre d'accueil de l'iPhone).
