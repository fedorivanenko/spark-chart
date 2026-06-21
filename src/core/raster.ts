import type { BrailleGrid, PlotPoint } from "./types";

export function createGrid(columns: number, rows: number): BrailleGrid {
	return Array.from({ length: rows * 4 }, () =>
		Array.from({ length: columns * 2 }, () => false),
	);
}

export function setDot(grid: BrailleGrid, x: number, y: number): void {
	const dotY = Math.round(y);
	const dotX = Math.round(x);

	if (dotY < 0 || dotY >= grid.length) {
		return;
	}

	if (dotX < 0 || dotX >= (grid[dotY]?.length ?? 0)) {
		return;
	}

	grid[dotY][dotX] = true;
}

export function drawPoint(grid: BrailleGrid, point: PlotPoint): void {
	setDot(grid, point.x, point.y);
}

export function drawLine(
	grid: BrailleGrid,
	start: PlotPoint,
	end: PlotPoint,
): void {
	let x0 = Math.round(start.x);
	let y0 = Math.round(start.y);
	const x1 = Math.round(end.x);
	const y1 = Math.round(end.y);
	const dx = Math.abs(x1 - x0);
	const sx = x0 < x1 ? 1 : -1;
	const dy = -Math.abs(y1 - y0);
	const sy = y0 < y1 ? 1 : -1;
	let error = dx + dy;

	while (true) {
		setDot(grid, x0, y0);

		if (x0 === x1 && y0 === y1) {
			break;
		}

		const doubledError = 2 * error;

		if (doubledError >= dy) {
			error += dy;
			x0 += sx;
		}

		if (doubledError <= dx) {
			error += dx;
			y0 += sy;
		}
	}
}

export function drawPolyline(grid: BrailleGrid, points: PlotPoint[]): void {
	for (let index = 1; index < points.length; index += 1) {
		drawLine(grid, points[index - 1], points[index]);
	}
}

export function drawHorizontalLine(grid: BrailleGrid, y: number): void {
	const width = grid[0]?.length ?? 0;

	for (let x = 0; x < width; x += 1) {
		setDot(grid, x, y);
	}
}

export function drawVerticalLine(grid: BrailleGrid, x: number): void {
	for (let y = 0; y < grid.length; y += 1) {
		setDot(grid, x, y);
	}
}

export function drawVerticalBar(
	grid: BrailleGrid,
	x: number,
	y: number,
	baseline: number,
	width = 1,
): void {
	const start = Math.min(y, baseline);
	const end = Math.max(y, baseline);
	const halfWidth = Math.max(0, Math.floor(width / 2));

	for (
		let barX = Math.round(x) - halfWidth;
		barX <= Math.round(x) + halfWidth;
		barX += 1
	) {
		for (let barY = Math.round(start); barY <= Math.round(end); barY += 1) {
			setDot(grid, barX, barY);
		}
	}
}

export function drawPolygon(grid: BrailleGrid, points: PlotPoint[]): void {
	if (points.length < 2) {
		return;
	}

	drawPolyline(grid, [...points, points[0]]);
}

export function fillPolygon(grid: BrailleGrid, points: PlotPoint[]): void {
	if (points.length < 3) {
		return;
	}

	const height = grid.length;

	for (let y = 0; y < height; y += 1) {
		const intersections: number[] = [];

		for (let index = 0; index < points.length; index += 1) {
			const start = points[index];
			const end = points[(index + 1) % points.length];
			const minY = Math.min(start.y, end.y);
			const maxY = Math.max(start.y, end.y);

			if (y < minY || y >= maxY || start.y === end.y) {
				continue;
			}

			const ratio = (y - start.y) / (end.y - start.y);
			intersections.push(start.x + ratio * (end.x - start.x));
		}

		intersections.sort((a, b) => a - b);

		for (let index = 0; index < intersections.length - 1; index += 2) {
			const startX = Math.ceil(intersections[index]);
			const endX = Math.floor(intersections[index + 1]);

			for (let x = startX; x <= endX; x += 1) {
				setDot(grid, x, y);
			}
		}
	}
}
