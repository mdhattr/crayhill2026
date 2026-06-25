-- Seed data: crayhill.news
--
-- The cleaned legacy WordPress posts (originally exported from the old
-- crayhill.com WordPress install, cleaned to Markdown via
-- scripts/clean-wp-posts.mjs). This file is the committed, reproducible
-- source for the news table on a fresh environment — load it AFTER the
-- schema migration 2026_06_24_003_create_news.sql.
--
-- Load via the mysql client (NOT api/lib/migrate.php — its naive ';' splitter
-- would shred the Markdown content):
--
--   mysql --host=<host> --user=<user> --password --ssl-ca=api/certs/aws-rds-ca-bundle.pem \
--         crayhill < api/seeds/news_seed.sql
--
-- Idempotent: a single INSERT ... ON DUPLICATE KEY UPDATE keyed on the unique
-- slug, so re-running updates existing rows rather than erroring.
--
-- Originally generated from a cleaned export of the legacy WordPress posts
-- (scripts/clean-wp-posts.mjs). Additional WordPress dumps are processed
-- through the same cleaning pipeline and spliced in newest-first. To edit a
-- post's content, change it directly in this file. To add more legacy posts,
-- run them through clean-wp-posts.mjs (or an equivalent that reuses the same
-- mojibake/HTML->Markdown helpers) and add the rows here.

