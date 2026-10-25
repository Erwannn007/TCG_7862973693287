# Tenues (skins) — sans limite

> C'est **notre jeu perso** : une tenue peut être n'importe quoi. Clin d'œil à un jeu vidéo, à un
> film, à une série, à un mème, une blague, un métier, un costume ridicule… Le chevalier en slip
> et le mineur cubique façon jeu de blocs sont exactement l'esprit.
> Les règles de dessin restent celles de la [direction artistique](DIRECTION_ARTISTIQUE.md) ;
> le fonctionnement en jeu est dans le [cahier des charges](CAHIER_DES_CHARGES.md#tenues-skins).

## 1. Le principe

- Une tenue **remplace entièrement** le dessin du héros, **à tous les rangs** (rang 1 ou rang 5 :
  même allure). Les stats ne changent pas, c'est purement visuel.
- Elle s'obtient à l'**autel des tenues** (cristal vert, page Invocation, en glissant la pierre),
  puis se porte au **vestiaire** (bouton Skin de l'Équipe). Elle s'affiche partout : camp,
  équipe, combat, file des tours, fin de combat.

- **En combat**, une tenue a automatiquement toutes les **animations** du héros (élan, frappe,
  incantation, garde, choc : elles sont fabriquées à partir du sprite porté) et **ses propres
  effets et sons** (`SKIN_FX` dans `js/fx.js`). Seuls les visuels changent : la portée, les cibles
  et les dégâts restent ceux du héros. Les couleurs d'une tenue ne changent pas avec le rang.

  | Tenue | Attaque | Compétence | Son |
  |---|---|---|---|
  | Kael · En slip | coup d'épée en bois, étoiles qui tournent (sonné) | croix en bois et ronde d'étoiles | « bonk » |
  | Kael · Mineur cubique | coup de pioche, des blocs volent et retombent | croix de blocs pixel, pluie de cubes | « pop » |
  | Kael · Armure de diamant | lame cyan, éclats de diamant en losange | croix de diamant et éclats | lame, éclair |
  | Lyra · Pirate | boulet de canon en cloche avec fumée, explosion | gros boulet, onde de feu et fumée, la cible est sonnée | canon |
  | Elio · Pyjama | oreiller lancé, plumes | un **mouton** tombe sur chaque ennemi, avec des « Zzz » | « pop », bêlement |
  | Séra · Sorcière | fiole verte qui éclate en bulles | chaudron : bulles vertes et violettes qui montent sur l'équipe | bulles |
  | Volt · Livreur de pizza | une part de pizza (croûte, fromage, pepperoni) | livraison express : ruée rouge et blanche, parts qui volent | « bonk », néon |
  | Volt · Samouraï | coup de katana horizontal, pétales de cerisier | iaï : ruée éclair, coupe nette, pluie de pétales | lame |

- **Nouvelle tenue** : lui donner une ligne dans `SKIN_FX` (couleurs, effets, sons) ; les
  champs absents reprennent ceux du héros. Si l'effet n'existe pas, l'ajouter dans `FX` en
  respectant les règles des effets (pixels entiers, paliers, court, peu de pixels, un peu de
  blanc à la tête de l'effet), et en touchant les mêmes cibles que l'effet du héros (une
  compétence de zone touche toujours tous les ennemis).

## 2. Pop culture et clins d'œil : oui, à fond

Toutes les références sont bienvenues : jeux vidéo, films, séries, animés, mangas, BD, mèmes,
sports, métiers, fêtes. Quelques pistes :

| Héros | Idées |
|---|---|
| Kael (épéiste) | mineur cubique ✔, en slip ✔, armure de diamant ✔, plombier à casquette, chevalier Jedi, gladiateur, héros à la tunique verte |
| Lyra (archère) | pirate ✔, Robin des bois, chasseuse en tenue de survie, cow-girl, archère elfique |
| Elio (mage) | pyjama ✔, magicien à cicatrice et lunettes rondes, magicien gris au grand bâton, savant fou, Père Noël |
| Séra (prêtresse) | sorcière ✔, infirmière, princesse à la robe rose, reine des neiges, idole de concert |
| Volt (cyber-ninja) | livreur de pizza ✔, samouraï ✔, ninja à bandeau orange, hérisson bleu, chasseur de primes casqué |

✔ : tenue déjà dans le jeu.

**La seule règle d'adaptation** : on fait un **clin d'œil reconnaissable** (silhouette, couleurs,
accessoire culte), dessiné dans notre style. On ne recopie pas un sprite existant pixel par pixel
et on ne met pas de logo : on redessine en chibi 24×24, avec nos contours et nos textures. C'est ce
qui rend la référence drôle et la garde dans l'ambiance du jeu.

## 3. Lisible en 24×24

1. **Un trait culte suffit** : la tête carrée et le t-shirt turquoise font tout le mineur cubique,
   le croissant d'or fait le samouraï. Choisir 1 ou 2 éléments forts, pas 10 petits détails.
2. **Les couleurs de la référence** : c'est souvent ce qu'on reconnaît en premier.
3. **Un accessoire qui dépasse** (pioche, balai, bougie, boîtes à pizza) : il remplace l'arme et
   raconte la blague.
4. **Garder un bout du héros** quand c'est possible (cheveux de Kael, barbe d'Elio, mèches dorées
   de Séra), pour qu'on sache qui porte la tenue.
5. Vérifier sur la planche (`node tools/sheet.mjs`) : la référence doit se comprendre en petit.

## 4. Rareté

| Rareté | Pour quoi |
|---|---|
| Commune ★ | les blagues simples (en slip, pyjama, livreur) |
| Rare ★★ | les costumes et références bien travaillés (mineur cubique, pirate, sorcière) |
| Légendaire ★★★ | les tenues spectaculaires (armure de diamant, samouraï) : cape, étincelles, matière brillante |

## 5. Ajouter une tenue

1. Dans `js/sprites.js`, ajouter une entrée à `SKINS` : `{ id: 'heros-nom', hero: 'heros', name: 'Nom affiché', rarity: 'C' | 'R' | 'L' }`.
2. Dans `SKIN_DRAW`, écrire sa fonction de dessin : partir de `body(s, { … })` (tunique, jambes,
   bottes, ceinture aux couleurs de la tenue), puis dessiner la coiffe, le visage et l'accessoire.
3. Générer la planche et vérifier la lisibilité.
4. Lui donner ses effets de combat dans `SKIN_FX` (`js/fx.js`) et, si besoin, ses sons (`js/sfx.js`).
5. C'est tout : elle apparaît à l'autel des tenues, dans la collection et au vestiaire.
