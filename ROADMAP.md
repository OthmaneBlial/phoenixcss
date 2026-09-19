# PhoenixCSS — audit et roadmap de publication

État de référence de l'audit : 19 septembre 2026, branche locale **main**, commit **f23ae32**. Les constats initiaux ci-dessous restent un instantané ; les lignes **Suivi** et les cases reflètent les validations effectuées depuis. Ce document ne garantit ni publication, ni adoption, ni nombre de stars.

## 1. Ce qui existe réellement

| Domaine | Constat vérifié |
| --- | --- |
| Produit | Bibliothèque Sass/CSS sans dépendance JavaScript à l'exécution. Entrée Sass dans **src/sass/_index.scss** ; styles de typographie, formulaires, boutons, cartes, tables, grille, utilitaires, navigation, modale et layout. Variables CSS émises sur la racine. |
| Distribution | **package.json** annonce la version 1.0.0 et un point d'entrée dans **dist/css/phoenix.css**. **dist/** est ignoré et absent du checkout. Le paquet obtenu par **npm pack --dry-run** dans le dépôt ne contient aucun fichier CSS compilé : son point d'entrée manque. La requête publique au registre npm pour **phoenixcss** répond 404 lors de cet audit ; cela ne démontre pas la disponibilité future du nom. |
| Build | Avec Node 25.9.0 et npm 11.12.1, **npm ci** puis **npm run build** réussissent dans une copie temporaire. Le CSS non minifié pèse 34 061 octets ; **phoenix.min.css** pèse 89 743 octets, dont environ 63 793 octets de source map inline. L'avertissement Browserslist signale des données vieilles de 23 mois. |
| Tests et sécurité | **npm test** affiche « No tests specified » puis sort avec succès. Aucun test, lint, matrice de navigateurs ou workflow GitHub Actions n'est présent. Un **npm audit** sur la copie installée remonte 13 avis dans les dépendances de développement, dont 10 de sévérité haute ; **npm audit --omit=dev** en remonte 0. Ce résultat est daté et doit être réévalué avant release. |
| Documentation et UX | **docs/index.html** est une page de 894 lignes avec des exemples et du JavaScript local. Elle charge **../dist/css/phoenix.min.css**, introuvable dans le checkout et incompatible avec une publication du seul dossier **docs/**. La page annonce une modale interactive, mais ne gère pas Échap, le retour du focus ou le dialogue accessible. Son exemple de layout ajoute une seconde sidebar fixe et un footer fixe. Aucun rendu navigateur complet n'a été validé pendant cet audit. |
| GitHub et site | Le dépôt public contient un seul commit, aucun tag, aucune release et aucun workflow exposé par l'API GitHub au moment du contrôle. La configuration Pages n'est pas accessible via l'API (404). Le lien de documentation du README vers **www.othmaneblial.xyz/phoenixcss** ne résout pas en DNS lors de cet audit. Le dépôt n'a ni captures d'écran, ni **CONTRIBUTING.md**, malgré le lien du README, ni changelog, ni modèles d'issues. |

### Écarts fonctionnels précis

- La promesse « semantic HTML » reste partielle : la base stylise certains éléments natifs, tandis que les boutons, cartes, grille, navigation, champs avancés et layouts exigent des classes. Le reset enlève les puces de toutes les listes et le soulignement de tous les liens, ce qui peut diminuer la lisibilité d'un contenu HTML brut.
- La promesse « Theming Support: Easily switch between different color schemes » du README n'est pas démontrée : il existe des variables CSS modifiables, mais aucun thème clair/sombre livré, aucun mécanisme de bascule et aucun exemple complet. Les variables Sass ne sont pas déclarées configurables par l'API Sass.
- Plusieurs media queries utilisent **var(--breakpoint-...)** dans leur condition, ce qui ne peut pas servir de seuil de media query CSS. Les fichiers **_display.scss** et **_visibility.scss** répètent les mêmes classes responsive. La navigation masque sa liste à partir de 600 px via un mixin **min-width**, alors que le comportement mobile attendu est inverse ; le layout de sidebar a la même inversion. Les classes **.col-4** restent à un tiers sur petit écran et le gutter ne cible que les enfants **.col**.
- La classe **.align-baseline** reçoit deux sens différents, alignement flex et alignement vertical. Des noms génériques comme **.sidebar**, **.footer** et **.main-content** imposent des comportements de page entiers et peuvent entrer en conflit avec un site hôte.
- Le texte blanc sur les fonds actuels des boutons primaire, secondaire et danger donne environ **3,16:1**, **2,78:1** et **3,68:1** respectivement, sous le seuil WCAG AA de **4,5:1** pour du texte normal. Le chevron SVG du select est blanc sur fond blanc. Les effets de focus utilisent un violet fixe sans rapport avec les tokens. Les animations ne respectent pas encore la préférence de réduction du mouvement.
- La démo de navigation ne présente aucun bouton de bascule ; la modale dépend d'un script inclus dans la page de docs, et la bibliothèque ne fournit pas de comportement JavaScript documenté. Les scripts et CSS Prism sont chargés depuis un CDN sans intégrité SRI ni stratégie locale de secours.

### Positionnement à retenir

Le segment visé par le README est déjà servi par des projets reconnus. [Pico CSS](https://github.com/picocss/pico) documente une variante sans classes, les thèmes, Sass et des composants ; [Water.css](https://github.com/kognise/water.css) propose une feuille directement utilisable sans classes et des thèmes ; [MVP.css](https://github.com/andybrewer/mvp) mise aussi sur le HTML sémantique sans classes. Ces sources situent seulement les alternatives ; tous les constats sur PhoenixCSS ci-dessus proviennent du dépôt audité. PhoenixCSS ne doit donc pas se présenter comme « un autre framework minimal » sans preuve comparative.

Hypothèse de positionnement à valider : **une base CSS progressive pour pages de contenu, prototypes et petites interfaces, utilisable d'abord avec HTML sémantique, puis extensible par quelques classes optionnelles de layout et composants, sans JavaScript obligatoire**. La différenciation doit être prouvée par la qualité des valeurs par défaut, l'accessibilité, la personnalisation, la taille réelle du CSS et un parcours d'installation très court. Les comparaisons de performance, de taille et de compatibilité restent à mesurer sur les mêmes exemples, versions et conditions ; aucune supériorité n'est affirmée ici.

## 2. Règles de suivi et critères de sortie

- **P0** : empêche une première release crédible ; **P1** : nécessaire à la version publique soignée ; **P2** : améliore l'adoption après stabilisation. L'ordre des phases prime sur la priorité locale.
- Pour chaque tâche, conserver dans la PR ou le compte rendu les commandes, versions, résultats et captures utiles. Une compilation qui passe n'est pas une validation de rendu, d'accessibilité ou de publication.
- Ne cocher une tâche qu'après ses critères d'acceptation. Marquer séparément **validé localement**, **vérifié publiquement** et **bloqué par un accès externe**. Ne pas annoncer une version, un site, un paquet ou un téléchargement avant inspection de la ressource réellement publiée.
- Toute évolution des classes et du rendu global avant la première release demande un exemple de migration. Le numéro 1.0.0 actuel est une valeur de manifeste, pas une preuve de stabilité ou de release.
- La phase vidéo est la dernière. Elle ne commence qu'après implémentation **et** validation des phases 0 à 6, y compris leurs contrôles publics lorsqu'une publication fait partie du plan.

## Phase 0 — Contrat produit et référence mesurée

### 0.1 [P0] Définir la promesse et l'API publique

- [ ] **Suivi :** Contrat rédigé ; lecture indépendante par deux développeurs encore à obtenir.
- **Objectif :** rendre évident à qui sert PhoenixCSS et ce que la feuille garantit.
- **Changements :** retenir deux ou trois cas d'usage réels (page de documentation, article/formulaire, petite landing page) ; préciser ce qui fonctionne avec HTML nu et les classes réellement optionnelles ; écrire les limites, les navigateurs cibles et la politique de compatibilité ; supprimer ou reporter les promesses non tenues.
- **Fichiers/parties :** **README.md**, **docs/index.html**, nouveau **docs/PRODUCT.md** ou section équivalente, contrat des sélecteurs de **src/sass/**.
- **Acceptation :** une personne peut choisir le bon point d'entrée en moins de deux minutes ; chaque phrase de la liste de fonctionnalités renvoie à un exemple exécuté ou un test ; aucun « thème », « accessible » ou « responsive » générique sans périmètre précis.
- **Validation :** faire reconstruire les cas d'usage par deux lecteurs externes au code, noter les confusions, contrôler manuellement chaque revendication.
- **Dépendances/risques :** préalable à toutes les autres phases ; risque de périmètre trop large face à Pico, Water et MVP.

### 0.2 [P0] Établir les mesures initiales et le budget de release

- [x] **Suivi :** Validation locale : mesures et hashes identiques sur deux exécutions ; fixture HTML identique pour les quatre feuilles.
- **Objectif :** décider sur des nombres reproductibles plutôt que sur « lightweight ».
- **Changements :** script de mesure des octets bruts et gzip des variantes CSS, inventaire des sélecteurs, temps de build, exemple identique comparé aux alternatives pertinentes ; fixer ensuite un budget pour la variante de base et la variante complète. Conserver les sources et versions comparées.
- **Fichiers/parties :** nouveaux **scripts/measure.mjs** et **docs/COMPARISON.md** ; **package.json**.
- **Acceptation :** un seul script reproduit le tableau depuis un checkout propre ; aucun chiffre concurrent n'est publié sans version, URL et méthode ; le budget choisi correspond au besoin produit.
- **Validation :** exécuter deux fois le build et les mesures sur le même environnement ; comparer les sorties et documenter les écarts.
- **Dépendances/risques :** suit 0.1 ; ne pas optimiser le nombre d'octets au détriment du contraste, du focus ou de la lisibilité du CSS.

## Phase 1 — Corriger le comportement et l'accessibilité du CSS

### 1.1 [P0] Réparer les breakpoints, la grille et les utilitaires responsive

- [ ] **Suivi :** correctifs Sass compilés et convention documentée ; la grille de la page complète a été mesurée dans Chrome à 320, 375, 600, 768, 992, 1200 et 1440 px, avec empilement sous 600 px et sans débordement. Offsets, autres utilitaires, captures et autres moteurs restent à contrôler.
- **Objectif :** obtenir des layouts prévisibles du téléphone au bureau.
- **Changements :** compiler les seuils Sass en valeurs CSS valides dans les media queries ; définir une convention mobile first unique ; corriger l'inversion des règles de navigation/sidebar ; garantir des colonnes empilées par défaut puis les variantes aux bons seuils ; appliquer les gutters à tous les types de colonnes ; supprimer la duplication display/visibility.
- **Fichiers/parties :** **src/sass/helpers/_mixins.scss**, **helpers/_variables.scss**, **grid/_grid.scss**, **components/_nav.scss**, **layout/_header.scss**, **layout/_sidebar.scss**, **utilities/_display.scss**, **utilities/_visibility.scss**.
- **Acceptation :** aucune media query construite avec **var()** ; la grille 12 colonnes et les offsets ont le comportement documenté à 320, 600, 768, 992 et 1200 px ; navigation et sidebar ne masquent pas le contenu par surprise.
- **Validation :** vérification des media queries compilées, tests de cascade, captures et parcours à chaque largeur, contrôle d'absence de débordement horizontal.
- **Dépendances/risques :** après 0.1 ; changement visuel potentiellement incompatible avec les utilisateurs actuels, à annoncer dans les notes de migration.

### 1.2 [P0] Rendre la base sémantique réellement utilisable

- [ ] **Suivi :** correctifs de la base compilés ; pages guide et formulaire inspectées dans Chrome, table exposée dans l'arbre d'accessibilité Safari et guide avant/après sur le même DOM vérifié. Trois pages sans débordement à 320, 375, 768 et 1440 px dans Chrome ; clavier complet et lecteur d'écran à compléter.
- **Objectif :** une page HTML de contenu reste lisible et navigable après ajout d'une seule feuille.
- **Changements :** revoir le reset des listes et des liens ; harmoniser typographie, formulaires natifs, tables et code ; éviter que les sélecteurs globaux **form**, **label**, **input** et **button[type=submit]** imposent une mise en page inadéquate à tous les sites ; décider quelles règles appartiennent au cœur sans classes.
- **Fichiers/parties :** **src/sass/base/_reset.scss**, **elements/_typography-elements.scss**, **elements/_forms.scss**, **elements/_tables.scss**, **form/** ; exemples de **docs/**.
- **Acceptation :** les trois cas d'usage de 0.1 restent compréhensibles avec HTML natif seul ; les liens sont reconnaissables, les listes conservent leur sens, les tableaux étroits restent exploitables sans sacrifier leurs en-têtes.
- **Validation :** comparer rendu avant/après sur pages réelles ; navigation clavier et lecture d'un tableau au lecteur d'écran ; audit d'overflow.
- **Dépendances/risques :** après 0.1 et 1.1 ; risque de modifier les attentes de sites existants, à documenter.

### 1.3 [P0] Corriger couleurs, focus et contrôles

- [ ] **Suivi :** palette et contraste des paires principales mesurés dans le CSS compilé ; focus clavier et select contrôlés dans Safari. Le nouveau formulaire montre une erreur textuelle près du champ invalide, puis un état valide local dans Chrome. Audit de tous les états, moteurs, zoom et lecteur d'écran encore à faire.
- **Objectif :** rendre les composants critiques utilisables par tous, y compris sans souris.
- **Changements :** recalculer les tokens pour satisfaire le contraste AA du texte normal ; utiliser des états focus visibles cohérents ; corriger le chevron du select ; vérifier états hover, disabled, erreur, checkbox et radio ; respecter **prefers-reduced-motion** ; ne pas coder la couleur comme seul signal d'erreur.
- **Fichiers/parties :** **src/sass/helpers/_variables.scss**, **components/_buttons.scss**, **form/_selects.scss**, **form/_checkboxes.scss**, **form/_radios.scss**, **form/_inputs.scss**, **components/_modals.scss**, **base/_reset.scss**.
- **Acceptation :** contrastes d'au moins 4,5:1 pour le texte normal et 3:1 pour les composants/états concernés ; focus toujours visible ; tous les contrôles fonctionnent au clavier ; mouvement réduit respecté.
- **Validation :** calcul automatisé des palettes, axe ou équivalent sur les exemples, tests manuels clavier/zoom 200 %, captures clair/sombre si le mode sombre est retenu.
- **Dépendances/risques :** dépend des tokens de la phase 2 pour la solution finale ; commencer par les couleurs bloquantes, puis stabiliser la palette. Un audit automatique ne remplace pas le contrôle manuel.

### 1.4 [P0] Choisir un contrat d'interaction honnête pour navigation et modale

- [ ] **Suivi :** démo migrée vers `dialog` natif et script séparé ; ouverture, Échap et retour du focus contrôlés dans Safari et Chrome ; menus et sidebar fermée contrôlés dans Safari et Chrome, y compris à 320 px. Lecteur d'écran et tests automatisés à traiter.
- **Objectif :** ne pas présenter des composants interactifs qui paraissent fonctionnels mais restent incomplets.
- **Changements :** pour la modale, privilégier **dialog** natif ou documenter un petit script optionnel : nom accessible, ouverture, fermeture par Échap, focus initial et restitué, confinement du focus selon le pattern retenu. Pour la navigation, ajouter un vrai bouton avec état développé, contrôle clavier et comportement responsive. Séparer clairement CSS et JavaScript de démonstration.
- **Fichiers/parties :** **src/sass/components/_modals.scss**, **components/_nav.scss**, **docs/index.html**, éventuel **docs/demo.js**.
- **Acceptation :** ouverture/fermeture à la souris et au clavier ; aucun élément caché ne reçoit le focus ; une page consommatrice sait exactement quel code est fourni et quel code doit être ajouté.
- **Validation :** parcours Tab, Maj+Tab, Entrée, Espace et Échap ; tests sur au moins deux navigateurs et lecteur d'écran ; automatisation des scénarios principaux.
- **Dépendances/risques :** suit 1.1 et 1.3 ; le CSS seul ne fournit pas l'interaction d'une modale, donc limiter la promesse si aucun JS n'est distribué.

### 1.5 [P1] Réduire les collisions de classes et de cascade

- [ ] **Suivi :** classes structurelles préfixées, conflit `.align-baseline` levé et fixture hôte inspectée dans Safari ; collisions restantes des composants/utilitaires génériques et matrice navigateur à examiner.
- **Objectif :** faciliter l'ajout de PhoenixCSS dans un site existant.
- **Changements :** décider du préfixe ou des variantes scopées pour les classes génériques de layout et les utilitaires ; résoudre **.align-baseline** ; clarifier l'ordre de cascade entre styles natifs, composants et utilitaires ; documenter les exceptions utilisant **!important**.
- **Fichiers/parties :** **src/sass/layout/**, **utilities/**, **grid/**, **components/**, **docs/PRODUCT.md**, guide de migration.
- **Acceptation :** aucun sélecteur public n'a deux définitions contradictoires ; les exemples s'insèrent dans une page tierce sans sidebar/footer global inattendu ; table de migration des classes renommées publiée.
- **Validation :** page de collision avec styles hôtes, tests de cascade et captures avant/après.
- **Dépendances/risques :** suit 0.1 ; risque de rupture d'API, à résoudre avant le gel de la première vraie release.

## Phase 2 — Système de design et build fiables

### 2.1 [P1] Transformer les variables en contrat de thème

- [ ] **Suivi :** rôles CSS sémantiques, palette claire alternative et contrôle automatisé des paires principales réalisés ; trois parcours, tous états, lecteurs d'écran et moteurs à valider.
- **Objectif :** rendre la personnalisation reproductible au lieu d'une simple liste de couleurs.
- **Changements :** définir tokens sémantiques (surface, texte, lien, bordure, focus, états) et les valeurs de référence ; choisir une API CSS d'override stable et, si annoncé, des thèmes clair/sombre complets avec prise en compte de la préférence système ; rendre les options Sass configurables seulement si cette API est réellement maintenue.
- **Fichiers/parties :** **src/sass/helpers/_variables.scss**, autres modules de **src/sass/**, nouvelle page **docs/theming.md** ou section équivalente.
- **Acceptation :** les trois cas d'usage passent d'une palette à une autre sans modifier les composants ; les états gardent leurs contrastes ; exemple de surcharge copiable ; README décrit exactement ce qui est livré.
- **Validation :** compilation de deux thèmes, tests de contraste et captures de tous les composants ; vérifier l'absence de couleurs fixes incohérentes.
- **Dépendances/risques :** suit 1.3 ; éviter une API Sass complexe ou des dizaines de palettes non entretenues.

### 2.2 [P1] Définir des points d'entrée légers et prévisibles

- [x] **Suivi :** validation locale sous Node 24.21.0 : deux entrées Sass, quatre sorties, variante core sans sélecteur de composant/grille/layout, budgets respectés et fixtures ouvertes dans Safari.
- **Objectif :** permettre d'utiliser seulement le cœur ou l'ensemble de la bibliothèque.
- **Changements :** séparer de façon claire base sémantique et modules optionnels, sans multiplier inutilement les variantes ; supprimer mixins/breakpoints dupliqués et imports sans effet ; stabiliser l'ordre de génération.
- **Fichiers/parties :** **src/sass/_index.scss**, index Sass des dossiers, **package.json**, configuration du build.
- **Acceptation :** chaque point d'entrée documenté compile seul ; le CSS de base n'inclut pas grille, sidebar ou modale ; les tailles sont sous les budgets définis en 0.2 ; aucune règle importante n'est dupliquée.
- **Validation :** build propre et analyse des sélecteurs/taille de chaque sortie ; pages exemple servies avec chaque variante.
- **Dépendances/risques :** suit 1.2 et 1.5 ; préserver les noms publics retenus dans le contrat.

### 2.3 [P0] Réparer l'artefact CSS de production

- [x] **Suivi :** validation locale sous Node 24.21.0 : installation propre, build sans avertissement, deux séries de hashes identiques, fichiers minifiés plus petits et sans source map inline ; contrôle CSS et rendu Safari passés.
- **Objectif :** fournir un vrai fichier minifié plus petit, inspectable et stable.
- **Changements :** empêcher l'inclusion de source maps inline dans **phoenix.min.css** ; générer une map externe uniquement si elle est volontairement distribuée ; supprimer le double nettoyage du script ; contrôler les avertissements Sass/PostCSS/Browserslist ; figer une version Node prise en charge.
- **Fichiers/parties :** **package.json**, **postcss.config.js**, **package-lock.json**, éventuels scripts de build, **.gitignore**.
- **Acceptation :** depuis un checkout propre, **npm ci** puis **npm run build** produisent les fichiers annoncés ; le fichier minifié est plus petit que la version non minifiée, sans base64 inline ; deux builds identiques ont le même hash.
- **Validation :** comparaison des tailles/hashes, inspection des premières/dernières lignes, vérification des avertissements et test CSS dans un navigateur.
- **Dépendances/risques :** suit 2.2 pour les noms finaux ; une modification de chaîne de build peut changer le CSS, d'où la comparaison visuelle.

## Phase 3 — Démo, documentation et onboarding

### 3.1 [P0] Faire fonctionner la documentation comme site autonome

- [x] **Suivi :** validation locale de `site/` sous Node 24 : références locales et CSS identique au build, HTTP 200 à la racine et sous `/site/`, iframes et ancres chargées dans Safari, menu et dialogue vérifiés dans Safari/Chrome, console Chrome sans erreur ou avertissement. Aucun débordement du site à 320, 375, 768, 800, 801, 1200 ou 1440 px. La publication publique reste une tâche distincte en 5.3.
- **Objectif :** servir les docs localement et sous un sous-chemin public sans CSS manquant.
- **Changements :** copier le CSS construit dans une sortie de site cohérente ou utiliser un chemin adapté ; remplacer les exemples de lien **../dist/** par un chemin réellement distribuable ; ne garder qu'une seule sidebar de navigation et un seul footer ; retirer les comportements fixed de la démo de layout qui écrasent la page ; traiter les dépendances Prism avec version fixée et SRI ou une solution locale.
- **Fichiers/parties :** **docs/index.html**, nouvelle chaîne de génération de **site/** ou **docs/assets/**, **package.json**.
- **Acceptation :** la page et toutes ses ressources répondent sans 404 depuis la racine et un sous-chemin ; les liens d'ancre, menu mobile et exemples marchent ; aucun exemple n'interfère avec le chrome du site.
- **Validation :** serveur local sur la sortie finale, inspection réseau/console, parcours desktop et mobile, test sous un préfixe de chemin.
- **Dépendances/risques :** suit 2.3 ; le chemin Pages final et le domaine doivent être vérifiés avant de les écrire dans le README.

### 3.2 [P1] Remplacer le catalogue brut par une documentation actionnable

- [ ] **Suivi :** nouveau guide avec choix core/full, démarrage depuis le dépôt, extraits copiables, exemples chargés depuis les sorties CSS, thème et liens de référence ; rendu desktop/mobile Safari contrôlé. Manquent un test externe d'onboarding, le contrôle automatique de chaque extrait et la matrice navigateur.
- **Objectif :** amener un développeur du premier lien CSS à une page complète.
- **Changements :** démarrage en 60 secondes, guide HTML nu, grille, formulaires, tokens, thèmes, API Sass, exemples des comportements JS optionnels, limites, accessibilité, migration et personnalisation ; chaque extrait doit refléter le CSS effectivement distribué.
- **Fichiers/parties :** **docs/**, **README.md**, exemples de **examples/**, éventuellement générateur de snippets.
- **Acceptation :** les extraits copiés fonctionnent sans chemin local au checkout ; les composants interactifs incluent tout le comportement nécessaire ; documentation consultable sur téléphone avec navigation claire.
- **Validation :** tests de snippets ou pages générées, test d'onboarding par une personne n'ayant pas écrit le projet, vérification des liens internes.
- **Dépendances/risques :** suit 0.1, phase 1 et 3.1 ; éviter que docs et source divergent.

### 3.3 [P1] Créer une vraie démo et des preuves visuelles

- [ ] **Suivi :** trois pages exécutables ajoutées au site assemblé : guide avec bascule réelle du CSS, formulaire slate avec validation locale et landing page responsive. Rendu et interactions contrôlés dans Chrome, landing page également vue dans Safari et à fort zoom ; captures finales datées et matrice navigateur de phase 4 encore à faire.
- **Objectif :** montrer le résultat que l'utilisateur obtiendra, pas seulement une liste de composants.
- **Changements :** trois petites pages représentatives construites avec les fichiers de distribution finaux ; avant/après sur la même structure HTML ; états focus, erreur, mobile et thème ; captures réelles desktop/mobile avec date, navigateur et version ; alt text utile.
- **Fichiers/parties :** nouveau **examples/**, **docs/**, **assets/screenshots/** ou emplacement équivalent, **README.md**.
- **Acceptation :** chaque capture provient d'une page exécutable du dépôt ; aucun état fictif ; les trois scénarios couvrent la proposition de valeur et les limites sont visibles.
- **Validation :** servir les exemples, comparer les captures aux pages actuelles, vérifier responsive/console/links.
- **Dépendances/risques :** suit 3.1 et les contrôles visuels de phase 4 ; ne pas capturer avant stabilisation du design.

### 3.4 [P1] Refaire le README pour une décision en deux minutes

- [ ] **Suivi :** à faire.
- **Objectif :** permettre d'évaluer, installer et essayer PhoenixCSS depuis GitHub.
- **Changements :** phrase de valeur spécifique, capture réelle, exemple HTML très court, choix du fichier CSS et méthode d'installation vérifiée, taille mesurée, thèmes réellement disponibles, liens docs/démo/release, limites, compatibilité navigateurs, licence et contribution. Corriger le lien **CONTRIBUTING.md** absent et l'URL de documentation défaillante.
- **Fichiers/parties :** **README.md**, **docs/**, captures et métadonnées GitHub.
- **Acceptation :** aucun lien cassé ; installation reproduite depuis les instructions ; toutes les caractéristiques annoncées correspondent à des tests ou exemples ; rendu Markdown GitHub vérifié.
- **Validation :** test d'installation sur dossier vierge, vérificateur de liens, inspection du README rendu sur GitHub après publication.
- **Dépendances/risques :** suit 3.2/3.3 et la phase 5 pour les liens de release définitifs ; conserver des liens provisoires explicitement marqués tant qu'ils ne sont pas publics.

## Phase 4 — Tests, sécurité et intégration continue

### 4.1 [P0] Remplacer le faux test par des contrôles utiles

- [ ] **Suivi :** à faire.
- **Objectif :** empêcher les régressions du contrat CSS.
- **Changements :** ajouter tests de build et de présence des sorties, analyse des media queries, des classes promises et du paquet npm ; lint Sass/CSS/HTML ; tests ciblés pour breakpoint, focus, surcharge de thème, tables et interactions documentées. Le script **npm test** doit exécuter ces contrôles ou échouer.
- **Fichiers/parties :** **package.json**, nouveaux **tests/**, config de lint, **src/sass/** et exemples.
- **Acceptation :** un défaut injecté sur une media query, un point d'entrée ou un snippet fait échouer la suite ; aucune commande de test ne retourne succès sans assertion.
- **Validation :** exécuter la suite sur checkout propre et provoquer volontairement au moins une régression de chaque famille.
- **Dépendances/risques :** suit les phases 1 à 3 ; privilégier des tests de comportement plutôt que des snapshots de CSS complet fragiles.

### 4.2 [P0] Vérifier le rendu et l'accessibilité sur de vrais navigateurs

- [ ] **Suivi :** à faire.
- **Objectif :** confronter les règles compilées à l'usage.
- **Changements :** matrice Chromium, Firefox et WebKit récents ; largeurs 320, 375, 768 et 1440 px ; zoom 200 %, clavier seul, préférence de mouvement réduit et thèmes retenus ; revoir états de formulaire, grille, navigation et modale ; documenter les limites confirmées.
- **Fichiers/parties :** **tests/browser/**, **examples/**, **docs/**, politique de support du **README.md**.
- **Acceptation :** aucun débordement ou contrôle inutilisable dans la matrice annoncée ; problèmes a11y critiques ou sérieux corrigés ; captures de référence et rapport manuel reproductibles.
- **Validation :** tests navigateur automatisés plus sessions manuelles sur au moins un lecteur d'écran ; relever version du navigateur/OS, résultat et anomalies.
- **Dépendances/risques :** suit 3.1 et 4.1 ; disponibilité des navigateurs et lecteurs d'écran, sans inventer une couverture non réalisée.

### 4.3 [P0] Mettre à jour et auditer la chaîne de dépendances

- [ ] **Suivi :** à faire.
- **Objectif :** éviter de publier depuis une toolchain vulnérable ou non maîtrisée.
- **Changements :** mettre à jour les dépendances et le lockfile, traiter les avis **npm audit** selon leur chaîne d'utilisation, fixer les versions des ressources CDN, ajouter SRI ou héberger les ressources, documenter le modèle de menace modeste d'une bibliothèque CSS et une adresse de signalement.
- **Fichiers/parties :** **package.json**, **package-lock.json**, **docs/index.html**, nouveau **SECURITY.md**.
- **Acceptation :** aucun avis haut ou critique non traité dans les dépendances utilisées au build ; exceptions motivées avec périmètre et échéance ; aucune ressource distante de la démo sans contrôle de version/intégrité ou stratégie locale ; aucun secret commité.
- **Validation :** **npm audit** complet et production, scan de secrets, contrôle de chargement réseau et revue des entrées HTML/JS de démo.
- **Dépendances/risques :** peut modifier le CSS généré ; relancer 4.1/4.2 après toute mise à jour majeure. Les avis de build ne sont pas des vulnérabilités prouvées pour les utilisateurs du CSS.

### 4.4 [P0] Ajouter une CI qui publie ses preuves

- [ ] **Suivi :** à faire.
- **Objectif :** rendre chaque PR vérifiable avant fusion.
- **Changements :** workflow GitHub Actions pour installation déterministe, lint, tests, build, taille, audit et inspection du paquet ; permissions minimales, actions épinglées, cache npm, matrice Node prise en charge ; artefacts de diagnostic sur échec.
- **Fichiers/parties :** nouveau **.github/workflows/ci.yml**, **package.json**, scripts et tests.
- **Acceptation :** PR verte uniquement si toutes les portes passent ; la CI échoue sur CSS absent du paquet, test vide ou budget dépassé ; README décrit ce que vérifie le badge.
- **Validation :** une PR de test avec échec volontaire, puis une exécution verte du même commit sur GitHub ; contrôler logs et artefacts, pas seulement le badge.
- **Dépendances/risques :** suit 4.1 à 4.3 ; quotas et permissions GitHub ; la CI ne remplace pas les essais manuels.

## Phase 5 — Packaging, site public et release

### 5.1 [P0] Livrer un paquet CSS installable

- [ ] **Suivi :** à faire.
- **Objectif :** faire correspondre le contenu réel du paquet à son manifeste.
- **Changements :** champs **files**, **style**, **exports** ou équivalents adaptés à un paquet CSS ; inclure les CSS construits et les sources Sass utiles ; créer un script **prepack** fiable ou une procédure de publication depuis artefacts ; éviter d'empaqueter la doc brute et les fichiers de build inutiles.
- **Fichiers/parties :** **package.json**, scripts de build, **.npmignore** si nécessaire, **README.md**.
- **Acceptation :** un tarball créé depuis checkout propre contient exactement les points d'entrée annoncés ; installation de ce tarball dans un projet vierge, import CSS et import Sass documentés fonctionnent ; licence incluse.
- **Validation :** **npm pack --dry-run**, inspection du tarball, installation en répertoire temporaire, compilation d'une vraie page consommatrice.
- **Dépendances/risques :** suit 2.3 et phase 4 ; **dist/** ignoré rend indispensable un build de paquet déterministe. Ne pas déduire la publication npm du seul succès de **npm pack**.

### 5.2 [P0] Produire une release traçable et téléchargeable

- [ ] **Suivi :** à faire.
- **Objectif :** fournir un point de téléchargement fiable et une histoire de versions.
- **Changements :** choisir la première version réelle selon l'ampleur des ruptures ; changelog et guide de migration ; tag lié au commit validé ; automatisation de release avec CSS normal/minifié, éventuellement variantes, tarball et SHA-256 ; publier sur npm seulement après vérification du nom, des droits et du paquet.
- **Fichiers/parties :** **package.json**, nouveau **CHANGELOG.md**, **docs/MIGRATION.md**, **.github/workflows/release.yml**, **README.md**.
- **Acceptation :** page GitHub Release accessible avec notes, version, commit, fichiers CSS et checksums ; téléchargement puis hash et chargement du CSS vérifiés ; si npm est annoncé, page npm et installation de la version publiée vérifiées.
- **Validation :** répéter la recette de release sur un tag de préversion, inspecter artefacts et liens publics, installer le tarball/release dans un projet vierge.
- **Dépendances/risques :** suit 5.1 et CI verte ; publication, tag et version sont des actions externes à exécuter avec les droits nécessaires. Pour une bibliothèque CSS, les « binaires » utiles sont les CSS prêts à télécharger, pas des exécutables OS.

### 5.3 [P1] Déployer et contrôler le site de documentation

- [ ] **Suivi :** à faire.
- **Objectif :** offrir une démo publique qui correspond à la release.
- **Changements :** choisir l'hébergement et le chemin définitif ; déployer la sortie autonome de 3.1 depuis un commit/release identifiés ; corriger le domaine ou retirer le lien défaillant ; mettre en place une vérification HTTP et des liens ; ajouter métadonnées sociales et aperçu.
- **Fichiers/parties :** **docs/**, chaîne de site, workflow de déploiement, **README.md**, paramètres de dépôt/domaine.
- **Acceptation :** URL publique en HTTP 200, CSS/JS/exemples chargés sans 404, page utilisable au téléphone, version affichée cohérente avec l'artefact de release ; aucun lien README ne pointe vers un site non résolu.
- **Validation :** attendre la fin du déploiement, inspecter l'URL exacte, réseau/console, captures et parcours réel ; répéter après changement de domaine.
- **Dépendances/risques :** suit 3.1, 4.4 et 5.2 ; DNS et permissions externes peuvent bloquer, à signaler explicitement.

## Phase 6 — Présentation GitHub, contributions et adoption initiale

### 6.1 [P1] Rendre les contributions simples et sûres

- [ ] **Suivi :** à faire.
- **Objectif :** permettre à une personne nouvelle de corriger ou améliorer le projet.
- **Changements :** guide de contribution avec commandes exactes, architecture Sass, conventions de tokens/classes, critères visuels et a11y ; modèles d'issue/PR ; code de conduite proportionné ; politique de sécurité ; liste de petites tâches issues de défauts réels.
- **Fichiers/parties :** nouveaux **CONTRIBUTING.md**, **SECURITY.md**, **CODE_OF_CONDUCT.md** si retenu, **.github/ISSUE_TEMPLATE/**, **.github/pull_request_template.md**, **README.md**.
- **Acceptation :** lien Contribution du README fonctionne ; une PR externe peut être préparée à partir du guide sans explication privée ; modèles demandent reproduction, navigateur et capture lorsque pertinent.
- **Validation :** simulation de première contribution depuis clone neuf, CI sur PR de test et revue des liens.
- **Dépendances/risques :** suit phases 3 à 5 ; maintenir le guide synchronisé avec les scripts.

### 6.2 [P1] Soigner la vitrine GitHub avec des preuves

- [ ] **Suivi :** à faire.
- **Objectif :** rendre la valeur lisible dans la recherche GitHub et lors d'un partage.
- **Changements :** description courte différenciante, topics pertinents, URL de site vérifiée, capture réelle en haut du README, badge CI/release lié à des ressources existantes, exemple minimal et tableau de comparaison honnête ; éventuellement image sociale issue de la vraie démo.
- **Fichiers/parties :** **README.md**, métadonnées du dépôt GitHub, **assets/screenshots/**, **docs/COMPARISON.md**.
- **Acceptation :** la page publique montre immédiatement usage, rendu et installation ; toutes les images/liens chargent sur GitHub ; aucun badge ou claim ne masque un échec ou une vérification manquante.
- **Validation :** inspection de la page GitHub rendue et d'un aperçu de partage, contrôle des URL finales depuis une session non authentifiée.
- **Dépendances/risques :** suit 3.3, 5.2 et 5.3 ; les métadonnées GitHub exigent des droits sur le dépôt.

### 6.3 [P2] Valider l'utilité et préparer un partage responsable

- [ ] **Suivi :** à faire.
- **Objectif :** obtenir des retours sur l'installation et les cas d'usage, puis améliorer le produit.
- **Changements :** faire essayer la release à quelques développeurs ciblés ; relever temps jusqu'à première page, blocages, bugs et demandes ; classer les retours en issues ; préparer annonce courte avec démo, limites et comparaison factuelle ; publier uniquement après correction des défauts bloquants.
- **Fichiers/parties :** **docs/COMPARISON.md**, issues GitHub, **README.md**, notes de release.
- **Acceptation :** retours datés et traçables, parcours d'installation réussi chez au moins deux personnes hors projet, problèmes critiques résolus ou explicitement signalés ; aucune prévision chiffrée de stars.
- **Validation :** reproduire les remontées, suivre les issues et refaire le parcours sur la release publique.
- **Dépendances/risques :** suit 5.2/5.3 et 6.1/6.2 ; l'adoption dépend de facteurs externes et ne peut pas être validée par les seuls tests locaux.

## Phase 7 — Vidéo de démonstration réelle, uniquement après toutes les autres phases

**Verrou d'entrée :** phases 0 à 6 implémentées et leurs critères validés, CI verte pour le commit de release, artefacts téléchargés et testés, site public contrôlé, README et captures synchronisés. Si une publication ou validation externe reste bloquée, ne pas produire une vidéo prétendant montrer le produit terminé ; résoudre le blocage ou réviser explicitement le périmètre public avant de commencer.

### 7.1 [P1] Capturer un parcours réel du produit final

- [ ] **Suivi :** à faire.
- **Objectif :** montrer le problème résolu et le fonctionnement réel de la version publiée.
- **Changements :** utiliser obligatoirement la skill **ffmpeg-video-editor** ; écrire un storyboard court : HTML brut/problème, installation ou téléchargement réel de la release, ajout de PhoenixCSS, résultat, grille responsive, formulaires/focus, personnalisation et cas d'usage final. Enregistrer l'écran pendant ces actions réelles sur une version identifiée ; nettoyer données privées et notifications avant capture.
- **Fichiers/parties :** nouveaux **media/demo/** pour sources et storyboard, **examples/**, release publique et site docs.
- **Acceptation :** chaque plan correspond à une action reproductible ; aucune maquette, écran fictif, animation simulant une fonction ou promesse non démontrée ; la version et l'environnement sont consignés.
- **Validation :** rejouer le parcours à partir des instructions de release, vérifier visuellement tous les rushes et les états à montrer.
- **Dépendances/risques :** dépend de la totalité des phases 0 à 6 ; risque de révéler des données privées ou de filmer une sortie différente de la release.

### 7.2 [P1] Monter, exporter et contrôler le média final

- [ ] **Suivi :** à faire.
- **Objectif :** livrer une démonstration claire, lisible et réellement regardable.
- **Changements :** avec **ffmpeg-video-editor**, sonder d'abord chaque entrée avec **ffprobe**, monter avec rythme, titres sobres, recadrages/zooms utiles et audio propre seulement s'il apporte quelque chose ; exporter un MP4 H.264/yuv420p avec **faststart** adapté au README/GitHub et, si le récit s'y prête, une version courte pour réseaux sociaux ; créer une vignette/capture liée à la vidéo. Intégrer le lien ou lecteur selon le rendu réellement supporté par GitHub.
- **Fichiers/parties :** **media/demo/**, **README.md**, page de docs et/ou actifs de release.
- **Acceptation :** durée, résolution, fréquence, codecs audio/vidéo, poids et hash consignés ; décodage intégral sans erreur et lecture humaine du début à la fin ; texte lisible sur écran mobile ; lien ou lecture vérifié sur GitHub public ; version courte seulement si elle ne déforme pas le produit.
- **Validation :** **ffprobe** sur chaque export, décodage FFmpeg de l'intégralité vers une sortie nulle, lecture complète avec contrôle du son et de la synchronisation, ouverture du lien final depuis une session non authentifiée.
- **Dépendances/risques :** suit 7.1 ; hébergement GitHub et rendu README à vérifier au lieu de supposer que les balises vidéo HTML sont acceptées.

## Résultat attendu après exécution

Une bibliothèque CSS dont la promesse est étroite et vérifiable, avec valeurs par défaut accessibles, classes optionnelles cohérentes, build reproductible, paquet réellement installable, documentation et exemples utilisables, CI significative, release téléchargeable et site public contrôlé. Le README et la vidéo montreront la même version réellement fonctionnelle. Cette base peut favoriser confiance, contributions et partage ; le nombre de stars restera un résultat d'adoption externe, jamais un critère que le dépôt seul peut garantir.
