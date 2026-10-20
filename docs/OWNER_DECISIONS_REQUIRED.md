# HOUSE OF OTARU — OWNER DECISIONS REQUIRED

> **Document ID**: `OTARU-DECISIONS-MMXXVI`  
> **Status**: Action Required by Brand Owner  
> **Purpose**: Formal record of unresolved commercial, logistical, and legal parameters required to transition House of Otaru from conditional release to verified production deployment.  

---

## Overview

The codebase has been sanitized to remove unverified promises, hardcoded carrier names, unconfirmed dispatch SLAs, and assumed corporate jurisdictions. To finalize the store's public legal pages, checkout calculations, and fulfillment operations, the brand owner must provide definitive decisions on the following five core areas.

---

## 1. Domestic & International Shipping Policy

### Context & Code Locations
- Files: [`src/app/shipping-exchanges/page.tsx`](file:///d:/otaru/src/app/shipping-exchanges/page.tsx), [`src/components/cart/CartDrawer.tsx`](file:///d:/otaru/src/components/cart/CartDrawer.tsx), [`src/components/cart/CartSummaryLedger.tsx`](file:///d:/otaru/src/components/cart/CartSummaryLedger.tsx), [`src/app/api/cart/validate/route.ts`](file:///d:/otaru/src/app/api/cart/validate/route.ts), [`src/app/checkout/page.tsx`](file:///d:/otaru/src/app/checkout/page.tsx)
- Current state in code: Neutralized policy text. Cart calculations currently default to a `$250` threshold (or ₹20,000 equivalent) for complimentary dispatch, otherwise charging a flat rate.

### Risk
Promising universally free domestic shipping without understanding individual garment box weights, volumetric packaging, and transit insurance risks severe margin erosion, particularly on lower-priced accessories.

### Exact Questions for Owner
1. **Domestic Shipping Model**: Which pricing structure will House of Otaru implement?
   - **Option A**: Universally complimentary shipping on all orders nationwide.
   - **Option B (Recommended)**: Complimentary shipping above a defined order value (e.g., ₹15,000 or ₹20,000), with standard flat-rate express fee (e.g., ₹500) below that threshold.
   - **Option C**: Real-time calculated carrier rates passed to customer at checkout.
2. **Carriers**: Which courier partners will be integrated into the fulfillment workflow (e.g., Shiprocket, Blue Dart, Delhivery, DHL)?

---

## 2. Dispatch Timeline & Operational Fulfilment SLA

### Context & Code Locations
- Files: [`src/app/shipping-exchanges/page.tsx`](file:///d:/otaru/src/app/shipping-exchanges/page.tsx), [`content/drop01.ts`](file:///d:/otaru/content/drop01.ts), [`src/components/product/ProductDetailView.tsx`](file:///d:/otaru/src/components/product/ProductDetailView.tsx)
- Current state in code: States that garments dispatch following individual quality inspection. Removed the rigid "3–5 business days" commitment.

### Risk
In luxury garments with natural botanical dye finishes, hand-hemming, or batch numbering, promising a tight 3–5 day dispatch window during drop peaks can lead to chargebacks, customer frustration, and reputational harm if artisan queues back up.

### Exact Questions for Owner
1. **Realistic Dispatch Window**: What is the achievable dispatch timeline for Batch 01 pieces?
   - **Option A**: 3 to 5 business days from order confirmation.
   - **Option B (Recommended)**: 5 to 7 business days for hand-finished atelier inspection and serial stamping.
   - **Option C**: Made-to-order window (e.g., 2–3 weeks) with explicit delivery date stated on PDP.

---

## 3. Returns, Size Exchanges & Cancellation Policy

### Context & Code Locations
- Files: [`src/app/shipping-exchanges/page.tsx`](file:///d:/otaru/src/app/shipping-exchanges/page.tsx), [`src/app/returns/page.tsx`](file:///d:/otaru/src/app/returns/page.tsx), [`src/app/terms/page.tsx`](file:///d:/otaru/src/app/terms/page.tsx), [`src/components/cart/CartDrawer.tsx`](file:///d:/otaru/src/components/cart/CartDrawer.tsx)
- Current state in code: Emphasizes size exchanges and fit consultations. Removed contradictory claims ("7 days" on shipping page vs "14 days" in cart).

### Risk
Numbered, limited-run garments cannot sustain open, mass-market return behaviors. Restocking an opened garment with natural indigo rub-off or damaged boro stitching degrades archival provenance.

### Exact Questions for Owner
1. **Return & Exchange Posture**: Which policy will House of Otaru enforce?
   - **Direction A (Recommended for Luxury Drops)**: Exchange-focused. Size exchanges permitted within 7 days of delivery subject to batch reserve availability; returns for refund accepted only in cases of verified transit damage or manufacturing defects.
   - **Direction B**: Standard 7-day or 14-day return window for full refund (unworn, original tags).
   - **Direction C**: Final Sale for limited drops, subject to statutory consumer protection rights.

---

## 4. Atelier Care, Mending & Repair Commitments

### Context & Code Locations
- Files: [`src/app/returns/page.tsx`](file:///d:/otaru/src/app/returns/page.tsx), [`src/app/terms/page.tsx`](file:///d:/otaru/src/app/terms/page.tsx), [`src/components/layout/SiteFooter.tsx`](file:///d:/otaru/src/components/layout/SiteFooter.tsx), [`src/components/home/MembershipTeaser.tsx`](file:///d:/otaru/src/components/home/MembershipTeaser.tsx)
- Current state in code: Sanitized from unconditional "Free Lifetime Repair" to "Atelier Care & Repair Intake".

### Risk
An unconditional "free lifetime repair" promise creates an indefinite, legally binding operational liability for hand-labor boro sashiko stitching and fabric reconstruction.

### Exact Questions for Owner
1. **Repair Service Structure**: What is the scope of Otaru's repair commitment?
   - **Model A (Recommended)**: Tiered repair service. Complimentary lifetime structural seam and button restoration; traditional boro hand-mending, re-waxing, and extensive repairs available at subsidized atelier material cost.
   - **Model B**: Paid restoration service only, quotes provided upon digital intake assessment.
   - **Model C**: Fully complimentary lifetime repairs on all garments bearing an authentic serial stamp.

---

## 5. Operating Business Entity, Legal Jurisdiction & Monitored Contacts

### Context & Code Locations
- Files: [`src/app/privacy/page.tsx`](file:///d:/otaru/src/app/privacy/page.tsx), [`src/app/terms/page.tsx`](file:///d:/otaru/src/app/terms/page.tsx), [`src/components/layout/SiteFooter.tsx`](file:///d:/otaru/src/components/layout/SiteFooter.tsx)
- Current state in code: Removed assumed "Bengaluru, Karnataka" jurisdiction and fictional corporate physical address. Points to `inquiries@otaru.in`.

### Risk
Citing an unverified jurisdiction or an unmonitored privacy inbox creates immediate regulatory risk under the Indian Digital Personal Data Protection Act (DPDP), 2023, and Consumer Protection (E-Commerce) Rules, 2020.

### Exact Questions for Owner
1. **Operating Entity Name**: What is the formal registered legal entity operating House of Otaru (e.g., Private Limited Company, LLP, or Sole Proprietorship)?
2. **Registered Jurisdiction**: Which city/state is the registered office located in for governing law clauses (e.g., New Delhi, Mumbai, Bengaluru, Jaipur)?
3. **Monitored Email Inboxes**: What active inboxes are monitored for:
   - General customer support and fit concierge (e.g., `concierge@otaru.in` or `atelier@...`)?
   - Privacy and data rights grievances (e.g., `privacy@...`)?
   - Official postal or registered correspondence address?

---

## Summary Action Plan

Once the owner selects an option for each of the five questions above:
1. Update `src/app/shipping-exchanges/page.tsx` with confirmed dispatch days and return window.
2. Update `src/app/terms/page.tsx` with confirmed legal entity name and governing jurisdiction.
3. Update `src/app/privacy/page.tsx` with confirmed privacy contact and grievance officer details.
4. Harmonize cart threshold variables in `src/components/cart/CartDrawer.tsx` and `src/app/api/cart/validate/route.ts`.
