import { default as React } from 'react';
import { ViewMode } from '../../types/public-types';
import { CalendarSetup } from '../../types/calendar-setup';

export type CalendarProps = {
    dateSetup: CalendarSetup;
    locale: string;
    viewMode: ViewMode;
    headerHeight: number;
    columnWidth: number;
    fontFamily: string;
    fontSize: string;
    rtl?: boolean;
    calendarTopHeaderFormat?: (date: Date, viewMode: ViewMode) => string;
    calendarBottomHeaderFormat?: (date: Date, viewMode: ViewMode) => string;
};
export declare const Calendar: React.FC<CalendarProps>;
export default Calendar;
