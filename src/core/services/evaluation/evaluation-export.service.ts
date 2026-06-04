import { Injectable, Logger } from '@nestjs/common'
import * as fs from 'fs/promises'
import * as path from 'path'
import { GuardrailRejection, SimplifyResponse } from '@src/types/simplification'
import { EducationArea, EducationLevel, Comorbidity } from '@src/types/patient'

export interface EvaluationExportContext {
  materialName: string
  inputType: 'text' | 'file'
  glossaryRequested: boolean
  includeImages: boolean
  detailLevel: string
  questions?: Array<{ question: string; answer: string }>
}

const OUTPUT_DIR = path.join(process.cwd(), 'evaluation-results')
const MAX_ATTEMPTS = 5

const EDUCATION_LEVEL_LABEL: Record<EducationLevel, string> = {
  fundamental: 'Fundamental',
  medio: 'Médio',
  superior: 'Superior',
}

const EDUCATION_AREA_LABEL: Record<EducationArea, string> = {
  health: 'Saúde',
  technology: 'Tecnologia',
  humanities: 'Humanas',
  business: 'Negócios',
  education: 'Educação',
  other: 'Outra',
}

const COMORBIDITY_LABEL: Record<Comorbidity, string> = {
  cardiovascular: 'Cardiovascular',
  respiratory: 'Respiratório',
  diabetes: 'Diabetes',
}

@Injectable()
export class EvaluationExportService {
  private readonly logger = new Logger(EvaluationExportService.name)

  async export(response: SimplifyResponse, context: EvaluationExportContext): Promise<void> {
    if (process.env.EVALUATION_EXPORT === 'false') return
    try {
      await fs.mkdir(OUTPUT_DIR, { recursive: true })

      const caseId = this.buildCaseId(response.metadata.patientProfile.name, context.materialName)
      const markdown = this.buildMarkdown(caseId, response, context)
      const json = this.buildJson(caseId, response, context)

      await Promise.all([
        fs.writeFile(path.join(OUTPUT_DIR, `${caseId}.md`), markdown, 'utf-8'),
        fs.writeFile(path.join(OUTPUT_DIR, `${caseId}.json`), JSON.stringify(json, null, 2), 'utf-8'),
      ])

      this.logger.log(`Resultado de avaliação exportado: evaluation-results/${caseId}.md`)
    } catch (err) {
      this.logger.error('Falha ao exportar resultado de avaliação', err)
    }
  }

