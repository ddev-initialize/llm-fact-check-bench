<script lang="ts">
	import { resolve } from "$app/paths";
	import favicon from "$lib/assets/favicon.svg";
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="site-header">
	<nav aria-label="Main navigation" class="site-nav">
		<a class="brand" href={resolve("/")}>LLM Fact-Check Bench</a>
		<a href={resolve("/methodology")}>Methodology</a>
	</nav>
</header>

{@render children()}

<style>
	:global(:root) {
		color-scheme: light dark;
		--background: light-dark(#fbfaf7, #111315);
		--surface: light-dark(#ffffff, #171a1f);
		--surface-muted: light-dark(#f1efea, #20242b);
		--text: light-dark(#1c1c1a, #f3f1ec);
		--muted: light-dark(#62625c, #b9b6ad);
		--border: light-dark(#ddd8ce, #353941);
		--accent: light-dark(#225ea8, #8bbcff);
		--accent-strong: light-dark(#143f72, #b8d6ff);
		--success: light-dark(#16713a, #71d894);
		font-family:
			Inter,
			ui-sans-serif,
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			"Segoe UI",
			sans-serif;
		line-height: 1.5;
		background: var(--background);
		color: var(--text);
		scrollbar-gutter: stable;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		background: var(--background);
		color: var(--text);
	}

	:global(a) {
		color: var(--accent);
		text-underline-offset: 0.18em;
	}

	:global(a:hover) {
		color: var(--accent-strong);
	}

	:global(:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
	}

	.site-header {
		border-block-end: 1px solid var(--border);
		background: color-mix(in srgb, var(--background) 88%, transparent);
	}

	.site-nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1.25rem;
		inline-size: min(100% - 2rem, 72rem);
		margin-inline: auto;
		padding-block: 0.85rem;

		.brand {
			margin-inline-end: auto;
			color: var(--text);
			font-weight: 700;
			text-decoration: none;
		}
	}
</style>
