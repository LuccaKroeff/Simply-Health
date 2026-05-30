# Consolidação da Avaliação — SimplyHealth TCC

**Atualizado em:** 30/05/2026
**Total de casos:** 18 (3 perfis × 2 materiais × 3 rodadas)
**Modelo usado:** gemini-2.5-flash-lite (todas as rodadas)
**Indicador automático:** Flesch-PT (básico)
**Rodadas:** R1 = 15h53–15h58 · R2 = 17h19–17h21 · R3 = 19h24–19h27

> Todos os perfis são simulados. Nenhum dado real de paciente foi utilizado.
> O Flesch-PT avalia apenas aspectos linguísticos e não valida precisão médica.

---

## 1. Tabela consolidada de legibilidade

### Estomia — guia de atenção à saúde da pessoa com estomia (Flesch original: 9,2)

| Caso | Perfil | Flesch simpl. | Classif. | Variação | Glossário |
|------|--------|--------------|----------|----------|-----------|
| E-Ana-R1 | Ana, 30a, Superior/Saúde | 14,3 | Muito difícil | +5,1 | Sim (4 termos) |
| E-Ana-R2 | Ana, 30a, Superior/Saúde | 14,0 | Muito difícil | +4,8 | Sim (4 termos) |
| E-Ana-R3 | Ana, 30a, Superior/Saúde | 14,1 | Muito difícil | +4,9 | Sim (4 termos) |
| **Média E-Ana** | | **14,1** | Muito difícil | **+4,9** | 3/3 |
| E-Carlos-R1 | Carlos, 45a, Médio/Negócios, Diabetes | 21,1 | Muito difícil | +11,9 | Não |
| E-Carlos-R2 | Carlos, 45a, Médio/Negócios, Diabetes | 21,6 | Muito difícil | +12,4 | Sim (4 termos) |
| E-Carlos-R3 | Carlos, 45a, Médio/Negócios, Diabetes | 20,6 | Muito difícil | +11,4 | Sim (2 termos) |
| **Média E-Carlos** | | **21,1** | Muito difícil | **+11,9** | 2/3 |
| E-Maria-R1 | Maria, 68a, Fundamental/Outra, Cardiovascular | 29,8 | **Pouco difícil** | +20,6 | Não |
| E-Maria-R2 | Maria, 68a, Fundamental/Outra, Cardiovascular | 31,6 | **Pouco difícil** | +22,4 | Sim (4 termos) |
| E-Maria-R3 | Maria, 68a, Fundamental/Outra, Cardiovascular | 28,8 | **Pouco difícil** | +19,6 | Sim (4 termos) |
| **Média E-Maria** | | **30,1** | **Pouco difícil** | **+20,9** | 2/3 |

### Diabetes — manual de cuidados com os pés (Flesch original: 19,7)

| Caso | Perfil | Flesch simpl. | Classif. | Variação | Glossário |
|------|--------|--------------|----------|----------|-----------|
| D-Ana-R1 | Ana, 30a, Superior/Saúde | 20,3 | Muito difícil | +0,6 | Não |
| D-Ana-R2 | Ana, 30a, Superior/Saúde | 19,6 | Muito difícil | −0,1 | Sim (4 termos) |
| D-Ana-R3 | Ana, 30a, Superior/Saúde | 18,4 | Muito difícil | **−1,3** | Não |
| **Média D-Ana** | | **19,4** | Muito difícil | **−0,3** | 1/3 |
| D-Carlos-R1 | Carlos, 45a, Médio/Negócios, Diabetes | 22,7 | Muito difícil | +3,0 | Não |
| D-Carlos-R2 | Carlos, 45a, Médio/Negócios, Diabetes | 22,5 | Muito difícil | +2,8 | Sim (4 termos) |
| D-Carlos-R3 | Carlos, 45a, Médio/Negócios, Diabetes | 22,9 | Muito difícil | +3,2 | Não |
| **Média D-Carlos** | | **22,7** | Muito difícil | **+3,0** | 1/3 |
| D-Maria-R1 | Maria, 68a, Fundamental/Outra, Cardiovascular | 33,0 | **Pouco difícil** | +13,3 | Sim (4 termos) |
| D-Maria-R2 | Maria, 68a, Fundamental/Outra, Cardiovascular | 32,7 | **Pouco difícil** | +13,0 | Não |
| D-Maria-R3 | Maria, 68a, Fundamental/Outra, Cardiovascular | 33,1 | **Pouco difícil** | +13,4 | Sim (3 termos) |
| **Média D-Maria** | | **32,9** | **Pouco difícil** | **+13,2** | 2/3 |

### Resumo por perfil (médias das 3 rodadas)

