import { GlossaryEntry } from '@src/types/simplification'
import { GLOSSARY_SEPARATOR } from '@src/core/constants/llm.constants'

const stripMarkdown = (s: string) =>
  s
    .replace(/^[\s*\-#>]+/, '')
    .replace(/\*\*/g, '')
    .trim()

const parseGlossaryLine = (line: string): GlossaryEntry | null => {
  const colonIndex = line.indexOf(':')
  if (colonIndex <= 0) return null
  return {
    term: stripMarkdown(line.slice(0, colonIndex)),
    definition: stripMarkdown(line.slice(colonIndex + 1)),
  }
}

export const parseResponse = (
  raw: string,
  includeGlossary: boolean,
): { simplified: string; glossary: GlossaryEntry[] } => {
  if (!includeGlossary) {
    return { simplified: raw.trim(), glossary: [] }
  }

  const [simplifiedPart, glossaryPart] = raw.split(GLOSSARY_SEPARATOR)

  const glossary = (glossaryPart ?? '')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(parseGlossaryLine)
    .filter((entry): entry is GlossaryEntry => entry !== null)

  return { simplified: simplifiedPart.trim(), glossary }
}
