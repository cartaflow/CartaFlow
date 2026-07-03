# CartaFlow

CartaFlow est une application permettant de gérer des *listes* de *cartes*.


## Workflow

1. L'utilisateur, préalablement authentifié, crée une liste définie par un
   titre (au minimum), une description falcultative et d'autres paramètres.
2. Il peut ensuite ajouter des cartes dans cette liste. Une carte est définie
   par :
    - son auteur
    - son titre
    - sa description (Markdown)
    - une URL
    - ses tags
    - une date de création
    - une date de modification
3. Lorsque l'utilisateur retourne sur sa liste, il:
    - voit toutes les cartes présentes
    - peut utiliser un champ de recherche basé sur le titre et la description
      des cartes
    - peut cliquer sur chaque tags individuellement pour filtrer la liste
    - choisir la disposition des cartes (par date, titre, etc.)
    - peut ajouter une carte
    - peut importer / exporter des cartes dans une liste


## Autre fonctionnalités

- Pour chaque liste, le propriétaire peut définir un modèle (texte) de 
  description qui sera utilisé à la création d'une carte.
- Les cartes peuvent contenir des images et des URL. La description des cartes
  est faite en Markdow.
- On doit pouvoir dupliquer des cartes facilement.
- Pour le moment toutes les listes et cartes sont publiques, mais on prévoit que
  certaines listes et/ou carte puissent avoir une visibilité limitée.
- Il en découle que le propriétaire d'une liste doit être en mesure de supprimer
  les cartes de sa liste ajoutées par d'autres utilisateur.
- Si la contient une URL, alors on peut l'utiliser pour:
  - Mettre un lien sur la carte afin qu'on puisse cliquer dessus
  - Récupérer une image pour la carte (Open Graph, favicon)
- Les visiteurs d'une liste peuvent proposer de nouvelles cartes qui, en 
  fonction des paramètres de la liste, sont directement visibles ou doivent être
  acceptées avant de pouvoir être visibles.
- Dans une évolution, les visiteurs peuvent dupliquer (forker) une liste et 
  ensuite proposer facilement des cartes à la liste parente ou d'autres listes.
