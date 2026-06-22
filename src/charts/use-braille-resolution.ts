"use client";

import * as React from "react";
import type { BrailleResolution } from "../core/types";

export type UseBrailleResolutionOptions = {
	aspectRatio?: number;
	initialResolution?: BrailleResolution;
	maxColumns?: number;
	maxRows?: number;
	minColumns?: number;
	minRows?: number;
	observeHeight?: boolean;
};

export type UseBrailleResolutionResult<TElement extends HTMLElement> = {
	ref: React.RefObject<TElement>;
	resolution: BrailleResolution;
};

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

function numberFromCssPixels(value: string): number {
	const parsed = Number.parseFloat(value);

	return Number.isFinite(parsed) ? parsed : 0;
}

function measureTextCell(element: HTMLElement): {
	charWidth: number;
	lineHeight: number;
} {
	const styles = window.getComputedStyle(element);
	const probe = document.createElement("span");

	probe.textContent = "0".repeat(100);
	probe.style.font = styles.font;
	probe.style.letterSpacing = styles.letterSpacing;
	probe.style.lineHeight = styles.lineHeight;
	probe.style.position = "absolute";
	probe.style.visibility = "hidden";
	probe.style.whiteSpace = "pre";

	element.appendChild(probe);

	const rect = probe.getBoundingClientRect();
	const charWidth = rect.width / 100;
	const lineHeight = rect.height;

	probe.remove();

	return {
		charWidth: charWidth > 0 ? charWidth : 1,
		lineHeight: lineHeight > 0 ? lineHeight : charWidth || 1,
	};
}

function getReservedSize(element: HTMLElement): {
	height: number;
	width: number;
} {
	const plot = element.querySelector<HTMLElement>(".braille-chart__plot");

	if (!plot) {
		return { height: 0, width: 0 };
	}

	const styles = window.getComputedStyle(plot);

	return {
		height:
			numberFromCssPixels(styles.paddingTop) +
			numberFromCssPixels(styles.paddingBottom),
		width:
			numberFromCssPixels(styles.paddingLeft) +
			numberFromCssPixels(styles.paddingRight),
	};
}

export function useBrailleResolution<TElement extends HTMLElement = HTMLDivElement>(
	options: UseBrailleResolutionOptions = {},
): UseBrailleResolutionResult<TElement> {
	const {
		aspectRatio = 2,
		initialResolution = { columns: 60, rows: 16 },
		maxColumns = Number.POSITIVE_INFINITY,
		maxRows = Number.POSITIVE_INFINITY,
		minColumns = 1,
		minRows = 1,
		observeHeight = false,
	} = options;
	const ref = React.useRef<TElement>(null);
	const [resolution, setResolution] =
		React.useState<BrailleResolution>(initialResolution);

	React.useEffect(() => {
		const element = ref.current;

		if (!element || typeof ResizeObserver === "undefined") {
			return;
		}

		const update = () => {
			const rect = element.getBoundingClientRect();
			const reserved = getReservedSize(element);
			const { charWidth, lineHeight } = measureTextCell(element);
			const availableWidth = Math.max(rect.width - reserved.width, 0);
			const availableHeight = Math.max(rect.height - reserved.height, 0);
			const columns = clamp(
				Math.floor(availableWidth / charWidth),
				minColumns,
				maxColumns,
			);
			const measuredRows = Math.floor(availableHeight / lineHeight);
			const ratioRows = Math.floor(columns / aspectRatio);
			const rows = clamp(
				observeHeight && availableHeight > 0 ? measuredRows : ratioRows,
				minRows,
				maxRows,
			);

			setResolution((current) =>
				current.columns === columns && current.rows === rows
					? current
					: { columns, rows },
			);
		};

		update();

		const observer = new ResizeObserver(update);
		observer.observe(element);

		return () => observer.disconnect();
	}, [aspectRatio, maxColumns, maxRows, minColumns, minRows, observeHeight]);

	return { ref, resolution };
}
