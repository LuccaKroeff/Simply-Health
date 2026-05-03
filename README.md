# SimplyHealth

## Uso de LLMs para Simplificação de Linguagem Técnica em Plataformas mHealth

No contexto de aplicativos mHealth, este trabalho aborda a adaptação da linguagem técnica presente na descrição dos tratamentos oferecidos aos usuários. Em muitos sistemas de saúde digital, as informações são apresentadas com terminologia especializada, o que pode dificultar a compreensão por parte de usuários sem formação na área da saúde. Diante desse cenário, este trabalho propõe utilizar modelos de linguagem de grande porte (LLMs) para auxiliar na adaptação dessas informações, transformando conteúdos técnicos em uma linguagem mais clara e acessível. Ao mesmo tempo, busca-se garantir que o conteúdo simplificado preserve a precisão das recomendações médicas, evitando distorções ou perda de significado, e que a privacidade dos dados dos usuários seja mantida, por meio do tratamento seguro de informações sensíveis. O objetivo é melhorar a compreensão das orientações de saúde pelos usuários, promovendo uma experiência mais acessível, confiável e segura na plataforma.

## Sobre o Projeto

A SimplyHealth é uma API que recebe textos médicos e perfis de pacientes, utilizando um LLM para reescrever o conteúdo de forma mais clara e acessível — preservando a precisão médica. A simplificação é adaptada de acordo com o nível de escolaridade, literacia em saúde e idade do paciente.

## Estrutura do Projeto

Construído com TypeScript e NestJS, seguindo clean architecture com separação em camadas: controllers delegam para use-cases, que orquestram services.

```
src/
├── main.ts                                        # Bootstrap NestJS
├── app.module.ts                                  # Módulo raiz
├── core/                                          # CoreModule (global)
│   ├── core.module.ts
│   ├── constants/
│   │   └── llm.constants.ts                       # Tokens de DI e constantes
│   ├── services/
│   │   ├── llm/
│   │   │   ├── llm-provider.interface.ts          # Interface LLMProvider
│   │   │   ├── llm.module.ts                      # Factory provider (Claude/Mock)
│   │   │   ├── claude.provider.ts                 # Implementação Anthropic Claude
│   │   │   └── mock.provider.ts                   # Mock para testes
│   │   └── text-extractor/
│   │       └── text-extractor.service.ts          # Extração de texto (PDF/TXT)
│   └── helpers/
│       ├── glossary-parser.helper.ts              # Parser de resposta e glossário
│       └── questions-parser.helper.ts             # Parser de perguntas do LLM
├── routes/                                        # RoutesModule
│   ├── routes.module.ts
│   ├── health/
│   │   ├── health.module.ts
│   │   └── health.controller.ts                   # GET /api/health
│   └── simplify/
│       ├── simplify.module.ts
│       ├── simplify.controller.ts                 # POST /api/simplify e /api/simplify/questions
│       ├── requests/
│       │   └── simplify-request.dto.ts            # Validação do request
│       └── use-cases/
│           ├── simplify-text.use-case.ts          # Use-case de simplificação
│           └── generate-questions.use-case.ts     # Use-case de perguntas frequentes
├── prompts/
│   ├── simplify-prompt.ts                         # Prompt de simplificação
│   └── questions-prompt.ts                        # Prompt de geração de perguntas
├── mock/
│   └── patients.ts                                # Perfis de pacientes mock
├── types/
│   ├── patient.ts                                 # Tipos do paciente
│   ├── simplification.ts                          # Tipos de request/response
│   └── questions.ts                               # Tipos de perguntas frequentes
└── data/
    └── ostomy-guide.ts                            # Texto médico de exemplo
```

### Componentes

- **Use-Cases**: Classes `@Injectable()` com método `exec()` que encapsulam a lógica de negócio. O `SimplifyTextUseCase` simplifica textos médicos e o `GenerateQuestionsUseCase` gera perguntas frequentes que o paciente poderia ter.

- **Controllers**: Lidam com requests HTTP e delegam para os use-cases. Não contêm lógica de negócio.

