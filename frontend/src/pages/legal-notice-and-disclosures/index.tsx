import { Link } from 'react-router-dom'
import { PageHead } from '@/components/PageHead'
import { legalNoticeMeta } from '@/pages/legal-notice-and-disclosures/meta'

/**
 * Legal Notice & Disclosures (/legal-notice-and-disclosures). Linked from the
 * footer's fine-print row. Static page copy — no data fetching.
 *
 * Designer spec (desktop mockup page 23 + mobile mockup page 17):
 *   - Module top/bottom padding: 120px desktop, 60px mobile; background white.
 *   - Headline: H2, black (wraps to two lines on a phone — natural, the H2
 *     scale clamps down to 30px on mobile).
 *   - Section title: H3, black ("Website Terms & Conditions").
 *   - Numbered section subheads: H5, black (uppercased via the global base rule).
 *   - Body: Body 1, black.
 *   - In-prose link color: #57A0DD (--color-accent) — see .legal-prose in
 *     global.css.
 *
 * Module padding uses the standard `py-module` token: 120px on desktop and
 * 60px below md, which matches the mobile mockup's "Module top-bottom padding:
 * 60px" (the token's mobile value is the site-wide designer spec — see
 * global.css).
 *
 * Reading measure is constrained to max-w-4xl on the content column so the
 * dense legal copy doesn't run the full 1280px container width; on a phone the
 * viewport is narrower than that cap, so the copy fills the column with the
 * standard px-6 (24px) side padding, matching the mobile comp.
 *
 * NOTE(legal): this copy is transcribed verbatim from the designer's desktop
 * mockup (page 23). The defined term the mockup styles as "FIRM" is set here in
 * standard Title Case ("Firm"). The full text — and every regulatory statement
 * (SEC registration, adviser disclosure) — must be verified against the
 * authoritative legal source before launch.
 */
