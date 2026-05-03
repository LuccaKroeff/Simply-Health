export interface FileInput {
  buffer: Buffer
  mimeType: string
}

export interface LabeledImage {
  id: string
  buffer: Buffer
  mimeType: string
}

export interface LLMInput {
  text: string
  file?: FileInput
  labeledImages?: LabeledImage[]
}

export interface LLMProvider {
  readonly name: string
  complete(input: LLMInput, systemPrompt: string): Promise<string>
}
