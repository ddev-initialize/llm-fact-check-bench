<script lang="ts">
	import DatasetView from '$lib/components/DatasetView.svelte';
	import { DATASETS } from '$lib/dashboard';
</script>

<svelte:head>
	<title>Datasets | Fact-Check Leaderboard</title>
	<meta
		name="description"
		content="Dataset index for fact-checking benchmark comparisons between LLMs and human fact-checkers."
	/>
</svelte:head>

<DatasetView datasets={DATASETS} />
