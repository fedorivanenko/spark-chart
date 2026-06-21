import { gridToBraille } from "./braille";
import { projectPolyline, sampleFunction } from "./project";
import { createGrid, drawPolygon, drawPolyline, fillPolygon } from "./raster";
import { linearScale, pointScale, type Scale } from "./scale";
import type {
	BrailleResolution,
	ContinuousDomain,
	DataKey,
	DomainValue,
	PlotPoint,
} from "./types";

export type TerminalViewport = {
	x?: DomainValue[] | ContinuousDomain;
	y?: ContinuousDomain;
};

export type TerminalChartFrame = {
	columns: number;
	rows: number;
	xDomain?: DomainValue[] | ContinuousDomain;
	yDomain?: ContinuousDomain;
	xScale?: Scale;
	yScale?: Scale<number>;
};

export type TerminalLayerBase = {
	color?: string;
	zIndex?: number;
};

export type TerminalFunctionLayer = TerminalLayerBase & {
	kind: "function";
	y: (x: number) => number;
	xDomain?: ContinuousDomain;
	yDomain?: ContinuousDomain;
	samples?: number | "screen";
};

export type TerminalPolygonLayer<TDatum = { x: DomainValue; y: number }> =
	TerminalLayerBase & {
		kind: "polygon";
		data: TDatum[];
		x?: DataKey<TDatum, DomainValue>;
		y?: DataKey<TDatum, number>;
		fill?: boolean;
		stroke?: boolean;
	};

export type TerminalRulerLayer = TerminalLayerBase & {
	kind: "ruler";
	axis: "x" | "y";
	edge?: "top" | "right" | "bottom" | "left";
	every?: number;
	format?: (value: DomainValue, index: number) => string;
	label?: string;
	labelWidth?: number;
	precision?: number;
	showLine?: boolean;
	showTicks?: boolean;
};

export type TerminalChartLayer =
	| TerminalFunctionLayer
	| TerminalPolygonLayer
	| TerminalRulerLayer;

export type RenderBrailleChartOptions = {
	resolution?: Partial<BrailleResolution>;
	columns?: number;
	rows?: number;
	viewport?: TerminalViewport;
	xDomain?: DomainValue[] | ContinuousDomain;
	yDomain?: ContinuousDomain;
	layers?: TerminalChartLayer[];
};

export function functionLayer(
	layer: Omit<TerminalFunctionLayer, "kind">,
): TerminalFunctionLayer {
	return { ...layer, kind: "function" };
}

export function polygonLayer<TDatum>(
	layer: Omit<TerminalPolygonLayer<TDatum>, "kind">,
): TerminalPolygonLayer<TDatum> {
	return { ...layer, kind: "polygon" };
}

export function rulerLayer(
	layer: Omit<TerminalRulerLayer, "kind">,
): TerminalRulerLayer {
	return { ...layer, kind: "ruler" };
}

function isContinuousDomain(
	domain: DomainValue[] | ContinuousDomain | undefined,
): domain is ContinuousDomain {
	return (
		Array.isArray(domain) &&
		domain.length === 2 &&
		domain.every((value) => typeof value === "number" && Number.isFinite(value))
	);
}

function isCategoryDomain(
	domain: DomainValue[] | ContinuousDomain | undefined,
): domain is DomainValue[] {
	return Array.isArray(domain) && !isContinuousDomain(domain);
}

function readValue<TDatum, TValue>(
	datum: TDatum,
	accessor: DataKey<TDatum, TValue>,
	index: number,
): TValue {
	if (typeof accessor === "function") {
		return accessor(datum, index);
	}

	return datum[accessor] as TValue;
}

function createTextGrid(columns: number, rows: number): string[][] {
	return Array.from({ length: rows }, () =>
		Array.from({ length: columns }, () => " "),
	);
}

function writeText(
	grid: string[][],
	column: number,
	row: number,
	text: string,
): void {
	if (row < 0 || row >= grid.length) {
		return;
	}

	for (let index = 0; index < text.length; index += 1) {
		const targetColumn = column + index;

		if (targetColumn >= 0 && targetColumn < grid[row].length) {
			grid[row][targetColumn] = text[index];
		}
	}
}

function textGridToString(grid: string[][]): string {
	return grid.map((row) => row.join("").trimEnd()).join("\n");
}

function isEmptyCell(value: string): boolean {
	return value === " " || value === "⠀";
}

