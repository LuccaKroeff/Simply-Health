# Consolidação da Avaliação — SimplyHealth TCC

**Data:** 31/05/2026
**Modelo:** gemini-2.5-flash-lite · Temperatura de simplificação: 0.3
**Materiais avaliados:** estomia.pdf · diabetes.pdf
**Perfis simulados:** Ana Souza (Superior/Saúde) · Carlos Oliveira (Médio/Negócios/Diabetes) · Maria Silva (Fundamental/Cardiovascular)

> Nenhum dado real de paciente foi utilizado. Flesch-PT avalia aspectos linguísticos — não valida precisão médica.

---

## Estrutura das execuções

Foram planejadas **3 execuções por perfil por material**. O resultado foi:

| Material | Ana | Carlos | Maria |
|----------|-----|--------|-------|
| diabetes.pdf | 3 execuções ✓ | 3 execuções ✓ | 3 execuções ✓ |
| estomia.pdf | 3 exec. + **1 fallback (re-run imediato)** | 3 execuções ✓ | 3 execuções ✓ |

Na execução 2 de Ana/estomia, todas as 3 tentativas internas foram rejeitadas pelo guardrail, ativando o fallback. Um re-run imediato foi feito na mesma sessão (tratado como "Exec 2 re-run" / 4º retry) e aprovado. A execução 3 de todos os perfis foi realizada na sessão das 13h19.

**Total de arquivos gerados:** 19 (18 com Flesch-PT + 1 fallback)

---

## 1. Tabela consolidada de legibilidade

### diabetes.pdf — Flesch original: 19,7

| Execução | Ana (Superior/Saúde) | Carlos (Médio/Negócios) | Maria (Fundamental) |
|----------|----------------------|------------------------|-------------------|
| Exec. 1 | 16,6 (−3,1) · 2 tent. | 23,2 (+3,5) · 2 tent. | 35,0 (+15,3) · 1 tent. |
| Exec. 2 | 18,1 (−1,6) · 2 tent. | 24,7 (+5,0) · 1 tent. | 29,1 (+9,4) · 1 tent. |
| Exec. 3 | 19,3 (−0,4) · 1 tent. | 23,5 (+3,8) · 3 tent. | 37,0 (+17,3) · 2 tent. |
| **Média** | **18,0 (−1,7)** | **23,8 (+4,1)** | **33,7 (+14,0)** |
| Classif. | Muito difícil | Muito difícil | **Pouco difícil** |

### estomia.pdf — Flesch original: 9,2

| Execução | Ana (Superior/Saúde) | Carlos (Médio/Negócios) | Maria (Fundamental) |
|----------|----------------------|------------------------|-------------------|
| Exec. 1 | 14,2 (+5,0) · 1 tent. | 24,2 (+15,0) · 1 tent. | 31,4 (+22,2) · 2 tent. |
| Exec. 2 | **FALLBACK** · 3 tent. + re-run: 17,6 (+8,4) · 1 tent. | 23,9 (+14,7) · 2 tent. | 32,1 (+22,9) · 1 tent. |
| Exec. 3 | 15,0 (+5,8) · 1 tent. | 23,8 (+14,6) · 1 tent. | 30,4 (+21,2) · 1 tent. |
| **Média** (valid.) | **15,6 (+6,4)** | **24,0 (+14,8)** | **31,3 (+22,1)** |
| Classif. | Muito difícil | Muito difícil | **Pouco difícil** |

### Resumo por perfil (médias gerais)

| Perfil | Estomia — ganho médio | Diabetes — ganho médio | Observação |
|--------|----------------------|----------------------|-----------|
| Ana (Superior/Saúde) | +6,4 | −1,7 | Único perfil com média negativa em diabetes |
| Carlos (Médio/Negócios) | +14,8 | +4,1 | Consistente entre execuções |
| Maria (Fundamental) | +22,1 | +14,0 | Maior ganho · Mudança de classificação em 100% dos casos |

---

## 2. Rejeições do guardrail

