# Exemplos Recomendados para a Dissertação

**Base:** arquivos em evaluation-results — 19 execuções de 31/05/2026
**Trechos:** extraídos diretamente dos arquivos .md gerados pela solução
**Modelo:** gemini-2.5-flash-lite · Temperatura: 0.3

---

## Exemplos recomendados para a dissertação

---

### Exemplo 1 — Gradiente de legibilidade: mesmo trecho, três perfis (estomia)

- **Arquivos:** 12-54-35-estomia-ana-souza · 12-53-55-estomia-carlos-oliveira · 12-54-51-estomia-maria-silva
- **Perfis:** Ana (Superior/Saúde) · Carlos (Médio/Negócios) · Maria (Fundamental)
- **Tipo:** Texto simplificado — abertura e definição de estoma

**Trecho original:**
> "A estomia é um procedimento cirúrgico realizado quando é preciso construir um novo trajeto para eliminar a urina e as fezes. O estoma é vermelho vivo, úmido e não dói ao ser tocado, mas pode ocorrer um pequeno sangramento, devido aos vasos sanguíneos."

**Ana — exec 1 (Flesch: 9,2 → 14,2 · +5,0):**
> "Estomia é um procedimento cirúrgico que cria um novo caminho para a saída de urina e fezes do corpo. O estoma (a abertura criada) é vermelho vivo, úmido e não causa dor ao toque. Pode haver um pequeno sangramento devido aos vasos sanguíneos."

**Carlos — exec 1 (Flesch: 9,2 → 24,2 · +15,0):**
> "Carlos, este guia foi feito para te ajudar a entender e cuidar da sua estomia.
>
> Estomia é uma cirurgia para criar um novo caminho para sair a urina ou as fezes do seu corpo. O estoma é a abertura que fica visível na barriga. Ele é vermelho vivo, úmido e não dói quando tocado."

**Maria — exec 1 (Flesch: 9,2 → 31,4 · +22,2 · aprovada na 2ª tentativa):**
> "Olá, Maria! Cuidar de você é muito importante, e este guia foi feito para te ajudar a entender melhor sobre a estomia e como cuidar de você no dia a dia.
>
> Estomia é o nome de uma cirurgia que cria um novo caminho para o xixi ou as fezes saírem do corpo. O lugar onde isso acontece se chama estoma. Ele é vermelho vivo, parece molhadinho e não dói quando você toca."

**Por que usar:**
O gradiente de adaptação é visível na comparação direta. Para Ana, "procedimento cirúrgico" e "vasos sanguíneos" são mantidos. Para Carlos, "procedimento cirúrgico" vira "cirurgia" e aparece uma saudação personalizada. Para Maria, "procedimento cirúrgico" vira "uma cirurgia", "vasos sanguíneos" desaparecem, "vermelho vivo" vira "vermelho vivo, parece molhadinho" e a explicação usa "o xixi ou as fezes". O padrão se manteve nas três execuções de cada perfil.

**Análise:**
A negação clínica ("não dói ao toque") é preservada nos três. A informação do sangramento foi mantida em Ana e Carlos; em Maria o trecho correspondente não está na abertura, mas pode estar no corpo do texto — verificação necessária. Adequação ao perfil: alta nos três casos. Nota: Ana não recebe saudação personalizada, Carlos e Maria recebem — elemento não presente no original para Carlos e Maria.

**Seção sugerida:** Adaptação ao perfil · Resultados de legibilidade

---

### Exemplo 2 — Instrução de segurança preservada com vocabulário adaptado (estomia)

- **Arquivos:** 12-54-35-estomia-ana-souza · 12-53-55-estomia-carlos-oliveira · 12-54-51-estomia-maria-silva
- **Tipo:** Texto simplificado — instrução restritiva

**Trecho original:**
> "Não utilize substâncias como álcool, benzina, colônias, tintura de benjoim, mercúrio, merthiolate, pomadas e cremes. Estes produtos podem ressecar a pele, causar ferimentos e reações alérgicas, além de impedir a aderência do coletor."

