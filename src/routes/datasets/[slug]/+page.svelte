<script lang="ts">
	import BenchmarkDashboard from '$lib/components/BenchmarkDashboard.svelte';
	import ScopeBanner from '$lib/components/ScopeBanner.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let description = $derived(
		`ICC difference (LLM - human) for ${data.dataset.name}. Right of the parity line beats human-level agreement.`
	);
</script>

<svelte:head>
	<title>{data.dataset.name} | Fact-Check Leaderboard</title>
	<meta
		name="description"
		content={`Dataset detail for ${data.dataset.name} in the fact-checking benchmark leaderboard.`}
	/>
</svelte:head>

<ScopeBanner dataset={data.dataset} />
<BenchmarkDashboard
	title={data.dataset.name}
	{description}
	view="dataset"
	datasetName={data.dataset.name}
	showIntro={false}
/>
