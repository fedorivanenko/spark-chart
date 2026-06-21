# Braille Charts

Small shadcn-style React chart primitives rendered with braille text glyphs.

```tsx
import {
	BrailleAxis,
	BrailleChart,
	BrailleGrid,
	BrailleLegend,
	BrailleLine,
} from "braille-charts";
import "braille-charts/styles.css";

const data = [
	{ month: "Jan", revenue: 20 },
	{ month: "Feb", revenue: 42 },
	{ month: "Mar", revenue: 35 },
];

export function Example() {
	return (
		<BrailleChart
			data={data}
			resolution={{ columns: 40, rows: 8 }}
			xKey="month"
			yTickPeriod={10}
			series={[
				{ id: "revenue", dataKey: "revenue", label: "Revenue" },
			]}
		>
			<BrailleGrid />
			<BrailleLine series="revenue" />
			<BrailleAxis axis="x" label="Month" />
			<BrailleLegend />
		</BrailleChart>
	);
}
```

## API model

- `data`: raw rows.
- `xKey`: shared x accessor for all series.
- `series`: registry of y accessors and display metadata.
- Plot layers (`BrailleLine`, `BrailleBar`, `BrailleScatter`) render by `series` id.
- `BrailleChart` owns domains, scales, ticks, and legend metadata.

## Component intent

- `BrailleChart`: owns data, series registry, grid size, shared frame.
- `BrailleFunction`: samples a continuous function in world space, then rasterizes it.
- `BrailleLine`: shows trend/continuity.
- `BrailleBar`: shows magnitude comparison.
- `BrailleScatter`: shows individual points/correlation.
- `BrailleGrid`: adds reference lines for easier spatial reading.
- `BrailleAxis`: explains scale.
- `BrailleLegend`: explains series identity.
- `BrailleTooltip`: placeholder for precision recovery.

## Examples

See `examples/function-chart.tsx`.

Run demo app:

```bash
pnpm install
pnpm dev
```

## Development

```bash
pnpm install
pnpm typecheck
pnpm build
```
