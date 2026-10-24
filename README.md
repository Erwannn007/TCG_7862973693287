# Pixel Gacha

Jeu perso : combats au tour par tour + gacha de cartes, en pixel art dessiné en code.
Fait pour Safari iPhone (Partager → « Sur l'écran d'accueil »).

- Cahier des charges : [docs/CAHIER_DES_CHARGES.md](docs/CAHIER_DES_CHARGES.md)
- Direction artistique (règles absolues) : [docs/DIRECTION_ARTISTIQUE.md](docs/DIRECTION_ARTISTIQUE.md)

## Développement

Aucun build. Servir le dossier en local :

```sh
python3 -m http.server 8000
```

Outils (Node) :

- `node tools/sheet.mjs planche.png` : planche de tous les sprites, pour vérifier les dessins ;
- `node tools/make-icons.mjs` : régénère les icônes de l'écran d'accueil.
