import {
	BrailleAxis,
	BrailleBar,
	BrailleChart,
	BrailleGrid,
	BrailleLegend,
} from "braille-charts";
import "braille-charts/styles.css";

const signups = [
	{ channel: "Organic", count: 32 },
	{ channel: "Ads", count: 18 },
	{ channel: "Social", count: 24 },
	{ channel: "Referral", count: 12 },
];

export function BarChartExample() {
	return (
		<BrailleChart
			data={signups}
			columns={36}
			rows={10}
			xKey="channel"
			includeZero
			series={[{ id: "signups", dataKey: "count", label: "Signups" }]}
		>
			<BrailleGrid />
			<BrailleBar series="signups" />
			<BrailleAxis axis="x" label="Channel" />
			<BrailleAxis axis="y" label="Signups" />
			<BrailleLegend />
		</BrailleChart>
	);
}
