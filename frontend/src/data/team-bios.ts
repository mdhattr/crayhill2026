/**
 * Canonical team bio data store, keyed by slug. The bio page
 * (frontend/src/pages/team/bio) reads from this map to render the
 * detail view for any /team/<roster>/<slug> route.
 *
 * Schema:
 *   slug          Lower-kebab. Matches the URL path segment and the
 *                 slug used by the TeamGrid cards on Leadership /
 *                 Senior Investment Professionals.
 *   name          Display name (mixed case). Rendered as the bio
 *                 H2 — keeps card → bio identity continuous.
 *   fullTitle     Full title for the bio H5 (uppercased by base
 *                 rule). May be richer than the card's `title`
 *                 (e.g. "Managing Partner | Co-Founder" here vs
 *                 "Co-Founder" on the card). Pipe separator with
 *                 surrounding spaces is the comp convention.
 *   imageSrc      Path under /images (Vite copies /assets contents
 *                 via publicDir).
 *   email         Optional. When present, the bio renders an
 *                 envelope icon linking to mailto:<email>.
 *   linkedinUrl   Optional. When present, the bio renders the "in"
 *                 mark linking to the provided URL (rel=noopener,
 *                 target=_blank).
 *   paragraphs    One string per paragraph. Rendered into a
 *                 columns-2 (md+) flow on the bio detail page;
 *                 paragraph breaks survive the column flow.
 *   rosterPath    Where the "< Team" back link points. Used here
 *                 rather than derived from the URL so a shared bio
 *                 URL still has a correct back link, and so a slug
 *                 can only belong to one roster (the typo path
 *                 /team/leadership/<sip-person> doesn't render a
 *                 broken back link — it 404s).
 *
 * TODO(content): Email + LinkedIn URLs on every entry are
 *   plausible guesses (firstname.lastname@crayhillcapital.com and
 *   the linkedin.com/in/<slug>/ pattern) so the bio-page contact
 *   icons render. Verify each pair with the team before launch;
 *   remove either field on an entry to suppress that icon.
 */

export type TeamBio = {
  slug: string
  name: string
  fullTitle: string
  imageSrc: string
  email?: string
  linkedinUrl?: string
  paragraphs: ReadonlyArray<string>
  rosterPath: '/team/leadership' | '/team/senior-investment-professionals'
}

const LEADERSHIP: '/team/leadership' = '/team/leadership'
const SIP: '/team/senior-investment-professionals' =
  '/team/senior-investment-professionals'

