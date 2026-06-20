import type { CategoryDomain, ContinuousDomain, DomainValue } from "./types";

export type ChartTick = {
	value: DomainValue | number;
	label: string;
};

function niceStep(rawStep: number): number {
	const exponent = Math.floor(Math.log10(rawStep));
	const power = 10 ** exponent;
	const fraction = rawStep / power;

	if (fraction <= 1) {
		return power;
	}

	if (fraction <= 2) {
		return 2 * power;
	}

	if (fraction <= 5) {
		return 5 * power;
	}

	return 10 * power;
}

function formatTick(value: number): string {
	if (Math.abs(value) < 1e-12) {
		return "0";
	}

	if (Math.abs(value) >= 1000 || Math.abs(value) < 0.01) {
		return value.toExponential(2);
	}

	return Number(value.toPrecision(4)).toString();
}

export function numericTicks(
	domain: ContinuousDomain,
	count = 5,
	period?: number,
): ChartTick[] {
	const [min, max] = domain;
	const span = max - min;

	if (!Number.isFinite(span) || span === 0) {
		return [{ value: min, label: formatTick(min) }];
	}

	const step = period ?? niceStep(Math.abs(span) / Math.max(count - 1, 1));
	const start = Math.ceil(min / step) * step;
	const end = Math.floor(max / step) * step;
	const ticks: ChartTick[] = [];

	for (let value = start; value <= end + step / 2; value += step) {
		ticks.push({ value, label: formatTick(value) });
	}

	if (ticks.length === 0) {
		return [
			{ value: min, label: formatTick(min) },
			{ value: max, label: formatTick(max) },
		];
	}

	return ticks;
}

export function categoryTicks(
	domain: CategoryDomain,
	count = 5,
	period?: number,
): ChartTick[] {
	if (!period && domain.length <= count) {
		return domain.map((value) => ({ value, label: value }));
	}

	const lastIndex = domain.length - 1;
	const step = period ?? Math.max(Math.ceil(domain.length / count), 1);
	const ticks = domain
		.filter((_, index) => index % step === 0 || index === lastIndex)
		.map((value) => ({ value, label: value }));

	return ticks[ticks.length - 1]?.value === domain[lastIndex]
		? ticks
		: [...ticks, { value: domain[lastIndex], label: domain[lastIndex] }];
}
