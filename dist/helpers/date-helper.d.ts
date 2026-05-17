import { Task, ViewMode } from '../types/public-types';

export type DateHelperScales = "year" | "month" | "week" | "day" | "hour" | "minute" | "second" | "millisecond";
export declare const getCachedDateTimeFormat: (locString: string | string[], opts?: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat;
export declare const addToDate: (date: Date, quantity: number, scale: DateHelperScales) => Date;
export declare const startOfDate: (date: Date, scale: DateHelperScales) => Date;
export declare const getLocaleMonth: (date: Date, locale: string) => string;
export declare const getLocalDayOfWeek: (date: Date, locale: string, format?: "long" | "short" | "narrow") => string;
export declare const getWeekNumberISO8601: (date: Date) => string;
export declare const getDaysInMonth: (month: number, year: number) => number;
export declare const seedDates: (startDate: Date, endDate: Date, viewMode: ViewMode) => Date[];
export declare const ganttDateRange: (tasks: Task[], viewMode: ViewMode, preStepsCount: number) => Date[];