- **Services**: Integrações externas. O `LLMProvider` abstrai a comunicação com LLMs (Claude ou Mock), e o `TextExtractorService` processa uploads de PDF e TXT.

- **Prompt Builder**: Constrói prompts dinâmicos adaptados ao nível de escolaridade, literacia em saúde e idade do paciente.

### Endpoints

| Método | Rota                      | Descrição                                  |
| ------ | ------------------------- | ------------------------------------------ |
| `GET`  | `/api/health`             | Health check                               |
| `POST` | `/api/simplify`           | Simplifica texto médico com base no perfil |
| `POST` | `/api/simplify/questions` | Gera 3 perguntas frequentes sobre o texto  |

#### POST /api/simplify

**Request body:**

```json
{
  "text": "A estomia é um procedimento cirúrgico realizado quando...",
  "patientId": "patient-1",
  "glossary": true
}
```

Você pode referenciar um paciente mock por `patientId` ou enviar um `patientProfile` completo:

```json
{
  "text": "A estomia é um procedimento cirúrgico realizado quando...",
  "patientProfile": {
    "id": "custom-1",
    "name": "João",
    "age": 72,
    "educationLevel": "fundamental",
    "healthLiteracyLevel": "low",
    "medicalCondition": "colostomia"
  },
  "glossary": true
}
```

Também é possível enviar um arquivo (PDF ou TXT) via `multipart/form-data` no campo `file`, ao invés do campo `text`.

**Response:**

```json
{
  "original": "A estomia é um procedimento cirúrgico...",
  "simplified": "A estomia é uma cirurgia feita para criar...",
  "glossary": [
    { "term": "Estomia", "definition": "abertura feita por cirurgia..." }
  ],
  "metadata": {
    "model": "claude",
    "processingTimeMs": 1523,
    "patientProfile": { "..." }
  }
}
```

#### POST /api/simplify/questions

Gera 3 perguntas que o paciente provavelmente teria sobre o texto, com respostas adaptadas ao seu perfil. Ideal para exibir como botões em uma interface de chat.

**Request body** (mesmo formato do `/api/simplify`):

```json
{
  "text": "A estomia é um procedimento cirúrgico realizado quando...",
  "patientId": "patient-1"
}
```

**Response:**

```json
{
  "questions": [
    {
      "question": "Dói quando toca no estoma?",
      "answer": "Não. O estoma é vermelho e úmido, mas não dói quando você toca nele..."
    },
    {
      "question": "Preciso usar a bolsa o tempo todo?",
      "answer": "Sim, você precisa usar a bolsa coletora sempre..."
    },
    {
      "question": "Posso tomar banho normalmente?",
      "answer": "Sim! Você pode tomar banho normalmente..."
    }
  ],
  "metadata": {
    "model": "claude",
    "processingTimeMs": 1200,
    "patientProfile": { "..." }
  }
}
```

## Como Executar

### Pré-requisitos

- Node >= 18
- npm >= 9

### Instalação

```bash
npm install
```

### Configuração

```bash
cp .env.example .env
```

Edite o `.env`:

```env
ANTHROPIC_API_KEY=your-api-key-here   # Obrigatório apenas para o provider Claude
PORT=3000                              # Porta do servidor (padrão: 3000)
LLM_PROVIDER=mock                      # "mock" ou "claude"
```

### Desenvolvimento

```bash
npm run dev
```

O provider mock permite rodar e testar a API sem uma chave da Anthropic. Para usar o Claude, defina `LLM_PROVIDER=claude` e configure sua `ANTHROPIC_API_KEY`.

### Build e Produção

```bash
npm run build
npm start
```

## Extensão

### Adicionar um novo LLM Provider

1. Crie uma classe implementando `LLMProvider` em `src/core/services/llm/`
2. Registre no factory em `src/core/services/llm/llm.module.ts`
3. Adicione a opção correspondente no `.env`

### Adicionar novos textos médicos

Adicione novas seções em `src/data/`, seguindo a estrutura de `ostomy-guide.ts` com campos `id`, `title` e `content`.

### Ajustar prompts de simplificação

Edite `src/prompts/simplify-prompt.ts` para modificar como o LLM adapta o texto com base no perfil do paciente.
