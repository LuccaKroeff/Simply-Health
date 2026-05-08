import type { PatientProfile } from '@src/types/patient'

const EDUCATION_DESCRIPTIONS: Record<PatientProfile['educationLevel'], string> = {
  fundamental:
    'O paciente possui ensino fundamental. Use palavras simples do dia a dia, frases curtas e evite qualquer termo técnico. Explique conceitos como se falasse com alguém que nunca estudou sobre saúde.',
  medio:
    'O paciente possui ensino médio. Use linguagem acessível mas pode incluir termos básicos de saúde, desde que explicados brevemente.',
  superior:
    'O paciente possui ensino superior. Pode usar linguagem mais elaborada, mas ainda simplifique jargão médico muito especializado.',
}

const LITERACY_DESCRIPTIONS: Record<PatientProfile['healthLiteracyLevel'], string> = {
  low: 'O paciente tem baixa literacia em saúde. Não conhece terminologia médica. Cada termo técnico deve ser explicado com analogias do cotidiano.',
  medium:
    "O paciente tem literacia média em saúde. Conhece termos básicos como 'inflamação', 'infecção', mas não termos especializados.",
  high: 'O paciente tem boa literacia em saúde. Entende a maioria dos termos médicos comuns, mas prefere linguagem direta.',
}

const getAgeGuidance = (age: number): string => {
  if (age >= 60)
    return 'O paciente é idoso. Use um tom acolhedor e paciente. Prefira instruções passo a passo bem detalhadas. Evite termos em inglês.'
  if (age >= 40) return 'O paciente é adulto. Use um tom respeitoso e direto.'
  if (age >= 15) return 'O paciente é jovem adulto. Use linguagem natural e moderna, mantendo o respeito.'

  return 'O paciente é menor de idade. Use um tom amigável e simples, como se falasse com um adolescente ou criança. Pode usar analogias.'
}

const buildPatientSection = (patient: PatientProfile): string[] => [
  '## Perfil do paciente',
  `- Nome: ${patient.name}`,
  `- Idade: ${patient.age} anos`,
  `- Escolaridade: ${patient.educationLevel}`,
  `- ${EDUCATION_DESCRIPTIONS[patient.educationLevel]}`,
  `- ${LITERACY_DESCRIPTIONS[patient.healthLiteracyLevel]}`,
  `- ${getAgeGuidance(patient.age)}`,
]

const RULES_SECTION = [
  '## Regras obrigatórias',
  '1. PRESERVE alertas de segurança, instruções práticas essenciais e orientações sobre quando buscar atendimento médico.',
  '2. Seja muito conciso. O texto final deve ter no máximo 150 palavras. Selecione apenas as 3 a 5 informações mais importantes e úteis para o paciente no dia a dia. Descarte detalhes técnicos secundários.',
  '3. Substitua termos técnicos por equivalentes simples, seguidos da explicação entre parênteses quando necessário.',
  '4. Use frases curtas e diretas.',
  '5. Mantenha a estrutura lógica do texto original (listas, passos, seções).',
  '6. Se houver instruções passo a passo, mantenha a numeração.',
  '7. O texto deve estar em português brasileiro.',
  '8. Não adicione informações que não estejam no texto original.',
  '9. Não faça recomendações médicas além das contidas no texto original.',
]

const GLOSSARY_SECTION = [
  '## Glossário',
  "Ao final do texto simplificado, inclua uma seção chamada '---GLOSSÁRIO---' APENAS com termos que atendam a TODOS estes critérios:",
  '- O termo aparece no texto simplificado (não apenas no original).',
  '- O termo é genuinamente clínico ou especializado — palavras do cotidiano como "infecção", "ferida", "diabetes" ou "inchaço" NÃO devem entrar.',
  '- O termo NÃO foi explicado entre parênteses dentro do próprio texto simplificado.',
  '- Máximo de 4 entradas. Se não houver termos que atendam aos critérios, omita a seção inteiramente.',
  "Formato: cada entrada em uma linha, no formato 'TERMO: definição simples em até 15 palavras'.",
]

const RESPONSE_FORMAT_SECTION = [
  '## Formato de resposta',
  'Responda APENAS com o texto simplificado (e o glossário se solicitado). Não inclua comentários, explicações sobre o processo ou metadados.',
]

export const buildSimplifyPrompt = (patient: PatientProfile, includeGlossary: boolean): string =>
  [
    'Você é um especialista em comunicação em saúde. Sua tarefa é reescrever textos médicos para torná-los mais acessíveis ao paciente descrito abaixo, SEM alterar o significado médico ou omitir informações importantes.',
    ...buildPatientSection(patient),
    ...RULES_SECTION,
    ...(includeGlossary ? ['', ...GLOSSARY_SECTION] : []),
    ...RESPONSE_FORMAT_SECTION,
  ].join('\n')
