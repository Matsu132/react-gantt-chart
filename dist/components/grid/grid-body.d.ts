import { default as React } from 'react';
import { Task } from '../../types/public-types';

export type GridBodyProps = {
    tasks: Task[];
    dates: Date[];
    svgWidth: number;
    rowHeight: number;
    columnWidth: number;
    todayColor: string;
    startIndex?: number;
    endIndex?: number;
    svgHeight?: number;
};
export declare const GridBody: React.FC<GridBodyProps>;
export default GridBody;
