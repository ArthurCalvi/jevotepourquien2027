export type Theme =
  | 'Europe'
  | 'Ordre & societe'
  | 'Institutions'
  | 'Economie & social'
  | 'Ecologie & energie'
  | 'International'

export type Stance = -2 | -1 | 0 | 1 | 2

export interface SourceEntry {
  id: string
  group: 'party' | 'research'
  owner: string
  title: string
  url: string
  note: string
  accessedOn: string
}

export interface RecentExample {
  title: string
  context: string
  impact: string
  sourceLabel: string
  sourceUrl: string
}

export interface GlossaryTerm {
  term: string
  definition: string
}

export interface Question {
  id: string
  theme: Theme
  statement: string
  plainLanguage: string
  explainer: string
  example: string
  whySelected: string
  glossary: GlossaryTerm[]
  recentExample: RecentExample
}

export type FutureTheme =
  | 'IA & travail'
  | 'Adaptation & eau'
  | 'Grand age'
  | 'Logement'
  | 'Numerique'

export interface FutureScenario {
  id: string
  label: string
  title: string
  summary: string
  rationale: string
  signalLabel: string
}

export interface FutureQuestion {
  id: string
  theme: FutureTheme
  statement: string
  plainLanguage: string
  explainer: string
  whyNow: string
  glossary: GlossaryTerm[]
  sourceLabel: string
  sourceUrl: string
  scenarios: FutureScenario[]
}

export interface PartyProfile {
  id: string
  name: string
  shortName: string
  family: string
  color: string
  currentFigures: string
  summary: string
  inclusionNote: string
  codingNotes: string[]
  sourceIds: string[]
  positions: Record<string, Stance>
}

export interface ResearchFinding {
  id: string
  title: string
  takeaway: string
  url: string
}

export const responseOptions: Array<{
  label: string
  shortLabel: string
  value: Stance
}> = [
  { label: "Pas du tout d'accord", shortLabel: 'Pas du tout', value: -2 },
  { label: "Plutôt pas d'accord", shortLabel: 'Plutôt non', value: -1 },
  { label: 'Mitigé ou incertain', shortLabel: 'Mitigé', value: 0 },
  { label: "Plutôt d'accord", shortLabel: 'Plutôt oui', value: 1 },
  { label: "Tout à fait d'accord", shortLabel: 'Tout à fait', value: 2 },
]

export const themeDescriptions: Record<Theme, string> = {
  Europe: 'Intégration, souveraineté, commerce et règles communes.',
  'Ordre & societe': "Immigration, sécurité, droits et rapport à l'autorité.",
  Institutions: 'Mécanismes démocratiques et mode de représentation.',
  'Economie & social': 'Retraites, fiscalité, emploi et niveau de dépense publique.',
  'Ecologie & energie': 'Climat, agriculture, nucléaire et mobilités.',
  International: 'Ukraine, OTAN et défense européenne.',
}

