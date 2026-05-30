# Consolidação da Avaliação — SimplyHealth TCC

**Atualizado em:** 30/05/2026
**Total de casos:** 12 (3 perfis × 2 materiais × 2 rodadas)
**Modelo usado:** gemini-2.5-flash-lite (todas as rodadas)
**Indicador automático:** Flesch-PT (básico)

> Todos os perfis são simulados. Nenhum dado real de paciente foi utilizado.
> O Flesch-PT avalia apenas aspectos linguísticos e não valida precisão médica.

---

## 1. Tabela consolidada de legibilidade

Os casos são identificados por perfil, material e rodada (R1 = 15h53–15h58, R2 = 17h19–17h21).

| Caso | Material | Perfil | Flesch-PT original | Classif. original | Flesch-PT simplificado | Classif. simplificada | Variação | Interpretação |
|------|----------|--------|--------------------|-------------------|------------------------|-----------------------|----------|---------------|
| E-Ana-R1 | estomia.pdf | Ana, 30a, Superior/Saúde | 9,2 | Muito difícil | 14,3 | Muito difícil | **+5,1** | Melhora modesta; adequada para literacia clínica. |
| E-Ana-R2 | estomia.pdf | Ana, 30a, Superior/Saúde | 9,2 | Muito difícil | 14,0 | Muito difícil | **+4,8** | Resultado muito similar à R1. Consistência entre rodadas. |
| E-Carlos-R1 | estomia.pdf | Carlos, 45a, Médio/Negócios, Diabetes | 9,2 | Muito difícil | 21,1 | Muito difícil | **+11,9** | Melhora intermediária. |
| E-Carlos-R2 | estomia.pdf | Carlos, 45a, Médio/Negócios, Diabetes | 9,2 | Muito difícil | 21,6 | Muito difícil | **+12,4** | Praticamente idêntico à R1. Alta consistência. |
| E-Maria-R1 | estomia.pdf | Maria, 68a, Fundamental/Outra, Cardiovascular | 9,2 | Muito difícil | 29,8 | **Pouco difícil** | **+20,6** | Mudança de classificação. Simplificação agressiva. |
| E-Maria-R2 | estomia.pdf | Maria, 68a, Fundamental/Outra, Cardiovascular | 9,2 | Muito difícil | 31,6 | **Pouco difícil** | **+22,4** | Maior ganho de todo o conjunto. Mudança de classificação confirmada. |
| D-Ana-R1 | diabetes.pdf | Ana, 30a, Superior/Saúde | 19,7 | Muito difícil | 20,3 | Muito difícil | **+0,6** | Ganho mínimo; simplificação leve para alto letramento. |
| D-Ana-R2 | diabetes.pdf | Ana, 30a, Superior/Saúde | 19,7 | Muito difícil | 19,6 | Muito difícil | **−0,1** | Único caso com variação negativa. Resultado essencialmente estável. |
| D-Carlos-R1 | diabetes.pdf | Carlos, 45a, Médio/Negócios, Diabetes | 19,7 | Muito difícil | 22,7 | Muito difícil | **+3,0** | Melhora pequena. |
| D-Carlos-R2 | diabetes.pdf | Carlos, 45a, Médio/Negócios, Diabetes | 19,7 | Muito difícil | 22,5 | Muito difícil | **+2,8** | Consistente com R1. |
| D-Maria-R1 | diabetes.pdf | Maria, 68a, Fundamental/Outra, Cardiovascular | 19,7 | Muito difícil | 33,0 | **Pouco difícil** | **+13,3** | Mudança de classificação. |
| D-Maria-R2 | diabetes.pdf | Maria, 68a, Fundamental/Outra, Cardiovascular | 19,7 | Muito difícil | 32,7 | **Pouco difícil** | **+13,0** | Muito próximo à R1. Mudança de classificação confirmada. |

### Médias por perfil (entre rodadas, mesmo material)

| Perfil | Material | Flesch orig. | Flesch simpl. médio | Ganho médio |
|--------|----------|-------------|---------------------|-------------|
| Ana (Superior/Saúde) | estomia.pdf | 9,2 | 14,2 | +5,0 |
| Carlos (Médio/Negócios) | estomia.pdf | 9,2 | 21,4 | +12,2 |
| Maria (Fundamental/Outra) | estomia.pdf | 9,2 | 30,7 | +21,5 |
| Ana (Superior/Saúde) | diabetes.pdf | 19,7 | 20,0 | +0,3 |
| Carlos (Médio/Negócios) | diabetes.pdf | 19,7 | 22,6 | +2,9 |
| Maria (Fundamental/Outra) | diabetes.pdf | 19,7 | 32,9 | +13,2 |

