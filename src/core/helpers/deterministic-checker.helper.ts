export function detectCriticalAlterations(original: string, generated: string): string[] {
  const issues: string[] = []

  // Dose alterations: same unit but different number (e.g., "10mg" in original vs "100mg" in generated)
  const dosePattern = /\b(\d+(?:[.,]\d+)?)\s*(mg|ml|mcg|g|ui|comprimidos?|gotas?|cápsulas?)\b/gi
  const origDoses = new Map<string, string>()

  for (const match of original.matchAll(dosePattern)) {
    const unit = match[2].toLowerCase().replace(/s$/, '')
    origDoses.set(unit, match[1].replace(',', '.'))
  }

  for (const match of generated.matchAll(dosePattern)) {
    const unit = match[2].toLowerCase().replace(/s$/, '')
    const origValue = origDoses.get(unit)
    if (origValue && match[1].replace(',', '.') !== origValue) {
      issues.push(`Dose possivelmente alterada para "${unit}": original "${origValue}", gerado "${match[1]}"`)
    }
  }

  // Negation inversions: "não X" present in original but the same verb appears without negation in generated
  const negationPattern = /não\s+(tomar|usar|interromper|consumir|beber|ingerir|aplicar|exceder|combinar|misturar)/gi
  for (const match of original.matchAll(negationPattern)) {
    const verb = match[1].toLowerCase()
    const hasNegationInGenerated = new RegExp(`não\\s+${verb}`, 'i').test(generated)
    const hasVerbWithoutNegationInGenerated =
      new RegExp(`\\b${verb}\\b`, 'i').test(generated) && !hasNegationInGenerated
    if (hasVerbWithoutNegationInGenerated) {
      issues.push(`Negação possivelmente invertida: "${match[0]}" do original não aparece com negação no gerado`)
    }
  }

  return issues
}
