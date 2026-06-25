-- Seed data: crayhill.site_pages
--
-- Legal Notice & Disclosures and Privacy Policy copy. Load AFTER migration
-- 2026_06_24_005_create_site_pages.sql via the mysql client (NOT migrate.php).
--
--   mysql ... crayhill < api/seeds/site_pages_seed.sql
--
-- Source Markdown lives in api/seeds/content/*.md for readability; this SQL
-- file is the reproducible loader. After the first deploy the DB is the source
-- of truth; edit via /admin/pages or hand-edit this seed to reprovision.

INSERT INTO site_pages (slug, title, subtitle, meta_description, status, content) VALUES
  ('legal-notice-and-disclosures', 'Legal Notice & Disclosures', NULL, 'Website terms and conditions, intellectual property, disclaimers, limitations on liability, and investment adviser disclosures for Crayhill Capital Management.', 'published', '### Website Terms & Conditions

Welcome to Crayhill.com. The information offered by Crayhill Capital Management LP and its affiliates (collectively, the "Firm") on this website (the "Site") is subject to these terms and conditions (the "Terms and Conditions"). These Terms and Conditions apply to all users and constitute a legally binding agreement between the Firm and you, the user of our Site. By entering the Site or by transmitting any information to the Site you acknowledge that you have read, understood and agree to all of these Terms and Conditions. If you do not agree to the Terms and Conditions, please do not use the Site. Any use of the Site in a manner inconsistent with these Terms and Conditions is deemed unauthorized access and may subject the user to civil or criminal penalties. We reserve the right to revise this legal information at any time and for any reason, without notice or obligation, by updating this posting. Your continued use of the Site following the posting of any changes to the Terms and Conditions will mean that you accept such amendments. We strongly recommend that you periodically visit this page of the Site to review the Terms and Conditions.

This website page is intended solely to provide information regarding general financing capabilities of Crayhill Capital Management LP for prospective portfolio investments. The information provided on this page, including any information regarding Crayhill Capital Management LP''s current and historical portfolio investments, is not a complete list thereof, and it is not intended to recommend any investment described herein and is not an offer or sale of any security or investment product or investment advice. Crayhill Capital Management LP provides investment advisory services to the privately offered Crayhill Capital Management LP funds. Crayhill Capital Management LP does not solicit or make its services available to the public or other advisory clients for purposes of investment in the Crayhill Capital Management LP funds. Nothing on this Site constitutes or forms a part of any offer for sale or subscription of, or any invitation to offer to buy or subscribe for, any securities, nor should it or any part of it form the basis of, or be relied upon in any way in connection with any contract or commitment whatsoever, nor does any information on this Site constitute a comprehensive or complete statement of the matters discussed or the law relating thereto. No action should be taken or omitted to be taken in reliance upon information on this site. Advice from a suitably qualified professional should always be sought in relation to any particular matter or circumstance.

##### 1. Copyrights and Trademarks

By entering the Site you acknowledge and agree that each name, logo, trademark, or service mark contained on the Site is owned or licensed by Crayhill Capital Management LP and may not be used by you without the prior written approval of Crayhill Capital Management LP. Crayhill Capital Management LP will aggressively enforce its intellectual property rights to the full extent of the law. Information or images of places or people are either the property of Crayhill Capital Management LP or used on the Site by Crayhill Capital Management LP with permission. Your use of any such materials is prohibited unless specifically permitted by Crayhill Capital Management LP. Any unauthorized use of such materials may subject you to penalties or damages, including, without limitation, those related to violation of trademarks, copyrights, privacy and publicity rights.

##### 2. Restricted Use of Site Materials

Crayhill Capital Management LP grants you a limited license to access and make use of the Site. For your personal use only, you may print copies of the information from the Site, and you may store information from the Site on your own computer. You may not modify the Site, or any portion thereof, for any reason. Any unauthorized use terminates the permission or limited license granted by Crayhill Capital Management LP. Crayhill Capital Management LP reserves all other rights.

##### 3. Linking, Posting and Transmitting

Although Crayhill Capital Management LP provides the information accessible on the Site for your personal, non-commercial use, Crayhill Capital Management LP retains all property rights, including, without limitation, property rights under U.S. and international copyright law, to all such information. Without the prior express written permission of Crayhill Capital Management LP, you MAY NOT do any of the following:

1. (A) hyperlink to the Site, whether to its homepage or to an interior page;
2. (B) include information from the Site on another site, on a server computer, or in documents;
3. (C) modify or re-use the information from the Site; or
4. (D) transmit any commands, codes or information to the Site, with the exception of those commands necessary to view the Site. Crayhill Capital Management LP reserves all other rights.

Do not transmit to the Site or to any Crayhill Capital Management LP personnel, any pornographic, obscene, profane, defamatory, libelous, threatening, or unlawful material or any unsolicited commercial communications.

Do not transmit to the Site or to any Crayhill Capital Management LP personnel any material that could constitute or encourage unlawful conduct that would be considered a criminal offense, give rise to civil liability, or otherwise violate any law or regulation.

Notwithstanding the fact that Crayhill Capital Management LP, or other parties involved in creating, producing, or delivering the Site, may monitor or review any transmissions to the Site or to Crayhill Capital Management LP personnel, Crayhill Capital Management LP and such other parties assume no responsibility or liability that may arise from the content thereof, including, without limitation, claims for defamation, libel, slander, obscenity, pornography, profanity, or misrepresentation.

Although the Site may be linked to other sites upon permission, Crayhill Capital Management LP is not, directly or indirectly, implying any approval, association, sponsorship, endorsement, or affiliation with the linked site, unless specifically stated therein. By entering the Site, you acknowledge and agree that Crayhill Capital Management LP has not reviewed all the sites that may be linked to the Site and is not responsible for the content of any off-site pages or any other site linked to the Site.

You further acknowledge and agree that when you follow links to pages not maintained on the Site, you do so at your own risk.

##### 4. Disclaimers

While Crayhill Capital Management LP make all reasonable efforts to help ensure that all material on the Site is correct, accuracy cannot be guaranteed. Neither Crayhill Capital Management LP nor its employees, officers, directors or members make any warranties or representations as to the accuracy of the Site.

THE SITE, AND ALL INFORMATION AND MATERIALS CONTAINED HEREIN, IS PROVIDED TO YOU "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT TO THE FULL EXTENT PERMITTED BY LAW.

##### 5. Limitations on Liability

By entering the Site you acknowledge and agree that your use is at your own risk and that none of the parties involved in creating, producing, or delivering the Site is liable for any direct, incidental, consequential, indirect, or punitive damages, or any other losses, costs, or expenses of any kind (including legal fees, expert fees, or other disbursements) that may arise, directly or indirectly, through access to the Site, use or browsing of the Site, or through your downloading of any text or images, from the Site.

##### 6. Termination and Assignment

You acknowledge and agree that Crayhill Capital Management LP may terminate your access to the Site should you fail to comply with the Terms and Conditions or any other guidelines and rules published by Crayhill Capital Management LP. Any such termination shall be in Crayhill Capital Management LP''s sole discretion and may occur without prior notice, or any notice. Crayhill Capital Management LP further reserves the right to terminate any user''s access to the Site for any conduct that Crayhill Capital Management LP, in its sole discretion, believes

1. (A) is or may be directly or indirectly harmful to other users, to Crayhill Capital Management LP or its affiliates or business contractors, or to other third parties or
2. (B) violates any local, state, federal, or foreign laws or regulations.

You may not assign or transfer these Terms and Conditions or any rights or obligations hereunder without the prior written consent of Crayhill Capital Management LP. We may assign these Terms and Conditions without your consent. These Terms and Conditions do not create any partnership, joint venture, or agency relationship between you and Crayhill Capital Management LP. If any provision of these Terms and Conditions is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.

##### 7. Indemnification

You agree to indemnify and hold harmless Crayhill Capital Management LP, its employees, officers, directors, members, affiliates and agents, as well as Crayhill Capital Management LP''s licensors and other third parties with which Crayhill Capital Management LP contracts, from and against any and all claims, demands, actions, costs or expenses or both, including reasonable attorney''s fees, incurred by or against such persons or entities arising out of or resulting from your use of the Site, your violations of these Terms and Conditions and/or your violation of any rights of a third party.

Under no circumstances will Crayhill Capital Management LP, its employees, officers, directors, members or its affiliates be liable for any consequential, incidental, special, punitive, or exemplary damages arising out of any use of or inability to use the website or any portion thereof, regardless of whether Crayhill Capital Management LP, its employees, officers, directors, members or its affiliates have been apprised of the likelihood of such damages occurring and regardless of the form of action, whether in contract, warranty, tort (including negligence), strict liability, or otherwise.

##### 8. Applicable Law and Jurisdiction

By visiting the Site, you agree that the laws of the State of New York, without regard to principles of conflict of laws, will govern these Terms and Conditions and any dispute of any sort that may arise between you and Crayhill Capital Management LP. You hereby consent to the jurisdiction of the federal and state courts in New York for the purpose of resolving any dispute in connection with your visit to the Site. Crayhill Capital Management LP may seek injunctive or other appropriate relief in any state or federal court in the State of New York, and you consent to exclusive jurisdiction and venue in such court.

##### 9. User Submissions

By entering the Site, you acknowledge and agree that any communication or material you transmit to the Site or Crayhill Capital Management LP, in any manner and for any reason, will not be treated as confidential or proprietary. Furthermore, you acknowledge and agree that any materials you transmit to Crayhill Capital Management LP may be used by Crayhill Capital Management LP, anywhere, anytime, and for any reason whatsoever.

##### 10. Privacy Policy

Crayhill Capital Management LP''s online privacy policy can be found [here](/privacy-policy).

##### 11. Severability

If any of the Terms and Conditions shall be deemed invalid, void, or for any reason unenforceable, such condition shall be deemed severable and shall not affect the validity and enforceability of any of the remaining Terms and Conditions.

##### 12. Investment Adviser Disclosure

Crayhill Capital Management LP is a registered investment adviser with the United States Securities and Exchange Commission ("SEC"). Registration of an investment adviser with the SEC does not imply a certain level of skill or training.

All information contained on this website, including any transaction described herein, is for informational and/or illustrative purposes only. Statements contained on this website that are not historical facts are based on current views, forward-looking expectations, estimates, projections, opinions and/or beliefs of the Crayhill Capital Management LP team. Such statements involve risks, uncertainties and other factors. You should not rely on these statements as if they were facts. Further information about Crayhill Capital Management LP and its affiliates is also available at [https://www.adviserinfo.sec.gov](https://www.adviserinfo.sec.gov).'),
  ('privacy-policy', 'Crayhill Privacy Policy', 'March 2026', 'How Crayhill Capital Management collects, uses, safeguards, and discloses personal information of current, former, and prospective clients and investors.', 'published', 'Crayhill Capital Management LP and its affiliates ("Crayhill") may collect personal information (which includes public and non-public personal information), such as name, address, social security number, birth date, assets, income, investment experience and other information about current, former and prospective clients and investors. This information is compiled from: (i) subscription documents and related forms and agreements completed by such persons; (ii) transactions between such persons and Crayhill (e.g., account activity and balances); and (iii) other third-party sources (e.g., credit reporting agencies).

Personal information is not shared with any unaffiliated third parties for their marketing purposes. Crayhill may use, disclose and otherwise process personal information for its business, administrative and marketing purposes. Crayhill also may reveal personal information in its possession to its regulators and appropriate government agencies, as necessary and as required under applicable laws, in connection with legal proceedings or otherwise to assert and protect legal interests or as part of a corporate transaction with a successor or affiliate. Crayhill restricts access to such personal information from its personnel, its affiliates and affiliates'' personnel, its service providers and its outside counsel, auditors and other independent professionals, and such information may be disclosed solely on a need-to-know basis.

Crayhill maintains reasonably appropriate administrative, technical, and organizational controls to safeguard such personal information, although such safeguards may not prevent all breaches of information security. If the security of personal information is compromised, Crayhill will notify the affected individuals of the data security incident where required by and consistent with applicable law.

Individuals may exercise their rights under applicable law to access such personal information as is held by Crayhill, to rectify or delete any personal information that is factually incorrect, incomplete or irrelevant for the purpose for which it is processed and to raise any queries or concerns as to the use of their personal information by contacting Crayhill.

In order to use and disclose such personal information for the purposes described above, Crayhill may transfer such personal information internationally to countries that the United States has deemed not to provide adequate data protection. Current, former and prospective clients and investors recognize the necessity of such international processing of personal information and consent to such international transfers of personal information, including social security and taxpayer identification numbers, as Crayhill deems reasonably appropriate. Crayhill will ensure application of the same standards of privacy protection as set out in this privacy policy regardless of the country in which such personal information is processed.

The policy is effective as of March 2026. If, at any time in the future, it is necessary to disclose any personal information in a way that is materially inconsistent with this policy, Crayhill will give the relevant person written notice of the change and, where required under applicable law, obtain consent to such change.')
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  subtitle = VALUES(subtitle),
  meta_description = VALUES(meta_description),
  status = VALUES(status),
  content = VALUES(content);
