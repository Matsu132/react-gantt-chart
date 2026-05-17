import { default as React } from 'react';
import { RenderedTask } from '../../types/rendered-task';
import { ChartInteraction } from '../../types/interaction-types';

export type TaskItemProps = {
    task: RenderedTask;
    arrowIndent: number;
    taskHeight: number;
    isProgressChangeable: boolean;
    isDateChangeable: boolean;
    isDelete: boolean;
    isSelected: boolean;
    rtl: boolean;
    onEventStart: (action: ChartInteraction, selectedTask: RenderedTask, event?: React.MouseEvent | React.KeyboardEvent) => void;
};
export declare const TaskItem: React.FC<TaskItemProps>;
export default TaskItem;
