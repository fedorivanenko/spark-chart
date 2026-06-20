import {
	BrailleAxis,
	BrailleBar,
	BrailleChart,
	BrailleFunction,
	BrailleGrid,
	BrailleLegend,
	BrailleLine,
	BrailleScatter,
} from "braille-charts";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import "braille-charts/styles.css";
import "./styles.css";

const revenue = [
	{ month: "Jan", mrr: 18, target: 24 },
	{ month: "Feb", mrr: 28, target: 30 },
	{ month: "Mar", mrr: 24, target: 34 },
	{ month: "Apr", mrr: 40, target: 38 },
	{ month: "May", mrr: 52, target: 44 },
	{ month: "Jun", mrr: 49, target: 50 },
];

const signups = [
	{ channel: "Organic", count: 32 },
	{ channel: "Ads", count: 18 },
	{ channel: "Social", count: 24 },
	{ channel: "Referral", count: 12 },
];

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
	const scatterCenter = 9 + viewportOffset * 2;
	const scatterYCenter = 3.5 + yOffset;
	const functionXDomain: [number, number] = [
		functionCenter - Math.PI * 2 * viewportScale,
		functionCenter + Math.PI * 2 * viewportScale,
	];
	const lineYCenter = 28 + yOffset * 8;
	const lineYDomain: [number, number] = [
		lineYCenter - 28 * yScale,
		lineYCenter + 28 * yScale,
	];
	const barYDomain: [number, number] = [
		Math.max(0, yOffset * 6),
		Math.max(1, yOffset * 6 + 36 * yScale),
	];
	const scatterXDomain: [number, number] = [
		scatterCenter - 9 * viewportScale,
		scatterCenter + 9 * viewportScale,
	];
	const scatterYDomain: [number, number] = [
		scatterYCenter - 3.5 * yScale,
		scatterYCenter + 3.5 * yScale,
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
						data={[]}
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

				<DemoCard title="Line: trend / continuity">
					<BrailleChart
						data={revenue}
						resolution={{ columns: 48, rows: 10 }}
						viewport={{ y: lineYDomain }}
						x="month"
					>
						<BrailleGrid />
						<BrailleLine
							color="#98c379"
							label="Monthly recurring revenue trend"
							x="month"
							y="mrr"
						/>
						<BrailleLine
							color="#e06c75"
							label="Monthly recurring revenue target trend"
							x="month"
							y="target"
						/>
						<BrailleAxis axis="x" label="Month" />
						<BrailleAxis axis="y" label="MRR" />
						<BrailleLegend
							items={[
								{ id: "mrr", color: "#98c379", label: "MRR", marker: "⠿" },
								{
									id: "target",
									color: "#e06c75",
									label: "Target",
									marker: "⠿",
								},
							]}
						/>
					</BrailleChart>
				</DemoCard>

				<DemoCard title="Bar: magnitude comparison">
					<BrailleChart
						data={signups}
						resolution={{ columns: 36, rows: 10 }}
						viewport={{ y: barYDomain }}
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
				</DemoCard>

				<DemoCard title="Scatter: points / correlation">
					<BrailleChart
						data={sessions}
						x="duration"
						y="conversions"
						resolution={{ columns: 44, rows: 10 }}
						viewport={{ x: scatterXDomain, y: scatterYDomain }}
					>
						<BrailleGrid />
						<BrailleScatter
							color="#61afef"
							label="Session duration and conversions correlation"
							x="duration"
							y="conversions"
						/>
						<BrailleAxis axis="x" label="Duration, minutes" />
						<BrailleAxis axis="y" label="Conversions" />
						<BrailleLegend items={[{ id: "sessions", label: "Sessions" }]} />
					</BrailleChart>
				</DemoCard>
			</div>
		</main>
	);
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
