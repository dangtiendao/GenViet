import { z } from "zod";

export const EventTypeSchema = z.enum([
  "birth",
  "death",
  "marriage",
  "burial",
  "anniversary",
  "migration",
  "education",
  "occupation",
  "custom",
]);

export type EventType = z.infer<typeof EventTypeSchema>;

export const EventPrivacySchema = z.enum(["public", "private", "confidential"]);
export type EventPrivacy = z.infer<typeof EventPrivacySchema>;

export const CalendarSystemSchema = z.enum(["solar", "lunar"]);
export type CalendarSystem = z.infer<typeof CalendarSystemSchema>;

export const CreateFamilyEventSchema = z.object({
  treeId: z.string().uuid(),
  personId: z.string().uuid().optional(),
  eventType: EventTypeSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  eventDate: z.string().optional(),
  calendarSystem: CalendarSystemSchema.default("solar"),
  place: z.string().max(200).optional(),
  privacy: EventPrivacySchema.default("private"),
});

export type CreateFamilyEventInput = z.infer<typeof CreateFamilyEventSchema>;

export interface FamilyEvent {
  id: string;
  treeId: string;
  personId?: string;
  eventType: EventType;
  title: string;
  description?: string;
  eventDate?: string;
  calendarSystem: CalendarSystem;
  place?: string;
  privacy: EventPrivacy;
  createdAt: string;
  updatedAt: string;
}
