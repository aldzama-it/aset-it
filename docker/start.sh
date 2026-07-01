#!/bin/sh
set -eu

mkdir -p /app/private-uploads/handover
exec node server.js
