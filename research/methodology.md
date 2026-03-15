# Methodology

## Scope

- Date boundary: `2026-03-08`.
- There are no finalized, comparable 2027 presidential manifestos yet.
- The app therefore compares users against current party or bloc profiles, not against speculative candidate personas.

## Party set

The coded profiles prioritize major French forces visible in the 2024 European election and still relevant nationally:

- Rassemblement national
- Renaissance / Besoin d'Europe
- Reveiller l'Europe (Place publique + PS)
- La France insoumise / Union populaire
- Les Republicains
- Les Ecologistes
- Reconquete
- Parti communiste francais

## Design choices inspired by VAA research

- Fixed questionnaire: 20 statements, no adaptive branching in the first version.
- Multi-dimensional coverage: Europe, institutions, order / society, economy / social, ecology / energy, international.
- Single-issue wording: each item is phrased as a concrete public decision rather than a slogan.
- Transparent scoring: normalized distance between the user's answer and each coded party position.
- Optional salience weighting: a "decisive" item counts double.
- Visible uncertainty boundary: unanswered questions are omitted from the score and the answered count is shown.

## Why this is less biased than a naive quiz

- The questionnaire is not generated on the fly.
- Party proximity is not inferred by an LLM at runtime.
- The same statements are asked to every user.
- Source links are attached to each party corpus.
- Results are framed as "proximity" rather than "who you should vote for".

## Limits

- Candidate effects matter in presidential elections. This version keeps a party-first model until candidate-level 2027 programs become stable enough to code consistently.
- Some parties publish richer source material than others. The app compensates with multiple official documents where available, but the corpus is still uneven.
- Manual coding remains a judgement call. The repository is structured so the source corpus can be refreshed and the positions adjusted transparently.

## Source refresh

Run:

```bash
npm run fetch:sources
```

This stores raw HTML / PDF snapshots under `research/raw/`.
