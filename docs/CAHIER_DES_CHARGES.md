# Cahier des charges — Pixel Gacha Tactics

## 1. Vision

Un petit jeu **perso** : combats au tour par tour façon Pokémon / Final Fantasy,
mélangés à un **gacha de cartes à collectionner**. On invoque des personnages,
on les améliore avec les doublons, on monte une équipe de 3 et on enchaîne les étapes.

## 2. Plateforme

- Site statique publié sur **GitHub Pages** (aucun serveur, aucun build).
- Pensé pour **Safari iPhone**, ajouté à l'écran d'accueil (PWA) :
  plein écran, icône dédiée, fonctionne hors ligne (service worker).
- Se joue **à l'horizontale** (paysage). En portrait, un écran demande de tourner le téléphone.
- HTML + CSS + JavaScript natif (modules ES). Aucune dépendance externe.
- Or de départ : 1000 (une invocation ×10 possible dès le début).
- Sauvegarde locale dans le navigateur (`localStorage`).
- Direction artistique : voir [`DIRECTION_ARTISTIQUE.md`](DIRECTION_ARTISTIQUE.md) (règles absolues).
- Charte design (style de tous les écrans, sur le modèle du combat) : voir [`CHARTE_DESIGN.md`](CHARTE_DESIGN.md).

## 3. Boucle de jeu

```
Combattre (histoire, tour, infini) → or + XP (+ éclats à la tour) → invoquer / monter de niveau
        ↑                                                                  ↓
        └──────── étapes plus dures ← monter de rang (éclats + niveau max) ←┘
```

**Rythme visé : moyen-rapide.** On n'est jamais bloqué : si une étape résiste (le dragon…), la
tour des épreuves donne des éclats, de l'or et de l'XP à une difficulté qu'on choisit, et le
mode infini rapporte de l'or et de l'XP.

## 4. Personnages (5 rangs chacun)

