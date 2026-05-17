import { default as React } from 'react';
import { RenderedTask } from '../../types/rendered-task';

type DependencyArrowProps = {
    taskFrom: RenderedTask;
    taskTo: RenderedTask;
    rowHeight: number;
    taskHeight: number;
    arrowIndent: number;
    rtl: boolean;
};
/**
 * タスク間の依存関係を示す矢印
 */
export declare const DependencyArrow: React.FC<DependencyArrowProps>;
export default DependencyArrow;
