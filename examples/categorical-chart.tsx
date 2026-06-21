import {
	BrailleChart,
	BrailleLegend,
	BraillePolygon,
	BrailleRuler,
} from "braille-charts";
import "braille-charts/styles.css";

export function CategoricalChartExample() {
	return (
		<BrailleChart
			resolution={{ columns: 60, rows: 30 }}
			xDomain={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
			yDomain={[0, 100]}
		>
			<BraillePolygon
				color="#a855f7"
				data={[
					{ x: "Jan", y: 12 },
					{ x: "Feb", y: 72 },
					{ x: "Mar", y: 48 },
					{ x: "Apr", y: 86 },
					{ x: "May", y: 36 },
					{ x: "Jun", y: 18 },
				]}
				label="Categorical polygon"
			/>
			<BrailleRuler axis="x" edge="bottom" every={1} />
			<BrailleRuler axis="y" edge="left" every={4} />
			<BrailleLegend
				items={[{ id: "shape", color: "#a855f7", label: "categorical" }]}
			/>
		</BrailleChart>
	);
}
