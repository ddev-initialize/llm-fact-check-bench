<script lang="ts">
	import { resolve } from "$app/paths";
	import {
		benchmarkRows,
		chartGeometry,
		formatDelta,
		formatHeterogeneity,
		formatStandardError,
	} from "$lib/benchmark";
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
						Higher values indicate more agreement with professional
						fact-checkers relative to agreement among humans.
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
			<figcaption>
				Points show model estimates; horizontal bars show 95% confidence
				intervals. Green points have intervals fully above zero.
			</figcaption>
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
			inline-size: min(100% - 1rem, 72rem);
			padding-block-start: 1.5rem;
		}

		.chart-scroll,
		.table-scroll {
			margin-inline: -0.5rem;
			border-inline: 0;
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