| Perso | Classe | Rareté | Rôle | Compétence |
|---|---|---|---|---|
| Kael | Épéiste | Commune | dégâts mono-cible | **Taille croisée** : 200 % sur une cible |
| Lyra | Archère | Commune | contrôle | **Flèche sonnante** : 150 % + étourdit 1 tour |
| Elio | Mage | Rare | dégâts de zone | **Météore** : 110 % sur tous les ennemis |
| Séra | Prêtresse | Rare | soin | **Bénédiction** : soigne toute l'équipe (120 % ATQ) |
| Volt | Cyber-ninja | Légendaire | rafale | **Lame plasma** : 3 coups de 80 % sur des cibles au hasard |
| Brann | Chevalier | Commune | tank | **Provocation** : attire tous les coups 2 tours, dégâts reçus −30 % |
| Mira | Barde | Commune | soutien | **Ballade héroïque** : ATQ de l'équipe +30 % pendant 2 tours |
| Nina | Infirmière | Commune | soin | **Piqûre de rappel** : soigne l'allié le plus blessé (250 % ATQ) |
| Pip | Voleur | Commune | dégâts sur la durée | **Coupe-jarret** : 130 % + saignement 3 tours |
| Gus | Mineur | Commune | perce-armure | **Coup de pioche** : 170 %, ignore la DÉF |
| Lenny | Pompier | Commune | affaiblissement | **Lance à incendie** : 80 % sur tous, ATQ ennemie −25 % 2 tours |
| Vex | Vampire | Rare | vol de vie | **Morsure** : 180 %, rend 60 % des dégâts en PV |
| Gideon | Paladin | Rare | bouclier | **Égide** : bouclier sur l'équipe (150 % ATQ), 3 tours |
| Aurélia | Valkyrie | Légendaire | réanimation | **Chant du Valhalla** : relève un allié (50 % PV), sinon soigne |
| Nova | Super-héroïne | Légendaire | burst | **Poing météore** : 280 % + étourdit 1 tour |
| Rok | Bûcheron | Commune | exécution | **Abattage** : 160 %, double sous 40 % de PV |
| Tobo | Chef cuisinier | Commune | soin | **Ragoût maison** : soigne l'équipe (90 % ATQ) |
| Hugo | Boxeur | Commune | rafale | **Une-deux** : 2 coups de 110 % au hasard |
| Kiki | Cow-girl | Commune | rafale à distance | **Tir en rafale** : 3 tirs de 70 % au hasard |
| Bjorn | Viking | Commune | zone | **Tourbillon** : 100 % sur tous les ennemis |
| Sven | Pêcheur | Commune | contrôle | **Hameçon** : 150 % + étourdit 1 tour |
| Astra | Astronaute | Rare | zone | **Pluie de comètes** : 120 % sur tous les ennemis |
| Nyx | Nécromancienne | Rare | réanimation | **Rappel des morts** : relève un allié (35 % PV), sinon soigne |
| Ignis | Pyromancien | Rare | dégâts sur la durée | **Brasier** : 200 % + brûlure 3 tours |
| Drakon | Chevalier dragon | Légendaire | zone | **Souffle du dragon** : 130 % sur tous + brûlure 2 tours |
| Tess | Fermière | Commune | bouclier | **Botte de foin** : bouclier sur l'équipe (100 % ATQ), 2 tours |
| Doc | Médecin de peste | Commune | poison de zone | **Miasmes** : 50 % sur tous + poison 3 tours |
| Ozzy | Rockeur | Commune | contrôle de zone | **Larsen** : 50 % sur tous + étourdit 1 tour |
| Yuki | Cryomancienne | Commune | affaiblissement | **Pluie de glaçons** : 3 × 70 % au hasard, ATQ −15 % 2 tours |
| Sylva | Archère elfique | Rare | exécution | **Tir du crépuscule** : 170 %, double sous 50 % de PV |
| Thorn | Druide | Rare | soin | **Sève de vie** : soigne l'équipe (110 % ATQ) |
| Gorm | Orc barbare | Rare | rafale + vol de vie | **Frénésie** : 3 × 80 % au hasard, rend 25 % en PV |
| Zara | Danseuse | Rare | soutien | **Danse des sabres** : ATQ de l'équipe +40 %, 2 tours |
| Kitsune | Renarde à neuf queues | Légendaire | rafale + brûlure | **Feux follets** : 5 × 55 % au hasard + brûlure 2 tours |
| Sybil | Voyante | Légendaire | soutien | **Prophétie** : ATQ de l'équipe +40 % 2 tours + soin (80 % ATQ) |
| Grumli | Nain | Commune | tank | **Mur de pierre** : provocation 2 tours + se soigne (120 % ATQ) |
| Spike | Homme cactus | Commune | saignement de zone | **Pluie d'épines** : 60 % sur tous + saignement 2 tours |
| Bip | Robot | Commune | rafale | **Mitraille** : 4 × 50 % au hasard |
| Lulu | Boulangère | Commune | soin | **Pain chaud** : soigne l'allié le plus blessé (220 % ATQ) |
| DJ Max | DJ | Commune | soutien | **Le drop** : ATQ de l'équipe +25 % 2 tours + soin (40 % ATQ) |
| Pablo | Facteur | Commune | rafale à distance | **Courrier express** : 3 × 65 % au hasard |
| Bob | Zombie | Commune | poison | **Morsure contagieuse** : 130 % + poison 3 tours |
| Zip | Skateur | Commune | affaiblissement | **Ollie** : 140 %, ATQ de la cible −30 % 2 tours |
| Rexy | Enfant dino | Commune | vol de vie | **Croc-croc** : 150 %, rend 40 % en PV |
| Léo | Homme-lion | Rare | affaiblissement de zone | **Rugissement** : 80 % sur tous, ATQ −25 % 2 tours |
| Tonnerre | Super-héros | Rare | rafale | **Éclairs en chaîne** : 4 × 60 % au hasard |
| Ramsès | Pharaon momie | Rare | contrôle | **Bandelettes** : 140 % + étourdit 2 tours |
| Elixa | Alchimiste | Rare | bouclier + soin | **Élixir** : bouclier (120 % ATQ) 2 tours + soin (50 % ATQ) |
| Mako | Homme-requin | Rare | exécution | **Frénésie des abysses** : 150 %, double sous 50 % + saignement |
| Pixel | Hackeuse | Rare | perce-armure | **Piratage** : 3 × 60 % au hasard, ignore la DÉF |
| Lumi | Chevalière au sabre | Rare | rafale | **Sabre de lumière** : 3 × 75 % au hasard |
| Kero | Grenouille ninja | Rare | poison | **Langue venimeuse** : 150 % + poison 3 tours |
| Atlas | Méca-gardien | Légendaire | tank + bouclier | **Protocole forteresse** : bouclier (200 % ATQ) 3 tours + provocation 2 tours |
| Pyra | Phénix | Légendaire | zone + soin | **Renaissance** : 100 % sur tous + brûlure, puis soigne l'équipe (60 % ATQ) |
| Mortis | Roi-liche | Légendaire | zone + vol de vie | **Hiver éternel** : 100 % sur tous, ATQ −30 % 2 tours, rend 20 % en PV |
| Shoto | Glace et feu (MHA) | Rare | zone | **Glace et feu** : 100 % sur tous + brûlure 2 tours, ATQ −20 % 2 tours |
| Bakugo | Explosion (MHA) | Rare | burst | **Howitzer Impact** : 240 % sur une cible |
| Red Riot | Durcissement (MHA) | Rare | tank | **Roc indestructible** : provocation 2 tours + bouclier sur lui (150 % ATQ) |
| Deku | One For All (MHA) | Légendaire | burst | **Detroit Smash** : 250 %, double sous 50 % de PV |
| All Might | Symbole de la paix (MHA) | Légendaire | zone + contrôle | **United States of Smash** : 140 % sur tous + étourdit 1 tour |
| Gon | Renforcement (HxH) | Rare | burst + contrôle | **Jajanken : Pierre !** : 230 % + étourdit 1 tour |
| Kirua | Assassin (HxH) | Rare | multi + contrôle | **Godspeed** : 3 éclairs de 70 % au hasard, chacun étourdit 1 tour |
| Hisoka | Magicien (HxH) | Rare | burst + affaiblissement | **Bungee Gum** : 200 %, ATQ de la cible −30 % 2 tours |
| Netero | Président (HxH) | Légendaire | multi | **Hyakushiki Kannon** : 6 coups de 55 % au hasard |
| Meruem | Roi des fourmis (HxH) | Légendaire | zone + vol de vie | **Colère du roi** : 130 % sur tous, ignore la DÉF, rend 25 % en PV |

