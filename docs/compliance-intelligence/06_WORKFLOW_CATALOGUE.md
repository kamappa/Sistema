# 06 · Catálogo de workflows

## O princípio

**Um trabalhador não envia um ficheiro para um chat. Abre um caso.**

Um chat perde o responsável, o prazo, a finalidade, a sensibilidade e a
rastreabilidade. Um caso guarda tudo isso e sobrevive a quem o abriu.

## Entrada

Canal principal: **portal interno**.

```
Nova análise
  → escolher cliente/projeto
  → escolher workflow
  → carregar documentos
  → preencher contexto mínimo
  → enviar
```

Canais alternativos: SharePoint/Teams no espaço do cliente; caixa de email
controlada; API para volume.

**O email nunca é onde a análise acontece.** Converte a mensagem e os anexos num
caso e termina aí o seu papel.

## Contexto mínimo

```
Cliente/projeto:
Tipo de documento:
Finalidade da análise:
Jurisdição:
Prazo:
Nível de confidencialidade:
Resultado pretendido:
Modelo interno a utilizar:
Pode consultar fontes externas?   Sim / Não
Contém dados pessoais?            Sim / Não / Não sei
Comentários:
```

"Não sei" é resposta válida em ambos os campos. Forçar uma escolha binária
produz respostas erradas, e uma resposta errada aqui muda o tratamento do caso
inteiro.

## O caso

```
CASO <ref>

Cliente:            <cliente>
Workflow:           Atualização de RAT
Responsável:        <trabalhador>
Revisor:            <sénior>
Prazo:              <data>
Sensibilidade:      Confidencial
Estado:             Em triagem
Knowledge version:  Privacy Playbook v18
```

O campo `Knowledge version` é o que permite, meses depois, explicar por que
razão o documento diz o que diz.

## As sete etapas

### 1 · Receção segura

Antes de qualquer agente ler conteúdo: valida tipo de ficheiro, verifica
malware, calcula hash, identifica duplicados, regista versão, extrai metadados,
aplica regras de acesso, deteta credenciais ou informação extremamente sensível,
e confirma que o utilizador pode tratar aquele cliente.

**O original nunca é modificado.** Fica como evidência de entrada.

### 2 · Triagem

Identifica tipo documental, idioma, jurisdição, temas, datas, entidades,
workflow provável, campos em falta, nível de risco e necessidade de especialista.

```
Documento detetado:        RAT
Jurisdição:                UE / Portugal
Entidades:                 responsável + 3 subcontratantes
Dados especiais:           possível
Transferências:            mencionadas
Campos incompletos:        7
Modelo recomendado:        TPL-ROPA-004
Revisão sénior:            necessária
```

**O trabalhador pode corrigir a classificação antes de continuar.** Uma triagem
errada aceite em silêncio contamina tudo o que vem a seguir.

### 3 · Perguntas de esclarecimento

Se o documento disser "dados conservados durante o período necessário", o agente
**não escolhe cinco anos por plausibilidade**. Pergunta:

> Qual é o período ou critério de conservação aprovado para este tratamento?

Perguntas agrupadas em: bloqueantes · importantes · opcionais · verificáveis em
documentos já existentes.

O trabalhador responde, anexa um documento, ou encaminha para o cliente.

### 4 · Recuperação de conhecimento

Pela cascata de `05_REGULATORY_UPDATE_PIPELINE.md`. Cada regra usada regista
origem, autoridade, jurisdição, versão, data de consulta e estado.

### 5 · Agentes trabalham

Exemplo num RAT:

```
Document Classifier   → reconhece estrutura e versão
RAT Agent             → extrai atividades, finalidades, titulares, dados
Applicability Agent   → identifica requisitos relevantes
Source Curator        → confirma fontes e atualidade
Gap Analyst           → encontra omissões, inconsistências, conflitos
Draft Agent           → prepara proposta
Evidence Agent        → liga cada alteração à evidência
Adversarial Reviewer  → tenta derrubar o resultado
```

### 6 · Revisão humana

O trabalhador aceita, rejeita, edita, pede nova análise, responde a uma lacuna ou
envia para revisão sénior.

### 7 · Entrega

```
Em análise → Draft preparado → Revisão interna →
Alterações solicitadas → Aprovado → Entregue → Arquivado
```

O cliente recebe **apenas o resultado autorizado**, nunca os rascunhos internos
dos agentes.

## O pacote de saída

Não é um documento reescrito. É:

**Resumo executivo**

```
Estado: revisão humana necessária

12 lacunas encontradas
 3 inconsistências
 2 pontos potencialmente críticos
 6 alterações propostas
 4 perguntas ainda sem resposta
```