| Perfil | Escolaridade | Estomia — ganho médio | Diabetes — ganho médio | Padrão |
|--------|-------------|----------------------|----------------------|--------|
| Ana Souza | Superior/Saúde | +4,9 | −0,3 | Mínimo ou nulo |
| Carlos Oliveira | Médio/Negócios | +11,9 | +3,0 | Intermediário |
| Maria Silva | Fundamental/Outra | +20,9 | +13,2 | Alto, com mudança de classificação |

---

## 2. Tabela consolidada de preservação das informações essenciais

*Análise preliminar. Casos não lidos integralmente são marcados como "A verificar". Revisão manual é necessária em todos.*

| Caso | Inf. nova aparente | Omissão crítica | Dose/freq. | Segurança preservada | Sentido preservado | Adequação ao perfil | Observações | Revisão? |
|------|-------------------|----------------|-----------|---------------------|--------------------|--------------------|-----------|---------| 
| E-Ana-R1 | Não identificada | Não identificada | N/A | Sim | Sim | Adequado | Glossário gerado. Perguntas técnicas. | Sim |
| E-Ana-R2 | A verificar | A verificar | N/A | A verificar | A verificar | A verificar | Glossário gerado (Estoma, Ureter, Libido, Dermatite). | **Sim** |
| E-Ana-R3 | A verificar | A verificar | N/A | A verificar | A verificar | A verificar | Glossário gerado (Estoma, Ureter, Dermatite, Efluente). | **Sim** |
| E-Carlos-R1 | Não identificada | Não identificada | N/A | Sim | Sim | Adequado | Glossário não gerado. Perguntas cotidianas. | **Sim** |
| E-Carlos-R2 | A verificar | A verificar | N/A | A verificar | A verificar | A verificar | Glossário gerado (Estoma, Colostomia, Ileostomia, Urostomia). | **Sim** |
| E-Carlos-R3 | A verificar | A verificar | N/A | A verificar | A verificar | A verificar | Glossário parcial (2 termos: Ureter, Dermatite). FAQ: pergunta sobre estoma roxo (alerta). | **Sim** |
| E-Maria-R1 | "Olá, Maria!" — saudação ausente no original | Não identificada | N/A | Sim | Sim | Bem adequado | Analogias, frases curtas. Glossário não gerado. | **Sim** |
| E-Maria-R2 | A verificar | A verificar | N/A | A verificar | A verificar | A verificar | Maior ganho do conjunto (+22,4). Glossário gerado. | **Sim** |
| E-Maria-R3 | A verificar | A verificar | N/A | A verificar | A verificar | A verificar | Glossário gerado com termos operacionais (Clamp, Adesivo antialérgico). | **Sim** |
| D-Ana-R1 | Não identificada | Não identificada | Verificar creme | Sim | Sim | Adequado | Glossário não gerado. Perguntas clínicas. | **Sim** |
| D-Ana-R2 | "Anote quantos toques" — instrução ausente no original | A verificar | A verificar | A verificar | A verificar | A verificar | Glossário gerado. Flesch: −0,1. | **Sim — prioritário** |
| D-Ana-R3 | A verificar | A verificar | Verificar creme | A verificar | A verificar | A verificar | Glossário não gerado. Flesch: −1,3 (maior desvio negativo). Pergunta gerada é técnica/analítica. | **Sim — prioritário** |
| D-Carlos-R1 | Não identificada | Não identificada | N/A | Sim | Sim | Adequado | Glossário não gerado. | **Sim** |
| D-Carlos-R2 | A verificar | A verificar | N/A | A verificar | A verificar | A verificar | Glossário gerado. | **Sim** |
| D-Carlos-R3 | A verificar | A verificar | N/A | A verificar | A verificar | A verificar | Glossário não gerado. FAQ: pergunta sobre cuidados diários. | **Sim** |
| D-Maria-R1 | Não identificada | Não identificada | N/A | Sim | Sim | Bem adequado | Glossário gerado. Analogias. | Sim |
| D-Maria-R2 | A verificar | A verificar | N/A | A verificar | A verificar | A verificar | Glossário não gerado. | **Sim** |
| D-Maria-R3 | A verificar | A verificar | N/A | A verificar | A verificar | A verificar | Glossário gerado (3 termos: Neuropatia diabética, Artrose, Artrite). | **Sim** |

---

## 3. Síntese quantitativa

