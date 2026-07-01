#!/bin/sh
set -eu

timeout_ms="${DB_WAIT_TIMEOUT_MS:-60000}"
elapsed_ms=0

until npx prisma db push --skip-generate; do
  if [ "$elapsed_ms" -ge "$timeout_ms" ]; then
    echo "Sinkronisasi schema Prisma gagal setelah menunggu ${timeout_ms}ms" >&2
    exit 1
  fi

  echo "Database belum siap, coba lagi dalam 2 detik..."
  sleep 2
  elapsed_ms=$((elapsed_ms + 2000))
done
