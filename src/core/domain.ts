import { readDomainValue, readNumber } from "./accessors";
import type {
	Accessor,
	CategoryDomain,
	ChartDatum,
	ContinuousDomain,
	DomainValue,
	NumberAccessor,
} from "./types";

export function toNumber(value: DomainValue): number {
	if (value instanceof Date) {
		return value.getTime();
	}

	if (typeof value === "number") {
		return value;
	}

	return Number.NaN;
}

export function isContinuousDomain(values: DomainValue[]): boolean {
	return values.every((value) => Number.isFinite(toNumber(value)));
}

export function continuousDomain<TDatum extends ChartDatum>(
	data: TDatum[],
	accessor: Accessor<TDatum, DomainValue> | NumberAccessor<TDatum>,
	options: { includeZero?: boolean } = {},
): ContinuousDomain {
	const values = data
		.map((datum, index) => {
			const value = readDomainValue(datum, accessor, index);
			return toNumber(value);
		})
		.filter(Number.isFinite);

	if (values.length === 0) {
		return [0, 1];
	}

	let min = Math.min(...values);
	let max = Math.max(...values);

	if (options.includeZero) {
		min = Math.min(0, min);
		max = Math.max(0, max);
	}

	if (min === max) {
		return [min - 1, max + 1];
	}

	return [min, max];
}

export function numberDomain<TDatum extends ChartDatum>(
	data: TDatum[],
	accessor: NumberAccessor<TDatum>,
	options: { includeZero?: boolean } = {},
): ContinuousDomain {
	const values = data.map((datum, index) => readNumber(datum, accessor, index));

	if (values.length === 0) {
		return [0, 1];
	}

	let min = Math.min(...values);
	let max = Math.max(...values);

	if (options.includeZero) {
		min = Math.min(0, min);
		max = Math.max(0, max);
	}

	if (min === max) {
		return [min - 1, max + 1];
	}

	return [min, max];
}

export function categoryDomain<TDatum extends ChartDatum>(
	data: TDatum[],
	accessor: Accessor<TDatum, DomainValue>,
): CategoryDomain {
	return Array.from(
		new Set(
			data.map((datum, index) =>
				String(readDomainValue(datum, accessor, index)),
			),
		),
	);
}
