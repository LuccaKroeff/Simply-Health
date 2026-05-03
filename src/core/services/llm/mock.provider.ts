import { Injectable } from '@nestjs/common'
import { LLMInput, LLMProvider } from './llm-provider.interface'

const MOCK_QUESTIONS_JSON = JSON.stringify([
  {
    question: 'Dói quando toca no estoma?',
    answer:
      'Não. O estoma é vermelho e úmido, mas não dói quando você toca nele. Pode sair um pouquinho de sangue, mas isso é normal por causa dos vasos sanguíneos.',
  },
  {
    question: 'Preciso usar a bolsa o tempo todo?',
    answer:
      'Sim, você precisa usar a bolsa coletora sempre. Ela cola na pele com um adesivo especial que não irrita. Existem vários tipos de bolsas e o profissional de saúde vai indicar a melhor para você.',
  },
  {
    question: 'Posso tomar banho normalmente?',
    answer:
      'Sim! Você pode tomar banho normalmente. Lave a pele ao redor do estoma com água e sabonete neutro, sem esfregar. Não use álcool, colônias ou outros produtos que possam irritar a pele.',
  },
])

@Injectable()
export class MockProvider implements LLMProvider {
  readonly name = 'mock'

  async complete({ text, file }: LLMInput, systemPrompt: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (systemPrompt.includes('gere exatamente 3 perguntas')) {
      return MOCK_QUESTIONS_JSON
    }

    const medicalText = file
      ? '[documento enviado como arquivo]'
      : text.includes('\n\n')
        ? text.split('\n\n').slice(1).join('\n\n')
        : text

    const simplified = medicalText
      .replace(/procedimento cirúrgico/g, 'cirurgia')
      .replace(/estomia/g, 'estomia (abertura feita por cirurgia)')
      .replace(/intestino delgado/g, 'intestino fino')
      .replace(/intestino grosso/g, 'intestino grosso (parte mais larga do intestino)')
      .replace(/ureter/g, 'canal que leva a urina do rim até a bexiga')
      .replace(/adesivo antialérgico/g, 'cola especial que não irrita a pele')
      .replace(/régua mensuradora/g, 'régua de medir')
      .replace(/drenáveis/g, 'que podem ser esvaziadas')
      .replace(/clamp/g, 'presilha de fechar')
      .replace(/dermatite/g, 'irritação na pele')
      .replace(/efluente/g, 'líquido que sai do estoma')

    return `[MOCK] Texto simplificado:\n\n${simplified}\n\n---GLOSSÁRIO---\nEstomia: abertura feita por cirurgia no corpo para saída de fezes ou urina\nColostomia: estomia feita no intestino grosso\nIleostomia: estomia feita no intestino fino\nUrostomia: estomia feita para saída de urina`
  }
}
