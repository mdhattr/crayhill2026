# Database content

News, careers, team rosters, and legal/privacy page copy live in **MariaDB (RDS)** — not in this repo.

Edit content through the CMS at `/admin`, or directly in the database. There are no committed seed files; a fresh environment either shares the existing RDS instance or restores a `mysqldump` of the `crayhill` schema from an environment that already has content.

See `INSTALL.md` → **Database setup → CMS content** and `docs/data-flow.md`.
