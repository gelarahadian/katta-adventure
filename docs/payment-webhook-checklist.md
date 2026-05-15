# Payment and Webhook Production Checklist

Use this checklist before switching Midtrans flow to production.

## Environment Variables

- `DATABASE_URL` points to production database.
- `APP_ORIGIN` points to production frontend URL.
- `MIDTRANS_IS_PRODUCTION=true` in production.
- `MIDTRANS_SERVER_KEY` uses production server key.
- `MIDTRANS_CLIENT_KEY` uses production client key.

## Midtrans Dashboard Setup

- Payment Notification URL:
  - `https://<backend-domain>/api/v1/orders/midtrans/webhook`
- Finish URL:
  - `https://<frontend-domain>/checkout/success`
- Unfinish URL:
  - `https://<frontend-domain>/checkout/pending`
- Error URL:
  - `https://<frontend-domain>/checkout/failed`

## Backend Checks

- `POST /api/v1/orders` creates order with `AWAITING_PAYMENT` status.
- `POST /api/v1/orders/midtrans/webhook` validates signature.
- Webhook updates `Payment` and `Order` statuses correctly.
- `GET /api/v1/orders/:orderNumber/status` returns latest state for frontend polling.

## Frontend Checks

- Checkout redirects to Midtrans for `MIDTRANS` provider.
- Result pages render status by polling order API:
  - `/checkout/success`
  - `/checkout/pending`
  - `/checkout/failed`
- `order_id` query is handled from Midtrans redirect.

## Operational Safety

- Enable monitoring/alerts for webhook 4xx/5xx responses.
- Keep retry-safe behavior (idempotent status updates).
- Verify server clock is synchronized (NTP) for signature-sensitive integrations.
- Keep keys only in secure env storage, never in repository.
