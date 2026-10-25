# Charte design — le style du combat

> Le mode combat est la **référence** de tout le jeu. Chaque écran (invocation, équipe,
> camp, futurs écrans) doit en reprendre le langage : décor vivant, pancartes de bois,
> magie discrète, mise en scène qui répond au doigt.
> Les règles de dessin des sprites restent dans [`DIRECTION_ARTISTIQUE.md`](DIRECTION_ARTISTIQUE.md).

## 1. L'esprit en une phrase

**Du pixel art chaleureux, mis en scène comme un film, où chaque geste du joueur a une réponse
visible, sonore et tactile — sans jamais en faire trop.**

Trois piliers :

| Pilier | Ce que ça veut dire |
|---|---|
| **Matière** | Bois, pierre, parchemin, métal : tout a une texture dessinée pixel par pixel, jamais un aplat ni une image étirée. |
| **Magie dosée** | Une couleur magique par action, des halos de 2 à 4 px, quelques étincelles. La lumière souligne, elle ne remplit pas. |
| **Cinéma** | Celui qui agit passe au premier plan, la caméra le suit, le décor glisse en parallaxe, l'écran tremble sur les gros coups. |

## 2. Le pixel avant tout

- Échelle **entière** partout (canvas, zoom caméra, tremblements) : 1 pixel d'art = N pixels d'écran.
- Animations **par paliers** (`steps()`, sauts de 1 ou 2 px). Aucune transition douce, aucun `ease`.
- Lumière **par paliers** : 4 teintes par surface, tramage (matrice de Bayer 4×4) aux frontières,
  jamais de dégradé continu dans un décor.
- Exceptions autorisées, uniquement pour l'interface : halo `drop-shadow` coloré autour des
  pancartes, voiles semi-transparents (assombrissement, éclair blanc).

## 2 bis. Simple, mais plein de détails : la recette

Le style tient en une règle : **des formes simples, lisibles au premier coup d'œil, enrichies de
petits détails de texture qu'on découvre en regardant de plus près.** Jamais de détail qui brouille
la silhouette, jamais de grande surface vide.

**1. La forme d'abord.** Chaque objet est une silhouette nette (rectangle, disque, losange…) avec un
contour sombre `#1a1320` (pas du noir pur). On doit la reconnaître même dans la pénombre.

**2. Trois ou quatre teintes par matière, pas plus.**

| Rôle | Où |
|---|---|
| reflet | bord haut et gauche (la lumière vient d'en haut à gauche) |
| teinte de base | le corps |
| ombre | bord bas et droit |
| creux | joints, fissures, contour intérieur |

**3. Puis la texture, par petites touches** (quelques % des pixels, jamais un motif régulier) :

| Matière | Détails |
|---|---|
| pierre, brique | grain (pixels un ton plus sombre), briques fêlées en diagonale, mousse au pied du mur, ombre tramée en bas |
| dallage | grain, fissures, reflet clair sur le bord haut de chaque dalle, paille, flaque |
| bois | planches de teintes voisines, veinures de longueurs variées, nœuds, clous, équerres de fer |
| herbe, terre | taches de bruit lissé tramé, touffes, fleurs en bouquets, ornières |
| métal, cristal | facettes claires / sombres, une arête lumineuse, un ou deux reflets qui scintillent |

**4. Le hasard est déterministe.** Les détails viennent de `hash(x, y)` et du bruit lissé `noise2`,
jamais de `Math.random()` dans un décor : le même écran se redessine toujours à l'identique.

**5. La lumière raconte.** Éclairage par paliers autour des sources (torche, feu, lave), tramage aux
frontières, voile plus sombre sur ce qui compte moins, rai de lumière sur le sujet.

**6. Un peu de vie partout.** Au moins un détail qui bouge par paliers dans chaque décor (flamme,
poussière, goutte, herbe, nuage), à petite dose.

**À éviter** : les aplats unis sur de grandes surfaces, les dégradés doux, les motifs qui se répètent
à l'identique, les détails plus contrastés que la silhouette, et agrandir un sprite (les pixels
doivent garder la même taille dans une même scène).