**55 héros** : les 5 premiers + 50 nouveaux (25 Communes, 17 Rares, 8 Légendaires), ajoutés par vagues de 10.
Plus 5 clins d'œil à My Hero Academia et 5 à Hunter × Hunter (3 Rares, 2 Légendaires chacun) : **65 héros** en tout.

**Statuts de combat** (comptés en tours de celui qui les porte, ils s'usent à la fin de son tour) :
poison, brûlure, saignement (dégâts au début de son tour, sans tenir compte de la DÉF ; un même
statut se renouvelle au lieu de se cumuler), bonus d'ATQ, malus d'ATQ, bouclier (encaisse avant
les PV, ligne cyan sur la jauge), provocation (les ennemis le visent, −30 % de dégâts reçus).
Réanimation : l'allié se relève avec une part de ses PV max. Le détail des types de compétence est
en tête des nouveaux héros dans `js/data.js`.

- Statistiques : PV, ATQ, DÉF, VIT.
- Chaque compétence a un temps de recharge (en tours).
- **Rangs 1 → 5** : chaque rang multiplie les stats (×1 / ×1,2 / ×1,45 / ×1,75 / ×2,2)
  et **fait évoluer le héros à sa façon** : chaque héros a ses 5 rangs à lui, avec un nom propre
  (Recrue → Lame de feu pour Kael, Renardeau → Kyūbi pour Kitsune, Toshinori → Golden Age pour
  All Might…) et un dessin qui raconte son histoire. Aucun ajout commun à tous (plus de métal du
  rang, d'épaulières, de couronne ni d'ailes pour tout le monde) ; au rang 5, chacun a un grand
  décor à lui derrière lui. Détail : [direction artistique](DIRECTION_ARTISTIQUE.md#4-progression-des-rangs).
- **Niveaux (XP)** : chaque combat donne de l'XP à tous les héros de l'équipe (30 + 6 × niveau
  du combat ; 40 % en cas de défaite). Chaque niveau ajoute **+2,5 %** aux stats. Le rang fixe le
  **niveau maximum : 10 × rang** (10, 20, 30, 40, 50). Passer du niveau L au suivant coûte
  20 + 10 × L XP.
- **Rang max actuel : 5. Trois rangs de plus sont prévus (jusqu'au rang 8)** : niveau max 80,
  à dessiner pour chaque héros, toujours à sa façon. Tout est paramétré par `MAX_RANK`,
  `RANK_MULT`, `RANK_TITLES` (noms des rangs de chaque héros), `UPGRADE` (`js/data.js`).
- Monter de rang demande d'être au **niveau maximum du rang**, plus des **éclats** (doublons à
  l'invocation, ou salle des éclats de la tour) et de l'or :

  | Passage | Éclats | Or |
  |---|---|---|
  | 1 → 2 | 1 | 100 |
  | 2 → 3 | 2 | 250 |
  | 3 → 4 | 3 | 500 |
  | 4 → 5 | 5 | 1000 |

## 5. Gacha

- Invocation ×1 : **100 or** — ×10 : **900 or**.
- Taux : Commune 60 % · Rare 32 % · Légendaire 8 %.
- **Pitié** : Légendaire garantie au bout de 40 invocations sans Légendaire.
- Une invocation ×10 contient au moins une Rare.
- Nouveau perso → débloqué. Doublon → +1 éclat.
- Révélation animée carte par carte, avec un dos de carte qui « trahit » la rareté
  (clignotements par paliers, plus intenses pour une Légendaire).

### Tenues (skins)

> Thèmes, pop culture et méthode pour en créer : voir [`SKINS.md`](SKINS.md).

- Une tenue **remplace entièrement le dessin** d'un héros, **quel que soit son rang** (rang 1 ou
  rang 5 : même allure). Aucune limite de thème : chevalier en slip, mineur cubique, samouraï…
- Elles s'obtiennent à l'**autel des tenues** : sur la page Invocation, on fait glisser la pierre
  de droite à gauche ; seule la pierre glisse et laisse place à un cristal vert, avec des
  vêtements éparpillés au sol et un portant ; toutes les pancartes et la plaque tombent, les
  nouvelles tombent du haut. On revient en glissant dans l'autre sens. Sous la pierre, deux points
  grisâtres indiquent l'autel affiché ; sous le doigt, ils grossissent et blanchissent.
- Tenue ×1 : **150 or** — ×10 : **1350 or** (au moins une Rare). Mêmes taux que les héros,
  sans pitié. Doublon → **+50 or**.
- On les essaie puis on les porte au **vestiaire** (bouton Skin de l'Équipe). La tenue portée
  s'affiche partout : camp, équipe, combat, file des tours, fin de combat.
- Première collection (8) : Kael *En slip* (C), *Mineur cubique* (R), *Armure de diamant* (L) ;
  Lyra *Pirate* (R) ; Elio *Pyjama* (C) ; Séra *Sorcière* (R) ; Volt *Livreur de pizza* (C),
  *Samouraï* (L). Une nouvelle tenue = une entrée dans `SKINS` et son dessin dans
  `js/sprites.js`.

## 6. Combat

- Équipe de 1 à 3 persos contre 1 à 3 ennemis (ou un boss).
- Ordre des tours par VIT, à chaque manche.
- Tour d'un héros : des **boutons d'action rectangulaires**, bien séparés, apparaissent à côté de lui (Attaque,
  Compétence avec sa recharge, Garde = dégâts reçus divisés par 2 jusqu'à son prochain
  tour). On **glisse le doigt** dessus : l'action visée grossit et affiche sa description ;
  on relâche pour la choisir. Un simple toucher marche aussi. Les boutons lévitent
  doucement (sauts d'1 px, décalés), avec leur ombre au sol.
- Pour une attaque ciblée, des coins de visée apparaissent sur les ennemis : on touche
  celui qu'on veut (ou Annuler). S'il ne reste qu'un ennemi, la cible est automatique.
- En haut : nom de l'étape, **ordre des tours** (portraits), boutons Auto / ×2 / Fuir.
- Options : **Auto** (l'IA joue les héros) et **×2** (vitesse).
- **Sons** 8 bits générés en direct (Web Audio, ondes carrées + bruit) : touches,
  coups, critiques, soins, mort, victoire, défaite, révélations du gacha, montée de rang.
- **Vibration** à chaque touche : `navigator.vibrate` sur Android ; sur iPhone, astuce
  non officielle (interrupteur `<input switch>` caché) qui déclenche le retour haptique
  du système, et qui peut cesser de marcher si Apple change Safari.
- Le son utilise `navigator.audioSession.type = 'playback'` pour ne pas être coupé
  par le bouton silencieux de l'iPhone.
- Sons et vibrations se coupent séparément depuis l'écran Combat.
- Dégâts = ATQ × multiplicateur × (1 − DÉF / (DÉF + 60)) × aléa 0,9–1,1, coup critique 10 % (×1,5).
- Victoire : or gagné (bonus au premier passage). Défaite : on peut réessayer. La fin de combat est une plaque de bois qui tombe sur le champ de bataille (dorée pour une victoire), avec l’équipe, l’or qui se compte et les choix en pancartes (Étape suivante / Réessayer, Camp).

## 7. Progression des étapes

- Étapes numérotées, sans fin. Boss moyen (Golem, 24×24) toutes les 5 étapes,
  gros boss (Dragon, 28×27) toutes les 10.
- Chapitres : 1–10 Prairie, 11–20 Crypte, 21–30 Volcan, puis le cycle recommence
  avec des ennemis plus forts.
- Ennemis : Slime, Gobelin, Squelette — variantes = même dessin, autre palette.
- Les ennemis gagnent +10 % de stats par étape.

**Auto et vitesse** sont conservés d'un combat à l'autre (et sauvegardés). Sur l'écran de fin,
les outils restent accessibles : toucher Auto le rallume et relance aussitôt (étape suivante,
réessayer, recommencer, vague suivante) ; si Auto est déjà actif, une victoire relance toute
seule après un compte à rebours de 3 (jamais après une défaite, pour ne pas perdre en boucle).

## 7 bis. Modes de jeu

Derrière la porte du camp, trois modes. On passe de l'un à l'autre en **faisant glisser la porte
de bas en haut** (de haut en bas pour revenir) : l'intérieur de la porte change, les pancartes
explosent en copeaux et celles du nouveau mode tombent du ciel. Sous le ruban, trois points
grisâtres montrent le mode affiché ; ils grossissent et blanchissent sous le doigt.

Le ruban du mode est en haut de l'écran, pour laisser la porte dégagée ; la porte rayonne de la
lumière de son mode (halo sur le mur, flaque au sol, rais bleus pour la tour, particules aspirées
pour l'infini, braises pour l'histoire).

| Mode | Porte | Principe |
|---|---|---|
| **Histoire** | obscurité | les étapes à la suite (toucher la porte, ou « Combattre ») ; « Rejouer » une étape gagnée |
| **Tour des épreuves** | escalier de lumière bleue | salles rejouables : **éclats** (d'un héros au choix, +1/+2/+3), **trésor** (or), **entraînement** (beaucoup d'XP). Difficulté Facile (niveau ≈ moitié de la meilleure étape), Normal (meilleure étape), Difficile (+4). **5 clés par jour**, une clé dépensée par victoire seulement |
| **Mode infini** | tourbillon violet | des vagues sans fin, de plus en plus dures (golem toutes les 5, dragon toutes les 10) ; les PV restent d'une vague à l'autre (+25 % de soin) ; or et XP à chaque vague ; « Remonter » garde le butin ; record enregistré |

Les choix (salle, héros, difficulté) se font en pancartes, avec la même explosion / chute entre
chaque étape. La fin de combat affiche l'or, l'XP, les montées de niveau et les récompenses du mode.

## 8. Écrans

Ambiance : donjon en pixel art, chaleureux (pierre, bois, torches, parchemin).
Trois pièces côte à côte : **Équipe ← Camp → Invocation**. On passe de l'une à l'autre
en **balayant** l'écran (ou avec les flèches des coins), avec un glissement par paliers,
des traits de vent et un **son de vent**. Des points en bas indiquent la pièce.

1. **Camp** (accueil, au centre) : feu de camp, l'équipe autour, le panneau
   d'affichage à gauche (le cristal n'est que dans la salle d'invocation). Aucun bouton en bas : **on touche la porte** pour
   partir au combat (zoom vers la porte par paliers, son de zoom, fondu au noir). Toucher
   le panneau mène aussi à l'Équipe. En haut : or, rejouer une
   étape, coffre du jour, options.
2. **Équipe** (à gauche) : salle d'armes. Au milieu, **trois socles numérotés 1-2-3** :
   l'équipe, dans l'ordre du combat, avec un socle vide en pointillés s'il reste de la place.
   Les socles forment un **carrousel** : le héros choisi est devant, au milieu, sous un rai de
   lumière ; les deux autres sont en retrait, dans la pénombre. Toucher un héros fait tourner
   le carrousel pour l'amener devant.
   À gauche, une petite plaque de bois par héros (dorée pour celui qu'on regarde, badge 1-2-3
   pour l'équipe, « UP » s'il peut monter de rang) ; un héros pas encore obtenu est un **avis de
   recherche** en parchemin cloué de travers (« Recherché », silhouette, ???). Un héros déjà dans
   l'équipe est en bois sombre avec « sur le socle N » : on ne peut plus le prendre dans la
   colonne (la plaque refuse et son socle s'allume) ; on le touche et on le déplace sur son socle. On organise l'équipe **en glissant** :
   - d'une plaque vers un socle : le héros rejoint l'équipe (ou remplace celui qui y est) ;
   - d'un socle à un autre : les deux héros échangent leurs places ;
   - d'un socle vers la colonne : le héros quitte l'équipe (il en faut toujours un).

   Pendant le glisser, le héros suit le doigt en se balançant, les socles s'allument et celui
   qui est visé reçoit un rai de lumière ; au dépôt, il atterrit dans un éclat. Un simple
   toucher choisit le héros : sa fiche s'affiche à droite sur une plaque de bois (rang, place,
   stats, compétence, aperçu des 5 rangs) et ses pancartes jaillissent de lui en arc comme en
   combat : « Améliorer » et « Skin ». Skin ouvre le vestiaire : les autres héros sortent de la
   salle, les socles éclatent, le héros se place au centre (s'il n'est pas dans l'équipe, toute
   l'équipe sort et il tombe du ciel au centre), la fiche tombe et une plaque
   « Vestiaire » prend sa place : une liste de skins qu'on fait défiler de haut en bas ; toucher
   un skin l'essaie sur le héros (aucun skin pour l'instant, seulement la tenue d'origine et des
   emplacements « Bientôt » ; un skin = une table de recoloration dans `SKINS`) ; pour un héros hors de l'équipe, elles
   sortent de sa plaque. Monter de rang : la magie dorée converge vers le héros, il
   s'illumine, la salle tremble.
3. **Invocation** (à droite) : salle sans porte, bannières violettes. L'autel : un grand
   cristal facetté qui flotte au-dessus d'un socle de pierre gravé de runes, avec trois éclats
   en orbite, un cercle de runes au sol, des bougies, un rai de lumière et de la poussière de
   magie. Il est centré entre le bord gauche et deux grandes pancartes en arc (×1 / ×10),
   elles-mêmes centrées entre le haut et le bas de l'écran ;
   une plaque de bois flottante, du haut jusqu'en bas à droite, donne les héros, les taux et
   la jauge de pitié. Choisir une pancarte lance un rituel (salle assombrie, magie qui
   converge, tremblement, éclair) puis la révélation : dos en bois frappés du cristal, faces
   en pancartes verticales (héros dans une fenêtre, nom sur un ruban), éclat selon la rareté.

### Mode admin (Options → Admin)

Pour tester : **Tout débloquer** (tous les héros au rang 5 et niveau max, toutes les tenues,
999 999 or, clés pleines), **Rang des héros** (tous au rang 1 à 5, pour voir chaque dessin),
**+100 000 or**, **Clés**. La vraie partie est mise de côté avant la première triche :
**Ma partie** la remet telle quelle.

## 9. Hors périmètre (plus tard)

Rangs 6 à 8 (mythril, obsidienne…), équipements, événements, nouvelles salles de tour.
