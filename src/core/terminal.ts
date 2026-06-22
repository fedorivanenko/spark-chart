import {
	renderBrailleChart,
	type RenderBrailleChartOptions,
} from "./render";
import type { BrailleResolution } from "./types";

export type TerminalSizeLike = {
	columns?: number;
	rows?: number;
};

export type GetTerminalResolutionOptions = {
	fallback?: BrailleResolution;
	reservedColumns?: number;
	reservedRows?: number;
	terminal?: TerminalSizeLike;
};

export type RenderTerminalBrailleChartOptions = Omit<
	RenderBrailleChartOptions,
	"columns" | "resolution" | "rows"
> &
	GetTerminalResolutionOptions;

function getDefaultTerminal(): TerminalSizeLike | undefined {
	return (globalThis as { process?: { stdout?: TerminalSizeLike } }).process
		?.stdout;
}

function clampPositiveInteger(value: number | undefined, fallback: number): number {
	return Number.isFinite(value) && value && value > 0
		? Math.floor(value)
		: fallback;
}

export function getTerminalResolution({
	fallback = { columns: 80, rows: 24 },
	reservedColumns = 0,
	reservedRows = 0,
	terminal = getDefaultTerminal(),
}: GetTerminalResolutionOptions = {}): BrailleResolution {
	const columns = clampPositiveInteger(terminal?.columns, fallback.columns);
	const rows = clampPositiveInteger(terminal?.rows, fallback.rows);

	return {
		columns: Math.max(columns - reservedColumns, 1),
		rows: Math.max(rows - reservedRows, 1),
	};
}

export function renderTerminalBrailleChart({
	fallback,
	reservedColumns,
	reservedRows,
	terminal,
	...options
}: RenderTerminalBrailleChartOptions): string {
	return renderBrailleChart({
		...options,
		resolution: getTerminalResolution({
			fallback,
			reservedColumns,
			reservedRows,
			terminal,
		}),
	});
}
