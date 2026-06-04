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

> **Flesch** = fórmula original (206,835), sílabas por grupos de vogais — valores gerados pela solução.
> **Flesch-PT** = adaptação para português (248,835), sílabas via stress-pt — recalculado sobre os mesmos textos.

### diabetes.pdf — Flesch original: 19,7 · Flesch-PT original: 51,8

| Execução | Ana (Superior/Saúde) | Carlos (Médio/Negócios) | Maria (Fundamental) |
|----------|----------------------|------------------------|-------------------|
| Exec. 1 | Flesch: 16,6 (−3,1) · 2T<br>Flesch-PT: 48 (−3,8) | Flesch: 23,2 (+3,5) · 2T<br>Flesch-PT: 55,6 (+3,8) | Flesch: 35,0 (+15,3) · 1T<br>Flesch-PT: 69,6 (+17,8) |
| Exec. 2 | Flesch: 18,1 (−1,6) · 2T<br>Flesch-PT: 49,5 (−2,3) | Flesch: 24,7 (+5,0) · 1T<br>Flesch-PT: 57,9 (+6,1) | Flesch: 29,1 (+9,4) · 1T<br>Flesch-PT: 62,5 (+10,7) |
| Exec. 3 | Flesch: 19,3 (−0,4) · 1T<br>Flesch-PT: 50,9 (−0,9) | Flesch: 23,5 (+3,8) · 3T<br>Flesch-PT: 56,4 (+4,6) | Flesch: 37,0 (+17,3) · 2T<br>Flesch-PT: 72,1 (+20,3) |
| **Média Flesch** | **18,0 (−1,7)** | **23,8 (+4,1)** | **33,7 (+14,0)** |
| **Média Flesch-PT** | **49,5 (−2,3)** | **56,6 (+4,8)** | **68,1 (+16,3)** |
| Classif. Flesch | Muito difícil | Muito difícil | **Pouco difícil** |
| Classif. Flesch-PT | **Pouco difícil** | **Fácil** | **Fácil** |

### estomia.pdf — Flesch original: 9,2 · Flesch-PT original: 41,8

| Execução | Ana (Superior/Saúde) | Carlos (Médio/Negócios) | Maria (Fundamental) |
|----------|----------------------|------------------------|-------------------|
| Exec. 1 | Flesch: 14,2 (+5,0) · 1T<br>Flesch-PT: 47,2 (+5,4) | Flesch: 24,2 (+15,0) · 1T<br>Flesch-PT: 59,2 (+17,4) | Flesch: 31,4 (+22,2) · 2T<br>Flesch-PT: 67 (+25,2) |
| Exec. 2 | **FALLBACK** · 3T<br>Re-run: Flesch: 17,6 (+8,4) · 1T<br>Re-run Flesch-PT: 50,9 (+9,1) | Flesch: 23,9 (+14,7) · 2T<br>Flesch-PT: 58,6 (+16,8) | Flesch: 32,1 (+22,9) · 1T<br>Flesch-PT: 68,3 (+26,5) |
| Exec. 3 | Flesch: 15,0 (+5,8) · 1T<br>Flesch-PT: 48,4 (+6,6) | Flesch: 23,8 (+14,6) · 1T<br>Flesch-PT: 59,1 (+17,3) | Flesch: 30,4 (+21,2) · 1T<br>Flesch-PT: 67 (+25,2) |
| **Média Flesch** (valid.) | **15,6 (+6,4)** | **24,0 (+14,8)** | **31,3 (+22,1)** |
| **Média Flesch-PT** (valid.) | **48,8 (+7,0)** | **59,0 (+17,2)** | **67,4 (+25,6)** |
| Classif. Flesch | Muito difícil | Muito difícil | **Pouco difícil** |
| Classif. Flesch-PT | **Pouco difícil** | **Fácil** | **Fácil** |

### Resumo por perfil (médias gerais)

| Perfil | Estomia Flesch | Estomia Flesch-PT | Diabetes Flesch | Diabetes Flesch-PT |
|--------|---------------|-------------------|----------------|-------------------|
| Ana (Superior/Saúde) | +6,4 | **+7,0** | −1,7 | **−2,3** |
| Carlos (Médio/Negócios) | +14,8 | **+17,2** | +4,1 | **+4,8** |
| Maria (Fundamental) | +22,1 | **+25,6** | +14,0 | **+16,3** |

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

> **Flesch** = fórmula original (206,835), gerado pela solução no momento da execução.
> **Flesch-PT** = adaptação para português (248,835) + stress-pt, recalculado sobre os mesmos textos.

### Legibilidade — Flesch (fórmula original)

| Indicador | Diabetes (9) | Estomia (9 válidos) | Total (18 válidos) |
|-----------|-------------|--------------------|--------------------|
| Original médio | 19,7 | 9,2 | **14,5** |
| Simplificado médio | 25,2 | 23,6 | **24,4** |
| Ganho médio | +5,5 | +14,4 | **+9,9** |
| Maior ganho | +17,3 (D-Maria-R3) | +22,9 (E-Maria-R2) | **+22,9** |
| Menor ganho | −3,1 (D-Ana-R1) | +5,0 (E-Ana-R1) | **−3,1** |
| Ganho positivo | 6/9 (67%) | 9/9 (100%) | **15/18 (83%)** |
| Ganho nulo/negativo | 3/9 — todos D-Ana | 0/9 | **3/18 (17%)** |
| Mudança de classificação | 3/9 — D-Maria | 3/9 — E-Maria | **6/18 (33%)** |

### Legibilidade — Flesch-PT (adaptação portuguesa)

| Indicador | Diabetes (9) | Estomia (9 válidos) | Total (18 válidos) |
|-----------|-------------|--------------------|--------------------|
| Original médio | 51,8 | 41,8 | **46,8** |
| Simplificado médio | 58,1 | 58,4 | **58,2** |
| Ganho médio | +6,3 | +16,6 | **+11,4** |
| Maior ganho | +20,3 (D-Maria-R3) | +26,5 (E-Maria-R2) | **+26,5** |
| Menor ganho | −3,8 (D-Ana-R1) | +5,4 (E-Ana-R1) | **−3,8** |
| Ganho positivo | 6/9 (67%) | 9/9 (100%) | **15/18 (83%)** |
| Ganho nulo/negativo | 3/9 — todos D-Ana | 0/9 | **3/18 (17%)** |
| Mudança de classificação | 3/9 (33%) — D-Ana piora (Fácil→Pouco difícil) | 7/9 (78%) — E-Carlos(3), E-Maria(3), E-Ana-rerun | **10/18 (56%)** |

### Pipeline e guardrails

| Indicador | Diabetes (9 casos) | Estomia (9 válidos + 1 fallback) | Total (19) |
|-----------|-------------------|----------------------------------|-----------|
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
