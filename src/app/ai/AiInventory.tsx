/* INVENTÁRIO DE IA — o painel.
 * Missão 29 · Fase 3.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A PERGUNTA QUE ESTE PAINEL RESPONDE                                 ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * É a primeira pergunta de qualquer auditoria de IA, e é sempre a mesma:
 *
 *   **O que é que usam, e quem verifica?**
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  PORQUE É QUE ISTO NÃO É UM FORMULÁRIO DE COMPLIANCE                 ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O SPEC da missão diz: *"AI e AI Governance tornam-se áreas OPERACIONAIS do
 * Sistema, não feeds de notícias nem compliance seco."*
 *
 * O que o mantém operacional: **a dívida é o que está em cima.** Não a lista.
 * Um inventário que abre com trinta linhas iguais é um arquivo; um que abre com
 * *"1 toca dados pessoais e não tem avaliação datada"* é um instrumento.
 *
 * E o que se inventaria é a IA que o Daniel **realmente usa** — este assistente
 * incluído, o Oráculo incluído. Um inventário de IA que não se inventaria a si
 * próprio seria a primeira coisa a falhar numa auditoria.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O QUE ESTE PAINEL NUNCA DIZ                                         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * "Está conforme." É uma conclusão jurídica e o Sistema não a produz. Diz o que
 * está registado e o que falta — a constatação é de quem audita.
 */

import { useState } from 'react';
import { useStore } from '../../store/useStore.js';
import { readAi, explainAi } from './ai-read';
import type { AiRiskLevel, HumanOversight } from './aiModel';
import { porRegistar } from './ai-self';
import './ai-inventory.css';

const RISCOS: { v: AiRiskLevel; l: string }[] = [
  { v: 'por-avaliar', l: 'por avaliar' },
  { v: 'baixo', l: 'baixo' },
  { v: 'medio', l: 'médio' },
  { v: 'alto', l: 'alto' },
];

const SUPERVISAO: { v: HumanOversight; l: string }[] = [
  { v: 'por-definir', l: 'por definir' },
  { v: 'antes', l: 'humano aprova ANTES' },
  { v: 'depois', l: 'humano revê DEPOIS' },
  { v: 'nenhum', l: 'ninguém verifica' },
];

