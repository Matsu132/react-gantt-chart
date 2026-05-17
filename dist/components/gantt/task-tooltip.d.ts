import { default as React } from 'react';
import { Task } from '../../types/public-types';
import { RenderedTask } from '../../types/rendered-task';

export type TaskTooltipProps = {
    task: RenderedTask;
    arrowIndent: number;
    rtl: boolean;
    svgWidth: number;
    fontSize: string;
    fontFamily: string;
    mousePos?: {
        x: number;
        y: number;
    };
    TooltipContent: React.FC<{
        task: Task;
        fontSize: string;
        fontFamily: string;
    }>;
};
/**
 * ガントチャートのデフォルトツールチップ表示内容
 */
export declare const DefaultTooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
}>;
/**
 * ホバー時に表示されるタスク詳細ツールチップ
 */
export declare const TaskTooltip: React.FC<TaskTooltipProps>;
export default TaskTooltip;
