# SimplyHealth

## Uso de LLMs para Simplificação de Linguagem Técnica em Plataformas mHealth

No contexto de aplicativos mHealth, este trabalho aborda a adaptação da linguagem técnica presente na descrição dos tratamentos oferecidos aos usuários. Em muitos sistemas de saúde digital, as informações são apresentadas com terminologia especializada, o que pode dificultar a compreensão por parte de usuários sem formação na área da saúde. Diante desse cenário, este trabalho propõe utilizar modelos de linguagem de grande porte (LLMs) para auxiliar na adaptação dessas informações, transformando conteúdos técnicos em uma linguagem mais clara e acessível. Ao mesmo tempo, busca-se garantir que o conteúdo simplificado preserve a precisão das recomendações médicas, evitando distorções ou perda de significado. O objetivo é melhorar a compreensão das orientações de saúde pelos usuários, promovendo uma experiência mais acessível, confiável e segura na plataforma.

## Sobre o projeto

A SimplyHealth é uma aplicação que recebe textos médicos (texto puro, PDF ou TXT) e um perfil de paciente, e usa um LLM para reescrever o conteúdo em linguagem mais acessível — preservando a precisão das informações. A simplificação é adaptada conforme escolaridade, área de formação, idade e comorbidades do paciente, e a fidelidade ao texto original é verificada por uma camada de **guardrails** antes de a resposta ser entregue.

A solução **não gera diagnósticos, prescrições ou recomendações clínicas novas**; ela atua sobre textos previamente definidos ou validados.

O projeto é dividido em dois componentes:

- **API (backend)** em NestJS + TypeScript.
- **UI (frontend)** em React + Vite, que consome a API e exibe a comparação entre o texto original, a versão simplificada, perguntas frequentes geradas pelo LLM e um chat de dúvidas restrito ao material.

## Funcionalidades

- Simplificação adaptada ao perfil do paciente (escolaridade, área de formação, idade, comorbidades).
- Suporte a entrada como texto, PDF (com extração opcional de imagens) ou TXT.
- Geração de glossário automático com termos do próprio texto.
- Geração de 3 perguntas frequentes sobre o texto, com respostas adaptadas ao perfil.
- Chat de dúvidas livre, restrito ao conteúdo do material informado.
- Síntese de voz (TTS) das respostas via Google Gemini.
- Métricas de legibilidade (Flesch, palavras por frase) comparando original × simplificado.
- Múltiplos provedores de LLM intercambiáveis: **Claude**, **Gemini** ou **mock** (para uso sem API key).
- Camada de **guardrails** em três níveis (prompt, avaliador LLM e checagens determinísticas) para verificar fidelidade ao texto original.

## Arquitetura

Construído com **NestJS 11** seguindo Clean Architecture: controllers delegam para use-cases, que orquestram services. Provedores externos (LLMs, complexidade) são abstraídos atrás de interfaces e injetados via tokens.

```
src/
├── main.ts                                       # Bootstrap NestJS (prefixo /api)
├── app.module.ts                                 # Módulo raiz
├── core/                                         # CoreModule (global)
│   ├── core.module.ts
│   ├── constants/llm.constants.ts                # Tokens de DI (LLM_PROVIDER, etc.)
│   ├── services/
│   │   ├── llm/
│   │   │   ├── llm-provider.interface.ts         # Interface LLMProvider
│   │   │   ├── llm.module.ts                     # Factory provider (Claude/Gemini/Mock)
│   │   │   ├── claude.provider.ts                # Anthropic Claude
│   │   │   ├── gemini.provider.ts                # Google Gemini
│   │   │   └── mock.provider.ts                  # Mock para testes
│   │   ├── guardrail/
│   │   │   ├── fidelity-guardrail.service.ts     # Avalia fidelidade da simplificação
│   │   │   ├── input-guardrail.service.ts        # Classifica perguntas do chat
│   │   │   └── chat-output-guardrail.service.ts  # Avalia respostas do chat
│   │   ├── complexity/
│   │   │   ├── basic-readability-analyzer.ts     # Flesch + palavras/frase
│   │   │   ├── nilc-metrix.adapter.ts            # Adapter opcional p/ NILC-Metrix
│   │   │   └── text-complexity-analyzer.interface.ts
│   │   ├── text-extractor/text-extractor.service.ts        # Extrai texto de PDF/TXT
│   │   ├── pdf-image-extractor/pdf-image-extractor.service.ts  # Extrai imagens de PDF
│   │   └── tts/tts.service.ts                    # Síntese de voz via Gemini TTS
│   └── helpers/
│       ├── glossary-parser.helper.ts
│       ├── questions-parser.helper.ts
│       ├── json-parser.helper.ts
│       └── deterministic-checker.helper.ts       # Regex para doses e negações
├── routes/
│   ├── routes.module.ts
│   ├── health/                                   # GET /api/health
│   └── simplify/
│       ├── simplify.controller.ts                # /simplify, /questions, /chat, /tts
│       ├── requests/
│       │   ├── simplify-request.dto.ts
│       │   └── chat-request.dto.ts
│       └── use-cases/
│           ├── simplify-text.use-case.ts
│           ├── generate-questions.use-case.ts
│           └── chat-answer.use-case.ts
├── prompts/
│   ├── simplify-prompt.ts                        # Prompt principal + guardrails
│   ├── questions-prompt.ts
│   ├── chat-prompt.ts
│   ├── guardrail-prompt.ts
│   └── input-guardrail-prompt.ts
├── mock/patients.ts                              # 3 perfis de paciente mock
├── types/                                        # patient, simplification, chat, guardrail...
└── data/ostomy-guide.ts                          # Texto médico de exemplo

ui/
├── index.html
├── vite.config.ts                                # Dev server (5173) com proxy para /api
└── src/
    ├── main.tsx
    ├── App.tsx                                   # Fases (initial/chat) e abas (chat/original)
    ├── api.ts                                    # Cliente HTTP da API
    ├── types.ts
    ├── data/patients.ts                          # Pacientes (avatar/label) no front
    ├── hooks/useTtsPlayer.ts                     # Reprodução e cache de áudio TTS
    ├── utils/stripMarkdown.ts
    └── components/
        ├── PatientSelector.tsx
        ├── InputSection.tsx                      # Texto vs arquivo, nível de detalhe, imagens
        ├── PatientResultCard.tsx                 # Card por paciente com resultado
        ├── SummaryCard.tsx                       # Texto simplificado + glossário + áudio
        ├── ChatSection.tsx / ChatMessages.tsx / ChatInput.tsx
        ├── SuggestedQuestions.tsx                # Botões com FAQs geradas
        ├── MetricsPanel.tsx / ComplexityPanel.tsx # Métricas de legibilidade
        ├── PlayButton.tsx                        # TTS
        └── AssistantThinkingMessage.tsx
```