export const questions: Question[] = [
  {
    id: 'eu_powers',
    theme: 'Europe',
    statement:
      "L'Union europeenne devrait disposer de davantage de pouvoirs face aux Etats membres.",
    plainLanguage:
      "En clair: faut-il que plus de decisions importantes soient prises a l'echelle europeenne plutot qu'au niveau national ?",
    explainer:
      'Cette question separe les profils federalistes, reformistes et souverainistes.',
    example:
      "Exemple: budget, energie, defense ou normes industrielles decides davantage a Bruxelles qu'a Paris.",
    whySelected:
      'Les travaux sur les VAA recommandent de couvrir les lignes de fracture principales plutot que de se limiter au clivage gauche-droite.',
    glossary: [
      {
        term: 'Union europeenne',
        definition:
          "Les institutions communes de l'UE qui fixent des regles ou des budgets partages entre plusieurs pays.",
      },
      {
        term: 'Etats membres',
        definition: "Les pays de l'UE, comme la France, l'Allemagne ou l'Espagne.",
      },
    ],
    recentExample: {
      title: "14 mai 2024: l'UE adopte le pacte sur la migration et l'asile",
      context:
        "Le Conseil de l'UE a valide un paquet qui harmonise davantage les procedures d'asile, les controles aux frontieres et la solidarite entre Etats membres.",
      impact:
        "Donner encore plus de pouvoirs a l'UE irait dans le meme sens: moins de marge nationale sur des sujets comme l'asile, les controles ou certaines normes communes.",
      sourceLabel: "Conseil de l'UE, pacte sur la migration et l'asile",
      sourceUrl:
        'https://www.consilium.europa.eu/fr/policies/eu-migration-policy/eu-migration-asylum-reform-pact/',
    },
  },
  {
    id: 'eu_common_debt',
    theme: 'Europe',
    statement:
      "L'Union europeenne devrait emprunter davantage en commun pour financer l'industrie, la defense et la transition climatique.",
    plainLanguage:
      "En clair: les pays europeens doivent-ils pouvoir s'endetter ensemble pour investir ?",
    explainer:
      'On capte ici le rapport aux outils budgetaires communs et a la mutualisation europeenne.',
    example:
      "Exemple: un grand emprunt europeen pour les usines, l'energie ou l'effort de defense.",
    whySelected:
      "Les instruments budgetaires de l'UE structurent de plus en plus les programmes sur l'industrie, la defense et le climat.",
    glossary: [
      {
        term: 'emprunter davantage en commun',
        definition:
          "Lever de l'argent au niveau de l'UE, puis le preter ou le depenser ensemble plutot que via 27 dettes nationales separees.",
      },
    ],
    recentExample: {
      title: '27 mai 2025: le Conseil valide SAFE',
      context:
        "L'instrument SAFE permet jusqu'a 150 milliards d'euros de prets europeens pour des achats de defense, finances par des levees de fonds au niveau de l'UE.",
      impact:
        "Etendre cette logique a l'industrie ou au climat reviendrait a mutualiser davantage l'endettement plutot que laisser chaque Etat financer seul ses investissements.",
      sourceLabel: 'Commission europeenne, SAFE',
      sourceUrl:
        'https://defence-industry-space.ec.europa.eu/eu-defence-industry/safe-security-action-europe_en',
    },
  },
  {
    id: 'restrict_legal_immigration',
    theme: 'Ordre & societe',
    statement:
      "La France devrait durcir fortement l'immigration legale et les conditions du regroupement familial.",
    plainLanguage:
      "En clair: faut-il rendre plus difficile l'entree legale en France et la venue de la famille d'un etranger deja installe ?",
    explainer:
      'La formulation porte sur une decision publique concrete plutot que sur un slogan identitaire.',
    example:
      "Exemple: plus de conditions sur les visas, les revenus ou la duree de sejour avant regroupement familial.",
    whySelected:
      'Le sujet est tres saillant en France et distingue fortement les blocs politiques.',
    glossary: [
      {
        term: 'immigration legale',
        definition:
          "Les entrees autorisees par l'Etat via des visas, titres de sejour, etudes, travail ou famille.",
      },
      {
        term: 'regroupement familial',
        definition:
          "La procedure qui permet a une personne etrangere installee legalement en France de faire venir une partie de sa famille.",
      },
    ],
    recentExample: {
      title: '1er novembre 2024: rappel actualise des regles du regroupement familial',
      context:
        "Service-Public rappelle qu'il faut deja un sejour prealable, des ressources stables et suffisantes et un logement adapte pour faire venir sa famille.",
      impact:
        "Durcir fortement cette politique signifierait relever les seuils, allonger l'attente ou fermer davantage de cas, donc rendre l'immigration familiale plus selective.",
      sourceLabel: 'Service-Public, regroupement familial',
      sourceUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F11166',
    },
  },
  {
    id: 'regularize_workers',
    theme: 'Ordre & societe',
    statement:
      'Les travailleurs sans papiers installes de longue date devraient pouvoir etre regularises plus facilement.',
    plainLanguage:
      "En clair: une personne qui travaille en France depuis longtemps sans papiers doit-elle pouvoir obtenir plus facilement un titre de sejour ?",
    explainer:
      'Cette question complete la precedente avec le versant accueil, droits et travail.',
    example:
      "Exemple: un salarie deja integre dans un secteur en tension pourrait etre regularise plus vite.",
    whySelected:
      'Un bon questionnaire doit traiter les enjeux contestes sous plusieurs angles pour limiter les effets de cadrage.',
    glossary: [
      {
        term: 'sans papiers',
        definition: "Une personne presente en France sans titre de sejour valable a ce moment-la.",
      },
      {
        term: 'regularises',
        definition:
          'Obtenir un titre de sejour officiel alors que la personne etait jusque-la en situation administrative irreguliere.',
      },
    ],
    recentExample: {
      title: '21 mai 2025: nouvelle liste des metiers en tension',
      context:
        "Apres la loi immigration du 28 janvier 2024, la regularisation exceptionnelle des travailleurs sans papiers reste liee aux metiers en tension et a l'examen du dossier par la prefecture.",
      impact:
        "Une regularisation plus facile elargirait les secteurs eligibles, reduirait l'incertitude administrative et permettrait a davantage de travailleurs deja en emploi de sortir de la precarite.",
      sourceLabel: 'Service-Public, nouvelle liste des metiers en tension',
      sourceUrl: 'https://www.service-public.gouv.fr/particuliers/actualites/A17135',
    },
  },
  {
    id: 'national_preference',
    theme: 'Ordre & societe',
    statement:
      'Les aides sociales devraient etre reservees en priorite aux citoyens francais ou aux etrangers presents depuis longtemps.',
    plainLanguage:
      "En clair: faut-il donner la priorite aux Francais, ou aux etrangers installes depuis longtemps, pour certaines aides sociales ?",
    explainer:
      'On mesure ici la logique de preference nationale, distincte du seul controle migratoire.',
    example:
      "Exemple: logement social, allocations ou minima sociaux accessibles plus tardivement pour les nouveaux arrivants.",
    whySelected:
      "Cette distinction est necessaire pour separer la droite classique, l'extreme droite et les partis universalistes.",
    glossary: [
      {
        term: 'aides sociales',
        definition:
          "Des prestations ou avantages publics comme certaines allocations, minima sociaux ou acces au logement social.",
      },
    ],
    recentExample: {
      title: '25 janvier 2024: le Conseil constitutionnel censure plusieurs restrictions sociales',
      context:
        "Dans sa decision sur la loi immigration, le Conseil a ecarte plusieurs mesures qui allongeaient l'acces de certains etrangers aux prestations sociales.",
      impact:
        "Une logique de preference nationale irait a l'inverse: elle retarderait ou conditionnerait davantage l'acces a certaines aides pour les nouveaux arrivants, meme reguliers.",
      sourceLabel: 'Conseil constitutionnel, decision 2023-863 DC',
      sourceUrl: 'https://qpc360.conseil-constitutionnel.fr/commentaire-decision-2023-863-dc',
    },
  },
  {
    id: 'tougher_sentencing',
    theme: 'Ordre & societe',
    statement:
      "Il faut augmenter les peines planchers et limiter davantage les amenagements de peine.",
    plainLanguage:
      "En clair: faut-il punir plus durement et laisser moins de possibilites d'alleger une peine de prison ?",
    explainer:
      'La question porte sur la doctrine penale, pas seulement sur le nombre de policiers.',
    example:
      "Exemple: moins de bracelet electronique, moins de liberation anticipee et plus de peines minimales automatiques.",
    whySelected:
      'Les VAA robustes utilisent des formulations operationnelles sur des arbitrages publics precis.',
    glossary: [
      {
        term: 'peines planchers',
        definition:
          'Des peines minimales prevues par la loi, en dessous desquelles le juge peut moins facilement descendre.',
      },
      {
        term: 'amenagements de peine',
        definition:
          "Les modalites qui permettent d'executer une peine autrement qu'en prison classique, par exemple sous bracelet ou en semi-liberte.",
      },
    ],
    recentExample: {
      title: '13 juin 2025: la loi narcotrafic durcit deja l arsenal penal',
      context:
        'Le nouveau texte cree notamment des quartiers carceraux tres securises et renforce plusieurs outils repressifs contre les trafiquants.',
      impact:
        "Aller encore plus loin avec plus de peines planchers et moins d'amenagements pousserait davantage de condamnes vers la prison ferme et alourdirait la pression sur le systeme carceral.",
      sourceLabel: 'Vie publique, loi contre le narcotrafic',
      sourceUrl:
        'https://www.vie-publique.fr/loi/297230-loi-du-13-juin-2025-visant-sortir-la-france-du-piege-du-narcotrafic',
    },
  },
  {
    id: 'proportional_representation',
    theme: 'Institutions',
    statement:
      'Il faut introduire une forte dose de proportionnelle pour elire les deputes.',
    plainLanguage:
      "En clair: faut-il que l'Assemblee nationale represente mieux les petits et moyens partis, meme si cela rend les majorites plus difficiles ?",
    explainer:
      'Cela oppose les partisans du systeme majoritaire aux profils plus assembleistes ou pluralistes.',
    example:
      "Exemple: un parti faisant 15 % des voix obtiendrait davantage de deputes qu'aujourd'hui.",
    whySelected:
      'Les institutions restent un point cle des programmes francais, surtout a gauche et chez plusieurs partis protestataires.',
    glossary: [
      {
        term: 'proportionnelle',
        definition:
          "Un mode de scrutin ou le nombre de sieges suit davantage le pourcentage de voix obtenu par chaque parti au niveau national ou regional.",
      },
      {
        term: 'deputes',
        definition: "Les elus qui siegent a l'Assemblee nationale et votent les lois.",
      },
    ],
    recentExample: {
      title: 'Juin-juillet 2024: les legislatives produisent une Assemblee tres fragmentee',
      context:
        'Le scrutin majoritaire a deux tours a transforme les rapports de force nationaux en 577 duels locaux, avec trois blocs importants mais aucun majoritaire.',
      impact:
        "Avec plus de proportionnelle, le nombre de sieges suivrait davantage le score national des partis, et moins les retraits, alliances et configurations locales.",
      sourceLabel: "Ministere de l'Interieur, resultats des legislatives 2024",
      sourceUrl:
        'https://www.archives-resultats-elections.interieur.gouv.fr/resultats/legislatives2024/',
    },
  },
  {
    id: 'citizen_referendum',
    theme: 'Institutions',
    statement:
      "Le referendum d'initiative citoyenne devrait etre beaucoup plus facile a declencher.",
    plainLanguage:
      "En clair: voulez-vous que les citoyens puissent plus facilement imposer un referendum ?",
    explainer:
      'On compare ici les partis qui veulent ouvrir plus directement la decision publique.',
    example:
      "Exemple: si un seuil de signatures est atteint, un vote national pourrait etre organise plus facilement qu'aujourd'hui.",
    whySelected:
      "Les recherches sur la selection des statements montrent l'importance des dimensions democratiques distinctes des enjeux socio-economiques.",
    glossary: [
      {
        term: "referendum d'initiative citoyenne",
        definition:
          'Un referendum que les citoyens pourraient declencher eux-memes en reunissant un certain nombre de soutiens.',
      },
    ],
    recentExample: {
      title: "Regle actuelle: il faut 1/5 des parlementaires puis 1/10 du corps electoral",
      context:
        "La procedure du referendum d'initiative partagee reste tres difficile a declencher, ce qui explique pourquoi tres peu de consultations arrivent jusqu'au vote.",
      impact:
        "Un vrai referendum d'initiative citoyenne, avec des seuils beaucoup plus bas, ferait entrer plus souvent des sujets comme les retraites ou l'immigration dans le vote direct.",
      sourceLabel: 'Service-Public, soutenir une proposition de loi RIP',
      sourceUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/R39695',
    },
  },
  {
    id: 'retirement_62',
    theme: 'Economie & social',
    statement:
      "L'age legal de depart a la retraite devrait revenir a 62 ans ou moins.",
    plainLanguage:
      "En clair: faut-il annuler le report de l'age de depart a la retraite et revenir a 62 ans, voire plus bas ?",
    explainer:
      'La retraite est un marqueur social majeur depuis 2023.',
    example:
      "Exemple: retour a 62 ans pour tous, ou 60 ans dans une ligne encore plus favorable au depart precoce.",
    whySelected:
      'Question saillante, stable, fortement differenciante et facile a comprendre.',
    glossary: [
      {
        term: 'age legal',
        definition: "L'age minimum a partir duquel on peut demander sa retraite dans le regime general.",
      },
    ],
    recentExample: {
      title: "Depuis 2023, l'age legal monte progressivement a 64 ans",
      context:
        "La reforme des retraites augmente l'age legal par paliers selon l'annee de naissance. C'est deja visible dans les dates de depart des generations proches de la retraite.",
      impact:
        "Revenir a 62 ans ou moins avancerait les departs pour des millions d'actifs, mais exigerait soit davantage de cotisations, soit plus de deficit, soit d'autres recettes.",
      sourceLabel: 'Service-Public, reforme des retraites: ce qui change',
      sourceUrl: 'https://www.service-public.gouv.fr/particuliers/actualites/A16525',
    },
  },
  {
    id: 'restore_wealth_tax',
    theme: 'Economie & social',
    statement:
      "Il faut retablir un impot sur la fortune plus large que l'actuel impot sur la fortune immobiliere.",
    plainLanguage:
      "En clair: faut-il taxer davantage les tres gros patrimoines, pas seulement l'immobilier ?",
    explainer:
      'Cette question capte le rapport a la redistribution du patrimoine.',
    example:
      "Exemple: inclure aussi les actions, placements financiers et autres actifs dans l'impot sur la fortune.",
    whySelected:
      "Elle clarifie le clivage fiscal sans demander aux utilisateurs de raisonner en agregats techniques.",
    glossary: [
      {
        term: 'impot sur la fortune',
        definition:
          'Un impot calcule sur la valeur du patrimoine detenu au-dessus d un certain seuil.',
      },
      {
        term: 'fortune immobiliere',
        definition:
          "La partie du patrimoine composee surtout de biens immobiliers, comme une residence ou des logements locatifs.",
      },
    ],
    recentExample: {
      title: '12 juin 2025: le Senat debat de la taxe Zucman',
      context:
        "Un amendement discute en 2025 proposait un impot plancher de 2 % sur le patrimoine des personnes depassant 1 milliard d'euros.",
      impact:
        "Un ISF plus large que l'IFI reviendrait deja dans cette direction: taxer aussi les actifs financiers, pas seulement l'immobilier, pour concentrer l'effort sur les tres grands patrimoines.",
      sourceLabel: 'Senat, amendement I-1696',
      sourceUrl: 'https://www.senat.fr/enseance/2024-2025/143/Amdt_I-1696.html',
    },
  },
  {
    id: 'labor_flexibility',
    theme: 'Economie & social',
    statement:
      "Les entreprises devraient disposer de plus de flexibilite sur l'emploi et le temps de travail.",
    plainLanguage:
      "En clair: faut-il donner plus de marge aux entreprises pour organiser le travail, embaucher ou separer plus facilement ?",
    explainer:
      'On mesure ici le degre de confiance accorde a la flexibilite du marche du travail.',
    example:
      "Exemple: horaires plus adaptables, licenciements facilites ou regles moins contraignantes sur le contrat de travail.",
    whySelected:
      'Les comparateurs gagnent en validite quand ils combinent redistribution et regulation du travail.',
    glossary: [
      {
        term: 'flexibilite',
        definition:
          "Une marge plus grande laissee aux entreprises pour adapter rapidement les contrats, les horaires ou l'organisation du travail.",
      },
      {
        term: 'temps de travail',
        definition: "La duree et l'organisation du travail: horaires, semaines, heures supplementaires, repos.",
      },
    ],
    recentExample: {
      title: "1er avril 2025: nouvelles regles d'assurance chomage",
      context:
        "Les nouvelles regles reduisent notamment la duree maximale d'indemnisation et ajustent les bornes d'age, avec l'idee de fluidifier le retour vers l'emploi.",
      impact:
        "Une ligne plus favorable a la flexibilite pousserait generalement plus loin cette logique: plus de marge pour adapter les horaires, recruter vite et separer plus facilement, avec moins de protections collectives.",
      sourceLabel: "Service-Public, nouvelles regles de l'assurance chomage",
      sourceUrl: 'https://www.service-public.gouv.fr/particuliers/actualites/A17953',
    },
  },
  {
    id: 'more_deficit_for_services',
    theme: 'Economie & social',
    statement:
      'Il faut accepter davantage de deficit public a court terme pour financer les services publics.',
    plainLanguage:
      "En clair: acceptez-vous plus de dette publique si cela permet d'investir davantage dans l'hopital, l'ecole ou les transports ?",
    explainer:
      'Cette question oppose la discipline budgetaire aux strategies de relance ou de protection sociale.',
    example:
      "Exemple: depenser plus tout de suite pour les services publics, meme si le budget revient moins vite a l'equilibre.",
    whySelected:
      'Elle permet de differencier des partis parfois proches sur les depenses mais pas sur leur financement.',
    glossary: [
      {
        term: 'deficit public',
        definition:
          "La situation ou l'Etat et les administrations depensent plus d'argent sur une annee qu'ils n'en recoivent.",
      },
    ],
    recentExample: {
      title: "16 juillet 2025: le gouvernement prepare 44 milliards d'euros d'effort pour 2026",
      context:
        "Le cadrage budgetaire affiche une reduction rapide du deficit, ce qui suppose des arbitrages tres durs sur les depenses de l'Etat et de la protection sociale.",
      impact:
        "Accepter plus de deficit a court terme permettrait de desserrer cette contrainte et de financer plus facilement hopital, ecole ou transports, au prix d'un retour plus lent a l'equilibre.",
      sourceLabel: 'Vie publique, Conseil des ministres du 16 juillet 2025 sur le budget',
      sourceUrl: 'https://www.vie-publique.fr/discours/299566-conseil-des-ministres-16072025-le-budget',
    },
  },
  {
    id: 'build_new_nuclear',
    theme: 'Ecologie & energie',
    statement:
      'La France doit construire de nouveaux reacteurs nucleaires et prolonger son parc existant.',
    plainLanguage:
      "En clair: faut-il miser davantage sur l'energie nucleaire pour produire l'electricite en France ?",
    explainer:
      "Le nucleaire est l'un des clivages programmatiques les plus nets en France.",
    example:
      "Exemple: prolonger les centrales actuelles et lancer de nouveaux reacteurs plutot que sortir progressivement du nucleaire.",
    whySelected:
      'Il distingue fortement la gauche ecologiste, la gauche antiliberale, le centre et les droites.',
    glossary: [
      {
        term: 'reacteurs nucleaires',
        definition:
          "Les installations qui produisent de l'electricite a partir de la fission nucleaire dans les centrales.",
      },
      {
        term: 'parc existant',
        definition: "L'ensemble des centrales nucleaires deja en service aujourd'hui en France.",
      },
    ],
    recentExample: {
      title: '2025: la France confirme le programme de six EPR2',
      context:
        "Le plan francais prevoit six nouveaux reacteurs sur trois sites, avec un premier chantier a Penly et une mise en service annoncee pour la fin des annees 2030.",
      impact:
        "Choisir le nucleaire signifie engager des dizaines de milliards d'euros sur le long terme, securiser une production bas carbone pilotable et accepter des chantiers industriels tres lourds.",
      sourceLabel: 'Info.gouv, le nouveau nucleaire en France',
      sourceUrl:
        'https://www.info.gouv.fr/actualite/le-nouveau-nucleaire-en-france-des-reacteurs-nouvelle-generation-pour-repondre-aux-besoins-energetiques',
    },
  },
  {
    id: 'accelerate_renewables',
    theme: 'Ecologie & energie',
    statement:
      "L'Etat devrait accelerer fortement l'eolien et le solaire, meme face a des oppositions locales.",
    plainLanguage:
      "En clair: faut-il installer plus vite des eoliennes et panneaux solaires, meme si certains riverains sont contre ?",
    explainer:
      "Cette question separe les partisans d'une planification renouvelable rapide et les profils plus reticents.",
    example:
      "Exemple: autoriser plus rapidement de grands projets eoliens ou solaires sur le territoire.",
    whySelected:
      "Un bon VAA doit decomposer le bloc climat/energie en choix concrets plutot qu'en une valeur generale.",
    glossary: [
      {
        term: 'eolien',
        definition: "L'electricite produite grace a la force du vent par des eoliennes.",
      },
      {
        term: 'solaire',
        definition: "L'electricite produite par des panneaux qui captent l'energie du soleil.",
      },
    ],
    recentExample: {
      title: '18 juin 2025: l Etat met en debat de nouvelles zones pour l eolien en mer',
      context:
        "La planification maritime doit arbitrer entre acceleration de la production, peche, biodiversite et acceptabilite locale sur plusieurs facades maritimes.",
      impact:
        "Accelerer davantage les renouvelables reviendrait a raccourcir certains delais et a assumer plus souvent des conflits locaux pour augmenter plus vite la production bas carbone.",
      sourceLabel: 'Mer.gouv.fr, La mer en debat',
      sourceUrl: 'https://www.mer.gouv.fr/la-mer-en-debat',
    },
  },
  {
    id: 'keep_2035_ice_ban',
    theme: 'Ecologie & energie',
    statement:
      "L'interdiction europeenne de vendre des voitures thermiques neuves en 2035 devrait etre maintenue.",
    plainLanguage:
      "En clair: faut-il maintenir la fin des ventes de voitures neuves essence et diesel en 2035 ?",
    explainer:
      "On mesure ici l'acceptation des contraintes climatiques fortes sur l'automobile.",
    example:
      "Exemple: apres 2035, les voitures neuves seraient surtout electriques ou equivalentes, mais plus thermiques classiques.",
    whySelected:
      "C'est un arbitrage clair entre industrie, pouvoir d'achat et decarbonation.",
    glossary: [
      {
        term: 'voitures thermiques',
        definition: "Les voitures a essence, diesel ou hybrides reposant encore sur un moteur thermique classique.",
      },
    ],
    recentExample: {
      title: '1er mars 2025: Bruxelles accorde de la souplesse sans abandonner 2035',
      context:
        "La Commission a propose d'aider les constructeurs a atteindre les objectifs CO2 de 2025 tout en maintenant la trajectoire europeenne de sortie des voitures thermiques neuves.",
      impact:
        "Maintenir l'echeance 2035 oblige l'industrie auto a poursuivre l'electrification; revenir dessus repousserait une partie des investissements et de la transformation du parc.",
      sourceLabel: 'Commission europeenne, Automotive Package',
      sourceUrl:
        'https://transport.ec.europa.eu/transport-themes/action-plan-future-automotive-sector/automotive-package_en',
    },
  },
  {
    id: 'relax_farm_rules',
    theme: 'Ecologie & energie',
    statement:
      "Les normes environnementales sur l'agriculture devraient etre assouplies pour proteger la competitivite des agriculteurs.",
    plainLanguage:
      "En clair: faut-il desserrer certaines regles ecologiques pour aider les agriculteurs a produire et gagner leur vie ?",
    explainer:
      'Cette question departage transition agroecologique et logique de simplification normative.',
    example:
      "Exemple: moins de contraintes sur certains pesticides, jacheres, regles d'eau ou normes europeennes jugees trop lourdes.",
    whySelected:
      "L'agriculture est une dimension saillante du conflit ecologie / protection economique.",
    glossary: [
      {
        term: 'normes environnementales',
        definition:
          "Les regles qui limitent les impacts sur l'eau, les sols, la biodiversite, les pesticides ou les emissions.",
      },
      {
        term: 'competitivite',
        definition:
          "La capacite d'un agriculteur ou d'une entreprise a produire a un cout et un prix qui lui permettent de rester dans la course face a la concurrence.",
      },
    ],
    recentExample: {
      title: '14 mai 2025: la Commission simplifie encore la PAC',
      context:
        "Apres la vague de colere agricole, Bruxelles a propose moins de controles et plus de flexibilite sur certaines obligations environnementales pour les exploitants.",
      impact:
        "Assouplir davantage les normes pourrait soulager une partie des agriculteurs a court terme, mais reduirait aussi certains garde-fous ecologiques sur les sols, l'eau ou la biodiversite.",
      sourceLabel: 'Commission europeenne, simplifier la vie des agriculteurs',
      sourceUrl:
        'https://commission.europa.eu/news-and-media/news/simplifying-farmers-lives-2025-05-14_en',
    },
  },
  {
    id: 'legalize_cannabis',
    theme: 'Ordre & societe',
    statement: "Le cannabis devrait etre legalise et encadre par l'Etat.",
    plainLanguage:
      "En clair: faut-il sortir le cannabis de l'illegalite et l'autoriser dans un cadre controle ?",
    explainer:
      'On mesure une dimension libertes publiques / politique penale qui recoupe imparfaitement les autres axes.',
    example:
      "Exemple: vente autorisee sous conditions d'age, de lieux de vente et de taxation, au lieu d'une interdiction totale.",
    whySelected:
      "Les VAAs gagnent a inclure aussi des questions socio-culturelles non reductibles a l'economie.",
    glossary: [
      {
        term: 'legalise',
        definition: "Rendu autorise par la loi, au lieu d'etre interdit penalement.",
      },
      {
        term: 'encadre',
        definition:
          "Autorise dans un cadre strict avec des regles sur l'age, la vente, la publicite, la fiscalite ou la sante publique.",
      },
    ],
    recentExample: {
      title: "1er avril puis 1er juillet 2024: l'Allemagne depenalise en partie le cannabis",
      context:
        "Le modele allemand autorise la detention dans certaines limites et ouvre des cannabis clubs encadres, tout en conservant des regles strictes pour les mineurs et la circulation.",
      impact:
        "Une legalisation encadree en France deplacerait une partie du sujet du penal vers la regulation sanitaire, fiscale et routiere.",
      sourceLabel: 'Ministere federal allemand de la Sante, FAQ Cannabisgesetz',
      sourceUrl: 'https://www.bundesgesundheitsministerium.de/themen/cannabis/faq-cannabisgesetz',
    },
  },
  {
    id: 'arm_ukraine',
    theme: 'International',
    statement:
      "La France doit continuer a livrer des armes a l'Ukraine aussi longtemps que necessaire.",
    plainLanguage:
      "En clair: faut-il continuer a fournir du materiel militaire a l'Ukraine dans sa guerre contre la Russie ?",
    explainer:
      'Cette question distingue soutien militaire durable, soutien conditionnel et logique de non-alignment.',
    example:
      "Exemple: canons, munitions, blindes ou aides militaires maintenus sur la duree plutot qu'un simple soutien diplomatique.",
    whySelected:
      'Le conflit ukrainien est devenu un axe majeur des positions de politique etrangere.',
    glossary: [
      {
        term: 'livrer des armes',
        definition:
          "Fournir du materiel militaire, des munitions ou des equipements a un pays en guerre.",
      },
    ],
    recentExample: {
      title: '2025-2026: la France poursuit les livraisons et la formation',
      context:
        "Paris continue de fournir des equipements et de former des militaires ukrainiens; le soutien officiel inclut des materiels lourds, de la maintenance et de l'entrainement.",
      impact:
        "Continuer a armer l'Ukraine renforce sa capacite de resistance, mais implique aussi un cout budgetaire, industriel et diplomatique durable pour la France.",
      sourceLabel: 'Ministere des Armees, Ukraine: la France poursuit son soutien',
      sourceUrl: 'https://www.defense.gouv.fr/actualites/ukraine-france-poursuit-son-soutien',
    },
  },
  {
    id: 'distance_from_nato',
    theme: 'International',
    statement:
      "La France devrait prendre davantage de distance avec l'OTAN.",
    plainLanguage:
      "En clair: la France doit-elle s'eloigner de l'alliance militaire occidentale conduite principalement par les Etats-Unis ?",
    explainer:
      'On separe ici atlantistes, europeistes de defense et non-alignes.',
    example:
      "Exemple: moins d'alignement sur l'OTAN et plus d'autonomie militaire francaise ou europeenne.",
    whySelected:
      'Cette question evite de ramener toute la politique internationale au seul cas ukrainien.',
    glossary: [
      {
        term: 'OTAN',
        definition:
          "L'alliance militaire dirigee autour des Etats-Unis qui regroupe une grande partie des pays europeens et nord-americains.",
      },
    ],
    recentExample: {
      title: 'Aout 2024: des avions francais participent a la police du ciel en Lituanie',
      context:
        "Des avions francais ont ete engages dans la mission OTAN de surveillance aerienne dans les Etats baltes, un exemple concret d'integration dans la posture militaire de l'Alliance.",
      impact:
        "Prendre plus de distance avec l'OTAN reduirait ce type d'engagement integre et pousserait vers une posture plus nationale ou plus strictement europeenne.",
      sourceLabel: 'NATO Air Command, Baltic air policing depuis la Lituanie',
      sourceUrl:
        'https://ac.nato.int/archive/2024/italy--france-ready-to-police-baltic-skies-from-lithuania',
    },
  },
  {
    id: 'integrated_eu_defense',
    theme: 'International',
    statement:
      "Il faut construire une defense europeenne plus integree, meme si cela reduit une part de souverainete nationale.",
    plainLanguage:
      "En clair: faut-il une defense plus europeenne, avec davantage de decisions et d'equipements communs, meme si chaque pays decide un peu moins seul ?",
    explainer:
      'Elle oppose defense europeenne integree, souverainisme et non-alignment.',
    example:
      "Exemple: achats d'armes en commun, commandement plus coordonne et strategie europeenne plus unifiee.",
    whySelected:
      'Les recherches recommandent des statements sur les dimensions distinctes du conflit plutot que des formulations trop generales.',
    glossary: [
      {
        term: 'defense europeenne plus integree',
        definition:
          "Une organisation ou les pays europeens achetent davantage ensemble, coordonnent plus leurs capacites et prennent plus de decisions communes.",
      },
      {
        term: 'souverainete nationale',
        definition:
          "Le fait pour un Etat de garder seul le dernier mot sur ses decisions militaires, budgetaires ou diplomatiques.",
      },
    ],
    recentExample: {
      title: '17 octobre 2025: accord politique sur le programme EDIP',
      context:
        "Le futur programme europeen de defense industrielle doit soutenir les achats en commun, la montee en puissance industrielle et une meilleure coordination entre Etats membres.",
      impact:
        "Une defense europeenne plus integree signifierait davantage d'equipements achetes ensemble, des priorites industrielles plus communes et moins de decisions completement isolees par Etat.",
      sourceLabel: 'Commission europeenne, accord politique sur EDIP',
      sourceUrl:
        'https://defence-industry-space.ec.europa.eu/commission-welcomes-political-agreement-european-defence-industry-programme-2025-10-17_en',
    },
  },
]