**Resumo:** 11 eventos de rejeição em 19 arquivos (8 arquivos tiveram pelo menos 1 rejeição — todos nas sessões 12h, as R3 de estomia das 13h foram aprovadas na 1ª tentativa).

| Arquivo | Tent. | Fonte | Problema identificado |
|---------|-------|-------|-----------------------|
| diabetes-carlos-R1 | T1 | Determinístico | "não usar" do original sem negação equivalente no gerado |
| diabetes-ana-R1 | T1 | LLM | Instrução de palpação do pulso alterada: "entre os dedos" em vez de "com os dedos" |
| diabetes-ana-R2 | T1 | LLM | Instrução de palpação alterada: "dedos médio e anelar" em vez de "indicador e médio" |
| diabetes-maria-R3 | T1 | Determinístico | "não usar" sem negação equivalente |
| diabetes-carlos-R3 | T1 | Determinístico | "não usar" sem negação equivalente |
| diabetes-carlos-R3 | T2 | Determinístico | Mesmo problema na 2ª tentativa |
| estomia-maria-R1 | T1 | LLM | "tintura de benjoim" substituída por "tintura de iodo" em 2 trechos |
| estomia-ana-R2 | T1 | LLM | Sentido alterado na seção vida sexual: "conteúdo fecal" → "bolsa" |
| estomia-ana-R2 | T2 | LLM | Contradição numérica: "cerca da metade (1/3)" — 1/2 ≠ 1/3 |
| estomia-ana-R2 | T3 | Determinístico | "não usar" sem negação equivalente — fallback ativado |
| estomia-carlos-R2 | T1 | LLM | "adesivo antialérgico" substituído por "adesivo especial" |

### Classificação dos problemas

| Tipo | Eventos | Fonte |
|------|---------|-------|
| Negação sem equivalente no gerado ("não usar") | 5 | Checker determinístico |
| Instrução procedimental alterada (técnica clínica) | 2 | Guardrail LLM |
| Substituição de substância/atributo específico | 2 | Guardrail LLM |
| Alteração de sentido semântico | 1 | Guardrail LLM |
| Contradição numérica | 1 | Guardrail LLM |

### Detalhe das rejeições LLM mais relevantes

**diabetes-ana-R1 (T1 — LLM):**
> Original: "coloque o segundo e terceiro dedos da mão na região acima do pé para sentir o pulso"
> Gerado: "sentir o pulso na região acima do pé, entre o segundo e terceiro dedos da mão"
> Problema: instrução invertida — onde colocar os dedos vs. onde está o pulso.

**diabetes-ana-R2 (T1 — LLM):**
> Original: "segundo e terceiro dedos" (indicador e médio)
> Gerado: "dedos médio e anelar"
> Problema: dedos diferentes, mesma instrução de autoexame.

**estomia-maria-R1 (T1 — LLM):**
> Original: "tintura de benjoim" (duas ocorrências)
> Gerado: "tintura de iodo" (nas mesmas posições)
> Problema: substituição de substância em lista de produtos proibidos.

**estomia-ana-R2 (T1 — LLM):**
> Original: "evitar [...] que apareça o conteúdo fecal contido nela"
> Gerado: "evitar [...] que a bolsa apareça"
> Problema: deslocamento do objeto — não é a bolsa, é o conteúdo.

**estomia-ana-R2 (T2 — LLM):**
> Original: "esvaziada sempre que estiver [...] com 1/3 da capacidade"
> Gerado: "sempre que ela estiver cerca da metade (1/3) cheia"
> Problema: "cerca da metade" (≈1/2) e "1/3" são contraditórios na mesma frase.

**estomia-carlos-R2 (T1 — LLM):**
> Original: "bolsa que cola na pele através de um adesivo antialérgico"
> Gerado: "bolsa que cola na pele com um adesivo especial"
> Problema: atributo de segurança "antialérgico" removido, substituído por "especial" genérico.

---

## 3. Síntese quantitativa

