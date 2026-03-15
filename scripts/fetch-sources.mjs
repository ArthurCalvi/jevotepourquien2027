import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const sources = [
  { id: 'rn-eu-2024', bucket: 'rn', url: 'https://municipales2026.rassemblementnational.fr/documents/202411-programme-europeennes.pdf' },
  { id: 'rn-leg-2024', bucket: 'rn', url: 'https://municipales2026.rassemblementnational.fr/documents/202406-programme.pdf' },
  { id: 'ren-eu-2024', bucket: 'renaissance', url: 'https://doc.besoindeurope.fr/programme-besoindeurope.pdf' },
  { id: 'ren-project', bucket: 'renaissance', url: 'https://besoindeurope.fr/programme' },
  { id: 'ren-party', bucket: 'renaissance', url: 'https://parti-renaissance.fr/le-parti' },
  { id: 'pspp-vision', bucket: 'pspp', url: 'https://place-publique.eu/notre-vision-pour-la-france/' },
  { id: 'pspp-europe', bucket: 'pspp', url: 'https://place-publique.eu/nos-10-propositions-pour-une-puissance-ecologique-europeenne/' },
  { id: 'ps-immigration', bucket: 'pspp', url: 'https://www.parti-socialiste.fr/loi_immigration_nous_saisissons_le_conseil_constitutionnel' },
  { id: 'ps-energy', bucket: 'pspp', url: 'https://www.parti-socialiste.fr/notre_strategie_energetique_souverainet_decarbonation_competitivite' },
  { id: 'ps-retirements', bucket: 'pspp', url: 'https://www.parti-socialiste.fr/loi_abrogation_retraites' },
  { id: 'lfi-eu-2024', bucket: 'lfi', url: 'https://lafranceinsoumise.fr/wp-content/uploads/2024/05/PROGRAMME-UNION-POPULAIRE_EURO-2024.pdf' },
  { id: 'lfi-energy', bucket: 'lfi', url: 'https://programme.lafranceinsoumise.fr/livrets/energie/' },
  { id: 'lfi-retirements', bucket: 'lfi', url: 'https://programme.lafranceinsoumise.fr/livrets/retraites/' },
  { id: 'lfi-immigration', bucket: 'lfi', url: 'https://lafranceinsoumise.fr/europeennes-2024/programme-de-lunion-populaire/chapitre-7-lutter-contre-lexil-force-et-organiser-un-accueil-coordonne/' },
  { id: 'lr-eu-2024', bucket: 'lr', url: 'https://republicains.fr/actualites/2026/01/05/refuser-la-dependance-numerique-culturelle-defendre-lindependance-europeenne/' },
  { id: 'lr-order', bucket: 'lr', url: 'https://republicains.fr/actualites/2025/01/07/bruno-retailleau-je-souhaite-un-referendum-sur-limmigration/' },
  { id: 'lr-energy', bucket: 'lr', url: 'https://republicains.fr/actualites/2025/07/02/rebatir-un-parc-nucleaire-et-stopper-le-financement-des-renouvelables-notre-plan-pour-lenergie/' },
  { id: 'lr-work', bucket: 'lr', url: 'https://republicains.fr/qrtravail/' },
  { id: 'greens-eu-2024', bucket: 'greens', url: 'https://lesecologistes.fr/document/1JGlVTgE9rtzoDKTz8yGPT/socle-programmatique-les-ecologistes-europeenes-2024.pdf' },
  { id: 'greens-project', bucket: 'greens', url: 'https://lesecologistes.fr/pages/358vv7W974UgosGhCBbIPT/notre-projet' },
  { id: 'greens-2026', bucket: 'greens', url: 'https://projet.lesecologistes.fr/' },
  { id: 'rq-programme', bucket: 'reconquete', url: 'https://programme.ericzemmour.fr/' },
  { id: 'rq-immigration', bucket: 'reconquete', url: 'https://programme.ericzemmour.fr/immigration' },
  { id: 'rq-nuclear', bucket: 'reconquete', url: 'https://programme.ericzemmour.fr/nucleaire' },
  { id: 'rq-auto', bucket: 'reconquete', url: 'https://programme.ericzemmour.fr/automobilistes' },
  { id: 'rq-army', bucket: 'reconquete', url: 'https://programme.ericzemmour.fr/armees' },
  { id: 'pcf-eu-2024', bucket: 'pcf', url: 'https://95.pcf.fr/sites/default/files/20240213-reprenons_la_main-4p-planche.pdf' },
  { id: 'pcf-campaign', bucket: 'pcf', url: 'https://www.pcf.fr/elections_europeennes_reprenons_la_main' },
  { id: 'pcf-ukraine', bucket: 'pcf', url: 'https://www.pcf.fr/la_paix_au_coeur_de_la_campagne_des_elections_europeennes_reprendre_la_main_sur_la_securite_collective_en_europe' },
  { id: 'pcf-war', bucket: 'pcf', url: 'https://www.pcf.fr/resolution_cn_halte_engrenage_guerrier' },
]

function inferExtension(url, contentType) {
  if (contentType?.includes('pdf') || url.endsWith('.pdf')) {
    return 'pdf'
  }

  if (contentType?.includes('json')) {
    return 'json'
  }

  return 'html'
}

async function fetchSource(source) {
  const response = await fetch(source.url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; jevotepourquien2027-source-fetcher/1.0)',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  const extension = inferExtension(source.url, contentType)
  const buffer = Buffer.from(await response.arrayBuffer())

  const targetDir = path.join(process.cwd(), 'research', 'raw', source.bucket)
  const targetFile = path.join(targetDir, `${source.id}.${extension}`)

  await mkdir(targetDir, { recursive: true })
  await writeFile(targetFile, buffer)

  return targetFile
}

for (const source of sources) {
  try {
    const savedFile = await fetchSource(source)
    console.log(`saved ${source.id} -> ${savedFile}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`failed ${source.id}: ${message}`)
  }
}
