import { RenderedTask } from './rendered-task';

/** ドラッグ操作の種類 */
export type DragAction = "progress" | "end" | "start" | "move";
/** チャート内で発生するインタラクション全種 */
export type ChartInteraction = "mouseenter" | "mouseleave" | "delete" | "dblclick" | "click" | "select" | "" | DragAction;
/** 現在進行中のガントインタラクション状態 */
export interface GanttInteractionState {
    changedTask?: RenderedTask;
    originalSelectedTask?: RenderedTask;
    action: ChartInteraction;
}