| Indicador | Diabetes (9 casos) | Estomia (9 válidos + 1 fallback) | Total (19) |
|-----------|-------------------|----------------------------------|-----------|
| Flesch-PT original médio | 19,7 | 9,2 | **14,5** |
| Flesch-PT simplificado médio | 25,2 | 23,6¹ | **24,4¹** |
| Ganho médio | +5,5 | +14,4¹ | **+9,9¹** |
| Maior ganho | +17,3 (D-Maria-R3) | +22,9 (E-Maria-R2) | **+22,9** |
| Menor ganho | −3,1 (D-Ana-R1) | +5,0 (E-Ana-R1) | **−3,1** |
| Ganho positivo | 6/9 (67%) | 9/9 (100%) | **15/18 (83%)** |
| Ganho nulo/negativo | 3/9 — todos D-Ana | 0 | **3/18 (17%)** |
| Mudança de classificação | 3/9 — todos D-Maria | 3/9 — todos E-Maria | **6/18 (33%)** |
| Aprovados no guardrail | 9/9 (100%) | 9/10 (90%) | **18/19 (95%)** |
| Aprovados na 1ª tentativa | 4/9 (44%) | 7/10 (70%) | **11/19 (58%)** |
| Aprovados com retry (2–3 tent.) | 5/9 (56%) | 2/9 (22%) | **7/18 (39%)** |
| Fallback ativado | 0 | 1/10 (Ana-R2) | **1/19 (5%)** |
| Glossário gerado | 8/9 (89%) | 9/9 (100%)¹ | **17/18 (94%)** |
| FAQ gerado | 9/9 (100%) | 9/9 (100%)¹ | **18/18 (100%)** |

¹ Exclui fallback (E-Ana-R2).

---

## 4. Síntese qualitativa

### Gradiente por perfil

O padrão de diferenciação por escolaridade se manteve consistente: Maria (Fundamental) obteve os maiores ganhos em ambos os materiais (+22,6 estomia; +14,0 diabetes), Carlos (Médio) ficou na posição intermediária (+14,9; +4,1) e Ana (Superior/Saúde) obteve os menores ganhos e os únicos negativos (+6,7; −1,7). A mudança de classificação Flesch ("Muito difícil" → "Pouco difícil") ocorreu em 100% das execuções válidas de Maria para ambos os materiais.

### Guardrail: 50% dos casos precisaram de retry

Em 8 dos 16 casos o guardrail rejeitou ao menos uma tentativa — taxa de retry de 50%, significativamente maior do que em sessões anteriores com temperatura 1.0. O guardrail LLM identificou 6 problemas distintos envolvendo alterações de instrução, substituição de substância e contradição numérica. O checker determinístico identificou 5 casos de negação sem equivalente. Os dois mecanismos capturaram tipos de erro complementares.

### Primeiro fallback registrado

A execução 2 de Ana/estomia esgotou as 3 tentativas com problemas diferentes em cada: alteração semântica (T1), contradição numérica (T2) e negação sem equivalente (T3). Cada tentativa foi bloqueada por uma camada diferente da arquitetura de guardrails. O fallback foi o comportamento esperado do sistema. A re-execução manual (exec 3 / re-run) foi aprovada na 1ª tentativa com Flesch +8,4.

### D-Ana: padrão negativo consistente

As 3 execuções de Ana com diabetes produziram variações −3,1, −1,6 e −0,4. Em dois casos o guardrail rejeitou a primeira tentativa (instrução dos dedos para palpação do pulso), e o texto aprovado ainda resultou em Flesch negativo. Esse padrão, combinado com o resultado +8,4 em estomia (aprovado sem retry), sugere que a combinação do texto de diabetes com o perfil de alta literacia é sistematicamente difícil de simplificar com ganho de legibilidade mantendo fidelidade.

### D-Carlos-R3: checker bloqueou 2 tentativas consecutivas

O checker determinístico bloqueou duas tentativas seguidas por "não usar" sem negação equivalente. Na 3ª tentativa o texto foi aprovado com Flesch +3,8. Esse caso ilustra a possibilidade de falso positivo persistente no checker regex, ou de um comportamento recorrente do modelo ao omitir a negação neste trecho específico do texto de diabetes.
