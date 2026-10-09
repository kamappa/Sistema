#!/usr/bin/env bash
# Descarrega os 16 ficheiros que o Pages serve para uma pasta NOVA e compara-os com as somas do site de 04/10.
# O sha256sum -c já provou que acusa diferenças (W54: o dist do PC deu 9 FAILED).
# Uso: bash pages-somas.sh
set -u
ref="<scratchpad-9e0dac37>/w45"
out="<jobs-9e0dac37>/tmp/pages-$(date -u +%Y%m%d-%H%M%S)"
mkdir "$out" || { echo "a pasta já existe: $out"; exit 2; }
n=0
while IFS= read -r f; do
  f="${f%$'\r'}"
  [ -z "$f" ] && continue
  mkdir -p "$out/$(dirname "$f")"
  code=$(curl -s -o "$out/$f" -w '%{http_code}' "https://kamappa.github.io/Sistema/$f")
  [ "$code" = "200" ] || echo "HTTP $code: $f"
  n=$((n + 1))
done < "$ref/pages-lista.txt"
echo "descarregados: $n (pasta $out)"
echo "ficheiros na pasta: $(find "$out" -type f | wc -l)"
(cd "$out" && sha256sum -c "$ref/pages-antes.sha256")
echo "--- cabeçalhos do index.html"
curl -sI "https://kamappa.github.io/Sistema/index.html" | grep -iE '^(last-modified|age|x-cache|date):'
