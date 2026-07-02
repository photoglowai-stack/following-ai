# PowerPoint Notes

Ce MVP démontre qu'un mini-ClarityCheck / mini-Spokeo ne nécessite pas une technologie secrète. Un seul endpoint backend peut orchestrer une API OSINT et plusieurs outils GitHub open-source. Les données sont ensuite normalisées, scorées et affichées sous forme de rapport. La vraie difficulté n'est pas l'accès technique, mais la fiabilité, la conformité, la gestion des faux positifs et l'usage éthique.

## Architecture

Frontend → `/api/lookup` → Provider Registry → CLIs/APIs → Normalization → Scoring → Report.

## Message

The technical barrier is low: one endpoint can orchestrate many public tools. The real challenges are compliance, reliability, false positives and ethical use.

## Comparaison Providers

- API principale: OSINT Industries
- Username gratuit: Sherlock, Maigret, WhatsMyName, Blackbird
- Email gratuit/lab: socialscan, Holehe, h8mail, GHunt
- Phone gratuit/lab: PhoneInfoga, Ignorant
- Frameworks lourds: SpiderFoot, Recon-ng

## Talking Points

- Mock mode proves the product flow without calling external services.
- The provider registry makes policy visible: enabled flags, risk levels, supported inputs, install hints.
- `purpose` is mandatory, and sensitive tools require `self_check` or `consent`.
- Scores are confidence indicators, not proof of identity.
- Name searches are intentionally discounted because false positives are common.
- No result is stored by default.
