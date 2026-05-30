export type EducationLevel = 'fundamental' | 'medio' | 'superior'

export type Comorbidity = 'cardiovascular' | 'respiratory' | 'diabetes'

export type EducationArea = 'health' | 'technology' | 'humanities' | 'business' | 'education' | 'other'

export interface PatientProfile {
  id: string
  name: string
  age: number
  educationLevel: EducationLevel
  comorbidities?: Comorbidity[]
  educationArea?: EducationArea
}

export function inferLiteracyDescription(educationLevel: EducationLevel, educationArea?: EducationArea): string {
  if (educationArea === 'health') {
    if (educationLevel === 'superior')
      return 'Formado na área da saúde. Tem boa literacia clínica e entende a maioria dos termos médicos. Prefira linguagem direta.'
    return 'Tem contato com conceitos de saúde pela formação. Conhece terminologia básica, mas pode precisar de explicações para termos muito especializados.'
  }

  if (educationArea === 'technology') {
    if (educationLevel === 'superior')
      return 'Formado em tecnologia. Tem raciocínio analítico e lê bem instruções técnicas, mas não é familiarizado com terminologia clínica. Explique os termos médicos.'
    return 'Área de tecnologia, sem familiaridade com vocabulário médico. Use linguagem acessível e explique os termos.'
  }

  if (educationArea === 'business') {
    if (educationLevel === 'superior')
      return 'Formado em negócios/administração. Boa capacidade de leitura, mas sem contato com terminologia clínica. Explique os termos médicos de forma objetiva.'
    return 'Área de negócios, sem familiaridade com vocabulário médico. Use linguagem simples e direta.'
  }

  if (educationArea === 'education') {
    if (educationLevel === 'superior')
      return 'Formado em educação/pedagogia. Boa capacidade de compreensão textual, mas provavelmente sem familiaridade com termos clínicos especializados.'
    return 'Área de educação, sem formação em saúde. Explique os termos médicos com clareza.'
  }

  if (educationArea === 'humanities') {
    if (educationLevel === 'superior')
      return 'Formado em humanidades. Boa leitura e interpretação de texto, mas sem contato com terminologia médica. Explique termos técnicos.'
    return 'Área de humanas, sem familiaridade com vocabulário clínico. Use linguagem acessível.'
  }

  // 'other' or undefined — fall back to educationLevel only
  if (educationLevel === 'superior')
    return 'Ensino superior. Provavelmente sem conhecimento clínico específico. Explique termos técnicos médicos.'
  if (educationLevel === 'medio')
    return 'Ensino médio. Pode não conhecer terminologia médica. Explique os termos e use linguagem acessível.'
  return 'Ensino fundamental. Tem baixo contato com terminologia médica. Use linguagem muito simples e analogias do cotidiano.'
}
