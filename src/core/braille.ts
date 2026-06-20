import type { BrailleGrid } from "./types";

const dotBits = [
	[0x01, 0x08],
	[0x02, 0x10],
	[0x04, 0x20],
	[0x40, 0x80],
];

export function gridToBraille(grid: BrailleGrid): string {
	const rows = Math.ceil(grid.length / 4);
	const columns = Math.ceil((grid[0]?.length ?? 0) / 2);
	const lines: string[] = [];

	for (let cellY = 0; cellY < rows; cellY += 1) {
		let line = "";

		for (let cellX = 0; cellX < columns; cellX += 1) {
			let code = 0;

			for (let dotY = 0; dotY < 4; dotY += 1) {
				for (let dotX = 0; dotX < 2; dotX += 1) {
					if (grid[cellY * 4 + dotY]?.[cellX * 2 + dotX]) {
						code += dotBits[dotY][dotX];
					}
				}
			}

			line += String.fromCharCode(0x2800 + code);
		}

		lines.push(line.trimEnd());
	}

	return lines.join("\n");
}