export default function AiInventory() {
  const S = useStore((s: { S: Record<string, any> | null }) => s.S);
  const addAiUse = useStore((s: any) => s.addAiUse);
  const assessAiRisk = useStore((s: any) => s.assessAiRisk);
  const setAiOversight = useStore((s: any) => s.setAiOversight);
  const retireAiUse = useStore((s: any) => s.retireAiUse);

  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [fim, setFim] = useState('');
  const [quem, setQuem] = useState('');
  const [dados, setDados] = useState('');
  const [pessoais, setPessoais] = useState<'sim' | 'nao' | 'nsei'>('nsei');
  const [verHistorico, setVerHistorico] = useState(false);

  const inv = readAi(S);
  const linhas = explainAi(inv);
  /* O que o Sistema consegue provar de si próprio e ainda não está registado.
     Ver `ai-self.ts`: são propostas com origem no código, nunca registos
     automáticos. */
  const sugestoes = porRegistar(inv.uses);

  function registar() {
    if (!nome.trim()) return;
    addAiUse({
      name: nome, purpose: fim, provider: quem, data: dados,
      personalData: pessoais === 'sim' ? true : pessoais === 'nao' ? false : null,
    });
    setNome(''); setFim(''); setQuem(''); setDados(''); setPessoais('nsei');
    setAberto(false);
  }

  const ativos = inv.uses.filter((u) => u.active);
  const historico = inv.uses.filter((u) => !u.active);
  const emAtraso = new Map(inv.overdue.map((o) => [o.use.id, o.daysLate]));

  return (
    <div className="panel reveal ai-inv">
      <div className="ptitle"><b>Inventário de IA</b> · o que usas e quem verifica</div>

      {/* A DÍVIDA PRIMEIRO. É o que distingue um instrumento de um arquivo. */}
      <div className="ai-resumo" aria-live="polite">
        {linhas.map((l, i) => (
          <p key={i} className={i === 0 ? 'ai-r1' : 'ai-rn'}>{l}</p>
        ))}
      </div>

      {inv.absence ? null : (
        <ul className="ai-lista">
          {ativos.map((u) => {
            const atraso = emAtraso.get(u.id);
            /* Os avisos vêm do estado, nunca de uma opinião sobre a ferramenta. */
            const alertas: string[] = [];
            if (u.personalData === true && !u.riskAssessedAt) alertas.push('dados pessoais sem avaliação');
            else if (!u.riskAssessedAt) alertas.push('sem avaliação datada');
            if (atraso) alertas.push(`revisão há ${atraso} ${atraso === 1 ? 'dia' : 'dias'} em atraso`);
            if (u.oversight === 'por-definir') alertas.push('não se sabe quem verifica');

            return (
              <li key={u.id} className="ai-item" data-risco={u.risk} data-alerta={alertas.length ? 'true' : 'false'}>
                <div className="ai-cab">
                  <b className="ai-nome">{u.name}</b>
                  {u.provider && <span className="ai-quem">{u.provider}</span>}
                  <span className="ai-risco">{RISCOS.find((r) => r.v === u.risk)?.l}</span>
                </div>
                {u.purpose && <p className="ai-fim">{u.purpose}</p>}

                {alertas.length > 0 && (
                  <p className="ai-alerta">{alertas.join(' · ')}</p>
                )}

                {/* A avaliação é um ATO, separado do registo — é o que põe a data.
                    Sem data não há avaliação, e o leitor trata-a como inexistente. */}
                <div className="ai-accoes">
                  <label className="ai-lbl">
                    <span>risco</span>
                    <select
                      value={u.risk}
                      aria-label={`Risco de ${u.name}`}
                      onChange={(e) => assessAiRisk(u.id, e.target.value)}
                    >
                      {RISCOS.map((r) => <option key={r.v} value={r.v}>{r.l}</option>)}
                    </select>
                  </label>
                  <label className="ai-lbl">
                    <span>verifica</span>
                    <select
                      value={u.oversight}
                      aria-label={`Supervisão humana de ${u.name}`}
                      onChange={(e) => setAiOversight(u.id, e.target.value)}
                    >
                      {SUPERVISAO.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </label>
                  <button type="button" className="mini ai-retirar" onClick={() => retireAiUse(u.id)}>
                    descontinuar
                  </button>
                </div>

                <p className="ai-meta">
                  registado {u.addedAt}
                  {u.riskAssessedAt ? ` · avaliado ${u.riskAssessedAt}` : ' · nunca avaliado'}
                  {u.evidence ? ` · prova: ${u.evidence}` : ''}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {historico.length > 0 && (
        <div className="ai-hist">
          <button type="button" className="mini" onClick={() => setVerHistorico((v) => !v)}
            aria-expanded={verHistorico}>
            {historico.length} descontinuado{historico.length === 1 ? '' : 's'}
          </button>
          {/* Um uso descontinuado NÃO sai do inventário: "já não usamos" é uma
              resposta de auditoria, e apagá-lo destruiria a prova de que existiu. */}
          {verHistorico && (
            <ul className="ai-lista ai-lista-off">
              {historico.map((u) => (
                <li key={u.id} className="ai-item" aria-disabled="true">
                  <div className="ai-cab"><b className="ai-nome">{u.name}</b></div>
                  <p className="ai-meta">registado {u.addedAt}{(u as any).retiredAt ? ` · descontinuado ${(u as any).retiredAt}` : ''}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {sugestoes.length > 0 && (
        <div className="ai-sug">
          <p className="ai-sug-t">
            O Sistema usa IA em {sugestoes.length} {sugestoes.length === 1 ? 'sítio' : 'sítios'} que
            consegue provar do próprio código. Não os regista sozinho — um inventário que
            se preenche a si mesmo é uma lista que ninguém leu.
          </p>
          <ul className="ai-sug-lista">
            {sugestoes.map((s) => (
              <li key={s.name}>
                <div className="ai-sug-cab">
                  <b>{s.name}</b>
                  {s.personalData === true && <span className="ai-sug-dp">dados pessoais</span>}
                  <button
                    type="button"
                    className="mini"
                    onClick={() => addAiUse({
                      name: s.name, purpose: s.purpose, provider: s.provider,
                      data: s.data as string[], personalData: s.personalData,
                      oversight: s.oversight, evidence: s.origem,
                    })}
                  >
                    registar
                  </button>
                </div>
                <p className="ai-sug-fim">{s.purpose}</p>
                {/* A origem é a prova. Sem ela isto seria o Sistema a afirmar
                    coisas sobre si próprio sem as poder demonstrar. */}
                <p className="ai-sug-org">{s.origem}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!aberto ? (
        <button type="button" className="btn ai-novo" onClick={() => setAberto(true)}>
          + Registar uma utilização
        </button>
      ) : (
        <div className="ai-form">
          <label className="ai-campo">
            <span>O que é</span>
            <input value={nome} onChange={(e) => setNome(e.target.value)}
              placeholder="Claude Code, Oráculo, tradutor..." autoFocus />
          </label>
          <label className="ai-campo">
            <span>Para quê</span>
            <input value={fim} onChange={(e) => setFim(e.target.value)}
              placeholder="escrever código, ler documentos..." />
          </label>
          <label className="ai-campo">
            <span>Quem fornece</span>
            <input value={quem} onChange={(e) => setQuem(e.target.value)} placeholder="Anthropic, OpenAI..." />
          </label>
          <label className="ai-campo">
            <span>Que dados toca</span>
            <input value={dados} onChange={(e) => setDados(e.target.value)}
              placeholder="separados por vírgula" />
          </label>
          <fieldset className="ai-radio">
            <legend>Toca dados pessoais?</legend>
            {/* "Não sei" é uma opção a sério. Forçar sim/não produz respostas
                erradas, e uma resposta errada aqui muda o tratamento todo. */}
            {([['sim', 'sim'], ['nao', 'não'], ['nsei', 'não sei']] as const).map(([v, l]) => (
              <label key={v}>
                <input type="radio" name="ai-pessoais" checked={pessoais === v}
                  onChange={() => setPessoais(v)} />
                {l}
              </label>
            ))}
          </fieldset>
          <div className="ai-form-accoes">
            <button type="button" className="btn" onClick={registar} disabled={!nome.trim()}>Registar</button>
            <button type="button" className="mini" onClick={() => setAberto(false)}>Cancelar</button>
          </div>
          <p className="ai-nota">
            Registar não é avaliar. O risco entra sem data e fica por avaliar até alguém o avaliar.
          </p>
        </div>
      )}
    </div>
  );
}
