# 16 · Gates de aceitação

## Gate zero

**A missão não pode ser implementada sem autorização explícita do Daniel.**

Registar uma visão não é aprová-la. Esta pasta existir não autoriza uma linha de
código, uma dependência, um agente ou uma chamada de API.

---

## O que tem de existir antes da Fase 1

| # | gate | estado |
|---|---|---|
| 1 | autorização explícita para implementar | **em falta** |
| 2 | fontes e modelos legitimamente fornecidos, com autorização escrita | **em falta** |
| 3 | corpus sanitizado, sem dados pessoais | **em falta** |
| 4 | gold cases julgados por profissional | **em falta** |
| 5 | critérios de sucesso aprovados por quem revê | **em falta** |
| 6 | política de fontes aplicada e as verificações V1–V9 resolvidas | **em falta** |
| 7 | modelo de dados definido | parcial — `03` |
| 8 | modelo de ameaça | parcial — `11` |
| 9 | avaliação de impacto do próprio sistema | **em falta** |
| 10 | fluxo de aprovação humana implementado | **em falta** |
| 11 | ambiente isolado, separado do pessoal | **em falta** |
| 12 | orçamentos por execução, caso, dia e cliente | **em falta** |
| 13 | plano de avaliação com regressão | parcial — `10` |
| 14 | rollback documentado | **em falta** |

Treze de catorze por fazer. Isso não é mau sinal — é a diferença entre uma visão
registada e um projeto começado à pressa.

---

## Gate de verificação de conhecimento

Nenhum documento é produzido para consumo humano enquanto as verificações V1–V9
de `02_AUTHORITY_AND_SOURCE_GOVERNANCE.md` estiverem por resolver.

Bloqueios ativos e nomeados:

- **NIS2** — V1 e V6 (regime nacional e prazos de reporte);
- **Governação de IA** — V2 e V3 (calendários de aplicação);
- **Normas ISO citadas** — V4 e V5 (existência e versão);
- **Custos** — V9 (preços por modelo).

---

## Gate de segurança

Antes de qualquer dado real:

- Zero Data Retention contratado e verificado;
- treino sobre os dados **desativado e confirmado por escrito**;
- lista de fornecedores e modelos aprovados;
- segregação por cliente implementada e **testada com tentativa de acesso
  cruzado**;
- redação e prevenção de fuga a funcionar;
- logs sem conteúdo sensível, confirmado por inspeção;
- kill switch testado;
- backups com **restauro testado**;
- trilho de auditoria imutável.

"Implementado" não conta. Só conta **testado**.

---

## Gate de valor

Um workflow só entra em produção se demonstrar, com números:

- tempo humano inferior ao processo manual;
- afirmações sem fonte próximas de zero;
- lacunas encontradas iguais ou superiores às da revisão manual;
- custo por caso conhecido e dentro do teto;
- nenhum erro grave nos gold cases.

---

## Gate final

Nenhuma funcionalidade é aceite apenas porque funciona. Tem de provar utilidade,
verdade, segurança, auditabilidade, reversibilidade, controlo humano,
consistência, qualidade visual e **benefício superior ao risco**.

É o gate final da `SYSTEM-ORACLE-CONSTITUTION.md`, aplicado sem alterações.

---

## Perguntas que têm de ser respondidas antes de implementar

**Sobre a relação profissional**
1. Existe interesse real, ou foi uma conversa interessante?
2. Quem define os critérios de aceitação?
3. Que tarefa rouba mais tempo e exige menos julgamento?
4. Há autorização escrita para usar os modelos da organização?

**Sobre dados**
5. Que dados podem entrar, e em que ambiente?
6. Quem é responsável e quem é subcontratante nesta cadeia?
7. Os clientes finais têm de ser informados? Quando?
8. Onde ficam armazenados, e sob que jurisdição?

**Sobre o produto**
9. Ferramenta interna, produto comercial, ou projeto de aprendizagem?
10. Se for comercial, quem assume a responsabilidade profissional?
11. Que acontece quando o sistema erra num documento entregue?
12. Qual é o plano de saída, se a organização quiser parar?

**Sobre execução**
13. Quem mantém isto quando o Operador estiver ocupado?
14. Que orçamento existe, e quem o aprova?
15. Que runtime, e com que critérios foi escolhido?
16. Quanto custa sair desse runtime?

**Sobre o Sistema**
17. Isto é uma missão do Sistema, ou um projeto separado que reutiliza o Oráculo?
18. Se o Sistema evoluir, esta missão acompanha ou congela?
19. A Missão 26 fica em pausa enquanto esta corre?

A pergunta 1 é a única que não se responde a trabalhar. Enquanto não tiver
resposta, **as outras dezoito são hipotéticas** — e é por isso que esta pasta é
uma visão registada e não um plano em execução.
