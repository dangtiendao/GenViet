# Public Media & Storage Security Policy

## 1. Storage Isolation
- All media files reside in private storage buckets.
- Guests are NEVER given direct S3/Storage object paths or long-lived public access.

## 2. Public Media Delivery
- Public thumbnails are delivered via short-lived signed URLs (15 minutes TTL).
- Avatars for living individuals are not public by default.
- Scan documents, private records, and unapproved albums remain strictly private.
