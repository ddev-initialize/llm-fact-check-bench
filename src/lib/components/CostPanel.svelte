<script lang="ts">
	import { MediaQuery } from 'svelte/reactivity';
	import {
		buildCostPlot,
		buildCostTableRows,
		type ModelResult,
		type ScaleMode,
		type View
	} from '$lib/dashboard';

	interface Props {
		models: ModelResult[];
		scaleMode: ScaleMode;
		view: Extract<View, 'overview' | 'dataset'>;
		onScale: (scaleMode: ScaleMode) => void;
	}

	let { models, scaleMode, view, onScale }: Props = $props();
	const isMobile = new MediaQuery('max-width: 768px', false);

	let plot = $derived(buildCostPlot(models, scaleMode));
	let tableRows = $derived(buildCostTableRows(models));

	function handleScaleChange(event: Event): void {
		const value =
			event.currentTarget instanceof HTMLSelectElement
				? event.currentTarget.value
				: scaleMode;

		if (value === 'log' || value === 'linear') {
			onScale(value);
		}
	}
</script>

<section class="panel cost-panel" aria-labelledby="cost-title">
	<div class="panel-heading">
		<div>
			<h2 id="cost-title">Cost</h2>
			<p>
				{#if isMobile.current}
					Ranked cost and performance summary{view === 'dataset' ? ' for this dataset' : ''}.
				{:else}
					Δ ICC against cost per 100 fact-checks{view === 'dataset' ? ' for this dataset' : ''},
					{scaleMode} scale.
				{/if}
			</p>
		</div>

		{#if !isMobile.current}
			<label class="scale-control">
				<span>Scale</span>
				<select
					value={scaleMode}
					onchange={handleScaleChange}
					aria-label="Cost chart scale"
					name="cost-scale"
				>
					<option value="log">Log</option>
					<option value="linear">Linear</option>
				</select>
			</label>
		{/if}
	</div>

	{#if tableRows.length === 0}
		<p class="empty">No cost estimates available.</p>
	{:else if isMobile.current}
		<div class="cost-table-wrap">
			<table class="cost-table">
				<thead>
					<tr>
						<th>Model</th>
						<th>Cost</th>
						<th>Δ ICC</th>
					</tr>
				</thead>
				<tbody>
					{#each tableRows as row (row.name)}
						<tr>
							<th scope="row">{row.name}</th>
							<td class="cost-value">{row.cost}</td>
							<td>
								<span class={{ 'delta-value': true, significant: row.significantOverZero }}>
									{row.delta}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="scatter" role="img" aria-label="Cost per 100 fact-checks plotted against ICC delta">
			<div class="y-title">Δ ICC</div>
			<div class="plot-shell">
				<div class="plot-row">
					<div class="y-axis" aria-hidden="true">
						{#each plot.yTicks as tick (tick.value)}
							<span style:--bottom={tick.bottom}>{tick.value}</span>
						{/each}
					</div>

					<div class="plot-area">
						{#each plot.yTicks as tick (tick.value)}
							<span
								class={{ 'grid-line': true, zero: tick.isZero }}
								style:--bottom={tick.bottom}
							></span>
						{/each}

						<span class="zero-rule" style:--bottom={plot.zeroBottom}></span>

						{#each plot.points as point (point.name)}
							<span
								class={{ point: true, muted: point.muted }}
								style:--left={point.left}
								style:--bottom={point.bottom}
								aria-hidden="true"
							>
								<span class="tooltip">
									<strong>{point.name}</strong>
									<small>{point.deltaLabel} · {point.costLabel}</small>
								</span>
							</span>
						{/each}
					</div>
				</div>

				<div class="x-axis-row" aria-hidden="true">
					<div></div>
					<div class="x-axis">
						{#each plot.xTicks as tick (tick.value)}
							<span style:--left={tick.left}>{tick.value}</span>
						{/each}
					</div>
				</div>

				<div class="x-title">$ per 100 fact-checks</div>
			</div>
		</div>
	{/if}
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
		gap: 16px;
		margin-block-end: 22px;

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

	.scale-control {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 9px;
		inline-size: fit-content;
		margin-inline-start: auto;

		span {
			font-family: 'IBM Plex Mono', ui-monospace, monospace;
			font-size: 10.5px;
			letter-spacing: 0.1em;
			text-transform: uppercase;
			color: var(--muted);
		}

		select {
			border: 1px solid var(--line);
			border-radius: 8px;
			background: transparent;
			color: var(--ink-soft);
			padding: 6px 20px 6px 10px;
			font-size: 12.5px;
			color-scheme: light dark;

			&:hover {
				background: var(--hover);
			}
		}
	}

	.empty {
		margin: 0;
		color: var(--muted);
		font-size: 13px;
	}

	.scatter {
		display: grid;
		grid-template-columns: 22px minmax(0, 1fr);
		gap: 10px;
	}

	.y-title,
	.x-title {
		color: var(--muted);
		font-family: 'IBM Plex Mono', ui-monospace, monospace;
		font-size: 10.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.y-title {
		align-self: center;
		writing-mode: vertical-rl;
		transform: rotate(180deg);
	}

	.plot-shell {
		min-inline-size: 0;
	}

	.plot-row {
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr);
		gap: 12px;
	}

	.y-axis {
		position: relative;
		block-size: 260px;

		span {
			position: absolute;
			inset-block-end: var(--bottom);
			inset-inline-end: 0;
			color: var(--muted);
			font-family: 'IBM Plex Mono', ui-monospace, monospace;
			font-size: 10px;
			transform: translateY(50%);
		}
	}

	.plot-area {
		position: relative;
		block-size: 260px;
		border-inline-start: 1px solid var(--line);
		border-block-end: 1px solid var(--line);
	}

	.grid-line,
	.zero-rule {
		position: absolute;
		inset-inline: 0;
		inset-block-end: var(--bottom);
		border-block-start: 1px solid var(--line-soft);
		pointer-events: none;
	}

	.grid-line.zero,
	.zero-rule {
		border-block-start-color: var(--ci);
	}

	.zero-rule {
		display: none;
	}

	.point {
		position: absolute;
		z-index: 2;
		inset-inline-start: var(--left);
		inset-block-end: var(--bottom);
		inline-size: 12px;
		block-size: 12px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 3px var(--accent-soft);
		transform: translate(-50%, 50%);

		&.muted {
			background: var(--dot-muted);
			box-shadow: 0 0 0 3px var(--line-soft);
		}

		.tooltip {
			position: absolute;
			inset-inline-start: 50%;
			inset-block-end: calc(100% + 12px);
			display: grid;
			gap: 2px;
			inline-size: max-content;
			max-inline-size: 150px;
			padding: 7px 9px;
			border: 1px solid var(--line);
			border-radius: 8px;
			background: color-mix(in srgb, var(--panel) 94%, var(--bg));
			box-shadow:
				0 1px 2px var(--shadow-color-tight),
				0 10px 24px var(--shadow-color);
			overflow-wrap: anywhere;
			pointer-events: none;
			transform: translateX(-50%);
			opacity: 0;
			transition: opacity 120ms ease;
		}

		strong {
			color: var(--ink);
			font-size: 11.5px;
			font-weight: 500;
			text-align: center;
		}

		small {
			color: var(--muted);
			font-family: 'IBM Plex Mono', ui-monospace, monospace;
			font-size: 9.5px;
			text-align: center;
		}

		&:hover,
		&:focus-visible {
			z-index: 3;

			.tooltip {
				opacity: 1;
			}
		}
	}

	.x-axis-row {
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr);
		gap: 12px;
		margin-block-start: 8px;
	}

	.x-axis {
		position: relative;
		block-size: 16px;

		span {
			position: absolute;
			inset-inline-start: var(--left);
			color: var(--muted);
			font-family: 'IBM Plex Mono', ui-monospace, monospace;
			font-size: 10px;
			transform: translateX(-50%);
		}
	}

	.x-title {
		margin-block-start: 12px;
		padding-inline-start: 54px;
		text-align: center;
	}

	.cost-table-wrap {
		overflow-x: auto;
	}

	.cost-table {
		inline-size: 100%;
		border-collapse: collapse;

		th,
		td {
			padding: 11px 0;
			border-block-end: 1px solid var(--line-soft);
			font-size: 12.5px;
			text-align: end;
			vertical-align: top;
			white-space: nowrap;
		}

		th:first-child,
		td:first-child {
			text-align: start;
			white-space: normal;
		}

		thead th {
			color: var(--muted);
			font-family: 'IBM Plex Mono', ui-monospace, monospace;
			font-size: 10px;
			font-weight: 500;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}

		tbody th {
			color: var(--ink);
			font-weight: 500;
		}

		tbody td {
			color: var(--ink-soft);
			font-family: 'IBM Plex Mono', ui-monospace, monospace;
		}

		.cost-value {
			color: var(--ink);
		}

		.delta-value.significant {
			color: var(--accent);
		}
	}

	@media (max-width: 768px) {
		.panel {
			padding: 22px 20px;
		}

		.panel-heading {
			align-items: flex-start;
			flex-direction: column;
			margin-block-end: 14px;
		}
	}
</style>
