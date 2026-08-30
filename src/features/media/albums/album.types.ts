import { z } from "zod";

export const CreateAlbumSchema = z.object({
  treeId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  coverMediaId: z.string().uuid().optional(),
});

export type CreateAlbumInput = z.infer<typeof CreateAlbumSchema>;

export interface PhotoAlbum {
  id: string;
  treeId: string;
  title: string;
  description?: string;
  coverMediaId?: string;
  mediaCount: number;
  createdAt: string;
  updatedAt: string;
}
