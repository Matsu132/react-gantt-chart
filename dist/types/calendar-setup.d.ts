import { ViewMode } from './public-types';

/** カレンダー描画に必要なセットアップ情報 */
export interface CalendarSetup {
    dates: Date[];
    viewMode: ViewMode;
}
