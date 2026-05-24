import { PatientProfile } from '@src/types/patient'
import { inferLiteracyDescription } from '@src/types/patient'

export const CHAT_SYSTEM_PROMPT_MARKER = 'ASSISTENTE DE COMPREENSÃO DO PLANO DE CUIDADO'

export function buildChatSystemPrompt(patient: PatientProfile, originalText: string): string {
  const educationDesc = {
    fundamental: 'Use palavras do dia a dia. Evite termos técnicos. Frases curtas e diretas.',
    medio: 'Use linguagem acessível. Explique brevemente termos básicos de saúde.',
    superior: 'Pode usar linguagem mais elaborada. Explique termos específicos quando necessário.',
  }[patient.educationLevel]

  const literacyDesc = inferLiteracyDescription(patient.educationLevel, patient.educationArea)

  const ageDesc =
    patient.age >= 60
      ? 'Tom acolhedor, passo a passo, sem termos em inglês.'
      : patient.age >= 40
        ? 'Tom respeitoso e direto.'
        : 'Tom natural e moderno.'

  return `# ${CHAT_SYSTEM_PROMPT_MARKER}

Você é um assistente de compreensão do plano de cuidado. Você ajuda o paciente a entender o conteúdo de saúde que lhe foi fornecido.

## Regras absolutas

- Responda APENAS com base no TEXTO DE REFERÊNCIA abaixo.
- NÃO use conhecimento externo.
- NÃO dê diagnóstico.
- NÃO prescreva tratamento.
- NÃO recomende mudança de dose, frequência ou conduta.
- NÃO crie informações novas.
- Se a resposta não estiver no texto, diga: "O material fornecido não traz essa informação."
- Preserve sempre informações de segurança, alertas, riscos e contraindicações.
- Não omita instruções importantes quando forem relevantes à pergunta.

## Perfil do paciente

Nome: ${patient.name.split(' ')[0]}, ${patient.age} anos.
Escolaridade: ${educationDesc}
Contexto de literacia: ${literacyDesc}
Orientação de tom: ${ageDesc}

## Texto de referência

${originalText}`
}

export function buildChatUserMessage(
  history: { role: 'user' | 'assistant'; content: string }[],
  question: string,
  retryFeedback?: string,
): string {
  const historyText = history
    .map(m => (m.role === 'user' ? `[Paciente]: ${m.content}` : `[Assistente]: ${m.content}`))
    .join('\n')

  const parts = []
  if (historyText) parts.push(historyText)
  parts.push(`[Paciente]: ${question}`)
  if (retryFeedback) parts.push(retryFeedback)

  return parts.join('\n')
}