---

## 2. Tabela consolidada de preservação das informações essenciais

*Análise preliminar com base na leitura dos textos. Os casos da R2 não tiveram leitura linha a linha do texto simplificado — revisão manual é necessária em todos.*

| Caso | Inf. nova aparente | Omissão crítica aparente | Alteração dose/freq. | Alerta/segurança preservado | Sentido geral preservado | Adequação ao perfil | Observações | Revisão manual? |
|------|-------------------|--------------------------|---------------------|-----------------------------|--------------------------|---------------------|-------------|-----------------|
| E-Ana-R1 | Não identificada | Não identificada | N/A | Sim | Sim | Adequado — terminologia técnica mantida, glossário gerado (4 termos) | Perguntas de tom clínico. | Sim |
| E-Ana-R2 | Não verificada | Não verificada | N/A | A verificar | A verificar | A verificar | Glossário gerado (4 termos: Estoma, Ureter, Libido, Dermatite). Flesch muito próximo à R1. | **Sim** |
| E-Carlos-R1 | Não identificada | Não identificada | N/A | Sim | Sim | Adequado — listas, linguagem acessível | Glossário solicitado mas não gerado na R1. Perguntas cotidianas. | **Sim** — ausência de glossário |
| E-Carlos-R2 | Não verificada | Não verificada | N/A | A verificar | A verificar | A verificar | Glossário gerado na R2 (4 termos: Estoma, Colostomia, Ileostomia, Urostomia). | **Sim** |
| E-Maria-R1 | "Olá, Maria!" — saudação não presente no original | Não identificada | N/A | Sim | Sim | Bem adequado — analogias, frases curtas, endereçamento direto | Maior ganho da R1. Glossário não gerado. | **Sim** |
| E-Maria-R2 | Não verificada | Não verificada | N/A | A verificar | A verificar | A verificar | Maior ganho de todo o conjunto (+22,4). Glossário gerado (4 termos: Estoma, Colostomia, Ileostomia, Urostomia). | **Sim** |
| D-Ana-R1 | Não identificada | Não identificada | Verificar instrução do creme | Sim | Sim | Adequado — linguagem técnica, perguntas de alto nível | Glossário não gerado. Menor ganho positivo. | **Sim** — instrução do creme |
| D-Ana-R2 | Não verificada | Não verificada | Verificar instrução do creme | A verificar | A verificar | A verificar | Único caso com variação negativa (−0,1). Glossário gerado (4 termos: Neuropatia diabética, Glicemia, Edema, Micose). Verificar se o texto sofreu alguma redução indevida. | **Sim — prioritário** |
| D-Carlos-R1 | Não identificada | Não identificada | N/A | Sim | Sim | Adequado | Glossário não gerado. | **Sim** |
| D-Carlos-R2 | Não verificada | Não verificada | N/A | A verificar | A verificar | A verificar | Glossário gerado (4 termos: Neuropatia diabética, Artrose, Artrite reumatoide, Soro Fisiológico). | **Sim** |
| D-Maria-R1 | Não identificada | Não identificada | N/A | Sim | Sim | Bem adequado — analogias, linguagem simples | Glossário gerado (4 termos). Perguntas diretas. | Sim |
| D-Maria-R2 | Não verificada | Não verificada | N/A | A verificar | A verificar | A verificar | Glossário não gerado na R2 (único caso sem glossário nesta rodada). Flesch muito próximo à R1. | **Sim** |

---

## 3. Síntese quantitativa