export const futureQuestions: FutureQuestion[] = [
  {
    id: 'future_ai',
    theme: 'IA & travail',
    statement:
      "La France devrait accelerer l'usage de l'intelligence artificielle au travail et dans les services publics, meme si certains metiers changent vite.",
    plainLanguage:
      "En clair: faut-il deployer plus vite l'IA dans les entreprises, l'administration ou l'ecole, meme si cela transforme certains emplois ?",
    explainer:
      "Cette question ne cherche pas a savoir si l'IA est bonne ou mauvaise en soi. Elle mesure surtout votre tolerance a une diffusion rapide d'outils qui peuvent gagner du temps, automatiser des taches et deplacer des responsabilites.",
    whyNow:
      "Les PME, les administrations et l'education entrent dans une phase d'adoption plus concrete. Le vrai arbitrage devient: accelerer vite, encadrer fort, ou limiter certains usages sensibles.",
    glossary: [
      {
        term: 'intelligence artificielle',
        definition:
          "Des systemes capables d'automatiser certaines taches comme rediger, classer, predire, recommander ou analyser des donnees.",
      },
      {
        term: 'services publics',
        definition:
          "Les activites assurees pour tous par l'Etat ou les collectivites, par exemple l'ecole, la sante, la justice ou les demarches administratives.",
      },
    ],
    sourceLabel: 'France Num / Bpifrance, livre blanc IA pour les PME',
    sourceUrl:
      'https://www.francenum.gouv.fr/guides-et-conseils/intelligence-artificielle/comprendre-et-adopter-lia/lintelligence-artificielle-3',
    scenarios: [
      {
        id: 'future_ai_fast',
        label: 'Scenario A',
        title: 'Acceleration large avec obligations minimales',
        summary:
          "Deployer vite les outils IA dans les entreprises et les services publics, avec audit interne, trace minimale et formation courte des equipes.",
        rationale:
          "Cette trajectoire privilegie la vitesse d'adoption et les gains de productivite, avec un encadrement leger mais non nul.",
        signalLabel: 'innovation rapide',
      },
      {
        id: 'future_ai_guarded',
        label: 'Scenario B',
        title: 'Diffusion progressive sous garanties sociales',
        summary:
          "Autoriser les usages, mais avec evaluation des impacts sur l'emploi, formation obligatoire et droits renforces pour les salaries et usagers.",
        rationale:
          "Cette trajectoire cherche un compromis entre productivite, qualite du service et protection sociale.",
        signalLabel: 'innovation encadree',
      },
      {
        id: 'future_ai_cautious',
        label: 'Scenario C',
        title: 'Usage limite dans les secteurs les plus sensibles',
        summary:
          "Restreindre fortement l'IA dans l'education, la justice, la sante, le recrutement ou les services publics a fort impact tant que les risques restent mal maitrises.",
        rationale:
          "Cette trajectoire donne la priorite a la prudence, aux droits fondamentaux et au controle humain.",
        signalLabel: 'prudence algorithmique',
      },
    ],
  },
  {
    id: 'future_water',
    theme: 'Adaptation & eau',
    statement:
      "Face aux secheresses a repetition, la France devrait accepter plus tot des restrictions d'usage de l'eau et investir davantage dans l'adaptation.",
    plainLanguage:
      "En clair: faut-il serrer davantage les usages de l'eau et financer plus d'infrastructures ou de changements d'habitude pour s'adapter ?",
    explainer:
      "La question ne porte pas seulement sur l'ecologie. Elle touche aussi l'agriculture, la vie quotidienne, les collectivites et les arbitrages entre usages en periode de tension.",
    whyNow:
      "Les episodes de secheresse sont plus frequents et de mieux en mieux documentes. Le debat oppose surtout restrictions rapides, investissements lourds, et flexibilite locale.",
    glossary: [
      {
        term: "restrictions d'usage de l'eau",
        definition:
          "Des limitations temporaires sur certains usages comme l'arrosage, le remplissage des piscines ou certaines activites economiques.",
      },
      {
        term: 'adaptation',
        definition:
          "Les changements d'infrastructures, d'organisation ou de comportements pour faire face a un climat deja plus chaud et plus sec.",
      },
    ],
    sourceLabel: 'data.gouv / VigiEau, donnees secheresse et restrictions',
    sourceUrl: 'https://www.data.gouv.fr/datasets/donnee-secheresse-vigieau',
    scenarios: [
      {
        id: 'future_water_fast_limits',
        label: 'Scenario A',
        title: 'Restrictions plus precoces et plus fortes',
        summary:
          "Declencher plus tot des restrictions nationales ou departementales, avec des regles simples et plus contraignantes pour les particuliers comme pour les acteurs economiques.",
        rationale:
          "Cette trajectoire privilegie la sobriete rapide pour proteger la ressource.",
        signalLabel: 'restrictions rapides',
      },
      {
        id: 'future_water_collective',
        label: 'Scenario B',
        title: 'Investissements massifs et planification locale',
        summary:
          "Investir prioritairement dans les reseaux, la reutilisation, l'adaptation agricole et la gouvernance locale de l'eau, meme si cela coute plus cher a court terme.",
        rationale:
          "Cette trajectoire mise sur une adaptation collective et structurelle plutot que sur la seule restriction.",
        signalLabel: 'adaptation collective',
      },
      {
        id: 'future_water_flexible',
        label: 'Scenario C',
        title: 'Souplesse locale et priorite a la continuite economique',
        summary:
          "Laisser davantage de marge aux prefets et aux acteurs locaux pour adapter les regles selon les territoires et preserver certains usages economiques juges prioritaires.",
        rationale:
          "Cette trajectoire privilegie la flexibilite et la prise en compte fine des realites locales.",
        signalLabel: 'souplesse locale',
      },
    ],
  },
  {
    id: 'future_ageing',
    theme: 'Grand age',
    statement:
      "La France devrait consacrer beaucoup plus de moyens au grand age et a la perte d'autonomie, meme si cela implique de nouvelles recettes ou un effort budgetaire durable.",
    plainLanguage:
      "En clair: faut-il investir bien davantage dans l'aide a domicile, les EHPAD, les aidants et l'autonomie, meme si cela coute plus cher ?",
    explainer:
      "La question porte sur un enjeu qui va monter fortement avec le vieillissement: qui finance, comment on accompagne, et quelle place on donne au domicile, a la famille et aux etablissements.",
    whyNow:
      "Le vieillissement de la population rend le sujet structurel. Les arbitrages portent moins sur le diagnostic que sur le niveau d'effort collectif et sur le modele d'accompagnement.",
    glossary: [
      {
        term: "perte d'autonomie",
        definition:
          "Le fait d'avoir besoin d'aide reguliere pour les actes de la vie quotidienne, a domicile ou en etablissement.",
      },
      {
        term: 'aidants',
        definition:
          "Les proches qui accompagnent regulierement une personne agee, malade ou dependante, souvent sans etre des professionnels.",
      },
    ],
    sourceLabel: 'data.gouv / Caisse des Depots, indicateurs de vieillissement 75 ans et plus',
    sourceUrl:
      'https://www.data.gouv.fr/datasets/75-ans-et-plus-indicateurs-de-vieillissement-par-departement/',
    scenarios: [
      {
        id: 'future_ageing_public',
        label: 'Scenario A',
        title: "Service public renforce de l'autonomie",
        summary:
          "Augmenter fortement les moyens publics pour recruter, revaloriser les metiers du care et developper une offre plus accessible sur tout le territoire.",
        rationale:
          "Cette trajectoire privilegie un effort collectif important et plus universaliste.",
        signalLabel: 'service public du care',
      },
      {
        id: 'future_ageing_home',
        label: 'Scenario B',
        title: 'Priorite au maintien a domicile',
        summary:
          "Financer surtout l'aide a domicile, l'adaptation des logements et le soutien aux aidants pour retarder autant que possible l'entree en etablissement.",
        rationale:
          "Cette trajectoire privilegie le domicile et les solutions de proximite.",
        signalLabel: 'maintien a domicile',
      },
      {
        id: 'future_ageing_mixed',
        label: 'Scenario C',
        title: 'Couverture mixte avec ciblage des aides publiques',
        summary:
          "Concentrer l'aide publique sur les cas les plus lourds et laisser une plus grande place aux complementaires, a l'assurance et au reste a charge pour les autres situations.",
        rationale:
          "Cette trajectoire cherche a contenir la depense publique par un modele plus cible et plus mixte.",
        signalLabel: 'couverture mixte',
      },
    ],
  },
  {
    id: 'future_housing',
    theme: 'Logement',
    statement:
      "Pour repondre a la crise du logement, la France devrait accepter davantage de densification pres des transports et des services, meme si cela change le visage de certains quartiers.",
    plainLanguage:
      "En clair: faut-il construire plus dense dans les zones bien situees pour loger plus de monde et limiter l'etalement urbain ?",
    explainer:
      "La question oppose plusieurs priorites: produire plus de logements, reutiliser l'existant, proteger les formes urbaines actuelles ou laisser davantage la main aux communes.",
    whyNow:
      "Le logement reste tendu dans de nombreux territoires et se heurte aux objectifs de sobriete fonciere. Le debat se deplace vers la densification, la vacance et la repartition de l'effort.",
    glossary: [
      {
        term: 'densification',
        definition:
          "Construire davantage de logements sur des zones deja urbanisees, souvent plus pres des gares, transports et services.",
      },
      {
        term: 'etalement urbain',
        definition:
          "L'extension de la ville sur des terres agricoles, naturelles ou peu construites en peripherie.",
      },
    ],
    sourceLabel: 'data.gouv, demande de logement social',
    sourceUrl: 'https://www.data.gouv.fr/fr/datasets/demande-de-logement-social/',
    scenarios: [
      {
        id: 'future_housing_density',
        label: 'Scenario A',
        title: 'Densifier pres des transports et renforcer les obligations',
        summary:
          "Construire plus vite dans les zones deja equipees, avec une part plus forte de logement abordable ou social et moins de blocages locaux.",
        rationale:
          "Cette trajectoire privilegie la production rapide la ou les besoins sont les plus forts.",
        signalLabel: 'densification',
      },
      {
        id: 'future_housing_reuse',
        label: 'Scenario B',
        title: "Reutiliser d'abord l'existant",
        summary:
          "Prioriser la renovation, les logements vacants, les bureaux transformes et l'adaptation du bati deja la avant de construire beaucoup plus dense.",
        rationale:
          "Cette trajectoire met l'accent sur la reutilisation du stock existant et la sobriete du foncier.",
        signalLabel: 'reutilisation du bati',
      },
      {
        id: 'future_housing_local',
        label: 'Scenario C',
        title: 'Laisser plus de pouvoir de veto local',
        summary:
          "Donner plus de marge aux maires et aux habitants pour limiter les projets juges trop denses, quitte a produire moins ou plus lentement.",
        rationale:
          "Cette trajectoire privilegie l'acceptabilite locale et la maitrise communale de l'urbanisme.",
        signalLabel: 'maitrise locale',
      },
    ],
  },
  {
    id: 'future_digital',
    theme: 'Numerique',
    statement:
      "Les services publics et infrastructures critiques devraient s'appuyer beaucoup plus sur des solutions numeriques et cloud europeennes ou francaises, meme si elles sont parfois plus couteuses ou moins matures a court terme.",
    plainLanguage:
      "En clair: faut-il payer parfois un peu plus cher ou aller moins vite pour heberger les donnees sensibles sur des solutions jugees plus souveraines ?",
    explainer:
      "La question porte sur l'arbitrage entre souverainete, cybersecurite, cout, rapidite d'innovation et dependance a de grands fournisseurs etrangers.",
    whyNow:
      "Le cloud devient la base de nombreux services publics et prives. Le debat porte sur la part a reserver aux offres souveraines, au cloud de confiance et aux solutions hybrides.",
    glossary: [
      {
        term: 'cloud',
        definition:
          "Des services informatiques heberges a distance pour stocker des donnees ou faire tourner des applications.",
      },
      {
        term: 'infrastructures critiques',
        definition:
          "Les services ou reseaux essentiels comme la sante, l'energie, l'administration, les transports ou certaines donnees sensibles.",
      },
    ],
    sourceLabel: "numerique.gouv.fr, doctrine Cloud au centre de l'Etat",
    sourceUrl: 'https://www.numerique.gouv.fr/offre-accompagnement/cloud-administrations/la-doctrine-cloud-etat/',
    scenarios: [
      {
        id: 'future_digital_strict',
        label: 'Scenario A',
        title: 'Souverainete stricte pour le public et le critique',
        summary:
          "Exiger des offres europeennes ou qualifiees de tres haut niveau pour l'essentiel des donnees publiques sensibles et des infrastructures critiques.",
        rationale:
          "Cette trajectoire privilegie la souverainete et la reduction de dependances strategiques.",
        signalLabel: 'souverainete stricte',
      },
      {
        id: 'future_digital_targeted',
        label: 'Scenario B',
        title: 'Souverainete ciblee sur les cas les plus sensibles',
        summary:
          "Reserver les exigences les plus strictes aux donnees critiques, et garder une approche plus ouverte pour les autres services.",
        rationale:
          "Cette trajectoire cherche un compromis entre securite, cout et rapidite de deploiement.",
        signalLabel: 'souverainete ciblee',
      },
      {
        id: 'future_digital_open',
        label: 'Scenario C',
        title: 'Interoperabilite et pluralite des fournisseurs',
        summary:
          "Miser surtout sur les standards ouverts, la portabilite et la diversification des prestataires plutot que sur un critere fort d'origine nationale ou europeenne.",
        rationale:
          "Cette trajectoire privilegie la concurrence, la flexibilite et la reduction du verrouillage technique.",
        signalLabel: 'interoperabilite',
      },
    ],
  },
]

