import {
	BrailleAxis,
	BrailleChart,
	BrailleFunction,
	BrailleGrid,
	BrailleLegend,
} from "braille-charts";
import "braille-charts/styles.css";

export function FunctionChartExample() {
	return (
		<BrailleChart
			data={[]}
			resolution={{ columns: 56, rows: 12 }}
			viewport={{ x: [-Math.PI * 2, Math.PI * 2], y: [-1.2, 1.2] }}
			xTickPeriod={Math.PI}
			yTickPeriod={0.5}
		>
			<BrailleGrid />
			<BrailleFunction
				color="#6366f1"
				label="Sine wave"
				y={(x) => Math.sin(x)}
			/>
			<BrailleAxis axis="x" label="x" />
			<BrailleAxis axis="y" label="sin(x)" />
			<BrailleLegend
				items={[{ id: "sin", color: "#6366f1", label: "sin(x)" }]}
			/>
		</BrailleChart>
	);
}
