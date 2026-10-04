// Calendário · triagem de tipo de evento — porto de hud.js:73-78. Pura.
export function guessEvType(t) {
  t = t.toLowerCase();
  if (['exame', 'teste', 'prova', 'frequência', 'frequencia'].some((k) => t.includes(k))) return 'exame';
  if (['trein', 'gin', 'corrida'].some((k) => t.includes(k))) return 'treino';
  if (['confer', 'summit', 'meetup', 'palestra', 'workshop', 'evento', 'webinar'].some((k) => t.includes(k))) return 'evento';
  if (['entrega', 'prazo', 'submeter', 'deadline', 'candidatura'].some((k) => t.includes(k))) return 'prazo';
  return 'outro';
}

export const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
