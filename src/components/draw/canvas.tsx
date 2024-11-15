import { useEffect, useReducer, useRef, useState } from "react";
import { MODES, PAN_LIMIT } from "./constants";
import { MdCropSquare, MdCircle, MdUndo, MdRedo, MdImportExport, MdFileUpload } from "react-icons/md";
import { PenIcon } from "./icons/pen";
import { PiHandGrabbingDuotone } from "react-icons/pi";

let lastPath: any[] = [];

const Canvas = ({ settings, ...rest }: any) => {
  const width = Math.min(rest.width, PAN_LIMIT);
  const height = Math.min(rest.height, PAN_LIMIT);
  const [drawing, setDrawing] = useState(false);
  const [, render] = useReducer<any>((prev: any) => !prev, false);
  const canvas = useRef<any>(null);
  const context = useRef<any>(null);
  const preview = useRef<any>(null);
  const draw = useRef<any>(false);
  const coords = useRef<any>([0, 0]);
  const history = useRef<any>([]);
  const redoHistory = useRef<any>([]);
  const moving = useRef<any>(false);
  const importInput = useRef<any>(null);

  const prevent = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onPointerDown = (e: any) => {
    prevent(e);
    getContext(settings.current);
    coords.current = [e.clientX, e.clientY];
    if (settings.current.mode === MODES.PAN) {
      moving.current = true;
      return;
    }
    setDrawing(true);
    draw.current = true;
    const point = getPoints(e, context.current);
    lastPath = [];
    drawModes(settings.current.mode, context.current, point, lastPath);
  };

  const onPointerUp = (e: any) => {
    prevent(e);
    if (settings.current.mode === MODES.PAN) {
      moving.current = false;
      return;
    }
    setDrawing(false);
    draw.current = false;
    if (lastPath.length > 0) {
      history.current.push({
        ...settings.current,
        path: lastPath,
      });
      redoHistory.current = [];
      lastPath = [];
      drawCanvas(getContext());
    }
  };

  const getPreviewActiveStyles = () => {
    const styles: any = {
      width: (width * 100) / PAN_LIMIT + "%",
      height: (height * 100) / PAN_LIMIT + "%",
    };
    if (!context.current) return styles;
    const { e, f } = getContext().getTransform();
    styles.left = (100 - e * 100) / PAN_LIMIT + "%";
    styles.top = (100 - f * 100) / PAN_LIMIT + "%";
    return styles;
  };

  const updatePreview = () => {
    if (preview.current) {
      const style = getPreviewActiveStyles();
      preview.current.style.left = style.left;
      preview.current.style.top = style.top;
    }
  };

  const onCanvasMove = (e: any, ctx: any) => {
    const [x1, y1] = coords.current;
    const { clientX: x2, clientY: y2 } = e;
    let dx = x2 - x1;
    let dy = y2 - y1;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
    const { e: tdx, f: tdy } = ctx.getTransform();
    const ntdx = Math.min(Math.max(-(PAN_LIMIT - width), tdx + dx), 0);
    const ntdy = Math.min(Math.max(-(PAN_LIMIT - height), tdy + dy), 0);
    ctx.setTransform(1, 0, 0, 1, ntdx, ntdy);
    drawCanvas(ctx);
    coords.current = [x2, y2];
    updatePreview();
  };

  const onPointerMove = (e: any) => {
    prevent(e);
    if (moving.current) return onCanvasMove(e, context.current);
    if (!draw.current) return;
    const point = getPoints(e, context.current);
    drawModes(settings.current.mode, context.current, point, lastPath);
  };

  const drawModes = (mode: any, ctx: any, point: any, path: any) => {
    switch (mode) {
      case MODES.PEN:
        point ? previewPen(point, ctx) : drawPen(path, ctx);
        break;
      case MODES.RECT:
        if (point) {
          path.length === 0 ? (path[0] = point) : (path[1] = point);
          previewRect(path, ctx);
        } else {
          drawRect(path, ctx);
        }
        break;
      case MODES.CIRCLE:
        if (point) {
          path.length === 0 ? (path[0] = point) : (path[1] = point);
          previewCircle(path, ctx);
        } else {
          drawCircle(path, ctx);
        }
        break;
      default:
        return;
    }
  };

  const getContext = (config?: any, ctx?: any) => {
    if (!context.current) {
      context.current = canvas.current.getContext("2d");
    }
    if (!ctx) ctx = context.current;
    if (config) {
      ctx.strokeStyle = config.color;
      ctx.lineWidth = config.stroke;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
    return ctx;
  };

  const getPoints = (e: any, ctx: any) => {
    const { e: dx, f: dy } = ctx.getTransform();
    const rect = canvas.current.getBoundingClientRect();
    return [e.clientX - rect.x - dx, e.clientY - rect.y - dy];
  };

  const previewRect = (path: any, ctx: any) => {
    if (path.length < 2) return;
    drawCanvas(ctx);
    drawRect(path, getContext(settings.current, ctx));
  };

  const drawRect = (path: any, ctx: any) => {
    ctx.beginPath();
    ctx.rect(
      path[0][0],
      path[0][1],
      path[1][0] - path[0][0],
      path[1][1] - path[0][1]
    );
    ctx.stroke();
  };

  const previewCircle = (path: any, ctx: any) => {
    if (path.length < 2) return;
    drawCanvas(ctx);
    getContext(settings.current, ctx); // reset context
    drawCircle(path, ctx);
  };

  const getDistance = ([[p1X, p1Y], [p2X, p2Y]]: any) => {
    return Math.sqrt(Math.pow(p1X - p2X, 2) + Math.pow(p1Y - p2Y, 2));
  };

  const drawCircle = (path: any, ctx: any) => {
    ctx.beginPath();
    ctx.arc(path[0][0], path[0][1], getDistance(path), 0, 2 * Math.PI);
    ctx.stroke();
  };

  const previewPen = (point: any, ctx: any) => {
    if (lastPath.length === 0) {
      ctx.beginPath();
      ctx.moveTo(point[0], point[1]);
    }
    ctx.lineTo(point[0], point[1]);
    ctx.stroke();
    lastPath.push(point);
  };

  const drawPen = (points: any, ctx: any) => {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (const p of points) {
      ctx.lineTo(p[0], p[1]);
    }
    ctx.stroke();
  };

  const clearCanvas = (ctx: any) => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, PAN_LIMIT, PAN_LIMIT);
    ctx.restore();
  };

  const drawCanvas = (ctx: any) => {
    clearCanvas(ctx);
    for (const item of history.current) {
      getContext(item, ctx);
      drawModes(item.mode, ctx, null, item.path);
    }
  };

  const undoCanvas = (e: any) => {
    prevent(e);
    if (history.current.length === 0) return;
    redoHistory.current.push(history.current.pop());
    drawCanvas(getContext());
    render();
  };

  const redoCanvas = (e: any) => {
    prevent(e);
    if (redoHistory.current.length === 0) return;
    history.current.push(redoHistory.current.pop());
    drawCanvas(getContext());
    render();
  };

  const setMode = (mode: any) => (e: any) => {
    settings.current.mode = mode;
    render();
  };

  useEffect(() => {
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointermove", onPointerMove);
    getContext().setTransform(
      1,
      0,
      0,
      1,
      -(PAN_LIMIT - width) / 2,
      -(PAN_LIMIT - height) / 2
    );
    drawCanvas(getContext());
    updatePreview();
    return () => {
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointermove", onPointerMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  const changeColor = (e: any) => {
    settings.current.color = e.target.value;
  };

  const exportCanvas = () => {
    const link = document.createElement("a");
    const content = JSON.stringify(history.current);
    const file = new Blob([content], { type: "application/json" });
    link.href = URL.createObjectURL(file);
    link.download = `canvas_export_${Date.now()}_${Math.floor(
      Math.random() * 3
    )}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const importCanvas = (e: any) => {
    if (e.target.files.length === 0) return;
    const reader = new FileReader();
    try {
      reader.onload = () => {
        history.current = JSON.parse(reader.result as any);
        drawCanvas(getContext());
        render();
      };
      reader.readAsText(e.target.files[0]);
    } catch (e) {
      console.log(e);
    }
  };

  const onImportClick = () => {
    importInput.current?.click();
  };

  const modeButtons = [
    {
      mode: MODES.RECT,
      title: "Rectangle",
      Icon: MdCropSquare,
    },
    {
      mode: MODES.CIRCLE,
      title: "Circle",
      Icon: MdCircle,
    },
  ];

  return (
    <>
      <canvas
        ref={canvas}
        width={width}
        height={height}
        onPointerDown={onPointerDown}
        className={settings.current.mode === MODES.PAN ? "moving" : "drawing"}
      />
      <div className="flex justify-center">
        <div
          className="menu"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          aria-disabled={drawing}
        >
          <div className="flex flex-col items-center justify-around border-r border-[#242424] pr-4 mr-4">
            <button
              key={MODES.PAN}
              type="button"
              onClick={setMode(MODES.PAN)}
              aria-pressed={settings.current.mode === MODES.PAN}
              title={"Move"}
            >
              <PiHandGrabbingDuotone size={30} />
            </button>
            <button className="button color" type="button">
              <input
                type="color"
                title="change color"
                defaultValue={settings.current.color}
                onChange={changeColor}
                className="rounded-color"
              />
            </button>
          </div>

          <div className="overflow-hidden h-14">
            <button
              className="buttonPen"
              key={MODES.PEN}
              type="button"
              onClick={setMode(MODES.PEN)}
              aria-pressed={settings.current.mode === MODES.PEN}
              title={"Pen"}
            >
              <PenIcon className="w-8 h-16 translate-y-2 transition-all duration-200 drop-shadow-md" />
            </button>
          </div>

          {modeButtons.map((btn) => (
            <button
              className="button"
              key={btn.mode}
              type="button"
              onClick={setMode(btn.mode)}
              aria-pressed={settings.current.mode === btn.mode}
              title={btn.title}
            >
              <btn.Icon size={24} />
            </button>
          ))}
          <button
            className="button"
            type="button"
            onClick={undoCanvas}
            disabled={history.current.length === 0}
            title="Undo"
          >
            <MdUndo size={24} />
          </button>
          <button
            className="button"
            type="button"
            onClick={redoCanvas}
            disabled={redoHistory.current.length === 0}
            title="Redo"
          >
            <MdRedo size={24} />
          </button>
          <button
            className="button"
            type="button"
            onClick={exportCanvas}
            disabled={history.current.length === 0}
            title="Export"
          >
            <MdImportExport size={24} />
          </button>
          <input
            ref={importInput}
            className="hidden"
            type="file"
            accept="application/json"
            onChange={importCanvas}
          />
          <button className="button" type="button" onClick={onImportClick} title="Import">
            <MdFileUpload size={24} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Canvas;