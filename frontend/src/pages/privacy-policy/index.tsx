import { PageHead } from '@/components/PageHead'
import { privacyPolicyMeta } from '@/pages/privacy-policy/meta'

/**
 * Privacy Policy (/privacy-policy). Linked from the footer's fine-print row and
 * from the Legal Notice page (section 10). Static page copy — no data fetching.
 *
 * Designer spec (desktop mockup page 24 + mobile mockup page 18):
 *   - Module top/bottom padding: 120px desktop, 60px mobile; background white.
 *   - Headline: H2, black (wraps to two lines on a phone — natural).
 *   - Date text: Body 3, black ("March 2026").
 *   - Body: Body 1, black.
 *
 * Module padding uses the standard `py-module` token: 120px on desktop and
 * 60px below md, matching the mobile mockup's "Module top-bottom padding: 60px"
 * (the token's mobile value is the site-wide designer spec — see global.css).
 *
 * Reading measure is constrained to max-w-4xl on the content column so the copy
 * doesn't run the full 1280px container width; on a phone it fills the column
 * with px-6 (24px) side padding, matching the mobile comp.
 *
 * NOTE(content): the two mockups disagree on this headline — the desktop comp
 * (page 24) reads "Crayhill Privacy Policy" while the mobile comp (page 18)
 * reads "Crayhill's Privacy Policy". Using the desktop wording for now;
 * confirm the final phrasing with the designer.
 *
 * NOTE(legal): this copy is transcribed verbatim from the designer's desktop
 * mockup (page 24). The effective date (March 2026) and the substance of the
 * policy must be verified against the authoritative legal source before launch.
 */
export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHead
        title={privacyPolicyMeta.title}
        description={privacyPolicyMeta.description}
      />
      <main>
        <section className="bg-paper px-6 py-module sm:px-10">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-ink">Crayhill Privacy Policy</h2>
            <p className="mt-3 text-body-3 text-ink">March 2026</p>

            <div className="legal-prose mt-10 text-body-1 text-ink">
              <p>
                Crayhill Capital Management LP and its affiliates
                (&ldquo;Crayhill&rdquo;) may collect personal information (which
                includes public and non-public personal information), such as
                name, address, social security number, birth date, assets,
                income, investment experience and other information about current,
                former and prospective clients and investors. This information is
                compiled from: (i) subscription documents and related forms and
                agreements completed by such persons; (ii) transactions between
                such persons and Crayhill (e.g., account activity and balances);
                and (iii) other third-party sources (e.g., credit reporting
                agencies).
              </p>
              <p>
                Personal information is not shared with any unaffiliated third
                parties for their marketing purposes. Crayhill may use, disclose
                and otherwise process personal information for its business,
                administrative and marketing purposes. Crayhill also may reveal
                personal information in its possession to its regulators and
                appropriate government agencies, as necessary and as required
                under applicable laws, in connection with legal proceedings or
                otherwise to assert and protect legal interests or as part of a
                corporate transaction with a successor or affiliate. Crayhill
                restricts access to such personal information from its personnel,
                its affiliates and affiliates&rsquo; personnel, its service
                providers and its outside counsel, auditors and other independent
                professionals, and such information may be disclosed solely on a
                need-to-know basis.
              </p>
              <p>
                Crayhill maintains reasonably appropriate administrative,
                technical, and organizational controls to safeguard such personal
                information, although such safeguards may not prevent all breaches
                of information security. If the security of personal information
                is compromised, Crayhill will notify the affected individuals of
                the data security incident where required by and consistent with
                applicable law.
              </p>
              <p>
                Individuals may exercise their rights under applicable law to
                access such personal information as is held by Crayhill, to
                rectify or delete any personal information that is factually
                incorrect, incomplete or irrelevant for the purpose for which it
                is processed and to raise any queries or concerns as to the use of
                their personal information by contacting Crayhill.
              </p>
              <p>
                In order to use and disclose such personal information for the
                purposes described above, Crayhill may transfer such personal
                information internationally to countries that the United States
                has deemed not to provide adequate data protection. Current,
                former and prospective clients and investors recognize the
                necessity of such international processing of personal information
                and consent to such international transfers of personal
                information, including social security and taxpayer identification
                numbers, as Crayhill deems reasonably appropriate. Crayhill will
                ensure application of the same standards of privacy protection as
                set out in this privacy policy regardless of the country in which
                such personal information is processed.
              </p>
              <p>
                The policy is effective as of March 2026. If, at any time in the
                future, it is necessary to disclose any personal information in a
                way that is materially inconsistent with this policy, Crayhill
                will give the relevant person written notice of the change and,
                where required under applicable law, obtain consent to such
                change.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
