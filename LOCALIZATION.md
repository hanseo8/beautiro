# Beautiro languages

Supported URL locales: `id` (default), `en`, `ko`, `zh` (Simplified Chinese), `th`, `vi`.

- Base UI copy: `src/messages/<locale>.json`.
- Marketing copy: `src/messages/partials/marketing-<locale>.json`.
- Chinese, Thai and Vietnamese catalog names: `src/messages/treatments-<locale>.json`. Device and product trade names remain in their original form.
- Shared catalog IDs remain stable across languages. `treatment-labels.ts` supplies labels for face guide, hospital, booking and booking-history screens.
- Hospital brand names remain in their registered English forms for new locales. `partner-copy.ts` translates known descriptions and additional consultation names by exact English source match. Newly edited DB copy falls back to English until translated; this prevents stale descriptions.
- Website language availability does not imply an interpreter is available in that language. Confirm availability during consultation. Existing email templates remain English.

Run `node scripts/check-locales.mjs` to check message coverage, ICU syntax, interpolation variables, URLs and treatment-label coverage. Then run `npm run build`.

Translations began as machine-assisted drafts. Main consultation copy, navigation, booking labels and all catalog treatment names were edited. Native-speaker/medical-translator sign-off has **not** been completed, and automated checks do not establish linguistic or legal accuracy. Obtain native review before using this copy in paid advertising or consent documents.
