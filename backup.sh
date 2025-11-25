#!/bin/bash

# Script de respaldo automático a GitHub
# Ejecuta git add, commit y push con manejo de errores

set -e

echo "🔄 Iniciando respaldo a GitHub..."

# Limpiar locks si existen
rm -f .git/index.lock .git/config.lock 2>/dev/null || true

# Verificar si hay cambios
if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "✅ No hay cambios para respaldar"
    exit 0
fi

# Añadir todos los cambios
echo "📦 Añadiendo cambios..."
git add -A

# Crear commit con timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
git commit -m "Backup automático - $TIMESTAMP"

# Push a GitHub usando GIT_URL
echo "⬆️ Subiendo a GitHub..."
git push "$GIT_URL" HEAD:main 2>&1

echo "✅ Respaldo completado exitosamente"
