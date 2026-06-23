<script lang="ts">
	import type { SortMode } from "$lib/dashboard";

	interface Props {
		sortMode: SortMode;
		onSort: (sortMode: SortMode) => void;
		compact?: boolean;
	}

	let { sortMode, onSort, compact = false }: Props = $props();

	function handleSortChange(event: Event): void {
		const value =
			event.currentTarget instanceof HTMLSelectElement
				? event.currentTarget.value
				: sortMode;

		if (value === "delta" || value === "cost") {
			onSort(value);
		}
	}
</script>

<label class={{ "control-row": true, compact }}>
	<span>Sort by</span>
	<select
		value={sortMode}
		onchange={handleSortChange}
		aria-label="Sort leaderboard"
		name="sort-leaderboard"
	>
		<option value="delta">Δ ICC</option>
		<option value="cost">Cost</option>
	</select>
</label>

<style>
	.control-row {
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 9px;
		margin-block-end: 26px;
		inline-size: fit-content;
		margin-inline-start: auto;

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
</style>
