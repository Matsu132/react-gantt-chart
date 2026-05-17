import { default as React } from 'react';
import { Task, EventOption } from '../../types/public-types';
import { RenderedTask } from '../../types/rendered-task';
import { GanttInteractionState } from '../../types/interaction-types';

export type TimelineContentProps = {
    /** 仮想スクロールで切り出した表示中タスク */
    tasks: RenderedTask[];
    /** 矢印描画などに使う全タスクリスト */
    allTasks?: RenderedTask[];
    interactionState: GanttInteractionState;
    selectedTask: RenderedTask | undefined;
    rowHeight: number;
    columnWidth: number;
    timeStep: number;
    svg?: React.RefObject<SVGSVGElement>;
    svgWidth: number;
    /** 全タスク合計高さ（SVG の height） */
    svgHeight?: number;
    taskHeight: number;
    arrowColor: string;
    arrowIndent: number;
    fontSize: string;
    fontFamily: string;
    rtl: boolean;
    setInteractionState: (value: GanttInteractionState) => void;
    setFailedTask: (value: RenderedTask | null) => void;
    setSelectedTask: (taskId: string) => void;
    mousePos?: {
        x: number;
        y: number;
    };
    TooltipContent?: React.FC<{
        task: Task;
        fontSize: string;
        fontFamily: string;
    }>;
} & EventOption;
export declare const TimelineContent: React.FC<TimelineContentProps>;
export default TimelineContent;
