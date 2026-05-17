import { Task } from '../types/public-types';
import { RenderedTask } from '../types/rendered-task';
import { DragAction } from '../types/interaction-types';

/**
 * 指定日付に対応するSVG上のX座標を線形補間で算出する
 */
export declare const taskXCoordinate: (date: Date, dates: Date[], columnWidth: number) => number;
/**
 * Task[] をピクセル座標付きの RenderedTask[] に変換する
 */
export declare const convertToRenderedTasks: (tasks: Task[], dates: Date[], columnWidth: number, rowHeight: number, taskHeight: number, barCornerRadius: number, handleWidth: number, rtl: boolean, barProgressColor: string, barProgressSelectedColor: string, barBackgroundColor: string, barBackgroundSelectedColor: string, projectProgressColor: string, projectProgressSelectedColor: string, projectBackgroundColor: string, projectBackgroundSelectedColor: string, milestoneBackgroundColor: string, milestoneBackgroundSelectedColor: string) => RenderedTask[];
export declare const calcProgressGeometry: (taskX1: number, taskX2: number, progress: number, rtl: boolean) => number[];
export declare const progressByProgressWidth: (progressWidth: number, task: RenderedTask) => number;
export declare const getProgressHandlePoint: (progressX: number, taskY: number, taskHeight: number) => string;
/**
 * SVG上のマウスX座標とドラッグ操作種別から変更後のタスク座標を算出する
 */
export declare const applyDragToTask: (svgX: number, action: DragAction, selectedTask: RenderedTask, xStep: number, timeStep: number, initEventX1Delta: number, rtl: boolean) => {
    isChanged: boolean;
    changedTask: RenderedTask;
};
