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

## 3. Boucle de jeu

```
Combattre une étape → gagner de l'or → invoquer (gacha) → débloquer / obtenir des éclats
        ↑                                                        ↓
        └──────────── étapes plus dures ← améliorer le rang ←────┘
```

## 4. Personnages (version 1 : 5 personnages × 5 rangs)

| Perso | Classe | Rareté | Rôle | Compétence |
|---|---|---|---|---|
| Kael | Épéiste | Commune | dégâts mono-cible | **Taille croisée** : 200 % sur une cible |
| Lyra | Archère | Commune | contrôle | **Flèche sonnante** : 150 % + étourdit 1 tour |
| Elio | Mage | Rare | dégâts de zone | **Météore** : 110 % sur tous les ennemis |
| Séra | Prêtresse | Rare | soin | **Bénédiction** : soigne toute l'équipe (120 % ATQ) |
| Volt | Cyber-ninja | Légendaire | rafale | **Lame plasma** : 3 coups de 80 % sur des cibles au hasard |

- Statistiques : PV, ATQ, DÉF, VIT.
- Chaque compétence a un temps de recharge (en tours).
- **Rangs 1 → 5** : chaque rang multiplie les stats (×1 / ×1,2 / ×1,45 / ×1,75 / ×2,2)
  et change visiblement le sprite.
- Monter de rang coûte des **éclats** (doublons) + de l'or :

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

## 6. Combat

- Équipe de 1 à 3 persos contre 1 à 3 ennemis (ou un boss).
- Ordre des tours par VIT, à chaque manche.
- Tour d'un héros : des **boutons d'action rectangulaires**, bien séparés, apparaissent à côté de lui (Attaque,
  Compétence avec sa recharge, Garde = dégâts reçus divisés par 2 jusqu'à son prochain
  tour). On **glisse le doigt** dessus : l'action visée grossit et affiche sa description ;
  on relâche pour la choisir. Un simple toucher marche aussi.
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
- Victoire : or gagné (bonus au premier passage). Défaite : on peut réessayer.

## 7. Progression des étapes

- Étapes numérotées, sans fin. Boss moyen (Golem, 24×24) toutes les 5 étapes,
  gros boss (Dragon, 28×27) toutes les 10.
- Chapitres : 1–10 Prairie, 11–20 Crypte, 21–30 Volcan, puis le cycle recommence
  avec des ennemis plus forts.
- Ennemis : Slime, Gobelin, Squelette — variantes = même dessin, autre palette.
- Les ennemis gagnent +10 % de stats par étape.

## 8. Écrans

Ambiance : donjon en pixel art, chaleureux (pierre, bois, torches, parchemin).
Trois pièces côte à côte : **Équipe ← Camp → Invocation**. On passe de l'une à l'autre
en **balayant** l'écran (ou avec les flèches des coins), avec un glissement par paliers,
des traits de vent et un **son de vent**. Des points en bas indiquent la pièce.

1. **Camp** (accueil, au centre) : feu de camp, l'équipe autour, le cristal à droite,
   le panneau d'affichage à gauche (le cristal n'est que dans la salle d'invocation). Aucun bouton en bas : **on touche la porte** pour
   partir au combat (zoom vers la porte par paliers, son de zoom, fondu au noir). Toucher
   le panneau mène aussi à l'Équipe. En haut : or, rejouer une
   étape, coffre du jour, options.
2. **Équipe** (à gauche) : salle d'armes ; formation et héros à gauche, fiche du héros
   choisi à droite (stats en segments, compétence, Améliorer, Dans l'équipe / Retirer).
3. **Invocation** (à droite) : salle sans porte, le cristal posé sur une estrade au-dessus
   d'un cercle de runes qui s'illuminent, bougies, bannières violettes ; le parchemin à
   droite donne les taux, la jauge de pitié et les boutons ×1 / ×10.

## 9. Hors périmètre (plus tard)

Nouveaux personnages et classes (fantasy, moderne, imaginaire : aucune limite),
rangs 6–7 (mythril, obsidienne), équipements, événements, sons.