## 3. Décors

- **Plein écran** : le décor couvre tout l'écran ; le surplus de hauteur devient du sol en bas.
  Jamais de bande noire sur un téléphone en paysage.
- **Plans de parallaxe** (`LAYERS` dans `js/scene.js`) : chaque décor est une pile de plans
  avec une profondeur `d`.

  | `d` | Plan | Mouvement quand la caméra tourne de `P` px |
  |---|---|---|
  | 0 | ciel | `-P` (suit la caméra) |
  | 0,15 – 0,6 | montagnes, château, collines, forêt, mur du fond | entre les deux |
  | 1 | sol, combattants | ne bouge pas |
  | 1,5 – 1,6 | premier plan (buissons, feuillage, rochers) | sens inverse, dessiné **devant** les personnages |

  Les plans sont dessinés plus larges que l'écran (`LAYER_M` = 16 px de chaque côté) ; les
  éléments collés aux coins de l'écran se calent sur `LAYER_M`.
- **Vie permanente** : chaque décor bouge un peu (nuages qui dérivent, oiseaux, herbes qui
  ondulent, papillons, pollen, brume, feux follets, lave qui pulse, braises, fumée ; dans les
  pièces du camp : lueur des torches qui vacille, poussière dans la lumière, goutte d'eau qui
  tombe du plafond dans une flaque).
- **Pièces du camp** (`ROOM_LAYERS`) : mêmes plans qu'en combat — mur du fond (`d` 0,7), sol
  (1), premier plan (1,4 : tonneaux, caisses) et vignettage. La parallaxe joue pendant le
  passage d'une pièce à l'autre : le mur traîne, le premier plan file. Murs et sols ont du
  grain, des briques fêlées, de la mousse au pied du mur, une poutre au plafond, de la paille
  et une flaque. Le cadrage coupe environ 20 px de chaque côté : rien d'important au-delà.
- **Profondeur atmosphérique** : le lointain est plus clair et bleuté, un voile de brume au pied
  des montagnes, un vignettage tramé dans les lieux sombres.
