import type {
	Accessor,
	ChartDatum,
	DomainValue,
	NumberAccessor,
} from "./types";

export function readValue<TDatum extends ChartDatum, TValue = unknown>(
	datum: TDatum,
	accessor: Accessor<TDatum, TValue>,
	index: number,
): TValue {
	if (typeof accessor === "function") {
		return accessor(datum, index);
	}

	return datum[accessor] as TValue;
}

export function readDomainValue<TDatum extends ChartDatum>(
	datum: TDatum,
	accessor: Accessor<TDatum, DomainValue>,
	index: number,
): DomainValue {
	const value = readValue(datum, accessor, index);

	if (
		value instanceof Date ||
		typeof value === "number" ||
		typeof value === "string"
	) {
		return value;
	}

	return String(value);
}

export function readNumber<TDatum extends ChartDatum>(
	datum: TDatum,
	accessor: NumberAccessor<TDatum>,
	index: number,
): number {
	const value = readValue(datum, accessor, index);
	const number = typeof value === "number" ? value : Number(value);

	return Number.isFinite(number) ? number : 0;
}
