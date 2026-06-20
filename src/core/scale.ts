import { toNumber } from "./domain";
import type { CategoryDomain, ContinuousDomain, DomainValue } from "./types";

export type Scale<TValue = DomainValue> = (value: TValue) => number;

export function linearScale(
	domain: ContinuousDomain,
	range: [number, number],
): Scale<DomainValue> {
	const [domainMin, domainMax] = domain;
	const [rangeMin, rangeMax] = range;
	const domainSpan = domainMax - domainMin || 1;
	const rangeSpan = rangeMax - rangeMin;

	return (value) => {
		const number = toNumber(value);
		const ratio = (number - domainMin) / domainSpan;
		return rangeMin + ratio * rangeSpan;
	};
}

export function pointScale(
	domain: CategoryDomain,
	range: [number, number],
): Scale<DomainValue> {
	const [rangeMin, rangeMax] = range;
	const lastIndex = Math.max(domain.length - 1, 1);
	const step = (rangeMax - rangeMin) / lastIndex;

	return (value) => {
		const index = Math.max(0, domain.indexOf(String(value)));
		return rangeMin + index * step;
	};
}
