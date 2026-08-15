# Work Rules

## Type
- type: project

## Installed Teams
- installed_teams:
  []

## GitHub Settings
# GitHub usernames this workforce tracks for issues/PRs (comma-separated, @me = active user)
- github_usernames: armstrongj2001

# Repositories to ignore when scanning for issues and PRs
- ignored_repos: []

## AI Preferences
# Provide custom preferences or guidelines for response style (e.g. "keep replies short", "prefer code blocks")
- response_style: concise, commit-style reports — what changed, files touched, how verified. No verbose walkthroughs.
- code_style: production-grade and idiomatic; what a 20-year veteran would ship. Clean architecture, efficient implementations.
- comments: minimal — no explanatory or tutorial comments; a brief docstring only where behavior is non-obvious.
- teaching: off — do not explain concepts, patterns, or syntax unless asked. The running product is what gets evaluated, not the source.
- secrets: via .env only — never hardcoded, never committed.

## How to Find Work
1. Check GitHub issues assigned to configured usernames
2. Check unassigned issues in project repositories
3. Check workforces/goals/ for active task boards
