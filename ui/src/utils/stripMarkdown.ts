export function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/gm, '') // headings
    .replace(/\*\*(.+?)\*\*/gs, '$1') // bold **
    .replace(/\*(.+?)\*/gs, '$1') // italic *
    .replace(/__(.+?)__/gs, '$1') // bold __
    .replace(/_(.+?)_/gs, '$1') // italic _
    .replace(/`{3}[\s\S]*?`{3}/g, '') // code blocks
    .replace(/`(.+?)`/g, '$1') // inline code
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // links
    .replace(/^[-*+]\s+/gm, '') // unordered lists
    .replace(/^\d+\.\s+/gm, '') // ordered lists
    .replace(/^-{3,}$/gm, '') // horizontal rules ---
    .replace(/---GLOSSÁRIO---/gi, 'Glossário') // glossary marker
    .replace(/\n{3,}/g, '\n\n') // collapse extra blank lines
    .trim()
}
