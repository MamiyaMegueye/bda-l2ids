/* Bases de données avancées · L2 IDS · SupNum — version publiée (parties verrouillées sans contenu) */
window.COURSE = {
 "titre": "Bases de données avancées",
 "niveau": "L2 IDS · SupNum",
 "annee": "2026–2027",
 "auteur": "Mamiya Megueye",
 "accroche": "Du modèle relationnel aux bases NoSQL : comprendre, choisir et interroger les bases de données modernes.",
 "chapitres": [
  {
   "id": "origines",
   "num": "01",
   "titre": "Les origines du NoSQL",
   "resume": "Pourquoi le relationnel ne suffit plus toujours, les modèles ACID et BASE, le théorème de CAP et les quatre familles de bases NoSQL.",
   "duree": "90 min",
   "statut": "ok",
   "pdf": "docs/CM1_Origines_NoSQL_parties_1-4.pdf",
   "tdLabel": "TP SQL",
   "tdVerrou": true,
   "parties": [
    {
     "id": "introduction",
     "titre": "Introduction",
     "duree": 15,
     "accroche": "Ce que vous savez déjà du relationnel, et ce qui change quand une application grandit.",
     "retenir": "Une application qui grandit fait apparaître des besoins très différents.",
     "diapos": [
      {
       "type": "notion",
       "titre": "Objectifs du cours",
       "html": "\n        <div class=\"cols cols-img\">\n          <div>\n            <p class=\"lead\">Plongez dans l'univers des <strong>bases de données NoSQL</strong>, incontournables dans les architectures modernes. Vous allez :</p>\n            <ul>\n              <li class=\"step\"><strong>comprendre</strong> pourquoi les bases relationnelles ne suffisent plus face aux besoins actuels ;</li>\n              <li class=\"step\"><strong>explorer</strong> les types de bases NoSQL : documents, colonnes, graphes, clés-valeurs ;</li>\n              <li class=\"step\"><strong>découvrir</strong> les fondements de <strong>MongoDB</strong>, la star des bases orientées documents.</li>\n            </ul>\n          </div>\n          <img src=\"assets/img/objectifs.png\" alt=\"\">\n        </div>\n        <div class=\"callout key step\"><b>L'objectif</b> Vous rendre <strong>autonomes</strong> pour comprendre, manipuler et intégrer des bases NoSQL dans vos projets, avec des outils professionnels : <strong>MongoDB Compass</strong> et <strong>MongoDB Atlas</strong>.</div>"
      },
      {
       "type": "notion",
       "titre": "Vue d'ensemble du module",
       "html": "\n        <ol class=\"big-list\">\n          <li class=\"step\"><strong>Chapitre 1</strong> · Les origines du NoSQL</li>\n          <li class=\"step\"><strong>Chapitre 2</strong> · Modélisation avec MongoDB</li>\n          <li class=\"step\"><strong>Chapitre 3</strong> · Requêtes et agrégations</li>\n          <li class=\"step\"><strong>Chapitre 4</strong> · Indexation et optimisation</li>\n        </ol>"
      },
      {
       "type": "question",
       "titre": "Pour commencer : à vous de réfléchir",
       "html": "\n        <div class=\"q\"><span class=\"q-num\">Question 1</span>Quelles applications utilisez-vous tous les jours ? Selon vous, où et comment sont stockées vos données ?</div>\n        <div class=\"q step\"><span class=\"q-num\">Question 2</span>WhatsApp traite chaque jour des milliards de messages dans le monde. Quelles difficultés rencontrerait une seule base MySQL, installée sur un seul serveur ?</div>\n        <div class=\"step\" data-timer=\"120\" data-consigne=\"Réfléchissez 2 minutes, puis partagez vos idées avec la classe.\"></div>"
      },
      {
       "type": "filrouge",
       "titre": "Rappel : le modèle relationnel",
       "html": "\n        <p>Exemple : l'application de scolarité d'une université.</p>\n        <div class=\"cols\">\n          <div>\n            <div class=\"mini\"><div class=\"mini-t\">etudiants</div>\n              <table class=\"t\"><tr><th><u>id_etudiant</u></th><th>nom</th><th>filiere</th><th>niveau</th></tr>\n              <tr><td>1</td><td>Ahmed</td><td>IDS</td><td>L2</td></tr><tr><td>2</td><td>Fatima</td><td>IDS</td><td>L2</td></tr></table></div>\n            <div class=\"mini\"><div class=\"mini-t\">inscriptions</div>\n              <table class=\"t\"><tr><th><i>id_etudiant</i></th><th><i>code_cours</i></th><th>note</th></tr>\n              <tr><td>1</td><td>BDA</td><td>14</td></tr><tr><td>2</td><td>BDA</td><td>16</td></tr></table></div>\n          </div>\n          <ul class=\"defs\">\n            <li class=\"step\"><b>Table</b> : un type d'objet (<code>etudiants</code>)</li>\n            <li class=\"step\"><b>Ligne</b> : un enregistrement (Fatima)</li>\n            <li class=\"step\"><b>Colonne</b> : un attribut typé (<code>nom</code>)</li>\n            <li class=\"step\"><b>Clé primaire</b> (<u>soulignée</u>) : identifie chaque ligne</li>\n            <li class=\"step\"><b>Clé étrangère</b> (<i>italique</i>) : relie deux tables</li>\n          </ul>\n        </div>\n        <div class=\"callout warn step\"><b>Question</b> Si je veux récupérer le <strong>nom</strong> de chaque étudiant avec sa <strong>note en BDA</strong>, qu'est-ce que je dois faire ?</div>\n        <div class=\"step\">\n<pre><code class=\"sql\">SELECT e.nom, i.note\nFROM etudiants e\nJOIN inscriptions i\n  ON e.id_etudiant = i.id_etudiant\nWHERE i.code_cours = 'BDA';</code></pre>\n          <ul class=\"defs inline\"><li><b>Jointure</b> : recombine les tables dans une requête</li><li><b>Schéma</b> : la structure, <mark>définie à l'avance</mark></li></ul>\n        </div>"
      },
      {
       "type": "requete",
       "titre": "Deux façons d'écrire la même jointure",
       "html": "\n        <p>Les deux requêtes renvoient <strong>le même résultat</strong> : le nom de chaque étudiant avec sa note en BDA.</p>\n        <div class=\"cols\">\n          <div><div class=\"col-t\">Avec <code>JOIN … ON</code> (SQL-92)</div>\n<pre><code class=\"sql\">SELECT e.nom, i.note\nFROM etudiants e\nJOIN inscriptions i\n  ON e.id_etudiant = i.id_etudiant\nWHERE i.code_cours = 'BDA';</code></pre></div>\n          <div class=\"step\"><div class=\"col-t\">Jointure implicite (SQL-89)</div>\n<pre><code class=\"sql\">SELECT e.nom, i.note\nFROM etudiants e, inscriptions i\nWHERE e.id_etudiant = i.id_etudiant\n  AND i.code_cours = 'BDA';</code></pre></div>\n        </div>"
      },
      {
       "type": "filrouge",
       "titre": "Et si notre application grandissait ?",
       "html": "\n        <p>L'université lance une application pour tous ses étudiants, puis l'ouvre à tout le pays.</p>\n        <ol class=\"needs\">\n          <li class=\"step\">Les <strong>profils deviennent très variés</strong> : compétences, projets, liens GitHub, stages… <span class=\"tag step\">→ documents</span></li>\n          <li class=\"step\">Des <strong>milliers de connexions par minute</strong> : il faut retrouver une session instantanément. <span class=\"tag step\">→ clé-valeur</span></li>\n          <li class=\"step\">Des <strong>capteurs</strong> dans les salles envoient une mesure chaque seconde : écritures massives. <span class=\"tag step\">→ colonnes larges</span></li>\n          <li class=\"step\">On veut suggérer des <strong>« amis d'amis »</strong> : des relations en cascade. <span class=\"tag step\">→ graphes</span></li>\n        </ol>\n        <div class=\"callout warn step\"><b>Question</b> Une seule base relationnelle est-elle la meilleure réponse à <strong>tous</strong> ces besoins ?</div>"
      }
     ]
    },
    {
     "id": "nosql",
     "titre": "C'est quoi le NoSQL ?",
     "duree": 10,
     "accroche": "Une définition, puis le même exemple modélisé en MySQL et en MongoDB.",
     "retenir": "NoSQL veut dire « Not Only SQL » : d'autres modèles, pas la fin du SQL.",
     "diapos": [
      {
       "type": "notion",
       "titre": "C'est quoi le NoSQL ?",
       "html": "\n        <div class=\"callout def\"><b>Définition</b> Le <strong>NoSQL</strong> (<em>Not Only SQL</em>) désigne une famille de bases de données <strong>non relationnelles</strong>, conçues pour répondre aux défis de la <strong>gestion de données à grande échelle</strong>.</div>\n        <ul>\n          <li class=\"step\"><em>Not Only SQL</em> : « pas seulement SQL », et non « pas de SQL ».</li>\n          <li class=\"step\">Les données ne sont plus forcément en tables : <strong>documents</strong>, <strong>clés-valeurs</strong>, <strong>colonnes larges</strong>, <strong>graphes</strong>.</li>\n          <li class=\"step\">Le NoSQL <strong>assouplit certaines contraintes</strong> du modèle relationnel (schéma fixe, jointures).</li>\n          <li class=\"step\">Le terme s'est diffusé vers <strong>2009</strong>, avec l'essor des grands services web.</li>\n        </ul>\n        <div class=\"callout warn step\"><b>Remarque</b> Le NoSQL ne remplace pas le relationnel : les deux coexistent selon les besoins.</div>"
      },
      {
       "type": "comparaison",
       "titre": "MySQL vs MongoDB (1/2) : deux façons de modéliser",
       "html": "\n        <p>Ahmed et Fatima. <strong>Fatima a plusieurs compétences et deux adresses.</strong></p>\n        <div class=\"cols\">\n          <div><div class=\"col-t\">MySQL : 3 tables reliées</div>\n            <div class=\"cols tight\">\n              <div class=\"mini\"><div class=\"mini-t\">etudiants</div><table class=\"t\"><tr><th><u>id</u></th><th>nom</th></tr><tr><td>1</td><td>Ahmed</td></tr><tr><td>2</td><td>Fatima</td></tr></table></div>\n              <div class=\"mini\"><div class=\"mini-t\">competences</div><table class=\"t\"><tr><th><i>id_etudiant</i></th><th>competence</th></tr><tr><td>1</td><td>Java</td></tr><tr><td>2</td><td>Python</td></tr><tr><td>2</td><td>SQL</td></tr><tr><td>2</td><td>Git</td></tr></table></div>\n            </div>\n            <div class=\"mini\"><div class=\"mini-t\">adresses</div><table class=\"t\"><tr><th><i>id_etudiant</i></th><th>type</th><th>ville</th></tr><tr><td>1</td><td>domicile</td><td>Rosso</td></tr><tr><td>2</td><td>domicile</td><td>Nouakchott</td></tr><tr><td>2</td><td>stage</td><td>Nouadhibou</td></tr></table></div>\n          </div>\n          <div class=\"step\"><div class=\"col-t\">MongoDB : 1 document par étudiant</div>\n<pre><code class=\"json\">{ \"_id\": 2,\n  \"nom\": \"Fatima\",\n  \"competences\": [\"Python\", \"SQL\", \"Git\"],\n  \"adresses\": [\n    { \"type\": \"domicile\",\n      \"ville\": \"Nouakchott\" },\n    { \"type\": \"stage\",\n      \"ville\": \"Nouadhibou\" } ] }</code></pre></div>\n        </div>\n        <div class=\"callout warn step\"><b>Ce qui change</b> MySQL <strong>répartit</strong> les données dans des tables reliées par des clés étrangères ; MongoDB les <strong>regroupe</strong> dans un document, avec tableaux et sous-documents.</div>"
      },
      {
       "type": "comparaison",
       "titre": "MySQL vs MongoDB (2/2) : interroger et nommer",
       "html": "\n        <p><strong>Question :</strong> quelles sont les compétences de Fatima ?</p>\n        <div class=\"cols\">\n          <div><div class=\"col-t\">MySQL (SQL)</div>\n<pre><code class=\"sql\">SELECT c.competence\nFROM etudiants e\nJOIN competences c\n  ON c.id_etudiant = e.id\nWHERE e.nom = 'Fatima';</code></pre></div>\n          <div class=\"step\"><div class=\"col-t\">MongoDB</div>\n<pre><code class=\"js\">db.etudiants.find(\n  { nom: \"Fatima\" },\n  { competences: 1 }\n)</code></pre></div>\n        </div>\n        <table class=\"t zebra step\">\n          <tr><th>Relationnel (MySQL)</th><th>Documents (MongoDB)</th><th>Dans l'exemple</th></tr>\n          <tr><td>Table</td><td>Collection</td><td><code>etudiants</code></td></tr>\n          <tr><td>Ligne</td><td>Document</td><td>la fiche de Fatima</td></tr>\n          <tr><td>Colonne</td><td>Champ</td><td><code>nom</code></td></tr>\n          <tr><td>Clé primaire</td><td><code>_id</code></td><td><code>2</code></td></tr>\n          <tr><td>Jointure</td><td>Données imbriquées (ou <code>$lookup</code>)</td><td><code>competences</code></td></tr>\n        </table>"
      }
     ]
    },
    {
     "id": "limites",
     "titre": "Limites des bases relationnelles",
     "duree": 10,
     "accroche": "Cinq situations où le modèle relationnel devient difficile à faire évoluer.",
     "retenir": "Ces limites dépendent du besoin : le relationnel reste excellent dans beaucoup de cas.",
     "diapos": [
      {
       "type": "notion",
       "titre": "Limites des bases relationnelles",
       "html": "\n        <ol class=\"limits\">\n          <li class=\"step\"><strong>Passage à l'échelle et distribution complexes</strong> : répartir les données et les opérations sur plusieurs serveurs peut demander une architecture complexe.<span class=\"ex\">Exemple : une application utilisée par des millions d'étudiants.</span></li>\n          <li class=\"step\"><strong>Schéma moins flexible</strong> : lorsque les données changent souvent ou sont très variées, faire évoluer le modèle relationnel peut devenir contraignant.<span class=\"ex\">Exemple : des profils étudiants avec des informations différentes.</span></li>\n          <li class=\"step\"><strong>Jointures coûteuses à grande échelle</strong> : certaines jointures sur de gros volumes ou des données distribuées demandent beaucoup de ressources.<span class=\"ex\">Exemple : un réseau social avec des millions de publications et de « J'aime ».</span></li>\n          <li class=\"step\"><strong>Coordination des transactions</strong> : garantir des transactions strictes entre plusieurs serveurs peut augmenter les délais.<span class=\"ex\">Exemple : un virement bancaire traité par plusieurs serveurs.</span></li>\n          <li class=\"step\"><strong>Relations en cascade</strong> : parcourir de nombreuses relations peut devenir complexe.<span class=\"ex\">Exemple : retrouver les amis d'amis d'un étudiant.</span></li>\n        </ol>"
      },
      {
       "type": "question",
       "titre": "À vous de réfléchir : les limites",
       "html": "\n        <div class=\"q\"><span class=\"q-num\">Question 3</span>Instagram ajoute de nouvelles fonctionnalités presque chaque mois (stories, réels, sondages…). Laquelle des cinq limites du relationnel cela pose-t-il en premier ?</div>\n        <div class=\"q step\"><span class=\"q-num\">Question 4</span>Parmi les cinq limites, laquelle vous semble la plus gênante pour un <strong>réseau social</strong> ? Et pour une <strong>banque</strong> ? Justifiez.</div>"
      }
     ]
    },
    {
     "id": "acid-base",
     "titre": "Modèles transactionnels : ACID et BASE",
     "duree": 20,
     "accroche": "Deux philosophies : la cohérence d'abord, ou la disponibilité d'abord.",
     "retenir": "ACID : la cohérence d'abord. BASE : la disponibilité d'abord, cohérence « à terme ».",
     "diapos": [
      {
       "type": "notion",
       "titre": "Le modèle ACID",
       "html": "\n        <p>Une <strong>transaction</strong> regroupe plusieurs opérations qui doivent former un tout. Le modèle <strong>ACID</strong> garantit son bon déroulement. <em>Exemple : un virement bancaire.</em></p>\n        <table class=\"t props\">\n          <tr><th>Propriété ACID</th><th>Sur le virement</th></tr>\n          <tr class=\"step\"><td><b class=\"L\">A</b><em>tomicité</em> : la transaction s'exécute entièrement ou pas du tout</td><td>Le débit et le crédit passent ensemble, ou aucun des deux</td></tr>\n          <tr class=\"step\"><td><b class=\"L\">C</b><em>ohérence</em> : la base passe d'un état valide à un autre état valide (règles respectées)</td><td>Le total d'argent est conservé ; aucun solde ne devient négatif si la règle l'interdit</td></tr>\n          <tr class=\"step\"><td><b class=\"L\">I</b><em>solation</em> : les transactions simultanées ne voient pas les étapes intermédiaires des autres</td><td>Deux retraits simultanés sur un compte commun ne lisent pas un solde « à moitié modifié »</td></tr>\n          <tr class=\"step\"><td><b class=\"L\">D</b><em>urabilité</em> : une transaction validée est conservée, même après une panne</td><td>Le virement confirmé reste enregistré après le redémarrage</td></tr>\n        </table>\n        <p class=\"note step\"><b>À noter :</b> ACID n'est pas réservé au SQL : MongoDB ou Neo4j proposent aussi des transactions ACID.</p>"
      },
      {
       "type": "question",
       "titre": "À vous de réfléchir : ACID",
       "html": "\n        <div class=\"q\"><span class=\"q-num\">Question 5 · Mise en situation</span>Vous faites un virement de 5 000 MRU vers un ami. Au milieu de l'opération, le courant coupe : votre compte est débité, mais le sien n'est pas encore crédité.\n          <ul><li>Que doit faire la base de données ?</li><li>Quelle propriété ACID est en jeu ?</li></ul></div>\n        <div class=\"q step\"><span class=\"q-num\">Question 6</span>Deux personnes retirent de l'argent <strong>au même moment</strong> sur un compte commun. Quelle propriété ACID protège le solde ?</div>"
      },
      {
       "type": "simulation",
       "titre": "Le virement interrompu, pas à pas",
       "html": "\n        <div data-widget=\"sim\" data-src=\"simulations/acid.html\"></div>"
      },
      {
       "type": "notion",
       "titre": "Le modèle BASE",
       "html": "\n        <p>Exemple : le compteur de « J'aime » d'une photo, copié sur plusieurs serveurs.</p>\n        <table class=\"t props\">\n          <tr><th>Propriété BASE</th><th>Sur le compteur de « J'aime »</th></tr>\n          <tr class=\"step\"><td><b class=\"L\">BA</b> · <em>Basically Available</em> : le système répond toujours, même sous forte charge</td><td>Un nombre de « J'aime » s'affiche toujours, même pendant un pic de trafic</td></tr>\n          <tr class=\"step\"><td><b class=\"L\">S</b> · <em>Soft state</em> : l'état peut évoluer sans nouvelle requête, le temps que les copies se synchronisent</td><td>Au même instant : <strong>1 203</strong> « J'aime » sur le serveur A, <strong>1 205</strong> sur le serveur B</td></tr>\n          <tr class=\"step\"><td><b class=\"L\">E</b> · <em>Eventually consistent</em> : sans nouvelle mise à jour, toutes les copies finissent par converger</td><td>Quelques secondes plus tard, les deux serveurs affichent <strong>1 205</strong></td></tr>\n        </table>\n        <p class=\"note step\"><b>À noter :</b> BASE (D. Pritchett, 2008) est une <strong>philosophie de conception</strong>, pas une propriété obligatoire de toutes les bases NoSQL.</p>"
      },
      {
       "type": "simulation",
       "titre": "Le compteur de « J'aime », pas à pas",
       "html": "\n        <div data-widget=\"sim\" data-src=\"simulations/base.html\"></div>"
      },
      {
       "type": "demo",
       "titre": "Réplication synchrone vs asynchrone",
       "html": "\n        <div data-widget=\"replication\"></div>\n        <p><strong>Synchrone</strong> : l'écriture n'est confirmée qu'une fois les copies à jour (cohérence immédiate, plus de latence). <strong>Asynchrone</strong> : réponse immédiate, copies à jour <em>à terme</em>.</p>\n        <p class=\"note\">Ce sont des <strong>mécanismes de réplication</strong> : à eux seuls, ils ne font pas d'un système un système « ACID » ou « BASE ».</p>"
      },
      {
       "type": "retenir",
       "titre": "Pourquoi le modèle BASE ?",
       "html": "\n        <p>Le modèle BASE est <strong>moins strict</strong> : il accepte un compromis sur la <strong>cohérence immédiate</strong> pour privilégier :</p>\n        <ul><li class=\"step\">la <strong>disponibilité immédiate</strong> des données ;</li>\n            <li class=\"step\">les <strong>performances</strong> sur de grands volumes de données (par exemple, effectuer très rapidement de nombreuses modifications sur beaucoup de données).</li></ul>\n        <div class=\"callout key step\"><b>À retenir</b>\n          <div class=\"duo\">\n            <div><img src=\"assets/img/banque.png\" alt=\"\"><p><strong>ACID</strong> : la cohérence d'abord<br>→ banque, facturation, stocks.</p></div>\n            <div><img src=\"assets/img/reseau_social.png\" alt=\"\"><p><strong>BASE</strong> : la disponibilité d'abord<br>→ « J'aime », fils d'actualité, paniers.</p></div>\n          </div>\n          <p>Beaucoup de bases offrent <strong>les deux</strong> : MongoDB propose des transactions ACID ; Cassandra permet de régler la cohérence de chaque requête.</p></div>"
      },
      {
       "type": "question",
       "titre": "À vous de réfléchir : ACID ou BASE ?",
       "html": "\n        <div class=\"q\"><span class=\"q-num\">Question 7</span>Vous publiez une photo : votre ami ne la voit que 3 secondes plus tard. Est-ce grave ? Et s'il s'agissait du virement de votre salaire ?</div>\n        <div class=\"q step\"><span class=\"q-num\">Question 8 · Vote à main levée</span>Pour une application de <strong>mobile money</strong> (Bankily, Masrvi…), choisiriez-vous le modèle <strong>ACID</strong> ou <strong>BASE</strong> ?</div>\n        <div class=\"step\" data-timer=\"120\" data-consigne=\"Votez, puis débat de 2 minutes entre les deux camps.\"></div>"
      }
     ]
    },
    {
     "id": "cap",
     "titre": "Le théorème de CAP",
     "duree": 15,
     "accroche": "Quand le réseau casse, il faut choisir : cohérence ou disponibilité.",
     "retenir": "Le théorème CAP impose un choix entre cohérence (C) et disponibilité (A) lorsqu'une partition réseau (P) survient. P n'est pas optionnel.",
     "diapos": [
      {
       "type": "notion",
       "titre": "Le théorème de CAP — Brewer (2000)",
       "html": "\n        <p>Conjecture formulée par <strong>Eric Brewer</strong> en 2000, démontrée par Gilbert & Lynch en 2002.</p>\n        <table class=\"t props\">\n          <tr><th>Lettre</th><th>Propriété</th><th>Signification</th></tr>\n          <tr class=\"step\"><td><b class=\"L\">C</b></td><td><em>Consistency</em> (Cohérence)</td><td>Tous les nœuds voient la <strong>même donnée au même moment</strong> (linéarisabilité).</td></tr>\n          <tr class=\"step\"><td><b class=\"L\">A</b></td><td><em>Availability</em> (Disponibilité)</td><td>Chaque requête reçoit une <strong>réponse</strong> (succès ou échec), même si un nœud est en panne.</td></tr>\n          <tr class=\"step\"><td><b class=\"L\">P</b></td><td><em>Partition tolerance</em></td><td>Le système continue de fonctionner <strong>malgré une coupure réseau</strong> entre les nœuds.</td></tr>\n        </table>\n        <div class=\"callout warn step\"><b>Attention</b> Le <strong>C</strong> de CAP (linéarisabilité) n'est <strong>pas</strong> le <strong>C</strong> de ACID (intégrité des contraintes). Et <strong>P n'est pas optionnel</strong> : les pannes réseau arrivent toujours. Le vrai choix est <strong>CP ou AP</strong>.</div>"
      },
      {
       "type": "simulation",
       "titre": "Simulation : billetterie de concert",
       "html": "\n        <div data-widget=\"sim\" data-src=\"simulations/cap.html\"></div>"
      },
      {
       "type": "comparaison",
       "titre": "CP vs AP : le vrai dilemme",
       "html": "\n        <div class=\"cols\">\n          <div>\n            <div class=\"col-t\">CP — Cohérence d'abord</div>\n            <p>En cas de partition, le système <strong>refuse de répondre</strong> plutôt que de donner une donnée périmée.</p>\n            <ul>\n              <li class=\"step\"><strong>MongoDB</strong> (par défaut)</li>\n              <li class=\"step\"><strong>HBase</strong></li>\n              <li class=\"step\"><strong>Redis Cluster</strong></li>\n              <li class=\"step\"><strong>Zookeeper</strong></li>\n            </ul>\n            <p class=\"step\"><em>Cas d'usage :</em> réservations, banque, stocks.</p>\n          </div>\n          <div>\n            <div class=\"col-t\">AP — Disponibilité d'abord</div>\n            <p>En cas de partition, le système <strong>continue de répondre</strong>, quitte à donner une donnée pas encore à jour.</p>\n            <ul>\n              <li class=\"step\"><strong>Cassandra</strong></li>\n              <li class=\"step\"><strong>DynamoDB</strong></li>\n              <li class=\"step\"><strong>CouchDB</strong></li>\n              <li class=\"step\"><strong>Riak</strong></li>\n            </ul>\n            <p class=\"step\"><em>Cas d'usage :</em> « J'aime », fils d'actualité, IoT.</p>\n          </div>\n        </div>\n        <div class=\"callout warn step\"><b>Deux pièges à éviter</b>\n          <ol>\n            <li>Dire « ma base est CA » → en distribué, <strong>P est inévitable</strong>.</li>\n            <li>Croire que le choix CP/AP est figé : certaines bases (ex. Cassandra) permettent de <strong>régler la cohérence par requête</strong>.</li>\n          </ol>\n        </div>"
      },
      {
       "type": "question",
       "titre": "À vous de réfléchir : CAP",
       "html": "\n        <div class=\"q\"><span class=\"q-num\">Question 9</span>Une compagnie aérienne vend des billets d'avion en ligne. Lors d'une partition réseau, que vaut-il mieux : <strong>refuser la vente</strong> (CP) ou <strong>risquer une survente</strong> (AP) ? Justifiez.</div>\n        <div class=\"q step\"><span class=\"q-num\">Question 10</span>Un réseau social affiche le nombre de « J'aime » sur un post. Pendant une partition, un serveur affiche 1 203 et un autre 1 205. Est-ce un problème grave ? Ce système est-il plutôt CP ou AP ?</div>\n        <div class=\"step\" data-timer=\"120\" data-consigne=\"Réfléchissez 2 minutes, puis partagez vos réponses.\"></div>"
      }
     ]
    },
    {
     "id": "familles",
     "titre": "Les familles de bases NoSQL",
     "duree": 20,
     "accroche": "Quatre grandes familles, chacune optimisée pour un type de données et de requêtes.",
     "retenir": "Colonnes larges pour les séries temporelles, clé-valeur pour le cache ultra-rapide, documents pour les structures flexibles, graphes pour les relations en cascade.",
     "diapos": [
      {
       "type": "notion",
       "titre": "Quatre familles, quatre philosophies",
       "html": "\n        <div class=\"cols\">\n          <div class=\"c2\">\n            <div class=\"card frag zoom\" style=\"border-left:4px solid var(--vert)\">\n              <h3 style=\"margin:0;color:var(--vert)\">A. Colonnes larges</h3>\n              <p style=\"margin:4px 0 0\">Cassandra · HBase · BigTable</p>\n            </div>\n            <div class=\"card frag zoom\" style=\"border-left:4px solid var(--or)\">\n              <h3 style=\"margin:0;color:var(--or)\">B. Clé-valeur</h3>\n              <p style=\"margin:4px 0 0\">Redis · DynamoDB · Memcached</p>\n            </div>\n          </div>\n          <div class=\"c2\">\n            <div class=\"card frag zoom\" style=\"border-left:4px solid var(--bleu)\">\n              <h3 style=\"margin:0;color:var(--bleu)\">C. Documents</h3>\n              <p style=\"margin:4px 0 0\">MongoDB · CouchDB · Firestore</p>\n            </div>\n            <div class=\"card frag zoom\" style=\"border-left:4px solid #8e44ad\">\n              <h3 style=\"margin:0;color:#8e44ad\">D. Graphes</h3>\n              <p style=\"margin:4px 0 0\">Neo4j · Amazon Neptune · ArangoDB</p>\n            </div>\n          </div>\n        </div>\n        <div class=\"q step\"><span class=\"q-num\">Question 11</span>Rappelez-vous l'exercice « Et si notre application grandissait ? ». Pour chacun des quatre besoins, quelle famille choisiriez-vous ?</div>"
      },
      {
       "type": "notion",
       "titre": "A. Colonnes larges — Principe",
       "html": "\n        <div class=\"block\"><div class=\"bt\">Origine</div><div class=\"bb\">Google <strong>BigTable</strong> (2006), puis Apache <strong>Cassandra</strong> (Facebook, 2008) et Apache <strong>HBase</strong>.</div></div>\n        <div class=\"block frag zoom\"><div class=\"bt\">Principe</div><div class=\"bb\">\n          Les données sont organisées par <strong>clé de partition</strong> et <strong>clé de tri</strong>. Toutes les lignes d'une même partition sont stockées <strong>physiquement ensemble</strong> sur le même nœud → lecture ultra-rapide d'une plage.\n        </div></div>\n        <div class=\"block frag zoom\"><div class=\"bt\">Cas d'usage</div><div class=\"bb\">\n          Données chronologiques massives : capteurs IoT, logs, métriques, historiques de prix.\n        </div></div>\n        <div class=\"callout warn step\"><b>Attention</b> « Colonnes larges » ≠ « base colonnaire analytique ». Cassandra stocke les données par <strong>partition (lignes groupées)</strong>, tandis qu'un moteur analytique comme ClickHouse stocke chaque <strong>colonne séparément</strong> pour les agrégations.</div>"
      },
      {
       "type": "demo",
       "titre": "A. Colonnes larges — Démo capteurs",
       "html": "\n        <p>Table <code>mesures</code> avec clé de partition <code>(capteur_id)</code> et clé de tri <code>date_mesure</code>.</p>\n        <pre><code class=\"sql\">CREATE TABLE mesures (\n  capteur_id   text,\n  date_mesure  timestamp,\n  temperature  float,\n  humidite     float,\n  PRIMARY KEY ((capteur_id), date_mesure)\n);</code></pre>\n        <p class=\"step\"><strong>Clé de partition</strong> <code>(capteur_id)</code> : détermine <strong>sur quel nœud</strong> les données sont stockées. Toutes les mesures d'un capteur sont regroupées physiquement.</p>\n        <p class=\"step\">Requête CQL : <code>SELECT * FROM mesures WHERE capteur_id = 'capteur_12';</code> → Cassandra lit <strong>une seule partition</strong> sur le disque.</p>"
      },
      {
       "type": "notion",
       "titre": "B. Clé-valeur — Redis",
       "html": "\n        <div class=\"block\"><div class=\"bt\">Principe</div><div class=\"bb\">\n          Comme un <strong>dictionnaire</strong> : une clé → une valeur. Accès en <strong>O(1)</strong>. Pas de requêtes complexes, pas de schéma, ultra-rapide.\n        </div></div>\n        <div class=\"block frag zoom\"><div class=\"bt\">Base de données en mémoire</div><div class=\"bb\">\n          <p>Exemples de paires clé → valeur :</p>\n          <ul>\n            <li><code>session:8f3a</code> → <code>{user: 42, panier: 3}</code> (TTL 1800s)</li>\n            <li><code>user:42:nom</code> → <code>\"Ahmed\"</code></li>\n            <li><code>compteur:vues</code> → <code>1547</code></li>\n          </ul>\n        </div></div>\n        <div class=\"block frag zoom\"><div class=\"bt\">Commandes Redis</div><div class=\"bb\">\n          <code>SET session:8f3a \"{user: 42, panier: 3}\" EX 1800</code> → OK<br>\n          <code>GET session:8f3a</code> → la valeur associée\n        </div></div>"
      },
      {
       "type": "notion",
       "titre": "C. Documents — MongoDB",
       "html": "\n        <div class=\"block frag zoom\"><div class=\"bt\">Principe</div><div class=\"bb\">\n          Chaque enregistrement est un <strong>document</strong> (JSON/BSON) avec une structure <strong>flexible</strong>. Pas de schéma fixe : chaque document peut avoir des champs différents. Regroupés en <strong>collections</strong>.\n        </div></div>\n        <div class=\"cols frag zoom\">\n          <div>\n            <div class=\"col-t\">MySQL — Table <code>etudiants</code></div>\n            <p>Schéma rigide : toutes les lignes ont les mêmes colonnes (id, nom, filiere, moyenne).</p>\n          </div>\n          <div>\n            <div class=\"col-t\">MongoDB — Collection <code>etudiants</code></div>\n            <pre><code class=\"json\">{\n  \"_id\": ObjectId(\"...\"),\n  \"nom\": \"Ahmed\",\n  \"filiere\": \"IDS\",\n  \"moyenne\": 14.5,\n  \"hobbies\": [\"football\", \"lecture\"]\n}</code></pre>\n            <p>Schéma flexible : Ahmed a « hobbies », pas forcément Fatima.</p>\n          </div>\n        </div>"
      },
      {
       "type": "notion",
       "titre": "C. MongoDB — Caractéristiques clés",
       "html": "\n        <div class=\"cols\">\n          <div class=\"c2\">\n            <div class=\"card frag zoom\" style=\"border-left:4px solid var(--vert)\"><h3 style=\"margin:0;color:var(--vert)\">Schéma flexible</h3><p style=\"margin:6px 0 0\">Pas de <code>ALTER TABLE</code>. Chaque document peut avoir une structure différente dans la même collection.</p></div>\n            <div class=\"card frag zoom\" style=\"border-left:4px solid var(--bleu)\"><h3 style=\"margin:0;color:var(--bleu)\">Identifiant unique <code>_id</code></h3><p style=\"margin:6px 0 0\">Chaque document a un champ <code>_id</code> (ObjectId par défaut, 12 octets). Pas besoin de séquence.</p></div>\n            <div class=\"card frag zoom\" style=\"border-left:4px solid var(--or)\"><h3 style=\"margin:0;color:var(--or)\">BSON : Binary JSON</h3><p style=\"margin:6px 0 0\">Format binaire compact. Supporte Date, Decimal128, ObjectId, tableaux et sous-documents imbriqués.</p></div>\n          </div>\n          <div class=\"c2\">\n            <div class=\"card frag zoom\" style=\"border-left:4px solid #27ae60\"><h3 style=\"margin:0;color:#27ae60\">Transactions ACID (depuis 4.0)</h3><p style=\"margin:6px 0 0\">Depuis MongoDB <strong>4.0 (2018)</strong>, support des transactions multi-documents ACID au sein d'un replica set.</p></div>\n            <div class=\"card frag zoom\" style=\"border-left:4px solid #8e44ad\"><h3 style=\"margin:0;color:#8e44ad\">Replica Set</h3><p style=\"margin:6px 0 0\">Réplication automatique : un <strong>primaire</strong> et des <strong>secondaires</strong>. Basculement automatique en cas de panne.</p></div>\n            <div class=\"card frag zoom\" style=\"border-left:4px solid #c0392b\"><h3 style=\"margin:0;color:#c0392b\">Sharding</h3><p style=\"margin:6px 0 0\">Distribution des données sur plusieurs serveurs selon une <strong>clé de sharding</strong>. Scalabilité horizontale.</p></div>\n          </div>\n        </div>"
      },
      {
       "type": "notion",
       "titre": "D. Graphes — Neo4j",
       "html": "\n        <div class=\"block frag zoom\"><div class=\"bt\">Principe</div><div class=\"bb\">\n          Les données sont modélisées comme des <strong>nœuds</strong> (entités) et des <strong>relations</strong> (arêtes) avec des propriétés. Optimisé pour les requêtes de <strong>traversée</strong> : ami d'ami, chemin le plus court, recommandations.\n        </div></div>\n        <div class=\"block frag zoom\"><div class=\"bt\">Langage Cypher</div><div class=\"bb\">\n          <pre><code class=\"cypher\">MATCH (moi:Personne {nom: \"Ahmed\"})\n      -[:AMI_DE]->(ami:Personne)\n      -[:AMI_DE]->(suggestion)\nWHERE NOT (moi)-[:AMI_DE]->(suggestion)\nRETURN suggestion.nom</code></pre>\n          <p>→ « Amis de mes amis que je ne connais pas encore » — recommandation en 1 requête !</p>\n        </div></div>"
      }
     ]
    },
    {
     "id": "synthese",
     "titre": "Synthèse et auto-évaluation",
     "duree": 10,
     "accroche": "Le résumé des cinq idées clés du chapitre, suivi d'un quiz d'auto-évaluation.",
     "retenir": "Le choix SQL vs NoSQL dépend du besoin métier, pas d'une mode technologique.",
     "diapos": [
      {
       "type": "retenir",
       "titre": "En résumé",
       "html": "\n        <ol>\n          <li class=\"step\"><strong>1.</strong> Les SGBDR atteignent leurs <strong>limites</strong> face au volume, à la variété et à la vélocité des données modernes.</li>\n          <li class=\"step\"><strong>2.</strong> Le modèle <strong>ACID</strong> garantit la fiabilité (transactions bancaires), tandis que <strong>BASE</strong> favorise la disponibilité et la performance (réseaux sociaux, IoT).</li>\n          <li class=\"step\"><strong>3.</strong> Le théorème <strong>CAP</strong> impose un choix entre <strong>cohérence</strong> et <strong>disponibilité</strong> lors d'une partition réseau. P n'est pas optionnel.</li>\n          <li class=\"step\"><strong>4.</strong> Il existe <strong>quatre grandes familles</strong> NoSQL, chacune optimisée pour un type de données et de requêtes spécifique.</li>\n          <li class=\"step\"><strong>5.</strong> Le choix SQL vs NoSQL (et la famille NoSQL) dépend du <strong>besoin métier</strong>, pas d'une mode technologique.</li>\n        </ol>"
      }
     ]
    }
   ]
  },
  {
   "id": "modelisation",
   "num": "02",
   "titre": "Modélisation avec MongoDB",
   "resume": "Documents et collections, imbrication vs référencement, et opérations CRUD essentielles.",
   "statut": "bientot",
   "parties": []
  },
  {
   "id": "requetes",
   "num": "03",
   "titre": "Requêtes et agrégations",
   "resume": "Filtres avancés, opérateurs sur les tableaux, pipelines d'agrégation et $lookup.",
   "statut": "bientot",
   "parties": []
  },
  {
   "id": "indexation",
   "num": "04",
   "titre": "Indexation et optimisation",
   "resume": "Index simples, composés et multikey, explain() et optimisation des requêtes.",
   "statut": "bientot",
   "parties": []
  }
 ],
 "vraiFaux": [
  {"enonce": "Les bases NoSQL remplacent complètement les bases relationnelles.", "reponse": false, "explication": "NoSQL complète le relationnel, il ne le remplace pas. Les deux coexistent selon les besoins."},
  {"enonce": "Le « C » de CAP (linéarisabilité) est différent du « C » de ACID (intégrité des contraintes).", "reponse": true, "explication": "CAP-C = tous les nœuds voient la même donnée au même moment. ACID-C = la base passe d'un état valide à un autre."},
  {"enonce": "MongoDB ne supporte pas les transactions ACID.", "reponse": false, "explication": "Depuis MongoDB 4.0 (2018), les transactions multi-documents ACID sont supportées."},
  {"enonce": "Redis stocke les données en mémoire RAM pour un accès ultra-rapide.", "reponse": true, "explication": "Redis est une base clé-valeur en mémoire (in-memory), d'où sa rapidité en O(1)."},
  {"enonce": "Dans le théorème CAP, on peut choisir d'ignorer la tolérance au partitionnement.", "reponse": false, "explication": "P n'est pas optionnel : les pannes réseau sont inévitables en système distribué. Le vrai choix est CP ou AP."},
  {"enonce": "Neo4j utilise le langage Cypher pour interroger les graphes.", "reponse": true, "explication": "Cypher est le langage de requête déclaratif de Neo4j, conçu pour exprimer naturellement les parcours de graphes."}
 ],
 "familles": {
  "options": ["Colonnes larges", "Clé-valeur", "Documents", "Graphes"],
  "besoins": [
   {"enonce": "Stocker des sessions utilisateur avec expiration automatique.", "reponse": "Clé-valeur", "explication": "Redis avec TTL : une clé = un identifiant de session, accès en O(1), expiration automatique."},
   {"enonce": "Enregistrer des mesures de capteurs IoT horodatées, requêtes par capteur et plage de dates.", "reponse": "Colonnes larges", "explication": "Cassandra/HBase : clé de partition par capteur, clé de tri par date, écritures massives."},
   {"enonce": "Gérer un catalogue de produits où chaque produit a des attributs différents.", "reponse": "Documents", "explication": "MongoDB : chaque document a un schéma flexible, idéal pour les produits aux attributs variés."},
   {"enonce": "Recommander des amis d'amis dans un réseau social.", "reponse": "Graphes", "explication": "Neo4j : les relations (arêtes) sont des citoyens de première classe, traversée en une requête Cypher."},
   {"enonce": "Effectuer des virements bancaires entre comptes avec garantie de cohérence stricte.", "reponse": "SGBDR/ACID", "explication": "Les virements nécessitent des transactions ACID strictes : un SGBDR classique reste le meilleur choix."}
  ]
 },
 "glossaire": [
  [
   "ACID",
   "Atomicité, Cohérence, Isolation, Durabilité : les quatre garanties d'une transaction fiable."
  ],
  [
   "BSON",
   "Binary JSON : format binaire compact utilisé par MongoDB, supportant des types riches (Date, Decimal128, ObjectId, sous-documents)."
  ],
  [
   "CAP (théorème)",
   "Conjecture de Brewer (2000) : un système distribué ne peut garantir simultanément Cohérence, Disponibilité et Tolérance au partitionnement. Le choix se fait entre CP et AP."
  ],
  [
   "Cassandra",
   "Base NoSQL à colonnes larges créée par Facebook (2008), conçue pour les écritures massives et la haute disponibilité (AP)."
  ],
  [
   "Clé de partition",
   "Détermine sur quel nœud les données sont stockées dans une base à colonnes larges (Cassandra, HBase)."
  ],
  [
   "Cypher",
   "Langage de requête déclaratif de Neo4j, conçu pour exprimer naturellement les parcours et traversées de graphes."
  ],
  [
   "Atomicité",
   "Une transaction s'exécute entièrement ou pas du tout."
  ],
  [
   "BASE",
   "Basically Available, Soft state, Eventually consistent : la disponibilité d'abord, la cohérence à terme."
  ],
  [
   "Clé étrangère",
   "Colonne qui fait référence à la clé primaire d'une autre table."
  ],
  [
   "Clé primaire",
   "Colonne (ou groupe de colonnes) qui identifie chaque ligne de façon unique."
  ],
  [
   "Cohérence à terme",
   "Sans nouvelle mise à jour, toutes les copies finissent par afficher la même valeur (Eventually consistent)."
  ],
  [
   "Collection",
   "Ensemble de documents dans MongoDB, l'équivalent d'une table."
  ],
  [
   "COMMIT / ROLLBACK",
   "Valider définitivement une transaction / l'annuler entièrement."
  ],
  [
   "Document",
   "Enregistrement structuré (souvent JSON) d'une base orientée documents, l'équivalent d'une ligne."
  ],
  [
   "JSON",
   "JavaScript Object Notation : format texte de paires clé / valeur, avec objets { } et tableaux [ ]."
  ],
  [
   "Jointure",
   "Opération SQL qui recombine plusieurs tables à l'aide d'une condition (souvent clé étrangère = clé primaire)."
  ],
  [
   "NoSQL",
   "Not Only SQL : bases de données non relationnelles conçues pour la gestion de données à grande échelle."
  ],
  [
   "Redis",
   "Base NoSQL clé-valeur en mémoire (RAM), accès en O(1). Utilisée pour le cache, les sessions et les compteurs."
  ],
  [
   "Replica Set",
   "Groupe de serveurs MongoDB qui maintiennent les mêmes données : un primaire (lectures/écritures) et des secondaires (répliques). Basculement automatique."
  ],
  [
   "Réplication",
   "Copie des mêmes données sur plusieurs serveurs. Synchrone : copies à jour avant confirmation ; asynchrone : à jour à terme."
  ],
  [
   "Schéma",
   "Structure des données (tables, colonnes, types), définie à l'avance dans une base relationnelle."
  ],
  [
   "Sharding",
   "Distribution des données sur plusieurs serveurs selon une clé de sharding. Permet la scalabilité horizontale."
  ],
  [
   "Transaction",
   "Groupe d'opérations qui doivent réussir ou échouer ensemble."
  ]
 ],
 "ressources": [],
 "references": []
};
