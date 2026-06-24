<script lang="ts">
	import SortControls from '$lib/components/SortControls.svelte';
	import type { ForestRow, SortMode, View } from '$lib/dashboard';

	interface Props {
		rows: ForestRow[];
		sortMode: SortMode;
		view: View;
		onSort: (sortMode: SortMode) => void;
	}

	let { rows, sortMode, view, onSort }: Props = $props();
</script>

<section class="panel mobile-leaderboard" aria-labelledby="mobile-leaderboard-title">
	<div class="panel-heading">
		<div>
			<h2 id="mobile-leaderboard-title">Leaderboard</h2>
			<p>
				{view === 'dataset'
					? 'Models by agreement gain on this dataset.'
					: 'Models by agreement gain. Bar shows the point estimate.'}
			</p>
		</div>
	</div>

	<SortControls {sortMode} {onSort} compact />

	<ol class="rank-list">
		{#each rows as row, index (row.name)}
			<li>
				<span class="rank">{String(index + 1).padStart(2, '0')}</span>
				<div>
					<strong>{row.name}</strong>
					<span class="bar-track">
						<i class={{ muted: row.crossesParity }} style:--width={row.barWidth}></i>
					</span>
				</div>
				<span class="mobile-estimate">
					{row.estimate} <small>{row.interval}</small>
					<em>{row.cost}</em>
				</span>
			</li>
		{/each}
	</ol>
</section>

<style>
	.mobile-leaderboard {
		display: none;
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

	.rank-list {
		display: grid;
		margin: 0;
		padding: 0;
		list-style: none;

		li {
			display: grid;
			grid-template-columns: 24px minmax(0, 1fr) auto;
			gap: 14px;
			align-items: start;
			padding-block: 13px;
			border-block-end: 1px solid var(--line-soft);
		}

		strong {
			display: block;
			margin-block-end: 8px;
			color: var(--ink);
			font-size: 13px;
			font-weight: 500;
		}
	}

	.rank,
	.mobile-estimate {
		font-family: 'IBM Plex Mono', ui-monospace, monospace;
	}

	.rank {
		color: var(--dot-muted);
		font-size: 12px;
		text-align: end;
	}

	.bar-track {
		display: block;
		overflow: clip;
		block-size: 6px;
		border-radius: 4px;
		background: var(--line-soft);

		i {
			display: block;
			inline-size: var(--width);
			block-size: 100%;
			border-radius: inherit;
			background: var(--accent);

			&.muted {
				background: var(--dot-muted);
			}
		}
	}

	.mobile-estimate {
		display: grid;
		align-self: start;
		color: var(--ink);
		font-size: 13px;
		line-height: 1.5;
		text-align: end;

		small,
		em {
			color: var(--muted);
			font-size: 11.5px;
			font-style: normal;
		}
	}

	@media (max-width: 768px) {
		.mobile-leaderboard {
			display: block;
			padding: 22px 20px;
		}

		.panel-heading {
			align-items: flex-start;
			flex-direction: column;
		}

		.rank-list li:first-child {
			border-block-start: 1px solid var(--line-soft);
		}
	}
</style>
