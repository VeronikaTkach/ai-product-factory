# MCP Adoption Checklist: GitHub MCP

## Purpose

- System: GitHub repository workflow.
- Needed actions: inspect issues, inspect PRs, create review comments.
- Read/write/delete/send/deploy: read plus comment writes.

## Source Trust

- First-party / organization-curated / community: first-party or trusted vendor.
- Version pinned: yes.

## Transport

- remote or local depending on available implementation.
- Reason: shared repository workflow.

## Permissions

- Required access: selected repositories only.
- Proposed access mode: approval-required for comments, read-only for inspection.
- Scope boundary: current project repository.

## Credentials

- Credential source: GitHub token from secret storage.
- Secret handling: never paste token into prompts.

## Decision

- Pilot with read-only access first, then enable comment writes behind approval.
