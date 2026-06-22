<script lang="ts">
	import BenchmarkDashboard from '$lib/components/BenchmarkDashboard.svelte';
</script>

<svelte:head>
	<title>Fact-Check Leaderboard</title>
	<meta
		name="description"
		content="Leaderboard comparing LLM fact-checking agreement against human fact-checker agreement."
	/>
</svelte:head>

<BenchmarkDashboard
	title="Overview"
	description="All datasets pooled into one meta-analytic estimate. The story: better models edge past human-level agreement, and the cheapest ones nearly match the best."
	view="overview"
/>