export default function LegalNoticeAndDisclosuresPage() {
  return (
    <>
      <PageHead
        title={legalNoticeMeta.title}
        description={legalNoticeMeta.description}
      />
      <main>
        <section className="bg-paper px-6 py-module sm:px-10">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-ink">Legal Notice &amp; Disclosures</h2>

            <div className="legal-prose mt-10 text-body-1 text-ink">
              <h3 className="text-ink">Website Terms &amp; Conditions</h3>

              <p>
                Welcome to Crayhill.com. The information offered by Crayhill
                Capital Management LP and its affiliates (collectively, the
                &ldquo;Firm&rdquo;) on this website (the &ldquo;Site&rdquo;) is
                subject to these terms and conditions (the &ldquo;Terms and
                Conditions&rdquo;). These Terms and Conditions apply to all users
                and constitute a legally binding agreement between the Firm and
                you, the user of our Site. By entering the Site or by
                transmitting any information to the Site you acknowledge that you
                have read, understood and agree to all of these Terms and
                Conditions. If you do not agree to the Terms and Conditions,
                please do not use the Site. Any use of the Site in a manner
                inconsistent with these Terms and Conditions is deemed
                unauthorized access and may subject the user to civil or criminal
                penalties. We reserve the right to revise this legal information
                at any time and for any reason, without notice or obligation, by
                updating this posting. Your continued use of the Site following
                the posting of any changes to the Terms and Conditions will mean
                that you accept such amendments. We strongly recommend that you
                periodically visit this page of the Site to review the Terms and
                Conditions.
              </p>

              <p>
                This website page is intended solely to provide information
                regarding general financing capabilities of Crayhill Capital
                Management LP for prospective portfolio investments. The
                information provided on this page, including any information
                regarding Crayhill Capital Management LP&rsquo;s current and
                historical portfolio investments, is not a complete list thereof,
                and it is not intended to recommend any investment described
                herein and is not an offer or sale of any security or investment
                product or investment advice. Crayhill Capital Management LP
                provides investment advisory services to the privately offered
                Crayhill Capital Management LP funds. Crayhill Capital Management
                LP does not solicit or make its services available to the public
                or other advisory clients for purposes of investment in the
                Crayhill Capital Management LP funds. Nothing on this Site
                constitutes or forms a part of any offer for sale or subscription
                of, or any invitation to offer to buy or subscribe for, any
                securities, nor should it or any part of it form the basis of, or
                be relied upon in any way in connection with any contract or
                commitment whatsoever, nor does any information on this Site
                constitute a comprehensive or complete statement of the matters
                discussed or the law relating thereto. No action should be taken
                or omitted to be taken in reliance upon information on this site.
                Advice from a suitably qualified professional should always be
                sought in relation to any particular matter or circumstance.
              </p>

              <h5 className="text-ink">1. Copyrights and Trademarks</h5>
              <p>
                By entering the Site you acknowledge and agree that each name,
                logo, trademark, or service mark contained on the Site is owned
                or licensed by Crayhill Capital Management LP and may not be used
                by you without the prior written approval of Crayhill Capital
                Management LP. Crayhill Capital Management LP will aggressively
                enforce its intellectual property rights to the full extent of
                the law. Information or images of places or people are either the
                property of Crayhill Capital Management LP or used on the Site by
                Crayhill Capital Management LP with permission. Your use of any
                such materials is prohibited unless specifically permitted by
                Crayhill Capital Management LP. Any unauthorized use of such
                materials may subject you to penalties or damages, including,
                without limitation, those related to violation of trademarks,
                copyrights, privacy and publicity rights.
              </p>

              <h5 className="text-ink">2. Restricted Use of Site Materials</h5>
              <p>
                Crayhill Capital Management LP grants you a limited license to
                access and make use of the Site. For your personal use only, you
                may print copies of the information from the Site, and you may
                store information from the Site on your own computer. You may not
                modify the Site, or any portion thereof, for any reason. Any
                unauthorized use terminates the permission or limited license
                granted by Crayhill Capital Management LP. Crayhill Capital
                Management LP reserves all other rights.
              </p>

              <h5 className="text-ink">3. Linking, Posting and Transmitting</h5>
              <p>
                Although Crayhill Capital Management LP provides the information
                accessible on the Site for your personal, non-commercial use,
                Crayhill Capital Management LP retains all property rights,
                including, without limitation, property rights under U.S. and
                international copyright law, to all such information. Without the
                prior express written permission of Crayhill Capital Management
                LP, you MAY NOT do any of the following:
              </p>
              <ol>
                <li>
                  (A) hyperlink to the Site, whether to its homepage or to an
                  interior page;
                </li>
                <li>
                  (B) include information from the Site on another site, on a
                  server computer, or in documents;
                </li>
                <li>(C) modify or re-use the information from the Site; or</li>
                <li>
                  (D) transmit any commands, codes or information to the Site,
                  with the exception of those commands necessary to view the
                  Site. Crayhill Capital Management LP reserves all other rights.
                </li>
              </ol>
              <p>
                Do not transmit to the Site or to any Crayhill Capital Management
                LP personnel, any pornographic, obscene, profane, defamatory,
                libelous, threatening, or unlawful material or any unsolicited
                commercial communications.
              </p>
              <p>
                Do not transmit to the Site or to any Crayhill Capital Management
                LP personnel any material that could constitute or encourage
                unlawful conduct that would be considered a criminal offense,
                give rise to civil liability, or otherwise violate any law or
                regulation.
              </p>
              <p>
                Notwithstanding the fact that Crayhill Capital Management LP, or
                other parties involved in creating, producing, or delivering the
                Site, may monitor or review any transmissions to the Site or to
                Crayhill Capital Management LP personnel, Crayhill Capital
                Management LP and such other parties assume no responsibility or
                liability that may arise from the content thereof, including,
                without limitation, claims for defamation, libel, slander,
                obscenity, pornography, profanity, or misrepresentation.
              </p>
              <p>
                Although the Site may be linked to other sites upon permission,
                Crayhill Capital Management LP is not, directly or indirectly,
                implying any approval, association, sponsorship, endorsement, or
                affiliation with the linked site, unless specifically stated
                therein. By entering the Site, you acknowledge and agree that
                Crayhill Capital Management LP has not reviewed all the sites that
                may be linked to the Site and is not responsible for the content
                of any off-site pages or any other site linked to the Site.
              </p>
              <p>
                You further acknowledge and agree that when you follow links to
                pages not maintained on the Site, you do so at your own risk.
              </p>

              <h5 className="text-ink">4. Disclaimers</h5>
              <p>
                While Crayhill Capital Management LP make all reasonable efforts
                to help ensure that all material on the Site is correct, accuracy
                cannot be guaranteed. Neither Crayhill Capital Management LP nor
                its employees, officers, directors or members make any warranties
                or representations as to the accuracy of the Site.
              </p>
              <p>
                THE SITE, AND ALL INFORMATION AND MATERIALS CONTAINED HEREIN, IS
                PROVIDED TO YOU &ldquo;AS IS&rdquo; WITHOUT WARRANTY OF ANY KIND,
                EITHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, THE
                IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                PURPOSE, TITLE AND NON-INFRINGEMENT TO THE FULL EXTENT PERMITTED
                BY LAW.
              </p>

              <h5 className="text-ink">5. Limitations on Liability</h5>
              <p>
                By entering the Site you acknowledge and agree that your use is at
                your own risk and that none of the parties involved in creating,
                producing, or delivering the Site is liable for any direct,
                incidental, consequential, indirect, or punitive damages, or any
                other losses, costs, or expenses of any kind (including legal
                fees, expert fees, or other disbursements) that may arise,
                directly or indirectly, through access to the Site, use or
                browsing of the Site, or through your downloading of any text or
                images, from the Site.
              </p>

              <h5 className="text-ink">6. Termination and Assignment</h5>
              <p>
                You acknowledge and agree that Crayhill Capital Management LP may
                terminate your access to the Site should you fail to comply with
                the Terms and Conditions or any other guidelines and rules
                published by Crayhill Capital Management LP. Any such termination
                shall be in Crayhill Capital Management LP&rsquo;s sole discretion
                and may occur without prior notice, or any notice. Crayhill
                Capital Management LP further reserves the right to terminate any
                user&rsquo;s access to the Site for any conduct that Crayhill
                Capital Management LP, in its sole discretion, believes
              </p>
              <ol>
                <li>
                  (A) is or may be directly or indirectly harmful to other users,
                  to Crayhill Capital Management LP or its affiliates or business
                  contractors, or to other third parties or
                </li>
                <li>
                  (B) violates any local, state, federal, or foreign laws or
                  regulations.
                </li>
              </ol>
              <p>
                You may not assign or transfer these Terms and Conditions or any
                rights or obligations hereunder without the prior written consent
                of Crayhill Capital Management LP. We may assign these Terms and
                Conditions without your consent. These Terms and Conditions do not
                create any partnership, joint venture, or agency relationship
                between you and Crayhill Capital Management LP. If any provision
                of these Terms and Conditions is found to be invalid or
                unenforceable, the remaining provisions shall remain in full force
                and effect.
              </p>

              <h5 className="text-ink">7. Indemnification</h5>
              <p>
                You agree to indemnify and hold harmless Crayhill Capital
                Management LP, its employees, officers, directors, members,
                affiliates and agents, as well as Crayhill Capital Management
                LP&rsquo;s licensors and other third parties with which Crayhill
                Capital Management LP contracts, from and against any and all
                claims, demands, actions, costs or expenses or both, including
                reasonable attorney&rsquo;s fees, incurred by or against such
                persons or entities arising out of or resulting from your use of
                the Site, your violations of these Terms and Conditions and/or
                your violation of any rights of a third party.
              </p>
              <p>
                Under no circumstances will Crayhill Capital Management LP, its
                employees, officers, directors, members or its affiliates be
                liable for any consequential, incidental, special, punitive, or
                exemplary damages arising out of any use of or inability to use
                the website or any portion thereof, regardless of whether Crayhill
                Capital Management LP, its employees, officers, directors, members
                or its affiliates have been apprised of the likelihood of such
                damages occurring and regardless of the form of action, whether in
                contract, warranty, tort (including negligence), strict liability,
                or otherwise.
              </p>

              <h5 className="text-ink">8. Applicable Law and Jurisdiction</h5>
              <p>
                By visiting the Site, you agree that the laws of the State of New
                York, without regard to principles of conflict of laws, will
                govern these Terms and Conditions and any dispute of any sort that
                may arise between you and Crayhill Capital Management LP. You
                hereby consent to the jurisdiction of the federal and state courts
                in New York for the purpose of resolving any dispute in connection
                with your visit to the Site. Crayhill Capital Management LP may
                seek injunctive or other appropriate relief in any state or
                federal court in the State of New York, and you consent to
                exclusive jurisdiction and venue in such court.
              </p>

              <h5 className="text-ink">9. User Submissions</h5>
              <p>
                By entering the Site, you acknowledge and agree that any
                communication or material you transmit to the Site or Crayhill
                Capital Management LP, in any manner and for any reason, will not
                be treated as confidential or proprietary. Furthermore, you
                acknowledge and agree that any materials you transmit to Crayhill
                Capital Management LP may be used by Crayhill Capital Management
                LP, anywhere, anytime, and for any reason whatsoever.
              </p>

              <h5 className="text-ink">10. Privacy Policy</h5>
              <p>
                Crayhill Capital Management LP&rsquo;s online privacy policy can
                be found <Link to="/privacy-policy">here</Link>.
              </p>

              <h5 className="text-ink">11. Severability</h5>
              <p>
                If any of the Terms and Conditions shall be deemed invalid, void,
                or for any reason unenforceable, such condition shall be deemed
                severable and shall not affect the validity and enforceability of
                any of the remaining Terms and Conditions.
              </p>

              <h5 className="text-ink">12. Investment Adviser Disclosure</h5>
              <p>
                Crayhill Capital Management LP is a registered investment adviser
                with the United States Securities and Exchange Commission
                (&ldquo;SEC&rdquo;). Registration of an investment adviser with
                the SEC does not imply a certain level of skill or training.
              </p>
              <p>
                All information contained on this website, including any
                transaction described herein, is for informational and/or
                illustrative purposes only. Statements contained on this website
                that are not historical facts are based on current views,
                forward-looking expectations, estimates, projections, opinions
                and/or beliefs of the Crayhill Capital Management LP team. Such
                statements involve risks, uncertainties and other factors. You
                should not rely on these statements as if they were facts. Further
                information about Crayhill Capital Management LP and its affiliates
                is also available at{' '}
                <a
                  href="https://www.adviserinfo.sec.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.adviserinfo.sec.gov
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
