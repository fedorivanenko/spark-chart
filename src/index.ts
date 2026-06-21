export { BrailleChart, type BrailleChartProps } from "./charts/braille-chart";
export {
	BrailleFunction,
	type BrailleFunctionProps,
} from "./charts/braille-function";
export {
	BrailleLegend,
	type BrailleLegendItem,
	type BrailleLegendProps,
} from "./charts/braille-legend";
export {
	BraillePolygon,
	type BraillePolygonProps,
} from "./charts/braille-polygon";
export {
	BrailleRuler,
	type BrailleRulerEdge,
	type BrailleRulerProps,
} from "./charts/braille-ruler";
export type {
	RenderBrailleChartOptions,
	TerminalChartFrame,
	TerminalChartLayer,
	TerminalFunctionLayer,
	TerminalPolygonLayer,
	TerminalRulerLayer,
	TerminalViewport,
} from "./core/render";
export {
	createTerminalFrame,
	functionLayer,
	polygonLayer,
	renderBrailleChart,
	renderFunctionLayer,
	renderPolygonLayer,
	renderRulerLayer,
	rulerLayer,
} from "./core/render";
export type { WorldFunction, WorldPoint, WorldPolyline } from "./core/shapes";
export type {
	Accessor,
	BrailleResolution,
	ChartDatum,
	ContinuousDomain,
	DataKey,
	DomainValue,
	NumberAccessor,
} from "./core/types";
export { cn } from "./lib/utils";
