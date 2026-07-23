import fs from "node:fs";
import path from "node:path";

/**
 * Cross-locale clinical-rule parity checker.
 *
 * The registry (docs/reference-authoring/rule-invariants.json) declares
 * locale-independent clinical rules and the per-locale text patterns that
 * assert them. Every listed route must state every listed rule in all five
 * locales, and must not contain the forbidden legacy phrasings. This is the
 * regression gate for the class of defect where a rule fix lands in a subset
 * of locales (e.g. the historical ko/ja standalone-S divergence).
 */
export function loadRuleInvariantRegistry(registryPath) {
  return JSON.parse(fs.readFileSync(registryPath, "utf8"));
}

export function findRuleParityViolations({ draftsDir, registryPath, promotionPath }) {
  const registry = loadRuleInvariantRegistry(registryPath);
  const violations = [];

  if (promotionPath) {
    const promotion = JSON.parse(fs.readFileSync(promotionPath, "utf8"));
    for (const locale of registry.locales) {
      if (promotion?.locales?.[locale]?.runtimeReady !== true) {
        violations.push({
          invariantId: "promotion-state",
          locale,
          file: path.relative(process.cwd(), promotionPath),
          kind: "locale-not-promoted",
          pattern: "runtimeReady: true",
          description: `Locale ${locale} is covered by rule invariants but is not promoted in runtime-promotion.json.`,
        });
      }
    }
  }

  for (const invariant of registry.invariants) {
    for (const relPath of invariant.paths) {
      for (const locale of registry.locales) {
        const filePath = path.join(draftsDir, locale, relPath);
        const fileLabel = path.relative(process.cwd(), filePath);

        if (!fs.existsSync(filePath)) {
          violations.push({
            invariantId: invariant.id,
            locale,
            file: fileLabel,
            kind: "missing-file",
            pattern: "",
            description: `Route file required by invariant ${invariant.id} is missing for locale ${locale}.`,
          });
          continue;
        }

        const text = fs.readFileSync(filePath, "utf8");
        const mustMatch = [
          ...(invariant.allLocalesMustMatch ?? []),
          ...((invariant.mustMatch ?? {})[locale] ?? []),
        ];
        for (const pattern of mustMatch) {
          if (!new RegExp(pattern, "u").test(text)) {
            violations.push({
              invariantId: invariant.id,
              locale,
              file: fileLabel,
              kind: "missing-required-rule",
              pattern,
              description: invariant.description,
            });
          }
        }

        const mustNotMatch = [
          ...((invariant.mustNotMatch ?? {}).all ?? []),
          ...((invariant.mustNotMatch ?? {})[locale] ?? []),
        ];
        for (const pattern of mustNotMatch) {
          if (new RegExp(pattern, "u").test(text)) {
            violations.push({
              invariantId: invariant.id,
              locale,
              file: fileLabel,
              kind: "forbidden-rule-text",
              pattern,
              description: invariant.description,
            });
          }
        }
      }
    }
  }

  return violations;
}
