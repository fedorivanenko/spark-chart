import {
	functionLayer,
	polygonLayer,
	renderBrailleChart,
	rulerLayer,
} from "braille-charts";

const output = renderBrailleChart({
	resolution: { columns: 80, rows: 40 },
	viewport: { x: [-Math.PI * 2, Math.PI * 2], y: [-1.2, 1.2] },
	layers: [
		polygonLayer({
			data: [
				{ x: -Math.PI, y: -0.8 },
				{ x: -Math.PI / 2, y: 0.9 },
				{ x: Math.PI / 2, y: 0.15 },
				{ x: Math.PI, y: -0.7 },
			],
		}),
		functionLayer({ y: Math.sin }),
		rulerLayer({ axis: "x", edge: "bottom", every: 10, label: "X" }),
		rulerLayer({ axis: "y", edge: "left", every: 1, label: "Y" }),
	],
});

console.log(output);