export const sources: SourceEntry[] = [
  {
    id: 'rn-eu-2024',
    group: 'party',
    owner: 'RN',
    title: 'Programme RN pour les europeennes 2024',
    url: 'https://municipales2026.rassemblementnational.fr/documents/202411-programme-europeennes.pdf',
    note: "Corpus principal sur l'Europe, l'automobile, l'immigration et l'agriculture.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'rn-leg-2024',
    group: 'party',
    owner: 'RN',
    title: 'Programme RN pour les legislatives 2024',
    url: 'https://municipales2026.rassemblementnational.fr/documents/202406-programme.pdf',
    note: 'Utilise pour consolider le codage sur le social, la securite et les institutions.',
    accessedOn: '2026-03-08',
  },
  {
    id: 'ren-eu-2024',
    group: 'party',
    owner: "Renaissance / Besoin d'Europe",
    title: "Programme Besoin d'Europe",
    url: 'https://doc.besoindeurope.fr/programme-besoindeurope.pdf',
    note: "Source principale pour le bloc central sur l'Europe, l'Ukraine et la transition.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'ren-project',
    group: 'party',
    owner: "Renaissance / Besoin d'Europe",
    title: 'Programme web Besoin d Europe',
    url: 'https://besoindeurope.fr/programme',
    note: "Version web du programme, utile pour les chapitres defense, industrie et climat.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'ren-party',
    group: 'party',
    owner: 'Renaissance',
    title: 'Le parti Renaissance',
    url: 'https://parti-renaissance.fr/le-parti',
    note: 'Repere ideologique general et ligne du parti en 2026.',
    accessedOn: '2026-03-08',
  },
  {
    id: 'pspp-vision',
    group: 'party',
    owner: 'Place publique / PS',
    title: 'Notre vision pour la France',
    url: 'https://place-publique.eu/notre-vision-pour-la-france/',
    note: "Point d'entree sur la ligne social-democrate et pro-europeenne de Place publique.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'pspp-europe',
    group: 'party',
    owner: 'Place publique / PS',
    title: 'Nos 10 propositions pour une puissance ecologique europeenne',
    url: 'https://place-publique.eu/nos-10-propositions-pour-une-puissance-ecologique-europeenne/',
    note: 'Permet de coder le volet Europe, industrie et climat.',
    accessedOn: '2026-03-08',
  },
  {
    id: 'ps-immigration',
    group: 'party',
    owner: 'Place publique / PS',
    title: 'Loi immigration - Nous saisissons le Conseil constitutionnel',
    url: 'https://www.parti-socialiste.fr/loi_immigration_nous_saisissons_le_conseil_constitutionnel',
    note: 'Source sur les droits fondamentaux, le regroupement familial et la ligne migratoire.',
    accessedOn: '2026-03-08',
  },
  {
    id: 'ps-energy',
    group: 'party',
    owner: 'Place publique / PS',
    title: 'Notre strategie energetique : souverainete, decarbonation, competitivite',
    url: 'https://www.parti-socialiste.fr/notre_strategie_energetique_souverainet_decarbonation_competitivite',
    note: "Source sur l'energie, la decarbonation et la place du nucleaire.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'ps-retirements',
    group: 'party',
    owner: 'Place publique / PS',
    title: "Loi d'abrogation des retraites",
    url: 'https://www.parti-socialiste.fr/loi_abrogation_retraites',
    note: 'Repere clair sur la retraite et la fiscalite sociale.',
    accessedOn: '2026-03-08',
  },
  {
    id: 'lfi-eu-2024',
    group: 'party',
    owner: 'LFI',
    title: "Programme de l'Union populaire - europeennes 2024",
    url: 'https://lafranceinsoumise.fr/wp-content/uploads/2024/05/PROGRAMME-UNION-POPULAIRE_EURO-2024.pdf',
    note: "Corpus principal pour l'Europe, l'Ukraine, l'accueil des exiles et la planification.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'lfi-energy',
    group: 'party',
    owner: 'LFI',
    title: 'Livret Energie',
    url: 'https://programme.lafranceinsoumise.fr/livrets/energie/',
    note: 'Source claire sur la sortie du nucleaire et le 100 % renouvelable.',
    accessedOn: '2026-03-08',
  },
  {
    id: 'lfi-retirements',
    group: 'party',
    owner: 'LFI',
    title: 'Livret Retraites',
    url: 'https://programme.lafranceinsoumise.fr/livrets/retraites/',
    note: "Utilise pour coder la retraite a 60 ans et l'approche redistributive.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'lfi-immigration',
    group: 'party',
    owner: 'LFI',
    title: "Chapitre 7 - Accueil coordonne digne",
    url: 'https://lafranceinsoumise.fr/europeennes-2024/programme-de-lunion-populaire/chapitre-7-lutter-contre-lexil-force-et-organiser-un-accueil-coordonne/',
    note: "Source complementaire sur l'asile, les voies legales et la regularisation.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'lr-eu-2024',
    group: 'party',
    owner: 'LR',
    title: "Defendre l'independance europeenne",
    url: 'https://republicains.fr/actualites/2026/01/05/refuser-la-dependance-numerique-culturelle-defendre-lindependance-europeenne/',
    note: "Source recente sur la ligne europeenne, la souverainete et l'independance strategique.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'lr-order',
    group: 'party',
    owner: 'LR',
    title: "Referendum sur l'immigration",
    url: 'https://republicains.fr/actualites/2025/01/07/bruno-retailleau-je-souhaite-un-referendum-sur-limmigration/',
    note: 'Source sur la ligne migratoire et le durcissement institutionnel propose par LR.',
    accessedOn: '2026-03-08',
  },
  {
    id: 'lr-energy',
    group: 'party',
    owner: 'LR',
    title: "Notre plan pour l'energie",
    url: 'https://republicains.fr/actualites/2025/07/02/rebatir-un-parc-nucleaire-et-stopper-le-financement-des-renouvelables-notre-plan-pour-lenergie/',
    note: 'Source claire sur le nucleaire, les renouvelables et la voiture thermique.',
    accessedOn: '2026-03-08',
  },
  {
    id: 'lr-work',
    group: 'party',
    owner: 'LR',
    title: 'Travail',
    url: 'https://republicains.fr/qrtravail/',
    note: "Utilise pour le codage sur le travail, la competitivite et le pouvoir d'achat.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'greens-eu-2024',
    group: 'party',
    owner: 'Les Ecologistes',
    title: 'Socle programmatique des europeennes 2024',
    url: 'https://lesecologistes.fr/document/1JGlVTgE9rtzoDKTz8yGPT/socle-programmatique-les-ecologistes-europeenes-2024.pdf',
    note: "Corpus principal sur l'Europe, la justice sociale et la transition.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'greens-project',
    group: 'party',
    owner: 'Les Ecologistes',
    title: 'Notre projet',
    url: 'https://lesecologistes.fr/pages/358vv7W974UgosGhCBbIPT/notre-projet',
    note: 'Cadre strategique du parti en 2026, utile pour le federalisme et la sobriete.',
    accessedOn: '2026-03-08',
  },
  {
    id: 'greens-2026',
    group: 'party',
    owner: 'Les Ecologistes',
    title: 'Projet 2026',
    url: 'https://projet.lesecologistes.fr/',
    note: "Source complementaire recente sur l'alimentation, l'agroecologie et les services publics.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'rq-programme',
    group: 'party',
    owner: 'Reconquete',
    title: "Le programme d'Eric Zemmour",
    url: 'https://programme.ericzemmour.fr/',
    note: 'Base officielle la plus detaillee disponible pour la ligne Reconquete.',
    accessedOn: '2026-03-08',
  },
  {
    id: 'rq-immigration',
    group: 'party',
    owner: 'Reconquete',
    title: 'Programme Immigration',
    url: 'https://programme.ericzemmour.fr/immigration',
    note: 'Source claire sur le durcissement migratoire et la preference nationale.',
    accessedOn: '2026-03-08',
  },
  {
    id: 'rq-nuclear',
    group: 'party',
    owner: 'Reconquete',
    title: 'Programme Nucleaire',
    url: 'https://programme.ericzemmour.fr/nucleaire',
    note: "Utilise pour le codage sur l'energie et l'industrie.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'rq-auto',
    group: 'party',
    owner: 'Reconquete',
    title: 'Programme Automobilistes',
    url: 'https://programme.ericzemmour.fr/automobilistes',
    note: 'Source sur la voiture thermique, les normes et la fiscalite anti-auto.',
    accessedOn: '2026-03-08',
  },
  {
    id: 'rq-army',
    group: 'party',
    owner: 'Reconquete',
    title: 'Programme Armees',
    url: 'https://programme.ericzemmour.fr/armees',
    note: "Source sur l'OTAN, la defense et la souverainete strategique.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'pcf-eu-2024',
    group: 'party',
    owner: 'PCF',
    title: 'Reprenons la main en France et en Europe',
    url: 'https://95.pcf.fr/sites/default/files/20240213-reprenons_la_main-4p-planche.pdf',
    note: "Corpus principal sur l'Europe, la fiscalite et la souverainete sociale.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'pcf-campaign',
    group: 'party',
    owner: 'PCF',
    title: 'Elections europeennes - Reprenons la main',
    url: 'https://www.pcf.fr/elections_europeennes_reprenons_la_main',
    note: "Page d'entree du corpus PCF pour 2024.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'pcf-ukraine',
    group: 'party',
    owner: 'PCF',
    title: 'La paix au coeur de la campagne',
    url: 'https://www.pcf.fr/la_paix_au_coeur_de_la_campagne_des_elections_europeennes_reprendre_la_main_sur_la_securite_collective_en_europe',
    note: "Source utile pour coder la ligne pacifiste et la critique de l'OTAN.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'pcf-war',
    group: 'party',
    owner: 'PCF',
    title: "Halte a l'engrenage guerrier",
    url: 'https://www.pcf.fr/resolution_cn_halte_engrenage_guerrier',
    note: "Confirme la ligne recente du PCF sur l'economie de guerre et la defense.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'research-selection',
    group: 'research',
    owner: 'Research',
    title: 'A perfect match? Statement selection and VAA output',
    url: 'https://medialibrary.uantwerpen.be/oldcontent/container2608/files/Lefevere%2C%20Walgrave%20-%20A%20perfect%20match.pdf',
    note: 'Montre que la selection des statements peut modifier fortement les rapprochements.',
    accessedOn: '2026-03-08',
  },
  {
    id: 'research-wording',
    group: 'research',
    owner: 'Research',
    title: 'Does question wording matter?',
    url: 'https://mda.gesis.org/index.php/mda/article/view/2022.12',
    note: "Etablit que la formulation d'une question peut changer la congruence mesuree.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'research-irt',
    group: 'research',
    owner: 'Research',
    title: 'IRT for voting advice applications',
    url: 'https://link.springer.com/article/10.1007/s11135-024-01845-6',
    note: "Montre l'interet d'un questionnaire multidimensionnel et interpretable.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'research-robustness',
    group: 'research',
    owner: 'Research',
    title: 'Toward adversarial robustness in VAAs',
    url: 'https://arxiv.org/abs/2505.13329',
    note: "Montre a quel point le resultat d'un VAA peut bouger si les items ou l'algorithme sont manipules.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'research-kieskompas',
    group: 'research',
    owner: 'Research',
    title: 'Kieskompas methodology overview',
    url: 'https://home.kieskompas.nl/en/tools/',
    note: "Reference praticienne utile sur l'idee de carte de proximite plutot que de pur conseil de vote.",
    accessedOn: '2026-03-08',
  },
  {
    id: 'research-adaptive',
    group: 'research',
    owner: 'Research',
    title: 'Comparison of Electoral Systems and Optimization of Voting Advice Questionnaires',
    url: 'https://www.research-collection.ethz.ch/handle/20.500.11850/622717',
    note: 'Utile pour le sujet de la fatigue repondant et des questionnaires adaptatifs.',
    accessedOn: '2026-03-08',
  },
]

