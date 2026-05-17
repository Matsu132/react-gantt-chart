import { jsxs, jsx } from "react/jsx-runtime";
import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
var ViewMode = /* @__PURE__ */ ((ViewMode2) => {
  ViewMode2["Hour"] = "Hour";
  ViewMode2["QuarterDay"] = "Quarter Day";
  ViewMode2["HalfDay"] = "Half Day";
  ViewMode2["Day"] = "Day";
  ViewMode2["Week"] = "Week";
  ViewMode2["Month"] = "Month";
  ViewMode2["Year"] = "Year";
  return ViewMode2;
})(ViewMode || {});
const cache = {};
const getCachedDateTimeFormat = (locString, opts) => {
  const key = JSON.stringify([locString, opts]);
  let format = cache[key];
  if (!format) {
    format = new Intl.DateTimeFormat(locString, opts);
    cache[key] = format;
  }
  return format;
};
const addToDate = (date, quantity, scale) => {
  const newDate = new Date(date.getTime());
  switch (scale) {
    case "millisecond":
      newDate.setMilliseconds(newDate.getMilliseconds() + quantity);
      break;
    case "second":
      newDate.setSeconds(newDate.getSeconds() + quantity);
      break;
    case "minute":
      newDate.setMinutes(newDate.getMinutes() + quantity);
      break;
    case "hour":
      newDate.setHours(newDate.getHours() + quantity);
      break;
    case "day":
      newDate.setDate(newDate.getDate() + quantity);
      break;
    case "week":
      newDate.setDate(newDate.getDate() + quantity * 7);
      break;
    case "month":
      newDate.setMonth(newDate.getMonth() + quantity);
      break;
    case "year":
      newDate.setFullYear(newDate.getFullYear() + quantity);
      break;
  }
  return newDate;
};
const startOfDate = (date, scale) => {
  const newDate = new Date(date.getTime());
  switch (scale) {
    case "year":
      newDate.setMonth(0, 1);
      newDate.setHours(0, 0, 0, 0);
      break;
    case "month":
      newDate.setDate(1);
      newDate.setHours(0, 0, 0, 0);
      break;
    case "week":
      const day = newDate.getDay();
      const diff = newDate.getDate() - day + (day === 0 ? -6 : 1);
      newDate.setDate(diff);
      newDate.setHours(0, 0, 0, 0);
      break;
    case "day":
      newDate.setHours(0, 0, 0, 0);
      break;
    case "hour":
      newDate.setMinutes(0, 0, 0);
      break;
    case "minute":
      newDate.setSeconds(0, 0);
      break;
    case "second":
      newDate.setMilliseconds(0);
      break;
  }
  return newDate;
};
const getWeekNumberISO8601 = (date) => {
  const tempDate = new Date(date.valueOf());
  const dayNum = (date.getDay() + 6) % 7;
  tempDate.setDate(tempDate.getDate() - dayNum + 3);
  const firstThursday = tempDate.valueOf();
  tempDate.setMonth(0, 4);
  const dayNumJan4 = (tempDate.getDay() + 6) % 7;
  tempDate.setDate(tempDate.getDate() - dayNumJan4 + 3);
  const weekNum = 1 + Math.round((firstThursday - tempDate.valueOf()) / 6048e5);
  return weekNum < 10 ? `0${weekNum}` : `${weekNum}`;
};
const seedDates = (startDate, endDate, viewMode) => {
  let currentDate = new Date(startDate.getTime());
  const dates = [];
  while (currentDate.getTime() < endDate.getTime()) {
    dates.push(currentDate);
    switch (viewMode) {
      case ViewMode.Hour:
        currentDate = addToDate(currentDate, 1, "hour");
        break;
      case ViewMode.QuarterDay:
        currentDate = addToDate(currentDate, 6, "hour");
        break;
      case ViewMode.HalfDay:
        currentDate = addToDate(currentDate, 12, "hour");
        break;
      case ViewMode.Day:
        currentDate = addToDate(currentDate, 1, "day");
        break;
      case ViewMode.Week:
        currentDate = addToDate(currentDate, 7, "day");
        break;
      case ViewMode.Month:
        currentDate = addToDate(currentDate, 1, "month");
        break;
      case ViewMode.Year:
        currentDate = addToDate(currentDate, 1, "year");
        break;
    }
  }
  return dates;
};
const ganttDateRange = (tasks, viewMode, preStepsCount) => {
  let minDate = /* @__PURE__ */ new Date();
  let maxDate = /* @__PURE__ */ new Date();
  if (tasks.length > 0) {
    let min = tasks[0].start.getTime();
    let max = tasks[0].end.getTime();
    for (let i = 1; i < tasks.length; i++) {
      if (tasks[i].start.getTime() < min) min = tasks[i].start.getTime();
      if (tasks[i].end.getTime() > max) max = tasks[i].end.getTime();
    }
    minDate = new Date(min);
    maxDate = new Date(max);
  }
  let start = new Date(minDate.getTime());
  let end = new Date(maxDate.getTime());
  switch (viewMode) {
    case ViewMode.Hour:
      start = startOfDate(start, "day");
      start = addToDate(start, -preStepsCount, "hour");
      end = addToDate(end, 2, "day");
      break;
    case ViewMode.QuarterDay:
      start = startOfDate(start, "day");
      start = addToDate(start, -preStepsCount * 6, "hour");
      end = addToDate(end, 3, "day");
      break;
    case ViewMode.HalfDay:
      start = startOfDate(start, "day");
      start = addToDate(start, -preStepsCount * 12, "hour");
      end = addToDate(end, 5, "day");
      break;
    case ViewMode.Day:
      start = startOfDate(start, "day");
      start = addToDate(start, -preStepsCount, "day");
      end = startOfDate(end, "day");
      end = addToDate(end, 1, "month");
      break;
    case ViewMode.Week:
      start = startOfDate(start, "week");
      start = addToDate(start, -preStepsCount * 7, "day");
      end = addToDate(end, 1.5, "month");
      break;
    case ViewMode.Month:
      start = startOfDate(start, "month");
      start = addToDate(start, -preStepsCount, "month");
      end = startOfDate(end, "month");
      end = addToDate(end, 1, "year");
      break;
    case ViewMode.Year:
      start = startOfDate(start, "year");
      start = addToDate(start, -preStepsCount, "year");
      end = startOfDate(end, "year");
      end = addToDate(end, 1, "year");
      break;
  }
  return seedDates(start, end, viewMode);
};
const taskXCoordinate = (date, dates, columnWidth) => {
  const dateVal = date.getTime();
  const startVal = dates[0].getTime();
  if (dateVal <= startVal) return 0;
  const endVal = dates[dates.length - 1].getTime();
  if (dateVal >= endVal) return (dates.length - 1) * columnWidth;
  for (let i = 0; i < dates.length - 1; i++) {
    const d1 = dates[i].getTime();
    const d2 = dates[i + 1].getTime();
    if (dateVal >= d1 && dateVal < d2) {
      const ratio = (dateVal - d1) / (d2 - d1);
      return i * columnWidth + ratio * columnWidth;
    }
  }
  return 0;
};
const convertToRenderedTasks = (tasks, dates, columnWidth, rowHeight, taskHeight, barCornerRadius, handleWidth, rtl, barProgressColor, barProgressSelectedColor, barBackgroundColor, barBackgroundSelectedColor, projectProgressColor, projectProgressSelectedColor, projectBackgroundColor, projectBackgroundSelectedColor, milestoneBackgroundColor, milestoneBackgroundSelectedColor) => {
  const renderedTasks = [];
  for (let i = 0; i < tasks.length; i++) {
    const t = tasks[i];
    const y = i * rowHeight + (rowHeight - taskHeight) / 2;
    let x1 = 0;
    let x2 = 0;
    if (t.type === "milestone") {
      const x = taskXCoordinate(t.start, dates, columnWidth);
      x1 = x - taskHeight / 2;
      x2 = x + taskHeight / 2;
    } else {
      x1 = taskXCoordinate(t.start, dates, columnWidth);
      x2 = taskXCoordinate(t.end, dates, columnWidth);
    }
    if (x2 < x1) x2 = x1;
    const width = x2 - x1;
    let typeInternal = t.type;
    if (t.type === "task" && width < 80) {
      typeInternal = "smalltask";
    }
    const [progressWidth, progressX] = calcProgressGeometry(x1, x2, t.progress, rtl);
    const styleDefaults = {
      backgroundColor: barBackgroundColor,
      backgroundSelectedColor: barBackgroundSelectedColor,
      progressColor: barProgressColor,
      progressSelectedColor: barProgressSelectedColor
    };
    if (t.type === "project") {
      styleDefaults.backgroundColor = projectBackgroundColor;
      styleDefaults.backgroundSelectedColor = projectBackgroundSelectedColor;
      styleDefaults.progressColor = projectProgressColor;
      styleDefaults.progressSelectedColor = projectProgressSelectedColor;
    } else if (t.type === "milestone") {
      styleDefaults.backgroundColor = milestoneBackgroundColor;
      styleDefaults.backgroundSelectedColor = milestoneBackgroundSelectedColor;
      styleDefaults.progressColor = "";
      styleDefaults.progressSelectedColor = "";
    }
    const mergedStyles = { ...styleDefaults, ...t.styles };
    const renderedTask = {
      ...t,
      index: i,
      typeInternal,
      x1,
      x2,
      y,
      height: taskHeight,
      progressX,
      progressWidth,
      barCornerRadius,
      handleWidth,
      barChildren: [],
      styles: mergedStyles
    };
    renderedTasks.push(renderedTask);
  }
  for (let i = 0; i < renderedTasks.length; i++) {
    const parent = renderedTasks[i];
    if (parent.type === "project") {
      parent.barChildren = renderedTasks.filter((child) => child.project === parent.id);
    }
  }
  return renderedTasks;
};
const calcProgressGeometry = (taskX1, taskX2, progress, rtl) => {
  const width = taskX2 - taskX1;
  const progressWidth = width * (progress / 100);
  const progressX = rtl ? taskX2 - progressWidth : taskX1;
  return [progressWidth, progressX];
};
const progressByProgressWidth = (progressWidth, task) => {
  const width = task.x2 - task.x1;
  if (width === 0) return 0;
  const progress = progressWidth / width * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
};
const getProgressHandlePoint = (progressX, taskY, taskHeight) => {
  const y = taskY + taskHeight - 2;
  return `${progressX},${y} ${progressX - 6},${y + 6} ${progressX + 6},${y + 6}`;
};
const applyDragToTask = (svgX, action, selectedTask, xStep, timeStep, initEventX1Delta, rtl) => {
  const changedTask = { ...selectedTask };
  let isChanged = false;
  switch (action) {
    case "progress": {
      const progressWidth = svgX - selectedTask.x1;
      const progress = progressByProgressWidth(progressWidth, selectedTask);
      if (progress !== selectedTask.progress) {
        changedTask.progress = progress;
        const [progWidth, progX] = calcProgressGeometry(
          selectedTask.x1,
          selectedTask.x2,
          progress,
          rtl
        );
        changedTask.progressWidth = progWidth;
        changedTask.progressX = progX;
        isChanged = true;
      }
      break;
    }
    case "move": {
      const x1 = svgX - initEventX1Delta;
      const diffX = x1 - selectedTask.x1;
      const steps = Math.round(diffX / xStep);
      if (steps !== 0) {
        const snapX = steps * xStep;
        changedTask.x1 = selectedTask.x1 + snapX;
        changedTask.x2 = selectedTask.x2 + snapX;
        const timeShift = steps * timeStep;
        changedTask.start = new Date(selectedTask.start.getTime() + timeShift);
        changedTask.end = new Date(selectedTask.end.getTime() + timeShift);
        const [progWidth, progX] = calcProgressGeometry(
          changedTask.x1,
          changedTask.x2,
          changedTask.progress,
          rtl
        );
        changedTask.progressWidth = progWidth;
        changedTask.progressX = progX;
        isChanged = true;
      }
      break;
    }
    case "start": {
      const diffX = svgX - selectedTask.x1;
      const steps = Math.round(diffX / xStep);
      if (steps !== 0) {
        const newX1 = selectedTask.x1 + steps * xStep;
        if (newX1 <= selectedTask.x2 - 2 * selectedTask.handleWidth) {
          changedTask.x1 = newX1;
          changedTask.start = new Date(selectedTask.start.getTime() + steps * timeStep);
          const [progWidth, progX] = calcProgressGeometry(
            changedTask.x1,
            changedTask.x2,
            changedTask.progress,
            rtl
          );
          changedTask.progressWidth = progWidth;
          changedTask.progressX = progX;
          const width = changedTask.x2 - changedTask.x1;
          changedTask.typeInternal = changedTask.type === "task" && width < 80 ? "smalltask" : changedTask.type;
          isChanged = true;
        }
      }
      break;
    }
    case "end": {
      const diffX = svgX - selectedTask.x2;
      const steps = Math.round(diffX / xStep);
      if (steps !== 0) {
        const newX2 = selectedTask.x2 + steps * xStep;
        if (newX2 >= selectedTask.x1 + 2 * selectedTask.handleWidth) {
          changedTask.x2 = newX2;
          changedTask.end = new Date(selectedTask.end.getTime() + steps * timeStep);
          const [progWidth, progX] = calcProgressGeometry(
            changedTask.x1,
            changedTask.x2,
            changedTask.progress,
            rtl
          );
          changedTask.progressWidth = progWidth;
          changedTask.progressX = progX;
          const width = changedTask.x2 - changedTask.x1;
          changedTask.typeInternal = changedTask.type === "task" && width < 80 ? "smalltask" : changedTask.type;
          isChanged = true;
        }
      }
      break;
    }
  }
  return { isChanged, changedTask };
};
function removeHiddenTasks(tasks) {
  const collapsedProjects = /* @__PURE__ */ new Set();
  tasks.forEach((t) => {
    if (t.type === "project" && t.hideChildren) {
      collapsedProjects.add(t.id);
    }
  });
  const isHidden = (task) => {
    let parentId = task.project;
    while (parentId) {
      if (collapsedProjects.has(parentId)) {
        return true;
      }
      const parent = tasks.find((t) => t.id === parentId);
      parentId = parent == null ? void 0 : parent.project;
    }
    return false;
  };
  return tasks.filter((t) => !isHidden(t));
}
const sortTasks = (taskA, taskB) => {
  const orderA = taskA.displayOrder ?? Number.MAX_SAFE_INTEGER;
  const orderB = taskB.displayOrder ?? Number.MAX_SAFE_INTEGER;
  if (orderA > orderB) return 1;
  if (orderA < orderB) return -1;
  return 0;
};
const TaskListHeaderDefault = ({ headerHeight, rowWidth, fontFamily, fontSize }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "taskListHeader",
      style: {
        fontFamily,
        fontSize,
        height: headerHeight,
        width: rowWidth,
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "taskListHeaderCell",
            style: {
              flex: 1,
              minWidth: 150,
              paddingLeft: 10,
              fontWeight: "bold",
              boxSizing: "border-box"
            },
            children: "Name"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "taskListHeaderCell",
            style: {
              width: 100,
              minWidth: 100,
              paddingLeft: 10,
              fontWeight: "bold",
              borderLeft: "1px solid #e0e0e0",
              boxSizing: "border-box"
            },
            children: "From"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "taskListHeaderCell",
            style: {
              width: 100,
              minWidth: 100,
              paddingLeft: 10,
              fontWeight: "bold",
              borderLeft: "1px solid #e0e0e0",
              boxSizing: "border-box"
            },
            children: "To"
          }
        )
      ]
    }
  );
};
const TaskListTableDefault = ({
  rowHeight,
  rowWidth,
  fontFamily,
  fontSize,
  locale,
  tasks,
  visibleTasks,
  selectedTaskId,
  setSelectedTask,
  onExpanderClick
}) => {
  const itemsToRender = visibleTasks || tasks;
  const formatDate = useMemo(() => {
    const formatter = getCachedDateTimeFormat(locale, {
      day: "numeric",
      month: "numeric",
      year: "numeric"
    });
    return (date) => formatter.format(date);
  }, [locale]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "taskListTable",
      style: {
        fontFamily,
        fontSize,
        width: rowWidth,
        height: tasks.length * rowHeight,
        position: "relative"
      },
      children: itemsToRender.map((t) => {
        const renderedTask = t;
        const isSelected = selectedTaskId === t.id;
        let level = 0;
        let parentId = t.project;
        while (parentId) {
          level++;
          const parent = tasks.find((p) => p.id === parentId);
          parentId = parent == null ? void 0 : parent.project;
        }
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: `taskListTableRow ${isSelected ? "taskListTableRowSelected" : ""}`,
            style: {
              height: rowHeight,
              width: "100%",
              position: "absolute",
              top: renderedTask.index * rowHeight,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              boxSizing: "border-box",
              backgroundColor: isSelected ? "#f5f5f5" : void 0,
              borderBottom: "1px solid #ebebeb"
            },
            onClick: () => setSelectedTask(t.id),
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "taskListTableCell",
                  style: {
                    flex: 1,
                    minWidth: 150,
                    paddingLeft: 10 + level * 16,
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    boxSizing: "border-box"
                  },
                  children: [
                    t.type === "project" ? /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "taskListExpander",
                        onClick: (e) => {
                          e.stopPropagation();
                          onExpanderClick(t);
                        },
                        style: {
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 16,
                          height: 16,
                          marginRight: 6,
                          userSelect: "none",
                          fontSize: "10px",
                          color: "#555"
                        },
                        children: t.hideChildren ? "▶" : "▼"
                      }
                    ) : /* @__PURE__ */ jsx("div", { style: { width: 22, height: 16, display: "inline-block" } }),
                    /* @__PURE__ */ jsx("span", { style: { fontWeight: t.type === "project" ? "bold" : "normal" }, children: t.name })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "taskListTableCell",
                  style: {
                    width: 100,
                    minWidth: 100,
                    paddingLeft: 10,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    borderLeft: "1px solid #ebebeb",
                    boxSizing: "border-box"
                  },
                  children: formatDate(t.start)
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "taskListTableCell",
                  style: {
                    width: 100,
                    minWidth: 100,
                    paddingLeft: 10,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    borderLeft: "1px solid #ebebeb",
                    boxSizing: "border-box"
                  },
                  children: formatDate(t.end)
                }
              )
            ]
          },
          t.id
        );
      })
    }
  );
};
const TaskList = ({
  headerHeight,
  rowWidth,
  taskListWidth,
  fontFamily,
  fontSize,
  rowHeight,
  locale,
  tasks,
  visibleTasks,
  selectedTask,
  selectedTaskId,
  setSelectedTask,
  onExpanderClick,
  TaskListHeader = TaskListHeaderDefault,
  TaskListTable = TaskListTableDefault
}) => {
  const resolvedRowWidth = rowWidth || `${taskListWidth || 250}px`;
  const resolvedSelectedTaskId = selectedTaskId || (selectedTask == null ? void 0 : selectedTask.id) || "";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "taskListWrapper",
      style: {
        fontFamily,
        fontSize,
        flex: "none",
        width: resolvedRowWidth,
        position: "sticky",
        left: 0,
        zIndex: 20,
        backgroundColor: "#fff"
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: { position: "sticky", top: 0, zIndex: 30, backgroundColor: "#fff" }, children: /* @__PURE__ */ jsx(
          TaskListHeader,
          {
            headerHeight,
            rowWidth: resolvedRowWidth,
            fontFamily,
            fontSize
          }
        ) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "taskListContainer",
            children: /* @__PURE__ */ jsx(
              TaskListTable,
              {
                rowHeight,
                rowWidth: resolvedRowWidth,
                fontFamily,
                fontSize,
                locale,
                tasks,
                visibleTasks,
                selectedTaskId: resolvedSelectedTaskId,
                setSelectedTask,
                onExpanderClick
              }
            )
          }
        )
      ]
    }
  );
};
const GridBody = ({
  tasks,
  dates,
  svgWidth,
  rowHeight,
  columnWidth,
  todayColor,
  startIndex = 0,
  endIndex = tasks.length - 1,
  svgHeight
}) => {
  const y1 = startIndex * rowHeight;
  const y2 = (endIndex + 1) * rowHeight;
  const totalHeight = y2 - y1;
  const rowBackgrounds = useMemo(() => {
    const bgs = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const y = i * rowHeight;
      bgs.push(
        /* @__PURE__ */ jsx(
          "rect",
          {
            x: 0,
            y,
            width: svgWidth,
            height: rowHeight,
            fill: i % 2 === 0 ? "transparent" : "#fbfbfb",
            className: "gridRow"
          },
          `bg-${i}`
        )
      );
    }
    return bgs;
  }, [startIndex, endIndex, svgWidth, rowHeight]);
  const rowLines = useMemo(() => {
    const lines = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const y = i * rowHeight + rowHeight;
      lines.push(
        /* @__PURE__ */ jsx(
          "line",
          {
            x1: 0,
            y1: y,
            x2: svgWidth,
            y2: y,
            className: "gridRowLine",
            style: { stroke: "#ebebeb", strokeWidth: 1 }
          },
          `row-line-${i}`
        )
      );
    }
    return lines;
  }, [startIndex, endIndex, svgWidth, rowHeight]);
  const ticks = useMemo(() => {
    const tk = [];
    const height = svgHeight || y2;
    for (let i = 0; i < dates.length; i++) {
      const x = i * columnWidth;
      tk.push(
        /* @__PURE__ */ jsx(
          "line",
          {
            x1: x,
            y1: 0,
            x2: x,
            y2: height,
            className: "gridTick",
            style: { stroke: "#ebebeb", strokeWidth: 1 }
          },
          `tick-${i}`
        )
      );
    }
    return tk;
  }, [dates, columnWidth, svgHeight, y2]);
  const todayHighlight = useMemo(() => {
    var _a, _b;
    const today = /* @__PURE__ */ new Date();
    const startVal = dates[0].getTime();
    const endVal = dates[dates.length - 1].getTime() + (((_a = dates[1]) == null ? void 0 : _a.getTime()) - ((_b = dates[0]) == null ? void 0 : _b.getTime()) || 864e5);
    if (today.getTime() >= startVal && today.getTime() <= endVal) {
      const x = taskXCoordinate(today, dates, columnWidth);
      const colIdx = Math.floor(x / columnWidth);
      const snapX = colIdx * columnWidth;
      return /* @__PURE__ */ jsx(
        "rect",
        {
          x: snapX,
          y: 0,
          width: columnWidth,
          height: svgHeight || totalHeight,
          fill: todayColor,
          className: "gridTodayHighlight"
        }
      );
    }
    return null;
  }, [dates, columnWidth, svgHeight, totalHeight, todayColor]);
  return /* @__PURE__ */ jsxs("g", { className: "gridBody", children: [
    /* @__PURE__ */ jsx("g", { className: "rows", children: rowBackgrounds }),
    /* @__PURE__ */ jsx("g", { className: "ticks", children: ticks }),
    /* @__PURE__ */ jsx("g", { className: "rowLines", children: rowLines }),
    todayHighlight
  ] });
};
const Grid = (props) => {
  return /* @__PURE__ */ jsx("g", { className: "grid", children: /* @__PURE__ */ jsx(GridBody, { ...props }) });
};
const TopPartOfCalendar = ({
  value,
  x1Line,
  y1Line,
  y2Line,
  xText,
  yText
}) => {
  return /* @__PURE__ */ jsxs("g", { className: "calendarHeader", children: [
    /* @__PURE__ */ jsx(
      "line",
      {
        x1: x1Line,
        y1: y1Line,
        x2: x1Line,
        y2: y2Line,
        className: "calendarHeaderLine",
        style: { stroke: "#e6e6e6", strokeWidth: 1 }
      }
    ),
    /* @__PURE__ */ jsx(
      "text",
      {
        x: xText,
        y: yText,
        className: "calendarHeaderText",
        style: {
          fill: "#555",
          textAnchor: "middle",
          fontWeight: "bold",
          dominantBaseline: "middle"
        },
        children: value
      }
    )
  ] });
};
const Calendar = React.memo(({
  dateSetup,
  locale,
  viewMode,
  headerHeight,
  columnWidth,
  fontFamily,
  fontSize,
  calendarTopHeaderFormat,
  calendarBottomHeaderFormat
}) => {
  const { dates } = dateSetup;
  const getTopHeaderValue = useMemo(() => {
    return (date) => {
      if (calendarTopHeaderFormat) {
        return calendarTopHeaderFormat(date, viewMode);
      }
      switch (viewMode) {
        case ViewMode.Hour:
        case ViewMode.QuarterDay:
        case ViewMode.HalfDay:
          return getCachedDateTimeFormat(locale, {
            month: "long",
            day: "numeric",
            year: "numeric"
          }).format(date);
        case ViewMode.Day:
        case ViewMode.Week:
          return getCachedDateTimeFormat(locale, {
            month: "long",
            year: "numeric"
          }).format(date);
        case ViewMode.Month:
          return getCachedDateTimeFormat(locale, {
            year: "numeric"
          }).format(date);
        case ViewMode.Year:
          return getCachedDateTimeFormat(locale, {
            year: "numeric"
          }).format(date);
        default:
          return "";
      }
    };
  }, [viewMode, locale, calendarTopHeaderFormat]);
  const getBottomHeaderValue = useMemo(() => {
    return (date) => {
      if (calendarBottomHeaderFormat) {
        return calendarBottomHeaderFormat(date, viewMode);
      }
      switch (viewMode) {
        case ViewMode.Hour:
          return getCachedDateTimeFormat(locale, {
            hour: "numeric",
            hour12: false
          }).format(date);
        case ViewMode.QuarterDay:
        case ViewMode.HalfDay:
          return getCachedDateTimeFormat(locale, {
            hour: "numeric",
            minute: "numeric",
            hour12: false
          }).format(date);
        case ViewMode.Day:
          return getCachedDateTimeFormat(locale, {
            day: "numeric"
          }).format(date);
        case ViewMode.Week:
          return `W${getWeekNumberISO8601(date)}`;
        case ViewMode.Month:
          return getCachedDateTimeFormat(locale, {
            month: "short"
          }).format(date);
        case ViewMode.Year:
          return getCachedDateTimeFormat(locale, {
            year: "numeric"
          }).format(date);
        default:
          return "";
      }
    };
  }, [viewMode, locale, calendarBottomHeaderFormat]);
  const topHeaderCells = useMemo(() => {
    const cells = [];
    let currentCell = null;
    for (let i = 0; i < dates.length; i++) {
      const val = getTopHeaderValue(dates[i]);
      if (!currentCell || currentCell.value !== val) {
        currentCell = {
          value: val,
          colSpan: 1,
          startX: i * columnWidth
        };
        cells.push(currentCell);
      } else {
        currentCell.colSpan++;
      }
    }
    return cells;
  }, [dates, columnWidth, getTopHeaderValue]);
  const topHeaders = useMemo(() => {
    return topHeaderCells.map((cell, idx) => {
      const width = cell.colSpan * columnWidth;
      const xText = cell.startX + width / 2;
      const yText = headerHeight * 0.25;
      return /* @__PURE__ */ jsx(
        TopPartOfCalendar,
        {
          value: cell.value,
          x1Line: cell.startX,
          y1Line: 0,
          y2Line: headerHeight * 0.5,
          xText,
          yText
        },
        `top-hdr-${idx}`
      );
    });
  }, [topHeaderCells, columnWidth, headerHeight]);
  const bottomHeaders = useMemo(() => {
    return dates.map((date, idx) => {
      const x = idx * columnWidth;
      const xText = x + columnWidth / 2;
      const yText = headerHeight * 0.75;
      const val = getBottomHeaderValue(date);
      return /* @__PURE__ */ jsxs("g", { className: "calendarHeader", children: [
        /* @__PURE__ */ jsx(
          "line",
          {
            x1: x,
            y1: headerHeight * 0.5,
            x2: x,
            y2: headerHeight,
            className: "calendarHeaderLine",
            style: { stroke: "#e6e6e6", strokeWidth: 1 }
          }
        ),
        /* @__PURE__ */ jsx(
          "text",
          {
            x: xText,
            y: yText,
            className: "calendarHeaderText",
            style: {
              fill: "#555",
              textAnchor: "middle",
              fontSize: "12px",
              dominantBaseline: "middle"
            },
            children: val
          }
        )
      ] }, `bot-hdr-${idx}`);
    });
  }, [dates, columnWidth, headerHeight, getBottomHeaderValue]);
  return /* @__PURE__ */ jsxs(
    "g",
    {
      className: "calendar",
      style: {
        fontFamily,
        fontSize
      },
      children: [
        /* @__PURE__ */ jsx(
          "rect",
          {
            x: 0,
            y: 0,
            width: dates.length * columnWidth,
            height: headerHeight,
            fill: "#fcfcfc",
            style: { stroke: "#e6e6e6", strokeWidth: 1 }
          }
        ),
        /* @__PURE__ */ jsx(
          "line",
          {
            x1: 0,
            y1: headerHeight * 0.5,
            x2: dates.length * columnWidth,
            y2: headerHeight * 0.5,
            className: "calendarHeaderLine",
            style: { stroke: "#e6e6e6", strokeWidth: 1 }
          }
        ),
        /* @__PURE__ */ jsx("g", { className: "topHeaders", children: topHeaders }),
        /* @__PURE__ */ jsx("g", { className: "bottomHeaders", children: bottomHeaders })
      ]
    }
  );
});
const Bar = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  isSelected,
  rtl,
  onEventStart
}) => {
  const width = task.x2 - task.x1;
  const isSmall = task.typeInternal === "smalltask";
  const barBg = isSelected ? task.styles.backgroundSelectedColor : task.styles.backgroundColor;
  const progBg = isSelected ? task.styles.progressSelectedColor : task.styles.progressColor;
  return /* @__PURE__ */ jsxs("g", { className: "bar", children: [
    /* @__PURE__ */ jsx(
      "rect",
      {
        x: task.x1,
        y: task.y,
        width,
        height: task.height,
        rx: task.barCornerRadius,
        ry: task.barCornerRadius,
        fill: barBg,
        className: "barBackground",
        style: {
          cursor: isDateChangeable ? "move" : "default",
          strokeWidth: isSelected ? 1.5 : 0,
          stroke: isSelected ? "#333" : void 0
        },
        onMouseDown: (e) => {
          if (isDateChangeable) onEventStart("move", task, e);
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "rect",
      {
        x: task.progressX,
        y: task.y,
        width: task.progressWidth,
        height: task.height,
        rx: task.barCornerRadius,
        ry: task.barCornerRadius,
        fill: progBg,
        className: "barProgress",
        style: { cursor: isDateChangeable ? "move" : "default" },
        onMouseDown: (e) => {
          if (isDateChangeable) onEventStart("move", task, e);
        }
      }
    ),
    isDateChangeable && /* @__PURE__ */ jsxs("g", { className: "handleGroup", children: [
      /* @__PURE__ */ jsx(
        "rect",
        {
          x: task.x1,
          y: task.y,
          width: task.handleWidth,
          height: task.height,
          fill: "transparent",
          style: { cursor: "w-resize" },
          onMouseDown: (e) => onEventStart("start", task, e)
        }
      ),
      /* @__PURE__ */ jsx(
        "rect",
        {
          x: task.x2 - task.handleWidth,
          y: task.y,
          width: task.handleWidth,
          height: task.height,
          fill: "transparent",
          style: { cursor: "e-resize" },
          onMouseDown: (e) => onEventStart("end", task, e)
        }
      )
    ] }),
    isProgressChangeable && /* @__PURE__ */ jsx(
      "polygon",
      {
        points: getProgressHandlePoint(
          task.progressX + (rtl ? 0 : task.progressWidth),
          task.y,
          task.height
        ),
        className: "barProgressHandle",
        style: { cursor: "ew-resize", fill: "#333" },
        onMouseDown: (e) => onEventStart("progress", task, e)
      }
    ),
    /* @__PURE__ */ jsx(
      "text",
      {
        x: isSmall ? task.x2 + 10 : task.x1 + width / 2,
        y: task.y + task.height / 2,
        className: "barLabel",
        style: {
          textAnchor: isSmall ? "start" : "middle",
          dominantBaseline: "middle",
          fill: isSmall ? "#333" : "#fff",
          fontSize: "12px",
          userSelect: "none",
          pointerEvents: "none",
          fontWeight: isSmall ? "normal" : "500"
        },
        children: task.name
      }
    )
  ] });
};
const Project = ({
  task,
  isSelected,
  onEventStart
}) => {
  const width = task.x2 - task.x1;
  const projectBg = isSelected ? task.styles.backgroundSelectedColor : task.styles.backgroundColor;
  const projectProgressBg = isSelected ? task.styles.progressSelectedColor : task.styles.progressColor;
  return /* @__PURE__ */ jsxs("g", { className: "project", children: [
    /* @__PURE__ */ jsx(
      "rect",
      {
        x: task.x1,
        y: task.y,
        width,
        height: task.height,
        rx: task.barCornerRadius,
        ry: task.barCornerRadius,
        fill: projectBg,
        className: "projectBackground",
        style: {
          cursor: "pointer",
          strokeWidth: isSelected ? 1.5 : 0,
          stroke: isSelected ? "#333" : void 0
        },
        onMouseDown: (e) => onEventStart("click", task, e)
      }
    ),
    /* @__PURE__ */ jsx(
      "rect",
      {
        x: task.x1,
        y: task.y,
        width: task.progressWidth,
        height: task.height,
        rx: task.barCornerRadius,
        ry: task.barCornerRadius,
        fill: projectProgressBg,
        className: "projectProgress",
        style: { cursor: "pointer" },
        onMouseDown: (e) => onEventStart("click", task, e)
      }
    ),
    /* @__PURE__ */ jsx(
      "polygon",
      {
        points: `${task.x1},${task.y + task.height} ${task.x1 + 8},${task.y + task.height} ${task.x1},${task.y + task.height - 8}`,
        fill: projectProgressBg
      }
    ),
    /* @__PURE__ */ jsx(
      "polygon",
      {
        points: `${task.x2},${task.y + task.height} ${task.x2 - 8},${task.y + task.height} ${task.x2},${task.y + task.height - 8}`,
        fill: projectProgressBg
      }
    ),
    /* @__PURE__ */ jsx(
      "text",
      {
        x: task.x2 + 12,
        y: task.y + task.height / 2,
        className: "projectLabel",
        style: {
          textAnchor: "start",
          dominantBaseline: "middle",
          fill: "#333",
          fontSize: "12px",
          fontWeight: "bold",
          userSelect: "none",
          pointerEvents: "none"
        },
        children: task.name
      }
    )
  ] });
};
const Milestone = ({
  task,
  isDateChangeable,
  isSelected,
  onEventStart
}) => {
  const milestoneBg = isSelected ? task.styles.backgroundSelectedColor : task.styles.backgroundColor;
  const halfHeight = task.height / 2;
  const cx = task.x1 + halfHeight;
  const cy = task.y + halfHeight;
  const points = `
    ${cx},${cy - halfHeight} 
    ${cx + halfHeight},${cy} 
    ${cx},${cy + halfHeight} 
    ${cx - halfHeight},${cy}
  `.trim();
  return /* @__PURE__ */ jsxs("g", { className: "milestone", children: [
    /* @__PURE__ */ jsx(
      "polygon",
      {
        points,
        fill: milestoneBg,
        className: "milestoneBackground",
        style: {
          cursor: isDateChangeable ? "move" : "default",
          strokeWidth: isSelected ? 1.5 : 0,
          stroke: isSelected ? "#333" : void 0
        },
        onMouseDown: (e) => {
          if (isDateChangeable) onEventStart("move", task, e);
        }
      }
    ),
    /* @__PURE__ */ jsx(
      "text",
      {
        x: cx + halfHeight + 10,
        y: cy,
        className: "milestoneLabel",
        style: {
          textAnchor: "start",
          dominantBaseline: "middle",
          fill: "#333",
          fontSize: "12px",
          userSelect: "none",
          pointerEvents: "none"
        },
        children: task.name
      }
    )
  ] });
};
const TaskItem = (props) => {
  const { task } = props;
  switch (task.type) {
    case "project":
      return /* @__PURE__ */ jsx(Project, { ...props });
    case "milestone":
      return /* @__PURE__ */ jsx(Milestone, { ...props });
    default:
      return /* @__PURE__ */ jsx(Bar, { ...props });
  }
};
const DependencyArrow = ({
  taskFrom,
  taskTo,
  taskHeight,
  arrowIndent,
  rtl
}) => {
  let path = "";
  let arrowHeadPoints = "";
  const y1 = taskFrom.y + taskHeight / 2;
  const y2 = taskTo.y + taskHeight / 2;
  if (rtl) {
    const x1 = taskFrom.x1;
    const x2 = taskTo.x2;
    if (x1 - arrowIndent > x2) {
      const midX = x1 - arrowIndent;
      path = `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`;
    } else {
      const midX1 = x1 - arrowIndent;
      const midX2 = x2 + arrowIndent;
      const midY = y1 + (y2 - y1) / 2;
      path = `M ${x1} ${y1} H ${midX1} V ${midY} H ${midX2} V ${y2} H ${x2}`;
    }
    arrowHeadPoints = `${x2},${y2} ${x2 + 5},${y2 - 3} ${x2 + 5},${y2 + 3}`;
  } else {
    const x1 = taskFrom.x2;
    const x2 = taskTo.x1;
    if (x1 + arrowIndent < x2) {
      const midX = x1 + arrowIndent;
      path = `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`;
    } else {
      const midX1 = x1 + arrowIndent;
      const midX2 = x2 - arrowIndent;
      const midY = y1 + (y2 - y1) / 2;
      path = `M ${x1} ${y1} H ${midX1} V ${midY} H ${midX2} V ${y2} H ${x2}`;
    }
    arrowHeadPoints = `${x2},${y2} ${x2 - 5},${y2 - 3} ${x2 - 5},${y2 + 3}`;
  }
  return /* @__PURE__ */ jsxs("g", { className: "dependencyArrow", children: [
    /* @__PURE__ */ jsx(
      "path",
      {
        d: path,
        fill: "transparent",
        stroke: "#fcb32c",
        strokeWidth: 1.5,
        className: "arrowPath"
      }
    ),
    /* @__PURE__ */ jsx(
      "polygon",
      {
        points: arrowHeadPoints,
        fill: "#fcb32c",
        className: "arrowHead"
      }
    )
  ] });
};
const DefaultTooltipContent = ({ task, fontSize, fontFamily }) => {
  const duration = Math.round((task.end.getTime() - task.start.getTime()) / 864e5);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        padding: "10px 12px",
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        border: "1px solid #ebebeb",
        borderRadius: "6px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        color: "#333",
        fontFamily,
        fontSize,
        lineHeight: "1.5em",
        pointerEvents: "none",
        minWidth: 180
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: { fontWeight: "bold", color: "#111", marginBottom: 6 }, children: task.name }),
        /* @__PURE__ */ jsxs("div", { style: { color: "#666", fontSize: "11px", marginBottom: 2 }, children: [
          "開始: ",
          task.start.toLocaleDateString("ja-JP")
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { color: "#666", fontSize: "11px", marginBottom: 4 }, children: [
          "終了: ",
          task.end.toLocaleDateString("ja-JP")
        ] }),
        task.type !== "milestone" && /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 6, paddingTop: 6, borderTop: "1px solid #f0f0f0", fontSize: "11px" }, children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "期間: ",
            /* @__PURE__ */ jsxs("strong", { children: [
              duration,
              " 日間"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "進捗: ",
            /* @__PURE__ */ jsxs("strong", { children: [
              task.progress,
              "%"
            ] })
          ] })
        ] })
      ]
    }
  );
};
const TaskTooltip = ({
  task,
  rtl,
  fontSize,
  fontFamily,
  TooltipContent,
  mousePos = { x: 0, y: 0 }
}) => {
  const tooltipRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (tooltipRef.current) {
      const width = tooltipRef.current.clientWidth || 200;
      let finalX = mousePos.x + 15;
      let finalY = mousePos.y + 15;
      if (rtl) {
        finalX = mousePos.x - width - 15;
      }
      setCoords({ x: finalX, y: finalY });
    }
  }, [mousePos, rtl]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: tooltipRef,
      style: {
        position: "fixed",
        left: coords.x,
        top: coords.y,
        zIndex: 1e3,
        pointerEvents: "none"
      },
      className: "ganttTooltip",
      children: !!(coords == null ? void 0 : coords.x) && !!(coords == null ? void 0 : coords.y) && /* @__PURE__ */ jsx(TooltipContent, { task, fontSize, fontFamily })
    }
  );
};
const TimelineContent = ({
  tasks,
  allTasks = [],
  interactionState,
  selectedTask,
  rowHeight,
  columnWidth,
  timeStep,
  svg,
  svgWidth,
  taskHeight,
  arrowIndent,
  fontSize,
  fontFamily,
  rtl,
  setInteractionState,
  setSelectedTask,
  mousePos = { x: 0, y: 0 },
  TooltipContent = DefaultTooltipContent,
  onDoubleClick,
  onClick,
  onDateChange,
  onProgressChange,
  onDelete
}) => {
  const [hoveredTask, setHoveredTask] = useState(void 0);
  const dragX1DeltaRef = useRef(0);
  useEffect(() => {
    const handleMouseMove = async (event) => {
      if (!interactionState.action || !interactionState.originalSelectedTask || !(svg == null ? void 0 : svg.current)) {
        return;
      }
      event.preventDefault();
      const rect = svg.current.getBoundingClientRect();
      const svgX = event.clientX - rect.left;
      const { isChanged, changedTask } = applyDragToTask(
        svgX,
        interactionState.action,
        interactionState.originalSelectedTask,
        columnWidth,
        timeStep,
        dragX1DeltaRef.current,
        rtl
      );
      if (isChanged) {
        setInteractionState({ ...interactionState, changedTask });
      }
    };
    const handleMouseUp = async (event) => {
      if (!interactionState.action || !interactionState.originalSelectedTask) {
        return;
      }
      event.preventDefault();
      const { changedTask, originalSelectedTask, action } = interactionState;
      if (changedTask && changedTask !== originalSelectedTask) {
        try {
          if (action === "progress" && onProgressChange) {
            await onProgressChange(changedTask, changedTask.barChildren);
          } else if ((action === "move" || action === "start" || action === "end") && onDateChange) {
            await onDateChange(changedTask, changedTask.barChildren);
          }
        } catch (err) {
          console.error("Gantt action callback failed:", err);
        }
      }
      setInteractionState({ action: "" });
    };
    if (interactionState.action !== "") {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [interactionState, svg, columnWidth, timeStep, rtl, onProgressChange, onDateChange, setInteractionState]);
  const handleEventStart = (action, task, event) => {
    if (event) {
      event.preventDefault();
      if ("clientX" in event && (svg == null ? void 0 : svg.current)) {
        const rect = svg.current.getBoundingClientRect();
        const svgX = event.clientX - rect.left;
        dragX1DeltaRef.current = svgX - task.x1;
      }
    }
    if (action === "click") {
      setSelectedTask(task.id);
      if (onClick) onClick(task);
    } else if (action === "dblclick") {
      if (onDoubleClick) onDoubleClick(task);
    } else if (action === "delete") {
      if (onDelete) onDelete(task);
    } else {
      setInteractionState({
        action,
        originalSelectedTask: task,
        changedTask: task
      });
    }
  };
  const arrows = useMemo(() => {
    const list = [];
    const tasksLookupList = allTasks.length > 0 ? allTasks : tasks;
    tasks.forEach((taskTo) => {
      if (taskTo.dependencies) {
        taskTo.dependencies.forEach((depId) => {
          const taskFrom = tasksLookupList.find((t) => t.id === depId);
          if (taskFrom) {
            list.push(
              /* @__PURE__ */ jsx(
                DependencyArrow,
                {
                  taskFrom,
                  taskTo,
                  rowHeight,
                  taskHeight,
                  arrowIndent,
                  rtl
                },
                `arrow-${taskFrom.id}-${taskTo.id}`
              )
            );
          }
        });
      }
    });
    return list;
  }, [tasks, allTasks, rowHeight, taskHeight, arrowIndent, rtl]);
  const isDateChangeable = (task) => !task.isDisabled;
  const isProgressChangeable = (task) => !task.isDisabled && task.type === "task";
  return /* @__PURE__ */ jsxs("g", { className: "timelineContent", children: [
    /* @__PURE__ */ jsx("g", { className: "dependencyArrows", children: arrows }),
    /* @__PURE__ */ jsx("g", { className: "taskBars", children: tasks.map((task) => {
      const renderTask = interactionState.action !== "" && interactionState.changedTask && interactionState.changedTask.id === task.id ? interactionState.changedTask : task;
      const isSelected = (selectedTask == null ? void 0 : selectedTask.id) === task.id;
      return /* @__PURE__ */ jsx(
        "g",
        {
          className: "taskItemWrapper",
          onMouseEnter: () => setHoveredTask(task),
          onMouseLeave: () => setHoveredTask(void 0),
          children: /* @__PURE__ */ jsx(
            TaskItem,
            {
              task: renderTask,
              arrowIndent,
              taskHeight,
              isProgressChangeable: isProgressChangeable(task),
              isDateChangeable: isDateChangeable(task),
              isDelete: true,
              isSelected,
              rtl,
              onEventStart: handleEventStart
            }
          )
        },
        task.id
      );
    }) }),
    hoveredTask && createPortal(
      /* @__PURE__ */ jsx(
        TaskTooltip,
        {
          task: hoveredTask,
          arrowIndent,
          rtl,
          svgWidth,
          fontSize,
          fontFamily,
          TooltipContent,
          mousePos
        }
      ),
      document.body
    )
  ] });
};
const TimelinePanel = ({
  gridProps,
  calendarProps,
  contentProps
}) => {
  const { svgWidth } = gridProps;
  const { headerHeight } = calendarProps;
  const svgRef = useRef(null);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "ganttTimeline",
      style: {
        width: svgWidth,
        position: "relative"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "ganttCalendarHeader",
            style: {
              position: "sticky",
              top: 0,
              zIndex: 10,
              width: svgWidth,
              height: headerHeight,
              backgroundColor: "#fcfcfc",
              borderBottom: "1px solid #e6e6e6"
            },
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                width: svgWidth,
                height: headerHeight,
                className: "calendarSvg",
                children: /* @__PURE__ */ jsx(Calendar, { ...calendarProps })
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: svgWidth,
              height: contentProps.svgHeight,
              position: "relative"
            },
            children: /* @__PURE__ */ jsxs(
              "svg",
              {
                width: svgWidth,
                height: contentProps.svgHeight,
                className: "ganttSvg",
                ref: svgRef,
                children: [
                  /* @__PURE__ */ jsx(Grid, { ...gridProps }),
                  /* @__PURE__ */ jsx(
                    TimelineContent,
                    {
                      ...contentProps,
                      svg: svgRef
                    }
                  )
                ]
              }
            )
          }
        )
      ]
    }
  );
};
const Gantt = ({
  tasks,
  viewMode = ViewMode.Day,
  viewDate,
  preStepsCount = 1,
  locale = "en-GB",
  rtl = false,
  calendarTopHeaderFormat,
  calendarBottomHeaderFormat,
  headerHeight = 50,
  columnWidth,
  listCellWidth = "360px",
  rowHeight = 50,
  ganttHeight = 0,
  barCornerRadius = 3,
  handleWidth = 8,
  fontFamily = "Arial, Roboto, sans-serif",
  fontSize = "14px",
  barFill = 60,
  barProgressColor = "#a3a3ff",
  barProgressSelectedColor = "#8282ff",
  barBackgroundColor = "#b8c2cc",
  barBackgroundSelectedColor = "#a3aebe",
  projectProgressColor = "#7db3e8",
  projectProgressSelectedColor = "#5492d6",
  projectBackgroundColor = "#facfc3",
  projectBackgroundSelectedColor = "#f1b3a2",
  milestoneBackgroundColor = "#f1c40f",
  milestoneBackgroundSelectedColor = "#f39c12",
  arrowColor = "#fcb32c",
  arrowIndent = 20,
  todayColor = "rgba(252, 75, 113, 0.3)",
  TooltipContent,
  TaskListHeader,
  TaskListTable,
  timeStep = 36e5 * 24,
  onSelect,
  onDoubleClick,
  onClick,
  onDateChange,
  onProgressChange,
  onDelete,
  onExpanderClick
}) => {
  const resolvedColumnWidth = useMemo(() => {
    if (columnWidth) return columnWidth;
    switch (viewMode) {
      case ViewMode.Hour:
        return 60;
      case ViewMode.QuarterDay:
        return 65;
      case ViewMode.HalfDay:
        return 80;
      case ViewMode.Day:
        return 60;
      case ViewMode.Week:
        return 250;
      case ViewMode.Month:
        return 300;
      case ViewMode.Year:
        return 350;
      default:
        return 60;
    }
  }, [columnWidth, viewMode]);
  const filteredTasks = useMemo(
    () => removeHiddenTasks(tasks).sort(sortTasks),
    [tasks]
  );
  const dates = useMemo(
    () => ganttDateRange(filteredTasks, viewMode, preStepsCount),
    [filteredTasks, viewMode, preStepsCount]
  );
  const renderedTasks = useMemo(
    () => convertToRenderedTasks(
      filteredTasks,
      dates,
      resolvedColumnWidth,
      rowHeight,
      rowHeight * (barFill / 100),
      barCornerRadius,
      handleWidth,
      rtl,
      barProgressColor,
      barProgressSelectedColor,
      barBackgroundColor,
      barBackgroundSelectedColor,
      projectProgressColor,
      projectProgressSelectedColor,
      projectBackgroundColor,
      projectBackgroundSelectedColor,
      milestoneBackgroundColor,
      milestoneBackgroundSelectedColor
    ),
    [
      filteredTasks,
      dates,
      resolvedColumnWidth,
      rowHeight,
      barFill,
      barCornerRadius,
      handleWidth,
      rtl,
      barProgressColor,
      barProgressSelectedColor,
      barBackgroundColor,
      barBackgroundSelectedColor,
      projectProgressColor,
      projectProgressSelectedColor,
      projectBackgroundColor,
      projectBackgroundSelectedColor,
      milestoneBackgroundColor,
      milestoneBackgroundSelectedColor
    ]
  );
  const [scrollTopState, setScrollTopState] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedTask, setSelectedTaskState] = useState(void 0);
  const [interactionState, setInteractionState] = useState({ action: "" });
  const [, setFailedTask] = useState(null);
  const ganttFullHeight = renderedTasks.length * rowHeight;
  const viewHeight = ganttHeight && ganttHeight > 0 ? ganttHeight : 500;
  const startIndex = Math.max(0, Math.floor(scrollTopState / rowHeight) - 3);
  const endIndex = Math.min(
    renderedTasks.length - 1,
    Math.ceil((scrollTopState + viewHeight) / rowHeight) + 3
  );
  const visibleRenderedTasks = useMemo(
    () => renderedTasks.slice(startIndex, endIndex + 1),
    [renderedTasks, startIndex, endIndex]
  );
  const taskListWidthNumber = useMemo(() => {
    const val = parseInt(listCellWidth, 10);
    return isNaN(val) ? 250 : val;
  }, [listCellWidth]);
  const [taskListWidth, setTaskListWidth] = useState(taskListWidthNumber);
  useEffect(() => {
    setTaskListWidth(taskListWidthNumber);
  }, [taskListWidthNumber]);
  const [isResizing, setIsResizing] = useState(false);
  const resizerRef = useRef(null);
  const handleResizerMouseDown = useCallback((e) => {
    resizerRef.current = { startX: e.clientX, startWidth: taskListWidth };
    setIsResizing(true);
    e.preventDefault();
  }, [taskListWidth]);
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!isResizing || !resizerRef.current) return;
      const diff = e.clientX - resizerRef.current.startX;
      setTaskListWidth(Math.max(0, resizerRef.current.startWidth + diff));
    };
    const handleGlobalMouseUp = () => {
      setIsResizing(false);
      resizerRef.current = null;
    };
    if (isResizing) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
      document.body.style.cursor = "col-resize";
    } else {
      document.body.style.cursor = "";
    }
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      document.body.style.cursor = "";
    };
  }, [isResizing]);
  const svgWidth = dates.length * resolvedColumnWidth;
  const containerRef = useRef(null);
  useEffect(() => {
    if (viewDate && dates.length > 0 && containerRef.current) {
      const x = taskXCoordinate(viewDate, dates, resolvedColumnWidth);
      const targetLeft = Math.max(0, x - resolvedColumnWidth * 2);
      containerRef.current.scrollLeft = targetLeft;
    }
  }, [viewDate, dates, resolvedColumnWidth]);
  const handleScroll = useCallback((e) => {
    setScrollTopState(e.currentTarget.scrollTop);
  }, []);
  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);
  const handleExpanderClick = useCallback(
    (task) => {
      if (onExpanderClick) onExpanderClick(task);
    },
    [onExpanderClick]
  );
  const setSelectedTask = useCallback(
    (taskId) => {
      const newTask = renderedTasks.find((t) => t.id === taskId);
      setSelectedTaskState(newTask);
      if (onSelect) onSelect(newTask, !!newTask);
    },
    [renderedTasks, onSelect]
  );
  const gridProps = {
    columnWidth: resolvedColumnWidth,
    svgWidth,
    svgHeight: ganttFullHeight,
    dates,
    rowHeight,
    rtl,
    todayColor,
    tasks: visibleRenderedTasks,
    startIndex,
    endIndex
  };
  const dateSetup = useMemo(() => ({ dates, viewMode }), [dates, viewMode]);
  const calendarProps = {
    dateSetup,
    locale,
    rtl,
    headerHeight,
    columnWidth: resolvedColumnWidth,
    fontFamily,
    fontSize,
    viewMode,
    calendarTopHeaderFormat,
    calendarBottomHeaderFormat
  };
  const contentProps = {
    tasks: visibleRenderedTasks,
    allTasks: renderedTasks,
    dates,
    interactionState,
    selectedTask,
    rowHeight,
    columnWidth: resolvedColumnWidth,
    timeStep,
    svgWidth,
    svgHeight: ganttFullHeight,
    taskHeight: rowHeight * (barFill / 100),
    arrowColor,
    arrowIndent,
    fontSize,
    fontFamily,
    rtl,
    setInteractionState,
    setFailedTask,
    setSelectedTask,
    onSelect,
    onDoubleClick,
    onClick,
    onDateChange,
    onProgressChange,
    onDelete,
    onExpanderClick: handleExpanderClick,
    TooltipContent,
    mousePos,
    ganttHeight: viewHeight,
    headerHeight
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      className: "ganttOuterWrapper",
      onScroll: handleScroll,
      onMouseMove: handleMouseMove,
      style: {
        fontFamily,
        fontSize,
        height: viewHeight,
        width: "100%",
        overflow: "auto",
        position: "relative"
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "ganttWrapper",
          style: {
            display: "flex",
            width: taskListWidth + svgWidth + 6,
            // リサイザーの幅分追加
            height: ganttFullHeight + headerHeight,
            position: "relative",
            userSelect: isResizing ? "none" : "auto"
          },
          children: [
            /* @__PURE__ */ jsx(
              TaskList,
              {
                tasks: renderedTasks,
                visibleTasks: visibleRenderedTasks,
                rowWidth: `${taskListWidth}px`,
                taskListWidth,
                rowHeight,
                headerHeight,
                fontFamily,
                fontSize,
                locale,
                selectedTaskId: (selectedTask == null ? void 0 : selectedTask.id) || "",
                setSelectedTask,
                onExpanderClick: handleExpanderClick,
                TaskListHeader,
                TaskListTable
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "ganttResizer",
                onMouseDown: handleResizerMouseDown,
                style: {
                  width: "6px",
                  cursor: "col-resize",
                  zIndex: 30,
                  flexShrink: 0,
                  transition: "background-color 0.2s"
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { style: { pointerEvents: isResizing ? "none" : "auto" }, children: /* @__PURE__ */ jsx(
              TimelinePanel,
              {
                gridProps,
                calendarProps,
                contentProps
              }
            ) })
          ]
        }
      )
    }
  );
};
export {
  Gantt,
  ViewMode
};
