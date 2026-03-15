import {
  futureQuestions,
  questions,
  type FutureTheme,
  type GlossaryTerm,
  type RecentExample,
  type Theme,
} from './content'

type CoreQuestionId = (typeof questions)[number]['id']
type FutureQuestionId = (typeof futureQuestions)[number]['id']

export interface PresentationSource {
  label: string
  url: string
}

export interface PolicyLens {
  label: string
  gains: string[]
  risks: string[]
}

export type QuestionVisual =
  | {
      kind: 'bars'
      title: string
      subtitle: string
      sourceLabel: string
      sourceUrl: string
      items: Array<{
        label: string
        value: number
        suffix?: string
        note: string
      }>
    }
  | {
      kind: 'timeline'
      title: string
      subtitle: string
      sourceLabel: string
      sourceUrl: string
      items: Array<{
        label: string
        title: string
        note: string
      }>
    }

export interface QuestionBriefing {
  decisionFrame: string
  currentState: string
  previousPolicies: string
  ifFor: PolicyLens
  ifAgainst: PolicyLens
  visual: QuestionVisual
  sources: PresentationSource[]
}

export interface QuestionPresentation {
  statement: string
  plainLanguage: string
  explainer: string
  example: string
  whySelected: string
  glossary: GlossaryTerm[]
  recentExample: RecentExample
  briefing: QuestionBriefing
}

export interface FutureQuestionPresentation {
  statement: string
  plainLanguage: string
  explainer: string
  whyNow: string
  glossary: GlossaryTerm[]
  sourceLabel: string
  sourceUrl: string
}

export const themeDisplayLabels: Record<Theme, string> = {
  Europe: 'Europe',
  'Ordre & societe': 'Ordre & société',
  Institutions: 'Institutions',
  'Economie & social': 'Économie & social',
  'Ecologie & energie': 'Écologie & énergie',
  International: 'International',
}

export const themeDescriptionsFr: Record<Theme, string> = {
  Europe: 'Intégration, souveraineté, commerce et règles communes.',
  'Ordre & societe': "Immigration, sécurité, droits et rapport à l'autorité.",
  Institutions: 'Mécanismes démocratiques et mode de représentation.',
  'Economie & social': 'Retraites, fiscalité, emploi et niveau de dépense publique.',
  'Ecologie & energie': 'Climat, agriculture, nucléaire et mobilités.',
  International: 'Ukraine, OTAN et défense européenne.',
}

export const futureThemeDisplayLabels: Record<FutureTheme, string> = {
  'IA & travail': 'IA & travail',
  'Adaptation & eau': 'Adaptation & eau',
  'Grand age': 'Grand âge',
  Logement: 'Logement',
  Numerique: 'Numérique',
}

const eurostatResidencePermitsUrl =
  'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Residence_permits_-_statistics_on_first_permits_issued_during_the_year'
const recoveryPlanUrl = 'https://commission.europa.eu/strategy-and-policy/recovery-plan-europe_en'
const immigrationLawUrl =
  'https://www.vie-publique.fr/loi/292057-loi-du-26-janvier-2024-pour-controler-limmigration-ameliorer-lintegration'
const ofdtCannabisUrl = 'https://www.ofdt.fr/produits-et-addictions/de-z/cannabis/'
const rteElectricityDatasetUrl =
  'https://www.data.gouv.fr/datasets/electricite-consommation-production-co2-et-echanges'
const inseeEmploymentDatasetUrl =
  'https://www.data.gouv.fr/datasets/activite-emploi-et-chomage-series-longues'
const pesticidesDatasetUrl =
  'https://www.data.gouv.fr/datasets/ventes-de-pesticides-par-departement'
const referendumHistoryUrl = 'https://www.vie-publique.fr/fiches/19407-referendum-initiative-partagee-rip'