INSERT INTO news (title, author, slug, published_date, image, status, content) VALUES
  ('Crayhill and Monarch Launch Monarch JVT Funding to Provide $300 Million for Tax Credit Transfer Partnerships', 'Crayhill Capital Management', 'crayhill-and-monarch-launch-monarch-jvt-funding-to-provide-300-million-for-tax-credit-transfer-partnerships', '2026-01-09', NULL, 'published', '**January 9, 2026 – ATLANTA (GLOBE NEWSWIRE)** — Crayhill Capital Management (“Crayhill”) and [Monarch Private Capital](https://www.monarchprivate.com/) (“Monarch”) are pleased to announce a strategic joint venture to facilitate hybrid preferred tax equity investments for renewable energy projects, including utility- scale solar, battery storage, and distributed generation projects. Crayhill has committed $300 million of capital into the joint venture, **Monarch JVT Funding. Through Monarch’s best-in-class platform, the JV will invest in tax partnerships that will facilitate fair market value tax basis for renewable energy developers.**

The JV is designed to provide a single-point solution that **maximizes project tax credit value** while **minimizing transfer friction**, supported by a single underwriting process and industry-standardized partnership and transfer documentation.

This partnership arose from Crayhill and Monarch’s familiarity and track record of success in tax equity-related transactions—success the firms expect to continue both together and independently.

Speaking about the new partnership, **Crayhill’s Shweta Kapadia, MD of Power & Infrastructure said**, “We’re excited to bring this new alternative to market. As an experienced partner and financier to development platforms with over 17 GW of utility-scale solar and battery projects financed, we appreciate the additional flexibility and simplicity this structure affords tax-inefficient developers, and those seeking more optionality relative to merchant and non-fixed contract economics. Combined with Crayhill’s pre-construction development capital, we now provide a complete pathway for renewable energy projects from early-stage development through tax-credit monetization.”

[Bryan Didier, Partner and Managing Director – Energy](https://www.monarchprivate.com/team-members/bryan-didier/) **at Monarch Private Capital,** added, “We see continued demand for this single-source financing package and are proud to partner to bring this offering to market.”

Those interested in more information about the offering should contact **Bryan Didier (Monarch)** at [bdidier@monarchprivate.com](mailto:bdidier@monarchprivate.com)

**About Crayhill Capital Management**

Crayhill Capital Management is a $2.9 billion, SEC-registered investment adviser specializing in asset-based finance. Since its founding in 2015, the firm has deployed over $4 billion across more than 50 transactions. Crayhill focuses on scalable, opportunistic asset-based investments, enabling its investors to benefit from a firm with a singular, deep focus on this specialized market. For more information, please visit [https://crayhill.com/](https://crayhill.com/)

**About Monarch Private Capital**
Monarch Private Capital manages impact investment funds that positively impact communities by creating clean power, jobs, and homes. The funds provide predictable returns through the generation of federal and state tax credits. The company offers innovative tax credit equity investments for affordable housing, historic rehabilitations, renewable energy, film, and other qualified projects. Monarch Private Capital has long-term relationships with institutional and individual investors, developers, and lenders participating in these federal and state programs. Headquartered in Atlanta, Monarch has offices and professionals located throughout the United States.'),
  ('Rostrum Pacific Secures $150 Million in Financing from Crayhill Capital Management to Accelerate Music Catalog Growth Strategy', 'Crayhill Capital Management', 'rostrum-pacific-secures-150-million-in-financing-from-crayhill-capital-management-to-accelerate-music-catalog-growth-strategy', '2025-12-11', NULL, 'published', 'Los Angeles, CA — December 11, 2025 — Rostrum Pacific (“Rostrum”), the independently operated full-service music company, announced today that it has secured $150 million in financing from Crayhill Capital Management (“Crayhill”), a $2.9 billion asset-based investment firm.

Rostrum Pacific’s framework, under the leadership of CEO Benjy Grinberg and COO Jonathan Partch, has been intentionally constructed to support rights holders at every stage. In 2023, the company united its portfolio under the Rostrum Pacific parent banner, bringing together Rostrum Records, Fat Beats, Cantora Records, and digital distribution platform SpaceHeater. The Crayhill financing marks a significant expansion of its long-term strategy to identify, acquire, and elevate meaningful music catalogs across genres and generations.

The financing partnership, led by Rostrum Pacific’s Chief Financial Officer, Scott Margolin who joined the company in 2023, enables Rostrum Pacific to pursue catalog opportunities of any scale and integrate them into its robust, fully independent, and already-established ecosystem.

“Securing this funding reflects confidence in our value-creation strategy—one that leverages strategic partnerships and collaborative frameworks to drive high-value returns,” said Margolin. “With this backing, we\'re expanding our reach and deepening our commitment to ensure that music under our care gets heard. We’re focused on catalog we can actively grow—whether it\'s assets we acquire or the catalog we’ve been building for more than 20 years.”

With these integrated assets, and significant capital backing, Rostrum Pacific is advancing its mission to be the preeminent independent music company. The deal simultaneously expands Crayhill’s media rights investments within its asset-based portfolio.

"Rostrum has built a compelling in house model that drives value creation and strategic growth, and we\'re proud to back their expansion," said Jihane Hassad, Director, TMT Investment Group at Crayhill. "As the music industry landscape evolves, Crayhill is well positioned to provide tailored capital solutions that enable Rostrum to pursue catalog opportunities of any scale and integrate them into its robust, fully independent, and already-established ecosystem."

**About Rostrum Pacific**

Rostrum Pacific is a multi-faceted entertainment company that puts music of all genres in the hands of its biggest fans. Driven by a growing ecosystem of brands—including premier independent label Rostrum Records, FatBeats, Cantora Records, and digital distribution company SpaceHeater—Rostrum Pacific is uniquely designed to support artists and rights holders at every stage of their career.

**About Crayhill Capital Management**

Crayhill Capital Management is a $2.9 billion, SEC-registered investment adviser specializing in asset-based finance. Since its founding in 2015, the firm has deployed over $4 billion across more than 50 transactions. Crayhill focuses on scalable, opportunistic asset-based investments, enabling its investors to benefit from a firm with a singular, deep focus on this specialized market. For more information, please visit [https://crayhill.com/](https://crayhill.com/)'),
  ('Crayhill Launches Lending Solution Combining Tax Equity Bridge Loans and Development Financing', 'Crayhill Capital Management', 'crayhill-launches-lending-solution-combining-tax-equity-bridge-loans-and-development-financing', '2025-08-14', NULL, 'published', '*Program provides immediate capital solutions to solar and wind developers to enhance their ability to meet new ITC requirements*

NEW YORK, August 14, 2025 — Crayhill Capital Management, an alternative asset management firm specializing in asset-based finance, today announced the launch of its Tax Equity Bridge Lending (TEBL) program as part of its expanded Pre-Construction Financing initiative, which is designed to help solar, wind, and battery developers accelerate project development schedules to meet stringent new federal tax credit requirements.

Following the passage of the "One Big Beautiful Bill Act," solar, wind, and battery projects face unprecedented construction timeline pressures. Under new regulations, projects must begin construction by July 4, 2026, or be placed in service by December 31, 2027, to qualify for federal Investment Tax Credits (ITC) and Production Tax Credits (PTC). Subsequent executive orders have only placed further pressure on developers to accelerate the deployment of their projects, which may now need to demonstrate "substantial portion" completion rather than relying on preliminary activities to qualify as having “begun construction.”

Crayhill\'s unique TEBL program addresses the financing gap as developers race to meet compressed timelines while positioning to serve unprecedented power demand growth. The program offers:

- **$50-$500 million facilities** to support pre-construction of high-quality solar and wind power-generation facilities.

- **Combined TEBL and Development Capital Facilities** that increase upfront dollar proceeds for developers while requiring less project equity.

- **Rapid project eligibility analysis** through existing engineering resources.

- **Accelerated acquisition assistance** for critical equipment procurement.

"The convergence of mounting regulatory pressure and explosive AI-driven power demand places an unprecedented level of urgency on renewable energy developers," said Shweta Kapadia, Managing Director at Crayhill. "Crayhill has already driven nearly 20GW of new power generation development, and the TEBL program expands our comprehensive financial offerings for developers in need of a single capital partner who can provide the broadest set of financing solutions with speed and certainty. Renewables will be crucial for meeting skyrocketing US energy demand, and we look forward to supporting the industry during this turbulent time.”

Crayhill’s Tax Equity Bridge Lending program provides pre-construction and construction capital against future tax equity commitments and can simultaneously provide pre-construction development capital, construction equity, and preferred equity step-up capital, allowing developers to begin substantial construction activities immediately and have a clear path to close construction financing and monetize tax credits. This innovative integrated lending solution is especially designed to enable developers to meet new "substantial portion built" requirements, secure equipment ahead of supply chain constraints, and position projects to serve the explosive growth in utility-scale power demand driven by AI infrastructure expansion.

**About Crayhill Capital Management**

Crayhill Capital Management is an SEC-registered investment adviser specializing in asset-based finance. Since its founding in 2015, the firm has deployed over $4 billion across more than 50 transactions. Crayhill is focused on scalable, opportunistic asset-based investments, enabling its investors to benefit from a firm with a singular, deep focus on this specialized market. Crayhill Capital Management is a leading provider of development and construction financing for renewable energy projects across the United States. With nearly 20GW of power generation development experience, the firm specializes in complex financing solutions for utility-scale solar, wind, and energy storage projects.

For more information about Crayhill Capital\'s Tax Equity Bridge Lending program, please see: [https://crayhill.com/power-and-infrastructure/](https://crayhill.com/power-and-infrastructure/).'),
  ('Crayhill Capital Management Hires Katherine Taylor as Managing Director, Head of Marketing and Investor Relations', 'Crayhill Capital Management', 'crayhill-capital-management-hires-katherine-taylor-as-managing-director-head-of-marketing-and-investor-relations', '2025-05-20', NULL, 'published', 'NEW YORK, May 20, 2025 — [Crayhill Capital Management LP](https://crayhill.com/), a $3 billion alternative asset management firm specializing in asset-based finance (“ABF”), today announced that Katherine Taylor has joined the firm as Managing Director, Head of Marketing and Investor Relations.

Kassie will lead and expand Crayhill’s global marketing efforts and oversee the investor relations function. Additionally, she will partner with firm leadership on the development of new products to meet the growing demands of the institutional investor community while contributing to the growth of Crayhill’s asset-based investment platform.

Prior to joining Crayhill, Taylor was a Managing Director at First Eagle Alternative Credit, the legacy THL Credit investment platform acquired by First Eagle Investments in 2020. Over the course of her nine years at First Eagle Alternative Credit, Kassie was responsible for business development, product development, strategic relationships, and fund marketing across the firm’s direct lending and tradable credit platforms. Notably, she led the development of the firm’s rated feeder and evergreen structures. Before joining THL Credit in 2016, Kassie was a Vice President and Head of Fundraising and Investor Relations at Graycliff Partners, a mezzanine and middle market private equity provider.

“We are excited to welcome Kassie to our team and look forward to leveraging her experience in business and capital development within the asset-based landscape,” said Carlos Mendez, Co-Founder and Managing Partner at Crayhill. “With her extensive network and deep knowledge of the field, we know Kassie will be an impactful addition for the continued growth of Crayhill’s platform.”

After recently closing the third vintage of its flagship ABF fund, which was oversubscribed at $1.3 billion, including $162 million of co-investment commitments, and over 75% deployed, Crayhill has been in active dialogue with new partners in the insurance solutions space and is growing its footprint in the infrastructure and data center sectors. “We view these activities as a natural extension of the firm’s expertise in ABF, where we can draw upon Kassie’s extensive product development experience and the investment team’s capabilities to meet the growing demand from institutional investors for differentiated asset-based investment solutions,” said Scott Beardsley, COO at Crayhill.

About Crayhill Capital Management

Crayhill Capital Management is a $3 billion, SEC-registered investment adviser specializing in asset-based finance. Since its founding in 2015, the firm has deployed over $4 billion across more than 50 transactions. Crayhill is focused on scalable, opportunistic asset-based investments, enabling its investors to benefit from a firm with a singular, deep focus on this specialized market. For more information please visit [https://crayhill.com](https://crayhill.com/).'),
  ('Crayhill Capital Management Closes Third Flagship Fund at Over $1.3 Billion', 'Crayhill Capital Management', 'crayhill-capital-management-closes-third-flagship-fund-at-over-1-3-billion', '2025-04-16', NULL, 'published', '*Private asset-based finance (“ABF”) specialist exceeds $1 billion target for opportunistic fund*

NEW YORK, April 16, 2025 -- [Crayhill Capital Management LP](https://crayhill.com/), a $3 billion alternative asset management firm specializing in asset-based finance, today announced the close of Crayhill Principal Strategies Fund III (“Fund III”) with approximately $1.31 billion of capital commitments, including $162 million of committed co-investment capacity, exceeding its $1 billion target.

The oversubscribed flagship Fund III attracted a diversified base of institutional investors, including large public and corporate pension plans, insurance companies, endowments and foundations, and multi-family offices, demonstrating robust institutional appetite for the firm’s differentiated private credit strategies.

“We are grateful for the overwhelming support we received from existing investors and strong demand from new limited partners,” said Josh Eaton, Co-Founder of Crayhill. “We look forward to working with all of our valued investors as we utilize our specialized capabilities to help them achieve their investment goals.”

The partner-owned firm offers an alternative to traditional private corporate lending funds, given that its ABF strategy focuses on assets with intrinsic value that can be monetized independently of a borrower’s overall performance. This provides an additional layer of protection for investors. Fund III will leverage Crayhill’s comprehensive ABF platform and risk management infrastructure to capitalize on the rapidly expanding opportunity in private asset-based investments. Demand for private debt has been driven by the regulatory and liquidity burdens of traditional lenders and borrowers’ continued need to invest and expand in a rapidly evolving global economy. Carlos Mendez, Co-Founder of Crayhill, added, “As the current market uncertainty constrains liquidity and drives up base rates and credit spreads, our ready capital provides counterparties certainty of execution for financing assets that justify a premium.”

Fund III focuses on providing capital solutions to specialty finance platforms and other asset-heavy companies across sectors including residential housing, energy, commercial real estate, media, and digital infrastructure. Fund III will target highly-structured investments backed by segregated, cash flowing assets such as loans, leases, royalties, receivables, and power purchase agreements, with a priority on achieving downside protection and a resilient expected return profile. To date, Fund III has deployed over 75% of its available capital to a diverse portfolio of investments.

**About Crayhill Capital Management**

Crayhill Capital Management is a $3 billion, SEC-registered independent investment adviser specializing in asset-based finance. Since its founding in 2015, the firm has deployed over $4 billion across more than 50 transactions. Crayhill is focused on scalable, opportunistic asset-based investments, enabling its investors to benefit from a firm with a singular, deep focus on this specialized market. For more information please visit [https://crayhill.com](https://crayhill.com/).

Media contact:

Josh Clarkson / Jake Forrestal
Prosek Partners
[pro-crayhill@prosek.com](mailto:pro-crayhill@prosek.com)'),
  ('Universal Kraft Canada Renewables secures USD 15 million credit facility for solar energy development', 'Crayhill Capital Management', 'universal-kraft-canada-renewables-secures-usd-15-million-credit-facility-for-solar-energy-development', '2025-02-11', NULL, 'published', 'Alberta, Canada – February 11, 2025 – Universal Kraft Canada Renewables, a joint venture between Korkia and Universal Kraft, announced a USD 15 million initial commitment credit facility, expandable to up to USD 50 million, with American asset-based lender Crayhill Capital Management.

As one of the largest renewable energy developers in Alberta, Universal Kraft Canada Renewables is poised to leverage this debt facility to bring its ambitious 1.7 GW of solar energy projects to operational status.

”The successful closing of this transaction validates the quality of our development work and portfolio, ensuring interconnection for our advanced projects. This achievement supports our portfolio\'s growth and strategically positions us to meet the anticipated rise in renewable energy demand once we get past the market reforms,” said **Daniela Louback**, responsible for the Canadian Business Development at Universal Kraft.

The credit facility will be used to support Universal Kraft Canada Renewables’ Generator Unit Owner Contribution (GUOC) requirements related to solar energy development in Alberta, Canada.

“This strategic move underscores the company\'s deep capabilities to bring meaningful and innovative solutions to market amidst a backdrop of significant reforms,” said **Kristina Sweet**, Canadian Country Manager for Korkia. “With Crayhill\'s support, we are well-positioned to accelerate the development of our projects, further cementing our contribution to Alberta’s renewable energy market.”

“We are pleased to provide this credit facility to Universal Kraft Canada Renewables as they advance the development of their solar energy projects in Alberta,” said **Shweta Kapadia**, Managing Director at Crayhill. “The financing demonstrates the need for bespoke capital solutions to support the development of renewable projects with benefits for investors, developers, local businesses and other stakeholders. Crayhill is well-positioned to fill these financing gaps in projects around the globe as demand for renewable energy continues to significantly grow.”

The GUOC, used in the Alberta electricity market, is a refundable payment to the Alberta Electric System Operator (AESO) required from the owner of a generating unit or aggregated generation facility. The purpose of the GUOC is to incentivize power generation construction near existing transmission capacity, and it is refunded over time based on generator size, location and performance.

**For more information, please contact:**

Kristina Sweet, Country Manager, Canada, Korkia
+358 44 3034 203, [kristina.sweet@korkia.fi](mailto:kristina.sweet@korkia.fi)

Daniela Louback, Business Developer, Universal Kraft
+351 964 299 505, [daniela.louback@universalkraft.com](mailto:daniela.louback@universalkraft.com)

Crayhill media contacts:Josh Clarkson / Jake Forrestal
Prosek Partners
[pro-crayhill@prosek.com](mailto:pro-crayhill@prosek.com)

**About Korkia **

*Korkia is an accelerator of the energy transition. We are the preferred partner for asset developers, owners and investors, throughout the value chain. Our mission is to bring renewable megawatts to the market to ensure that future generations have an economically prosperous and sustainable world to live in. We develop utility-scale renewable energy and energy storage together with project developers around the world. Currently we operate in Europe, North America and South America – but we are only getting started.*

**About Universal Kraft **

*Universal Kraft is driving the future of renewable energy by bringing over two decades of expertise to every stage of the project lifecycle—from initial concept to full operation. We are a trusted partner for developers, investors, and clients, taking projects from greenfield ideas to bankable assets across the energy value chain. With a focus on sustainable energy solutions, Universal Kraft is developing over 6 GW of power projects with a pipeline of a further 9 GW across Scandinavia, Europe, North and South America, delivering renewable energy solutions tailored to meet the needs of diverse markets. From wind and solar to battery storage, compressed air storage, green hydrogen, and ammonia, we are advancing a green power mix that addresses production, energy and price efficiency. Our mission is to combine commercial growth with positive social and environmental benefits, creating a meaningful difference and promoting a sustainable future.*

**About Crayhill Capital Management LP**

*Crayhill Capital Management LP is a New York-based, minority-owned alternative investment management firm that specializes in asset-based investment opportunities. The firm was launched in August 2015 and is registered with the U.S. SEC as an investment adviser. Crayhill strives to deliver capital solutions through tailored financing structures. Its asset-based investment strategies draw on deep sector expertise and relationships throughout the structured finance and specialty finance markets. For more information, please visit https://www.crayhill.com. *'),
  ('AMPYR Energy USA Secures Up to $200 Million Development Capital Financing Facility with Crayhill Capital Management to Accelerate Renewable Energy Projects', 'Crayhill Capital Management', 'ampyr-energy-usa-secures-up-to-200-million-development-capital-financing-facility-with-crayhill-capital-management-to-accelerate-renewable-energy-projects', '2024-12-18', NULL, 'published', 'LONG BEACH, CA and NEW YORK, NY, December 18, 2024 – AMPYR Energy USA ("AMPYR USA"), a developer of utility-scale solar and storage projects, is pleased to announce the closing of a development capital facility of up to $200 million with Crayhill Capital Management LP ("Crayhill"). This strategic partnership aims to accelerate the advancement of AMPYR USA\'s portfolio of renewable energy projects across the nation.

Amir Akhtar, Managing Director of Corporate Finance and Investments at AMPYR USA, stated, "Partnering with Crayhill underscores the robustness of our project pipeline an our commitment to delivering resilient renewable energy solutions. This facility allows us to fast-track the development of our projects."

Shweta Kapadia, Managing Director at Crayhill, commented, "We are excited to partner with AMPYR, whose expertise in the renewable energy development sector is best-in- class. This facility provides a critical funding source for pre-NTP development expenditures associated with the expansion of AMPYR’s renewable energy portfolio and will aid in the overall growth of clean energy infrastructure across the country."

Saurabh Beniwal, Partner at AGP Sustainable Real Assets and Board Member for AMPYR USA, added, "Securing this facility is a testament to our team\'s dedication and the solid foundation we\'ve built in the renewable energy landscape. It provides the flexibility needed to navigate the complexities of project development."

This development capital facility reinforces AMPYR USA\'s commitment to advancing renewable energy initiatives that offer both economic and environmental benefits. The Company remains dedicated to facilitating the energy transition and supporting a resilient, low-carbon energy grid.

**About AMPYR Energy USA**
AMPYR Energy USA specializes in the development, construction, operation, and optimization of utility scale solar power generation and co-located storage projects across all major markets in the country. AMPYR USA’s unique platform benefits from a highly experienced sponsor group: AGP Sustainable Real Assets\' extensive experience in establishing and operating GW-scale renewable platforms; Hartree Partners’ cutting-edge power trading analytics and zero-carbon solutions.

**About Crayhill Capital Management LP**
Crayhill Capital Management LP is a New York-based, minority-owned alternative
investment management firm that specializes in asset-based investment opportunities.

The firm was launched in August 2015 and is registered with the U.S. SEC as an investment adviser. Crayhill strives to deliver capital solutions through tailored financing structures. Its asset-based investment strategies draw on deep sector expertise and relationships throughout the structured finance and specialty finance markets. For more information, please visit https://crayhill.com.

**Advisors**
AMPYR USA was advised by Gibson, Dunn & Crutcher LLP and KeyBanc Capital Markets. Crayhill was advised by Latham & Watkins LLP and McGuireWoods LLP.'),
  ('Private Credit Firm Joins Rush to Partner with Banks on Direct Lending', 'Crayhill Capital Management', 'oaktree-joins-rush-to-partner-with-banks-on-direct-lending', '2024-07-24', NULL, 'published', '"Such considerations could limit which credit managers land partnerships, said Carlos Mendez, managing partner at Crayhill Capital Management, an asset-based lender, in an email.

"These cooperative asset origination relationships will be limited to private capital managers that have existing, specific asset know-how, associated risk-management infrastructure and an ability to operate in real-time in conjunction with banks\' loan origination processes," he said."

[Read the full article on FundFire >](https://www.fundfire.com/c/4575474/604144/oaktree_joins_rush_partner_with_banks_direct_lending)'),
  ('Regional Banks Want to Slim Down. Hedge Funds Smell a Bargain.', 'Crayhill Capital Management', 'regional-banks-want-to-slim-down-hedge-funds-smell-a-bargain', '2024-06-19', NULL, 'published', 'Article originally published in [The Wall Street Journal](https://www.wsj.com/finance/banking/regional-banks-want-to-slim-down-hedge-funds-smell-a-bargain-f4e1d0fe)

Regional banks around the U.S. are striking complex and costly bargains with hedge funds, hoping to insulate themselves from a replay of the turmoil that followed Silicon Valley Bank’s failure last year. Wall Street smells a payday.

Ohio-based Huntington Bancshares recently entered into an arrangement to sell investors some of the risk that its borrowers won’t repay their loans. That helps the bank meet [new proposed standards](https://www.wsj.com/articles/banks-stock-buybacks-basel-endgame-50fb9e7c?mod=article_inline) meant to make lenders look healthy to regulators.

The deal is known on Wall Street as a synthetic risk transfer, and it offers cash-flush, private-debt fund managers—such as Ares Management and [Blackstone](https://www.wsj.com/market-data/quotes/BX)—an attractive investment. Bayview Asset Management, the fund involved in Huntington’s December deal, stands to make as much as 15% on the trade and a similar one done for SoFi Bank, people familiar with the matter said.

Now others are doing the deals, too. Large regional lenders including Utah-based Ally Bank and North Carolina-based [Truist Financial](https://www.wsj.com/market-data/quotes/TFC) are working on their own transactions to sell the risk on billions of dollars of loans, according to the data provider Finsight and letters to the banks from the Federal Reserve.

Regulators are forcing the banks to meet stricter rules to protect themselves from crises of confidence, such as the ones that [toppled SVB](https://www.wsj.com/articles/svb-financial-pulls-capital-raise-explores-alternatives-including-possible-sale-sources-say-11de7522?mod=article_inline) and recently shook New York Community Bank. Ultimately, risk transfers should help banks stabilize and start spending money again on such things as share buybacks and acquisitions, analysts said.

“You could call it aggressive defense,” said Ken Usdin, a banking analyst at Jefferies. “They are optimizing for regulatory capital, but they are paying up for it.”

#### New regulations loom

U.S. banks are preparing for new regulations announced last year after the regional-bank failures. They are expected to force midsize banks to meet [capital requirements](https://www.wsj.com/livecoverage/stock-market-today-dow-jones-08-29-2023/card/big-regional-banks-face-new-rules-for-dealing-with-a-crisis-wZG2hv7xDV9XH1NUvweG?mod=article_inline) previously only applied to large financial institutions.

“We expect we will be in capital-preservation mode as we kind of see how all of that unfolds,” Ally Chief Financial Officer Russ Hutchinson said at a recent investor conference. Risk transfer “becomes a very attractive way for us to reduce risk-weighted assets and effectively preserve capital,” he said.

Historically, U.S. banks created a financial cushion by increasing capital through stock sales, or by selling loans. Many of the loans they own were made when rates were low, meaning they would take a loss if they sold them now. Selling new shares could push [already-battered stock prices lower](https://www.wsj.com/finance/banking/regional-banks-had-another-ugly-quarter-db141a0e?mod=article_inline).

Late last year, the Fed gave U.S. banks another option, by letting them increase regulatory capital through risk transfers, a tool long employed by European banks.

About 20 U.S. synthetic transactions have been done, totaling $17 billion, compared with about $190 billion in Europe, said Kathy Jones, a structured-products trader at Raymond James. The U.S. could quickly outstrip Europe once smaller, regional banks start adopting the product, she said.

#### Offloading Risk

In synthetic risk transfers, an investor agrees to effectively insure a bank on potential losses tied to a pool of loans the bank holds.

[Merchants Bancorp](https://www.wsj.com/market-data/quotes/MBIN), a relatively small Indiana-based lender, got the green light from the Fed this month for a synthetic risk transfer, according to a letter from the regulator.

Banks can transfer risk in two ways: One is selling so-called credit-linked notes to investors, boosting the banks’ balance sheets. Another is purchasing credit insurance from the investors, who post cash as a backstop. The banks pay interest or premiums to the investors. The investors are on the hook for losses from any defaults on the insured loans. Both options cover losses from defaults on as much as 12.5% of a loan pool.

That cost drags down profitability, which is already falling. [Regional-bank stocks fell](https://www.wsj.com/livecoverage/stock-market-today-dow-sp500-nasdaq-live-06-10-2024/card/huntington-bancshares-stock-falls-weighing-on-regional-banks-BVvY27ddYhiNexfcPtpJ?mod=article_inline) last week after Huntington lowered guidance for net interest income, the difference between what it makes from loans and what it pays on deposits.

#### A hot Wall Street product

Banks such as [JPMorgan Chase](https://www.wsj.com/market-data/quotes/JPM) and [Morgan Stanley](https://www.wsj.com/market-data/quotes/MS) issued a [flurry of synthetic risk transfers](https://www.wsj.com/finance/banking/bank-synthetic-risk-transfers-basel-endgame-62410f6c?mod=article_inline) for themselves last fall. Now they are arranging deals for regional lenders—for a fee—and hope to start trading the instruments if the market gets big enough.

Morgan Stanley helped raise financing for Huntington’s transaction with Bayview. JPMorgan is currently marketing a risk transfer for Ally to investors and a second risk deal for Huntington that doesn’t involve Bayview.

Others are laying the groundwork for when smaller banks could issue risk transfers. The private-credit fund Crayhill Capital Management has retained as an adviser Tom Killian, an investment banker who helped pioneer the market for bonds backed by community banks’ preferred securities in the 2000s. Killian has held informal talks with banks and regulators about risk transfers, aiming to eventually help small banks access the market, according to a person close to the fund manager.

For money managers, bank risk transfers offer high returns and a new product to pitch to investors eager to buy into the [red-hot market](https://www.wsj.com/finance/investing/private-equity-wants-your-credit-card-debt-and-car-loan-and-mortgage-49be8938?mod=article_inline) for private credit. [BlackRock](https://www.wsj.com/market-data/quotes/BLK), the private-fund specialist [KKR](https://www.wsj.com/market-data/quotes/KKR) and the French insurer [AXA](https://www.wsj.com/market-data/quotes/FR/XPAR/CS) have all published reports hawking them.

Florida-based Bayview has come up with a twist on the complicated deals: borrowing money in bond markets to enhance its returns. Bayview manages about $20 billion and specializes in buying mortgage and consumer loans, often from such banks as Huntington. The firm has been pitching banks risk-transfer deals for at least five years, people familiar with the fund manager said.

Bayview offered to sell Huntington credit-default swaps, a type of insurance, to reduce capital charges on a pool of about $3 billion in car loans. The bank agreed to pay a 7.5% annual premium, and Bayview committed to compensating the bank for seven years for any defaulted car loans up to $375 million, or 12.5% of the loan pool.

To back up that commitment, Bayview issued about $315 million of bonds at a blended interest rate of about 6.75%. Cash from the bonds went into an interest-bearing account. Over time, the bonds will be paid off with money from Huntington’s premiums, the money in the account and accrued interest. Bayview will pocket the difference. If defaults on the auto loans exceed Bayview’s projections, the fund could take a loss.'),
  ('The Surging Impact of Non-Bank Asset-Based Lenders in Commercial Finance', 'Crayhill Capital Management', 'the-surging-impact-of-non-bank-asset-based-lenders-in-commercial-finance', '2023-10-31', NULL, 'published', '[Watch the interview on ABL Advisor.](https://www.abladvisor.com/articles/37405/the-surging-impact-of-non-bank-asset-based-lenders-in-commercial-finance)

Carlos Mendez, a Co-Founder and Managing Partner at Crayhill Capital Management, meets with Michael Toglia, Publisher of ABL Advisor. In this interview, Mendez focuses on the burgeoning influence of non-bank asset-based private credit providers within the lending market. Mendez covers a diverse array of topics, addressing the reasons behind banks\' withdrawal from this domain and the newfound opportunities emerging for non-bank entities. He also emphasizes the importance of safeguarding against credit deterioration and pinpoints sectors with growth potential.'),
  ('Crayhill Capital Management Provides Capital Facility to E2M Ventures', 'Crayhill Capital Management', 'crayhill-capital-management-provides-capital-facility-to-e2m-ventures', '2023-10-17', NULL, 'published', 'NEW YORK, NY, October 17, 2023 – Crayhill Capital Management LP (Crayhill), a New York-based, minority-owned private credit manager focused on asset-based investments, announced the closing of a $50mm capital facility with E2M Ventures (“E2MV”), a real estate investment firm focused on middle market debt and equity.

The facility is expressly designed to facilitate E2MV’s ability to offer “gap financing” solutions to real estate sponsors primarily across the Central and Western United States. The program will enable E2MV to provide sponsors access to thoughtfully structured financing to address existing maturities and pursue new projects amidst a more volatile rate and asset valuation environment.

“We are thrilled to be partnering with E2MV by providing them with a capital solution uniquely tailored to best serve the evolving needs of their clients,” said Sloan Sutta, Managing Director of Crayhill Capital Management. “There is an increasing demand for bespoke solutions among real estate sponsors, and we are excited to develop and scale this strategy with E2MV’s experienced team to meet strong market demand. This transaction is emblematic of Crayhill’s approach to working with high caliber origination and management teams to deliver value for investors, sponsors and stakeholders.”

“Our partnership with Crayhill reflects a shared vision and commitment to meet the growing need for flexible capital among real estate sponsors,” Marc Perusse, President & CEO of E2M Ventures, commented. “We view E2MV’s specialty of small-balance preferred equity and mezzanine debt as especially well-suited to serve sponsors’ needs in today’s environment and are excited to work with an outstanding partner in Crayhill to build on our strong momentum and continue our robust growth trajectory.”

E2MV was represented in the transaction by Herman Enayati and Geoffrey Perusse with Rimon, P.C. Crayhill was represented in the transaction by Sutton, Pakfar & Courtney, LLP.

**About Crayhill Capital Management**

Crayhill Capital Management is a New York-based, minority-owned alternative asset management firm that specializes in asset-based investment opportunities. The firm was launched in August 2015 and is registered with the U.S. SEC as an investment adviser. Crayhill strives to deliver capital solutions through tailored financing structures. Its asset-based investment strategies draw on deep sector expertise and relationships throughout the structured finance and specialty finance markets. For more information, please visit [https://crayhill.com](https://crayhill.com).

**About E2MV**

Based in Denver, CO, E2M Ventures operates three specialized divisions. E2MV Capital provides tailored capital solutions with expertise in Small-Balance Preferred Equity and Mezzanine Debt. E2MV Investments acquires compelling real estate projects, collaborating with established local operators as their Co-GP. E2MV Advisors, boasting 45 years of combined CRE expertise, delivers holistic consulting and brokerage services to lenders, owners, and investors. Learn more at [https://e2mventures.com](https://e2mventures.com/).'),
  ('Crayhill Capital Management Provides $100mm Senior Secured Loan Facility to Fort Amsterdam Capital', 'Crayhill Capital Management', 'crayhill-capital-management-provides-100mm-senior-secured-loan-facility-to-fort-amsterdam-capital', '2022-07-18', NULL, 'published', '*Term loan facility used to fund private lender’s origination of covered land loans to developers and*s*ponsors in the northeast U.S.*

New York, July 18, 2022 – Crayhill Capital Management, a New York-based, minority-owned private credit manager focused on asset-based investments, announced today the close of a $100mm credit facility with Fort Amsterdam Capital, a New York-based, vertically-integrated real estate lender. The facility will be collateralized by both land and commercial real estate properties in the Northeast Corridor.

Fort Amsterdam Capital has deployed in excess of $200 million in debt investments across more than 40 transactions since launching in 2015. The firm focuses on high yield bridge loans collateralized by multifamily, mixed use, hospitality and other property types in top MSAs across the United States, with a focus on the Northeast region.

The facility, which has a two-year term, will primarily support the issuance of covered land loans ranging in size from $10-50 million.

Sloan Sutta, Managing Director and Head of Structured Real Estate at Crayhill said, “We have incredible respect for David and the Fort Amsterdam team and are excited to provide them with this credit facility to enable the continued development of their business. This type of bespoke, flexible facility for a growing sponsor with a differentiated investing approach is exactly the type of situation where we are best positioned to be a value-added partner to a borrower. We are proud to support Fort Amsterdam’s continued success.”

“We are thrilled to be working with such a collaborative and thoughtful capital partner in Crayhill,” commented David Schwartz, Managing Partner of Fort Amsterdam Capital.

“Our two firms have similar fundamental approaches to real estate credit investing and both see a compelling market opportunity in the current rising rate environment. We look forward to utilizing this capital to expand our business and accelerate our growth.”

**About Crayhill Capital Management**

Crayhill Capital Management is a New York-based, minority-owned alternative asset management firm that specializes in asset-based investment opportunities. The firm was launched in August 2015 and is registered with the U.S. SEC as an investment adviser. Crayhill strives to deliver capital solutions through tailored financing structures. Its asset- based investment strategies draw on deep sector expertise and relationships throughout the structured finance and specialty finance markets. For more information, please visit [https://crayhill.com](https://crayhill.com) or email [info@crayhill.com](mailto:info@crayhill.com).

**About Fort Amsterdam Capital**

Fort Amsterdam Capital is a seasoned real estate debt platform that originates short- term, high yielding bridge loans ranging in size from $5 - $100mm in the top MSAs across the United States with a focus on the Northeast Corridor.'),
  ('Crayhill Capital Management Names Daniel Shlomi as General Counsel', 'Crayhill Capital Management', 'crayhill-capital-management-names-daniel-shlomi-as-general-counsel', '2022-05-05', NULL, 'published', 'New York, N.Y., May 5, 2022 – Crayhill Capital Management LP (“Crayhill”), a New York- based, minority-owned private credit manager focused on asset-based investments, today announced the appointment of Daniel Shlomi as General Counsel.

Mr. Shlomi will be responsible for all legal matters and processes across the firm. This will include leveraging his deep expertise to work alongside Crayhill’s investment team to manage the full spectrum of deal documentation that supports the firm’s investment activities.

Prior to joining Crayhill, Mr. Shlomi was an attorney at Akin Gump Strauss Hauer & Feld LLP from 2012 to 2022. At Akin, Mr. Shlomi focused on commercial real estate transactions, including the acquisition, sale, development and financing of real estate and real estate-based assets. He advised a variety of clients in the real estate industry, including investment funds, home office and individual investors, REITs, commercial developers and institutional lenders.

“We, and our investors, are gaining access to tremendous expertise by bringing on Daniel, who we have worked closely with in the past during his time at Akin and long been impressed by. His deep experience in understanding, negotiating and managing the legal framework underpinning our private credit investing activities will provide us with enormous leverage as we continue to successfully scale and grow our firm,” stated Josh Eaton, Co-Founder and Managing Partner at Crayhill.

“I am excited to join such a talented team during this exciting phase in Crayhill’s growth. I look forward to contributing to Crayhill’s expansion in the asset-based private credit space through its development and deployment of creative financing solutions.” added Mr. Shlomi.

**About Crayhill Capital Management**

Crayhill Capital Management LP is a New York-based, minority-owned alternative asset management firm that specializes in asset-based investment opportunities. The firm was launched in August 2015 and is registered with the U.S. SEC as an investment adviser. Crayhill strives to deliver capital solutions through tailored financing structures. Its asset- based investment strategies draw on deep sector expertise and relationships throughout the structured finance and specialty finance markets. For more information, please visit [https://crayhill.com](https://crayhill.com) or email [info@crayhill.com](mailto:info@crayhill.com)'),
  ('QuadFi Secures US $100M (CAD $127M) Financing Facility with Crayhill Capital Management', 'Crayhill Capital Management', 'quadfi-secures-us-100m-cad-127m-financing-facility-with-crayhill-capital-management', '2022-04-20', NULL, 'published', 'TORONTO, April 20, 2022 -- [QuadFi](https://quadfi.com/), a mission driven global fintech firm headquartered in Canada, today announced that it has entered into an agreement for a new financing facility of up to US $100M (CAD $127M) with Crayhill Capital Management, a New York-based minority-owned private credit manager.

The facility will be used by QuadFi to provide personal loans to people with limited credit history, but with a strong current income and a bright financial outlook, including young people and immigrants.

Unlike traditional risk rating models which rely only on the historical behavior and income of customers, QuadFi\'s novel and adaptive underwriting model is forward-looking and considers a customer\'s future income and career trajectory. This innovative model is especially useful for customers with thin credit history but bright prospects, mainly newcomers, and younger demographic groups.

Further, the company offers immigrants the benefit of utilizing their home country financial history even after having left. Dr. Manny Nikjoo, Co-Founder and CEO of QuadFi noted, "Canada welcomes 400,000 new immigrants every year – and they deserve access to fair and affordable financial products. Our model incorporates credit data from their home countries, alternative data and open banking to provide accurate underwriting and deliver financial inclusion today. This partnership allows us to take a big step toward achieving our long-term pursuit of fostering financial inclusion and helping our customers, who are young, ambitious and educated, achieve the financial access they deserve. Crayhill understands our objectives, and now we have the runway to accelerate our growth, which will have benefits for our customers, investors, and communities," said Dr. Nikjoo. He added, "Our data-driven approach to lending was created to replace the outdated financial practices that currently lead to inequality of access to financial products for all groups."

"We are incredibly excited to partner with QuadFi and support their mission-driven growth. We believe that their cutting-edge technology and business model will enable them to deliver value to investors, clients and stakeholders across the economy," said Sloan Sutta, Managing Director at Crayhill Capital Management.

**About QuadFi**

QuadFi provides underserved credit groups, including immigrants and young people, with access to fair and affordable financial products. The company leverages data science to challenge outdated, biased, inaccurate underwriting, combining alternative data from domestic and international sources with proprietary AI/ML modeling.

QuadFi identifies opportunities to address financial exclusion by focusing on the intersection of global migration, financial data, and personal data. Created by first-generation immigrants and proudly based in Toronto, Canada, QuadFi is building a borderless financial future.

For more information on Quad-Fi, please contact Mehdi Ghaffari at [m.ghaffari@quadfi.com](mailto:m.ghaffari@quadfi.com).

**About Crayhill Capital Management**

Crayhill Capital Management LP is a New York-based, minority-owned alternative asset management firm that specializes in asset-based investment opportunities. The firm was launched in August 2015 and is registered with the U.S. SEC as an investment adviser. Crayhill strives to deliver capital solutions through tailored financing structures. Its asset-based investment strategies draw on deep sector expertise and relationships throughout the structured finance and specialty finance markets. For more information, please visit [https://crayhill.com](https://crayhill.com) or email [info@crayhill.com](mailto:info@crayhill.com).'),
  ('Urban Grid Closes $275M Debt Refinance Provided By Crayhill Capital Management', 'Crayhill Capital Management', 'urban-grid-closes-275m-debt-refinance-provided-by-crayhill-capital-management', '2021-10-12', NULL, 'published', '[Urban Grid](https://www.urbangridsolar.com/), one of the largest U.S. greenfield renewable energy project developers, announced today that it has expanded and extended its partnership with [Crayhill Capital Management](https://crayhill.com/), a New York-based, minority-owned private credit manager focused on asset-based investments in the renewable energy sector.

The financing provides Urban Grid with $275M of flexible, efficient capital that will be deployed to advance projects into the construction phase and continue the scale up of Urban Grid\'s solar and energy storage platform.

"Since 2019, our partnership with Crayhill Capital Management has enabled the growth and supported select project monetizations of our solar PV and energy storage pipeline," said Frank DePew, Urban Grid Founder & CEO. "Access to this highly flexible capital enables our team to take projects through final development and into operations, across multiple regions, benefiting the surrounding clean power economy while enhancing the value of our entire platform."

Today, the Urban Grid project pipeline includes 12.7 GWDC of PV and 3.7 GWAC of co-located and stand-alone energy storage.

"Crayhill is excited to continue its partnership with the Urban Grid team and support the growth and development of its business," said Josh Eaton, Managing Partner of Crayhill Capital. "The demand for high-quality solar projects continues to be robust and Urban Grid is positioned to extend its leadership role in U.S. utility-scale solar and storage development. We continue to be enthusiastic about leveraging our expertise in greenfield solar project financing to aid in the global energy transition."

In the past 2+ years, Urban Grid has efficiently expanded its team to over 60 people, deepening its in-house development, engineering and project origination expertise and built proprietary technology across the platform. The continuation of the Urban Grid and Crayhill partnership is significant and reinforces the firm\'s capabilities – to efficiently and profitably deploy capital ­– as it readies to deploy at least 8 GW of clean power over the next five years.

**About Urban Grid**
Urban Grid is a utility scale renewable energy project developer, with over a decade of expertise in taking solar and energy storage projects through the full development process, from site acquisition through interconnection, permitting, offtake execution and project exit. Headquartered in Richmond, Virginia–with teams located strategically throughout the United States–Urban Grid has provided utilities and corporate clients with reliable clean energy. We are actively developing a growing portfolio of over 12.7 GWDC solar PV and 3.7GWAC of co-located / stand-alone energy storage, throughout 12 states in support of America\'s transition to clean, sustainable power. To learn more, please visit [UrbanGridSolar.com](https://www.urbangridsolar.com/).

**About Crayhill Capital Management**
Crayhill Capital Management is a New York-based, minority-owned alternative asset management firm that specializes in asset-based investment opportunities. The firm was launched in August 2015 and is registered with the U.S. SEC as an investment adviser. Crayhill strives to deliver capital solutions through tailored financing structures. Its asset-based investment strategies draw on deep sector expertise and relationships throughout the structured finance and specialty finance markets. For more information, please visit [https://crayhill.com](https://crayhill.com/) or email [info@crayhill.com](mailto:info@crayhill.com).'),
  ('Crayhill Renewables and Exelon Power Services Launch Generation Management and Developer Financial Services Platform', 'Crayhill Capital Management', 'crayhill-renewables-and-exelon-power-services-launch-generation-management-and-developer-financial-services-platform', '2021-09-14', NULL, 'published', 'Article originally published in [PR Newswire](http://www.powerfinancerisk.com/Article/3971993/Hedging-and-Offtake-Strategies-Roundtable-202021.html#/.YA7y99hKjIU)

Integrated generation management and financial services platform combines project financing and generation together into a single offering.

Crayhill Renewables, the Nashville-based renewables affiliate of Crayhill Capital Management, and Exelon Generation Company, LLC, doing business as Exelon Power Services, operator of more than 30 gigawatts of generation assets, announced today a comprehensive lifecycle management program designed to support renewable energy projects by offering end-to-end financing and operational services.

The partnership provides the industry with a unique combination of renewable developer solutions that include pre-Notice to Proceed ("pre-NTP") lending, transmission and development advisory, take-out equity from Crayhill Renewables, and post-Commercial Operations Date operating solutions from Exelon Power Services. Exelon Power Services combines the company\'s operational expertise with its industry leading customer business to provide a complete spectrum of power plant management.

This package offers project developers a single integrated solution for both financing and generation management, simplifying the complex path between early-stage development and project operations. This in turn will help accelerate the energy transition by empowering developers through Crayhill Renewable\'s flexible capital products and Exelon Power Services\' capabilities in plant operations, energy management and other areas of support.

"This innovative program is designed to provide our customers with a full range of services to enable them to quickly bring renewable projects to market," said Glen Robinson, Vice President of Exelon Power Services. "Our combined ability to offer capital, marketing and operations expertise can de-risk projects through their entire life cycle."

Erick Bauman, Managing Director of Crayhill Renewables, added, "We\'re excited to partner with Exelon Power Services and bring to market these much-needed solutions for our project development partners. Crayhill and its principals have invested over $1 billion in pre-NTP assets. Now, our development partners can leverage the collective resources, knowledge and analytics of Crayhill and Exelon to scale their businesses rapidly to meet the growing demand for renewable energy across the United States."

For more info visit the webpage: [https://crayhillrenewables.com/#accelerantprogram](https://crayhillrenewables.com/#accelerantprogram); or, connect via email at: [hello@AccelerantProgram.com](mailto:hello@AccelerantProgram.com).

**About Exelon Generation **

Exelon Generation Company, LLC, a subsidiary of Exelon Corporation (Nasdaq: [EXC](https://www.prnewswire.com/news-releases/crayhill-renewables-and-exelon-power-services-launch-generation-management-and-developer-financial-services-platform-301375846.html#financial-modal)), is the nation\'s largest producer of carbon-free energy, powering more than 20 million homes and businesses through a diverse generation fleet with approximately 30,000 megawatts of capacity. Exelon Generation owns and operates the largest U.S. fleet of zero-carbon nuclear plants with more than 17,800 megawatts from 21 reactors at 12 facilities in Illinois, Maryland, New York and Pennsylvania. It also owns and operates a diverse mix of wind, solar, hydroelectric, natural gas and oil facilities in 18 states with approximately 12,000 megawatts. Exelon Generation sets the standard for world-class power plant operations that produce clean, safe, reliable electricity, and is an active partner and economic engine in the communities it serves by providing jobs, charitable contributions and tax payments that help towns and regions grow. Follow Exelon Generation on Twitter @ExelonGen, view Exelon Generation YouTube channel, or visit [www.exeloncorp.com](http://www.exeloncorp.com).

**About Crayhill Capital Management**

Crayhill Capital Management is a New York-based, minority-owned alternative asset management firm that specializes in asset-based investment opportunities. The firm was launched in August 2015 and is registered with the U.S. SEC as an investment adviser. Crayhill strives to deliver capital solutions through tailored financing structures. Its asset-based investment strategies draw on deep sector expertise and relationships throughout the structured finance and specialty finance markets. For more information, please visit [https://crayhill.com](https://crayhill.com) or email [info@crayhill.com](mailto:info@crayhill.com).'),
  ('Crayhill Capital Management Closes Second Principal Strategies Fund at $820 Million', 'Crayhill Capital Management', 'crayhill-capital-management-closes-second-principal-strategies-fund-at-820-million', '2021-09-08', NULL, 'published', 'Article originally published in [PR Newswire](https://www.prnewswire.com/news-releases/crayhill-capital-management-closes-second-principal-strategies-fund-at-820-million-301371030.html)

NEW YORK, Sept. 8, 2021 /PRNewswire/ -- [Crayhill Capital Management](https://crayhill.com), a New York-based, minority-owned private credit manager focused on asset-based investments, today announced the final close of Crayhill Principal Strategies Fund II ("Principal Strategies II") with approximately $820 million of capital commitments.

Principal Strategies II closed at its hard cap with support from a diversified base of existing and new institutional investors, including public and corporate pension plans, insurance companies, foundations, and endowments. In total, Crayhill\'s discretionary assets under management now exceed $1.6 billion.

Principal Strategies II will build on Crayhill\'s debut Principal Strategies Fund and continue its asset-based private credit strategy, where Crayhill capitalizes on niche but deep market opportunities created by supply and demand imbalances of capital within its targeted investment themes. The Crayhill team has significant expertise in sourcing, structuring, and monitoring asset-based investments across the specialty finance marketplace and a deep understanding of the capital needs and growth cycles of these borrowers. Principal Strategies II will focus on providing flexible and scalable capital solutions to specialty finance platforms focused on targeted sectors including renewable energy, trade receivables, specialty real estate, equipment finance, and media. To date, Principal Strategies II has already deployed a significant amount of capital and built a diverse portfolio of eight investments across many of these sectors.

"We are thankful for the strong support from our existing limited partners and are thrilled to welcome in Principal Strategies II a diverse group of new high-caliber institutional investors and their consultants," said Joshua Eaton, Co-Founder of Crayhill Capital Management. "We are grateful that our partners share our excitement for the opportunities we are pursuing and recognize our expertise in creating bespoke financing solutions to serve this growing segment of the private credit marketplace."

Carlos Mendez, Co-Founder of Crayhill Capital Management, added, "We will continue to leverage our strength in direct, proprietary sourcing driven by our thematic investment approach to build a diversified portfolio across industry sectors. We are very excited by the opportunity set in asset-based private credit to deliver income with downside protection, upside optionality, and uncorrelated exposures to our partners."

**About Crayhill Capital Management**

Crayhill Capital Management is a New York-based, minority-owned alternative asset management firm that specializes in asset-based investment opportunities. The firm was launched in August 2015 and is registered with the U.S. SEC as an investment adviser. Crayhill strives to deliver capital solutions through tailored financing structures. Its asset-based investment strategies draw on deep sector expertise and relationships throughout the structured finance and specialty finance markets. For more information please visit [https://crayhill.com](https://crayhill.com/) or email [info@crayhill.com](mailto:info@crayhill.com).'),
  ('PFR Hedging and Offtake Strategies Roundtable 2020/21', 'Crayhill Capital Management', 'pfr-hedging-and-offtake-strategies-roundtable', '2021-02-09', NULL, 'published', 'Article originally published in [Power Finance & Risk.](http://www.powerfinancerisk.com/Article/3971993/Hedging-and-Offtake-Strategies-Roundtable-202021.html#/.YA7y99hKjIU)

#### Editor\'s Note

*Reports of the death of the long-term investment grade utility power purchase agreement, settled at the busbar, may have been a tad exaggerated. *

*Such contracts are still out there, if you know where to look. For it is not universally true that utility companies have comfortably exceeded the requirements of their state renewable portfolio standards. Besides which, in some service territories, wind and solar may anyway be the cheapest option to replace coal-fired plants that are due to retire. Some developers even feel it is still worth the effort to go toe-to-toe with a recalcitrant load-serving entity before the state public utility commission over the pricing of an avoided cost PURPA PPA. *

*But even if the long-term utility PPA were to disappear completely, there are some people who would not mourn its demise. *

*Because after working their socks off to get hold of one of these contracts, developers may wonder whether it was worth it. Bidding in requests for proposals is so competitive these days that they may walk away with less than $20/MWh. Developers of renewable energy projects have been telling PFR for years that what they would really like to do is go completely merchant. They believe in their product, and they are bullish on the market for it. *

*The only catch is that they need financing, especially tax equity, and they are not going to get that, as a rule, without some contracted cash flows. Not in this market. *

*Contracts for difference, swaps of various flavors, price floors and ceilings, insurance products, parent guarantees and letters of credit have all been introduced, either individually or in concert, in an attempt to bridge the gap between what the developers want – upside – and what tax equity investors and lenders want – certainty. The result is a sometimes bewildering array of financial products, each of which shifts risk from one party to another. When it works, it’s great. Everyone gets what they want. But when it doesn’t work… disaster! *

*So, in order to deepen our understanding of the benefits and the pitfalls of advanced hedging and offtake strategies, PFR brought together a group of experienced market participants to share their perspectives and insight, as well as the latest trends and innovations, in this lively discussion. *

*Enjoy!*

***Richard Metcalf***

*Editor*

**PFR: Traditional utility PPAs have been harder to come by in recent years, which means that sponsors are increasingly going to commodity trading desks to get power hedges. What are the key factors to consider when selecting a hedge product in terms of the risks covered, like basis, weather, counterparty and credit?**

**Emilie Wangerman, Lightsource BP:**We still have a pretty balanced portfolio. Merchant is a great opportunity to increase your revenue and benefit from overall a different customer base. On the other hand, we do still have the unicorn of the 20-, 25-year PPAs with the utilities. That\'s important for us to maintain balance in our portfolio.

There is also a lot of growth in merchant types of products. We\'re saying merchant, but in reality what you just asked about – hedges, things like that – aren’t truly merchant. There is a difference between truly going merchant and then short-term contracting or hedges or things like that.

For us, the key risks that we see are around the counterparty are their credit quality and the term of the deal. As we get to a shorter tenor, we run into the risk of being able to finance and having limited tax equity available in the market. Are tax equity investors going to take a 12-year hedge or a 10-year hedge? Or are they going to want something that is a 25- year PPA?

Then, as you mentioned, there is the product itself. Any time you move away from the busbar on to a hub-settled PPA or contract, then you\'re going to introduce that basis risk, which isn\'t necessarily just for these types of products. Even a virtual PPA or a physical PPA would incur that basis risk.

**John Bills, Cantor Fitzgerald:** I would agree. From our perspective, we focus on the particular parts of the capital structure and what those parts may need. To the extent that it\'s tax equity, as Emilie mentioned, those are traditionally the important aspects needed. We\'ve also been able to structure deals that rely upon parent guarantees, letters of credit and other forms of protection that ensure that the tax equity does not end up in a situation where they don\'t want to be, with respect to challenged ability to produce the tax credits or to receive the investment tax credit.

So we really focus on what\'s necessary for a given deal to make that work, and we\'re unafraid to structure something which doesn’t have that traditional PPA, or where your corporate PPA has basis risk, or you have a shorter-dated hedge. How do you still find a way to get sufficient capital from tax equity investors to make the deal work? How do you make that meet the risk-reward profile for the equity investors that are part of the capital structure?

Then, to the extent that debt may be involved – not typically done in wind or solar deals, but in battery storage, where it may be standalone and unable to raise tax equity – how do you think about what the lenders may need in that scenario?

So certainly, covering counterparty credit risk in that regard, basis risks, weather risks, etc., are all part of the equation that one has to manage, and also manage it across different investor classes.

**Jeff McAulay, Energetic:** I definitely agree with the themes highlighted here. At Energetic Insurance, we focus on counterparty credit risk, which shows up in a number of different places. Debt and, particularly, tax equity is driving the bus these days for those requirements of what you need to see in a counterparty.

Certainly, utility credit, in some cases, is not what it used to be. There have been a few scares on the West Coast. It’s unclear if that means, ‘Whew! We got through that, utility credit is completely unassailable,’ and that\'s what that proved, or: ‘Wow! We came really close – I’m not sure how that\'s going to go from here.’

As well as CCAs [community choice aggregators] – this is kind of a new animal, and there’s a lot of uncertainty about how to treat CCA credit. So even at that traditional utility level, there are some question marks.

Then, obviously, there’s the huge groundswell over the past decade of corporate PPAs. The contracts for differences are with very large, very sophisticated buyers. We\'re seeing a lot of those large, 100% renewable energy purchase obligations go through, and now there aren\'t as many to be had. How many times can you go 100% renewable?

What we\'re seeing now is that those large tech companies, the first movers there, **Walmart**, **Amazon**, **Facebook**, **Google**, **Apple**, all those, are pushing those requirements down through their supply chain, which means less creditworthy counterparties. We\'re seeing compression in terms of the term of the PPA they\'re willing to sign. So all of this comes back to: How do you get financiers comfortable with some of those risks?

Project finance, as we all know, is about allocation of risk. So we\'re looking for creative ways to help people fill the gaps and get these deals financed.

**Ian Cuillerier, White & Case:** By the time the lawyers get involved, often, the front end discussions and structuring may have already transpired, limiting the options. So I\'m reacting to what I see come across my desk, and all these discussions have already transpired. What I do see is that often the tension is between what the sponsors retain for themselves as upside in the balance of how much of a given project is going to be merchant, and how much is going to be dedicated already, committed to longer-term contracts. Then the other tension is on the terms of what is going to be demanded by the lenders or the financing parties to insist on this risk needing to be hedged or that risk.

To the extent there are corporate players, their interests and their requirements are going to be much different. What story can they tell their shareholders? How are they going to present it? What level of complexity?

Counterparty risk, as everyone has said, will limit the options available to some players in the market.

**Bills, Cantor Fitzgerald:** On that last point, and what Jeff mentioned earlier about CCAs in California, as well as utilities and maybe other entities in California that are willing to enter into resource adequacy contracts, we\'ve done a series of transactions on the debt side in California that have involved CCAs, in some cases unrated, in some cases with shadow or private ratings, in some cases with public ratings. So we\'ve spent a lot of time educating and bringing in lenders that were unfamiliar with them, as well as dealing with risk related to large utilities there that may have had some challenging credit points in the past, and other types of entities.

The lender universe is shifting away, on the thermal side, from the PJM Interconnection deals, and trying to find other deals that are out there. We\'re helping package that risk for them and have been successful in doing that in California and now in ERCOT, and have more in both of those markets.

So both in terms of the type of contracts and the counterparties, there are a lot of tools in the toolkit, and we\'re trying to make sure we bring those to bear into markets that are outside of PJM on the thermal side.

**Wangerman, Lightsource:** I am frequently battling the ever-tightening constraints of tax equity relative to the rapid growth in demand from offtakers, who are also requiring more constraining contract terms. Even in situations when the offtaker has strong creditworthiness, the project economics are strong, and the offtake contract terms are adequate, tax equity may choose not to invest because they feel over weighted in that particular market. Because there is limited tax equity, this means we are unlikely to proceed with that project even though it could and should get built.

It\'s interesting how much financing is the tail that\'s wagging the dog. Obviously, it\'s a big part of the renewables growth, but it is an interesting component to it. So what we\'re looking to do is work with people like John that are willing to take a little bit more risk or people like Jeff that can actually reduce the risk and help us increase the opportunities. Because there\'s just so much interest out there, it\'s really a question of whether, at the end of the day, you can finance the projects.

With corporates engaged, you\'re absolutely right that there\'s different types of interest there. They typically don\'t like long-term contracts. They don’t want the operational risk. So you have to get creative with your contracting to address that, and with your financing. Financing has to get more comfortable with more merchant risk, because it is just the future of the market.

**Carlos Mendez, Crayhill Capital:**I agree with everything the panel is saying. The problems associated with financing these investments are very much structural. The Federal ITC renewable energy subsidy influences everything from how projects are ultimately financed, the amount of leverage available, the timing of those financings and so on. I think the market will be well served by having alternative offtake contracts and financeable power hedges that mitigate reliance on subsidies.

**PFR: What are some of the rewards of substituting power hedges for PPAs?**

**Mendez, Crayhill:**Our perspective comes as both a financier of project development capital for and owner of utility-scale solar power generation facilities. In the RTO regions we operate in; PJM, CAISO and to a lesser extent MISO, the cost benefit analysis of power hedges versus PPAs varies greatly.

For instance, in an electricity load environment where renewables are prevalent and a duck shaped power production curve exists such as in California, the liquidity, structure, term, period (five-day or a seven-day), and ultimately, price, are completely different versus markets that do not have an imbalance between peak demand and renewable energy production.

In contrast, in New England, there is only a marginal shortfall of power generation. Demand is characterized by the need to address intermittent gaps driven by such events as scheduled power plant maintenance and one time needs from large power consumers. In the MISO, there exists yet another scenario where there is a foundational need for additional power production capacity, and so there is a smaller distinction being made in economic terms between conventional versus renewable generated electricity.

Our recent conversations with the largest hedge providers in the US bear out how these prevailing regional market conditions affect hedge structures. As an example, in the fourth quarter of 2020, twelve-year term hedges were readily available in the MISO while there was less availability at similar economics for that same contract term in the CAISO. We expect availability and constructs of hedges to change from quarter to quarter as those regional markets continue to rapidly evolve.

Another aspect to keep in mind is that the hedge counterparties are market makers and their ability to set off the risk of any particular contract to yet another party varies greatly from one hedge provider to another. In low volume renewable energy hedge markets, there exists a large variance in available contract terms amongst any group of hedging counterparties depending on their specific access to liquidity. That\'s another consideration when you\'re dealing with what\'s the art of the possible. Ultimately, you cannot rely on any single counterparty.

Specifically, the benefits that our firm is trying to achieve with these hedging products goes back to what Emilie was saying; a financeable solar project that can address the growing industrial demand for three- to fiveyear power contracts. Hedge products may be able to fill in the offtake gaps of a particular solar power plant and negate the need for long-term, inflexible PPAs entirely. That may mean the solar project may be less financeable, resulting in less beneficial, lower levered debt, and less favorable tax equity, but those inefficiencies can be potentially offset by higher net revenues from higher electricity prices associated to shorter term power arrangements. That is the goal.

Obviously, we are not able to implement offtake plans with rolling hedges with every single generation asset, but we are committed to further exploring the approach when possible. We believe that, as hedging products become more flexible and widely available, this power sales approach for solar power plants will become more prevalent and will benefit end consumers.

**PFR: And what are some of the more popular hedging strategies? **

**Wangerman, Lightsource:** There\'s a difference between a financial hedge versus a physical hedge. There\'s a difference between a virtual PPA, which is really a financial transaction, versus a physical PPA.

If we\'re really truly talking about just hedges, then for us the biggest focus is how long we can stretch that out. What is the tenor?

On the proxy generation side, they’re introducing things like proxy generation PPAs, and that is getting into insurance products that Jeff can probably talk about.

At the end of the day, what are these different transactions doing? A hedge is allocating almost all of the operational risk to the seller. You have commitments, based on physical or financial delivery, that are based on your actual shape. So it introduces a lot of risk on that side. On the other hand, if you do something like a proxy gen PPA, it\'s really limiting that risk.

Yes, it\'s still based on proxy generation, and you\'re comparing it, and you’re committing to that particular design of this site. That\'s probably unique to the developer, that we bear a lot of risk by just committing to the design early on, when we introduce things like hedges and proxy gen PPAs. With a physical PPA, or even a financial PPA, you don’t really have to decide on 90% of the design until far along in the process. But with these types of contracts you\'re committing really early on.

So I think it depends on what you\'re referring to as a hedge – are we truly talking about traditional hedges, or are we talking about things that hedge risk but are more like a proxy gen PPA, which balances the risk a little bit more? It introduces different counterparties, which is great for us, so it opens the market up, and it balances against a true hedge, which introduces a lot of shape risk.

**McAulay, Energetic:** Our friends at **REsurety** with their proxy revenue swap, at least on the wind side, are seeing that as very popular.

A contract for differences fits the bill in many ways, and because it\'s a corporate counterparty, if they\'re highly rated, that solves your problem. But in many cases, as Carlos was mentioning, you need to bring in hedges with the large banks or oil majors. So there\'s this play between those two and we\'ve seen a couple of different structures. But even when you\'ve got a hedge provider, it\'s a swap. They\'re turning around, and there\'s another counterparty on the other side. We\'ve had projects where a developer says, ‘No, I\'m fine on counterparty risk. I have this hedge.’ Then the hedge provider calls us and says, ‘Hey I\'ve got this downstream offtaker, can you help me out with their credit?’ So it\'s just shifting where that goes.

Then the big thing we get into is contract mismatch. Who\'s holding which part of the risk? Shape, volume, basis, everything that\'s been said.

So where does this wrap up? Ultimately, it\'s trying to get the project financed, and there\'s this trade-off. What risk protection tools do you need to put in place to get financing? Sometimes that\'s binary and sometimes it\'s a sliding scale, meaning if I cover this risk a little bit better, I can get access to a lower cost of capital. At which point, you’re trading off between the cost of the risk management product – hedge, insurance or otherwise – and your cost of capital.

The one thing that we see most commonly undervalued is time and complexity. Everybody has a box in the spreadsheet model, a cell for the cost of capital or the cost of a hedge or a floor price or merchant tail. Nobody has a box in their model that says, ‘What happens if this thing blows up in six months because the term that I got in November isn\'t true in March?’ Or just complexity. You’ve built this beautiful tower of interlocking contracts, and then you go to get it financed, and the bank says, ‘What the heck is this?’ Or the commercial offtaker says, ‘How do I take this to my board?’

I\'m doing the opposite of answering your question, really, which is not talking about the things that are most popular. But we\'re getting these complex structures now, and to enable to get them to work it\'s about re-simplifying or being able to wrap them together so that you have a clear package to go back for financing.

**Bills, Cantor Fitzgerald:** To hit on the popular, I think beauty is very much in the eye of the beholder. What we\'ve done is, because of the massive increase in scale, the massive increase in quantity of wind, solar and batteries that are coming in, the buyer universe in those needs to be inherently able to accept a bit more risk than they\'ve traditionally accepted.

A strategic buyer may be much more willing to enter into a virtual PPA or provide a parent guarantee and build in those commercial, very attractive, high-priced, “popular” hedges, because they\'re well-priced, because they\'re direct end users that want this renewable product, and we see that.

We have an affiliate that has a consulting business within Amerex Energy Services at Cantor, and they have over a thousand customers in the US. Many of them are in Texas and ERCOT. Demand ranges from 1 MW to maybe 50 MW plus for any given type of transaction, that can range from one-to-two years to three-to-five years. But it\'s rare to see five, seven and 10 years.

Parties that can warehouse that and wait for that have a lot of interesting capabilities. That\'s part of what\'s popular and beneficial. Then there are other parties that are fine to de-risk some of that and leave some of that upside open.

As we think about tax equity, they\'re going to come at it from a different perspective. They\'re going to want to make sure that tax equity structure stays in place, but if that tax equity provider is someone that also provides hedges, they may be a little more willing to think about the structure differently.

It\'s a much simpler story on the thermal side, where you sort of know, with some exceptions, that you\'re going to be dealing with these risks. It’s either a commercial bank package, or we package it for private placement investors in the 4(a)(2) market, or we think about it in the gray market or private debt fund market.

We structure according to what we think their metrics will be, and it may just be two to three years of hedges, it may be five to seven years of hedges. We\'ll think about that risk profile in the context of the debt that we\'re going to put in place, and that debt is going to be customized to raise the capital we need or to refinance what we need or to be the initial stage for an M&A sale. The popular hedge is very much a function of who the right investors will be.

What I\'ve seen is, if you enter into a transaction too quickly, where you\'re obligated on it, you can find yourself six months later – as Carlos alluded to – in a situation where you almost wish you hadn’t done it. There\'s enough change, uncertainty and volatility that what is interesting in one market one day may not be very interesting six months from now. The plans of many of our developers have changed dramatically from what they were planning to do even just a year ago, in terms of asset type and hedge type.

**PFR: Is it common to find power hedges being misused if the terms are pushed to extremes, or cookie-cutter structures used inappropriately? **

**Bills, Cantor Fitzgerald:** There have been many lessons learned on how to hedge over the course of at least the 20-plus years that I\'ve been in investment banking in the power space. We\'ve seen a lot of disasters in terms of how to enter into hedges that can, at the time, seem like a good idea, but it turned out hedging wind with gas wasn\'t necessarily a great idea in certain markets.

Hedging a wind project in one region in Texas in another region might not have been a great idea, because you didn\'t really understand the curtailment, congestion and basis risk that result therefrom. So, yes, we\'ve seen these things go wrong, and I think lenders, tax equity providers have really learned a lot from that.

I\'m sure there will still be things that we look back with hindsight and say, ‘Wow! We should\'ve seen that coming.’ But I believe parties are very sensitive to this now. While I would say parties may still try to do less hedging rather than more, I think they’re very ‘eyes wide open’ on the risks that we\'re talking about. They may end up not truly perceiving the nature of the risk, because there will be changes in the marketplace that are maybe black swan in nature. Five-, six-sigma events that they just didn\'t appreciate or just didn\'t understand the magnitude of. But people are mindful of what the key risks are in the marketplace, and most are very attuned to that.

Because now, you don\'t have a choice. Strategics are used to managing these kinds of risks. Investment, private equity funds, infrastructure funds now need to realize, for the most part, if they want to transact in sufficient quantity, many of them also have to understand that. We\'re seeing the direct institutional investors also realizing that that needs to be a part of what they do.

We see that even on the fully-contracted deals, with PPAs. Parties, in order to get the terms they require, oftentimes will have to deal with risk at the very back end of those projects where there may be a number of operational and commercial risks.

**Wangerman, Lightsource:**There is still that little bit of hesitancy because of being burned in the past, particularly with wind in the Midwest and West Texas. But I\'m also seeing that people are getting more comfortable again. That\'s great news, because we are moving to a power markets world, and we will not have those unicorns of long-term, high-IRR PPAs. They\'re going to be the past.

And frankly, the flexibility of different types of contract structures is a benefit to the market. There really isn\'t a reason to have those fixed-rate, long-term PPAs as the only solution. There\'s a lot of value in short-term contracting. It introduces a huge amount of new customer base.

On the developer side, it helps that we are backed by BP. We have a big oil major behind us, and that helps us because we don\'t just have to have one type of product, because the future is going to need diversity and balance.

Being able to tell our financing parties that we\'re not going anywhere has been really helpful. Some of the smaller players can’t really take advantage of that, because they don\'t have that creditworthiness in the background.

**PFR: What are the key considerations that lenders and investors take into account with a hedged asset that they would not otherwise need to think about? **

**Wangerman, Lightsource:**One particular thing that is different with a hedge is operational risk. Typically, when you have an as-generated resource, you\'re contracting based on that as-generated component of it. So whatever you generate is procured and paid for. When you get into shape risk, you have to introduce a different level of risk. You\'re accounting for committing to this quantity in this time frame. As you start to prepare for that, you\'re introducing complexity, on our side, to planning as well as execution.

You have to make sure that your forecasting is correct, and you have to get more complex with your forecasting. It\'s much more specific in terms of that particular quantity on that day, in that season. So it\'s really moving more towards a power marketing role.

The last thing is counterparty risk. We\'ve mentioned that a lot. Is the counterparty going to try to get out of this contract? But you can introduce risk, if you\'re starting to hedge with a counterparty who might say they actually don\'t want the contract, and they’re going to break it because they found a better deal. It hits everyone along the line.

You can\'t have a junior person that doesn’t understand what they\'re committing to in negotiations, and all the way to operations and asset management. They have to keep track of how the project is performing at a different level than they\'re accustomed to in solar. It cuts across the board. It introduces complexity and risk, frankly. It also introduces higher revenue, which is good. I don\'t want to miss that part of it. There are benefits as well.

**Bills, Cantor Fitzgerald:**I\'d echo what Emilie said, which is that having the full suite of commercial management within the company or the portfolio that you\'re looking at is incredibly critical. We start and think through that well before we would package a financing. We make sure we understand what are the hedges that will be in place and how they will be managed from day one, when you enter into the financing, all the way through to when the revenues come in the door. An obligation may arise as a result of an operational challenge. How is that managed? You have a firm obligation to deliver certain types of power. How will that be done commercially?

The lenders or other investors that may come into the deal need to have a true, detailed understanding, to a pretty high degree, of how it\'s going to be managed from day one to maturity, in the case of a lender, or to exit in the case of an equity investor. That\'s so much more important when you have hedges versus just the busbar PPA, where you sit back and produce.

**PFR: The recent high-profile bankruptcy of PG&E may have accelerated the move toward CCAs and corporations. How does the move away from large, investment grade counterparties to smaller counterparties affect offtake contracts? **

**Cuillerier, White & Case:**What we\'re dealing with are counterparty credit issues. As you\'re moving down the chain from larger institutions with better credit risk, how do you manage that, anticipate for it, and the like? How in this market do we deal with counterparty credit risk? It is important to think of this risk holistically, where entering into the hedge presents new risks that need to be factored into the deal structuring.

Handling those with weaker credits and smaller counterparties is more of a challenge. In dealing with those risks, parties are forced to revisit what was believed to have been already agreed, and this happens more often with lower grade counterparties. The competing interests of the counterparties versus other competing interests of other stakeholders puts the discussion in starker contrast where that counterparty risk is more present, shall we say.

In terms of managing the risk, as you would any other deals, as you move down, it\'s perhaps requiring more specific independent collateral for your transactions or more revenue streams, including multiple assets, number one. And number two, that may include things that you wouldn’t necessarily include in other deals. Where is the actual cash flow going? Are you thinking about control over cash flows and the like, when you\'re dealing with counterparties that have that counterparty risk that you don\'t otherwise see with some of the larger names?

You\'re going to deal more with the nitty-gritty of the cash flow. You\'re going to get more in the weeds to your counterparties\' operations.

**Bills, Cantor Fitzgerald:**We’ve closed transactions with multiple CCAs in them on the debt side. We\'ve done credit work where needed, we\'ve got ratings where needed, and we\'ve been able to get commercial lenders and/or private investors comfortable on those transactions.

The marketplace in California is one that absolutely needs resources. They absolutely need resource adequacy. The nature of these assets is critical infrastructure, and these parties now realize that they have to contract at a much longer tenor than they were traditionally doing. We\'ve seen very attractive pricing in those contracts on the thermal side for a number of years. You’re certainly able to go out beyond just the two-to-three years that you\'ve typically seen, and at levels that are many, many times what they were just a few years ago.

The assets are being run very differently. Combined-cycles are being run effectively like peakers. Mid-merit assets that fill in the gaps around the duck curve are run very differently, yet the revenues they can receive through heat-rate call options plus resource adequacy are substantial and are able to be financed by commercial lenders.

We proved that point in our High Desert transaction with a number of CCA and utility counterparties in the midst of some question and uncertainty around utility counterparties. We\'ve also been able to close transactions around other types of uncertainty related to large utilities in California. It\'s very California-specific, but it can be extracted, as Ian said, to any number of types of counterparties that you might end up entering into contracts with.

**PFR: PFR has received inquiries about the REC market recently. The REC market isn\'t as large or as liquid a market as wholesale power. There are also a number of unrated entities who participate, which is challenging from a financing perspective. How much impact can an unbundled REC contract have on the availability of financing for a project? Does it depend on the state that the RECs are generated in? **

**Wangerman, Lightsource:** Definitely. RECs and the value of RECs varies dramatically depending on the region that you\'re talking about. If you\'re talking about an RA product and tacking on RECs in California, that\'s one structure and value. If you\'re talking about ERCOT, where there is no forward capacity market, and all of the value is incorporated into the energy rate, then that energy rate is going to be the dominating factor. Plus they don’t really have requirements from a renewable perspective. So the RECs are not going to be the prominent factor there. Really, you\'re just selling the RECs as an overall benefit, and most of that value is going to come from the energy.

In PJM, there\'s a lot of REC value in Pennsylvania, and we have one of the largest portfolios of solar there. On the other hand, you\'re highly dependent on that state being closed off, and the value of those SRECs in particular. If regulation came in and changed that, you can dramatically impact the value of those RECs. It really does depend on which market you\'re talking about. If you move into the Midwest, if you\'re talking about Ohio, they don\'t necessarily have a REC value that something like Pennsylvania or New Jersey or Maryland has.

Either way, there is inherent value in RECs. The question is, how much can you depend on that, and how much will financing parties value it? Is it a long enough contract that you can actually get valuable debt on? Or do you have to just assume that\'s another merchant revenue stream and that you can’t necessarily get the full value on the financing side?

**Mendez, Crayhill:**In the early part of the last decade, we invested heavily in the development of utility-scale solar projects in the UK. The Renewable Energy Certificate, RECs, scheme was very straightforward; a direct subsidy from the government of the United Kingdom to renewable energy project owners. The lack of complexity of the subsidy afforded the market certainty of execution when structuring financing for such projects. There certainly was a lack of funding participants at the time, but at least there wasn\'t a scheme as complicated as the ITC and some of the state-level subsidies here in the US.

John, you mentioned warehousing. Ideally, we would be able to construct and connect solar and wind projects to the grid and then optimize both government subsidies and market hedges, not be forced to do so earlier in the development process. That is how we were able to proceed in Britain because there was no need to include a tax-related third party in the ownership of the project prior to construction as called for in the US regulation. We were able to fund, construct and bring operational 32 utility-scale solar projects and then, when we had the portfolio stabilized, we optimized our offtake contracts with the full benefits of subsidies.

From our perspective, we see a lot of potential value in providing warehousing capacity for projects to be able to layer off offtake risk over time and not have to commit to longterm PPAs upfront. The reason that these long-term PPAs are committed to early is because financing parties are generally not comfortable without having these long-term offtakes in place upfront. Hedges of course, as we have been discussing, are an alternative, but the timing issue I mentioned before makes it difficult to lock in a tax equity partner in the face of variable outcomes associated to negotiating and finalizing acceptable hedges.

Bill mentioned structural issues with renewable power hedges in the past. This type of friction is not uncommon in early-stage, high growth structured finance markets. Somewhat analogous are the misstructured variable-to-fixed, interest rate swaps in high yield bond and loan securitizations back in the late 90s. As interest rates changed, the hedges failed to work as anticipated, causing all sorts of problems and financial losses. But, the market fixed those asset-liability issues, and then the CLO market over the next 20 years evolved into approximately a $600 billion market today. I feel we are at a similar juncture, where we can figure out these hedging structures appropriately and enable the renewable market to grow at an unprecedented rate. We certainly will all benefit from straightforward financial contracts that satisfy offtake conditions for readily available senior funders.

**Bills, Cantor Fitzgerald:** Part of that impatience comes from the fact that many of these are held by small firms that have developed these assets. They\'re not the large corporate entities that did it back in the late 90s, early 2000s. These are now very large developers. But you had the range, from a single individual to companies that are maybe 40 to 50 people, and those are our clients. There\'s a very finite time under which they have to either sell that project or raise equity capital and tax equity capital and/or debt capital to get the project built. You have to pick or choose something, otherwise the options expire, the permits expire.

In the US, there\'s not a lot of corporate patience for the development angle like there used to be in the days of the**Calpine**s, the **AES**es, the **Dynegy**s, etc. So that dynamic has shifted dramatically, and those are our clients. We feel that sense of urgency and we want to lay out the ability for accessing warehousers like Carlos\'s company or strategics that will warehouse the risk. But we also want to show what a longer-term PPA deal looks like.

In some cases, our clients will want to just sell the projects, and in other cases, they\'ll want to hold on to it and warehouse it or sell a stake to someone that may want to warehouse some of that risk with them and ride it for a while. So there\'s a spectrum. For many of these projects there\'s a window, and if you don\'t try to close the deal in that window, there may not be a deal to be done. So we\'re very mindful of that, and that does feed into why, as Carlos said, there\'s a bit of a lack of patience in our particular marketplace.

**PFR: On the subject of corporate PPAs, it seems that a few corporations have been burned with some of the contracts they\'ve taken on. Any comments on how corporate PPAs have evolved in response? **

**Wangerman, Lightsource:**Yes, corporates are moving beyond just the virtual PPA. They are interested in actual physical delivery. Because they were burned, they\'re introducing new products.** **

**McAulay, Energetic:**As with any uncertain market and any long-term contracts, there\'s going to be winners and losers. And there are some corporate buyers who are happy to justify why they\'re losing money, why they\'re paying out on certain contracts. But I think that\'s generally leading to a higher level of experience and education within the industry, and going forward the buyers are becoming increasingly sophisticated.

In terms of where we\'re seeing demand, the reason you have a corporate counterparty is to provide some of that downside risk hedging to get financed. But it\'s not as simple as just a corporate counterparty. One of the things we see a lot of the time is that a corporate will sign through an unrated subsidiary. The name might be familiar, but when you actually come down to the contract, it turns out there\'s a longer story. Can we see financials on that subsidiary? No. We see that as a gap that needs to be filled.

Additionally, a lot of times they have a buyer\'s credit posting that they\'re responsible for, which either comes in the form of a sufficiently high rating, cash collateral or letter of credit. We\'re finding, especially in the last year, or the last six months even, that that posting of the letter of credit has become more painful, tying up that cash, or tying up their credit capacity.

So we have folks that maybe two or three years ago, when they signed, that was fine, but now they are squirming. Or, even worse, the project changed hands and all of a sudden the seller has the ability to crank up that collateral requirement at the same time that the interest rate, or even that opportunity cost, has gone up.

On the seller side, they can generally get through that with a surety bond in addition to a letter of credit. On the buyer side, it\'s a little bit more complicated. So we\'re seeing insurance products essentially being able to support or reduce that letter of credit posting. That\'s on the corporate side.

Then, even when that corporate has even a hedge standing behind them, there\'s contract mismatch to go through, and the shorter-term compression going down the supply chain.

Going back to your question on RECs, in many cases, in the lower-priced market, they don’t really want the power. They just want the RECs. And they want to have additionality. So not just purchasing unbundled RECs, but being able to say, ‘I helped that project exist, and I\'m doing my part.’

And then, just show to their board that they\'re not losing too much money in purchasing those RECs, that\'s why the hedge piece might come into play.

Ultimately, I think the theme of this conversation is increasing sophistication from all sides. Trading renewable energy, as a commodity, used to be like trading a head of cattle, and now we\'re selling filet mignon. We’re shaping it, parsing it out, selling different terms, different volumes, different structures to folks as they value it more highly.

**Bills, Cantor Fitzgerald:** I’d highlight that there are still those great contracts, those great PPAs, those unicorns. There are not just one or two of them, so it\'s probably not quite appropriate to say they\'re unicorns. But when you have them, the cost of capital is so competitive. And we\'ve run very successful processes with respect to those.

Return requirements have had to shift dramatically downward to reflect the extreme competition and demand from sources in North America, Europe and Asia that are competing with very different types of interest rate environments and costs of capital and viewpoints on tenor.

So the amount of operational and other risk that parties like that are willing to put in their book, to take home a return that to some buyers in North America may not seem reasonable, is what\'s ultimately going to drive buyers – by necessity, because necessity is the mother of invention – to figure this out. If you don\'t, your alternative is competing against those types of buyers that have very strong risk appetites with respect to potentially very low cost of capital.

And those will continue to exist, and that\'s the exit strategy. Once you package it, that type of low-cost investor universe, for now, is very much a viable alternative. So the gold pot at the end of the rainbow is clearly there. Just to connect the dots of where we\'re headed to.

The other point is that the sheer demand for renewables and the general shift away from thermal has also significantly improved the demand dynamic for renewables. We\'ve seen that progress from wind to solar and now batteries. As it has shifted, it has been impressive to watch in terms of its magnitude and geographic scale.

I think these are important points to consider when you think about why are people doing what they\'re doing around this merchant risk.

**Cuillerier, White & Case:** A separate point to consider, one that is overarching, in addressing deal terms for any particular financing transaction, is to think about the individual transaction as one of many. Take a step back from the particulars. As you\'re scaling up the size of operations and hence also of the related financing transactions, there is some benefit to consistency and thinking ahead to the next steps. If you\'ve done three projects, having consistent hedging strategies that are easy to explain for offtakers or people that are buying sets of projects in given markets, that consistency is an easier story to tell, and can only benefit those that are exiting at some point in the future. So as you\'re doing the here and now, think of what might transpire in the future.

Then there’s execution risk. Start as early as you possibly can on your hedging, because it\'s more complicated than you think it\'s going to be at the end of the day. Always is.

**PFR: What is tax equity willing to underwrite and syndicate in terms of merchant streams, hub vs busbar?**

**Bills, Cantor Fitzgerald:** The tax equity market is a very unique market, and it\'s a very small market in many ways, in terms of the participants, and it\'s a very attractive market for them as a result of that.

But it\'s also very large in terms of dollar amounts, and that scale has only increased as we\'ve gone from 10 MW, 50 MW projects in wind and solar and maybe even a fraction of that in battery to now 1,000 MW projects in wind, 500 MW-plus projects in solar, 400 MW, 500 MW projects in battery. The tax equity needs are pretty massive.

Meanwhile, the corporate tax rate was cut significantly. That\'s significantly reduced the tax capacity for corporates and made the market even more difficult than it was before, for financial institutions, insurance companies and other corporates that participated in it. So there are so many uncertainties around how that will evolve.

It\'s important to understand the specifics of a deal. The more middle-of-the-fairway that deal is in terms of contract and certainty, relationship or sponsor, the easier that will be to finance. To the extent it\'s innovative, it\'s not a well-known sponsor, you better have some reasons why that tax equity participant wants to be a part of it, and you\'d better make sure that there\'s sufficient ability for them to syndicate the risk that they need to syndicate on the deal.

So the more you shift to a warehousing structure, like Carlos mentioned, the more need there will be to do something that\'s either a virtual PPA, LCs, parent guarantee, etc, to allow you to do that. To the extent you do that, oftentimes a hedge that\'s done by one of the large tax equity providers can be a good reason for them to do multiple transactions for one deal.

Many things are still very uncertain now with the shifting to the Biden administration and how the legislature will ultimately shape the various incentives. How will battery-related ITCs play into this? Carbon sequestration? There are so many more unknowns than knowns that I think you will have to fall back to a deal that you know will work for a tax equity investor.

**Mendez, Crayhill:**Yes, we work with tax equity partners to execute on our investment plan, but as we all have experienced, the use of tax equity is extremely nuanced.

As an example, one cannot warehouse tax equity for a project under the current regulations and attract such investment interest post achieving operational status. That forces project owners and developers to lock in tax equity interest early in the deployment process, prior to construction. Furthermore, the rules make it difficult to have multiple institutional tax equity investors co-invested in a single project and results in the need for a single sponsor.

Unfortunately, that translates into significant negotiation leverage by the tax equity sponsor on the whole financing structure of the project. For instance, as tax equity typically requires a certain minimum set of contracted cash flows, reserve accounts are required to be established to protect against potential future basis risk which can be especially difficult to anticipate upfront when employing a mix of hedges for the power offtake plan.

Despite all the much needed benefits the ITC scheme provides today, we look forward to when solar cell efficiency and market demand for green power combine to allow for financing without any subsidies.

**Wangerman, Lightsource:** If there\'s a different way that the federal government decides to invest, that could be a true game changer. With a Biden presidency, I expect there is going to be a renewable investment. The question is, when? How are they going to invest? You\'re not going to see renewables going away. The question really is, how are entities going to participate in it?

Carlos said earlier that a lot of companies are getting involved from an ESG viewpoint. I also think they\'re getting involved in renewables because it\'s cost effective. Not only are they hedging your risk of market volatility, but they\'re also a good investment.

This is moving from being a niche market to a market where lots of different products are going to be commoditized and sold. And to Ian\'s point earlier, the importance is being able to replicate so that you can introduce consistencies and reduce the complexity, as Jeff mentioned earlier.

On the other hand, complexity and innovation is what\'s really going to expand this market. I think the next three to five years are going to be really exciting.

**PFR: Finally, what structured products might be available to enhance grid penetration for battery storage? At least one developer has secured a fixed price hedge for ancillary services in ERCOT for a portfolio of battery projects. **

**Bills, Cantor Fitzgerald:**We have financed quick-start generating resources that are carbon efficient but thermal that are heavily dependent upon ancillary services in ERCOT. While there\'s no true capacity market in ERCOT, the ancillary services market can be lucrative. In fact, you can find bilateral transactions to provide you with significant benefits if you\'re a quick-start or responsive resource. How much you want to actually bilaterally contract on ancillary services versus be fully merchant goes back to Carlos’s warehouse point.

Importantly, that kind of resource provides a valuable, valuable service. You have a market in ERCOT that\'s almost 90 GW, and there\'s 30 GW or so of wind and solar that\'ll be online, probably, by the end of this year. More coming. So a third of your generation is intermittent by nature, and yet you have a tiny amount of quick-start generating resources – less than 2 GW. So how much of a difference in wind forecast and sunshine does it take to be in a very problematic situation? Batteries and quick-start generation are critical resources that ERCOT needs. The market is finding a way bilaterally or on a merchant basis for its counterparties to find ways to finance and develop and construct and operate those assets.

**Wangerman, Lightsource:** Another key point is that the markets have to embrace storage and they really are starting to do that, to have products that are specific to the value that storage brings. Different types of storage, from long duration to short duration. California is a little bit ahead of the game with creating products, like flexible ramping products, and on the ancillary services side as well as on the capacity side.

Then, as you start to introduce products like that in the centralized capacity markets on the East Coast, like PJM, you\'re really going to start to see an uptick, because there is inherent value in being able to address intermittency as well as those steep ramps that come with duck curves. Storage is going to be a vital component balancing the overall market. That\'s not just intraday. It\'s intraday and intra seasonal.

**Mendez, Crayhill:**For battery-only projects that we invest in or finance, we are dependent upon hedges to mitigate revenue variability. As Emilie points out in the PJM and John on ERCOT, as penetration of solar and wind generation increases as a percentage of the total power generation capability of a region, large-scale batteries are ideally suited to address the inherent timing mismatches of such power delivery.

However, certainly in the PJM where we are investing now, there lacks long-term offtake contracts with viable counterparties for what batteries do well – frequency modulation. So, battery owners need to also rely on capacity payments and opportunistic energy arbitrage, all of which are predominantly uncontracted, merchant risk.

As battery costs have dropped drastically, PJM RegD hedges that pay a fixed price over a 3- to 7-year term while the operator then pays the difference between the highest and lowest price on any given operating day, are now becoming attractive.

Generally, the economics of stand-alone battery projects remain ‘cuspy’ though their functionality is now such a critical part of operating a power grid that we expect utilities to be strong buyers of such projects in the near-term.'),
  ('Sunpin Solar Closes $50 Million Senior Secured Revolving Loan Facility Provided by Crayhill Capital Management', 'Crayhill Capital Management', 'sunpin-solar-closes-50-million-senior-secured-revolving-loan-facility', '2020-12-22', NULL, 'published', 'Irvine, CA – [Sunpin Solar](http://www.sunpinsolar.us/), a leading developer of commercial and utility-scale solar and energy storage projects, today announced that it has closed a senior secured revolving loan facility (the “Facility”) for up to $50 million with [Crayhill Capital Management LP](https://crayhill.com/) (“Crayhill”), a New York-based private credit manager and asset-based lender with a strong focus on Environmental, Social and Governance (ESG) investments.

The Facility will be backed by late-stage utility-scale solar projects under development by Sunpin Solar. The Facility is designed to finance capital expenditures required by projects prior to construction, including power purchase agreement deposits, interconnection deposits and engineering, procurement, and construction deposits. Sunpin Solar has more than 1GWp of solar and solar-plus-storage projects under development and has successfully developed, constructed and delivered several projects, including two recent projects in California of approximately 100 MWp each that provide renewable power to Direct Energy LP and another large retail energy provider.

“The capital solution provided by Crayhill will allow us to build and monetize our existing development pipeline and accelerate our growth,” said XJ Chen, Sunpin Solar’s Vice President of Development. “We appreciate the trust the Crayhill team has placed in us and look forward to building a successful partnership to deliver reliable green energy and reduce global carbon emissions.”

“Crayhill is excited to partner with Sunpin Solar and support their financing needs as they focus on scaling their business of developing and delivering high-quality solar power projects into the deep and expanding clean energy markets,” said Josh Eaton, Managing Partner of Crayhill Capital. “Despite the challenges created by the ongoing pandemic, demand for solar assets and green power remains strong. Sunpin Solar’s management team has deep experience, technical expertise and industry relationships that will enable them to successfully build on their position as a leading utility-scale solar developer.”

**About Sunpin Solar**

Sunpin Solar, established in 2012, is a leading commercial and utility-scale solar and energy storage developer in the United States. Headquartered in Irvine, California, Sunpin Solar has regional offices in Illinois, Maryland, Massachusetts, New York, Ohio, Pennsylvania, and Texas. As of November 2020, Sunpin Solar has more than 1GWp of solar projects under development and more than 200 MWp in operation across the United States. http://www.sunpinsolar.us/

**About Crayhill Capital Management**

Crayhill Capital Management LP is a New York-based alternative asset management firm that specializes in asset-based private credit opportunities. The firm was launched in August 2015 and is registered with the U.S. SEC as an investment adviser. Crayhill strives to deliver capital solutions through tailored financing structures. Its asset-based investment strategies draw on deep sector expertise and relationships throughout the structured finance and specialty finance markets. For more information please visit [www.crayhill.com](https://www.crayhill.com/) or email [info@crayhill.com](mailto:info@crayhill.com).'),
  ('Australia’s leading trade credit platform secures $100 million financing facility', 'Crayhill Capital Management', 'australias-leading-trade-credit-platform-secures-100-million-financing-facility', '2020-09-09', NULL, 'published', '[Marketlend](http://marketlend.com.au), Australia’s leading marketplace trade credit platform, continues to excel as it recently closed a new $100 million financing facility with [Crayhill Capital Management LP](https://crayhill.com), a New York based private credit manager and asset-based lender.

This new facility will assist with liquidity and cash flow management to global companies affected by the COVID-19 pandemic. It complements Marketlend’s existing trade credit securitization program, which offers financing to companies engaged in international trade.

Marketlend has gone from strength to strength, being valued at AUD $175 million dollars earlier this year and subsequently raising AUD $8.5 million dollars in equity to expand brand awareness and marketing. Since inception the company has an impressive 760 investors, 873 trade credit facilities to the value of AUD$333 million dollars.

Leo Tyndall founded Marketlend in 2014 to address the significant $1.5 trillion dollar ‘trade finance gap’ in global trade financing as identified by the International Chamber of Commerce. Leo’s experience in the financial service industry is extensive. While working as a Capital Markets Practitioner in the financial service market, Leo realized that SMEs weren’t given the same funding opportunities or able to obtain the equivalent insurance protections as corporates. Marketlend offers working capital solutions to SMEs and provides innovative and flexible financing solutions for buyers and sellers in global supply chains. Marketlend is also able to negotiate and implement insurance arrangements on behalf of SMEs to enable greater participation of investment in these SME funding opportunities. The financing facility established with Crayhill Capital Management is being used for commodity finance throughout Asia, the Middle East and Oceania.

“After seeing a gap in the market, we recognised the need for a platform delivering trade credit to commodity trading corporates, SMEs and investors. We saw that corporates and SMEs had working capital locked up in their accounts and our solution to unlocks this capital,” says Leo Tyndall. “Both in Australia and internationally, we aim to provide financing options that can accommodate both immediate and long-term support for businesses, particularly during the COVID-19 pandemic. This has become critical in the current international market as we are seeing banks, credit insurers and funders leaving the commodity space, however, we remain open for business. We are excited to be working with Crayhill Capital Management LP and believe this financing facility will benefit many international companies.”

Marketlend provides supply chain finance, debtor finance and line of credit products to borrowers, with a quick turnaround and competitive rates. The company securitises each trade credit facility from inception and delivers an investment that is accompanied by individualised trade credit risk protection enhancements.

In furtherance of the need to unlock working capital for SMEs, Marketlend’s latest products UnLock, a Buy Now Pay Later B2B solution, is a payment gateway that enables SMEs to boost their purchasing power with suppliers and have extended supplier terms of up to 30, 60 or 90 days.

“We are currently building brand recognition for UnLock in the market and looking at establishing a larger number of suppliers. When we have succeeded, we will look into an IPO. After achieving our domestic growth objectives, there is potential for Marketlend to be on an Australian Securities Exchange listing in 2021 and that is quite an exciting prospect.”

For more information, visit [www.marketlend.com.au](http://www.marketland.com.au) and [https://unlockb2b.com/](https://unlockb2b.com/).'),
  ('CarrierHQ provides certainty for truck-owner operators while AB5 gets worked out', 'Crayhill Capital Management', 'carrierhq-provides-certainty-for-truck-owner-operators-while-hb5-gets-worked-out', '2020-02-26', NULL, 'published', 'Article originally published in [PR Newswire.](https://www.prnewswire.com/news-releases/carrierhq-provides-certainty-for-truck-owner-operators-while-ab5-gets-worked-out-301011342.html)

[CarrierHQ](https://www.carrierhq.com/), a leading software and solutions developer for the motor carrier industry, today announced that its innovative mobile-friendly portal is now available in California.

[CarrierHQ](https://www.carrierhq.com/), a leading software and solutions developer for the motor carrier industry, today announced that its innovative mobile-friendly portal is now available in California. CarrierHQs technology provides a comprehensive solution to reclassification and recruiting issues faced by large fleets and brokers by enabling independent contractors to form or grow their own fleets, thus helping large transportation companies avoid the major pitfalls that have recently befallen firms in the industry, while also increase operational capacity.

"Most trucking companies have a business model that leverages independent owner-operators and that model is facing continuous challenges from regulators and litigants to maintain true independence," said Scott Prince, CEO of CarrierHQ. "Our platform is capable of providing these large trucking companies customized user experiences to assist independent owner-operators in creating and managing their own standalone fleet by enabling these owner-operator to create their own legal entity, apply for their DOT authority, procure motor carrier insurance, obtain an ELD, establish their own fuel cards, create an invoicing solution, and provide payment processing."

The cornerstone of the portal, motor carrier insurance, is offered exclusively through a partnership with [Aon](https://www.carrierhq.com/aon-launches-monthly-coverage-for-fleets/), a leading professional services firm providing a broad range of risk, retirement and health solutions. The motor carrier insurance is offered without premium financing and has flexible payment options including a zero-down option. Aon leverages data from the federally mandated electronic logging devices (ELD) on each truck, and with Aon\'s proprietary rating algorithm provides fleet owners with each driver\'s score based on their actions behind the wheel; the fleet owners will pay a variable insurance rate per truck based on that score. Those with safe driving actions will see a decrease in their premium, while risky driving actions will result in a premium increase. Rates are adjusted on a monthly basis.

Mark Epperson, executive director, Aon added, "Because of some key challenges the industry faces, Aon and CarrierHQ working together give the trucking industry a sustainable model for the creation and support of small fleets which represent a large portion of the industry\'s freight capacity."

CarrierHQ is currently available in 13 states, including Alabama, California, Maine, Missouri, Nebraska, New Hampshire, New Jersey, Ohio, Rhode Island, South Carolina, South Dakota, Tennessee, and Vermont. The product will be rolled out nationwide and ultimately be available in all states except Alaska, Hawaii, and New York.

More information is available at [carrierhq.com](http://carrierhq.com/)

**About CarrierHQ**
CarrierHQ ([carrierhq.com](http://www.carrierhq.com/)) provides industry-leading products and services through an on-the-go portal to help fleets lower their costs, increase their cash flow, and grow their businesses. CarrierHQ\'s mobile headquarters for fleets provides hassle-free signup and flexible payment options. CarrierHQ\'s online portal ties core fleet service offerings together and leverages them in a way that is transformative to the industry.

Follow CarrierHQ on Facebook: [https://facebook.com/CarrierHQ](https://facebook.com/CarrierHQ)
Visit the CarrierHQ Newsroom: [http://CarrierHQ.com/in-the-news](http://carrierhq.com/in-the-news)

**About Aon**
[Aon plc](http://www.aon.com/) (NYSE:[AON](https://www.prnewswire.com/news-releases/carrierhq-provides-certainty-for-truck-owner-operators-while-ab5-gets-worked-out-301011342.html#financial-modal)) Aon is a leading global professional services firm providing a broad range of risk, retirement and health solutions. Our 50,000 colleagues in 120 countries empower results for clients by using proprietary data and analytics to deliver insights that reduce volatility and improve performance. Aon has five specific global solution lines: Commercial Risk Solutions, Reinsurance Solutions, Retirement Solutions, Health Solutions and Data & Analytic Services.

Follow Aon on Twitter: [https://twitter.com/Aon_plc](https://twitter.com/Aon_plc)
Visit the Aon Newsroom: [http://www.aon.com/home/newsroom/index.html](http://www.aon.com/home/newsroom/index.html)'),
  ('Urban Grid Closes $100 Million Senior Secured Term Loan Facility Provided by Crayhill Capital Management', 'Crayhill Capital Management', 'urban-grid-closes-100-million-secured-term-loan-facility', '2019-09-05', NULL, 'published', '[Urban Grid](https://www.urbangridsolar.com/), a leading developer of solar projects throughout the United States, today announced that it has closed a senior secured term loan facility (the “Facility”) for up to $100 million with [Crayhill Capital Management LP](https://crayhill.com/) (“Crayhill”), a New York-based private credit manager and asset-based lender.

The Facility is backed by and will finance the late-stage development of more than 5 GWp of utility-scale solar projects under development by Urban Grid. The Facility is designed to finance the significant capital expenditures required by projects prior to construction. Urban Grid has a successful track record of delivering quality solar projects, including two recent projects purchased by Dominion Energy that provide over 340 MWp of renewable power to a new datacenter in Virginia operated by Facebook.

"The capital solution provided by Crayhill, coupled with their deep experience in utility-scale solar development and financing, will allow us to expand, build and monetize our development portfolio," said Frank Depew, CEO of Urban Grid. "This facility allows our growing team of solar development experts to focus exclusively on delivering high-quality solar projects to our institutional clients."

"Crayhill is excited to partner with Urban Grid\'s experienced team to finance its development portfolio and fuel the next evolution of its growth strategy," said Josh Eaton, Managing Partner of Crayhill Capital. "Strong demand for solar assets from institutional investors, along with government tax incentives scheduled to be phased out over the next few years, create a favorable environment to provide bridge capital solutions for entire solar development portfolios. Crayhill\'s expertise in providing asset-based capital solutions, combined with our extensive experience in solar project financing, is well suited to help Urban Grid successfully scale its business."

"Raising significant capital from Crayhill further validates Urban Grid\'s vision of powering U.S. states through sustainable solar energy developments," said Mark Jones, CEO for PP Asset Management, a significant investor in Urban Grid. "It enables scaling of our development platform from PJM centric states into new service territories. Following a successful relationship with the Crayhill team in the UK, we are excited these prestigious investors believe in Urban Grid\'s credentials, capability and our collective commitment to be the leading U.S. solar developer."

This article is also available on [PR Newswire.](https://www.prnewswire.com/news-releases/urban-grid-closes-100-million-senior-secured-term-loan-facility-provided-by-crayhill-capital-management-300911973.html)'),
  ('Mutuo Financiera Closes USD 100 Million Financing Facility Provided by Crayhill Capital Management', 'Crayhill Capital Management', 'mutuo-financiera-closes-usd-100-million-financing-facility', '2019-08-13', NULL, 'published', 'A related article has been published on [bloomberg.com.](https://www.bloomberg.com/news/terminal/PVZKVST0AFB7)

**Mexico City, Mexico, August 13, 2019** – [Mutuo Financiera](http://www.mutuofinanciera.com/), a vehicle fleet leasing company focused on clean energy passenger transportation in Mexico, today announced that it has closed on a senior secured credit facility provided by [Crayhill Capital Management](http://www.crayhill.com/) (“Crayhill”), a New York-based private credit manager and asset-based lender.

The credit facility, which has a capacity of up to $100 million, will be used for the acquisition of new compressed natural-gas vehicles to be leased to commercial and passenger transportation fleets across Mexico. The Mexican transport market is rapidly transitioning to cleaner fuels, driven by government directives and economically favorable solutions for lessees.

“Mutuo’s edge in the Mexican market comes from its ability to construct use-based payment leases that fit the operating profiles of fleet operators and its digitally enabled customer service platform,” stated Antonio Diego González-Karg, Chief Executive Officer of Mutuo. “We are excited about this new partnership with Crayhill which will allow us to continue achieving our goals of delivering and scaling a better automated fleet management solution and customized leasing products for the benefit of our customers.”

Demetris Papademetriou, Board Member of Mutuo and Partner at [Middlemarch Partners](http://www.middlemarchllc.com/), a NY-based Merchant Banking firm that helps develop Mutuo’s growth and capital strategy, said, "As investors and advisors to energy-related shared savings products, we recognized a unique opportunity to finance the growth of a dynamic sector for Mutuo.”

Mutuo plans to grow aggressively throughout Mexico to improve the way passenger transportation is managed around the country and help transition to more efficient sources of energy, better urban mobility, and access to remote financial services.

**About Mutuo Financiera**

Mutuo Financiera, a Mexican fintech company, is a financial institution that leverages AI and other technological tools to offer productive credit with an innovative approach. Mutuo facilitates access into the financial sector to the small and medium-sized enterprises, in order to enable their businesses growth. Mutuo promotes the use of cleaner and cost-efficient energies, such as Compressed Natural Gas (CNG), a type of fuel that has demonstrated a 20-30% reduction in carbon monoxide and an 80% reduction in nitrous oxide emissions, thus reducing global warming. For more information, visit [www.mutuofinanciera.com](http://www.mutuofinanciera.com) or email [sgazca@mutuofinanciera.com](mailto:sgazca@mutuofinanciera.com).

**About Crayhill Capital Management**

Crayhill Capital Management LP is a New York-based alternative asset management firm that specializes in asset-based, private credit opportunities. The firm was launched in August 2015 and is registered with the U.S. SEC as an investment adviser. Crayhill strives to deliver capital solutions through tailored financing structures. Its asset-based investment strategies draw on deep sector expertise and relationships throughout the structured finance and specialty finance markets. For more information, please visit [www.crayhill.com](http://www.crayhill.com/) or email [info@crayhill.com](mailto:info@crayhill.com).

**About Middlemarch Partners**

Middlemarch Partners is a New York-based merchant bank. The firm has two operating divisions. Middlemarch Securities LLC is a FINRA-registered broker-dealer that assists companies with capital raises, and M&A advisory services and is focused on alternative finance, payments, financial technology and business services sectors where companies require sophisticated equity and debt investment solutions ranging from $25 - $500 million. Middlemarch Capital Partners is a registered investment advisor that designs special purpose investment vehicles that deploy investment capital in venture and growth capital transactions ranging from $5 to $20 million. Its Limited Partners are institutional investors and accredited individual investors. The firm can serve as an independent sponsor of transactions but frequently co-invests in transactions alongside blue-chip lead sponsors that are sourced by Middlemarch Securities. For more information about Middlemarch Partners LLC, please visit [www.middlemarchllc.com](http://www.middlemarchllc.com).'),
  ('Solar Energy: Investing in Renewable Energy', 'Crayhill Capital Management', 'renewable-energy', '2019-01-13', NULL, 'published', 'Crayhill’ s principals have a successful history in investing in renewable energy, including the purchase, construction, financing and sale of 32 solar power plants totaling 344MWp of capacity in the United Kingdom.

Background: In late 2013, despite attractive long term subsidies backed by the UK government, utility scale solar project developers were in need of construction financing for shovel ready projects. In the face of limited commercial bank financing, and the imminent phase out of subsidies for larger projects, we were able to create a programmatic alternative financing solution to unlock the value of entire project development pipelines.

Today, Crayhill is leveraging its prior asset experience to work with renewable energy developers and clean energy companies, not only in solar but also in other sectors such as battery storage and energy efficiency solutions.'),
  ('Crayhill Capital Management Names Stefan Hoefer as Managing Director', 'Crayhill Capital Management', 'stefan-hoefer-named-managing-director', '2018-09-12', NULL, 'published', 'Article originally published in [PR Newswire.](https://www.prnewswire.com/news-releases/crayhill-capital-management-names-stefan-hoefer-as-managing-director-300711241.html)

[Crayhill Capital Management LP](https://crayhill.com), an alternative asset management firm that specializes in private credit investments, announced today the appointment of Stefan Hoefer as Managing Director.

Mr. Hoefer will be a senior member of Crayhill\'s investment team. His responsibilities will include helping to source, underwrite, structure, execute and manage private credit investments.

"We are gaining immediate traction by bringing on Stefan, who we have worked closely with in the past. His special situations, restructuring and fundamental credit investment skills are exceptional and will help to better position the firm as we head further into the credit cycle," stated Carlos Mendez, Co-Founder and Managing Partner at Crayhill.

"Crayhill\'s asset-based approach to investing is distinctive in the private credit space. The firm\'s longer-term capital base enables us to respond to opportunities in special lending situations where we can construct creative asset-based financing solutions," added Mr. Hoefer.

Mr. Hoefer brings over a decade of investment experience in corporate and asset-based investments. Prior to joining Crayhill, he was a senior analyst on the multi-strategy team at BBT Capital, where he focused on investing across the capital structure. Prior to joining BBT Capital, Mr. Hoefer was a senior analyst at Magnetar Capital from 2012 to 2016, where he was part of Magnetar\'s Event Driven Credit team. He also served as a senior analyst at Benefit Street Partners and Anchorage Capital Group, where he focused on distressed debt, equity, private equity and CDS investments since 2005. Mr. Hoefer holds an MBA degree from ESADE (Barcelona, Spain) and a law degree from Universitaet zu Koeln (Cologne, Germany).

**About Crayhill Capital Management**

Crayhill Capital Management LP is a New York-based alternative asset management firm that specializes in asset-based, private credit opportunities. The firm was launched in August 2015 and is registered with the U.S. SEC as an investment adviser. Crayhill strives to deliver capital solutions through tailored financing structures, focusing on developed markets. Its asset-based investment strategies draw on deep sector expertise and relationships throughout the structured finance and specialty finance markets. Crayhill\'s investment process focuses on fundamental analysis of collateral combined with active structuring, with an emphasis on asset coverage and capital preservation. For more information please visit [www.crayhill.com](http://www.crayhill.com/) or email [info@crayhill.com](mailto:info@crayhill.com).'),
  ('Crayhill Capital Management Hires Sloan Sutta as Managing Director', 'Crayhill Capital Management', 'sloan-sutta-named-managing-director', '2018-08-13', NULL, 'published', 'Article originally published in [PR Newswire.](https://www.prnewswire.com/news-releases/crayhill-capital-management-names-sloan-sutta-as-managing-director-300690952.html)

[Crayhill Capital Management LP](http://crayhill.com/), an alternative asset management firm that specializes in private credit investments, announced today the appointment of Sloan Sutta as Managing Director.

Mr. Sutta will be a senior member of Crayhill\'s investment team, and his responsibilities will include helping to source, underwrite, structure, execute and manage asset-based investment opportunities, augmenting Crayhill\'s differentiated approach to private credit.

"Private structured credit investing requires specialized skillsets, and Sloan\'s deep expertise in the space will be an excellent complement to our investment team\'s ability to deliver tailored capital solutions to specialty finance companies," stated Josh Eaton, Co-Founder and Managing Partner at Crayhill.

"I am thrilled to be joining such a dynamic team. Crayhill\'s approach is truly differentiated from other participants in the asset-based private credit space. They aim to uncover uncorrelated investment themes and then combine rigorous asset analysis with their deep structural acumen," added Mr. Sutta.

Mr. Sutta brings over a decade of dedicated private credit investment experience, having spent the entirety of his career in the asset-based, FIG, and real estate spaces. He brings to Crayhill additional expertise in underwriting cash-flowing assets, structuring asset-based credit facilities, and expanding Crayhill\'s proactive sourcing initiatives.

Prior to joining Crayhill, Mr. Sutta was a Managing Director at Och-Ziff Capital Management (now Oz Management), where he had responsibility for the private structured credit business within the US Structured Credit team. Before joining Och-Ziff in 2015, Mr. Sutta was a Managing Director at Garrison Investment Group, a credit and real estate oriented private equity fund, where he was responsible for specialty finance, real estate and structured credit investment opportunities within the Financial Assets team. Prior to joining Garrison in 2008, Mr. Sutta began his career as an Associate in the Asset Finance Capital Markets group at Credit Suisse, focused on execution of esoteric asset-backed securities issuance transactions. He received a B.A. in Economics from Colgate University.

**About Crayhill Capital Management**
Crayhill Capital Management LP is a New York-based alternative asset management firm that specializes in asset-based, private credit opportunities. The firm was launched in August 2015 and is registered with the U.S. SEC as an investment adviser. Crayhill strives to deliver capital solutions through tailored financing structures, focusing on developed markets. Its asset-based investment strategies draw on deep sector expertise and relationships throughout the structured finance and specialty finance markets. Crayhill\'s investment process focuses on fundamental analysis of collateral combined with active structuring, with an emphasis on asset coverage and capital preservation. For more information please visit [www.crayhill.com](http://www.crayhill.com/) or email [info@crayhill.com](mailto:info@crayhill.com).'),
  ('Crayhill Capital Management to Enter Private Debt Business', 'Crayhill Capital Management', 'crayhill-capital-to-enter-private-debt-business', '2015-09-09', NULL, 'published', 'Article originally published on [Reuters.com](https://www.reuters.com/article/hedgefunds-crayhill/crayhill-capital-management-to-enter-private-debt-business-idUSL1N11F1IY20150909).

Crayhill Capital Management, which was formed in August by two veterans of $14 billion hedge fund firm Magnetar Capital, is joining the ranks of lending-focused private fund managers trying to make money where banks have pulled back.

Joshua Eaton and Carlos Mendez of New York-based Crayhill will employ a similar strategy to what both did at Magnetar: providing capital to businesses in need through a so-called private debt strategy. The investment style typically refers to one-off loan agreements, which unlike corporate bonds come from non-bank firms and are not publicly traded.

The firm is just starting to meet with investors and decide on specific terms, according to a person familiar with the situation but not authorized to speak publicly.

Hedge fund lobbying group Alternative Investment Management Association said in a May report that such “alternative credit” lenders were increasingly replacing banks in funding small-to-mid-sized businesses, especially in Europe and the United States.

“Arguably, the role of non-bank finance has never been more important than today,” the report said.

AIMA said private debt funds now manage around $440 billion, with $64 billion allocated to the sector in 2014 alone. Firms like Apollo Global Management LLC, Blackstone Group LP and KKR & Co LP already have large credit arms.

Banks have pulled back from some lending because of tighter lending standards and increased capital requirements imposed by regulators.

Like other credit-focused funds, Crayhill’s will have a hybrid hedge and private equity structure. Future Crayhill clients will probably have to commit their money for between two and five years, the source said. That compares with one year for many hedge funds and 10 years for many private equity funds.

In contrast to private equity funds, Crayhill’s managers will not own businesses. And unlike hedge funds, they will not trade securities.

Investments will typically be held for between three and seven years and will focus on markets in North America, Latin America and Europe, the source said.

Eaton and Mendez, who were part of Magnetar’s fixed-income group, also helped run an $860 million vehicle focused on investing in UK solar companies. They will continue to sub-advise that fund for Magnetar, which maintains ultimate investment discretion.

Eaton and Mendez are the principal owners of Crayhill. Frederick Horton, a third founder, runs operations. (Reporting by Lawrence Delevingne; Editing by Jennifer Ablan and Lisa Von Ahn)'),
  ('Hiring New Associates at Crayhill', 'Crayhill Capital Management', 'hiring-new-associates-at-crayhill', '2015-07-13', NULL, 'published', 'We are excited to announce that we are hiring Associates at Crayhill Capital to join our team in midtown Manhattan. If you are interested in working closely with our partners, borrowers, and to learn more about the growing private credit market from an asset-based perspective, consider applying. If you are interested in working closely with our partners, borrowers, and to learn more about the growing private credit market from an asset-based perspective, consider applying. This is an opportunity for a qualified candidate to gain invaluable experience in private market financing,')
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    author = VALUES(author),
    published_date = VALUES(published_date),
    image = VALUES(image),
    status = VALUES(status),
    content = VALUES(content),
    updated_at = CURRENT_TIMESTAMP;
