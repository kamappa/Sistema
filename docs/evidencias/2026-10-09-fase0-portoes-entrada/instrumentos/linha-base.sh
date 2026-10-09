#!/usr/bin/env bash
# Linha de base do W56: os 16 ficheiros servidos pelo Pages, somas e Last-Modified de cada um.
# Uso: bash linha-base.sh <pasta-de-referencia> <pasta-de-saida-nova>
set -u
ref="$1"; out="$2"
mkdir "$out" || { echo "a pasta já existe: $out"; exit 2; }
n=0
while IFS= read -r f; do
  f="${f%$'\r'}"; [ -z "$f" ] && continue
  mkdir -p "$out/$(dirname "$f")"
  hdr=$(curl -s -D - -o "$out/$f" "https://kamappa.github.io/Sistema/$f")
  code=$(printf '%s' "$hdr" | head -1 | awk '{print $2}')
  lm=$(printf '%s' "$hdr" | grep -i '^last-modified:' | cut -d' ' -f2- | tr -d '\r')
  printf '%s  HTTP %s  Last-Modified: %s\n' "$f" "$code" "$lm"
  n=$((n + 1))
done < "$ref/pages-lista.txt"
echo "descarregados: $n; ficheiros na pasta: $(find "$out" -type f | wc -l)"
(cd "$out" && sha256sum -c "$ref/pages-antes.sha256")