**Ana:**
> "**Não use** álcool, benzina, colônias, tintura de benjoim, mercúrio, merthiolate, pomadas e cremes. Esses produtos podem ressecar a pele, causar **ferimentos, reações alérgicas** e impedir que o coletor cole bem, causando vazamentos."

**Carlos:**
> "**Não use:** Álcool, benzina, colônias, tintura de benjoim, mercúrio, merthiolate, pomadas e cremes. Eles podem ressecar a pele, causar **feridas e alergias**, além de fazer a bolsa descolar e vazar."

**Maria:**
> "**Não use** álcool, benzina, colônias, tintura de benjoim, mercúrio, merthiolate, pomadas e cremes. Esses produtos podem ressecar a pele, causar **machucados e alergias**, além de fazer a bolsa não grudar direito, podendo vazar."

**Por que usar:**
A proibição é preservada nos três perfis: negação "não use" mantida, lista de substâncias idêntica ao original, incluindo "tintura de benjoim". A principal diferença está no vocabulário para descrever os efeitos: "ferimentos, reações alérgicas" (Ana) → "feridas e alergias" (Carlos) → "machucados e alergias" (Maria). A consequência para o coletor também se adapta: "impedir que o coletor cole bem" → "fazer a bolsa descolar" → "fazer a bolsa não grudar direito".

**Análise:**
Instrução de segurança preservada em todos os perfis. A substância "tintura de benjoim" — a mesma cujo erro de substituição foi detectado pelo guardrail em outra execução — aparece corretamente nos três textos aprovados desta execução. Adequação: alta.

**Seção sugerida:** Preservação das informações essenciais · Adaptação ao perfil

---

### Exemplo 3 — FAQ como espelho do perfil (estomia)

- **Arquivos:** 12-54-35-estomia-ana-souza · 12-53-55-estomia-carlos-oliveira · 12-54-51-estomia-maria-silva
- **Tipo:** Primeira pergunta das perguntas frequentes

**Ana (Superior/Saúde) — pergunta técnica/analítica:**
> "Tenho uma colostomia ascendente e tenho notado que minhas fezes estão mais pastosas. Isso é normal, considerando que o guia menciona que elas podem ser semi-líquidas no início?"
>
> R: "Sim, é esperado que com a adaptação do seu organismo, as fezes de uma colostomia ascendente, que inicialmente podem ser semi-líquidas, tornem-se pastosas. A adaptação do sistema digestivo ao novo trajeto é um processo gradual."

**Carlos (Médio/Negócios) — pergunta prática:**
> "Doutor, meu estoma é vermelho vivo e úmido, mas às vezes ele sangra um pouquinho. Isso é normal?"
>
> R: "Sim, um pequeno sangramento no estoma pode ocorrer porque ele tem vasos sanguíneos. É importante que ele continue vermelho vivo e úmido, pois isso indica que está saudável."

**Maria (Fundamental) — pergunta simples e direta:**
> "O que é esse 'estoma' que o médico falou? É alguma coisa que dói?"
>
> R: "O estoma é um buraquinho que fazem na barriga para o cocô ou a urina saírem. Ele é vermelhinho e molhadinho, e não dói quando a gente toca."

**Por que usar:**
As três perguntas derivam do mesmo material. A diferença de formulação reflete o perfil: Ana formula uma pergunta clínica com terminologia técnica ("colostomia ascendente", "semi-líquidas"); Carlos faz uma pergunta prática sobre sintoma observado; Maria usa linguagem cotidiana ("buraquinho", "cocô"). O FAQ refletiu o perfil não apenas no texto simplificado, mas também na forma como as perguntas foram construídas.

**Análise:**
Todas as perguntas estão ancoradas no conteúdo do guia. A resposta para Maria usa "buraquinho" e "cocô" — vocabulário alinhado ao perfil. A resposta para Ana referencia o mecanismo fisiológico da adaptação. Incerteza: cobertura temática do FAQ não verificada integralmente.

**Seção sugerida:** Adaptação ao perfil · Discussão (saídas complementares)

---

### Exemplo 4 — Glossário adaptado ao perfil (diabetes)

- **Arquivos:** 12-48-27-diabetes-ana-souza · 12-47-57-diabetes-maria-silva
- **Tipo:** Glossário