  private buildCaseId(patientName: string, materialName: string): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')
    const toSlug = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/\.[^.]+$/, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .slice(0, 40)
    const materialSlug = toSlug(materialName === 'Texto direto' ? 'texto' : materialName)
    const patientSlug = toSlug(patientName)
    return `${timestamp}-${materialSlug}-${patientSlug}`
  }

  private buildMarkdown(caseId: string, response: SimplifyResponse, ctx: EvaluationExportContext): string {
    const { metadata, originalText, simplifiedText, glossary, complexity } = response
    const { patientProfile } = metadata
    const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

    const attempts = metadata.attemptCount ?? 1
    const usedFallback = metadata.usedFallback ?? false

    const guardrailStatus = usedFallback
      ? `Rejeitado — fallback ativado após ${attempts} tentativa(s)`
      : attempts > 1
        ? `Aprovado na tentativa ${attempts} de ${MAX_ATTEMPTS} (com retry)`
        : `Aprovado na tentativa 1 de ${MAX_ATTEMPTS}`

    const guardrailCallout = usedFallback
      ? [
          '> [!WARNING]',
          `> **GUARDRAIL — FALLBACK ATIVADO:** Todas as ${attempts} tentativa(s) foram rejeitadas pelo guardrail de fidelidade.`,
          '> O texto abaixo **NAO e uma simplificacao do conteudo original** — e a mensagem de fallback padrao.',
          '> Este caso requer nova execucao ou revisao manual.',
        ].join('\n')
      : attempts > 1
        ? [
            '> [!NOTE]',
            `> **GUARDRAIL — APROVADO COM RETRY:** A simplificacao foi aprovada na tentativa ${attempts} de 3.`,
            '> As tentativas anteriores foram rejeitadas e o feedback foi reinjetado no prompt.',
          ].join('\n')
        : ''

    const comorbidities =
      patientProfile.comorbidities && patientProfile.comorbidities.length > 0
        ? patientProfile.comorbidities.map(c => COMORBIDITY_LABEL[c]).join(', ')
        : 'Nenhuma'

    const educationArea = patientProfile.educationArea
      ? EDUCATION_AREA_LABEL[patientProfile.educationArea]
      : 'Não informada'

    const fleschSection = complexity
      ? [
          `- Flesch-PT original: ${complexity.original.fleschScore.toFixed(1)} — ${complexity.original.fleschLabel}`,
          `- Classificação original: ${complexity.original.fleschLabel}`,
          `- Flesch-PT simplificado: ${complexity.simplified.fleschScore.toFixed(1)} — ${complexity.simplified.fleschLabel}`,
          `- Classificação simplificada: ${complexity.simplified.fleschLabel}`,
          `- Variação: ${complexity.fleschGain >= 0 ? '+' : ''}${complexity.fleschGain.toFixed(1)} pontos`,
        ].join('\n')
      : '*(indicador não disponível nesta execução)*'

    const glossarySection =
      glossary && glossary.length > 0
        ? glossary.map(e => `**${e.term}:** ${e.definition}`).join('\n\n')
        : '*(sem glossário nesta execução)*'

    return [
      `# Caso — ${caseId}`,
      '',
      ...(guardrailCallout ? [guardrailCallout, ''] : []),
      '## Dados do caso',
      `- ID do caso: ${caseId}`,
      `- Material: ${ctx.materialName}`,
      `- Data/hora: ${now}`,
      `- Modelo usado: ${metadata.model}`,
      `- Tempo de processamento: ${metadata.processingTimeMs}ms`,
      `- Status do guardrail: ${guardrailStatus}`,
      `- Tentativas: ${attempts}`,
      `- Fallback usado: ${usedFallback ? 'Sim' : 'Não'}`,
      '',
      '## Perfil do paciente',
      `- Nome: ${patientProfile.name}`,
      `- Idade: ${patientProfile.age} anos`,
      `- Escolaridade: ${EDUCATION_LEVEL_LABEL[patientProfile.educationLevel]}`,
      `- Área de formação: ${educationArea}`,
      `- Grupo de condição/comorbidades: ${comorbidities}`,
      '- Observação: perfil simulado, sem dados reais de paciente.',
      '',
      '## Parâmetros de processamento',
      `- Nível de detalhamento: ${ctx.detailLevel}`,
      `- Glossário solicitado: ${ctx.glossaryRequested ? 'Sim' : 'Não'}`,
      `- Imagens incluídas: ${ctx.includeImages ? 'Sim' : 'Não'}`,
      `- Entrada por texto ou arquivo: ${ctx.inputType === 'file' ? 'Arquivo' : 'Texto direto'}`,
      '',
      '## Texto original',
      '',
      originalText,
      '',
      '## Texto simplificado',
      '',
      simplifiedText,
      '',
      '## Indicador de legibilidade',
      '',
      fleschSection,
      '',
      'Observação: o Flesch-PT avalia apenas aspectos linguísticos do texto e não valida precisão médica.',
      '',
      '## Glossário',
      '',
      glossarySection,
      '',
      '## Perguntas frequentes',
      '',
      this.buildQuestionsSection(ctx.questions),
      '',
      '## Rejeições do guardrail',
      '',
      this.buildRejectionsSection(metadata.guardrailRejections),
      '',
      '## Chat contextual',
      '',
      '*(vazio — preencher durante avaliação)*',
      '',
      '## Observações para avaliação',
      '- Informação nova identificada: ',
      '- Omissão crítica identificada: ',
      '- Dose/frequência alterada: ',
      '- Alerta ou instrução de segurança preservado: ',
      '- Sentido geral preservado: ',
      '- Adequação ao perfil: ',
      '- Observações manuais: ',
    ].join('\n')
  }

  private buildJson(caseId: string, response: SimplifyResponse, ctx: EvaluationExportContext): object {
    const { metadata, originalText, simplifiedText, glossary, complexity } = response
    const attempts = metadata.attemptCount ?? 1
    const usedFallback = metadata.usedFallback ?? false
    const guardrailStatus = usedFallback
      ? `Rejeitado — fallback ativado após ${attempts} tentativa(s)`
      : attempts > 1
        ? `Aprovado na tentativa ${attempts} de ${MAX_ATTEMPTS} (com retry)`
        : `Aprovado na tentativa 1 de ${MAX_ATTEMPTS}`

    return {
      caseId,
      exportedAt: new Date().toISOString(),
      dados: {
        material: ctx.materialName,
        modelo: metadata.model,
        processamentoMs: metadata.processingTimeMs,
      },
      guardrail: {
        aprovado: !usedFallback,
        tentativas: attempts,
        aprovadoNaPrimeiraTentativa: !usedFallback && attempts === 1,
        fallbackAtivado: usedFallback,
        status: guardrailStatus,
      },
      perfilPaciente: {
        nome: metadata.patientProfile.name,
        idade: metadata.patientProfile.age,
        escolaridade: metadata.patientProfile.educationLevel,
        areaFormacao: metadata.patientProfile.educationArea ?? null,
        comorbidades: metadata.patientProfile.comorbidities ?? [],
      },
      parametros: {
        nivelDetalhamento: ctx.detailLevel,
        glossarioSolicitado: ctx.glossaryRequested,
        imagensIncluidas: ctx.includeImages,
        tipoEntrada: ctx.inputType,
      },
      textoOriginal: originalText,
      textoSimplificado: simplifiedText,
      legibilidade: complexity
        ? {
            original: {
              flesch: complexity.original.fleschScore,
              classificacao: complexity.original.fleschLabel,
            },
            simplificado: {
              flesch: complexity.simplified.fleschScore,
              classificacao: complexity.simplified.fleschLabel,
            },
            variacao: complexity.fleschGain,
          }
        : null,
      glossario: glossary ?? [],
      perguntasFrequentes: ctx.questions ?? [],
      rejeicoes: (metadata.guardrailRejections ?? []).map(r => ({
        tentativa: r.attempt,
        origem: r.source,
        resumo: r.summary,
        alegacoesNaoSuportadas: r.unsupportedClaims,
        informacoesCriticasAlteradas: r.alteredCriticalInformation,
        informacoesCriticasOmitidas: r.omittedCriticalInformation,
        correcoesSugeridas: r.suggestedFixes,
      })),
    }
  }

  private buildRejectionsSection(rejections?: GuardrailRejection[]): string {
    if (!rejections || rejections.length === 0) {
      return '*(nenhuma rejeição — aprovado na primeira tentativa)*'
    }

    return rejections
      .map(r => {
        const lines: string[] = [
          `### Tentativa ${r.attempt} — rejeitada (${r.source === 'deterministic' ? 'checker determinístico' : 'guardrail LLM'})`,
          '',
          `**Motivo:** ${r.summary}`,
        ]

        if (r.unsupportedClaims.length > 0) {
          lines.push('', '**Alegações sem suporte no original:**')
          r.unsupportedClaims.forEach(c => lines.push(`- [${c.severity}] ${c.claim} — ${c.reason}`))
        }

        if (r.alteredCriticalInformation.length > 0) {
          lines.push('', '**Informações críticas alteradas:**')
          r.alteredCriticalInformation.forEach(a =>
            lines.push(`- [${a.severity}] Original: "${a.original}" → Gerado: "${a.generated}" — ${a.reason}`),
          )
        }

        if (r.omittedCriticalInformation.length > 0) {
          lines.push('', '**Informações críticas omitidas:**')
          r.omittedCriticalInformation.forEach(o => lines.push(`- [${o.severity}] ${o.missingInformation} — ${o.reason}`))
        }

        if (r.suggestedFixes.length > 0) {
          lines.push('', '**Correções sugeridas:**')
          r.suggestedFixes.forEach(f => lines.push(`- ${f}`))
        }

        return lines.join('\n')
      })
      .join('\n\n---\n\n')
  }

  private buildQuestionsSection(questions?: Array<{ question: string; answer: string }>): string {
    if (!questions) return '*(não gerado nesta execução)*'
    if (questions.length === 0) return '*(nenhuma pergunta gerada)*'
    return questions.map((q, i) => `**${i + 1}. ${q.question}**\n\n${q.answer}`).join('\n\n---\n\n')
  }
}