export const researchFindings: ResearchFinding[] = [
  {
    id: 'finding-selection',
    title: 'La sélection des questions change le résultat',
    takeaway:
      "Le questionnaire doit couvrir plusieurs dimensions du conflit politique. Sinon, on avantage mécaniquement certains partis.",
    url: 'https://medialibrary.uantwerpen.be/oldcontent/container2608/files/Lefevere%2C%20Walgrave%20-%20A%20perfect%20match.pdf',
  },
  {
    id: 'finding-wording',
    title: "Le wording n'est pas neutre par magie",
    takeaway:
      'Des formulations légèrement différentes peuvent modifier la proximité mesurée. Chaque statement ici reste donc univoque, court et sans nom de parti.',
    url: 'https://mda.gesis.org/index.php/mda/article/view/2022.12',
  },
  {
    id: 'finding-robustness',
    title: 'Les algorithmes trop opaques sont manipulables',
    takeaway:
      "Des travaux récents montrent que le choix de l'algorithme ou le cherry-picking des items peut faire bondir artificiellement la fréquence de recommandation d'un parti.",
    url: 'https://arxiv.org/abs/2505.13329',
  },
  {
    id: 'finding-interpretable',
    title: "La multidimensionnalité vaut mieux qu'un score magique",
    takeaway:
      'Les approches interprétables et multidimensionnelles sont préférables aux boîtes noires: on montre donc le score global et les sous-scores par thème.',
    url: 'https://link.springer.com/article/10.1007/s11135-024-01845-6',
  },
  {
    id: 'finding-fatigue',
    title: 'La fatigue de réponse existe',
    takeaway:
      "Les recherches sur les VAAs adaptatifs montrent qu'il faut rester court. Le questionnaire se limite ici à 20 statements centraux et permet de sauter une question.",
    url: 'https://www.research-collection.ethz.ch/handle/20.500.11850/622717',
  },
]

