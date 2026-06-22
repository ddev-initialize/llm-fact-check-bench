<script lang="ts">
	import { resolve } from '$app/paths';
	import type { View } from '$lib/dashboard';

	interface Props {
		view: View;
	}

	let { view }: Props = $props();
	let datasetsActive = $derived(view === 'datasets' || view === 'dataset');
</script>

<header class="site-header">
	<div class="header-inner">
		<div class="brand-mark" aria-hidden="true"></div>
		<a class="brand" href={resolve('/')}>
			<span>Fact-Check Leaderboard</span>
			<small>LLM vs. human agreement</small>
		</a>
		<nav class="view-tabs" aria-label="Dashboard views">
			<a
				href={resolve('/')}
				class={{ active: view === 'overview' }}
				aria-current={view === 'overview' ? 'page' : undefined}
			>
				Overview
			</a>
			<a
				href={resolve('/datasets')}
				class={{ active: datasetsActive }}
				aria-current={datasetsActive ? 'page' : undefined}
			>
				Datasets
			</a>
		</nav>
	</div>
</header>

<style>
	.site-header {
		position: sticky;
		z-index: 50;
		inset-block-start: 0;
		border-block-end: 1px solid var(--line);
		background: color-mix(in srgb, var(--bg) 85%, transparent);
		backdrop-filter: blur(14px);
	}

	.header-inner {
		inline-size: min(100%, 1080px);
		margin-inline: auto;
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 16px 28px;

		@media (max-width: 768px) {
			align-items: flex-start;
			flex-wrap: wrap;
			padding-inline: 20px;
		}
	}

	.brand-mark {
		flex: none;
		inline-size: 11px;
		block-size: 11px;
		border-radius: 3px;
		background: var(--accent);
	}

	.brand {
		display: flex;
		flex-direction: column;
		line-height: 1.18;
		color: var(--ink);
		text-decoration: none;

		span {
			font-family: 'Newsreader', ui-serif, Georgia, serif;
			font-size: 17px;
			font-weight: 600;
			letter-spacing: 0;
			white-space: nowrap;
		}

		small {
			color: var(--muted);
			font-size: 11.5px;
		}
	}

	.view-tabs {
		display: flex;
		gap: 8px;
		margin-inline-start: auto;

		a {
			border: 1px solid var(--line);
			border-radius: 9px;
			background: transparent;
			color: var(--ink-soft);
			padding: 8px 16px;
			font-size: 13px;
			text-decoration: none;
			white-space: nowrap;
			transition:
				background 0.15s ease,
				border-color 0.15s ease,
				color 0.15s ease,
				opacity 0.15s ease;

			&.active {
				border-color: var(--ink);
				background: var(--ink);
				color: var(--bg);
			}

			&:hover {
				background: var(--hover);
			}
		}

		@media (max-width: 768px) {
			inline-size: 100%;
			margin-inline-start: 0;

			a {
				flex: 1;
				text-align: center;
			}
		}
	}
</style>
