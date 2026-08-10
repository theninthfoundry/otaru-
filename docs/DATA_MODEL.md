# Data Model & Order States Specification — Otaru Platform

This document describes the state machine configurations and data model definitions forming the foundation for Phase 1 database design.

---

## 🚦 Order State Machine

All transactions within the Otaru registry proceed along a strictly validated state transition lifecycle:

```
[CREATED] ──> [PAYMENT_PENDING] ──> [PAID] ──> [CONFIRMED] ──> [FULFILLMENT_PENDING] ──> [FULFILLING] ──> [SHIPPED] ──> [DELIVERED]
                      │               │                                                   │
                      └──> [FAILED]   └──> [CANCELLED]                                    └──> [FAILED]
```

### State Transits Reference

- **CREATED**: Order instance initialized inside the Otaru checkout tunnel.
- **PAYMENT_PENDING**: Custom Razorpay payment token generated. Signature check pending.
- **PAID**: Razorpay webhook triggers, validates HMAC signature, and marks transaction as paid.
- **CONFIRMED**: Inventory reserved on Shopify; order synchronizes.
- **FULFILLMENT_PENDING**: Pending assignment of courier and AWB generation.
- **FULFILLING**: Waybill (AWB) generated through Shiprocket API.
- **SHIPPED**: Package dispatched from our fulfillment center.
- **DELIVERED**: Delivery confirmation received. Order completed.

### Refund & Failure Loops

- **FAILED**: Triggers if signature verification times out or payments fail.
- **CANCELLED**: Triggers on merchant refusal, chargebacks, or fraud triggers.
- **REFUND_PENDING**: Refund requested. Razorpay verification check processing.
- **REFUNDED**: Funds returned to source.

---

## 🗄️ Database Schema Design (Phase 1 Blueprint)

In Phase 1, we will implement a PostgreSQL database utilizing Prisma ORM.

### Models Draft

```prisma
model User {
  id            String      @id @default(uuid())
  email         String      @unique
  name          String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  membership    Membership?
  orders        Order[]
}

model Membership {
  id            String      @id @default(uuid())
  userId        String      @unique
  user          User        @relation(fields: [userId], references: [id])
  tier          String      // "PATRON", "COLLECTOR", "FOUNDER"
  active        Boolean     @default(true)
  expiresAt     DateTime?
}

model Order {
  id            String      @id @default(uuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  shopifyId     String?     @unique // Shopify Order ID
  status        OrderStatus @default(CREATED)
  totalAmount   Decimal     @db.Decimal(10, 2)
  currencyCode  String      @default("USD")
  transactions  Transaction[]
  shipments     Shipment[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

enum OrderStatus {
  CREATED
  PAYMENT_PENDING
  PAID
  CONFIRMED
  FULFILLMENT_PENDING
  FULFILLING
  SHIPPED
  DELIVERED
  FAILED
  CANCELLED
  REFUND_PENDING
  REFUNDED
}

model Transaction {
  id            String      @id @default(uuid())
  orderId       String
  order         Order       @relation(fields: [orderId], references: [id])
  gatewayId     String      @unique // Razorpay Order ID / Payment ID
  amount        Decimal     @db.Decimal(10, 2)
  currencyCode  String
  status        String      // "captured", "failed", "refunded"
  signature     String?     // Verified HMAC signature
  createdAt     DateTime    @default(now())
}

model Shipment {
  id            String      @id @default(uuid())
  orderId       String
  order         Order       @relation(fields: [orderId], references: [id])
  courierName   String
  awbCode       String      @unique
  trackingUrl   String?
  status        String      // "PROCESSING", "SHIPPED", "DELIVERED"
  updatedAt     DateTime    @updatedAt
}
```