export const TEAM_BIOS: Readonly<Record<string, TeamBio>> = {
  'josh-eaton': {
    slug: 'josh-eaton',
    name: 'Josh Eaton',
    fullTitle: 'Managing Partner | Co-Founder',
    imageSrc: '/images/headshot-josh.jpg',
    email: 'josh.eaton@crayhillcapital.com',
    linkedinUrl: 'https://www.linkedin.com/in/josh-eaton/',
    paragraphs: [
      `Joshua Eaton is a Co-Founder and a Managing Partner of Crayhill Capital Management.`,
      `Prior to founding Crayhill in July 2015, Mr. Eaton was a Portfolio Manager in the Fixed Income Group of Magnetar Capital, where he focused on illiquid, structured credit and asset-based investment opportunities. Prior to joining Magnetar in 2012, Mr. Eaton was a Managing Director in the Structured Finance Group at Sandler O\u2019Neill & Partners, L.P., where he developed and advised on asset-based and capital solutions for banks, insurance companies and other financial institutions. Prior to joining Sandler O\u2019Neill in 2010, Mr. Eaton spent over five years at Dune Capital Management LP, an investment management firm he helped launch as a spinoff from Soros Fund Management in late 2004. Prior to Dune, Mr. Eaton spent seven years as an associate at Cleary Gottlieb Steen & Hamilton LLP, where his practice focused on corporate and financial transactions. Mr. Eaton received a J.D. degree, magna cum laude, from Boston University School of Law in 1997, a degree in French studies, with honors, from Universit\u00e9 de Caen, France in 1994, and a B.A. in Business Administration, Finance Concentration, from the University of Washington in 1992.`,
    ],
    rosterPath: LEADERSHIP,
  },

  'carlos-mendez': {
    slug: 'carlos-mendez',
    name: 'Carlos Mendez',
    fullTitle: 'Managing Partner | Co-Founder',
    imageSrc: '/images/headshot-carlos.jpg',
    email: 'carlos.mendez@crayhillcapital.com',
    linkedinUrl: 'https://www.linkedin.com/in/carlos-mendez/',
    paragraphs: [
      `Mr. Mendez is a Co-Founder and a Managing Partner of Crayhill Capital Management. Prior to founding Crayhill in July 2015, Mr. Mendez was a Portfolio Manager in the Fixed Income Group of Magnetar Capital, where he focused on illiquid, structured credit and asset-based investment opportunities. Prior to Magnetar, Mr. Mendez was a Managing Director and Head of the Structured Finance Group at Sandler O\u2019Neill & Partners, L.P., where he structured new issue origination and asset-based finance solutions for specialty finance companies and banks.`,
      `Prior to joining Sandler O\u2019Neill, Mr. Mendez was Co-Founder and Principal of ICP Securities, LLC, where he oversaw a capital markets business focused on structured credit in new issue origination, sales and proprietary trading for asset-backed securities and structured products in New York and London. Mr. Mendez received a B.S. in Mechanical Engineering and a minor in Latin American Studies from the United States Naval Academy. He also holds a graduate certificate in Program Management from the University of Washington.`,
    ],
    rosterPath: LEADERSHIP,
  },

  'joe-thomas': {
    slug: 'joe-thomas',
    name: 'Joe Thomas',
    fullTitle: 'Managing Director | CFO & CCO',
    imageSrc: '/images/headshot-joe.jpg',
    email: 'joe.thomas@crayhillcapital.com',
    linkedinUrl: 'https://www.linkedin.com/in/joe-thomas/',
    paragraphs: [
      `Mr. Thomas is Chief Financial Officer and Chief Compliance Officer of Crayhill Capital Management LP.`,
      `Prior to joining Crayhill, Mr. Thomas was Chief Financial Officer and Chief Compliance Officer of Dune Capital Management LP, an investment management firm that launched as a spinoff from Soros Fund Management in late 2004. Mr. Thomas spent ten years at Dune advancing his career from Controller to CFO and CCO. Prior to joining Dune in 2005, Mr. Thomas spent over three years at SS&C GlobeOp Financial Services, a fund administrator that provides middle and back office financial services to hedge funds and investment managers. At SS&C GlobeOp, Mr. Thomas was a Director overseeing the financial operations of twenty master-feeder hedge funds. Mr. Thomas managed a team of thirty accounting and finance professionals. Prior to joining SS&C GlobeOp, Mr. Thomas worked as an Assistant Controller for Hamilton Partners Limited, a hedge fund and broker dealer. Prior to joining Hamilton, from August of 1985 to July of 2000, Mr. Thomas worked in senior accounting roles of commodity firms at Marco International Corp., Imperial Commodities, Wego Chemical and Mineral Corp. and Bozzo USA Trading Inc.`,
      `Mr. Thomas received a B.B.A. in accounting from Adelphi University in 1985 and an M.B.A. in finance from Adelphi University in 1997.`,
    ],
    rosterPath: LEADERSHIP,
  },

  'scott-beardsley': {
    slug: 'scott-beardsley',
    name: 'Scott Beardsley',
    fullTitle: 'Chief Operating Officer',
    imageSrc: '/images/headshot-scott.jpg',
    email: 'scott.beardsley@crayhillcapital.com',
    linkedinUrl: 'https://www.linkedin.com/in/scott-beardsley/',
    paragraphs: [
      `Mr. Beardsley is the Chief Operating Officer at Crayhill Capital Management.`,
      `Prior to joining Crayhill, Mr. Beardsley was a Partner and Head of Treasury & Operations at BlueMountain Capital Management, a $20 billion multi-strategy alternative asset manager, where he spent 17 years after joining at inception of the firm in 2003. Up until his departure, Mr. Beardsley was responsible for all portfolio finance, liquidity management, counterparty relationships, PnL & valuations, and operations activities. Mr. Beardsley also chaired the Trade Oversight Committee and was a member of the Partner, Valuation, Risk & Compliance committees at BlueMountain. Prior to joining BlueMountain, he started his career with roles at GlobeOp Financial Services and Paloma Partners. Mr. Beardsley earned an M.B.A from Clarkson University and a B.S. in Finance from Castleton University.`,
    ],
    rosterPath: LEADERSHIP,
  },

  'katherine-taylor': {
    slug: 'katherine-taylor',
    name: 'Katherine Taylor',
    fullTitle: 'Managing Director and Head of Marketing and Investor Relations',
    imageSrc: '/images/headshot-kassie.jpg',
    email: 'katherine.taylor@crayhillcapital.com',
    linkedinUrl: 'https://www.linkedin.com/in/katherine-taylor/',
    paragraphs: [
      `Ms. Taylor is a Managing Director and Head of Marketing and Investor Relations at Crayhill Capital Management. Prior to joining Crayhill in June 2025, Ms. Taylor was a Managing Director at First Eagle Alternative Credit, responsible for business development, product development, strategic relationships and fund marketing. She was also a member of the firm\u2019s management committee. Ms. Taylor became part of First Eagle in 2020 upon the firm\u2019s acquisition of THL Credit, which she had joined in 2016. Concurrently, Ms. Taylor was also a Director on the investor relations team for private equity firm THL Partners until the First Eagle acquisition in 2020. Prior to THL Credit, Ms. Taylor was a Vice President and head of fundraising and investor relations at Graycliff Partners, the former private equity team of HSBC in the United States and Latin America. Previously, she held positions at HSBC Private Bank, Loomis, Sayles & Company and State Street Global Markets. Ms. Taylor earned a B.A. in international studies in 2006 from the Morrissey College of Arts and Sciences at Boston College and an M.B.A. in 2010 from the Carroll School of Management at Boston College.`,
    ],
    rosterPath: LEADERSHIP,
  },

  'daniel-shlomi': {
    slug: 'daniel-shlomi',
    name: 'Daniel Shlomi',
    fullTitle: 'General Counsel',
    imageSrc: '/images/headshot-daniel.jpg',
    email: 'daniel.shlomi@crayhillcapital.com',
    linkedinUrl: 'https://www.linkedin.com/in/daniel-shlomi/',
    paragraphs: [
      `Mr. Shlomi is General Counsel of Crayhill Capital Management.`,
      `Prior to joining Crayhill, Mr. Shlomi was an attorney at Akin Gump Strauss Hauer & Feld LLP from 2012 to 2022. At Akin, Mr. Shlomi focused on commercial real estate transactions, including the acquisition, sale, development and financing of real estate and real estate-based assets. He advised a variety of clients in the real estate industry, including investment funds, home office and individual investors, REITs, commercial developers and institutional lenders. Prior to joining Akin Gump, Mr. Shlomi was an associate at Duval & Stachenfeld LLP.`,
      `Mr. Shlomi received a J.D. degree from the University of Southern California Law School in 2011 and a B.S. in Business Administration, Real Estate Finance Concentration, from the University of Southern California, Marshall School of Business in 2007. Mr. Shlomi is member of the New York and California Bars.`,
    ],
    rosterPath: LEADERSHIP,
  },

  'shweta-kapadia': {
    slug: 'shweta-kapadia',
    name: 'Shweta Kapadia',
    fullTitle: 'Managing Director | Origination and Execution of Investments',
    imageSrc: '/images/headshot-shweta.jpg',
    email: 'shweta.kapadia@crayhillcapital.com',
    linkedinUrl: 'https://www.linkedin.com/in/shweta-kapadia/',
    paragraphs: [
      `Ms. Kapadia is a Managing Director at Crayhill Capital Management focused on origination and execution of investments.`,
      `Among her responsibilities at the firm, she is focused on the clean and renewable energy investment programs. Prior to joining Crayhill, Ms. Kapadia was an Investment Professional at Och-Ziff Capital Management (now Sculptor Capital Management) from 2013 to 2018 where she played a substantial role in making investments in mortgage and asset-backed securities and structured private credit transactions. Prior to her role at Och-Ziff Capital Management, Ms. Kapadia was a Vice President at Barclays Capital/Lehman Brothers. She holds a Masters in Financial Engineering from Cornell University.`,
    ],
    rosterPath: SIP,
  },

  'stefan-hoefer': {
    slug: 'stefan-hoefer',
    name: 'Stefan Hoefer',
    fullTitle: 'Managing Director | Origination, Underwriting, and Execution of Investments',
    imageSrc: '/images/headshot-stefan.jpg',
    email: 'stefan.hoefer@crayhillcapital.com',
    linkedinUrl: 'https://www.linkedin.com/in/stefan-hoefer/',
    paragraphs: [
      `Mr. Hoefer is a Managing Director at Crayhill Capital Management.`,
      `Prior to joining Crayhill, Mr. Hoefer was a senior analyst on the multi-strategy team at BBT Capital, where he focused on investing across the capital structure. Prior to joining BBT Capital, Mr. Hoefer was a senior analyst at Magnetar Capital from 2012 to 2016 where he played a substantial role in making several private markets investments and was part of Magnetar\u2019s Event Driven Credit team. He was also a senior analyst at Providence Equity from 2011 to 2012 on their multi-strategy team. Prior to his role at Providence Equity, Mr. Hoefer spent six years at Anchorage Capital, where he was a senior analyst focused on distressed debt, equity, private equity & CDS investments. Prior to Anchorage, Mr. Hoefer spent two years as an associate at Compass Partners, a London based private equity firm, and two years at Lehman Brothers\u2019 Merchant Banking Group.`,
      `Mr. Hoefer received an MBA degree from ESADE (Barcelona, Spain) in 2001, and a law degree from Universitaet zu Koeln (Cologne, Germany).`,
    ],
    rosterPath: SIP,
  },

  'jihane-hassad': {
    slug: 'jihane-hassad',
    name: 'Jihane Hassad',
    fullTitle: 'Director',
    imageSrc: '/images/headshot-jihane.jpg',
    email: 'jihane.hassad@crayhillcapital.com',
    linkedinUrl: 'https://www.linkedin.com/in/jihane-hassad/',
    paragraphs: [
      `Ms. Hassad is a Director at Crayhill Capital Management focused on origination, underwriting and execution of investments.`,
      `Among her responsibilities at the firm, she is focused on the TMT investment programs. Prior to joining Crayhill, Ms. Hassad was a Vice President in the Credit Markets Division at Macquarie Group where she was focused on credit underwriting and financing solutions for FinTech companies and credit funds. Ms. Hassad joined Macquarie in 2011 and spent 4 years on the Securitized Debt trading desk where she played a key role in implementing trading strategies for residential and esoteric asset backed securities.`,
      `Ms. Hassad has a Master\u2019s degree in Financial Engineering from Columbia University. Ms. Hassad also received a Master\u2019s degree in Engineering and Applied Science from \u00c9cole Centrale Paris, France\u2019s leading engineering school.`,
    ],
    rosterPath: SIP,
  },
}
