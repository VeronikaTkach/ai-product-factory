#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-.}"
SOURCE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$TARGET_DIR"
TARGET_ABS="$(cd "$TARGET_DIR" && pwd)"

if [[ "$TARGET_ABS" == "$SOURCE_DIR"* ]]; then
  echo "Refusing to install agent-skill-kit into itself."
  exit 1
fi

mkdir -p "$TARGET_DIR/agent-skill-kit"

(
  cd "$SOURCE_DIR"
  tar cf - .
) | (
  cd "$TARGET_DIR/agent-skill-kit"
  tar xf -
)

cp "$TARGET_DIR/agent-skill-kit/AGENTS.template.md" "$TARGET_DIR/AGENTS.md"

echo "Installed agent-skill-kit into $TARGET_DIR"
echo "Created $TARGET_DIR/AGENTS.md"
