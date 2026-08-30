import { z } from "zod";
import { CalendarSystemSchema } from "../event-types/event.types";

export const LeapMonthRuleSchema = z.enum(["normal_month", "leap_month_only", "both_months"]);

export type LeapMonthRule = z.infer<typeof LeapMonthRuleSchema>;

export interface DeathAnniversaryObservance {
  id: string;
  treeId: string;
  personId: string;
  calendarSystem: "solar" | "lunar";
  month: number; // 1 - 12
  day: number; // 1 - 30
  isLeapMonth?: boolean;
  leapMonthRule: LeapMonthRule;
  customNotes?: string;
  isEnabled: boolean;
}

export interface NextAnniversaryOccurrence {
  solarDate: string; // YYYY-MM-DD
  lunarDateDescription: string;
  daysRemaining: number;
}
