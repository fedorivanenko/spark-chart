# Braille Charts

Small React primitives rendered with braille text glyphs.

```tsx
import {
	BrailleChart,
	BrailleFunction,
	BrailleLegend,
	BraillePolygon,
	BrailleRuler,
} from "braille-charts";
import "braille-charts/styles.css";

export function Example() {
	return (
		<BrailleChart
			resolution={{ columns: 80, rows: 40 }}
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
```

## API model

- `BrailleChart`: coordinate system and raster frame. Can render JSX children or a shared terminal `layers` scene.
- `BrailleFunction`: samples a continuous function into braille glyphs.
- `BraillePolygon`: renders arbitrary polygon geometry from data plus optional `x`/`y` accessors.
- `BrailleRuler`: scale labels pinned to an edge; continuous domains use canvas spacing, categorical domains use category spacing.
- `BrailleLegend`: non-spatial series labels.

Spatial marks render into the chart raster. App/domain data can be translated explicitly before passing to marks.

Terminal-first scene API:

```ts
import { functionLayer, polygonLayer, renderBrailleChart, rulerLayer } from "braille-charts";

const text = renderBrailleChart({
	resolution: { columns: 80, rows: 40 },
	viewport: { x: [-Math.PI * 2, Math.PI * 2], y: [-1.2, 1.2] },
	layers: [
		polygonLayer({ data: points, zIndex: 0 }),
		functionLayer({ y: Math.sin, zIndex: 1 }),
		rulerLayer({ axis: "x", edge: "bottom", every: 10, label: "X" }),
	],
});
```

## Examples

See `examples/function-chart.tsx` and `examples/categorical-chart.tsx`.

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
