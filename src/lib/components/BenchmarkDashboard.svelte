<script lang="ts">
	import CostPanel from '$lib/components/CostPanel.svelte';
	import LeaderboardPanel from '$lib/components/LeaderboardPanel.svelte';
	import MobileLeaderboard from '$lib/components/MobileLeaderboard.svelte';
	import {
		buildForestPlot,
		getModelResults,
		sortModels,
		type ScaleMode,
		type SortMode,
		type View
	} from '$lib/dashboard';

	interface Props {
		title: string;
		description: string;
		view: Extract<View, 'overview' | 'dataset'>;
		datasetName?: string;
		showIntro?: boolean;
	}

	let { title, description, view, datasetName, showIntro = true }: Props = $props();
	let sortMode = $state<SortMode>('delta');
	let scaleMode = $state<ScaleMode>('log');

	let models = $derived(getModelResults(datasetName));
	let sortedModels = $derived(sortModels(models, sortMode));
	let forestPlot = $derived(buildForestPlot(sortedModels));
</script>

{#if showIntro}
	<section aria-labelledby="overview-title">
		<h1 id="overview-title">{title}</h1>
		<p class="lede">{description}</p>
	</section>
{/if}

<LeaderboardPanel
	plot={forestPlot}
	{sortMode}
	{view}
	onSort={(nextMode) => (sortMode = nextMode)}
/>
<MobileLeaderboard
	rows={forestPlot.rows}
	{sortMode}
	{view}
	onSort={(nextMode) => (sortMode = nextMode)}
/>
<CostPanel
	{models}
	{scaleMode}
	{view}
	onScale={(nextMode) => (scaleMode = nextMode)}
/>

<style>
	section {
		h1 {
			margin: 0 0 8px;
			font-family: 'Newsreader', ui-serif, Georgia, serif;
			font-size: 30px;
			font-weight: 600;
			letter-spacing: 0;
			line-height: 1.12;
		}

		.lede {
			max-inline-size: 62ch;
			margin: 0 0 26px;
			color: var(--ink-soft);
			font-size: 14.5px;
			line-height: 1.55;
		}
	}
</style>