- **Rai de lumière** sur le sujet important (le héros qui agit, le cristal d'invocation) :
  bandes de 4 px qui s'élargissent vers le bas, très transparentes (6 à 16 %).

## 4. Mise en scène et caméra

| Moment | Effet |
|---|---|
| Un combattant commence son tour | il passe devant sa ligne (14 px), ses alliés reculent (4 px), le décor s'assombrit par paliers, rai de lumière sur lui, nuage de poussière à ses pieds, son « focus » |
| Caméra | zoom par paliers d'**un pixel d'écran par pixel d'art** (net), ancré en bas de l'écran ; panoramique de 6 px vers celui qui agit ; travelling de 18 px à l'entrée en combat |
| Compétence | pose de préparation : il se ramasse d'1 px, 8 étincelles convergent, il s'illumine en blanc |
| Coup | la cible s'avance (face-à-face), l'attaquant bondit par sauts de 4 px |
| Coup critique / attaque de boss | tremblement de 2 à 3 px, éclair blanc plein écran (70 ms) |
| Rituel (invocation) | voile sombre, magie qui converge vers le cristal par vagues, anneaux de lumière, tremblement, éclair blanc |
| Choisir un héros (équipe) | les socles tournent en carrousel (8° par image) : il vient devant au milieu, sous un rai de lumière, les autres reculent dans la pénombre ; ses pancartes jaillissent ensuite. **Jamais d'agrandissement d'un sprite** : la profondeur se rend par la position et la pénombre |
| Fin de combat | voile sombre (rougeâtre pour une défaite) ; une pile de plaques de bois tombe du ciel et rebondit, avec une lueur dorée (victoire) ou rouge (défaite) qui respire. La plaque **suit le doigt** dans tous les sens ; lâchée assez loin, elle file dans cette direction, **éclate en copeaux** et la suivante sort de la pile pour passer devant (son de bois). Pages : résumé, statistiques, expérience. Les choix sortent ensuite en pancartes |
| Vestiaire (skins) | les héros du fond sautillent puis filent vers la gauche, celui de devant glisse au centre de la salle libre ; chaque socle vole en éclats de pierre quand son héros le quitte ; la fiche tombe en copeaux et une plaque de même taille tombe du ciel avec la liste des skins (défilement vertical, toucher un skin l'essaie sur le héros) ; « Retour » : les socles retombent du ciel, puis les héros reviennent |

Ceux qui n'agissent pas restent **dans la pénombre** (silhouette sombre à 9 % par palier) ;
les cibles qu'on peut toucher restent éclairées.

## 5. Les pancartes (le composant d'action)

Toute action importante se présente sous forme de **pancartes de bois** (`.signs` + `.act`).

**Dessin** (`signUrl` dans `js/ui-art.js`), toujours à la taille exacte du bouton :
contour noir aux coins cassés, cadre de bois sombre éclairé en haut à gauche, planches
horizontales veinées avec nœuds, clous aux bouts, équerres de fer aux coins, éclats et rayures.
Chaque pancarte a sa graine (`_seed`) : jamais deux bois identiques.

| État | Rendu |
|---|---|
| repos | bois brun, inclinaison de ±5° selon sa place, lévitation d'1 px, halo de sa couleur magique |
| visée | **bois doré**, équerres de laiton, redressée, plus grande, attirée vers le doigt (6 px max) |
| les autres pendant la visée | `scale .94`, `opacity .82` |
| indisponible | grise, sans halo ni étincelles |

**Disposition** (variante `messy` au camp : pancartes clouées un peu en désordre, décalées et penchées) : en **arc de cercle** autour du sujet (le héros, le cristal), jamais empilées
en colonne. `layoutSigns(m, titre, items, x, y, rayon, écart)` ; rayon de 112 px et écart de
0,72 rad en combat. Quand le sujet doit se centrer dans l'espace libre (l'autel d'invocation),
on range d'abord les pancartes contre la plaque d'informations, puis on place le sujet au milieu
de ce qui reste ; le rayon est la distance entre les deux. Variante `big` (pancartes plus
grandes) pour les écrans avec peu d'actions.

**Couleur magique** (`mg`) : une par action, utilisée pour le halo, les étincelles et la traînée.

| Action | Couleur |
|---|---|
| Attaque | braise `#ff8a4a` |
| Compétence / Invoquer ×1 | arcane `#c08aff` |
| Garde | cyan `#5ae0ee` |
| Pancarte visée / Invoquer ×10 | or `#ffd86a` |
| Annuler | crème `#d8c8b0` |

**Cycle de vie** :

1. **Apparition** : les pancartes jaillissent du sujet une à une (70 ms d'écart) et se déploient en éventail, avec un arpège de trois notes.
2. **Glissé** : traînée d'étincelles sous le doigt, petites étincelles quand on change de pancarte, son « hover », vibration de 5 ms.
3. **Choix** (on relâche) : la pancarte s'illumine, gonfle, puis éclate en **copeaux de bois** et étincelles ; les autres basculent et tombent ; son de bois, vibration de 15 ms. L'action part **300 ms** après, pour laisser l'effet se jouer.

**Lumière dosée** : halo de 2 à 4 px au repos, 4 à 7 px pour la pancarte visée, un reflet
discret toutes les 5 s, deux étincelles par pancarte. **Pas de barre lumineuse** sous les
pancartes.

## 5 bis. La règle unique : toute pancarte ressemble aux pancartes d'action

> **Règle absolue.** Quelle que soit sa taille — bouton, petite plaque, compteur d'or, fiche,
> plaque d'invocation, vestiaire, fenêtre d'options, plaque de fin de combat, file des tours,
> message de combat — **une pancarte a exactement le style des petites pancartes rectangulaires
> d'action** : même bois, mêmes textures, même écriture.

| Élément | Règle |
|---|---|
| **Bois** | `signUrl(w, h, 'normal')` : bois brun veiné, planches, nœuds, clous, équerres de fer, contour noir aux coins cassés — dessiné à la **taille exacte** de l'élément, jamais étiré |
| **Écriture** | Pixelify Sans **en gras**, **crème `#f2e2b8`**, **contour sombre de 1 px tout autour** (`--txt-out`) ; textes secondaires crème plus doré `#f2d8a0`, même contour ; **jamais sous 13 px** |
| **Titres** | Jacquarda Bastarda doré `#fbe08a`, contour sombre, ombre portée de 3 px |
| **Doré** (`.gold`, `.on`, plaque choisie, pancarte visée) | bois doré, équerres de laiton ; écriture **sombre** à liseré clair (`--txt-gold`) |
| **Rouge** (`.red` : Fuir, Effacer la partie) | bois laqué rouge, même écriture crème contourée |
| **Sombre** (héros déjà sur un socle) | bois sombre, écriture crème contourée |
| **Profondeur** | la lumière vient d'en haut à gauche : **ombre portée nette vers le bas à droite** (deux paliers, sans flou). Plus c'est important, plus l'ombre est grande : `--depth` (bouton, pancarte), `--depth-big` (plaque, fenêtre, fiche), `--depth-up` (pancarte visée, bouton doré : soulevés) |
| **Pressé** | s'enfonce de 3 px vers le bas à droite, s'assombrit, et son ombre se réduit à 1 px (`--depth-press`) |
| **Indisponible / hors jeu** | ombre minimale : il est « collé » au fond |

Les lignes à l'intérieur d'une plaque (statistiques, XP, liste des tenues) sont légèrement
**creusées** (ombre intérieure en haut à gauche).

Interdits : élément plat sans ombre, texte sombre sur le bois brun, bois clair « gravé », dégradés, cadres 9-slice
étirés, fond uni derrière un texte. Seules exceptions : les **avis de recherche** (héros pas
encore obtenus, parchemin) et le parchemin des cartes, qui ne sont pas des pancartes.

Dans le code : `paintWood` (boutons et cadres, repeints dès que leur taille ou leur classe
change) et `paintSign` (plaques) dans `js/main.js` ; les couleurs d'écriture sont regroupées à la
fin de `css/style.css` (« une règle pour toutes les pancartes »).

## 5 ter. Tableaux de pancartes (options, rejouer)

Pas de fenêtre posée par-dessus l'écran : **tout ce qui est à l'écran tombe**, puis les
pancartes tombent du ciel et se **clouent en grille un peu de travers** (décalées et penchées
différemment, jamais alignées), avec un ruban de titre. Toucher une pancarte la fait éclater ;
toucher à côté (ou « Fermer ») fait éclater le tableau, et l'écran retombe à sa place.
Fonctions : `openBoard`, `closeBoard`, `explodeSigns` (`js/main.js`).

De même, des pancartes ouvertes (Équipe) **éclatent** quand on touche à côté.

## 6. Plaques d'information

Les informations (taux, compteurs, descriptions) vont sur une **plaque de bois** qui suit la
règle unique ci-dessus (`paintSign`), et qui flotte doucement (lévitation de 2,2 s). Barres en
segments ; lignes de tableau sur un fond sombre translucide.

Pour choisir parmi une liste (les héros de l'équipe), une **colonne de petites plaques**, la
plaque choisie en bois doré et décalée de 6 px ; le sujet choisi est mis en scène dans le décor
(debout sous un rai de lumière), pas dans une vignette.

## 6 bis. Glisser-déposer

Quand on range ou place quelque chose (l'équipe), on le **prend avec le doigt** :

- les emplacements existent **dans le décor** (socles de pierre numérotés), pas dans une liste ;
  un emplacement vide montre un contour en pointillés qui attend ;
- l'objet pris suit le doigt en se balançant (±4°), avec une traînée d'étincelles ;
- tous les emplacements possibles s'allument en pointillés dorés ; celui qui est visé reçoit
  un rai de lumière et son numéro grossit en doré ; la zone pour retirer devient rouge avec
  « Lâche ici pour le retirer » ;
- au dépôt : flash blanc, étincelles et copeaux, son de bois, vibration ; un dépôt impossible
  fait trembler la zone et repartir l'objet d'où il vient ;
- un simple toucher (moins de 8 px de mouvement) sélectionne au lieu de déplacer.
- dès que le glisser commence, les pancartes de l'objet tombent (elles ne servent à rien pendant
  le déplacement) ; elles reviennent s'il retourne d'où il vient.

## 7. Particules

Un seul canvas `#fx` au-dessus de toute l'interface, en pixels d'art (`U` = 2 px CSS).

| Particule | Taille | Gravité | Usage |
|---|---|---|---|
| traînée | 1 – 2 | quasi nulle, monte | sous le doigt |
| étincelle | 1 – 2 | légère | changement de pancarte, choix, révélation de carte |
| copeau de bois | 2 – 3 | forte, retombe | pancarte choisie |
| convergence | 1 – 2 | aucune, va vers un point | charge du cristal, charge d'une compétence |

Toujours un peu de **blanc** (environ 30 %) mêlé à la couleur magique.

## 8. Son et vibration

Chaque geste a un son (`js/sfx.js`, ondes carrées 8 bits) et, si possible, une vibration :

| Événement | Son | Vibration |
|---|---|---|
| grosse plaque qui tombe ou éclate (fin de combat) | `thud` (coup sourd et gras) | 25 ms |
| plaque qu'on fait glisser | `swipe` | — |
| apparition des pancartes | `menu` | — |
| passer sur une pancarte | `hover` | 5 ms |
| choisir une pancarte | `select` + `wood` | 15 ms |
| pancarte indisponible | `denied` | — |
| un combattant s'avance | `focus` / `focusFoe` | — |
| charge (compétence, rituel) | `charge` | 8 ms par vague |
| gros impact | `boom` / `zoom` | 40 – 60 ms |

## 9. Rythme

| Durée | Pour |
|---|---|
| 40 ms | un palier de déplacement (personnages, plans, caméra) |
| 70 ms | écart entre deux pancartes qui apparaissent, éclair blanc |
| 240 – 320 ms | effet de choix, chute des autres pancartes |
| 450 ms | charge d'une compétence |
| ~1,2 s | rituel d'invocation complet |

## 10. Checklist pour un nouvel écran

- [ ] Le décor couvre tout l'écran, avec au moins un élément animé et un premier plan.
- [ ] Le sujet principal est éclairé (rai de lumière, halo), le reste un ton en dessous.
- [ ] Les actions sont des pancartes en arc autour du sujet, avec leur couleur magique.
- [ ] Glisser sur les pancartes donne une traînée ; choisir donne un éclat + son + vibration.
- [ ] Les informations sont sur une plaque de bois, pas sur un panneau plat.
- [ ] Tout bouge par paliers, à l'échelle entière ; aucune transition douce.
- [ ] Les lumières restent discrètes : si on la remarque avant l'action, elle est trop forte.

## 11. Où est le code

| Quoi | Où |
|---|---|
| Plans de décor, parallaxe, animations de décor | `js/scene.js` (`LAYERS`, `sceneLayers`, `LAYER_M` ; pièces : `ROOM_LAYERS`, `roomLayers`, `drawRoomLayers`) |
| Mise en scène, caméra, charge, face-à-face | `js/battle.js` (`setFocus`, `camera`, `charge`, `strike`) |
| Dessin des pancartes en bois | `js/ui-art.js` (`signUrl`) |
| Disposition en arc, glissé, choix, particules | `js/main.js` (`layoutSigns`, `attachSigns`, `chooseSign`, `fx`, `sparks`) |
| Rituel d'invocation | `js/main.js` (`ritual`, `drawAltar`) |
| Salle d'équipe (carrousel de socles, glisser-déposer, fiche, montée de rang) | `js/main.js` (`renderTeam`, `layoutTeam`, `rotateTo`, `placeSlots`, `heroSigns`, `dragSource`, `dragEnd`, `drawTeamLife`, `upgrade`) |
| Styles des pancartes et animations | `css/style.css` (`.signs`, `.act`, `@keyframes levitate / aura / shine / mote`) |
| Sons | `js/sfx.js` |
