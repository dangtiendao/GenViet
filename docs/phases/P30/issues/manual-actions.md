# P30: Manual Actions Required (Post-Phase)

1. **Remote Database Migration**: Run `supabase db push` or apply `20260831200000_p30_public_guest_view.sql` on remote Staging / Production Supabase project when authorized.
2. **CDN & Edge Caching**: Verify cache headers on preview / staging deployment for public routes.