export const questionPresentations: Record<CoreQuestionId, QuestionPresentation> = {
  eu_powers: {
    statement:
      "L'Union européenne devrait disposer de davantage de pouvoirs face aux États membres.",
    plainLanguage:
      "En clair: faut-il que plus de décisions importantes soient prises à l'échelle européenne plutôt qu'au niveau national ?",
    explainer:
      'Cette question oppose un réflexe fédéraliste, une logique de coopération renforcée et une lecture plus souverainiste de la démocratie.',
    example:
      "Exemple: davantage de décisions prises en commun sur l'énergie, les frontières, l'industrie ou la défense, et moins de marge laissée à Paris seul.",
    whySelected:
      'Les comparateurs robustes doivent couvrir les grands clivages institutionnels. En France, le rapport à la souveraineté européenne en fait clairement partie.',
    glossary: [
      {
        term: 'Union européenne',
        definition:
          "Les institutions communes de l'UE qui fixent des règles, des normes ou des financements partagés entre plusieurs pays.",
      },
      {
        term: 'États membres',
        definition: "Les pays de l'UE, comme la France, l'Allemagne, l'Espagne ou l'Italie.",
      },
    ],
    recentExample: {
      title: "14 mai 2024: l'UE adopte le pacte sur la migration et l'asile",
      context:
        "Le Conseil de l'UE a validé un paquet qui harmonise davantage les procédures d'asile, les contrôles aux frontières et la solidarité entre États membres.",
      impact:
        "Donner encore plus de pouvoirs à l'UE irait dans le même sens: moins de marge nationale sur des sujets comme l'asile, les contrôles ou certaines normes communes.",
      sourceLabel: "Conseil de l'UE, pacte sur la migration et l'asile",
      sourceUrl:
        'https://www.consilium.europa.eu/fr/policies/eu-migration-policy/eu-migration-asylum-reform-pact/',
    },
    briefing: {
      decisionFrame:
        "La vraie question n'est pas “aimez-vous l'Europe ?” mais “qui doit avoir le dernier mot quand un problème dépasse déjà les frontières nationales ?”.",
      currentState:
        "Aujourd'hui, l'UE décide déjà seule sur le commerce, la concurrence ou une partie des normes climatiques. D'autres sujets restent principalement nationaux, comme l'impôt, l'organisation de l'État-providence ou une large part de la défense.",
      previousPolicies:
        "Depuis Maastricht, chaque crise a poussé un peu plus de coordination: monnaie unique, plan de relance post-Covid, réponse énergétique, migration, défense industrielle.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous privilégiez des réponses plus cohérentes à des marchés, des chaînes industrielles et des frontières déjà intégrés.",
          "Vous acceptez qu'une part des arbitrages se fasse plus loin du niveau national pour gagner en poids collectif face aux États-Unis, à la Chine ou à la Russie.",
        ],
        risks: [
          "Vous prenez le risque d'une décision plus éloignée du contrôle parlementaire et médiatique français.",
          "Vous acceptez des compromis parfois mal adaptés à la situation française si les autres pays n'ont pas les mêmes priorités.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous gardez un lien plus direct entre le vote national, le gouvernement français et la décision finale.",
          "Vous préservez davantage de souplesse pour adapter la politique publique aux priorités du pays.",
        ],
        risks: [
          "Vous acceptez des réponses parfois plus lentes ou moins puissantes face à des problèmes réellement transnationaux.",
          "Vous prenez le risque d'une Europe plus fragmentée, donc moins capable d'imposer ses règles aux grandes puissances.",
        ],
      },
      visual: {
        kind: 'timeline',
        title: "Trois moments où l'UE a pris plus de place",
        subtitle: 'Repères institutionnels utiles avant de répondre.',
        sourceLabel: 'Commission européenne, plan de relance pour l’Europe',
        sourceUrl: recoveryPlanUrl,
        items: [
          {
            label: '1992',
            title: 'Maastricht',
            note: "L'intégration politique et monétaire franchit un cap, ce qui nourrit encore aujourd'hui le débat sur la souveraineté.",
          },
          {
            label: '2020',
            title: 'Plan de relance commun',
            note: "L'UE s'endette ensemble pour financer la reprise post-Covid, ce qui était auparavant beaucoup plus tabou.",
          },
          {
            label: '2024',
            title: 'Pacte migration et asile',
            note: "Les règles communes s'étendent encore sur un sujet qui touche directement à la souveraineté et au contrôle des frontières.",
          },
        ],
      },
      sources: [
        { label: 'Conseil de l’UE, pacte migration et asile', url: 'https://www.consilium.europa.eu/fr/policies/eu-migration-policy/eu-migration-asylum-reform-pact/' },
        { label: 'Commission européenne, plan de relance pour l’Europe', url: recoveryPlanUrl },
      ],
    },
  },
  eu_common_debt: {
    statement:
      "L'Union européenne devrait emprunter davantage en commun pour financer l'industrie, la défense et la transition climatique.",
    plainLanguage:
      "En clair: les pays européens doivent-ils pouvoir s'endetter ensemble pour investir davantage ?",
    explainer:
      "La question mesure votre rapport à la mutualisation: chacun finance seul ses priorités, ou bien l'UE lève de l'argent en commun ?",
    example:
      "Exemple: un grand emprunt européen pour des usines, des munitions, des réseaux électriques ou des batteries.",
    whySelected:
      "Les outils budgétaires communs reconfigurent déjà les programmes sur l'industrie, la défense et le climat. Les ignorer biaiserait le comparateur.",
    glossary: [
      {
        term: 'emprunter davantage en commun',
        definition:
          "Lever de l'argent au niveau de l'UE, puis le prêter ou le dépenser ensemble plutôt que via 27 dettes nationales séparées.",
      },
    ],
    recentExample: {
      title: '27 mai 2025: le Conseil valide SAFE',
      context:
        "L'instrument SAFE permet jusqu'à 150 milliards d'euros de prêts européens pour des achats de défense, financés par des levées de fonds au niveau de l'UE.",
      impact:
        "Étendre cette logique à l'industrie ou au climat reviendrait à mutualiser davantage l'endettement plutôt que laisser chaque État financer seul ses investissements.",
      sourceLabel: 'Commission européenne, SAFE',
      sourceUrl:
        'https://defence-industry-space.ec.europa.eu/eu-defence-industry/safe-security-action-europe_en',
    },
    briefing: {
      decisionFrame:
        "Ici, vous arbitrez entre solidarité financière et responsabilité nationale. Ce n'est pas la même chose que d'être “pour” ou “contre” l'UE en général.",
      currentState:
        "L'UE a déjà franchi un cap avec le plan de relance post-Covid. Le débat porte désormais sur la défense, l'industrie et la transition énergétique: faut-il refaire, ou non, des outils de dette commune sur ces sujets ?",
      previousPolicies:
        "Avant 2020, l'endettement commun européen restait très limité. Depuis, il est devenu un précédent politique concret, ce qui change le débat de fond.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous privilégiez des investissements plus massifs, plus rapides et plus coordonnés entre États.",
          "Vous considérez que les chocs géopolitiques ou climatiques justifient de partager une partie du risque financier.",
        ],
        risks: [
          "Vous acceptez que des pays très différents garantissent ensemble une dette commune.",
          "Vous ouvrez la porte à des tensions politiques si certains États jugent payer pour les autres ou contester la gouvernance commune.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous gardez une responsabilité budgétaire plus claire: chaque pays répond de ses propres choix.",
          "Vous évitez qu'une intégration financière supplémentaire crée de nouveaux conflits entre contributeurs et bénéficiaires.",
        ],
        risks: [
          "Vous acceptez des écarts d'investissement très forts entre pays riches et pays sous contrainte budgétaire.",
          "Vous prenez le risque d'une réponse plus lente et plus dispersée face à des besoins industriels ou militaires urgents.",
        ],
      },
      visual: {
        kind: 'bars',
        title: "L'échelle des instruments communs a déjà changé",
        subtitle: "Montants annoncés ou votés au niveau européen.",
        sourceLabel: 'Commission européenne, plan de relance pour l’Europe',
        sourceUrl: recoveryPlanUrl,
        items: [
          {
            label: '2020 NGEU',
            value: 750,
            suffix: ' Md€',
            note: "Le plan de relance post-Covid a banalisé l'idée d'un grand financement commun.",
          },
          {
            label: '2025 SAFE',
            value: 150,
            suffix: ' Md€',
            note: "La défense entre à son tour dans la logique de prêts européens levés en commun.",
          },
        ],
      },
      sources: [
        { label: 'Commission européenne, plan de relance pour l’Europe', url: recoveryPlanUrl },
        { label: 'Commission européenne, SAFE', url: 'https://defence-industry-space.ec.europa.eu/eu-defence-industry/safe-security-action-europe_en' },
      ],
    },
  },
  restrict_legal_immigration: {
    statement:
      "La France devrait durcir fortement l'immigration légale et les conditions du regroupement familial.",
    plainLanguage:
      "En clair: faut-il rendre plus difficile l'entrée légale en France et la venue de la famille d'un étranger déjà installé ?",
    explainer:
      "La question ne porte pas sur l'immigration irrégulière, mais sur les règles ordinaires d'admission, de séjour et de vie familiale.",
    example:
      "Exemple: plus de conditions sur les visas, les revenus, le logement ou la durée de séjour avant regroupement familial.",
    whySelected:
      'Le sujet est central dans le débat français et distingue fortement les blocs politiques, y compris à droite.',
    glossary: [
      {
        term: 'immigration légale',
        definition:
          "Les entrées autorisées par l'État via des visas, titres de séjour, études, travail ou famille.",
      },
      {
        term: 'regroupement familial',
        definition:
          "La procédure qui permet à une personne étrangère installée légalement en France de faire venir une partie de sa famille.",
      },
    ],
    recentExample: {
      title: '1er novembre 2024: rappel actualisé des règles du regroupement familial',
      context:
        "Service-Public rappelle qu'il faut déjà un séjour préalable, des ressources stables et suffisantes et un logement adapté pour faire venir sa famille.",
      impact:
        "Durcir fortement cette politique signifierait relever les seuils, allonger l'attente ou fermer davantage de cas, donc rendre l'immigration familiale plus sélective.",
      sourceLabel: 'Service-Public, regroupement familial',
      sourceUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F11166',
    },
    briefing: {
      decisionFrame:
        "Cette question oppose deux priorités légitimes mais concurrentes: mieux contrôler les flux, ou mieux sécuriser les parcours de vie et de travail déjà engagés.",
      currentState:
        "La France filtre déjà les admissions selon le motif du séjour. Le débat politique porte sur un durcissement supplémentaire: revenu minimal, durée d'installation, visas, droit à la famille et sélectivité des titres.",
      previousPolicies:
        "Depuis vingt ans, les règles ont été régulièrement resserrées sans pour autant faire disparaître le débat. La loi de 2024 a de nouveau déplacé le curseur sur l'immigration et l'intégration.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous cherchez à réduire plus vite le nombre d'entrées et à rendre le système plus sélectif.",
          "Vous considérez que l'État doit d'abord maîtriser sa capacité d'accueil, de logement et d'intégration.",
        ],
        risks: [
          "Vous pouvez compliquer des parcours de familles déjà intégrées et aggraver des pénuries dans certains métiers.",
          "Vous augmentez le poids administratif, les contentieux et le sentiment d'instabilité pour des personnes en règle.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous facilitez des parcours de vie plus stables pour les étudiants, salariés et familles déjà admis légalement.",
          "Vous réduisez le risque de précarisation administrative sur des situations que l'État a déjà reconnues.",
        ],
        risks: [
          "Vous acceptez des flux potentiellement plus élevés ou plus difficiles à limiter politiquement.",
          "Vous prenez le risque d'alimenter le sentiment que l'État contrôle mal les admissions, même quand elles sont légales.",
        ],
      },
      visual: {
        kind: 'bars',
        title: 'Premiers titres de séjour délivrés par la France',
        subtitle: 'Ordres de grandeur récents, toutes nationalités et motifs confondus.',
        sourceLabel: 'Eurostat, first residence permits',
        sourceUrl: eurostatResidencePermitsUrl,
        items: [
          {
            label: '2022',
            value: 324.2,
            suffix: ' k',
            note: "Le sujet porte sur un volume réel et visible dans les statistiques, pas seulement sur une perception.",
          },
          {
            label: '2023',
            value: 335.4,
            suffix: ' k',
            note: "La France reste l'un des pays où le débat sur les admissions légales est politiquement très structurant.",
          },
          {
            label: '2024',
            value: 342.1,
            suffix: ' k',
            note: "Un durcissement supplémentaire viserait précisément ce type de flux légaux.",
          },
        ],
      },
      sources: [
        { label: 'Service-Public, regroupement familial', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F11166' },
        { label: 'Eurostat, first residence permits', url: eurostatResidencePermitsUrl },
        { label: 'Vie publique, loi immigration de 2024', url: immigrationLawUrl },
      ],
    },
  },
  regularize_workers: {
    statement:
      'Les travailleurs sans papiers installés de longue date devraient pouvoir être régularisés plus facilement.',
    plainLanguage:
      "En clair: une personne qui travaille en France depuis longtemps sans papiers doit-elle pouvoir obtenir plus facilement un titre de séjour ?",
    explainer:
      "La question porte sur des personnes déjà présentes et souvent déjà au travail. On parle donc de droits, de pénuries de main-d'œuvre et de contrôle administratif en même temps.",
    example:
      "Exemple: un salarié déjà intégré dans un métier en tension pourrait obtenir un titre plus vite et avec moins d'incertitude.",
    whySelected:
      'Il faut traiter le sujet migratoire sous plusieurs angles. Sinon, on confond fermeture des flux et gestion des situations déjà présentes.',
    glossary: [
      {
        term: 'sans papiers',
        definition: "Une personne présente en France sans titre de séjour valable à ce moment-là.",
      },
      {
        term: 'régularisés',
        definition:
          "Obtenir un titre de séjour officiel alors que la personne était jusque-là en situation administrative irrégulière.",
      },
    ],
    recentExample: {
      title: '21 mai 2025: nouvelle liste des métiers en tension',
      context:
        "Après la loi immigration du 28 janvier 2024, la régularisation exceptionnelle des travailleurs sans papiers reste liée aux métiers en tension et à l'examen du dossier par la préfecture.",
      impact:
        "Une régularisation plus facile élargirait les secteurs éligibles, réduirait l'incertitude administrative et permettrait à davantage de travailleurs déjà en emploi de sortir de la précarité.",
      sourceLabel: 'Service-Public, nouvelle liste des métiers en tension',
      sourceUrl: 'https://www.service-public.gouv.fr/particuliers/actualites/A17135',
    },
    briefing: {
      decisionFrame:
        "La question revient à arbitrer entre deux logiques: faire de la règle un signal de fermeté, ou traiter de façon plus pragmatique des situations de travail déjà installées.",
      currentState:
        "En pratique, la régularisation existe déjà mais reste exceptionnelle, préfectorale et souvent incertaine. La loi de 2024 l'a davantage encadrée autour des métiers en tension plutôt qu'ouverte très largement.",
      previousPolicies:
        "Depuis la circulaire Valls de 2012, la France pratique un traitement au cas par cas. Le débat actuel porte surtout sur le degré de simplicité, de transparence et d'automaticité du dispositif.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous privilégiez la sortie de la précarité administrative pour des personnes déjà insérées dans l'emploi.",
          "Vous considérez qu'il vaut mieux encadrer et déclarer du travail réel plutôt que laisser prospérer le travail dissimulé.",
        ],
        risks: [
          "Vous prenez le risque d'envoyer un signal politique perçu comme plus permissif sur les séjours irréguliers.",
          "Vous pouvez créer un effet d'appel perçu si la régularisation apparaît trop automatique ou trop large.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous maintenez un lien plus strict entre respect initial des règles de séjour et accès au titre.",
          "Vous réduisez le risque que la régularisation soit vue comme une voie alternative d'entrée durable.",
        ],
        risks: [
          "Vous laissez perdurer du travail précaire, sous-payé ou difficilement contrôlable.",
          "Vous acceptez que des secteurs déjà en tension continuent à dépendre d'une main-d'œuvre sans statut stable.",
        ],
      },
      visual: {
        kind: 'timeline',
        title: 'Comment la France a traité ce sujet récemment',
        subtitle: 'Une politique déjà existante, mais jamais vraiment stabilisée.',
        sourceLabel: 'Service-Public, métiers en tension',
        sourceUrl: 'https://www.service-public.gouv.fr/particuliers/actualites/A17135',
        items: [
          {
            label: '2012',
            title: 'Circulaire Valls',
            note: "Le cas par cas devient la logique dominante pour les travailleurs présents et insérés.",
          },
          {
            label: '2024',
            title: 'Loi immigration',
            note: "Le législateur encadre davantage la régularisation autour des besoins du marché du travail.",
          },
          {
            label: '2025',
            title: 'Nouvelle liste des métiers en tension',
            note: "La question bascule encore plus vers un arbitrage entre contrôle migratoire et pénurie de main-d'œuvre.",
          },
        ],
      },
      sources: [
        { label: 'Service-Public, métiers en tension', url: 'https://www.service-public.gouv.fr/particuliers/actualites/A17135' },
        { label: 'Vie publique, loi immigration de 2024', url: immigrationLawUrl },
      ],
    },
  },
  national_preference: {
    statement:
      'Les aides sociales devraient être réservées en priorité aux citoyens français ou aux étrangers présents depuis longtemps.',
    plainLanguage:
      "En clair: faut-il donner la priorité aux Français, ou aux étrangers installés depuis longtemps, pour certaines aides sociales ?",
    explainer:
      "On mesure ici la logique de préférence nationale, qui ne se confond ni avec la lutte contre l'immigration irrégulière ni avec la seule question budgétaire.",
    example:
      "Exemple: logement social, allocations ou minima sociaux accessibles plus tardivement pour les nouveaux arrivants, même réguliers.",
    whySelected:
      "Cette ligne de fracture distingue fortement l'extrême droite, une partie de la droite et les partis plus universalistes.",
    glossary: [
      {
        term: 'aides sociales',
        definition:
          "Des prestations ou avantages publics comme certaines allocations, minima sociaux ou accès au logement social.",
      },
    ],
    recentExample: {
      title: '25 janvier 2024: le Conseil constitutionnel censure plusieurs restrictions sociales',
      context:
        "Dans sa décision sur la loi immigration, le Conseil a écarté plusieurs mesures qui allongeaient l'accès de certains étrangers aux prestations sociales.",
      impact:
        "Une logique de préférence nationale irait à l'inverse: elle retarderait ou conditionnerait davantage l'accès à certaines aides pour les nouveaux arrivants, même réguliers.",
      sourceLabel: 'Conseil constitutionnel, décision 2023-863 DC',
      sourceUrl: 'https://qpc360.conseil-constitutionnel.fr/commentaire-decision-2023-863-dc',
    },
    briefing: {
      decisionFrame:
        "La vraie question est de savoir ce qui fonde l'accès à la solidarité: la citoyenneté, la durée de présence, le travail, ou l'universalité du droit social.",
      currentState:
        "En France, l'accès aux droits n'est déjà pas identique pour tous: il dépend du statut de séjour, de la durée de résidence et du type de prestation. Mais une préférence nationale générale se heurte à de fortes limites constitutionnelles et conventionnelles.",
      previousPolicies:
        "La droite et l'extrême droite défendent régulièrement des délais ou priorités d'accès. En 2024, plusieurs restrictions ont été censurées, ce qui rappelle que le débat n'est pas seulement politique: il est aussi juridique.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous cherchez à réserver plus explicitement l'effort collectif aux nationaux ou aux résidents les plus anciens.",
          "Vous considérez qu'un État-providence a besoin de bornes politiques lisibles pour rester accepté.",
        ],
        risks: [
          "Vous exposez la politique à des censures juridiques répétées ou à des conflits avec des principes d'égalité.",
          "Vous pouvez accentuer la stigmatisation de publics déjà fragiles, y compris en situation régulière.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous défendez une logique plus universaliste où l'accès aux droits dépend d'abord de la situation sociale et légale.",
          "Vous limitez les ruptures de droits qui peuvent compliquer l'intégration, l'emploi ou l'accès au logement.",
        ],
        risks: [
          "Vous acceptez que le système reste politiquement plus exposé à la critique du “tout le monde a droit à tout”.",
          "Vous prenez le risque de sous-estimer la demande de hiérarchie symbolique entre citoyens, résidents durables et nouveaux arrivants.",
        ],
      },
      visual: {
        kind: 'timeline',
        title: 'Le point de tension ici est surtout juridique',
        subtitle: "Le débat revient régulièrement, mais il bute sur des principes supérieurs.",
        sourceLabel: 'Conseil constitutionnel, décision 2023-863 DC',
        sourceUrl: 'https://qpc360.conseil-constitutionnel.fr/commentaire-decision-2023-863-dc',
        items: [
          {
            label: '2023',
            title: 'Vote de la loi immigration',
            note: "Le Parlement tente d'introduire plusieurs délais plus stricts d'accès aux prestations.",
          },
          {
            label: '2024',
            title: 'Censure constitutionnelle',
            note: "Plusieurs restrictions tombent, ce qui montre qu'il ne suffit pas d'avoir une majorité politique pour changer la règle.",
          },
          {
            label: '2026+',
            title: 'Débat récurrent',
            note: "Le sujet restera probablement présent car il touche à la définition même de la solidarité nationale.",
          },
        ],
      },
      sources: [
        { label: 'Conseil constitutionnel, décision 2023-863 DC', url: 'https://qpc360.conseil-constitutionnel.fr/commentaire-decision-2023-863-dc' },
        { label: 'Vie publique, loi immigration de 2024', url: immigrationLawUrl },
      ],
    },
  },
  tougher_sentencing: {
    statement:
      "Il faut augmenter les peines planchers et limiter davantage les aménagements de peine.",
    plainLanguage:
      "En clair: faut-il punir plus durement et laisser moins de possibilités d'alléger une peine de prison ?",
    explainer:
      "La question porte sur la doctrine pénale: plus d'automaticité et de fermeté, ou davantage d'individualisation et de réinsertion.",
    example:
      "Exemple: moins de bracelet électronique, moins de libération anticipée et plus de peines minimales automatiques.",
    whySelected:
      "Les questions sur l'ordre public ne se réduisent pas au nombre de policiers. La philosophie de la peine compte aussi.",
    glossary: [
      {
        term: 'peines planchers',
        definition:
          'Des peines minimales prévues par la loi, en dessous desquelles le juge peut moins facilement descendre.',
      },
      {
        term: 'aménagements de peine',
        definition:
          "Les modalités qui permettent d'exécuter une peine autrement qu'en prison classique, par exemple sous bracelet ou en semi-liberté.",
      },
    ],
    recentExample: {
      title: '13 juin 2025: la loi narcotrafic durcit déjà l’arsenal pénal',
      context:
        'Le nouveau texte crée notamment des quartiers carcéraux très sécurisés et renforce plusieurs outils répressifs contre les trafiquants.',
      impact:
        "Aller encore plus loin avec plus de peines planchers et moins d'aménagements pousserait davantage de condamnés vers la prison ferme et alourdirait la pression sur le système carcéral.",
      sourceLabel: 'Vie publique, loi contre le narcotrafic',
      sourceUrl:
        'https://www.vie-publique.fr/loi/297230-loi-du-13-juin-2025-visant-sortir-la-france-du-piege-du-narcotrafic',
    },
    briefing: {
      decisionFrame:
        "Il s'agit moins de savoir si vous êtes “dur” ou “laxiste” que de choisir entre exemplarité de la sanction et capacité à individualiser la réponse pénale.",
      currentState:
        "La France a déjà durci plusieurs volets de sa politique pénale et carcérale, alors même que les prisons restent sous forte tension. Le débat est donc autant pratique que symbolique.",
      previousPolicies:
        "Les peines planchers ont existé, puis été supprimées. Depuis, la politique pénale oscille entre retour à l'automaticité et défense du pouvoir d'appréciation du juge.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous privilégiez la lisibilité de la sanction et l'idée qu'une réponse pénale plus ferme décourage mieux certains passages à l'acte.",
          "Vous considérez que le juge doit avoir moins de marge quand l'ordre public paraît se dégrader.",
        ],
        risks: [
          "Vous augmentez la pression sur des prisons déjà saturées et sur les personnels pénitentiaires.",
          "Vous réduisez la capacité à distinguer des situations pourtant très différentes, ce qui peut produire des peines mal calibrées.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous défendez une justice plus individualisée, où le juge garde la possibilité d'adapter la peine au dossier.",
          "Vous limitez le recours mécanique à l'incarcération et ses effets sur la surpopulation carcérale.",
        ],
        risks: [
          "Vous acceptez que la sanction paraisse moins lisible ou moins dissuasive aux yeux d'une partie de l'opinion.",
          "Vous prenez le risque d'une application jugée inégale selon les juridictions ou les magistrats.",
        ],
      },
      visual: {
        kind: 'timeline',
        title: 'La doctrine pénale française a déjà changé plusieurs fois',
        subtitle: 'Le débat actuel s’inscrit dans une histoire récente.',
        sourceLabel: 'Vie publique, loi contre le narcotrafic',
        sourceUrl:
          'https://www.vie-publique.fr/loi/297230-loi-du-13-juin-2025-visant-sortir-la-france-du-piege-du-narcotrafic',
        items: [
          {
            label: '2007',
            title: 'Création des peines planchers',
            note: "Le législateur réduit la marge du juge dans plusieurs cas de récidive.",
          },
          {
            label: '2014',
            title: 'Suppression',
            note: "Le curseur revient vers l'individualisation et la réinsertion.",
          },
          {
            label: '2025',
            title: 'Nouveau durcissement narcotrafic',
            note: "Le débat repart sur la fermeté, même si ce n'est pas exactement le retour des peines planchers.",
          },
        ],
      },
      sources: [
        { label: 'Vie publique, loi contre le narcotrafic', url: 'https://www.vie-publique.fr/loi/297230-loi-du-13-juin-2025-visant-sortir-la-france-du-piege-du-narcotrafic' },
      ],
    },
  },
  proportional_representation: {
    statement:
      'Il faut introduire une forte dose de proportionnelle pour élire les députés.',
    plainLanguage:
      "En clair: faut-il que l'Assemblée nationale représente mieux les petits et moyens partis, même si cela rend les majorités plus difficiles ?",
    explainer:
      "Vous choisissez ici entre deux biens politiques différents: une représentation plus fidèle des voix, ou une fabrication plus simple des majorités.",
    example:
      "Exemple: un parti faisant 15 % des voix obtiendrait davantage de députés qu'aujourd'hui.",
    whySelected:
      "Les institutions françaises structurent fortement l'offre politique. Il faut donc poser au moins une vraie question sur le mode de scrutin.",
    glossary: [
      {
        term: 'proportionnelle',
        definition:
          "Un mode de scrutin où le nombre de sièges suit davantage le pourcentage de voix obtenu par chaque parti au niveau national ou régional.",
      },
      {
        term: 'députés',
        definition: "Les élus qui siègent à l'Assemblée nationale et votent les lois.",
      },
    ],
    recentExample: {
      title: 'Juin-juillet 2024: les législatives produisent une Assemblée très fragmentée',
      context:
        'Le scrutin majoritaire à deux tours a transformé les rapports de force nationaux en 577 duels locaux, avec trois blocs importants mais aucun majoritaire.',
      impact:
        "Avec plus de proportionnelle, le nombre de sièges suivrait davantage le score national des partis, et moins les retraits, alliances et configurations locales.",
      sourceLabel: "Ministère de l'Intérieur, résultats des législatives 2024",
      sourceUrl:
        'https://www.archives-resultats-elections.interieur.gouv.fr/resultats/legislatives2024/',
    },
    briefing: {
      decisionFrame:
        "La question n'est pas “quel système est juste ?” mais “que voulez-vous corriger en priorité: la sous-représentation de certains votes, ou l'instabilité gouvernementale ?”.",
      currentState:
        "Le système majoritaire à deux tours favorise les grands blocs, les alliances locales et l'effet de barrage. Il peut donner une Assemblée peu fidèle au score national, mais il a longtemps aidé à dégager des majorités.",
      previousPolicies:
        "La France a déjà testé la proportionnelle intégrale aux législatives de 1986, puis est revenue au majoritaire en 1988. Le débat revient presque à chaque législature sans jamais être tranché.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous obtenez une Assemblée plus fidèle à la diversité réelle des votes exprimés.",
          "Vous réduisez l'effet “tout ou rien” du système actuel, où un parti peut être fort en voix mais faible en sièges.",
        ],
        risks: [
          "Vous augmentez la probabilité de coalitions fragiles, de négociations permanentes et de gouvernements plus instables.",
          "Vous pouvez renforcer la présence parlementaire de partis que d'autres électeurs espéraient justement contenir.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous gardez un système plus simple pour dégager des majorités et identifier une responsabilité politique claire.",
          "Vous conservez le lien fort entre député et territoire, ce qui compte encore dans la culture politique française.",
        ],
        risks: [
          "Vous acceptez que certaines forces soient structurellement sous-représentées malgré un score national élevé.",
          "Vous laissez subsister un sentiment d'injustice électorale qui alimente déjà la critique du système représentatif.",
        ],
      },
      visual: {
        kind: 'timeline',
        title: 'Pourquoi cette question revient sans cesse',
        subtitle: 'La France a déjà changé de mode de scrutin, puis fait marche arrière.',
        sourceLabel: "Ministère de l'Intérieur, résultats 2024",
        sourceUrl:
          'https://www.archives-resultats-elections.interieur.gouv.fr/resultats/legislatives2024/',
        items: [
          {
            label: '1986',
            title: 'Proportionnelle intégrale',
            note: "Une seule législature suffit à montrer qu'on peut mieux représenter les forces politiques, mais aussi rendre les équilibres plus délicats.",
          },
          {
            label: '1988',
            title: 'Retour au majoritaire',
            note: "Le système actuel revient au nom de la stabilité et de la clarté des majorités.",
          },
          {
            label: '2024',
            title: 'Assemblée sans majorité',
            note: "Le majoritaire ne garantit plus automatiquement la stabilité, ce qui relance le débat sur la proportionnelle.",
          },
        ],
      },
      sources: [
        { label: "Ministère de l'Intérieur, résultats 2024", url: 'https://www.archives-resultats-elections.interieur.gouv.fr/resultats/legislatives2024/' },
      ],
    },
  },
  citizen_referendum: {
    statement:
      "Le référendum d'initiative citoyenne devrait être beaucoup plus facile à déclencher.",
    plainLanguage:
      "En clair: voulez-vous que les citoyens puissent plus facilement imposer un référendum ?",
    explainer:
      "La question compare démocratie représentative classique et ouverture plus directe de la décision publique.",
    example:
      "Exemple: si un seuil de signatures est atteint, un vote national pourrait être organisé plus facilement qu'aujourd'hui.",
    whySelected:
      "Les recherches sur la sélection des statements montrent l'importance des dimensions démocratiques, distinctes des enjeux économiques ou migratoires.",
    glossary: [
      {
        term: "référendum d'initiative citoyenne",
        definition:
          'Un référendum que les citoyens pourraient déclencher eux-mêmes en réunissant un certain nombre de soutiens.',
      },
    ],
    recentExample: {
      title: "Règle actuelle: il faut 1/5 des parlementaires puis 1/10 du corps électoral",
      context:
        "La procédure du référendum d'initiative partagée reste très difficile à déclencher, ce qui explique pourquoi très peu de consultations arrivent jusqu'au vote.",
      impact:
        "Un vrai référendum d'initiative citoyenne, avec des seuils beaucoup plus bas, ferait entrer plus souvent des sujets comme les retraites ou l'immigration dans le vote direct.",
      sourceLabel: 'Service-Public, soutenir une proposition de loi RIP',
      sourceUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/R39695',
    },
    briefing: {
      decisionFrame:
        "Vous arbitrez entre deux idées démocratiques: protéger le temps long et les contre-pouvoirs, ou ouvrir davantage l'agenda politique à l'intervention directe des citoyens.",
      currentState:
        "La France dispose d'un référendum d'initiative partagée, mais le dispositif est si exigeant qu'il fonctionne surtout comme un mécanisme de verrouillage plutôt que comme un outil ordinaire de décision populaire.",
      previousPolicies:
        "Depuis la crise des Gilets jaunes, l'idée d'un RIC plus simple est devenue un marqueur politique. En face, ses opposants craignent une démocratie plus impulsive et plus vulnérable aux campagnes émotionnelles.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous ouvrez un débouché institutionnel à des demandes qui peuvent sinon se radicaliser hors des urnes.",
          "Vous redonnez aux citoyens un pouvoir d'agenda plus direct sur des sujets que les gouvernements préfèrent parfois éviter.",
        ],
        risks: [
          "Vous augmentez le poids des mobilisations les plus visibles, même quand elles ne reflètent pas toujours une majorité stable.",
          "Vous prenez le risque de simplifier à l'excès des choix complexes qui demandent du compromis et du temps parlementaire.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous protégez davantage la décision contre les emballements, les désinformations et les campagnes de court terme.",
          "Vous conservez la logique d'une démocratie représentative où le Parlement filtre, amende et stabilise les choix publics.",
        ],
        risks: [
          "Vous laissez subsister un sentiment d'impuissance civique sur des sujets très clivants.",
          "Vous entretenez l'idée que les institutions françaises ferment trop facilement la porte aux initiatives venues d'en bas.",
        ],
      },
      visual: {
        kind: 'bars',
        title: 'Les seuils actuels sont très élevés',
        subtitle: "Ce n'est pas un détail technique: cela change complètement la portée réelle du dispositif.",
        sourceLabel: 'Service-Public, procédure RIP',
        sourceUrl: 'https://www.service-public.gouv.fr/particuliers/vosdroits/R39695',
        items: [
          {
            label: 'Parlementaires',
            value: 185,
            note: "Avant même de solliciter les citoyens, il faut déjà convaincre un cinquième du Parlement.",
          },
          {
            label: 'Électeurs',
            value: 4.9,
            suffix: ' M',
            note: "Le seuil citoyen est si haut qu'aucun référendum national n'a été déclenché jusqu'au vote final.",
          },
        ],
      },
      sources: [
        { label: 'Service-Public, procédure RIP', url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/R39695' },
        { label: 'Vie publique, histoire du RIP', url: referendumHistoryUrl },
      ],
    },
  },
  retirement_62: {
    statement:
      "L'âge légal de départ à la retraite devrait revenir à 62 ans ou moins.",
    plainLanguage:
      "En clair: faut-il annuler le report de l'âge de départ à la retraite et revenir à 62 ans, voire plus bas ?",
    explainer:
      "Derrière la retraite, vous tranchez entre justice sociale, soutenabilité financière et partage du travail entre générations.",
    example:
      "Exemple: retour à 62 ans pour tous, ou 60 ans dans une ligne encore plus favorable au départ précoce.",
    whySelected:
      'La retraite reste un marqueur social majeur depuis 2023. C’est une question saillante, stable et très discriminante.',
    glossary: [
      {
        term: 'âge légal',
        definition: "L'âge minimum à partir duquel on peut demander sa retraite dans le régime général.",
      },
    ],
    recentExample: {
      title: "Depuis 2023, l'âge légal monte progressivement à 64 ans",
      context:
        "La réforme des retraites augmente l'âge légal par paliers selon l'année de naissance. C'est déjà visible dans les dates de départ des générations proches de la retraite.",
      impact:
        "Revenir à 62 ans ou moins avancerait les départs pour des millions d'actifs, mais exigerait soit davantage de cotisations, soit plus de déficit, soit d'autres recettes.",
      sourceLabel: 'Service-Public, réforme des retraites: ce qui change',
      sourceUrl: 'https://www.service-public.gouv.fr/particuliers/actualites/A16525',
    },
    briefing: {
      decisionFrame:
        "Ce choix oppose surtout deux priorités: partir plus tôt, ou sécuriser le financement du système sans lever davantage de recettes.",
      currentState:
        "La réforme de 2023 ne fait pas seulement bouger un chiffre symbolique: elle décale concrètement des départs, la durée de cotisation et la gestion des fins de carrière pour des millions d'actifs.",
      previousPolicies:
        "La France est passée de 60 ans en 1983 à 62 ans en 2010, puis à 64 ans en 2023. Chaque relèvement relance le même arbitrage entre pénibilité, budget et durée de vie au travail.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous privilégiez la possibilité de partir plus tôt, en particulier pour des carrières longues, usantes ou hachées.",
          "Vous considérez que le travail ne doit pas absorber une part toujours croissante de la vie adulte.",
        ],
        risks: [
          "Vous devez accepter davantage de recettes, moins d'autres dépenses ou plus de déficit pour équilibrer le système.",
          "Vous ne réglez pas forcément la difficulté à garder les seniors en emploi jusqu'à la retraite, qui reste un problème distinct.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous cherchez à limiter le coût budgétaire du vieillissement sans remonter fortement les cotisations ou les impôts.",
          "Vous alignez davantage la durée de carrière sur l'allongement de l'espérance de vie.",
        ],
        risks: [
          "Vous transférez une partie de l'ajustement sur des personnes déjà fatiguées ou exposées à l'usure professionnelle.",
          "Vous risquez d'augmenter les années passées entre emploi fragile, chômage et retraite tardive pour certains profils.",
        ],
      },
      visual: {
        kind: 'bars',
        title: 'Le curseur a déjà bougé plusieurs fois',
        subtitle: "L'âge légal est un choix politique, pas une donnée naturelle.",
        sourceLabel: 'Service-Public, réforme des retraites',
        sourceUrl: 'https://www.service-public.gouv.fr/particuliers/actualites/A16525',
        items: [
          {
            label: '1983',
            value: 60,
            suffix: ' ans',
            note: "La gauche arrive au pouvoir avec l'idée d'un départ plus tôt comme progrès social.",
          },
          {
            label: '2010',
            value: 62,
            suffix: ' ans',
            note: "Premier grand relèvement contemporain au nom de la soutenabilité financière.",
          },
          {
            label: '2023',
            value: 64,
            suffix: ' ans',
            note: "La réforme actuelle ravive le conflit entre équilibre budgétaire et justice sociale.",
          },
        ],
      },
      sources: [
        { label: 'Service-Public, réforme des retraites', url: 'https://www.service-public.gouv.fr/particuliers/actualites/A16525' },
      ],
    },
  },
  restore_wealth_tax: {
    statement:
      "Il faut rétablir un impôt sur la fortune plus large que l'actuel impôt sur la fortune immobilière.",
    plainLanguage:
      "En clair: faut-il taxer davantage les très gros patrimoines, pas seulement l'immobilier ?",
    explainer:
      "La question ne porte pas seulement sur les riches en général, mais sur la manière de taxer le patrimoine par rapport au travail, aux revenus ou à l'investissement.",
    example:
      "Exemple: inclure aussi les actions, placements financiers et autres actifs dans l'impôt sur la fortune.",
    whySelected:
      "Elle clarifie le clivage fiscal sans obliger l'utilisateur à raisonner en agrégats budgétaires trop techniques.",
    glossary: [
      {
        term: 'impôt sur la fortune',
        definition:
          "Un impôt calculé sur la valeur du patrimoine détenu au-dessus d'un certain seuil.",
      },
      {
        term: 'fortune immobilière',
        definition:
          "La partie du patrimoine composée surtout de biens immobiliers, comme une résidence ou des logements locatifs.",
      },
    ],
    recentExample: {
      title: '12 juin 2025: le Sénat débat de la taxe Zucman',
      context:
        "Un amendement discuté en 2025 proposait un impôt plancher de 2 % sur le patrimoine des personnes dépassant 1 milliard d'euros.",
      impact:
        "Un ISF plus large que l'IFI reviendrait déjà dans cette direction: taxer aussi les actifs financiers, pas seulement l'immobilier, pour concentrer l'effort sur les très grands patrimoines.",
      sourceLabel: 'Sénat, amendement I-1696',
      sourceUrl: 'https://www.senat.fr/enseance/2024-2025/143/Amdt_I-1696.html',
    },
    briefing: {
      decisionFrame:
        "Ici, vous arbitrez entre deux intuitions: le patrimoine accumulé doit contribuer davantage, ou bien il faut éviter de pénaliser l'investissement et l'attractivité.",
      currentState:
        "Depuis 2018, la France taxe encore le patrimoine immobilier de grande valeur via l'IFI, mais plus le patrimoine financier comme le faisait l'ISF. Le débat porte donc sur l'assiette de l'impôt, pas seulement sur son existence symbolique.",
      previousPolicies:
        "La France a longtemps eu un impôt large sur la fortune, avant de le recentrer sur l'immobilier. Depuis, la question revient dès qu'on débat de justice fiscale ou d'effort demandé aux très hauts patrimoines.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous cherchez à faire contribuer davantage les très grands patrimoines, pas seulement les revenus du travail.",
          "Vous considérez qu'une fiscalité plus progressive peut financer des services publics ou réduire les inégalités patrimoniales.",
        ],
        risks: [
          "Vous prenez le risque de décourager certains investissements ou d'alimenter des stratégies d'optimisation et d'exil fiscal.",
          "Vous ajoutez de la complexité pour valoriser correctement certains actifs financiers ou professionnels.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous privilégiez la stabilité fiscale et l'attractivité pour les investisseurs, entrepreneurs ou détenteurs de capital mobile.",
          "Vous évitez un impôt considéré par ses opposants comme peu rentable et fortement contournable.",
        ],
        risks: [
          "Vous acceptez que la redistribution repose davantage sur le travail, la consommation ou la dette publique.",
          "Vous prenez le risque d'alimenter le sentiment que les très grands patrimoines échappent à une partie de l'effort collectif.",
        ],
      },
      visual: {
        kind: 'bars',
        title: 'Le patrimoine reste très concentré',
        subtitle: 'Part du patrimoine brut détenue selon la position dans la distribution.',
        sourceLabel: 'Insee, enquête Histoire de vie et patrimoine',
        sourceUrl: 'https://www.insee.fr/fr/statistiques/5371259',
        items: [
          {
            label: 'Top 10 %',
            value: 47.1,
            suffix: ' %',
            note: "Une petite partie des ménages détient près de la moitié du patrimoine total.",
          },
          {
            label: 'Bas 50 %',
            value: 8.9,
            suffix: ' %',
            note: "La concentration patrimoniale explique pourquoi le débat fiscal ne se limite pas aux seuls revenus.",
          },
        ],
      },
      sources: [
        { label: 'Insee, enquête Histoire de vie et patrimoine', url: 'https://www.insee.fr/fr/statistiques/5371259' },
        { label: 'Sénat, amendement I-1696', url: 'https://www.senat.fr/enseance/2024-2025/143/Amdt_I-1696.html' },
      ],
    },
  },
  labor_flexibility: {
    statement:
      "Les entreprises devraient disposer de plus de flexibilité sur l'emploi et le temps de travail.",
    plainLanguage:
      "En clair: faut-il donner plus de marge aux entreprises pour organiser le travail, embaucher ou séparer plus facilement ?",
    explainer:
      "On mesure ici votre confiance relative dans le marché du travail: faut-il faciliter l'adaptation des entreprises, ou préserver d'abord les protections collectives ?",
    example:
      "Exemple: horaires plus adaptables, licenciements facilités ou règles moins contraignantes sur le contrat de travail.",
    whySelected:
      "Un comparateur gagne en validité quand il combine redistribution, protection du travail et rôle du marché.",
    glossary: [
      {
        term: 'flexibilité',
        definition:
          "Une marge plus grande laissée aux entreprises pour adapter rapidement les contrats, les horaires ou l'organisation du travail.",
      },
      {
        term: 'temps de travail',
        definition: "La durée et l'organisation du travail: horaires, semaines, heures supplémentaires, repos.",
      },
    ],
    recentExample: {
      title: "1er avril 2025: nouvelles règles d'assurance chômage",
      context:
        "Les nouvelles règles réduisent notamment la durée maximale d'indemnisation et ajustent les bornes d'âge, avec l'idée de fluidifier le retour vers l'emploi.",
      impact:
        "Une ligne plus favorable à la flexibilité pousserait généralement plus loin cette logique: plus de marge pour adapter les horaires, recruter vite et séparer plus facilement, avec moins de protections collectives.",
      sourceLabel: "Service-Public, nouvelles règles de l'assurance chômage",
      sourceUrl: 'https://www.service-public.gouv.fr/particuliers/actualites/A17953',
    },
    briefing: {
      decisionFrame:
        "Le choix de fond est simple à formuler mais lourd de conséquences: faut-il d'abord sécuriser les entreprises pour qu'elles embauchent, ou sécuriser les salariés pour qu'ils ne portent pas seuls l'ajustement ?",
      currentState:
        "La France a déjà beaucoup évolué depuis 2016-2017 vers plus de négociation d'entreprise et de souplesse. Le débat n'est donc pas abstrait: il porte sur la poursuite, ou non, de cette trajectoire.",
      previousPolicies:
        "Réforme El Khomri, ordonnances travail, durcissement de l'assurance chômage: le pays a déjà accumulé des réformes pro-flexibilité. La question est de savoir s'il faut continuer dans la même direction.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous cherchez à faciliter l'embauche, l'adaptation des horaires et la réorganisation des entreprises face aux chocs économiques.",
          "Vous considérez que des règles moins rigides peuvent soutenir l'activité, notamment dans les PME ou les secteurs en transformation rapide.",
        ],
        risks: [
          "Vous transférez davantage de risque économique sur les salariés, surtout les moins qualifiés ou les moins mobiles.",
          "Vous pouvez affaiblir les protections collectives sans garantie que les gains d'emploi soient durables ou bien répartis.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous protégez davantage la stabilité des revenus, des horaires et de la vie familiale des salariés.",
          "Vous défendez l'idée que le travail n'est pas une variable d'ajustement comme une autre.",
        ],
        risks: [
          "Vous acceptez que certaines entreprises embauchent moins ou hésitent plus face à l'incertitude.",
          "Vous pouvez maintenir des règles jugées trop uniformes pour des secteurs très différents.",
        ],
      },
      visual: {
        kind: 'timeline',
        title: 'La France n’est déjà plus au point de départ',
        subtitle: 'Trois étapes qui ont déjà déplacé le curseur.',
        sourceLabel: 'Insee, séries longues activité-emploi-chômage',
        sourceUrl: inseeEmploymentDatasetUrl,
        items: [
          {
            label: '2016',
            title: 'Loi El Khomri',
            note: "La hiérarchie entre accords de branche et d'entreprise commence à bouger.",
          },
          {
            label: '2017',
            title: 'Ordonnances travail',
            note: "La négociation d'entreprise et la simplification des règles de rupture avancent encore.",
          },
          {
            label: '2025',
            title: 'Assurance chômage plus stricte',
            note: "La logique de retour plus rapide à l'emploi se poursuit par un autre levier.",
          },
        ],
      },
      sources: [
        { label: "Service-Public, assurance chômage 2025", url: 'https://www.service-public.gouv.fr/particuliers/actualites/A17953' },
        { label: 'Insee, séries longues activité-emploi-chômage', url: inseeEmploymentDatasetUrl },
      ],
    },
  },
  more_deficit_for_services: {
    statement:
      'Il faut accepter davantage de déficit public à court terme pour financer les services publics.',
    plainLanguage:
      "En clair: acceptez-vous plus de dette publique si cela permet d'investir davantage dans l'hôpital, l'école ou les transports ?",
    explainer:
      "Cette question oppose discipline budgétaire et logique de relance ou de protection sociale. Elle ne se réduit pas à “dépenser plus” ou “dépenser moins”.",
    example:
      "Exemple: dépenser plus tout de suite pour les services publics, même si le budget revient moins vite à l'équilibre.",
    whySelected:
      "Elle permet de distinguer des partis parfois proches sur la dépense publique, mais pas sur son financement ni sur son rythme.",
    glossary: [
      {
        term: 'déficit public',
        definition:
          "La situation où l'État et les administrations dépensent plus d'argent sur une année qu'ils n'en reçoivent.",
      },
    ],
    recentExample: {
      title: "16 juillet 2025: le gouvernement prépare 44 milliards d'euros d'effort pour 2026",
      context:
        "Le cadrage budgétaire affiche une réduction rapide du déficit, ce qui suppose des arbitrages très durs sur les dépenses de l'État et de la protection sociale.",
      impact:
        "Accepter plus de déficit à court terme permettrait de desserrer cette contrainte et de financer plus facilement hôpital, école ou transports, au prix d'un retour plus lent à l'équilibre.",
      sourceLabel: 'Vie publique, Conseil des ministres du 16 juillet 2025 sur le budget',
      sourceUrl: 'https://www.vie-publique.fr/discours/299566-conseil-des-ministres-16072025-le-budget',
    },
    briefing: {
      decisionFrame:
        "Vous choisissez ici où placer la priorité immédiate: sur la qualité des services publics et l'investissement, ou sur le retour rapide à une trajectoire budgétaire plus stricte.",
      currentState:
        "La France finance déjà ses services publics avec un niveau de dépense élevé et un déficit supérieur à la norme européenne. Le débat porte donc sur un arbitrage réel: desserrer encore la contrainte, ou la resserrer malgré les besoins visibles à l'hôpital, à l'école ou dans les transports.",
      previousPolicies:
        "La pandémie a rendu acceptable un déficit très élevé. Depuis, la pression de retour à la norme budgétaire est revenue, alors même que les attentes de service public restent fortes.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous donnez de l'air à des services publics qui peinent à absorber la démographie, les urgences sociales ou l'usure des infrastructures.",
          "Vous privilégiez l'investissement et la qualité de service plutôt qu'un ajustement budgétaire très rapide.",
        ],
        risks: [
          "Vous acceptez de reporter la facture sur davantage de dette, donc sur les années suivantes.",
          "Vous prenez le risque d'une moindre crédibilité budgétaire et d'une dépendance plus forte aux taux d'intérêt.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous cherchez à éviter qu'une dette durablement élevée réduise ensuite la marge d'action publique.",
          "Vous considérez qu'un État plus discipliné peut protéger sur le long terme les mêmes services publics.",
        ],
        risks: [
          "Vous acceptez des coupes ou arbitrages immédiats alors que certains services sont déjà en tension.",
          "Vous risquez de transformer un problème de financement en dégradation concrète de la qualité des prestations.",
        ],
      },
      visual: {
        kind: 'bars',
        title: 'Le point de départ budgétaire reste contraint',
        subtitle: 'Comparer la situation française récente à la référence européenne aide à cadrer le débat.',
        sourceLabel: 'Vie publique, budget 2026',
        sourceUrl: 'https://www.vie-publique.fr/discours/299566-conseil-des-ministres-16072025-le-budget',
        items: [
          {
            label: 'Déficit 2024',
            value: 5.8,
            suffix: ' % PIB',
            note: "La France part déjà d'un niveau élevé, ce qui rend la question du “encore plus” politiquement décisive.",
          },
          {
            label: 'Référence UE',
            value: 3,
            suffix: ' % PIB',
            note: "La norme européenne reste le point de comparaison qui structure le débat budgétaire.",
          },
        ],
      },
      sources: [
        { label: 'Vie publique, budget 2026', url: 'https://www.vie-publique.fr/discours/299566-conseil-des-ministres-16072025-le-budget' },
      ],
    },
  },
  build_new_nuclear: {
    statement:
      'La France doit construire de nouveaux réacteurs nucléaires et prolonger son parc existant.',
    plainLanguage:
      "En clair: faut-il miser davantage sur l'énergie nucléaire pour produire l'électricité en France ?",
    explainer:
      "Ici, vous tranchez entre plusieurs priorités: souveraineté énergétique, climat, coût industriel, vitesse de déploiement et gestion du risque.",
    example:
      "Exemple: prolonger les centrales actuelles et lancer de nouveaux réacteurs plutôt que sortir progressivement du nucléaire.",
    whySelected:
      "Le nucléaire est l'un des clivages programmatiques les plus nets en France. Il structure autant la politique climatique que la politique industrielle.",
    glossary: [
      {
        term: 'réacteurs nucléaires',
        definition:
          "Les installations qui produisent de l'électricité à partir de la fission nucléaire dans les centrales.",
      },
      {
        term: 'parc existant',
        definition: "L'ensemble des centrales nucléaires déjà en service aujourd'hui en France.",
      },
    ],
    recentExample: {
      title: '2025: la France confirme le programme de six EPR2',
      context:
        "Le plan français prévoit six nouveaux réacteurs sur trois sites, avec un premier chantier à Penly et une mise en service annoncée pour la fin des années 2030.",
      impact:
        "Choisir le nucléaire signifie engager des dizaines de milliards d'euros sur le long terme, sécuriser une production bas carbone pilotable et accepter des chantiers industriels très lourds.",
      sourceLabel: 'Info.gouv, le nouveau nucléaire en France',
      sourceUrl:
        'https://www.info.gouv.fr/actualite/le-nouveau-nucleaire-en-france-des-reacteurs-nouvelle-generation-pour-repondre-aux-besoins-energetiques',
    },
    briefing: {
      decisionFrame:
        "La bonne question n'est pas “nucléaire ou écologie ?”, mais “quel mix permet de décarboner vite sans perdre en souveraineté, en coût maîtrisé et en stabilité du réseau ?”.",
      currentState:
        "La France reste l'un des pays les plus nucléarisés du monde pour son électricité, mais son parc vieillit. La décision de relancer des réacteurs engage donc des coûts, des délais et une stratégie industrielle sur plusieurs décennies.",
      previousPolicies:
        "Après des années d'hésitation et de fermetures symboliques, la stratégie française est revenue vers le nouveau nucléaire. Le débat porte désormais moins sur le principe que sur l'ampleur, le calendrier et le coût.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous privilégiez une production bas carbone pilotable, utile quand il faut alimenter l'industrie et sécuriser le réseau.",
          "Vous soutenez une stratégie de souveraineté énergétique et industrielle de très long terme.",
        ],
        risks: [
          "Vous acceptez des chantiers longs, coûteux et exposés au risque de retard ou de dérive budgétaire.",
          "Vous maintenez des débats lourds sur la sûreté, l'eau de refroidissement, les déchets et l'acceptabilité locale.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous évitez d'engager des dizaines de milliards sur des projets très longs à sortir de terre.",
          "Vous privilégiez potentiellement des solutions plus décentralisées ou plus rapides à installer.",
        ],
        risks: [
          "Vous renoncez à une part de production pilotable bas carbone déjà centrale dans le système français.",
          "Vous augmentez la dépendance à d'autres solutions, qui peuvent être plus diffuses, plus intermittentes ou plus importées.",
        ],
      },
      visual: {
        kind: 'timeline',
        title: 'Le retour du nucléaire est déjà en cours',
        subtitle: 'Ce n’est plus seulement une hypothèse de programme.',
        sourceLabel: 'Info.gouv, le nouveau nucléaire en France',
        sourceUrl:
          'https://www.info.gouv.fr/actualite/le-nouveau-nucleaire-en-france-des-reacteurs-nouvelle-generation-pour-repondre-aux-besoins-energetiques',
        items: [
          {
            label: '2022',
            title: 'Discours de Belfort',
            note: "L'exécutif acte une relance du nucléaire après une décennie d'ambiguïté.",
          },
          {
            label: '2025',
            title: 'Six EPR2 confirmés',
            note: "Le cap industriel est réaffirmé avec Penly comme premier site.",
          },
          {
            label: 'Fin 2030s',
            title: 'Première mise en service visée',
            note: "Le nucléaire est une politique de temps long: les effets se jouent sur une décennie ou plus.",
          },
        ],
      },
      sources: [
        { label: 'Info.gouv, nouveau nucléaire', url: 'https://www.info.gouv.fr/actualite/le-nouveau-nucleaire-en-france-des-reacteurs-nouvelle-generation-pour-repondre-aux-besoins-energetiques' },
        { label: 'RTE, données électricité sur data.gouv', url: rteElectricityDatasetUrl },
      ],
    },
  },
  accelerate_renewables: {
    statement:
      "L'État devrait accélérer fortement l'éolien et le solaire, même face à des oppositions locales.",
    plainLanguage:
      "En clair: faut-il installer plus vite des éoliennes et panneaux solaires, même si certains riverains sont contre ?",
    explainer:
      "La question oppose rapidité de déploiement climatique et acceptabilité territoriale. Elle ne se confond pas avec la question du nucléaire.",
    example:
      "Exemple: autoriser plus rapidement de grands projets éoliens ou solaires sur le territoire.",
    whySelected:
      "Un bon comparateur doit décomposer le bloc climat-énergie en arbitrages concrets plutôt qu'en valeurs générales.",
    glossary: [
      {
        term: 'éolien',
        definition: "L'électricité produite grâce à la force du vent par des éoliennes.",
      },
      {
        term: 'solaire',
        definition: "L'électricité produite par des panneaux qui captent l'énergie du soleil.",
      },
    ],
    recentExample: {
      title: '18 juin 2025: l’État met en débat de nouvelles zones pour l’éolien en mer',
      context:
        "La planification maritime doit arbitrer entre accélération de la production, pêche, biodiversité et acceptabilité locale sur plusieurs façades maritimes.",
      impact:
        "Accélérer davantage les renouvelables reviendrait à raccourcir certains délais et à assumer plus souvent des conflits locaux pour augmenter plus vite la production bas carbone.",
      sourceLabel: 'Mer.gouv.fr, La mer en débat',
      sourceUrl: 'https://www.mer.gouv.fr/la-mer-en-debat',
    },
    briefing: {
      decisionFrame:
        "La vraie tension est entre vitesse de déploiement et consentement local. Une politique climatique rapide peut entrer en collision avec le territoire réel.",
      currentState:
        "La France a accéléré le solaire et prépare davantage d'éolien en mer, mais reste critiquée pour ses lenteurs administratives et les conflits locaux sur l'usage des sols, des paysages ou du littoral.",
      previousPolicies:
        "La loi d'accélération des renouvelables a déjà tenté de raccourcir les procédures. Le débat n'est donc pas théorique: il porte sur le fait d'aller encore plus vite, ou de ralentir pour mieux négocier localement.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous privilégiez une montée en puissance plus rapide de capacités bas carbone déployables en quelques années plutôt qu'en plusieurs décennies.",
          "Vous considérez que l'urgence climatique justifie de réduire certains délais et de trancher davantage au niveau national.",
        ],
        risks: [
          "Vous augmentez les conflits d'usage avec les habitants, les élus, la pêche ou certaines filières locales.",
          "Vous prenez le risque de fragiliser l'acceptabilité des projets si l'on donne le sentiment de passer en force.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous protégez davantage les paysages, le consentement local et certains usages économiques du territoire.",
          "Vous réduisez le risque de décisions trop centralisées ou mal adaptées aux réalités locales.",
        ],
        risks: [
          "Vous ralentissez la hausse de la production électrique bas carbone hors nucléaire.",
          "Vous pouvez rendre plus difficile la sortie des énergies fossiles si aucune autre solution ne compense rapidement.",
        ],
      },
      visual: {
        kind: 'timeline',
        title: 'La trajectoire française reste un compromis instable',
        subtitle: 'Déploiement plus rapide, mais opposition locale toujours forte.',
        sourceLabel: 'Mer.gouv.fr, La mer en débat',
        sourceUrl: 'https://www.mer.gouv.fr/la-mer-en-debat',
        items: [
          {
            label: '2023',
            title: 'Loi APER',
            note: "Le pays reconnaît officiellement qu'il faut accélérer les renouvelables.",
          },
          {
            label: '2025',
            title: 'Débat sur l’éolien en mer',
            note: "La montée en puissance se heurte à des arbitrages concrets avec les territoires et les filières existantes.",
          },
          {
            label: '2030',
            title: 'Objectifs climatiques proches',
            note: "La vitesse prise dans les prochaines années pèse directement sur l'atteinte des objectifs climatiques.",
          },
        ],
      },
      sources: [
        { label: 'Mer.gouv.fr, La mer en débat', url: 'https://www.mer.gouv.fr/la-mer-en-debat' },
        { label: 'RTE, données électricité sur data.gouv', url: rteElectricityDatasetUrl },
      ],
    },
  },
  keep_2035_ice_ban: {
    statement:
      "L'interdiction européenne de vendre des voitures thermiques neuves en 2035 devrait être maintenue.",
    plainLanguage:
      "En clair: faut-il maintenir la fin des ventes de voitures neuves essence et diesel en 2035 ?",
    explainer:
      "Cette question mesure votre tolérance à une contrainte climatique forte sur l'automobile, avec ses effets sur l'industrie, les ménages et les infrastructures.",
    example:
      "Exemple: après 2035, les voitures neuves seraient surtout électriques ou équivalentes, mais plus thermiques classiques.",
    whySelected:
      "C'est un arbitrage très concret entre décarbonation, souveraineté industrielle, mobilité quotidienne et pouvoir d'achat.",
    glossary: [
      {
        term: 'voitures thermiques',
        definition: "Les voitures à essence, diesel ou hybrides reposant encore sur un moteur thermique classique.",
      },
    ],
    recentExample: {
      title: '1er mars 2025: Bruxelles accorde de la souplesse sans abandonner 2035',
      context:
        "La Commission a proposé d'aider les constructeurs à atteindre les objectifs CO2 de 2025 tout en maintenant la trajectoire européenne de sortie des voitures thermiques neuves.",
      impact:
        "Maintenir l'échéance 2035 oblige l'industrie auto à poursuivre l'électrification; revenir dessus repousserait une partie des investissements et de la transformation du parc.",
      sourceLabel: 'Commission européenne, Automotive Package',
      sourceUrl:
        'https://transport.ec.europa.eu/transport-themes/action-plan-future-automotive-sector/automotive-package_en',
    },
    briefing: {
      decisionFrame:
        "Le fond du débat est simple: faut-il assumer une contrainte réglementaire forte pour transformer le marché automobile, ou préférer une transition plus graduelle et moins imposée ?",
      currentState:
        "L'Union maintient le cap 2035 tout en accordant des ajustements intermédiaires aux constructeurs. Le sujet est donc moins “faut-il décarboner ?” que “à quelle vitesse et qui absorbe le coût de la transition ?”.",
      previousPolicies:
        "L'automobile a déjà connu plusieurs vagues de normes environnementales plus strictes. Le cap 2035 constitue cependant un saut qualitatif, car il fixe une sortie du moteur thermique neuf plutôt qu'un simple durcissement progressif.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous donnez un signal clair aux industriels, aux infrastructures de recharge et aux investissements privés.",
          "Vous considérez qu'une date ferme est nécessaire pour éviter le report permanent des décisions de transition.",
        ],
        risks: [
          "Vous acceptez des coûts d'adaptation élevés pour les ménages, les sous-traitants et certains territoires industriels.",
          "Vous prenez le risque d'une transition socialement mal répartie si les alternatives restent trop chères ou insuffisamment disponibles.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous laissez plus de temps aux ménages et à l'industrie pour amortir le changement technologique.",
          "Vous réduisez le risque d'une politique climatique vécue comme punitive dans les zones dépendantes de la voiture.",
        ],
        risks: [
          "Vous retardez des investissements industriels qui ont besoin de visibilité pour être lancés.",
          "Vous rendez plus difficile l'atteinte des objectifs climatiques si la sortie du thermique est encore repoussée.",
        ],
      },
      visual: {
        kind: 'timeline',
        title: '2035 n’est pas un slogan isolé, mais une trajectoire',
        subtitle: 'Le cap est jalonné par plusieurs étapes réglementaires.',
        sourceLabel: 'Commission européenne, Automotive Package',
        sourceUrl:
          'https://transport.ec.europa.eu/transport-themes/action-plan-future-automotive-sector/automotive-package_en',
        items: [
          {
            label: '2025',
            title: 'Souplesse sur les objectifs intermédiaires',
            note: "La Commission ajuste le calendrier sans abandonner le principe de la transformation du secteur.",
          },
          {
            label: '2030',
            title: 'Accélération des réductions de CO2',
            note: "Le marché est censé être déjà largement engagé dans l'électrification avant 2035.",
          },
          {
            label: '2035',
            title: 'Fin prévue des ventes thermiques neuves',
            note: "Le débat porte donc sur une règle très concrète, pas sur une simple intention climatique.",
          },
        ],
      },
      sources: [
        { label: 'Commission européenne, Automotive Package', url: 'https://transport.ec.europa.eu/transport-themes/action-plan-future-automotive-sector/automotive-package_en' },
      ],
    },
  },
  relax_farm_rules: {
    statement:
      "Les normes environnementales sur l'agriculture devraient être assouplies pour protéger la compétitivité des agriculteurs.",
    plainLanguage:
      "En clair: faut-il desserrer certaines règles écologiques pour aider les agriculteurs à produire et gagner leur vie ?",
    explainer:
      "Vous arbitrez ici entre protection économique immédiate des exploitations et maintien de garde-fous écologiques sur l'eau, les sols, les pesticides ou la biodiversité.",
    example:
      "Exemple: moins de contraintes sur certains pesticides, jachères, règles d'eau ou normes européennes jugées trop lourdes.",
    whySelected:
      "L'agriculture est un lieu de conflit majeur entre transition écologique, revenu paysan et souveraineté alimentaire.",
    glossary: [
      {
        term: 'normes environnementales',
        definition:
          "Les règles qui limitent les impacts sur l'eau, les sols, la biodiversité, les pesticides ou les émissions.",
      },
      {
        term: 'compétitivité',
        definition:
          "La capacité d'un agriculteur ou d'une entreprise à produire à un coût et un prix qui lui permettent de rester dans la course face à la concurrence.",
      },
    ],
    recentExample: {
      title: '14 mai 2025: la Commission simplifie encore la PAC',
      context:
        "Après la vague de colère agricole, Bruxelles a proposé moins de contrôles et plus de flexibilité sur certaines obligations environnementales pour les exploitants.",
      impact:
        "Assouplir davantage les normes pourrait soulager une partie des agriculteurs à court terme, mais réduirait aussi certains garde-fous écologiques sur les sols, l'eau ou la biodiversité.",
      sourceLabel: 'Commission européenne, simplifier la vie des agriculteurs',
      sourceUrl:
        'https://commission.europa.eu/news-and-media/news/simplifying-farmers-lives-2025-05-14_en',
    },
    briefing: {
      decisionFrame:
        "La tension ici est frontale: faut-il alléger la contrainte pour sauver des exploitations fragiles, ou maintenir la règle écologique même si elle pèse dans l'immédiat sur le revenu ?",
      currentState:
        "Le monde agricole subit déjà une forte pression économique et climatique. Les règles environnementales sont accusées par certains d'alourdir les coûts, tandis que leurs défenseurs rappellent qu'elles protègent des ressources déjà dégradées, notamment l'eau et les sols.",
      previousPolicies:
        "Depuis les mobilisations agricoles de 2024, la France et l'UE ont multiplié simplifications et dérogations. La question est donc de savoir si cette inflexion doit rester ponctuelle ou devenir une orientation durable.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous cherchez à soulager rapidement des exploitations qui cumulent hausse des coûts, volatilité des revenus et concurrence internationale.",
          "Vous considérez qu'une règle trop uniforme peut fragiliser des filières déjà sous pression sans effet écologique suffisant.",
        ],
        risks: [
          "Vous pouvez repousser encore l'adaptation agroécologique et aggraver certaines dégradations de l'eau, des sols ou de la biodiversité.",
          "Vous risquez de transformer une simplification temporaire en recul durable de la protection environnementale.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous maintenez des garde-fous sur les ressources naturelles qui conditionnent aussi la production agricole future.",
          "Vous évitez que la crise conjoncturelle serve de prétexte à un démantèlement plus large des règles écologiques.",
        ],
        risks: [
          "Vous laissez subsister une pression normative forte sur des exploitations déjà fragiles économiquement.",
          "Vous pouvez nourrir le sentiment d'une transition décidée sans tenir suffisamment compte du revenu paysan.",
        ],
      },
      visual: {
        kind: 'timeline',
        title: 'La balance a déjà bougé vers plus de souplesse',
        subtitle: 'Le débat porte maintenant sur l’ampleur du relâchement.',
        sourceLabel: 'Commission européenne, simplifier la vie des agriculteurs',
        sourceUrl:
          'https://commission.europa.eu/news-and-media/news/simplifying-farmers-lives-2025-05-14_en',
        items: [
          {
            label: '2024',
            title: 'Colère agricole',
            note: "Les mobilisations replacent la question du revenu et de la norme au centre du débat public.",
          },
          {
            label: '2024',
            title: 'Premières dérogations',
            note: "L'UE et les États assouplissent déjà certaines obligations environnementales.",
          },
          {
            label: '2025',
            title: 'Nouvelle simplification de la PAC',
            note: "Le mouvement de relâchement n'est plus ponctuel: il devient un vrai choix politique.",
          },
        ],
      },
      sources: [
        { label: 'Commission européenne, simplifier la vie des agriculteurs', url: 'https://commission.europa.eu/news-and-media/news/simplifying-farmers-lives-2025-05-14_en' },
        { label: 'Data.gouv, ventes de pesticides par département', url: pesticidesDatasetUrl },
      ],
    },
  },
  legalize_cannabis: {
    statement: "Le cannabis devrait être légalisé et encadré par l'État.",
    plainLanguage:
      "En clair: faut-il sortir le cannabis de l'illégalité et l'autoriser dans un cadre contrôlé ?",
    explainer:
      "La question confronte plusieurs objectifs: santé publique, lutte contre le trafic, liberté individuelle et politique pénale.",
    example:
      "Exemple: vente autorisée sous conditions d'âge, de lieux de vente et de taxation, au lieu d'une interdiction totale.",
    whySelected:
      "Les comparateurs gagnent à inclure aussi des questions socio-culturelles qui ne se réduisent ni à l'économie ni à l'immigration.",
    glossary: [
      {
        term: 'légalisé',
        definition: "Rendu autorisé par la loi, au lieu d'être interdit pénalement.",
      },
      {
        term: 'encadré',
        definition:
          "Autorisé dans un cadre strict avec des règles sur l'âge, la vente, la publicité, la fiscalité ou la santé publique.",
      },
    ],
    recentExample: {
      title: "1er avril puis 1er juillet 2024: l'Allemagne dépénalise en partie le cannabis",
      context:
        "Le modèle allemand autorise la détention dans certaines limites et ouvre des cannabis clubs encadrés, tout en conservant des règles strictes pour les mineurs et la circulation.",
      impact:
        "Une légalisation encadrée en France déplacerait une partie du sujet du pénal vers la régulation sanitaire, fiscale et routière.",
      sourceLabel: 'Ministère fédéral allemand de la Santé, FAQ Cannabisgesetz',
      sourceUrl: 'https://www.bundesgesundheitsministerium.de/themen/cannabis/faq-cannabisgesetz',
    },
    briefing: {
      decisionFrame:
        "Le cœur du choix est de savoir si l'interdiction actuelle protège mieux, ou si elle empêche surtout de réguler intelligemment un usage qui existe déjà.",
      currentState:
        "La France reste sur une ligne prohibitionniste, alors que plusieurs pays voisins expérimentent des formes partielles de légalisation ou de dépénalisation. Le débat porte donc autant sur l'efficacité de l'interdit que sur le type de régulation souhaitable.",
      previousPolicies:
        "Le sujet est devenu plus concret depuis les changements en Allemagne, au Luxembourg ou à Malte. Cela offre des précédents proches pour juger les effets possibles, au lieu de raisonner seulement en théorie.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous cherchez à déplacer une partie du sujet du pénal vers la santé publique, la prévention et le contrôle des produits.",
          "Vous considérez qu'un marché encadré peut affaiblir une partie du trafic et produire des recettes fiscales.",
        ],
        risks: [
          "Vous prenez le risque d'une banalisation plus forte de l'usage, surtout si l'encadrement est mal conçu.",
          "Vous devez accepter de nouvelles questions de sécurité routière, de publicité déguisée et de contrôle des points de vente.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous maintenez un signal normatif clair sur un produit psychoactif pouvant avoir des effets sanitaires ou cognitifs.",
          "Vous évitez d'ouvrir un marché légal dont les effets exacts restent débattus.",
        ],
        risks: [
          "Vous laissez perdurer un cadre où la répression cohabite avec une consommation élevée et un trafic structuré.",
          "Vous renoncez à mieux contrôler qualité, âge de vente, taxation et messages de prévention dans un marché aujourd'hui illégal.",
        ],
      },
      visual: {
        kind: 'timeline',
        title: 'Le débat européen a changé de nature',
        subtitle: 'Les voisins français testent désormais des modèles réels.',
        sourceLabel: 'OFDT, dossier cannabis',
        sourceUrl: ofdtCannabisUrl,
        items: [
          {
            label: '2021',
            title: 'Malte',
            note: "Premier pays européen à légaliser un usage personnel encadré.",
          },
          {
            label: '2023',
            title: 'Luxembourg',
            note: "Le pays autorise déjà certains usages et la culture à domicile sous conditions.",
          },
          {
            label: '2024',
            title: 'Allemagne',
            note: "La réforme allemande rend le débat français beaucoup plus concret et moins spéculatif.",
          },
        ],
      },
      sources: [
        { label: 'OFDT, dossier cannabis', url: ofdtCannabisUrl },
        { label: 'Ministère fédéral allemand de la Santé', url: 'https://www.bundesgesundheitsministerium.de/themen/cannabis/faq-cannabisgesetz' },
      ],
    },
  },
  arm_ukraine: {
    statement:
      "La France doit continuer à livrer des armes à l'Ukraine aussi longtemps que nécessaire.",
    plainLanguage:
      "En clair: faut-il continuer à fournir du matériel militaire à l'Ukraine dans sa guerre contre la Russie ?",
    explainer:
      "La question distingue soutien militaire durable, soutien conditionnel et logique de désengagement ou de stricte diplomatie.",
    example:
      "Exemple: canons, munitions, blindés ou aides militaires maintenus sur la durée plutôt qu'un simple soutien diplomatique.",
    whySelected:
      "Le conflit ukrainien est devenu un axe structurant des positions de politique étrangère et de défense.",
    glossary: [
      {
        term: 'livrer des armes',
        definition:
          "Fournir du matériel militaire, des munitions ou des équipements à un pays en guerre.",
      },
    ],
    recentExample: {
      title: '2025-2026: la France poursuit les livraisons et la formation',
      context:
        "Paris continue de fournir des équipements et de former des militaires ukrainiens; le soutien officiel inclut des matériels lourds, de la maintenance et de l'entraînement.",
      impact:
        "Continuer à armer l'Ukraine renforce sa capacité de résistance, mais implique aussi un coût budgétaire, industriel et diplomatique durable pour la France.",
      sourceLabel: 'Ministère des Armées, Ukraine: la France poursuit son soutien',
      sourceUrl: 'https://www.defense.gouv.fr/actualites/ukraine-france-poursuit-son-soutien',
    },
    briefing: {
      decisionFrame:
        "Le choix de fond est de savoir si la sécurité européenne se défend militairement en amont, ou si ce type d'engagement crée surtout une escalade qu'il faudrait limiter.",
      currentState:
        "La France soutient déjà l'Ukraine militairement, financièrement et par la formation. La question n'est donc pas hypothétique: elle porte sur la durée, l'intensité et la légitimité de cet engagement.",
      previousPolicies:
        "Depuis 2022, le soutien occidental a glissé d'une aide prudente vers des livraisons plus lourdes et plus longues. Le débat porte désormais moins sur le principe que sur le jusqu'où et le combien de temps.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous considérez qu'aider l'Ukraine est aussi une manière de contenir la Russie et de protéger la sécurité européenne.",
          "Vous privilégiez la crédibilité stratégique: une promesse de soutien n'a de sens que si elle dure dans le temps.",
        ],
        risks: [
          "Vous engagez durablement des capacités industrielles, des budgets et un risque diplomatique élevé.",
          "Vous acceptez un conflit long avec des effets indirects sur la relation avec Moscou et sur la sécurité européenne.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous limitez l'implication française dans une guerre longue et coûteuse dont l'issue reste incertaine.",
          "Vous privilégiez une ligne plus prudente, centrée sur la diplomatie, l'aide civile ou la désescalade.",
        ],
        risks: [
          "Vous affaiblissez la capacité de résistance ukrainienne et la crédibilité des alliés européens.",
          "Vous prenez le risque qu'un désengagement soit interprété comme un signal de faiblesse stratégique face à la Russie.",
        ],
      },
      visual: {
        kind: 'timeline',
        title: 'Le soutien français s’est épaissi dans le temps',
        subtitle: "La question porte sur la poursuite d'une trajectoire déjà engagée.",
        sourceLabel: 'Ministère des Armées, soutien à l’Ukraine',
        sourceUrl: 'https://www.defense.gouv.fr/actualites/ukraine-france-poursuit-son-soutien',
        items: [
          {
            label: '2022',
            title: 'Début du soutien militaire',
            note: "La France entre dans la coalition d'aide à l'Ukraine après l'invasion russe.",
          },
          {
            label: '2024',
            title: 'Accords et livraisons plus structurés',
            note: "Le soutien prend une forme plus stable et plus assumée politiquement.",
          },
          {
            label: '2025-2026',
            title: 'Maintenance et formation durables',
            note: "Le débat devient celui d'un engagement dans la durée, pas d'un geste ponctuel.",
          },
        ],
      },
      sources: [
        { label: 'Ministère des Armées, soutien à l’Ukraine', url: 'https://www.defense.gouv.fr/actualites/ukraine-france-poursuit-son-soutien' },
      ],
    },
  },
  distance_from_nato: {
    statement:
      "La France devrait prendre davantage de distance avec l'OTAN.",
    plainLanguage:
      "En clair: la France doit-elle s'éloigner de l'alliance militaire occidentale conduite principalement par les États-Unis ?",
    explainer:
      "On sépare ici atlantistes, partisans d'une autonomie plus européenne, et profils plus non-alignés ou souverainistes.",
    example:
      "Exemple: moins d'alignement sur l'OTAN et plus d'autonomie militaire française ou européenne.",
    whySelected:
      "Cette question évite de ramener toute la politique internationale au seul cas ukrainien. Le rapport à l'Alliance atlantique est une ligne distincte.",
    glossary: [
      {
        term: 'OTAN',
        definition:
          "L'alliance militaire dirigée autour des États-Unis qui regroupe une grande partie des pays européens et nord-américains.",
      },
    ],
    recentExample: {
      title: 'Août 2024: des avions français participent à la police du ciel en Lituanie',
      context:
        "Des avions français ont été engagés dans la mission OTAN de surveillance aérienne dans les États baltes, un exemple concret d'intégration dans la posture militaire de l'Alliance.",
      impact:
        "Prendre plus de distance avec l'OTAN réduirait ce type d'engagement intégré et pousserait vers une posture plus nationale ou plus strictement européenne.",
      sourceLabel: 'NATO Air Command, Baltic air policing depuis la Lituanie',
      sourceUrl:
        'https://ac.nato.int/archive/2024/italy--france-ready-to-police-baltic-skies-from-lithuania',
    },
    briefing: {
      decisionFrame:
        "Le fond du sujet est de savoir où placer l'autonomie stratégique française: à l'intérieur de l'Alliance, plus loin d'elle, ou dans un cadre plus européen.",
      currentState:
        "La France est dans l'OTAN, participe à des missions concrètes et reste en même temps attachée à une tradition d'autonomie stratégique. Le débat porte donc sur le degré de proximité, pas sur une page blanche.",
      previousPolicies:
        "Le pays a quitté le commandement intégré en 1966 avant d'y revenir en 2009. Cette histoire explique pourquoi la question du recul ou de l'approfondissement reste politiquement très chargée.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous défendez une autonomie française ou européenne plus forte face à la dépendance stratégique aux États-Unis.",
          "Vous cherchez à garder davantage de liberté d'appréciation diplomatique et militaire selon les crises.",
        ],
        risks: [
          "Vous risquez de fragiliser la crédibilité de la dissuasion collective et la coordination avec les alliés.",
          "Vous devez accepter qu'une plus grande autonomie exige davantage de capacités militaires propres et donc potentiellement plus de dépenses.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous privilégiez la sécurité collective, l'interopérabilité et la force de l'alliance transatlantique.",
          "Vous considérez que l'environnement stratégique actuel rend plus utile que jamais le cadre OTAN.",
        ],
        risks: [
          "Vous acceptez une dépendance plus forte à la stratégie et aux priorités américaines.",
          "Vous pouvez rendre plus difficile l'affirmation d'une véritable autonomie stratégique européenne.",
        ],
      },
      visual: {
        kind: 'timeline',
        title: "La France a déjà avancé et reculé par rapport à l'OTAN",
        subtitle: 'Le débat français a une vraie profondeur historique.',
        sourceLabel: 'NATO Air Command, mission balte 2024',
        sourceUrl:
          'https://ac.nato.int/archive/2024/italy--france-ready-to-police-baltic-skies-from-lithuania',
        items: [
          {
            label: '1966',
            title: 'Sortie du commandement intégré',
            note: "La France gaullienne affirme son autonomie stratégique au sein de l'Alliance.",
          },
          {
            label: '2009',
            title: 'Retour complet',
            note: "La France réintègre pleinement le commandement intégré sous Nicolas Sarkozy.",
          },
          {
            label: '2024',
            title: 'Mission OTAN dans les pays baltes',
            note: "L'implication française reste concrète et opérationnelle, pas seulement symbolique.",
          },
        ],
      },
      sources: [
        { label: 'NATO Air Command, mission balte 2024', url: 'https://ac.nato.int/archive/2024/italy--france-ready-to-police-baltic-skies-from-lithuania' },
      ],
    },
  },
  integrated_eu_defense: {
    statement:
      "Il faut construire une défense européenne plus intégrée, même si cela réduit une part de souveraineté nationale.",
    plainLanguage:
      "En clair: faut-il une défense plus européenne, avec davantage de décisions et d'équipements communs, même si chaque pays décide un peu moins seul ?",
    explainer:
      "La question distingue atlantisme, souverainisme national et européanisation de la puissance militaire.",
    example:
      "Exemple: achats d'armes en commun, commandement plus coordonné et stratégie européenne plus unifiée.",
    whySelected:
      "Les recherches recommandent des statements sur des dimensions distinctes du conflit, plutôt que de tout résumer en un seul axe géopolitique.",
    glossary: [
      {
        term: 'défense européenne plus intégrée',
        definition:
          "Une organisation où les pays européens achètent davantage ensemble, coordonnent plus leurs capacités et prennent plus de décisions communes.",
      },
      {
        term: 'souveraineté nationale',
        definition:
          "Le fait pour un État de garder seul le dernier mot sur ses décisions militaires, budgétaires ou diplomatiques.",
      },
    ],
    recentExample: {
      title: '17 octobre 2025: accord politique sur le programme EDIP',
      context:
        "Le futur programme européen de défense industrielle doit soutenir les achats en commun, la montée en puissance industrielle et une meilleure coordination entre États membres.",
      impact:
        "Une défense européenne plus intégrée signifierait davantage d'équipements achetés ensemble, des priorités industrielles plus communes et moins de décisions complètement isolées par État.",
      sourceLabel: 'Commission européenne, accord politique sur EDIP',
      sourceUrl:
        'https://defence-industry-space.ec.europa.eu/commission-welcomes-political-agreement-european-defence-industry-programme-2025-10-17_en',
    },
    briefing: {
      decisionFrame:
        "Vous répondez ici à une question de puissance: l'Europe doit-elle rester une somme d'armées nationales, ou devenir davantage un acteur stratégique organisé ?",
      currentState:
        "L'Union avance déjà vers plus d'achats communs, de soutien à l'industrie de défense et de coordination. Mais les décisions militaires restent largement nationales, ce qui limite la vitesse et la cohérence de l'ensemble.",
      previousPolicies:
        "L'idée d'une défense européenne existe depuis longtemps, mais la guerre en Ukraine l'a rendue beaucoup plus concrète. Le débat porte désormais sur l'intensité de l'intégration, plus que sur son simple principe.",
      ifFor: {
        label: 'Si vous penchez plutôt pour',
        gains: [
          "Vous cherchez des capacités plus cohérentes, des achats moins dispersés et une base industrielle européenne plus solide.",
          "Vous considérez qu'aucun État européen ne peut seul peser suffisamment face aux grands rapports de force actuels.",
        ],
        risks: [
          "Vous acceptez de partager davantage des décisions sensibles sur la stratégie, les priorités et l'industrie de défense.",
          "Vous risquez des compromis plus lents si les États membres n'ont pas le même rythme ni les mêmes intérêts.",
        ],
      },
      ifAgainst: {
        label: 'Si vous penchez plutôt contre',
        gains: [
          "Vous gardez une liberté nationale complète sur l'emploi des forces, les budgets et les coopérations souhaitées.",
          "Vous évitez qu'un compromis européen freine des décisions urgentes ou dilue les priorités françaises.",
        ],
        risks: [
          "Vous entretenez une fragmentation industrielle et stratégique coûteuse pour les Européens.",
          "Vous rendez plus difficile la montée en puissance d'un acteur européen crédible, y compris vis-à-vis des États-Unis.",
        ],
      },
      visual: {
        kind: 'timeline',
        title: 'La défense européenne quitte le stade des discours',
        subtitle: 'Achats communs et industrie de défense deviennent plus concrets.',
        sourceLabel: 'Commission européenne, accord politique sur EDIP',
        sourceUrl:
          'https://defence-industry-space.ec.europa.eu/commission-welcomes-political-agreement-european-defence-industry-programme-2025-10-17_en',
        items: [
          {
            label: '2017',
            title: 'PESCO / Fonds européen de défense',
            note: "L'UE commence à construire des outils plus structurés de coopération militaire et industrielle.",
          },
          {
            label: '2025',
            title: 'SAFE',
            note: "Jusqu'à 150 milliards d'euros de prêts européens renforcent la logique d'achats communs.",
          },
          {
            label: '2025',
            title: 'EDIP',
            note: "L'intégration industrielle et programmatique devient un objet politique concret, pas un simple slogan.",
          },
        ],
      },
      sources: [
        { label: 'Commission européenne, EDIP', url: 'https://defence-industry-space.ec.europa.eu/commission-welcomes-political-agreement-european-defence-industry-programme-2025-10-17_en' },
        { label: 'Commission européenne, SAFE', url: 'https://defence-industry-space.ec.europa.eu/eu-defence-industry/safe-security-action-europe_en' },
      ],
    },
  },
}