**Achados**, cada um com esta forma:

```
Achado:          Período de conservação não definido.
Documento:       RAT — Recrutamento, secção 8.
Motivo:          O texto não permite determinar prazo ou critério objetivo.
Fonte:           Política interna de retenção v3 + base legal indicada.
Confiança:       Alta.
Ação proposta:   Confirmar prazo com RH e inserir a regra aprovada.
Estado:          Pendente de resposta.
```

**Redline** — original, proposta, alterações assinaladas, comentários, campos por
completar. **Nada alterado silenciosamente.**

**Evidência** — fontes oficiais, modelos internos, documentos do cliente, versão
usada, data da análise.

**Perguntas** — lista pronta para enviar ao cliente ou ao departamento.

## Workflows do catálogo

| workflow | risco | revisão mínima |
|---|---|---|
| Comparar documento com modelo aprovado | baixo | trabalhador |
| Organizar e indexar dossiê de evidência | baixo | trabalhador |
| Ata e seguimento de reunião | baixo | trabalhador |
| Rever ou atualizar um RAT | médio | sénior |
| Rever aviso de privacidade | médio | sénior |
| Avaliar fornecedor | médio | sénior |
| Gap analysis ISO/IEC 27001 | médio | sénior |
| Analisar contrato / cláusulas de tratamento | alto | jurídico |
| Screening de AIPD | alto | jurídico |
| Avaliar aplicabilidade NIS2 | alto | sénior + jurídico |
| Classificar caso de uso de IA | alto | sénior + jurídico |
| Analisar incidente ou violação | alto | jurídico, sempre |
| Investigação regulatória | variável | conforme uso |

## O modo de auditoria ao vivo

Numa reunião com o cliente, o chat **não ocupa o centro do ecrã**. O produto
principal não é conversar com a IA — é não perder evidência, perguntas nem
compromissos.

### Modo A — transcrição autorizada

Com consentimento e política adequada, a transcrição alimenta o sistema, que
converte:

```
10:32  Auditor   Quem aprova os acessos administrativos?
10:33  Cliente   O diretor de IT aprova por email.
10:34  Auditor   Conseguem mostrar uma amostra?
10:35  Cliente   Não nesta reunião. Enviamos até sexta-feira.
```

em:

```
CONTROLO           Acessos privilegiados
AFIRMAÇÃO          Aprovação pelo diretor de IT por email.
ESTADO             Declarado — não verificado.
EVIDÊNCIA PEDIDA   Amostra de aprovação.
COMPROMISSO        Cliente envia até sexta-feira.
RISCO              Processo dependente de email não estruturado.
```

**Requisito não negociável:** gravar ou transcrever uma reunião com um cliente
exige base legal, informação prévia e política escrita. A capacidade técnica de
aceder a transcrições do Teams ou do Zoom **não é** autorização para o fazer, e
essa autorização não é do sistema — é da organização e do cliente.

### Modo B — copiloto manual estruturado

Quando não se pode gravar. Botões rápidos:

```
+ Afirmação   + Evidência apresentada   + Evidência prometida
+ Possível não conformidade   + Questão aberta   + Decisão   + Seguimento
```

**Este modo pode ser melhor do que o A**, e não é um consolo: o auditor decide o
que é relevante e não se guarda conversa desnecessária. Em reuniões sensíveis é a
opção certa mesmo quando gravar seria possível.

### Modo C — depois da reunião

Upload de notas, ata, evidências, participantes e documentação prometida. O
sistema reconstrói o caso.

### O que o copiloto mostra durante a chamada

```
Cobertura da sessão
  ✓ Responsável
  ✓ Processo declarado
  ○ Evidência
  ○ Exceções
  ○ Teste de amostra
  ○ Métrica
```

Ajuda sem obrigar o auditor a escrever prompts enquanto fala com um cliente.

## Onde está o retorno real

Provavelmente **não** na IA ao vivo. Está antes e depois:

- preparação da sessão — perguntas por critério, histórico, lacunas anteriores;
- pipeline reunião → evidência → compromissos → seguimento;
- comparação de documentos — política vs requisito, RAT antigo vs processo novo,
  contrato vs template aprovado, declaração de aplicabilidade vs evidência real;
- organização e indexação de dossiê de evidência;
- elaboração de relatório com separação entre facto e interpretação;
- acompanhamento de ações corretivas até ao fecho.

**O piloto inicial não deve depender de IA ao vivo.** É o modo com maior atrito
jurídico e menor retorno demonstrável.
