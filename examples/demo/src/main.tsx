import {
	BrailleAxis,
	BrailleChart,
	BrailleFunction,
	BrailleGrid,
	BrailleLegend,
} from "braille-charts";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import "braille-charts/styles.css";
import "./styles.css";

function DemoCard({ children, title }: PropsWithChildren<{ title: string }>) {
	return (
		<section className="demo-card">
			<h2>{title}</h2>
			{children}
		</section>
	);
}

function App() {
	const [viewportOffset, setViewportOffset] = useState(0);
	const [viewportScale, setViewportScale] = useState(1);
	const [yOffset, setYOffset] = useState(0);
	const [yScale, setYScale] = useState(1);
	const functionCenter = viewportOffset * Math.PI;
	const functionYCenter = yOffset * 0.4;
	const functionXDomain: [number, number] = [
		functionCenter - Math.PI * 2 * viewportScale,
		functionCenter + Math.PI * 2 * viewportScale,
	];
	const functionYDomain: [number, number] = [
		functionYCenter - 1.2 * yScale,
		functionYCenter + 1.2 * yScale,
	];

	return (
		<main className="demo-shell">
			<header>
				<p className="eyebrow">Braille Charts</p>
				<h1>Text-rendered chart primitives</h1>
				<fieldset className="demo-controls">
					<legend>Chart viewport controls</legend>
					<button
						onClick={() => setViewportOffset((value) => value - 0.5)}
						type="button"
					>
						Scroll left
					</button>
					<button
						disabled={viewportScale <= 0.5}
						onClick={() =>
							setViewportScale((value) => Math.max(0.5, value - 0.25))
						}
						type="button"
					>
						Zoom in
					</button>
					<span>{Math.round(viewportScale * 100)}% viewport</span>
					<button
						disabled={viewportScale >= 2}
						onClick={() =>
							setViewportScale((value) => Math.min(2, value + 0.25))
						}
						type="button"
					>
						Zoom out
					</button>
					<button
						onClick={() => setViewportOffset((value) => value + 0.5)}
						type="button"
					>
						Scroll right
					</button>
					<button
						onClick={() => setYOffset((value) => value + 0.5)}
						type="button"
					>
						Move up
					</button>
					<button
						onClick={() => setYOffset((value) => value - 0.5)}
						type="button"
					>
						Move down
					</button>
					<button
						disabled={yScale <= 0.5}
						onClick={() => setYScale((value) => Math.max(0.5, value - 0.25))}
						type="button"
					>
						Y zoom in
					</button>
					<span>{Math.round(yScale * 100)}% y</span>
					<button
						disabled={yScale >= 2}
						onClick={() => setYScale((value) => Math.min(2, value + 0.25))}
						type="button"
					>
						Y zoom out
					</button>
				</fieldset>
			</header>

			<div className="demo-grid">
				<DemoCard title="Function: screen-sampled continuity">
					<BrailleChart
						resolution={{ columns: 56, rows: 12 }}
						viewport={{ x: functionXDomain, y: functionYDomain }}
						xTickPeriod={Math.PI}
						yTickPeriod={0.5}
					>
						<BrailleGrid />
						<BrailleFunction
							color="#61afef"
							label="Sine wave"
							y={(x) => Math.sin(x)}
						/>
						<BrailleAxis axis="x" label="x" />
						<BrailleAxis axis="y" label="sin(x)" />
						<BrailleLegend
							items={[{ id: "sin", color: "#61afef", label: "sin(x)" }]}
						/>
					</BrailleChart>
				</DemoCard>
			</div>
		</main>
	);
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
