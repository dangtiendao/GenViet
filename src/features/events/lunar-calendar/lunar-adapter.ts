export interface LunarDate {
  lunarDay: number;
  lunarMonth: number;
  lunarYear: number;
  isLeap: boolean;
  canChiYear?: string;
}

export interface LunarCalendarAdapter {
  algorithmId: string;
  version: string;
  supportedYearRange: [number, number];
  solarToLunar(solarDate: Date | string): LunarDate;
  lunarToSolar(lunarDate: LunarDate): Date;
}
