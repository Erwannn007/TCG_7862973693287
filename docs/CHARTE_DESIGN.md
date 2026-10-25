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
  ondulent, papillons, pollen, brume, feux follets, lave qui pulse, braises, fumée).
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

**Disposition** : en **arc de cercle** autour du sujet (le héros, le cristal), jamais empilées
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

## 6. Plaques d'information

Les informations (taux, compteurs, descriptions) vont sur une **plaque de bois** dessinée comme
une pancarte (`paintSign`), qui flotte doucement (lévitation de 2,2 s). Titre en Jacquarda doré,
texte crème avec ombre sombre, barres en segments.

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
| Plans de décor, parallaxe, animations de décor | `js/scene.js` (`LAYERS`, `sceneLayers`, `LAYER_M`) |
| Mise en scène, caméra, charge, face-à-face | `js/battle.js` (`setFocus`, `camera`, `charge`, `strike`) |
| Dessin des pancartes en bois | `js/ui-art.js` (`signUrl`) |
| Disposition en arc, glissé, choix, particules | `js/main.js` (`layoutSigns`, `attachSigns`, `chooseSign`, `fx`, `sparks`) |
| Rituel d'invocation | `js/main.js` (`ritual`, `drawAltar`) |
| Salle d'équipe (socles, glisser-déposer, fiche, montée de rang) | `js/main.js` (`renderTeam`, `layoutTeam`, `dragSource`, `dragEnd`, `drawTeamLife`, `upgrade`) |
| Styles des pancartes et animations | `css/style.css` (`.signs`, `.act`, `@keyframes levitate / aura / shine / mote`) |
| Sons | `js/sfx.js` |
