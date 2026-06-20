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
			x="channel"
			y="count"
			includeZero
		>
			<BrailleGrid />
			<BrailleBar
				label="Signup count by acquisition channel"
				x="channel"
				y="count"
			/>
			<BrailleAxis axis="x" label="Channel" />
			<BrailleAxis axis="y" label="Signups" />
			<BrailleLegend items={[{ id: "signups", label: "Signups" }]} />
		</BrailleChart>
	);
}
