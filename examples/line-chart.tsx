import {
	BrailleAxis,
	BrailleChart,
	BrailleGrid,
	BrailleLegend,
	BrailleLine,
} from "braille-charts";
import "braille-charts/styles.css";

const revenue = [
	{ month: "Jan", mrr: 18, target: 24 },
	{ month: "Feb", mrr: 28, target: 30 },
	{ month: "Mar", mrr: 24, target: 34 },
	{ month: "Apr", mrr: 40, target: 38 },
	{ month: "May", mrr: 52, target: 44 },
	{ month: "Jun", mrr: 49, target: 50 },
];

export function LineChartExample() {
	return (
		<BrailleChart
			data={revenue}
			columns={48}
			rows={10}
			x="month"
			yDomain={[0, 56]}
		>
			<BrailleGrid />
			<BrailleLine
				color="#0f766e"
				label="Monthly recurring revenue trend"
				x="month"
				y="mrr"
			/>
			<BrailleLine
				color="#dc2626"
				label="Monthly recurring revenue target trend"
				x="month"
				y="target"
			/>
			<BrailleAxis axis="x" label="Month" />
			<BrailleAxis axis="y" label="MRR" />
			<BrailleLegend
				items={[
					{ id: "mrr", color: "#0f766e", label: "MRR" },
					{ id: "target", color: "#dc2626", label: "Target" },
				]}
			/>
		</BrailleChart>
	);
}