### Componentes principais

- **Use-cases** (`@Injectable()`): `SimplifyTextUseCase`, `GenerateQuestionsUseCase` e `ChatAnswerUseCase`. Encapsulam a orquestração do fluxo (prompt → LLM → guardrail → retry → resposta).
- **LLM provider** (`LLMProvider`): interface única `complete(input, systemPrompt)`. Implementações: `ClaudeProvider`, `GeminiProvider`, `MockProvider`. O provider é escolhido via `LLM_PROVIDER` no `.env`.
- **Guardrails**: três camadas combinadas — instruções absolutas no prompt, avaliadores LLM (`FidelityGuardrailService`, `InputGuardrailService`, `ChatOutputGuardrailService`) e checagens determinísticas via regex (`deterministic-checker.helper.ts`) para doses e negações críticas. Em caso de rejeição, o feedback é injetado no prompt e o LLM tenta novamente (até 3 tentativas).
- **Análise de complexidade**: `BasicReadabilityAnalyzer` calcula Flesch e média de palavras por frase. Se `NILC_METRIX_URL` estiver definido, o `NilcMetrixAdapter` é usado no lugar (opcional).
- **Extração de mídia**: `TextExtractorService` lê PDF/TXT; `PdfImageExtractorService` extrai imagens do PDF (rotuladas como `IMAGEM_1`, `IMAGEM_2`...) para que o LLM possa referenciá-las no texto simplificado.
- **TTS**: `TtsService` usa `gemini-2.5-flash-preview-tts` (voz Aoede) e devolve WAV PCM 24 kHz.

### Endpoints

| Método | Rota                      | Descrição                                                       |
| ------ | ------------------------- | --------------------------------------------------------------- |
| `GET`  | `/api/health`             | Health check.                                                   |
| `POST` | `/api/simplify`           | Simplifica texto/PDF/TXT com base no perfil.                    |
| `POST` | `/api/simplify/questions` | Gera 3 perguntas frequentes sobre o texto.                      |
| `POST` | `/api/simplify/chat`      | Responde dúvidas do paciente, restrito ao material informado.   |
| `POST` | `/api/simplify/tts`       | Sintetiza áudio (WAV base64) de um texto (até 5000 caracteres). |

#### POST /api/simplify

Aceita `application/json` ou `multipart/form-data`. Campos:

- `text` _(string, opcional)_ — texto médico (use isto **ou** `file`).
- `file` _(arquivo, opcional)_ — PDF ou TXT enviado via `multipart/form-data` (até 20 MB).
- `patientId` _(string)_ ou `patientProfile` _(objeto)_ — referência ao paciente.
- `glossary` _(boolean)_ — incluir glossário automático.
- `includeImages` _(boolean)_ — extrair e referenciar imagens do PDF.
- `detailLevel` _(`"short" | "medium" | "detailed"`)_ — controla o tamanho da resposta (default `medium`).

Exemplo de body JSON:

```json
{
  "text": "A estomia é um procedimento cirúrgico...",
  "patientId": "patient-1",
  "glossary": true,
  "includeImages": false,
  "detailLevel": "medium"
}
```

Ou enviando o perfil completo:

```json
{
  "text": "A estomia é um procedimento cirúrgico...",
  "patientProfile": {
    "id": "custom-1",
    "name": "João",
    "age": 72,
    "educationLevel": "fundamental",
    "educationArea": "other",
    "comorbidities": ["cardiovascular"]
  },
  "glossary": true,
  "includeImages": false,
  "detailLevel": "short"
}
```

Resposta:

```json
{
  "simplifiedText": "A estomia é uma cirurgia feita para criar...",
  "originalText": "A estomia é um procedimento cirúrgico...",
  "glossary": [{ "term": "Estomia", "definition": "abertura feita por cirurgia..." }],
  "images": [{ "id": "IMAGEM_1", "data": "<base64>", "mimeType": "image/png" }],
  "complexity": {
    "original": {
      "fleschScore": 32.1,
      "avgWordsPerSentence": 24.4,
      "wordCount": 312,
      "sentenceCount": 13,
      "fleschLabel": "difícil"
    },
    "simplified": {
      "fleschScore": 71.8,
      "avgWordsPerSentence": 12.1,
      "wordCount": 210,
      "sentenceCount": 18,
      "fleschLabel": "fácil"
    },
    "fleschGain": 39.7,
    "wordsPerSentenceReduction": 12.3,
    "analyzer": "basic"
  },
  "metadata": {
    "model": "claude",
    "processingTimeMs": 1523,
    "patientProfile": { "...": "..." },
    "imagesFound": 1
  }
}
```

Se a simplificação não passar nos guardrails em 3 tentativas, a API retorna uma mensagem segura no campo `simplifiedText` e omite glossário/imagens.

#### POST /api/simplify/questions

Mesmo formato de request do `/simplify` (sem `includeImages`/`detailLevel`/`glossary`). Resposta:

```json
{
  "questions": [
    { "question": "Dói quando toca no estoma?", "answer": "Não. O estoma..." },
    { "question": "Preciso usar a bolsa o tempo todo?", "answer": "Sim..." },
    { "question": "Posso tomar banho normalmente?", "answer": "Sim..." }
  ],
  "metadata": { "model": "claude", "processingTimeMs": 1200, "patientProfile": { "...": "..." } }
}
```

#### POST /api/simplify/chat

JSON apenas. Responde a uma pergunta livre do paciente, com base **somente** no `originalText` informado.

```json
{
  "question": "Posso comer frutas?",
  "originalText": "A estomia é um procedimento...",
  "patientId": "patient-1",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

Resposta:

```json
{
  "answer": "...",
  "blocked": false,
  "metadata": { "model": "claude", "processingTimeMs": 980 }
}
```

Se a pergunta for classificada como fora do escopo, pedido de aconselhamento médico, emergência etc., a resposta vem com `blocked: true` e um `blockReason`.

#### POST /api/simplify/tts

```json
{ "text": "Texto a ser sintetizado em áudio" }
```

Resposta:

```json
{ "audio": "<WAV em base64>" }
```

## Como executar

### Pré-requisitos

- Node ≥ 18
- npm ≥ 9

### Backend

```bash
npm install
cp .env.example .env
npm run dev
```

Variáveis do `.env`:

```env
LLM_PROVIDER=mock           # "mock", "gemini" ou "claude"
PORT=5172                   # Porta da API (default: 5172)
ANTHROPIC_API_KEY=          # Obrigatório se LLM_PROVIDER=claude
GEMINI_API_KEY=             # Obrigatório se LLM_PROVIDER=gemini (e para TTS)
NILC_METRIX_URL=            # Opcional — se vazio, usa o analisador básico
```

O provider `mock` permite rodar e testar a API sem qualquer chave externa. Para usar Claude ou Gemini, defina `LLM_PROVIDER` e a respectiva API key.

### Frontend (UI)

Em outro terminal:

```bash
cd ui
npm install
npm run dev
```

A UI sobe em `http://localhost:5173` e o Vite faz proxy automático de `/api` para `http://localhost:5172` (configurado em `ui/vite.config.ts`).

### Build de produção

```bash
npm run build && npm start      # Backend
cd ui && npm run build          # Frontend (gera ui/dist/)
```

## Extensão

### Adicionar um novo provider de LLM

1. Crie uma classe implementando `LLMProvider` em `src/core/services/llm/`.
2. Registre no factory de `src/core/services/llm/llm.module.ts`.
3. Adicione a opção correspondente em `LLM_PROVIDER` no `.env`.

### Ajustar prompts e guardrails

- **Simplificação**: `src/prompts/simplify-prompt.ts` (regras de adaptação, glossário e seção de guardrails).
- **Perguntas frequentes**: `src/prompts/questions-prompt.ts`.
- **Chat**: `src/prompts/chat-prompt.ts`.
- **Avaliador de fidelidade**: `src/prompts/guardrail-prompt.ts`.
- **Classificador de entrada do chat**: `src/prompts/input-guardrail-prompt.ts`.

### Adicionar novos textos de exemplo

Adicione módulos em `src/data/` seguindo o padrão de `ostomy-guide.ts` (campos `id`, `title`, `content`).