**Ana (Superior/Saúde):**
> - **Neuropatia diabética:** Danos nos nervos causados pelo diabetes, que podem afetar a sensibilidade e a força muscular.
> - **Glicemia:** Nível de açúcar (glicose) no sangue.
> - **Artrose:** Doença nas articulações que causa dor e rigidez.
> - **Artrite reumatoide:** Doença autoimune que causa inflamação nas articulações.

**Maria (Fundamental):**
> - **Neuropatia diabética:** Problema nos nervos causado pela diabetes, que pode causar fraqueza e perda de sensibilidade.
> - **Glicemia:** Quantidade de açúcar no sangue.
> - **Soro Fisiológico:** Líquido salino usado para limpar feridas e umedecer curativos.
> - **Ácido graxo essencial:** Tipo de gordura importante para a saúde da pele.

**Por que usar:**
Dois perfis, mesmo material, termos diferentes. Ana recebe termos mais técnicos: "Artrose" e "Artrite reumatoide" (condições articulares do guia). Maria recebe termos operacionais de cuidado: "Soro Fisiológico" e "Ácido graxo essencial" (usados nos procedimentos). As definições de "Neuropatia diabética" também diferem em nível de detalhe: Ana recebe "Danos nos nervos [...] que podem afetar a sensibilidade e a força muscular"; Maria recebe "Problema nos nervos [...] que pode causar fraqueza e perda de sensibilidade". Mesmo conceito, vocabulário ajustado.

**Análise:**
As definições são funcionalmente adequadas. Incerteza: definições não verificadas por especialista — o glossário não passa pelo guardrail.

**Seção sugerida:** Adaptação ao perfil · Discussão (saídas complementares · limitação: glossário sem guardrail)

---

### Exemplo 5 — Guardrail captura substituição de substância (estomia-maria-R1)

- **Arquivo:** 12-54-51-estomia-maria-silva.md · execução 1, tentativa 1 rejeitada
- **Flesch após aprovação:** 9,2 → 31,4 (+22,2)

**Trecho original:**
> "Não utilize substâncias como álcool, benzina, colônias, **tintura de benjoim**, mercúrio, merthiolate, pomadas e cremes."

**1ª tentativa — rejeitada pelo guardrail LLM:**
> "Não use álcool, benzina, colônias, **tintura de iodo**, mercúrio, merthiolate, pomadas ou cremes."

**Motivo registrado:**
> "A substância 'tintura de benjoim' foi alterada para 'tintura de iodo'. A alteração ocorreu em dois trechos do texto."

**Resultado:** aprovada na 2ª tentativa com a correção.

**Por que usar:**
O guardrail LLM identificou a substituição de uma substância específica em uma instrução de segurança — uma troca que não é óbvia (ambas são tinturas), mas que altera o termo exato presente no original. A correção ocorreu antes da entrega ao usuário. O Exemplo 2 deste documento mostra que a versão aprovada preservou "tintura de benjoim" corretamente.

**Análise:**
A detecção foi adequada. Benjoim e iodo são substâncias distintas. A aprovação na 2ª tentativa com o trecho correto confirmou o funcionamento do ciclo de rejeição e regeação. Texto aprovado verificado no Exemplo 2.

**Seção sugerida:** Preservação das informações essenciais · Discussão (guardrail LLM)

---

### Exemplo 6 — Guardrail captura instrução procedimental alterada (diabetes-ana)

- **Arquivos:** 12-48-27-diabetes-ana-souza (exec 1) · 12-50-40-diabetes-ana-souza (exec 2)
- **Mesmo erro em duas execuções independentes**

**Trecho original:**
> "Peça que algum familiar coloque o **segundo e terceiro dedos da mão** na região acima do pé para sentir o pulso (batimento)."

**Exec 1 — 1ª tentativa rejeitada (guardrail LLM):**
> "Peça para um familiar sentir o pulso (batimento) na região acima do pé, **entre o segundo e terceiro dedos da mão**."
>
> Motivo: instrução invertida — "entre os dedos" indica localização do pulso, não técnica de palpação.