| Indicador | Rodada 1 (6 casos) | Rodada 2 (6 casos) | Total (12 casos) |
|-----------|--------------------|--------------------|-----------------|
| Média Flesch-PT original | 14,5 | 14,5 | **14,5** |
| Média Flesch-PT simplificado | 23,5 | 23,6 | **23,6** |
| Ganho médio de Flesch-PT | +9,1 | +9,2 | **+9,1** |
| Maior ganho | +20,6 (E-Maria-R1) | +22,4 (E-Maria-R2) | **+22,4** |
| Menor ganho | +0,6 (D-Ana-R1) | −0,1 (D-Ana-R2) | **−0,1** |
| Casos com aumento de legibilidade | 6/6 (100%) | 5/6 (83%) | **11/12 (92%)** |
| Casos com mudança de classificação | 2/6 (E-Maria, D-Maria) | 2/6 (E-Maria, D-Maria) | **4/12** |
| Casos aprovados no guardrail (1ª tentativa) | 6/6 | 6/6 | **12/12 (100%)** |
| Casos com fallback | 0 | 0 | **0** |
| Casos com glossário gerado | 2/6 | 5/6 | **7/12** |
| Casos com FAQ gerado | 6/6 | 6/6 | **12/12** |

> Nota sobre médias: os textos originais de estomia (Flesch 9,2) e diabetes (Flesch 19,7) são os mesmos nas duas rodadas. A média de 14,5 representa a média ponderada entre os dois materiais.

---

## 4. Síntese qualitativa inicial

### Tendência de aumento de legibilidade e consistência entre rodadas

Em 11 dos 12 casos, o Flesch-PT das versões simplificadas foi igual ou superior ao original. O caso D-Ana-R2 apresentou variação de −0,1 ponto — valor dentro da margem de variação estocástica do modelo e do próprio índice, e não representativo de regressão real. A consistência entre as rodadas é o achado mais relevante desta segunda etapa: os pares com mesmo perfil e material produziram Flesch-PT muito próximos (variação típica de 0,2 a 1,8 pontos), sugerindo estabilidade razoável das saídas para estes textos e perfis. A dupla E-Maria manteve ganhos acima de 20 pontos nas duas rodadas, e a dupla D-Maria ficou acima de 13 pontos em ambas — resultados robustos.

### Diferenças entre perfis

O gradiente por perfil se confirmou nas duas rodadas sem exceção. O perfil de Maria Silva (Fundamental/sem área de saúde) gerou as maiores variações positivas de Flesch-PT em todos os quatro casos avaliados, com mudança de classificação em todos eles ("Muito difícil" → "Pouco difícil"). O perfil de Ana Souza (Superior/Saúde) gerou as menores variações em todos os quatro casos, com dois deles apresentando ganhos abaixo de 1 ponto. Essa replicação do gradiente nas duas rodadas independentes reforça que a diferenciação por perfil foi operacionalmente efetiva no recorte avaliado.

### Glossário: melhora notável na segunda rodada

Na Rodada 1, o glossário foi gerado em apenas 2 dos 6 casos (33%), apesar de solicitado em todos. Na Rodada 2, foi gerado em 5 dos 6 casos (83%). Essa variação é provavelmente atribuível à natureza estocástica do modelo — não houve alteração de código ou prompt entre as rodadas. O único caso sem glossário na R2 foi D-Maria-R2. Os termos gerados foram consistentes com o contexto de cada material e perfil: termos mais clínicos para Ana (Neuropatia diabética, Glicemia) e mais básicos para Carlos e Maria (Artrose, Soro Fisiológico, Estoma).

### Guardrails e estabilidade do pipeline

Todos os 12 casos foram aprovados pelo guardrail na primeira tentativa, sem nenhum fallback. Esse resultado, replicado nas duas rodadas, indica que o texto dos guias utilizados (informativo, sem prescrições de dose) não gerou conflito com os critérios de fidelidade do guardrail. Isso não substitui revisão humana para confirmar precisão clínica, mas é um indicador positivo de estabilidade do pipeline.

### Pontos que demandam verificação manual

O caso D-Ana-R2 é prioritário: variação negativa (−0,1) com glossário gerado, sugerindo que o texto simplificado pode ter mantido densidade técnica próxima ao original — cabe verificar se houve omissão ou se a similaridade é intencional dado o perfil. Os casos E-Maria de ambas as rodadas devem ter a saudação personalizada ("Olá, Maria!") e o tom pessoal revisados para confirmar que não houve introdução de informação nova. Em 5 dos 12 casos o glossário não foi gerado mesmo com a opção ativada, o que pode impactar a compreensão de termos técnicos preservados no corpo do texto (ex.: "ileostomia", "neuropatia"). Todos os 12 casos devem ter instruções de segurança verificadas linha a linha por revisor com conhecimento clínico.
