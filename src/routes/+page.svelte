<script lang="ts">
	import { resolve } from "$app/paths";
	import { onMount } from "svelte";
	import {
		benchmarkRows,
		chartGeometry,
		formatDelta,
		formatHeterogeneity,
		formatStandardError,
	} from "$lib/benchmark";

	type ChartView = "simple" | "interval";

	let chartView = $state<ChartView>("simple");

	function selectChartView(view: ChartView): void {
		chartView = view;
	}

	onMount(() => {
		if (window.matchMedia("(min-width: 48rem)").matches) {
			chartView = "interval";
		}
	});
</script>

<svelte:head>
	<title>LLM Fact-Check Benchmark</title>
	<meta
		name="description"
		content="Static benchmark results comparing search-enabled LLM fact-checking agreement against professional human fact-checker agreement."
	/>
</svelte:head>

<main class="page-shell">
	<section class="hero" aria-labelledby="page-title">
		<h1 id="page-title">LLM Fact-Check Benchmark</h1>
		<p class="lede">
			A benchmark for comparing search-enabled model ratings of news
			headlines against professional fact-checker agreement. Scores are
			meta-analytic ICC differences; values above zero indicate stronger
			agreement with fact-checkers than fact-checkers have with one
			another.
		</p>
		<a class="text-link" href={resolve("/methodology")}>Read methodology</a>
	</section>

	<section class="results-section" aria-labelledby="chart-heading">
		<div class="section-heading">
			<h2 id="chart-heading">Overall Results</h2>
			<p>
				Rows are ordered by meta-analytic ICC difference. The vertical
				dashed line marks parity with inter-human agreement.
			</p>
		</div>

		<figure class="chart-figure">
			<div class="chart-view-controls">
				<div class="chart-tabs" role="group" aria-label="Chart view">
					<button
						class:active={chartView === "simple"}
						type="button"
						aria-pressed={chartView === "simple"}
						onclick={() => selectChartView("simple")}
					>
						Simple
					</button>
					<button
						class:active={chartView === "interval"}
						type="button"
						aria-pressed={chartView === "interval"}
						onclick={() => selectChartView("interval")}
					>
						Interval
					</button>
				</div>
			</div>

			<div
				id="simple-chart-panel"
				class="chart-panel"
				hidden={chartView !== "simple"}
			>
				<div class="leaderboard-chart">
					<ol
						class="leaderboard-list"
						aria-label="Simple benchmark leaderboard"
					>
						{#each benchmarkRows as row (row.model)}
							<li class="leaderboard-row">
								<span class="rank-badge">{row.rank}</span>
								<div class="leaderboard-model">
									<span class="model-name"
										>{row.displayName}</span
									>
									<span class="confidence"
										>95% CI {row.confidenceLabel}</span
									>
								</div>
								<div class="leaderboard-score">
									<span
										class={row.significantlyAboveHumans
											? "score score-strong"
											: "score"}
										>{formatDelta(row.beta_coefficient)}</span
									>
									<span class="score-detail"
										>SE {formatStandardError(row.se)}</span
									>
								</div>
								<div class="bar-track" aria-hidden="true">
									<span
										class={row.significantlyAboveHumans
											? "bar-fill bar-fill-strong"
											: "bar-fill"}
										style={`inline-size: ${row.simpleBarWidth}`}
									></span>
								</div>
							</li>
						{/each}
					</ol>
				</div>
			</div>

			<div
				id="interval-chart-panel"
				class="chart-panel"
				hidden={chartView !== "interval"}
			>
				<div
					class="chart-scroll"
					role="region"
					aria-label="Scrollable benchmark chart"
				>
					<svg
						class="benchmark-chart"
						role="img"
						aria-labelledby="chart-title chart-description"
						viewBox={`0 0 ${chartGeometry.width} ${chartGeometry.height}`}
					>
						<title id="chart-title"
							>Meta-analytic ICC difference by model</title
						>
						<desc id="chart-description">
							Horizontal interval plot of model benchmark scores.
							Higher values indicate more agreement with
							professional fact-checkers relative to agreement
							among humans.
						</desc>

						{#each chartGeometry.ticks as tick (tick.label)}
							<line
								class={tick.value === 0
									? "grid-line zero-line"
									: "grid-line"}
								x1={tick.x}
								x2={tick.x}
								y1={chartGeometry.plotTop}
								y2={chartGeometry.plotBottom}
							/>
							<text
								class="tick-label"
								x={tick.x}
								y={chartGeometry.tickLabelY}
								text-anchor="middle"
							>
								{tick.label}
							</text>
						{/each}

						{#each chartGeometry.points as point (point.row.model)}
							<line
								class="row-guide"
								x1={chartGeometry.left}
								x2={chartGeometry.width - chartGeometry.right}
								y1={point.y}
								y2={point.y}
							/>
							<text
								class="model-label"
								x={chartGeometry.left - 14}
								y={point.y + 5}
								text-anchor="end"
							>
								{point.row.displayName}
							</text>
							<line
								class="interval"
								x1={point.xLower}
								x2={point.xUpper}
								y1={point.y}
								y2={point.y}
							/>
							<line
								class="cap"
								x1={point.xLower}
								x2={point.xLower}
								y1={point.y - 7}
								y2={point.y + 7}
							/>
							<line
								class="cap"
								x1={point.xUpper}
								x2={point.xUpper}
								y1={point.y - 7}
								y2={point.y + 7}
							/>
							<circle
								class={point.row.significantlyAboveHumans
									? "estimate significant"
									: "estimate"}
								cx={point.x}
								cy={point.y}
								r="8"
							/>
						{/each}

						<text
							class="axis-label"
							x={(chartGeometry.left +
								chartGeometry.width -
								chartGeometry.right) /
								2}
							y={chartGeometry.axisLabelY}
							text-anchor="middle"
						>
							Meta-analytic ICC difference (LLM-human ICC -
							inter-human ICC)
						</text>
					</svg>
				</div>
			</div>

			{#if chartView === "simple"}
				<figcaption>
					Bars are scaled to the strongest result. Green values have
					95% confidence intervals fully above zero.
				</figcaption>
			{:else}
				<figcaption>
					Points show model estimates; horizontal bars show 95%
					confidence intervals. Green points have intervals fully
					above zero.
				</figcaption>
			{/if}
		</figure>
	</section>

	<section class="results-section" aria-labelledby="table-heading">
		<div class="section-heading">
			<h2 id="table-heading">Details</h2>
			<p>
				Static results from <code>iccSearchResults.ts</code>, sorted
				strongest to weakest.
			</p>
		</div>

		<div
			class="table-scroll"
			role="region"
			aria-label="Scrollable benchmark result table"
		>
			<table>
				<caption> Meta-analytic ICC benchmark results </caption>
				<thead>
					<tr>
						<th scope="col">Rank</th>
						<th scope="col">Model</th>
						<th scope="col">Delta ICC</th>
						<th scope="col">95% CI</th>
						<th scope="col">SE</th>
						<th scope="col">p</th>
						<th scope="col">I<sup>2</sup></th>
					</tr>
				</thead>
				<tbody>
					{#each benchmarkRows as row (row.model)}
						<tr>
							<td class="numeric">{row.rank}</td>
							<th scope="row">{row.displayName}</th>
							<td class="numeric"
								>{formatDelta(row.beta_coefficient)}</td
							>
							<td class="numeric">{row.confidenceLabel}</td>
							<td class="numeric"
								>{formatStandardError(row.se)}</td
							>
							<td class="numeric">{row.pValueLabel}</td>
							<td class="numeric"
								>{formatHeterogeneity(row.I2)}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</main>

<style>
	.page-shell {
		inline-size: min(100% - 2rem, 72rem);
		margin-inline: auto;
		padding-block: clamp(2rem, 5vw, 4rem);
	}

	.hero {
		display: grid;
		justify-items: center;
		gap: 1rem;
		max-inline-size: 58rem;
		margin-block-end: clamp(2.5rem, 5vw, 4.5rem);
		margin-inline: auto;
		text-align: center;
	}

	h1,
	h2,
	p {
		margin-block: 0;
	}

	h1 {
		max-inline-size: 24ch;
		font-size: 3rem;
		line-height: 1;
	}

	h2 {
		font-size: 1.6rem;
		line-height: 1.1;
	}

	.lede {
		max-inline-size: 62ch;
		color: var(--muted);
		font-size: 1.1rem;
	}

	.text-link {
		inline-size: fit-content;
		font-weight: 700;
	}

	.results-section {
		display: grid;
		gap: 1rem;
		min-inline-size: 0;
		margin-block-start: 2rem;
		padding-block-start: 2rem;
		border-block-start: 1px solid var(--border);
	}

	.section-heading {
		display: grid;
		gap: 0.35rem;
		max-inline-size: 72ch;

		p {
			color: var(--muted);
		}
	}

	.chart-figure {
		margin: 0;
		min-inline-size: 0;

		figcaption {
			margin-block-start: 0.75rem;
			color: var(--muted);
			font-size: 0.9rem;
		}
	}

	.chart-view-controls {
		display: flex;
		justify-content: end;
		margin-block-end: 0.75rem;
	}

	.chart-tabs {
		display: inline-flex;
		padding: 0.2rem;
		border: 1px solid var(--border);
		background: var(--surface);

		button {
			padding: 0.45rem 0.85rem;
			border: 0;
			background: transparent;
			color: var(--muted);
			font: inherit;
			font-weight: 700;
			cursor: pointer;
		}

		button.active {
			background: var(--text);
			color: var(--background);
		}

		button:focus-visible {
			outline: 2px solid var(--accent);
			outline-offset: 2px;
		}
	}

	.chart-panel[hidden] {
		display: none;
	}

	.leaderboard-chart {
		border: 1px solid var(--border);
		background: var(--surface);
	}

	.leaderboard-list {
		display: grid;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.leaderboard-row {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		gap: 0.5rem 0.85rem;
		align-items: center;
		padding: 0.9rem;
		border-block-start: 1px solid var(--border);
	}

	.leaderboard-row:first-child {
		border-block-start: 0;
	}

	.rank-badge {
		display: grid;
		place-items: center;
		inline-size: 2rem;
		block-size: 2rem;
		border: 1px solid var(--border);
		background: var(--background);
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}

	.leaderboard-model,
	.leaderboard-score {
		display: grid;
		gap: 0.1rem;
		min-inline-size: 0;
	}

	.model-name {
		overflow-wrap: anywhere;
		font-weight: 700;
	}

	.confidence,
	.score-detail {
		color: var(--muted);
		font-size: 0.82rem;
	}

	.leaderboard-score {
		justify-items: end;
		text-align: end;
	}

	.score {
		font-variant-numeric: tabular-nums;
		font-weight: 700;
	}

	.score-strong {
		color: var(--success);
	}

	.bar-track {
		grid-column: 2 / -1;
		overflow: clip;
		block-size: 0.42rem;
		background: var(--surface-muted);
	}

	.bar-fill {
		display: block;
		block-size: 100%;
		background: var(--muted);
	}

	.bar-fill-strong {
		background: var(--success);
	}

	.chart-scroll,
	.table-scroll {
		overflow: auto;
		min-inline-size: 0;
		max-inline-size: 100%;
		border: 1px solid var(--border);
		background: var(--surface);
		scrollbar-gutter: stable;
	}

	.chart-scroll {
		padding: 0.5rem;
	}

	.benchmark-chart {
		display: block;
		inline-size: 100%;
		min-inline-size: 48rem;
		block-size: auto;
		font-family: inherit;
	}

	.grid-line {
		stroke: var(--border);
		stroke-width: 1;
	}

	.zero-line {
		stroke: var(--text);
		stroke-dasharray: 4 5;
		stroke-width: 2;
	}

	.row-guide {
		stroke: var(--surface-muted);
		stroke-width: 1;
	}

	.model-label,
	.tick-label,
	.axis-label {
		fill: var(--text);
		font-size: 0.85rem;
	}

	.tick-label {
		fill: var(--muted);
	}

	.axis-label {
		font-size: 1rem;
		font-weight: 700;
	}

	.interval,
	.cap {
		stroke: var(--text);
		stroke-linecap: square;
		stroke-width: 3;
	}

	.estimate {
		fill: var(--text);
		stroke: var(--surface);
		stroke-width: 2;
	}

	.estimate.significant {
		fill: var(--success);
	}

	table {
		inline-size: 100%;
		min-inline-size: 46rem;
		border-collapse: collapse;
		font-size: 0.95rem;
	}

	caption {
		padding: 0.75rem;
		color: var(--muted);
		text-align: start;
	}

	th,
	td {
		padding: 0.75rem;
		border-block-start: 1px solid var(--border);
		text-align: start;
		vertical-align: top;
	}

	th + th,
	th + td,
	td + td {
		border-inline-start: 1px solid var(--border);
	}

	thead th {
		background: var(--surface-muted);
		font-size: 0.8rem;
		text-transform: uppercase;
	}

	tbody th {
		min-inline-size: 12rem;
		font-weight: 700;
	}

	.numeric {
		font-variant-numeric: tabular-nums;
		text-align: end;
		white-space: nowrap;
	}

	code {
		font-size: 0.92em;
	}

	@media (max-width: 42rem) {
		.page-shell {
			inline-size: min(100% - 1.25rem, 72rem);
			padding-block-start: 1.5rem;
		}
	}

	@media (min-width: 48rem) {
		h1 {
			font-size: 4.75rem;
		}

		h2 {
			font-size: 2rem;
		}
	}
</style>
