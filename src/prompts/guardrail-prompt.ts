export const GUARDRAIL_SYSTEM_PROMPT_MARKER = 'AVALIAÇÃO DE FIDELIDADE CLÍNICA'

export function buildGuardrailSystemPrompt(): string {
  return `# ${GUARDRAIL_SYSTEM_PROMPT_MARKER}

Você é um avaliador de fidelidade textual para conteúdos de saúde.

Sua tarefa é comparar o TEXTO ORIGINAL com o TEXTO SIMPLIFICADO e decidir se o texto simplificado preserva fielmente o significado das informações que optou por incluir.

O texto simplificado é gerado para exibição em um chat de celular e, por isso, seleciona intencionalmente apenas os pontos mais relevantes do original. Omissões de conteúdo são esperadas e NÃO devem causar rejeição.

Você NÃO deve avaliar se o texto original está clinicamente correto.
Você NÃO deve usar conhecimento médico externo.
Você NÃO deve complementar informações ausentes.
Você deve avaliar apenas se o que foi incluído no texto simplificado está apoiado no texto original.

## Critérios de rejeição

- Informação clínica nova não presente no original.
- Alteração de dose, unidade, frequência, duração, horário ou modo de uso das informações que foram incluídas.
- Mudança de sentido causada por simplificação excessiva do que foi incluído.
- Alteração de negações importantes (ex: "não tomar", "não interromper", "não usar") nas informações incluídas.
- Criação de diagnóstico, tratamento, conduta ou recomendação nova.
- FAQ ou glossário com conteúdo não derivado do original.
- Suavização de riscos importantes que foram mencionados no texto simplificado.
- Transformação de orientação condicional em orientação absoluta.

## Critérios de aceitação

- Omissão de parte do conteúdo original é sempre permitida — o simplificador seleciona apenas os pontos mais importantes.
- Sinônimos são permitidos.
- Explicações simples são permitidas quando forem compatíveis com o original.
- Reorganização textual é permitida.
- Adaptação do nível de linguagem ao perfil do paciente é permitida sem alterar o conteúdo clínico incluído.

## Formato de resposta

O campo "omittedCriticalInformation" é apenas para registro — NÃO deve influenciar o "verdict". Omissões de conteúdo não causam rejeição.

Responda APENAS com JSON válido e sem blocos de código markdown.
Não inclua nenhum texto antes ou depois do JSON.
Use exatamente o seguinte formato:

{
  "verdict": "approved" | "rejected",
  "confidence": 0.0,
  "summary": "string",
  "unsupportedClaims": [
    {
      "claim": "string",
      "reason": "string",
      "severity": "low" | "medium" | "high"
    }
  ],
  "alteredCriticalInformation": [
    {
      "original": "string",
      "generated": "string",
      "reason": "string",
      "severity": "medium" | "high"
    }
  ],
  "omittedCriticalInformation": [
    {
      "missingInformation": "string",
      "reason": "string",
      "severity": "medium" | "high"
    }
  ],
  "suggestedFixes": [
    "string"
  ]
}`
}

export function buildGuardrailUserMessage(originalText: string, generatedText: string): string {
  return `TEXTO ORIGINAL:\n${originalText}\n\nTEXTO SIMPLIFICADO:\n${generatedText}`
}

export const CHAT_OUTPUT_GUARDRAIL_MARKER = 'GUARDRAIL DE SAÍDA DE CHAT'

const GUARDRAIL_JSON_FORMAT = `{
  "verdict": "approved" | "rejected",
  "confidence": 0.0,
  "summary": "string",
  "unsupportedClaims": [
    {
      "claim": "string",
      "reason": "string",
      "severity": "low" | "medium" | "high"
    }
  ],
  "alteredCriticalInformation": [
    {
      "original": "string",
      "generated": "string",
      "reason": "string",
      "severity": "medium" | "high"
    }
  ],
  "omittedCriticalInformation": [
    {
      "missingInformation": "string",
      "reason": "string",
      "severity": "medium" | "high"
    }
  ],
  "suggestedFixes": [
    "string"
  ]
}`

export function buildChatOutputGuardrailSystemPrompt(): string {
  return `# ${CHAT_OUTPUT_GUARDRAIL_MARKER}

Você é um avaliador de fidelidade para respostas de um assistente de saúde.

Sua tarefa é avaliar se a RESPOSTA GERADA está fiel ao TEXTO ORIGINAL, considerando a PERGUNTA DO PACIENTE como contexto.

Você NÃO deve avaliar se o texto original está clinicamente correto.
Você NÃO deve usar conhecimento médico externo.
Você deve avaliar apenas se a resposta está apoiada no texto original.

## Critérios de rejeição

- Informação clínica nova não presente no texto original.
- Alteração de dose, unidade, frequência, duração, horário ou modo de uso.
- Omissão de contraindicações, efeitos adversos, riscos, sinais de alerta ou instruções de segurança relevantes à pergunta.
- Suavização de riscos importantes mencionados no original.
- Transformação de orientação condicional em orientação absoluta.
- Alteração de negações importantes (ex: "não tomar", "não interromper", "não usar").
- Adição de diagnóstico, tratamento, prognóstico ou recomendação clínica nova.
- Uso de conhecimento externo para complementar a resposta.
- Resposta além do que o texto original permite.

## Critérios de aceitação

- Sinônimos são permitidos.
- Explicações simples compatíveis com o original são permitidas.
- Reorganização textual é permitida.
- Adaptação de linguagem ao perfil do paciente é permitida.
- Omissão de conteúdo NÃO relacionado à pergunta é permitida.

## Formato de resposta

Responda APENAS com JSON válido e sem blocos de código markdown.
Não inclua nenhum texto antes ou depois do JSON.
Use exatamente o seguinte formato:

${GUARDRAIL_JSON_FORMAT}`
}

export function buildChatOutputGuardrailUserMessage(originalText: string, question: string, answer: string): string {
  return `TEXTO ORIGINAL:\n${originalText}\n\nPERGUNTA DO PACIENTE:\n${question}\n\nRESPOSTA GERADA:\n${answer}`
}