export const methodologyAssumptions = [
  'Au 8 mars 2026, les manifestes présidentiels 2027 ne sont pas encore suffisamment publiés pour être codés proprement question par question.',
  'Le comparateur travaille donc sur des profils de parti ou de bloc, établis à partir des programmes officiels 2024-2026 les plus détaillés disponibles.',
  'Les candidatures plus personnalisées seront ajoutées quand un corpus programmatique stable existera, plutôt que sur des interviews ou des rumeurs de campagne.',
]

export const biasGuards = [
  '20 questions fixes couvrant six dimensions. Aucun profil ne choisit ses propres questions.',
  "Formulation en décisions publiques concrètes plutôt qu'en slogans partisans ou moraux.",
  "Codage manuel des profils à partir de sources officielles. Aucun classement n'est généré par un LLM au runtime.",
  'Résultat présenté comme une proximité programmatique, pas comme une consigne de vote.',
  'Les réponses non renseignées sont ignorées du calcul et la couverture réelle est toujours affichée.',
]

export const partyProfiles: PartyProfile[] = [
  {
    id: 'rn',
    name: 'Rassemblement national',
    shortName: 'RN',
    family: 'National-populiste',
    color: '#13284b',
    currentFigures: 'Figures associées: Marine Le Pen, Jordan Bardella',
    summary:
      "Profil souverainiste, anti-fédéraliste, très restrictif sur l'immigration, pro-nucléaire et hostile aux contraintes climatiques fortes sur l'automobile.",
    inclusionNote:
      'Profil retenu car première liste française aux européennes 2024 et force structurante de 2027.',
    codingNotes: [
      'Préférence nationale, fermeté migratoire et sécuritaire très marquée.',
      "Rejet d'une intégration européenne plus poussée et prudence sur l'Ukraine / l'OTAN.",
      'Défense du nucléaire, des agriculteurs et des automobilistes face aux normes européennes.',
    ],
    sourceIds: ['rn-eu-2024', 'rn-leg-2024'],
    positions: {
      eu_powers: -2,
      eu_common_debt: -2,
      restrict_legal_immigration: 2,
      regularize_workers: -2,
      national_preference: 2,
      tougher_sentencing: 2,
      proportional_representation: 1,
      citizen_referendum: 1,
      retirement_62: 1,
      restore_wealth_tax: -1,
      labor_flexibility: 0,
      more_deficit_for_services: 1,
      build_new_nuclear: 2,
      accelerate_renewables: -2,
      keep_2035_ice_ban: -2,
      relax_farm_rules: 2,
      legalize_cannabis: -2,
      arm_ukraine: 0,
      distance_from_nato: 1,
      integrated_eu_defense: -2,
    },
  },
  {
    id: 'renaissance',
    name: "Renaissance / Besoin d'Europe",
    shortName: 'Renaissance',
    family: 'Bloc central libéral-social et pro-européen',
    color: '#c28d1f',
    currentFigures: 'Figures associées: majorité présidentielle, candidature 2027 non figée',
    summary:
      "Profil pro-européen, favorable à la défense européenne, à l'Ukraine, au nucléaire et à une transition climatique menée dans un cadre plutôt pro-marché.",
    inclusionNote:
      'Profil retenu car bloc central actuellement au pouvoir et liste majeure des européennes 2024.',
    codingNotes: [
      "Europe plus intégrée, outils industriels communs et soutien fort à l'Ukraine.",
      'Ligne réformiste sur le travail et la dépense publique, plus réservée sur la redistribution du patrimoine.',
      'Nucléaire assumé, renouvelables accélérés et maintien des objectifs climatiques européens.',
    ],
    sourceIds: ['ren-eu-2024', 'ren-project', 'ren-party'],
    positions: {
      eu_powers: 2,
      eu_common_debt: 2,
      restrict_legal_immigration: 1,
      regularize_workers: 0,
      national_preference: -2,
      tougher_sentencing: 1,
      proportional_representation: 0,
      citizen_referendum: -1,
      retirement_62: -2,
      restore_wealth_tax: -2,
      labor_flexibility: 2,
      more_deficit_for_services: -1,
      build_new_nuclear: 2,
      accelerate_renewables: 1,
      keep_2035_ice_ban: 2,
      relax_farm_rules: 0,
      legalize_cannabis: -1,
      arm_ukraine: 2,
      distance_from_nato: -2,
      integrated_eu_defense: 2,
    },
  },
  {
    id: 'pspp',
    name: "Reveiller l'Europe (Place publique + PS)",
    shortName: 'PP + PS',
    family: 'Social-démocrate et pro-européen',
    color: '#a33f61',
    currentFigures: 'Figures associées: Raphaël Glucksmann, Olivier Faure',
    summary:
      "Profil social-démocrate pro-européen, favorable aux services publics, à la justice fiscale, à l'Ukraine et à une transition climatique combinée à la réindustrialisation.",
    inclusionNote:
      'Profil retenu car deuxième grande liste des européennes 2024 et bloc plausible pour 2027.',
    codingNotes: [
      'Europe plus intégrée mais réorientée vers la justice sociale et la souveraineté industrielle.',
      "Abrogation de la réforme des retraites, retour d'une fiscalité plus redistributive.",
      "Soutien à l'Ukraine, transition énergétique ambitieuse et position plus ouverte sur l'accueil que le centre et la droite.",
    ],
    sourceIds: [
      'pspp-vision',
      'pspp-europe',
      'ps-immigration',
      'ps-energy',
      'ps-retirements',
    ],
    positions: {
      eu_powers: 1,
      eu_common_debt: 2,
      restrict_legal_immigration: -1,
      regularize_workers: 2,
      national_preference: -2,
      tougher_sentencing: -1,
      proportional_representation: 2,
      citizen_referendum: 1,
      retirement_62: 2,
      restore_wealth_tax: 2,
      labor_flexibility: -1,
      more_deficit_for_services: 1,
      build_new_nuclear: 1,
      accelerate_renewables: 1,
      keep_2035_ice_ban: 1,
      relax_farm_rules: -1,
      legalize_cannabis: 1,
      arm_ukraine: 2,
      distance_from_nato: -1,
      integrated_eu_defense: 1,
    },
  },
  {
    id: 'lfi',
    name: 'La France insoumise / Union populaire',
    shortName: 'LFI',
    family: 'Gauche antilibérale et non-alignée',
    color: '#8f1720',
    currentFigures: 'Figures associées: Jean-Luc Mélenchon, Manon Aubry',
    summary:
      "Profil très redistributif, pro-retraite à 60 ans, hostile au nucléaire et aux traités européens actuels, favorable à l'accueil et critique de l'OTAN.",
    inclusionNote:
      'Profil retenu car force nationale centrale à gauche et liste majeure des européennes 2024.',
    codingNotes: [
      'Planification écologique, rupture avec les traités européens jugés néolibéraux et anti-OTAN.',
      "Ligne très ouverte sur l'accueil des exilés, la régularisation et la légalisation du cannabis.",
      'Retraite à 60 ans, ISF renforcé et forte intervention publique.',
    ],
    sourceIds: ['lfi-eu-2024', 'lfi-energy', 'lfi-retirements', 'lfi-immigration'],
    positions: {
      eu_powers: -1,
      eu_common_debt: 1,
      restrict_legal_immigration: -2,
      regularize_workers: 2,
      national_preference: -2,
      tougher_sentencing: -2,
      proportional_representation: 2,
      citizen_referendum: 2,
      retirement_62: 2,
      restore_wealth_tax: 2,
      labor_flexibility: -2,
      more_deficit_for_services: 2,
      build_new_nuclear: -2,
      accelerate_renewables: 2,
      keep_2035_ice_ban: 1,
      relax_farm_rules: -2,
      legalize_cannabis: 2,
      arm_ukraine: -2,
      distance_from_nato: 2,
      integrated_eu_defense: -2,
    },
  },
  {
    id: 'lr',
    name: 'Les Republicains',
    shortName: 'LR',
    family: 'Droite classique conservatrice',
    color: '#1e4b9f',
    currentFigures: 'Figures associées: Bruno Retailleau, Laurent Wauquiez, François-Xavier Bellamy',
    summary:
      "Profil conservateur, pro-ordre, favorable au nucléaire, réservé sur la proportionnelle et très critique envers les contraintes climatiques sur l'automobile et l'agriculture.",
    inclusionNote:
      "Profil retenu car force de droite classique encore structurante à l'Assemblée et dans les élections nationales.",
    codingNotes: [
      'Fermeté migratoire et pénale proche de la droite dure, sans préférence nationale totale.',
      'Ligne pro-travail, pro-compétitivité et plutôt restrictive sur les déficits.',
      "Très pro-nucléaire, critique des renouvelables subventionnés et de l'interdiction de 2035.",
    ],
    sourceIds: ['lr-eu-2024', 'lr-order', 'lr-energy', 'lr-work'],
    positions: {
      eu_powers: -1,
      eu_common_debt: -1,
      restrict_legal_immigration: 2,
      regularize_workers: -2,
      national_preference: 1,
      tougher_sentencing: 2,
      proportional_representation: -1,
      citizen_referendum: -1,
      retirement_62: -2,
      restore_wealth_tax: -2,
      labor_flexibility: 2,
      more_deficit_for_services: -2,
      build_new_nuclear: 2,
      accelerate_renewables: -2,
      keep_2035_ice_ban: -1,
      relax_farm_rules: 2,
      legalize_cannabis: -2,
      arm_ukraine: 2,
      distance_from_nato: -2,
      integrated_eu_defense: 0,
    },
  },
  {
    id: 'greens',
    name: 'Les Ecologistes',
    shortName: 'Ecologistes',
    family: 'Écologie politique',
    color: '#2f7a46',
    currentFigures: 'Figures associées: Marine Tondelier, Marie Toussaint',
    summary:
      "Profil fédéraliste, très pro-renouvelables, anti-nucléaire, favorable à la proportionnelle, à l'accueil et à une transition écologique rapide accompagnée de justice sociale.",
    inclusionNote:
      'Profil retenu car parti national autonome et liste ayant franchi 5 % aux europeennes 2024.',
    codingNotes: [
      'Fédéralisme européen, proportionnelle et forte ouverture démocratique.',
      'Sobriété, renouvelables, agroécologie et rejet des assouplissements environnementaux.',
      'Ligne ouverte sur les migrations et plus libérale sur les libertés publiques.',
    ],
    sourceIds: ['greens-eu-2024', 'greens-project', 'greens-2026'],
    positions: {
      eu_powers: 2,
      eu_common_debt: 1,
      restrict_legal_immigration: -2,
      regularize_workers: 2,
      national_preference: -2,
      tougher_sentencing: -2,
      proportional_representation: 2,
      citizen_referendum: 1,
      retirement_62: 2,
      restore_wealth_tax: 2,
      labor_flexibility: -1,
      more_deficit_for_services: 1,
      build_new_nuclear: -2,
      accelerate_renewables: 2,
      keep_2035_ice_ban: 2,
      relax_farm_rules: -2,
      legalize_cannabis: 2,
      arm_ukraine: 1,
      distance_from_nato: 0,
      integrated_eu_defense: 1,
    },
  },
  {
    id: 'reconquete',
    name: 'Reconquete',
    shortName: 'Reconquete',
    family: 'Droite radicale identitaire',
    color: '#5c2130',
    currentFigures: 'Figures associées: Éric Zemmour, Sarah Knafo',
    summary:
      "Profil ultra-souverainiste, très restrictif sur l'immigration, très pro-nucléaire, hostile aux normes climatiques sur l'automobile et favorable à une ligne géostratégique très autonome.",
    inclusionNote:
      "Profil retenu car force significative à l'élection européenne 2024 et candidature 2027 plausible autour de Zemmour.",
    codingNotes: [
      'Préférence nationale et durcissement migratoire maximaux.',
      'Pro-compétitivité, anti-ISF, anti-2035 et très pro-nucléaire.',
      "Forte distance avec l'OTAN telle qu'elle fonctionne et rejet d'une défense européenne intégratrice.",
    ],
    sourceIds: ['rq-programme', 'rq-immigration', 'rq-nuclear', 'rq-auto', 'rq-army'],
    positions: {
      eu_powers: -2,
      eu_common_debt: -2,
      restrict_legal_immigration: 2,
      regularize_workers: -2,
      national_preference: 2,
      tougher_sentencing: 2,
      proportional_representation: 1,
      citizen_referendum: 2,
      retirement_62: -2,
      restore_wealth_tax: -2,
      labor_flexibility: 2,
      more_deficit_for_services: -1,
      build_new_nuclear: 2,
      accelerate_renewables: -2,
      keep_2035_ice_ban: -2,
      relax_farm_rules: 2,
      legalize_cannabis: -2,
      arm_ukraine: -2,
      distance_from_nato: 2,
      integrated_eu_defense: -2,
    },
  },
  {
    id: 'pcf',
    name: 'Parti communiste français',
    shortName: 'PCF',
    family: 'Gauche communiste',
    color: '#b61b24',
    currentFigures: 'Figures associées: Fabien Roussel, Léon Deffontaines',
    summary:
      "Profil très redistributif, favorable aux services publics, pro-nucléaire à gauche, critique de l'OTAN et réservé sur le fédéralisme européen.",
    inclusionNote:
      'Profil retenu pour couvrir une gauche populaire distincte à la fois de LFI, du PS et des Écologistes.',
    codingNotes: [
      'Priorité aux services publics, à la réindustrialisation et à la redistribution.',
      'Position originale à gauche: très favorable au nucléaire civil.',
      "Ligne pacifiste et critique forte de l'OTAN et de l'économie de guerre.",
    ],
    sourceIds: ['pcf-eu-2024', 'pcf-campaign', 'pcf-ukraine', 'pcf-war'],
    positions: {
      eu_powers: -1,
      eu_common_debt: 1,
      restrict_legal_immigration: -1,
      regularize_workers: 2,
      national_preference: -2,
      tougher_sentencing: -1,
      proportional_representation: 2,
      citizen_referendum: 1,
      retirement_62: 2,
      restore_wealth_tax: 2,
      labor_flexibility: -2,
      more_deficit_for_services: 2,
      build_new_nuclear: 2,
      accelerate_renewables: 0,
      keep_2035_ice_ban: 0,
      relax_farm_rules: 0,
      legalize_cannabis: 0,
      arm_ukraine: -2,
      distance_from_nato: 2,
      integrated_eu_defense: -1,
    },
  },
]
