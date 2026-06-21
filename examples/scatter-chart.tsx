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
			xKey="duration"
			resolution={{ columns: 44, rows: 10 }}
			viewport={{ x: [0, 18], y: [0, 7] }}
			series={[
				{
					id: "sessions",
					dataKey: "conversions",
					label: "Sessions",
					color: "#2563eb",
				},
			]}
		>
			<BrailleGrid />
			<BrailleScatter
				label="Session duration and conversions correlation"
				series="sessions"
			/>
			<BrailleAxis axis="x" label="Duration, minutes" />
			<BrailleAxis axis="y" label="Conversions" />
			<BrailleLegend />
		</BrailleChart>
	);
}
