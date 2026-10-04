# 02 · Autoridade e governação de fontes

## A regra

**Comentário pode descobrir um tema. Nunca substitui a autoridade legal.**

Um artigo de um escritório de advogados pode ser a primeira coisa que revela que
uma orientação nova existe. Não pode ser aquilo que o sistema cita como base de
uma conclusão.

## Escalões de fonte

### Escalão 1 — autoridade máxima

Fonte primária. Pode fundamentar uma conclusão.

- EUR-Lex (legislação da União);
- Diário da República (legislação nacional);
- CNPD (autoridade de controlo nacional);
- EDPB / Comité Europeu para a Proteção de Dados;
- Tribunal de Justiça da União Europeia;
- Comissão Europeia (atos delegados, atos de execução, orientações formais);
- CNCS (autoridade nacional de cibersegurança);
- ENISA (orientação técnica da agência europeia);
- autoridades setoriais competentes.

### Escalão 2 — normativa adquirida

Normas ISO/IEC e equivalentes, **apenas quando a organização detém licença
legítima**. Nunca reproduzidas em extensão; referidas por cláusula e requisito.

### Escalão 3 — auxiliar

Associações profissionais, pareceres, artigos especializados, documentação
técnica de fornecedores. Servem para **descoberta e contexto**. Nunca como base
única de uma conclusão que o cliente vai receber.

## O que o sistema regista sobre cada fonte

```yaml
source_id:        eurlex-32016R0679
authority_tier:   1
publisher:        EUR-Lex
jurisdiction:     EU
document_type:    regulation
canonical_url:    <url oficial>
retrieved_at:     <data>
content_hash:     <hash do que foi lido>
language:         pt
version:          consolidada em <data>
verified_by:      <humano ou agente + data>
status:           VERIFIED | UNVERIFIED | DISPUTED | SUPERSEDED
```

O `content_hash` existe por uma razão prática: uma página oficial pode ser
atualizada sem mudar de URL. Sem hash, o sistema acha que leu a mesma coisa.

## Autenticação de origem

Antes de qualquer conteúdo entrar no cofre de conhecimento, o **Source Curator**
verifica:

1. o domínio é o domínio oficial do emissor;
2. existe data de publicação e, quando aplicável, data de entrada em vigor;
3. existe identificação de versão ou de consolidação;
4. a jurisdição é explícita;
5. o documento não foi revogado ou substituído;
6. o conteúdo lido corresponde ao hash guardado.

Falha em qualquer ponto → `QUARANTINED`, e o caso que dependia disso fica
`HUMAN_REQUIRED`.

## Proibições

Um agente **não pode**:

- citar um blogue, uma newsletter ou um post como base jurídica;
- inferir uma data de entrada em vigor a partir de um comentário;
- tratar uma tradução não oficial como texto legal;
- usar uma versão consolidada sem registar a data de consolidação;
- misturar jurisdições sem o dizer;
- apresentar orientação (soft law) como obrigação legal;
- reproduzir uma norma ISO em extensão, com ou sem licença.

## A aplicação imediata desta política — a este próprio documento

A conversa que originou esta missão continha várias afirmações regulatórias
concretas. Estão registadas aqui **como candidatas a verificação**, não como
factos, e é deliberado que o primeiro corpus do sistema seja o corpus da sua
própria fundação.

| # | afirmação a verificar | escalão exigido | estado |
|---|---|---|---|
| V1 | Portugal transpôs a NIS2 pelo Decreto-Lei n.º 125/2025, com o novo regime em vigor a 3 de abril de 2026 | 1 · Diário da República | **NÃO VERIFICADO** |
| V2 | O AI Act aplica obrigações de literacia em IA desde fevereiro de 2025 | 1 · EUR-Lex | **NÃO VERIFICADO** |
| V3 | As obrigações de transparência do artigo 50.º do AI Act aplicam-se a partir de 2 de agosto de 2026 | 1 · EUR-Lex | **NÃO VERIFICADO** |
| V4 | Existe ISO/IEC 29134:2023 com orientação sobre avaliações de impacto na privacidade | 2 · ISO | **NÃO VERIFICADO** |
| V5 | Existe ISO/IEC 27701:2025 e substitui a versão anterior | 2 · ISO | **NÃO VERIFICADO** |
| V6 | A NIS2 prevê aviso inicial em 24 h, notificação em 72 h e relatório final em regra até um mês | 1 · EUR-Lex | **NÃO VERIFICADO** |
| V7 | O RGPD estabelece 72 horas para notificação de violações à autoridade de controlo | 1 · EUR-Lex | **NÃO VERIFICADO** |
| V8 | O artigo 35.º do RGPD exige AIPD quando o tratamento com novas tecnologias seja suscetível de criar risco elevado | 1 · EUR-Lex | **NÃO VERIFICADO** |

**Nota de honestidade.** V7 e V8 correspondem a conhecimento estabelecido e
seria fácil marcá-los como verificados de cabeça. Não o faço, e a razão é a
regra: *verificado* significa **fonte consultada, data registada, versão
identificada e hash guardado**. Um estado de verificação atribuído por memória é
exatamente o hábito que este sistema existe para eliminar. O custo de verificar
o que já se sabe é baixo; o custo de normalizar "sei de cor, portanto está
verificado" é o produto inteiro.

Nenhuma destas afirmações pode ser usada num documento entregue a alguém antes
de passar a `VERIFIED` por consulta à fonte de escalão 1 ou 2.

## Consulta externa e minimização

Quando um agente precisa de pesquisar, envia uma **questão sanitizada**, nunca o
documento.

Correto:

```
orientação atual do EDPB sobre prazos de conservação em processos de recrutamento
```

Proibido:

```
analisa este processo completo do Cliente X com estes nomes e estes dados
```

O documento do cliente não sai do cofre para um motor de pesquisa. Ver
`11_PRIVACY_SECURITY_AND_TENANCY.md`.

## Conflito entre fontes

Quando duas fontes de escalão 1 se contradizem, o sistema **não escolhe**.
Marca `CONFLICT`, apresenta as duas com data e jurisdição, e encaminha para
decisão humana. Uma síntese confiante de duas normas em conflito é uma opinião
jurídica disfarçada de facto.
