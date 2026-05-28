# `.config/` — secrets and connection details

This folder is the **single source of truth** for every secret in the project: database credentials, third-party API keys, signing/session secrets, SMTP credentials, AWS keys, anything that grants access to a system.

## What's here

| File | Tracked in git? | Purpose |
|---|---|---|
| `secrets.env` | **No** (gitignored) | Real values used at runtime. |
| `secrets.env.example` | Yes | Committed template listing every key the project expects, with placeholder values and one-line descriptions. |
| `README.md` | Yes | This file. |

The repo-root `.gitignore` ignores everything under `.config/` *except* `*.example` files, `README.md`, and `.gitkeep`. If you add a new file here, double-check `git status` to confirm it isn't being staged.

## How to set up `.config/secrets.env` on a new machine

```sh
cp .config/secrets.env.example .config/secrets.env
# then open .config/secrets.env and fill in real values
```

Real values come from:
- **Local dev**: ask whoever owns the project. Don't reuse production credentials locally.
- **Staging / Production**: the value is provisioned by the deploy process (manual SCP, AWS Secrets Manager, or whatever is documented in `INSTALL.md`).

## How code reads from this file

All code paths read environment values through one loader (PHP-side: `api/lib/env.php` once the API exists). No file outside `.config/` should contain secrets, and no code should hardcode a credential value — always read it through the loader.

The frontend never reads anything from this folder. The frontend has its own `frontend/.env` for purely public values (e.g. `VITE_API_BASE_URL`); anything that must stay secret stays server-side and is accessed only through the PHP API.

## Rules for adding a new secret

1. Add the key to **both** `secrets.env` (with the real value) and `secrets.env.example` (with a placeholder + comment).
2. Update `INSTALL.md`'s environment-variable table in the same commit.
3. Reference the value in code via the env loader; never hardcode it.
4. If the secret is environment-specific (different per local/staging/production), say so in the comment.

## Rotation and hygiene

- Treat any secret that has ever appeared in chat, email, Slack, or a screenshot as compromised. Rotate it.
- Production secrets should be rotated on a schedule and immediately when anyone with access leaves the project.
- Never log a secret value, even at debug level. The env loader should not have a "dump everything" mode.