function overlay(base: string, layer: string): string {
	const baseLines = base.split("\n");
	const layerLines = layer.split("\n");
	const rowCount = Math.max(baseLines.length, layerLines.length);
	const width = Math.max(
		...baseLines.map((line) => line.length),
		...layerLines.map((line) => line.length),
		0,
	);
	const rows = Array.from({ length: rowCount }, (_, row) => {
		const chars = (baseLines[row] ?? "").padEnd(width, " ").split("");
		const layerChars = (layerLines[row] ?? "").padEnd(width, " ").split("");

		for (let column = 0; column < width; column += 1) {
			if (!isEmptyCell(layerChars[column])) {
				chars[column] = layerChars[column];
			}
		}

		return chars.join("").trimEnd();
	});

	return rows.join("\n");
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

function formatWithPrecision(value: DomainValue, precision: number): string {
	if (value instanceof Date) {
		return value.toISOString();
	}

	if (typeof value === "number") {
		return value.toFixed(precision);
	}

	return String(value);
}

export function createTerminalFrame({
	columns,
	rows,
	resolution,
	viewport,
	xDomain,
	yDomain,
}: RenderBrailleChartOptions): TerminalChartFrame {
	const resolvedColumns = resolution?.columns ?? columns ?? 60;
	const resolvedRows = resolution?.rows ?? rows ?? 16;
	const resolvedXDomain = viewport?.x ?? xDomain;
	const resolvedYDomain = viewport?.y ?? yDomain;
	const dotWidth = Math.max(resolvedColumns * 2 - 1, 1);
	const dotHeight = Math.max(resolvedRows * 4 - 1, 1);
	const xScale = resolvedXDomain
		? isContinuousDomain(resolvedXDomain)
			? linearScale(resolvedXDomain, [0, dotWidth])
			: pointScale(resolvedXDomain.map(String), [0, dotWidth])
		: undefined;
	const yScale = resolvedYDomain
		? linearScale(resolvedYDomain, [dotHeight, 0])
		: undefined;

	return {
		columns: resolvedColumns,
		rows: resolvedRows,
		xDomain: resolvedXDomain,
		xScale,
		yDomain: resolvedYDomain,
		yScale,
	};
}

export function renderFunctionLayer(
	frame: TerminalChartFrame,
	layer: TerminalFunctionLayer,
): string {
	const contextXDomain = frame.xDomain;
	const xDomain =
		layer.xDomain ??
		(contextXDomain?.length === 2 &&
		typeof contextXDomain[0] === "number" &&
		typeof contextXDomain[1] === "number"
			? ([contextXDomain[0], contextXDomain[1]] as ContinuousDomain)
			: undefined);
	const yDomain = layer.yDomain ?? frame.yDomain ?? [-1, 1];

	if (!xDomain) {
		throw new Error(
			"Function layer requires xDomain or chart viewport.x with numeric domain.",
		);
	}

	const grid = createGrid(frame.columns, frame.rows);
	const xScale = linearScale(xDomain, [0, Math.max(frame.columns * 2 - 1, 1)]);
	const yScale = linearScale(yDomain, [Math.max(frame.rows * 4 - 1, 1), 0]);
	const worldPoints = sampleFunction(
		{ samples: layer.samples ?? "screen", xDomain, y: layer.y },
		Math.max(frame.columns * 2, 2),
	);
	const points = projectPolyline(worldPoints, {
		projectPoint: (point) => ({ x: xScale(point.x), y: yScale(point.y) }),
		projectY: (value) => yScale(value),
	});

	drawPolyline(grid, points);

	return gridToBraille(grid);
}

export function renderPolygonLayer<TDatum>(
	frame: TerminalChartFrame,
	layer: TerminalPolygonLayer<TDatum>,
): string {
	const grid = createGrid(frame.columns, frame.rows);
	const xAccessor = (layer.x ?? "x") as DataKey<TDatum, DomainValue>;
	const yAccessor = (layer.y ?? "y") as DataKey<TDatum, number>;
	const points: PlotPoint[] =
		frame.xScale && frame.yScale
			? layer.data.map((datum, index) => ({
					x: frame.xScale?.(readValue(datum, xAccessor, index)) ?? 0,
					y: frame.yScale?.(readValue(datum, yAccessor, index)) ?? 0,
				}))
			: [];

	if (layer.fill ?? true) {
		fillPolygon(grid, points);
	}

	if (layer.stroke ?? true) {
		drawPolygon(grid, points);
	}

	return gridToBraille(grid);
}

export function renderRulerLayer(
	frame: TerminalChartFrame,
	layer: TerminalRulerLayer,
): string {
	const edge = layer.edge ?? (layer.axis === "x" ? "bottom" : "left");
	const labelWidth = layer.labelWidth ?? 9;
	const precision = layer.precision ?? 3;
	const every = Math.max(Math.floor(layer.every ?? 1), 1);
	const format =
		layer.format ??
		((value: DomainValue) => formatWithPrecision(value, precision));
	const gridWidth = layer.axis === "x" ? frame.columns + 6 : labelWidth + 2;
	const gridRows = layer.axis === "x" ? 2 : frame.rows;
	const grid = createTextGrid(gridWidth, gridRows);
	const xLineRow = edge === "top" ? 1 : 0;
	const xLabelRow = edge === "top" ? 0 : 1;
	const yLineColumn = edge === "right" ? 0 : labelWidth + 1;
	const yLabelColumn = edge === "right" ? 2 : 0;
	const labels: Array<{ column: number; row: number; text: string }> = [];

	if (layer.axis === "x") {
		if (isContinuousDomain(frame.xDomain)) {
			const [min, max] = frame.xDomain;
			const dotWidth = Math.max(frame.columns * 2 - 1, 1);

			for (
				let column = 0, index = 0;
				column < frame.columns;
				column += every, index += 1
			) {
				const value = min + ((column * 2) / dotWidth) * (max - min);
				labels.push({ column, row: xLabelRow, text: format(value, index) });
			}
		} else if (isCategoryDomain(frame.xDomain) && frame.xScale) {
			for (let index = 0; index < frame.xDomain.length; index += 1) {
				if (index % every === 0) {
					const value = frame.xDomain[index];
					labels.push({
						column: Math.round((frame.xScale?.(value) ?? 0) / 2),
						row: xLabelRow,
						text: format(value, index),
					});
				}
			}
		}
	} else if (isContinuousDomain(frame.yDomain)) {
		const [min, max] = frame.yDomain;
		const dotHeight = Math.max(frame.rows * 4 - 1, 1);

		for (let row = 0, index = 0; row < frame.rows; row += every, index += 1) {
			const value = max - ((row * 4) / dotHeight) * (max - min);
			labels.push({ column: yLabelColumn, row, text: format(value, index) });
		}
	}

	if (layer.showLine ?? true) {
		if (layer.axis === "x") {
			for (let column = 0; column < frame.columns; column += 1) {
				grid[xLineRow][column] = "─";
			}
		} else {
			for (let row = 0; row < frame.rows; row += 1) {
				grid[row][yLineColumn] = "│";
			}
		}
	}

	if (layer.label) {
		if (layer.axis === "x") {
			writeText(grid, frame.columns + 2, xLineRow, `(${layer.label})`);
		} else {
			writeText(grid, 0, 0, `(${layer.label})`);
		}
	}

	for (const label of labels) {
		if (layer.axis === "x") {
			if (layer.showTicks ?? true) {
				grid[xLineRow][clamp(label.column, 0, gridWidth - 1)] = "│";
			}

			writeText(
				grid,
				clamp(label.column - Math.floor(label.text.length / 2), 0, gridWidth),
				label.row,
				label.text,
			);
		} else {
			if (layer.showTicks ?? true) {
				grid[label.row][yLineColumn] = "┤";
			}

			writeText(
				grid,
				label.column,
				label.row,
				label.text.padStart(labelWidth, " "),
			);
		}
	}

	return textGridToString(grid);
}

export function renderBrailleChart(options: RenderBrailleChartOptions): string {
	const frame = createTerminalFrame(options);
	let plot = "";
	let leftRuler = "";
	let bottomRuler = "";

	const layers = [...(options.layers ?? [])].sort(
		(a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0),
	);

	for (const layer of layers) {
		if (layer.kind === "ruler") {
			const rendered = renderRulerLayer(frame, layer);
			const edge = layer.edge ?? (layer.axis === "x" ? "bottom" : "left");

			if (edge === "left") {
				leftRuler = leftRuler ? overlay(leftRuler, rendered) : rendered;
			} else if (edge === "bottom") {
				bottomRuler = bottomRuler ? overlay(bottomRuler, rendered) : rendered;
			} else {
				plot = plot ? overlay(plot, rendered) : rendered;
			}
			continue;
		}

		const rendered =
			layer.kind === "function"
				? renderFunctionLayer(frame, layer)
				: renderPolygonLayer(frame, layer);
		plot = plot ? overlay(plot, rendered) : rendered;
	}

	const plotLines = plot.split("\n");
	const leftLines = leftRuler ? leftRuler.split("\n") : [];
	const bottomLines = bottomRuler ? bottomRuler.split("\n") : [];
	const leftWidth = Math.max(...leftLines.map((line) => line.length), 0);
	const plotWidth = Math.max(
		...plotLines.map((line) => line.length),
		frame.columns,
	);
	const rows = Array.from({ length: frame.rows }, (_, row) => {
		const left = (leftLines[row] ?? "").padEnd(leftWidth, " ");
		const body = (plotLines[row] ?? "").padEnd(plotWidth, " ");
		return `${left}${body}`.trimEnd();
	});

	for (const line of bottomLines) {
		rows.push(`${"".padEnd(leftWidth, " ")}${line}`.trimEnd());
	}

	return rows.join("\n");
}
