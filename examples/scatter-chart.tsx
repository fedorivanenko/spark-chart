import {
	BrailleAxis,
	BrailleChart,
	BrailleGrid,
	BrailleLegend,
	BrailleScatter,
} from "braille-charts";
import "braille-charts/styles.css";

const sessions = [
	{ duration: 2, conversions: 1 },
	{ duration: 4, conversions: 1 },
	{ duration: 5, conversions: 2 },
	{ duration: 8, conversions: 3 },
	{ duration: 9, conversions: 2 },
	{ duration: 12, conversions: 5 },
	{ duration: 14, conversions: 4 },
	{ duration: 16, conversions: 6 },
];

export function ScatterChartExample() {
	return (
		<BrailleChart
			data={sessions}
			x="duration"
			y="conversions"
			resolution={{ columns: 44, rows: 10 }}
			viewport={{ x: [0, 18], y: [0, 7] }}
		>
			<BrailleGrid />
			<BrailleScatter
				color="#2563eb"
				label="Session duration and conversions correlation"
				x="duration"
				y="conversions"
			/>
			<BrailleAxis axis="x" label="Duration, minutes" />
			<BrailleAxis axis="y" label="Conversions" />
			<BrailleLegend items={[{ id: "sessions", label: "Sessions" }]} />
		</BrailleChart>
	);
}
