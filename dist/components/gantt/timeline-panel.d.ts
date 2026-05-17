import { default as React } from 'react';
import { GridProps } from '../grid/grid';
import { CalendarProps } from '../calendar/calendar';
import { TimelineContentProps } from './timeline-content';

export type TimelinePanelProps = {
    gridProps: GridProps;
    calendarProps: CalendarProps;
    contentProps: TimelineContentProps;
};
/**
 * ガントチャートの右側タイムライン領域
 *
 * ### スクロールガタつき解消の核心
 * - カレンダーヘッダーを `position: sticky; top: 0` でスクロールコンテナ内部に配置
 * - `overflow: auto` を持つコンテナが縦横スクロールを一括管理するため
 *   「state → 再レンダリング → DOM 書き込み」のフレーム遅延が発生しない
 * - translateX 計算が不要になりカレンダーとグリッドのズレがゼロになる
 */
export declare const TimelinePanel: React.FC<TimelinePanelProps>;
export default TimelinePanel;
