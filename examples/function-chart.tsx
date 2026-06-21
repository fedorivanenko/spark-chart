import {
	BrailleChart,
	BrailleFunction,
	BrailleLegend,
	BraillePolygon,
	BrailleRuler,
} from "braille-charts";
import "braille-charts/styles.css";

export function FunctionChartExample() {
	return (
		<BrailleChart
			resolution={{ columns: 60, rows: 30 }}
			viewport={{ x: [-Math.PI * 2, Math.PI * 2], y: [-1.2, 1.2] }}
		>
			<BraillePolygon
				color="#a855f7"
				data={[
					{ x: -Math.PI, y: -0.8 },
					{ x: -Math.PI / 2, y: 0.9 },
					{ x: Math.PI / 2, y: 0.15 },
					{ x: Math.PI, y: -0.7 },
				]}
				label="Sample polygon"
			/>
			<BrailleFunction
				color="#6366f1"
				label="Sine wave"
				y={(x) => Math.sin(x)}
			/>
			<BrailleRuler axis="x" edge="bottom" every={10} label="X" />
			<BrailleRuler axis="y" edge="left" every={1} label="Y" />
			<BrailleLegend
				items={[
					{ id: "polygon", color: "#a855f7", label: "polygon" },
					{ id: "sin", color: "#6366f1", label: "sin(x)" },
				]}
			/>
		</BrailleChart>
	);
}
