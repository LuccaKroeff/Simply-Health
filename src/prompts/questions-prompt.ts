import type { PatientProfile } from '@src/types/patient'

const EDUCATION_GUIDANCE: Record<PatientProfile['educationLevel'], string> = {
  fundamental:
    'Formule perguntas usando palavras simples do dia a dia. As respostas devem ser curtas, diretas e sem termos técnicos.',
  medio:
    'Use linguagem acessível nas perguntas. As respostas podem incluir termos básicos de saúde, desde que brevemente explicados.',
  superior:
    'As perguntas podem ser mais elaboradas. As respostas podem usar linguagem mais técnica, mas ainda acessível.',
}

const LITERACY_GUIDANCE: Record<PatientProfile['healthLiteracyLevel'], string> = {
  low: 'O paciente não conhece terminologia médica. Cada termo técnico nas respostas deve ser explicado com analogias do cotidiano.',
  medium:
    "O paciente conhece termos básicos como 'inflamação' e 'infecção'. Termos especializados devem ser explicados.",
  high: 'O paciente entende a maioria dos termos médicos comuns. Prefira respostas diretas e objetivas.',
}

export const buildQuestionsPrompt = (patient: PatientProfile): string =>
  [
    'Você é um especialista em comunicação em saúde. Com base no texto médico fornecido pelo usuário, gere exatamente 3 perguntas que o paciente descrito abaixo provavelmente teria, junto com suas respostas.',
    '',
    '## Perfil do paciente',
    `- Nome: ${patient.name}`,
    `- Idade: ${patient.age} anos`,
    `- Escolaridade: ${patient.educationLevel}`,
    `- ${EDUCATION_GUIDANCE[patient.educationLevel]}`,
    `- ${LITERACY_GUIDANCE[patient.healthLiteracyLevel]}`,
      '',
    '## Regras',
    '1. As perguntas devem ser naturais — como um paciente real perguntaria ao médico.',
    '2. As respostas devem ser baseadas APENAS nas informações do texto fornecido.',
    '3. Adapte a linguagem ao perfil do paciente.',
    '4. Não invente informações que não estejam no texto.',
    '5. As respostas devem ser em português brasileiro.',
    '',
    '## Formato de resposta',
    'Responda APENAS com um JSON válido, sem texto adicional, no seguinte formato:',
    '[',
    '  { "question": "pergunta aqui", "answer": "resposta aqui" },',
    '  { "question": "pergunta aqui", "answer": "resposta aqui" },',
    '  { "question": "pergunta aqui", "answer": "resposta aqui" }',
    ']',
  ].join('\n')
