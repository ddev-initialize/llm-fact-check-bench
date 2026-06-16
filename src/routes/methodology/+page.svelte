<svelte:head>
	<title>Methodology | LLM Fact-Checking Benchmark</title>
	<meta
		name="description"
		content="Placeholder methodology page for the LLM fact-checking benchmark."
	/>
</svelte:head>

<main class="content-page">
	<p class="eyebrow">Methodology</p>
	<h1>Methodology</h1>
	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse
		lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.
	</p>
	<p>
		Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod
		non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non
		fermentum diam nisl sit amet erat.
	</p>
</main>

<style>
	.content-page {
		display: grid;
		gap: 1rem;
		inline-size: min(100% - 2rem, 64rem);
		margin-inline: auto;
		padding-block: clamp(2rem, 5vw, 4rem);
	}

	.eyebrow {
		margin: 0;
		color: var(--muted);
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	h1,
	p {
		margin-block: 0;
	}

	h1 {
		font-size: 3rem;
		line-height: 1;
	}

	p {
		max-inline-size: 72ch;
		color: var(--muted);
	}

	@media (min-width: 48rem) {
		h1 {
			font-size: 4rem;
		}
	}
</style>
