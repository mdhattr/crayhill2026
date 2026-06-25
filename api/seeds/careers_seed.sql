-- Seed data: crayhill.careers
--
-- Open job postings scraped from the legacy crayhill.com Careers section
-- (the /careers listing plus the individual job detail pages), converted to
-- Markdown. This file is the committed, reproducible source for the careers
-- table on a fresh environment — load it AFTER the schema migration
-- 2026_06_24_004_create_careers.sql.
--
-- Load via the mysql client (NOT api/lib/migrate.php — its naive ';' splitter
-- would shred the Markdown content):
--
--   mysql --host=<host> --user=<user> --password --ssl-ca=api/certs/aws-rds-ca-bundle.pem \
--         crayhill < api/seeds/careers_seed.sql
--
-- Idempotent: a single INSERT ... ON DUPLICATE KEY UPDATE keyed on the unique
-- slug, so re-running updates existing rows rather than erroring. To edit a
-- posting, change it directly in this file (it is the source of truth now —
-- the scrape was one-time).
--
-- NOTE: a re-run upserts the rows listed here but does NOT remove rows that
-- were dropped from this file. The Investment Analyst and Associate postings
-- were deleted from both this seed and the live table.

INSERT INTO careers (title, slug, location, sort_order, status, content) VALUES
  ('Data Center Project Development Manager', 'data-center-project-development-manager', NULL, 1, 'published', '**Company**

Crayhill Capital Management is a New York-based, partner owned alternative asset management firm that specializes in asset-based investment opportunities. The firm was launched in August 2015, is registered with the U.S. SEC as an investment adviser and manages over $3 billion in assets under management. Thirty-one professionals currently support our growing multi-product platform that invests capital on behalf of a sophisticated institutional client base, including deep relationships with the premier limited partner consultants. Our investment professionals and leadership team have deep expertise in the asset-based markets with a focus on renewable power, grid infrastructure and data center assets in the United States and Europe. The Data Center Project Development Manager will work closely with DIG investment professionals on evaluating, financing and operating data center assets across the firm''s portfolios.

**Role description**

This role focuses on the development of hyperscale data centers, emphasizing permitting, securing access to power, and managing water and fiber optic cable availability. The candidate will have expertise in the ERCOT market and renewable energy, particularly utility-scale solar projects, to support sustainable development goals. The key responsibilities entail:

- **Data center development:**
  - Manage end-to-end development of hyperscale data centers, including site selection, permitting, and delivery into operations.
  - Work with designated EPC (Engineering, Procurement, and Construction) firms and engineering teams to coordinate site-specific requirements.
- **Power access management (ERCOT focus):**
  - Collaborate with ERCOT and utility providers to secure reliable power connections for hyperscale facilities, including participation in ERCOT''s energy markets.
  - Plan for renewable energy integration, particularly utility-scale solar, to meet sustainability targets.
  - Address grid reliability concerns by developing strategies for uninterrupted power supply during high-demand periods.
- **Telecommunications coordination:**
  - Collaborate with local telecommunication providers to secure adequate access to fiber optic cables suitable for high-density data transmission.
  - Ensure compliance with industry standards for fiber optic installation and maintenance to support scalable infrastructure.
- **Renewable energy expertise:**
  - Evaluate and implement utility-scale solar projects to offset data center energy demands, considering capacity factors and intermittency challenges.
  - Partner with renewable energy developers to integrate solar power into hybrid systems or direct procurement agreements.
- **Water resource management:**
  - Assess water requirements for cooling systems and collaborate with local utilities to secure sustainable water sources.
  - Develop strategies for efficient water use in compliance with environmental standards.
- **Permitting and compliance:**
  - Manage permitting processes for environmental, zoning, and building approvals, ensuring compliance with local, state, and federal regulations in Texas and other regions.
  - Conduct environmental impact assessments with a focus on renewable energy integration and water management.
- **Stakeholder engagement:**
  - Communicate effectively with all stakeholders, including landowners, utilities, hyperscalers and engineering teams to address project-specific needs clearly and professionally.
  - Partner with institutional-level financial sponsors to align project execution with investment strategies.
- **Project coordination:**
  - Oversee project schedules, budgets, and milestones while ensuring alignment with operational goals.
  - Coordinate with internal teams and external stakeholders to manage risks and resolve issues promptly.
- **Project management tools:**
  - Utilize basic project management tracking and reporting tools to monitor progress, manage risks, and ensure timely delivery.

**Qualifications**

- Minimum of 5–7 years of experience in data center-specific development, including delivering operational facilities.
- Experience working within the ERCOT market and knowledge of renewable power generation (especially utility-scale solar).
- Expertise in fiber optic connectivity for high-density data transmission and familiarity with industry standards.
- Formal university-level education in construction or engineering is strongly preferred.
- Prior experience working with institutional-level financial sponsors is a significant plus.
- Strong project management skills, including proficiency in tracking tools and reporting systems.

**Why join us?**

- This position offers the opportunity to work on a large portfolio of hyperscale data center assets, contributing directly to Crayhill Capital''s financial success while shaping the future of digital infrastructure development. The candidate will collaborate with industry leaders on transformative projects integrating cutting-edge technologies.
- Additional details:
  - Immediate start date: this position is available for an immediate start date due to the urgency of ongoing projects.
  - Location: the candidate will work directly with Crayhill Capital''s Digital Infrastructure Team in a collaborative environment focused on delivering world-class solutions.

This role is ideal for professionals seeking impactful work in digital infrastructure while advancing their career in a fast-growing industry.

To apply, email your CV and cover letter to [recruiting@crayhill.com](mailto:recruiting@crayhill.com).')
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    location = VALUES(location),
    sort_order = VALUES(sort_order),
    status = VALUES(status),
    content = VALUES(content),
    updated_at = CURRENT_TIMESTAMP;
