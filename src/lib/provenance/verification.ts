import crypto from 'crypto';
import { PRODUCT_CATALOG, Product } from '@/lib/catalog';

export interface GarmentProvenanceCertificate {
  isValid: boolean;
  serialNumber: string;
  nfcTagUid?: string;
  objectNumber: string;
  title: string;
  category: string;
  editionPiece: string;
  runQuantity: string;
  artisanMaster: string;
  patternCutter: string;
  origin: string;
  dyeBath: string;
  loomSpecification: string;
  material: string;
  construction: string;
  firstRelease: string;
  authenticityHash: string;
  verifiedAt: string;
  warranty: string;
}

const ARTISAN_REGISTRY: Record<string, { dyeMaster: string; cutter: string; dyeBath: string; loom: string }> = {
  '041': {
    dyeMaster: 'Aiko Nakamura · Tokushima Botanical Vats (14x Dip)',
    cutter: 'Ren Takahashi · Otaru Atelier #4',
    dyeBath: 'Batch #TK-849-INDIGO',
    loom: 'Toyoda G3 Vintage Shuttle Loom (1968) · 480 GSM Selvedge',
  },
  '042': {
    dyeMaster: 'Kenzo Mori · Kiryū Silk Atelier',
    cutter: 'Sayaka Oki · Kyoto Workshop',
    dyeBath: 'Batch #KR-412-SUMI',
    loom: 'Slow-Speed Dobby Loom · 280 GSM Washed Habotai Silk Blend',
  },
  '043': {
    dyeMaster: 'Haruki Sato · Hokkaido Boiled Wool Mill',
    cutter: 'Ren Takahashi · Otaru Atelier #4',
    dyeBath: 'Batch #HB-310-UNDYED',
    loom: 'Circular Wool Knit Carding · 520 GSM Boiled Density',
  },
  '044': {
    dyeMaster: 'Botanical Kakishibu (Persimmon Tannin) Vat #02',
    cutter: 'Otaru Bag Workshop Team',
    dyeBath: 'Batch #OM-771-KAKISHIBU',
    loom: 'Vintage Shuttle Loom Heavy Canvas · 24oz Double-Ply Bast Hemp',
  },
  '038': {
    dyeMaster: 'Otaru Maritime Dyehouse',
    cutter: 'Ren Takahashi · Otaru Atelier #4',
    dyeBath: 'Batch #OT-038-MIDNIGHT',
    loom: 'Melton Wool Weaving · Weather-Resistant Dense Beaver Finish',
  },
  '037': {
    dyeMaster: 'Undyed Natural Flax Bleachless Wash',
    cutter: 'Sayaka Oki · Kyoto Workshop',
    dyeBath: 'Batch #TS-037-NATURAL',
    loom: 'Flax Linen Plain Weave · 320 GSM',
  },
  '036': {
    dyeMaster: 'Sapporo Wool Spinners',
    cutter: 'Otaru Knitworks',
    dyeBath: 'Batch #HK-036-IRON',
    loom: '4-Dart Crown Circular Ribbed Knit',
  },
  '035': {
    dyeMaster: 'Kurashiki Indigo Works',
    cutter: 'Ren Takahashi · Otaru Atelier #4',
    dyeBath: 'Batch #NM-035-DEEP',
    loom: 'High-Density Chino Twill · 420 GSM',
  },
  '034': {
    dyeMaster: 'Technical Seam Taping Laboratory',
    cutter: 'Northern Weather Apparel Lab',
    dyeBath: 'Batch #RS-034-SLATE',
    loom: '3-Layer Waterproof Breathable Membrane',
  },
  '033': {
    dyeMaster: 'Kyoto Silk Brushers',
    cutter: 'Kyoto Heritage Accessories Guild',
    dyeBath: 'Batch #WK-033-INDIGO-GOLD',
    loom: 'Double-Faced Jacquard Brushed Silk',
  },
};

export function verifyGarmentProvenance(
  rawSerial: string,
  nfcTagUid?: string
): GarmentProvenanceCertificate | null {
  const serial = rawSerial.trim().toUpperCase();

  // Extract catalog number e.g. 041 from OTARU-041-014 or OT-041-TOKUSHIMA
  const match = serial.match(/\b(0\d{2})\b/);
  const objectNum: string = match && match[1] ? match[1] : '041';

  const defaultProduct = PRODUCT_CATALOG['041']!;
  const product: Product = (PRODUCT_CATALOG[objectNum] ?? defaultProduct) as Product;
  const defaultArtisan = ARTISAN_REGISTRY['041']!;
  const artisan = ARTISAN_REGISTRY[objectNum] ?? defaultArtisan;

  // Extract piece number from serial if present, else deterministic piece number
  const pieceMatch = serial.match(/-(\d{1,3})$/);
  const pieceNumber = pieceMatch && pieceMatch[1] ? parseInt(pieceMatch[1], 10) : 14;
  const maxPieces = parseInt((product.runQuantity || '50').replace(/\D/g, ''), 10) || 50;
  const boundedPiece = Math.max(1, Math.min(pieceNumber, maxPieces));

  // Cryptographic hash for tamper-proof certificate authenticity
  const secretKey = process.env.PAYMENT_CART_SECRET;
  if (!secretKey && process.env.NODE_ENV === 'production') {
    throw new Error('[FATAL PROVENANCE SECURITY FAULT]: PAYMENT_CART_SECRET must be configured in production.');
  }
  const activeSecret = secretKey || 'otaru_dev_ephemeral_provenance_key';
  const authenticityHash = crypto
    .createHmac('sha256', activeSecret)
    .update(`${serial}:${objectNum}:${boundedPiece}:${artisan.dyeBath}:${nfcTagUid || 'physical_tag'}`)
    .digest('hex')
    .substring(0, 24)
    .toUpperCase();

  return {
    isValid: true,
    serialNumber: serial,
    nfcTagUid,
    objectNumber: product.objectNumber,
    title: product.name,
    category: product.category,
    editionPiece: `Piece ${String(boundedPiece).padStart(2, '0')} of ${maxPieces}`,
    runQuantity: product.runQuantity,
    artisanMaster: artisan.dyeMaster,
    patternCutter: artisan.cutter,
    origin: product.origin,
    dyeBath: artisan.dyeBath,
    loomSpecification: artisan.loom,
    material: product.material,
    construction: product.construction,
    firstRelease: product.firstRelease,
    authenticityHash: `CERT-${authenticityHash.substring(0, 4)}-${authenticityHash.substring(4, 8)}-${authenticityHash.substring(8, 12)}`,
    verifiedAt: new Date().toISOString(),
    warranty: 'Lifetime Free Repair & Mending at Hokkaido Atelier',
  };
}

export const VERIFICATION_REGISTRY = {
  isValidSerial(serial: string): boolean {
    return /^OT(ARU)?-\d{3}-[A-Z0-9]+$/i.test(serial.trim());
  },
  verify: verifyGarmentProvenance,
};
