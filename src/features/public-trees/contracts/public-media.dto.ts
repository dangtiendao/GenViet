/**
 * Public Media DTO (P30-T05, P30-T22)
 * Ensures no storage object paths or bucket internals are exposed.
 */

export interface PublicMediaDto {
  id: string;
  thumbnailUrl: string;
  expiresAt: string;
}
