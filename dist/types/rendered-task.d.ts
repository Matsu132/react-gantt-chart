import { Task, TaskType } from './public-types';

export type TaskTypeInternal = TaskType | "smalltask";
/**
 * レンダリング時のタスク情報（ピクセル座標・スタイルを含む拡張型）
 */
export interface RenderedTask extends Task {
    index: number;
    typeInternal: TaskTypeInternal;
    x1: number;
    x2: number;
    y: number;
    height: number;
    progressX: number;
    progressWidth: number;
    barCornerRadius: number;
    handleWidth: number;
    barChildren: RenderedTask[];
    styles: {
        backgroundColor: string;
        backgroundSelectedColor: string;
        progressColor: string;
        progressSelectedColor: string;
    };
}
