export type ChartDatum = Record<string, unknown>;

export type Accessor<TDatum, TValue = unknown> =
	| keyof TDatum
	| ((datum: TDatum, index: number) => TValue);

export type NumberAccessor<TDatum> = Accessor<TDatum, number>;

export type DomainValue = string | number | Date;

export type ContinuousDomain = [number, number];

export type CategoryDomain = string[];

export type PlotPoint = {
	x: number;
	y: number;
};

export type BrailleGrid = boolean[][];

export type BrailleResolution = {
	columns: number;
	rows: number;
};
