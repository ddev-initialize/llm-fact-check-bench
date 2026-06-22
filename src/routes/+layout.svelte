<script lang="ts">
	import { page } from '$app/state';
	import DashboardHeader from '$lib/components/DashboardHeader.svelte';
	import type { View } from '$lib/dashboard';
	import favicon from '$lib/assets/favicon.svg';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
	let view = $derived.by<View>(() => {
		if (page.route.id === '/datasets/[slug]') {
			return 'dataset';
		}

		if (page.route.id === '/datasets') {
			return 'datasets';
		}

		return 'overview';
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="dashboard-shell">
	<DashboardHeader {view} />

	<main class="page-content">
		{@render children()}
	</main>
</div>

<style>
	:global(:root) {
		color-scheme: light dark;
		--bg: #fbfbf9;
		--panel: #ffffff;
		--panel-subtle: #f7f8f4;
		--ink: #15201b;
		--ink-soft: #586057;
		--muted: #8a938a;
		--line: #e6e7e1;
		--line-soft: #eceee8;
		--accent: #1e7a52;
		--accent-soft: #cfe8dc;
		--ci: #c6cbc2;
		--dot-muted: #b4bbb0;
		--hover: #f1f3ee;
		--shadow-color: rgba(21, 32, 27, 0.04);
		--shadow-color-tight: rgba(21, 32, 27, 0.03);
		font-family: 'IBM Plex Sans', system-ui, sans-serif;
		background: var(--bg);
		color: var(--ink);
		scrollbar-gutter: stable;
		accent-color: var(--accent);
	}

	@media (prefers-color-scheme: dark) {
		:global(:root) {
			--bg: #101411;
			--panel: #171d19;
			--panel-subtle: #121713;
			--ink: #f0f4ed;
			--ink-soft: #b9c4bb;
			--muted: #879488;
			--line: #2b342d;
			--line-soft: #222a24;
			--accent: #73d39b;
			--accent-soft: rgba(115, 211, 155, 0.18);
			--ci: #647167;
			--dot-muted: #7e887e;
			--hover: #202820;
			--shadow-color: rgba(0, 0, 0, 0.28);
			--shadow-color-tight: rgba(0, 0, 0, 0.2);
		}
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		background: var(--bg);
		color: var(--ink);
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}

	:global(::selection) {
		background: var(--accent-soft);
	}

	:global(button),
	:global(input) {
		font: inherit;
	}

	:global(button) {
		cursor: pointer;
	}

	:global(:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	.dashboard-shell {
		min-block-size: 100dvh;
	}

	.page-content {
		inline-size: min(100%, 1080px);
		margin-inline: auto;
		padding: 44px 28px 110px;

		@media (max-width: 768px) {
			padding-inline: 20px;
		}
	}
</style>
