<script lang="ts">
	import {
		buildCostTableRows,
		costPosition,
		formatDelta,
		toPercent,
		Y_MAX,
		type ModelResult,
		type ScaleMode,
		type Tick,
		type View
	} from '$lib/dashboard';

	interface Props {
		models: ModelResult[];
		scaleMode: ScaleMode;
		view: View;
		xTicks: Tick[];
		yTicks: Tick[];
		onScale: (scaleMode: ScaleMode) => void;
	}

	let { models, scaleMode, view, xTicks, yTicks, onScale }: Props = $props();
	let tableRows = $derived(buildCostTableRows(models));
</script>

<section class="panel" aria-labelledby="cost-title">
	<div class="panel-heading">
		<div>
			<h2 id="cost-title">Performance vs. cost</h2>
			<p>
				Δ ICC against cost per 100 fact-checks{view === 'dataset'
					? ' for this dataset'
					: ''}, {scaleMode} scale.
			</p>
		</div>
		<div class="segmented" aria-label="Cost scale">
			<button
				type="button"
				class={{ active: scaleMode === 'log' }}
				aria-pressed={scaleMode === 'log'}
				onclick={() => onScale('log')}
			>
				Log
			</button>
			<button
				type="button"
				class={{ active: scaleMode === 'linear' }}
				aria-pressed={scaleMode === 'linear'}
				onclick={() => onScale('linear')}
			>
				Linear
			</button>
		</div>
	</div>

	<div class="scatter-wrap">
		<div class="y-label">Δ ICC</div>
		<div>
			<div class="scatter-plot">
				{#each yTicks as tick (tick.value)}
					<span class="y-tick" style:--bottom={tick.bottom}>{tick.label}</span>
				{/each}
				{#each models as model (model.name)}
					<span
						class={{ 'scatter-point': true, muted: model.low < 0 }}
						style:--left={toPercent(costPosition(model.cost, scaleMode))}
						style:--bottom={toPercent(model.delta / Y_MAX)}
						title={`${model.name}: ${formatDelta(model.delta)} at $${model.cost.toFixed(2)}`}
					></span>
				{/each}
				{#each xTicks as tick (tick.value)}
					<span class="x-tick" style:--left={tick.left}>{tick.label}</span>
				{/each}
			</div>
			<div class="x-label">$ per 100 fact-checks · {scaleMode} scale</div>
		</div>
	</div>

	<div class="cost-table-wrap" role="region" aria-label="Mobile performance and cost table">
		<table class="cost-table">
			<caption>
				Performance and cost per 100 fact-checks
			</caption>
			<thead>
				<tr>
					<th scope="col">Model</th>
					<th scope="col">Δ ICC</th>
					<th scope="col">95% CI</th>
					<th scope="col">Cost</th>
				</tr>
			</thead>
			<tbody>
				{#each tableRows as row (row.name)}
					<tr>
						<th scope="row">{row.name}</th>
						<td>{row.delta}</td>
						<td>{row.interval}</td>
						<td>{row.cost}</td>
					</tr>
				{/each}
			</tbody>
		</table>
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
		margin-block-end: 20px;

		h2 {
			margin: 0;
			font-family: 'Newsreader', ui-serif, Georgia, serif;
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

	.segmented {
		display: inline-flex;
		gap: 2px;
		padding: 3px;
		border-radius: 9px;
		background: var(--line-soft);

		button {
			border: 0;
			border-radius: 7px;
			background: transparent;
			color: var(--muted);
			padding: 4px 12px;
			font-family: 'IBM Plex Mono', ui-monospace, monospace;
			font-size: 11px;
			letter-spacing: 0.04em;

			&.active {
				background: var(--panel);
				box-shadow: 0 1px 2px var(--shadow-color);
				color: var(--ink);
			}
		}
	}

	.scatter-wrap {
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr);
		gap: 12px;
	}

	.y-label {
		align-self: center;
		color: var(--muted);
		font-family: 'IBM Plex Mono', ui-monospace, monospace;
		font-size: 11px;
		text-align: center;
		writing-mode: vertical-rl;
		transform: rotate(180deg);
	}

	.scatter-plot {
		position: relative;
		block-size: 300px;
		margin-block-end: 26px;
		border-block-end: 1.5px solid var(--line);
		border-inline-start: 1.5px solid var(--line);
	}

	.y-tick,
	.x-tick {
		position: absolute;
		color: var(--muted);
		font-family: 'IBM Plex Mono', ui-monospace, monospace;
		font-size: 10px;
	}

	.y-tick {
		inset-block-end: var(--bottom);
		inset-inline-start: -32px;
		transform: translateY(50%);
	}

	.x-tick {
		inset-block-end: -20px;
		inset-inline-start: var(--left);
		transform: translateX(-50%);
	}

	.scatter-point {
		position: absolute;
		inset-inline-start: var(--left);
		inset-block-end: var(--bottom);
		inline-size: 13px;
		block-size: 13px;
		border-radius: 50%;
		background: var(--accent);
		opacity: 0.9;
		transform: translate(-50%, 50%);

		&.muted {
			background: var(--dot-muted);
		}
	}

	.x-label {
		color: var(--muted);
		font-family: 'IBM Plex Mono', ui-monospace, monospace;
		font-size: 11px;
		text-align: center;
	}

	.cost-table-wrap {
		display: none;
		overflow: auto;
		scrollbar-gutter: stable;
	}

	.cost-table {
		inline-size: 100%;
		border-collapse: collapse;
		font-size: 12px;

		caption {
			position: absolute;
			inline-size: 1px;
			block-size: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}

		th,
		td {
			padding: 12px 8px;
			border-block-end: 1px solid var(--line-soft);
			font-family: 'IBM Plex Mono', ui-monospace, monospace;
			text-align: end;
			white-space: nowrap;
		}

		th:first-child,
		td:first-child {
			text-align: start;
		}

		thead th {
			color: var(--muted);
			font-size: 10px;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}

		tbody th {
			color: var(--ink);
			font-weight: 500;
			white-space: normal;
		}

		td {
			color: var(--ink-soft);
		}
	}

	@media (max-width: 768px) {
		.panel {
			padding: 22px 20px;
		}

		.panel-heading {
			align-items: flex-start;
			flex-direction: column;
		}

		.segmented,
		.scatter-wrap {
			display: none;
		}

		.cost-table-wrap {
			display: block;
		}
	}
</style>
