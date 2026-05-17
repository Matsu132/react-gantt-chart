import { default as React } from 'react';
import { Task } from '../../types/public-types';

export declare const TaskListTableDefault: React.FC<{
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    locale: string;
    tasks: Task[];
    visibleTasks?: Task[];
    selectedTaskId: string;
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
}>;
export type TaskListTableProps = typeof TaskListTableDefault;
export default TaskListTableDefault;