**Exec 2 — 1ª tentativa rejeitada (guardrail LLM):**
> "Peça para um familiar sentir o pulso (batimento) na região acima do pé com **os dedos médio e anelar**."
>
> Motivo: dedos incorretos — original especifica indicador e médio; gerado produziu médio e anelar.

**Por que usar:**
O mesmo tipo de erro procedimental ocorreu em duas execuções independentes com o mesmo perfil e material — o que distingue variação isolada de padrão recorrente. O guardrail identificou ambos. Em um caso a frase era ambígua; no outro a troca de dedos era direta. Mostra que a verificação cobre detalhes técnicos de instruções, não apenas a presença de afirmações novas.

**Análise:**
As 2ªs tentativas de ambas as execuções foram aprovadas. Os textos aprovados não foram lidos integralmente — revisão recomendada para confirmar que a instrução correta foi preservada.

**Seção sugerida:** Preservação das informações essenciais · Discussão (guardrail e instruções procedimentais)

---

### Exemplo 7 — Guardrail captura remoção de atributo de segurança (estomia-carlos-R2)

- **Arquivo:** 12-57-19-estomia-carlos-oliveira.md · exec 2, tentativa 1 rejeitada

**Trecho original:**
> "O sistema é formado por uma bolsa que cola na pele através de um **adesivo antialérgico**."

**1ª tentativa — rejeitada pelo guardrail LLM:**
> "O sistema é formado por uma bolsa que cola na pele com um **adesivo especial**."

**Motivo registrado:**
> "A característica específica 'antialérgico' foi substituída por 'especial'. Isso suaviza uma informação de segurança relevante."

**Resultado:** aprovada na 2ª tentativa com "adesivo antialérgico" restaurado. Flesch: 9,2 → 23,9 (+14,7).

**Por que usar:**
"Antialérgico" é um atributo clinicamente relevante do adesivo — informa ao paciente uma propriedade do material. "Especial" é genérico e não carrega essa informação. O guardrail identificou a perda do atributo de segurança durante a simplificação de vocabulário.

**Seção sugerida:** Preservação das informações essenciais · Discussão (guardrail e atributos específicos)

---

### Exemplo 8 — Fallback: três rejeições consecutivas de tipos distintos (estomia-ana-R2)

- **Arquivo:** 12-56-54-estomia-ana-souza.md · exec 2, 3 tentativas, **fallback ativado**
- **Único fallback em 19 execuções (5%)**

**Tentativa 1 — rejeitada pelo guardrail LLM (alteração semântica):**
> Original: "evitar o atrito com a pele e que apareça **o conteúdo fecal** contido nela"
> Gerado: "evitar atrito com a pele e que **a bolsa** apareça"
>
> Motivo: deslocamento do objeto — não é a bolsa que não deve aparecer, é o conteúdo fecal.

**Tentativa 2 — rejeitada pelo guardrail LLM (contradição numérica):**
> Original: "esvaziada sempre que estiver [...] com **1/3** da capacidade"
> Gerado: "sempre que ela estiver **cerca da metade** (**1/3**) cheia"
>
> Motivo: "cerca da metade" (≈1/2) e "1/3" são contraditórios na mesma frase.

**Tentativa 3 — rejeitada pelo checker determinístico (negação):**
> "não usar" do original sem negação equivalente no texto gerado.

**Resultado:** fallback ativado. Re-run manual (exec 3, arquivo 12-57-56) aprovado na 1ª tentativa com Flesch +5,8.

**Por que usar:**
Único fallback do conjunto — 3 tentativas rejeitadas por camadas e motivos distintos (guardrail LLM × 2, checker determinístico × 1). A 2ª rejeição é particularmente relevante: "cerca da metade (1/3)" é uma contradição numérica sutil — o valor "1/3" está presente, mas a expressão "cerca da metade" que o precede indica outra quantidade. Esse tipo de erro passaria despercebido em leitura rápida, mas altera a instrução de uso do equipamento.

**Análise:**
Cada rejeição identificou um problema clinicamente diferente. O fallback foi o comportamento correto do sistema. O re-run subsequente foi aprovado sem rejeições, confirmando que o problema era situacional e não estrutural.

**Seção sugerida:** Discussão (arquitetura multicamada · fallback como mecanismo de segurança)

---

