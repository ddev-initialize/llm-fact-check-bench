<script lang="ts">
	import SortControls from "$lib/components/SortControls.svelte";
	import type { ForestPlot, SortMode, View } from "$lib/dashboard";

	interface Props {
		plot: ForestPlot;
		sortMode: SortMode;
		view: View;
		onSort: (sortMode: SortMode) => void;
	}

	let { plot, sortMode, view, onSort }: Props = $props();
</script>

<section class="panel leaderboard-panel" aria-labelledby="leaderboard-title">
	<div class="panel-heading">
		<div>
			<h2 id="leaderboard-title">Leaderboard</h2>
			<p>
				{view === "dataset"
					? "Models by agreement gain on this dataset."
					: "Each model's ICC difference (LLM − human). Right of parity means it agrees with fact-checkers more than they agree with each other."}
			</p>
		</div>
	</div>

	<div class="chart-toolbar">
		<div class="legend" aria-hidden="true">
			<span><i class="legend-dot"></i> Meta-analytic Δ</span>
			<span><i class="legend-line"></i> Parity (Δ = 0)</span>
		</div>
		<SortControls {sortMode} {onSort} compact />
	</div>

	<div class="chart-label" aria-hidden="true">
		<div></div>
		<div></div>
		<div class="estimate-label">
			<span>Δ ICC</span>
			<span>95% CI</span>
		</div>
	</div>

	<div class="forest-chart">
		<div class="parity-grid" aria-hidden="true">
			<div></div>
			<div class="parity-track">
				<span
					class="parity-line"
					style:--left={plot.parityLeft}
				></span>
			</div>
			<div></div>
		</div>
		{#each plot.rows as row (row.name)}
			<div class="forest-row">
				<div class="model-name">{row.name}</div>
				<div class="interval-track">
					<span
						class="ci-line"
						style:--left={row.ciLeft}
						style:--width={row.ciWidth}
					></span>
					<span class="ci-cap" style:--left={row.ciLeft}></span>
					<span
						class="ci-cap"
						style:--left={`calc(${row.ciLeft} + ${row.ciWidth})`}
					></span>
					<span
						class={{ point: true, hollow: row.crossesParity }}
						style:--left={row.pointLeft}
					></span>
				</div>
				<div class="estimate">
					<span>{row.estimate}</span>
					<span>{row.interval}</span>
				</div>
			</div>
		{/each}
	</div>

	<div class="axis-row" aria-hidden="true">
		<div></div>
		<div class="axis-ticks">
			{#each plot.ticks as tick (tick.value)}
				<span style:--left={tick.left}>{tick.value}</span>
			{/each}
		</div>
		<div></div>
	</div>
</section>

<style>
	.panel {
		margin-block-start: 24px;
		padding: 26px 28px;
		border: 1px solid var(--line);
		border-radius: 16px;
		background: var(--panel);
		box-shadow:
			0 1px 2px var(--shadow-color-tight),
			0 10px 30px var(--shadow-color);
	}

	.panel-heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-block-end: 12px;

		h2 {
			margin: 0;
			font-family: "Newsreader", ui-serif, Georgia, serif;
			font-size: 20px;
			font-weight: 600;
			letter-spacing: 0;
			line-height: 1.15;
		}

		p {
			margin: 7px 0 0;
			color: var(--ink-soft);
			font-size: 13px;
			line-height: 1.5;
		}
	}

	.chart-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		margin-block: 8px 18px;

		:global(.control-row) {
			margin-block: 0;
		}
	}

	.chart-label,
	.forest-row,
	.axis-row {
		display: grid;
		grid-template-columns: 158px minmax(0, 1fr) 154px;
		gap: 16px;
	}

	.chart-label {
		margin-block-end: 6px;
		color: var(--muted);
		font-family: "IBM Plex Mono", ui-monospace, monospace;
		font-size: 10.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.estimate-label,
	.estimate {
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr);
		gap: 10px;
		text-align: end;
	}

	.estimate-label span,
	.estimate span {
		white-space: nowrap;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		color: var(--ink-soft);
		font-size: 12px;

		span {
			display: inline-flex;
			align-items: center;
			gap: 8px;
		}
	}

	.legend-dot {
		inline-size: 11px;
		block-size: 11px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 3px var(--accent-soft);
	}

	.legend-line {
		inline-size: 0;
		block-size: 13px;
		border-inline-start: 1.5px dotted var(--ci);
	}

	.forest-chart {
		position: relative;
	}

	.parity-grid {
		position: absolute;
		inset-block: 0;
		inset-inline: 0;
		display: grid;
		grid-template-columns: 158px minmax(0, 1fr) 154px;
		gap: 16px;
		pointer-events: none;
	}

	.parity-track {
		position: relative;
	}

	.parity-line {
		position: absolute;
		inset-block: 0;
		inset-inline-start: var(--left);
		border-inline-start: 1.5px dotted var(--ci);
	}

	.forest-row {
		align-items: center;
		padding-block: 11px;
	}

	.model-name {
		min-inline-size: 0;
		overflow-wrap: anywhere;
		color: var(--ink);
		font-size: 13px;
		font-weight: 500;
	}

	.interval-track {
		position: relative;
		block-size: 24px;
	}

	.ci-line,
	.ci-cap,
	.point {
		position: absolute;
		inset-block-start: 50%;
		transform: translate(-50%, -50%);
	}

	.ci-line {
		inset-inline-start: var(--left);
		inline-size: var(--width);
		block-size: 1.5px;
		background: var(--ci);
		transform: translateY(-50%);
	}

	.ci-cap {
		inset-inline-start: var(--left);
		inline-size: 1.5px;
		block-size: 8px;
		background: var(--ci);
	}

	.point {
		z-index: 2;
		inset-inline-start: var(--left);
		inline-size: 12px;
		block-size: 12px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 3px var(--accent-soft);

		&.hollow {
			border: 2px solid var(--accent);
			background: var(--panel);
			box-shadow: none;
		}
	}

	.estimate {
		color: var(--ink);
		font-family: "IBM Plex Mono", ui-monospace, monospace;
		font-size: 12px;

		span {
			color: var(--muted);
		}

		span:first-child {
			color: var(--ink);
		}
	}

	.axis-row {
		margin-block-start: 8px;
	}

	.axis-ticks {
		position: relative;
		block-size: 16px;

		span {
			position: absolute;
			inset-inline-start: var(--left);
			color: var(--muted);
			font-family: "IBM Plex Mono", ui-monospace, monospace;
			font-size: 10px;
			transform: translateX(-50%);
		}
	}

	@media (max-width: 768px) {
		.leaderboard-panel {
			display: none;
		}
	}
</style>