export const futureQuestionPresentations: Record<FutureQuestionId, FutureQuestionPresentation> = {
  future_ai: {
    statement:
      "La France devrait imposer rapidement des règles fortes sur l'IA au travail et à l'école, même si cela ralentit certains usages.",
    plainLanguage:
      "En clair: faut-il encadrer vite l'IA, même si cela freine un peu certaines innovations ?",
    explainer:
      "La question oppose vitesse d'adoption et niveau de protection sur l'emploi, l'évaluation scolaire, les données et les décisions automatisées.",
    whyNow:
      "L'IA s'installe déjà dans les entreprises, les administrations et l'enseignement. Le vrai débat porte moins sur son existence que sur le rythme et le niveau de garde-fous.",
    glossary: [
      {
        term: 'IA',
        definition:
          "Des systèmes capables d'analyser des données, de produire du texte, des images ou des décisions automatiques, avec ou sans intervention humaine forte.",
      },
    ],
    sourceLabel: 'France Num, comprendre et adopter l’IA',
    sourceUrl:
      'https://www.francenum.gouv.fr/guides-et-conseils/intelligence-artificielle/comprendre-et-adopter-lia/lintelligence-artificielle-3',
  },
  future_water: {
    statement:
      "La France devrait imposer plus vite des restrictions d'usage de l'eau face aux sécheresses, même si cela change des habitudes locales.",
    plainLanguage:
      "En clair: faut-il serrer la règle plus tôt sur l'eau quand la sécheresse s'installe ?",
    explainer:
      "La question oppose liberté d'usage à court terme et adaptation collective à un stress hydrique qui devient structurel.",
    whyNow:
      "Les épisodes de sécheresse ne sont plus exceptionnels. Les arbitrages entre agriculture, usages domestiques, tourisme et industrie deviennent plus fréquents et plus visibles.",
    glossary: [
      {
        term: 'restrictions d’usage',
        definition:
          "Les interdictions ou limitations décidées par les autorités sur l'arrosage, l'irrigation, le lavage ou certains prélèvements d'eau.",
      },
    ],
    sourceLabel: 'Data.gouv, Donnée sécheresse - VigiEau',
    sourceUrl: 'https://www.data.gouv.fr/datasets/donnee-secheresse-vigieau',
  },
  future_ageing: {
    statement:
      "La France devrait investir beaucoup plus dans le grand âge et la dépendance, même si cela suppose des financements nouveaux.",
    plainLanguage:
      "En clair: faut-il mettre beaucoup plus de moyens dans la prise en charge du vieillissement ?",
    explainer:
      "La question oppose prudence budgétaire et anticipation d'un vieillissement déjà mesurable dans de nombreux territoires.",
    whyNow:
      "Le vieillissement accélère selon les départements. La question n'est plus de savoir s'il faut agir, mais qui finance, à quel niveau et avec quel équilibre entre domicile et établissement.",
    glossary: [
      {
        term: 'dépendance',
        definition:
          "La situation d'une personne âgée qui ne peut plus accomplir seule une partie des gestes essentiels de la vie quotidienne.",
      },
    ],
    sourceLabel: 'Data.gouv, 75 ans et plus : indicateurs de vieillissement par département',
    sourceUrl:
      'https://www.data.gouv.fr/datasets/75-ans-et-plus-indicateurs-de-vieillissement-par-departement/',
  },
  future_housing: {
    statement:
      "La France devrait autoriser plus de densification et de transformation du bâti pour réduire la crise du logement.",
    plainLanguage:
      "En clair: faut-il construire et transformer davantage, même si cela change certains quartiers ?",
    explainer:
      "La question oppose protection du cadre local et augmentation plus rapide de l'offre de logements, surtout dans les zones tendues.",
    whyNow:
      "Le logement cumule tensions sur les loyers, pénurie de logements abordables et conflit avec les objectifs de sobriété foncière. Cela oblige à arbitrer entre construire, densifier, rénover et réutiliser.",
    glossary: [
      {
        term: 'densification',
        definition:
          "Le fait d'ajouter plus de logements ou d'usages dans un espace déjà urbanisé plutôt que d'étendre encore la ville.",
      },
    ],
    sourceLabel: 'Data.gouv, Demande de logement social',
    sourceUrl: 'https://www.data.gouv.fr/fr/datasets/demande-de-logement-social/',
  },
  future_digital: {
    statement:
      "La France devrait imposer davantage de contraintes de souveraineté numérique, même si cela limite certains services étrangers plus efficaces.",
    plainLanguage:
      "En clair: faut-il privilégier davantage des solutions numériques contrôlées en Europe ou en France ?",
    explainer:
      "La question oppose efficacité immédiate, coût et dépendance technologique à long terme pour l'État, les entreprises et les données sensibles.",
    whyNow:
      "Cloud, cybersécurité, IA et dépendance aux grands fournisseurs étrangers deviennent des sujets stratégiques. Les gains de court terme peuvent entrer en tension avec la maîtrise des données et des infrastructures.",
    glossary: [
      {
        term: 'souveraineté numérique',
        definition:
          "La capacité à maîtriser ses données, ses logiciels, ses infrastructures et ses décisions numériques sans dépendre entièrement d'acteurs étrangers.",
      },
    ],
    sourceLabel: "Numérique.gouv, doctrine cloud de l'État",
    sourceUrl:
      'https://www.numerique.gouv.fr/offre-accompagnement/cloud-administrations/la-doctrine-cloud-etat/',
  },
}
