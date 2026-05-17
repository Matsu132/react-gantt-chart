import { default as React } from 'react';
import { RenderedTask } from '../types/rendered-task';
import { Task } from '../types/public-types';

export declare function isKeyboardEvent(event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent): event is React.KeyboardEvent;
export declare function isMouseEvent(event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent): event is React.MouseEvent;
export declare function isRenderedTask(task: Task | RenderedTask): task is RenderedTask;
/**
 * 折りたたまれたプロジェクト配下の子タスクを除外する
 */
export declare function removeHiddenTasks(tasks: Task[]): Task[];
/**
 * displayOrder に基づいてタスクをソートする比較関数
 */
export declare const sortTasks: (taskA: Task, taskB: Task) => 0 | 1 | -1;