## Exemplos de limitação ou atenção

---

### Limitação 1 — Saudações personalizadas não presentes no original

- **Arquivos:** 12-53-55 (Carlos) · 12-54-51 (Maria) — estomia; 12-47-57 (Maria) · 12-48-05 (Carlos) — diabetes

Carlos e Maria recebem saudações personalizadas no início dos textos simplificados ("Carlos, este guia foi feito para te ajudar", "Olá, Maria!") que não estão presentes nos originais. Ana não recebe. Clinicamente inócuo, mas tecnicamente fora do escopo de simplificação fiel: são adições ao conteúdo original.

**Seção sugerida:** Discussão · Limitações

---

### Limitação 2 — D-Ana: padrão negativo em 3 execuções (diabetes)

- **Arquivos:** 12-48-27 (−3,1) · 12-50-40 (−1,6) · 12-52-16 (−0,4)

Nas três execuções do par diabetes × Ana, o Flesch-PT da versão simplificada ficou abaixo do original. Nas execuções 1 e 2, o guardrail rejeitou a 1ª tentativa (instrução dos dedos para palpação do pulso), e o texto aprovado na 2ª tentativa ainda resultou em Flesch negativo. O padrão se replicou nas três execuções independentes. Não representa falha: para profissional de saúde lendo material procedimental, a manutenção da densidade técnica é coerente com o perfil. Ilustra o limite do Flesch-PT como indicador único.

**Seção sugerida:** Discussão · Limitações do Flesch-PT

---

### Limitação 3 — Checker determinístico: 5 bloqueios por "não usar"

Em 5 dos 11 eventos de rejeição, o checker bloqueou textos onde "não usar" do original não aparecia com negação equivalente próxima no texto gerado. Em D-Carlos exec 3 (12-52-26), o mesmo problema ocorreu em duas tentativas consecutivas — o modelo continuou gerando o verbo sem negação suficientemente próxima. No fallback de Ana, foi o bloqueio da 3ª tentativa. Podem ser inversões genuínas de negação ou falsos positivos do regex quando o modelo usa "evite" fora da janela de 60 caracteres configurada.

**Seção sugerida:** Discussão · Limitações do checker determinístico

---

### Limitação 4 — Glossário sem guardrail

O glossário é gerado no mesmo prompt de simplificação, mas apenas o texto simplificado passa pelo guardrail. As definições do glossário não são verificadas automaticamente. Exemplo real: D-Ana (12-48-27) gerou "Artrite reumatoide: Doença autoimune que causa inflamação nas articulações" — definição funcionalmente adequada, mas não verificada por especialista. O glossário deve ser tratado como recurso complementar sujeito a revisão manual.

**Seção sugerida:** Discussão · Limitações

---

## Exemplos que não recomendo usar

1. **Trechos de execuções cujo texto completo não foi verificado** — citar apenas os exemplos acima (lidos diretamente) ou os dados de rejeição dos guardrails (registrados nos arquivos).
2. **Variação negativa de D-Ana como falha** — é comportamento esperado para alta literacia.
3. **Valores de Flesch isolados** — sempre combine com exemplo qualitativo.

---

## Síntese final

**5 exemplos mais fortes para o texto final:**

1. **Exemplo 1** (gradiente estomia, três perfis): comparação direta com trechos reais — núcleo da proposta.
2. **Exemplo 2** (instrução de segurança preservada): negação e lista de substâncias mantidas nos três perfis com vocabulário adaptado.
3. **Exemplo 8** (fallback): único caso de 19; três camadas distintas de rejeição; argumento central para a arquitetura multicamada.
4. **Exemplo 5** (benjoim→iodo): guardrail LLM capturando substituição de substância em instrução de segurança — argumento mais concreto da seção de guardrails.
5. **Exemplo 3** (FAQ espelho do perfil): adaptação visível também nas saídas complementares — argumento mHealth.

**Limitações mais relevantes para a Discussão:**
- **Limitação 2** (D-Ana em 3 execuções): padrão sistemático, não anedótico. Argumento para Flesch-PT como indicador insuficiente.
- **Limitação 4** (glossário sem guardrail): lacuna real na cobertura de verificação automática.
