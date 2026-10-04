# 15 · Roadmap faseado

> Nenhuma fase começa sem os gates de `16_ACCEPTANCE_GATES.md` cumpridos.
> As fases são sequenciais. Não se saltam.

---

## Fase 0 — Visão registada

**Estado: CONCLUÍDA** (esta pasta).

Nada de código. Nada de dependências. Nada de agentes.

---

## Fase 1 — Ferramenta interna, sem clientes

Só documentos fictícios, templates vazios, casos sanitizados, fontes públicas.

Construir **três** workflows, não mais:

1. comparação de documento contra modelo aprovado;
2. preparação pós-reunião (notas → ata → evidência pedida → seguimento);
3. Regulatory Delta.

**Objetivo:** demonstrar consistência, rastreabilidade e segurança. **Não**
volume.

**Sai desta fase com:** contratos implementados, trilho de auditoria a funcionar,
e a certeza de que o sistema pára quando deve.

---

## Fase 2 — Modo sombra sobre casos fechados

10 a 20 casos históricos **já concluídos e sanitizados**. O sistema trabalha sem
influenciar nada.

Compara-se: lacunas encontradas, lacunas falhadas, afirmações sem fundamento,
tempo, esforço de revisão, respeito pelos templates, correção das fontes.

**Esta fase produz os gold cases.** Sem ela, a Fase 3 não tem como se avaliar.

**Gate:** se a taxa de afirmações sem fonte não for próxima de zero, volta-se à
Fase 1.

---

## Fase 3 — Um workflow interno real

Um só, de **baixo risco**. Candidatos: comparação de documentos, organização de
evidência, ata e seguimento, preparação inicial de RAT.

Todo o resultado passa por revisão humana.

**Não começar por** violações, pareceres finais ou comunicações com autoridades.

**Gate:** tempo humano medido, inferior ao anterior. Se não for, o workflow
desliga-se.

---

## Fase 4 — Piloto com um ou dois clientes

Escolher clientes com relação de confiança, processos estruturados, volume
suficiente para medir, disponibilidade para colaborar e dados minimizáveis.

Definir **por escrito, antes**: finalidade, documentos abrangidos, quem tem
acesso, fornecedores de IA envolvidos, retenção, local de armazenamento,
supervisão, resultados permitidos, ações proibidas, procedimento em caso de erro.

**Pré-requisito absoluto:** avaliação de impacto do próprio sistema concluída.
Ver `11_PRIVACY_SECURITY_AND_TENANCY.md`.

---

## Fase 5 — Clientes existentes

Workspace isolado por cliente. **Nunca** pesquisa transversal.

Por cliente, e não de uma vez: inventariar documentos, identificar versões
atuais, eliminar duplicados, escolher o que pode entrar, classificar
sensibilidade, configurar retenção, definir utilizadores, mapear templates, criar
o primeiro caso, validar com o consultor responsável.

**Não carregar todo o arquivo de uma vez.** É a tentação mais forte e o erro mais
caro: um arquivo inteiro num sistema novo é uma violação à espera de acontecer,
sem nenhum benefício correspondente.

---

## Fase 6 — Novos clientes

Onboarding estruturado desde o início:

```
Contrato e acordo de tratamento
  → configuração do workspace
  → questionário inicial
  → inventário de documentos
  → mapa de sistemas
  → jurisdições
  → responsáveis
  → workflows contratados
  → templates aplicáveis
  → plano de atualização
  → revisão humana
```

No contrato ou proposta fica claro: onde existe assistência por IA, que decisões
continuam humanas, que fornecedores participam, que dados podem ser tratados, que
ações o sistema nunca executa, e como o cliente pede exportação ou eliminação.

---

## Níveis de oferta, se algum dia chegar a produto

**Regulatory Intelligence** — radar, alterações, impacto, alertas, revisão de
modelos, resumo mensal.

**Compliance Workspace** — casos, documentos, evidência, ações, responsáveis,
aprovações, portal de cliente.

**Audit & Privacy Copilot** — reuniões, RAT, AIPD, fornecedores, pedidos,
auditoria, seguimento.

**Continuous Compliance** — monitorização, revisões programadas, evidência,
manutenção documental, indicadores, reporte à direção.

O último nível é o que transforma "consultoria por projeto" em "serviço contínuo
de manutenção de conformidade" — e é provavelmente onde está o valor comercial.

---

## Onde isto pode morrer, e não faz mal

- **Fase 1** — os contratos revelam-se demasiado pesados para o valor. Fecha-se
  com a documentação e o aprendizado.
- **Fase 2** — o sistema produz afirmações sem fonte a mais. Não avança.
- **Fase 3** — não poupa tempo humano. Desliga-se o workflow.
- **Fase 4** — a organização não autoriza dados reais. O projeto fica como
  ferramenta interna de estudo, o que já tem valor próprio para a trajetória do
  Operador.

Uma missão que pára numa fase com uma razão medida **não falhou**. Falhar era
chegar à Fase 5 sem nunca ter medido nada.
