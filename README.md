# Braille Charts

Small shadcn-style React chart primitives rendered with braille text glyphs.

```tsx
import {
	BrailleAxis,
	BrailleChart,
	BrailleFunction,
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
			x="month"
			y="revenue"
			yTickPeriod={10}
		>
			<BrailleGrid />
			<BrailleLine x="month" y="revenue" />
			<BrailleAxis axis="x" label="Month" />
			<BrailleLegend items={[{ id: "revenue", label: "Revenue" }]} />
		</BrailleChart>
	);
}
```

## Component intent

- `BrailleChart`: owns data, grid size, shared frame.
- `BrailleFunction`: samples a continuous function in world space, then rasterizes it.
- `BrailleLine`: shows trend/continuity.
- `BrailleBar`: shows magnitude comparison.
- `BrailleScatter`: shows individual points/correlation.
- `BrailleGrid`: adds reference lines for easier spatial reading.
- `BrailleAxis`: explains scale.
- `BrailleLegend`: explains series identity.
- `BrailleTooltip`: placeholder for precision recovery.

## Examples

See `examples/`:

- `examples/function-chart.tsx`
- `examples/line-chart.tsx`
- `examples/bar-chart.tsx`
- `examples/scatter-chart.tsx`

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
