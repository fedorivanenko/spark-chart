import {
	BrailleChart,
	BrailleFunction,
	BrailleLegend,
	BraillePolygon,
	BrailleRuler,
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
						resolution={{ columns: 80, rows: 40 }}
						viewport={{ x: functionXDomain, y: functionYDomain }}
					>
						<BraillePolygon
							color="#c678dd"
							data={[
								{ x: -Math.PI, y: -0.8 },
								{ x: -Math.PI / 2, y: 0.9 },
								{ x: Math.PI / 2, y: 0.15 },
								{ x: Math.PI, y: -0.7 },
							]}
							label="Sample polygon"
						/>
						<BrailleFunction
							color="#61afef"
							label="Sine wave"
							y={(x) => Math.sin(x)}
						/>
						<BrailleRuler axis="x" edge="bottom" every={10} label="X" />
						<BrailleRuler axis="y" edge="left" every={1} label="Y" />
						<BrailleLegend
							items={[
								{ id: "polygon", color: "#c678dd", label: "polygon" },
								{ id: "sin", color: "#61afef", label: "sin(x)" },
							]}
						/>
					</BrailleChart>
				</DemoCard>

				<DemoCard title="Categorical: sticky rulers">
					<BrailleChart
						resolution={{ columns: 80, rows: 40 }}
						xDomain={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
						yDomain={[0, 100]}
					>
						<BraillePolygon
							color="#c678dd"
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
							items={[{ id: "shape", color: "#c678dd", label: "categorical" }]}
						/>
					</BrailleChart>
				</DemoCard>
			</div>
		</main>
	);
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