| Indicador | R1 (6 casos) | R2 (6 casos) | R3 (6 casos) | Total (18 casos) |
|-----------|-------------|-------------|-------------|-----------------|
| Média Flesch-PT original | 14,5 | 14,5 | 14,5 | **14,5** |
| Média Flesch-PT simplificado | 23,5 | 23,6 | 23,0 | **23,4** |
| Ganho médio de Flesch-PT | +9,1 | +9,2 | +8,5 | **+8,9** |
| Maior ganho | +20,6 | +22,4 | +19,6 | **+22,4** (E-Maria-R2) |
| Menor ganho | +0,6 | −0,1 | **−1,3** | **−1,3** (D-Ana-R3) |
| Casos com ganho positivo | 6/6 | 5/6 | 5/6 | **16/18 (89%)** |
| Casos com ganho nulo ou negativo | 0/6 | 1/6 | 1/6 | **2/18** (ambos D-Ana) |
| Casos com mudança de classificação | 2/6 | 2/6 | 2/6 | **6/18** (sempre E-Maria e D-Maria) |
| Aprovados no guardrail (1ª tentativa) | 6/6 | 6/6 | 6/6 | **18/18 (100%)** |
| Fallback ativado | 0 | 0 | 0 | **0** |
| Casos com glossário gerado | 2/6 (33%) | 5/6 (83%) | 4/6 (67%) | **11/18 (61%)** |
| Casos com FAQ gerado | 6/6 | 6/6 | 6/6 | **18/18 (100%)** |

### Estabilidade entre rodadas (desvio máximo por par)

| Par perfil/material | Ganhos R1/R2/R3 | Desvio máximo | Estabilidade |
|--------------------|-----------------|--------------|--------------|
| E-Ana | +5,1 / +4,8 / +4,9 | 0,3 pts | Alta |
| E-Carlos | +11,9 / +12,4 / +11,4 | 1,0 pts | Alta |
| E-Maria | +20,6 / +22,4 / +19,6 | 2,8 pts | Alta |
| D-Ana | +0,6 / −0,1 / −1,3 | 1,9 pts | Baixa (tendência negativa) |
| D-Carlos | +3,0 / +2,8 / +3,2 | 0,4 pts | Muito alta |
| D-Maria | +13,3 / +13,0 / +13,4 | 0,4 pts | Muito alta |

---

## 4. Síntese qualitativa

### Tendência geral e consistência

Em 16 dos 18 casos, o Flesch-PT das versões simplificadas foi superior ao original. O ganho médio global foi de +8,9 pontos. A consistência entre as três rodadas independentes é o achado mais relevante do conjunto: cinco dos seis pares perfil/material apresentaram desvio máximo inferior a 3 pontos entre rodadas, sugerindo estabilidade razoável do pipeline para esses textos e perfis. O par D-Carlos foi o mais estável de todos (desvio máximo de 0,4 pontos ao longo de três execuções independentes).

### Gradiente por perfil — confirmado nas três rodadas

O padrão de diferenciação por perfil se replicou sem exceção ao longo das 18 execuções. Maria Silva (Fundamental/sem área de saúde) obteve os maiores ganhos em todos os seis casos, com mudança de classificação em todas as rodadas para ambos os materiais. Carlos Oliveira (Médio/Negócios) ficou consistentemente no nível intermediário. Ana Souza (Superior/Saúde) produziu os menores ganhos em todos os seis casos. Esse gradiente tri-nível, reproduzido em três rodadas independentes, é a evidência mais robusta de que a personalização por perfil operou de forma efetiva no recorte avaliado.

### Caso D-Ana: padrão de estabilidade em baixa complexidade

O par D-Ana (Superior/Saúde, diabetes) é o único com média de ganho negativa (−0,3) e variações −0,1, +0,6 e −1,3 nas três rodadas — todas dentro de uma faixa que indica ausência de simplificação linguística significativa. Esse resultado não representa falha: para uma profissional de saúde lendo um texto já relativamente mais acessível (Flesch 19,7), a solução produziu textos com complexidade semelhante ou ligeiramente superior, preservando terminologia técnica. É um comportamento coerente com o design da solução, e ao mesmo tempo um caso ilustrativo de limitação do Flesch-PT como indicador único: o índice não captura ganhos em organização, clareza estrutural ou adequação da linguagem ao leitor.

### Glossário: variabilidade persistente

A taxa de geração de glossário variou entre rodadas (33% → 83% → 67%), sem correlação clara com perfil ou material. E-Carlos-R3 gerou apenas 2 termos contra o limite de 4 previsto no prompt. Essa variabilidade é atribuída à natureza estocástica do modelo — o pipeline não garante a presença do glossário em cada execução. Para o TCC, este comportamento pode ser apresentado como limitação estrutural da dependência de formato de resposta LLM.

### Guardrails e estabilidade do pipeline

Todas as 18 execuções foram aprovadas pelo guardrail na primeira tentativa, sem nenhum fallback. Esse resultado, replicado em três rodadas independentes com dois materiais e três perfis distintos, indica que o pipeline não gerou, de forma sistemática, alterações críticas que o guardrail detectaria para textos informativos sem prescrições de dose. A revisão humana permanece necessária para confirmar precisão clínica.
