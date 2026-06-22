<script lang="ts">
	import type { SortMode } from "$lib/dashboard";

	interface Props {
		sortMode: SortMode;
		onSort: (sortMode: SortMode) => void;
		compact?: boolean;
	}

	let { sortMode, onSort, compact = false }: Props = $props();
</script>

<div class={{ "control-row": true, compact }} aria-label="Sort leaderboard">
	<span>Sort by</span>
	<button
		type="button"
		class={{ active: sortMode === "delta" }}
		aria-pressed={sortMode === "delta"}
		onclick={() => onSort("delta")}
	>
		Δ ICC
	</button>
	<button
		type="button"
		class={{ active: sortMode === "cost" }}
		aria-pressed={sortMode === "cost"}
		onclick={() => onSort("cost")}
	>
		Cost
	</button>
</div>

<style>
	.control-row {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 9px;
		margin-block-end: 26px;

		&.compact {
			margin-block: -4px 20px;
		}

		span {
			font-family: "IBM Plex Mono", ui-monospace, monospace;
			font-size: 10.5px;
			letter-spacing: 0.1em;
			text-transform: uppercase;
			color: var(--muted);
		}

		button {
			border: 1px solid var(--line);
			border-radius: 20px;
			background: transparent;
			color: var(--ink-soft);
			padding: 7px 15px;
			font-size: 12.5px;
			transition:
				background 0.15s ease,
				border-color 0.15s ease,
				color 0.15s ease;

			&.active {
				border-color: var(--ink);
				background: var(--ink);
				color: var(--bg);

				&:hover {
					background: var(--ink);
				}
			}

			&:hover:not(.active) {
				background: var(--hover);
			}
		}
	}
</style>
