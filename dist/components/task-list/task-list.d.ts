import { default as React } from 'react';
import { RenderedTask } from '../../types/rendered-task';
import { Task } from '../../types/public-types';

export type TaskListProps = {
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
    rowHeight: number;
    locale: string;
    tasks: Task[];
    visibleTasks?: Task[];
    horizontalContainerClass?: string;
    selectedTask?: RenderedTask | undefined;
    selectedTaskId?: string;
    setSelectedTask: (taskId: string) => void;
    onExpanderClick: (task: Task) => void;
    TaskListHeader?: React.FC<{
        headerHeight: number;
        rowWidth: string;
        fontFamily: string;
        fontSize: string;
    }>;
    TaskListTable?: React.FC<{
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
    taskListWidth?: number;
};
export declare const TaskList: React.FC<TaskListProps>;
export default TaskList;
