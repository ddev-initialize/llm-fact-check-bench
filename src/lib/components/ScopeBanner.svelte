<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Dataset } from '$lib/dashboard';

	interface Props {
		dataset: Dataset;
	}

	let { dataset }: Props = $props();
</script>

<section class="scope-banner" aria-label="Selected dataset">
	<div>
		<strong>{dataset.name}</strong>
		<span>{dataset.meta}</span>
	</div>
	<a href={resolve('/datasets')}>← All datasets</a>
</section>

<style>
	.scope-banner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;
		margin-block-end: 28px;
		padding: 18px 22px;
		border: 1px solid var(--line);
		border-inline-start: 4px solid var(--accent);
		border-radius: 14px;
		background: var(--panel);

		div {
			display: grid;
			gap: 5px;
		}

		strong {
			font-family: 'IBM Plex Mono', ui-monospace, monospace;
			font-size: 17px;
			font-weight: 500;
		}

		span {
			color: var(--muted);
			font-size: 12.5px;
		}

		a {
			margin-inline-start: auto;
			border: 1px solid var(--line);
			border-radius: 9px;
			background: transparent;
			color: var(--ink-soft);
			padding: 9px 15px;
			font-size: 12.5px;
			text-decoration: none;
			white-space: nowrap;
			transition:
				background 0.15s ease,
				border-color 0.15s ease,
				color 0.15s ease;

			&:hover {
				background: var(--hover);
			}
		}
	}

	@media (max-width: 768px) {
		.scope-banner {
			align-items: flex-start;
			flex-direction: column;

			a {
				margin-inline-start: 0;
			}
		}
	}
</style>
