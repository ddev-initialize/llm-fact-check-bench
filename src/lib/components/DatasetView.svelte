<script lang="ts">
	import { resolve } from "$app/paths";
	import { filterDatasets, type Dataset } from "$lib/dashboard";

	interface Props {
		datasets: Dataset[];
	}

	let { datasets }: Props = $props();
	let query = $state("");
	let filteredDatasets = $derived(filterDatasets(datasets, query));
</script>

<section aria-labelledby="datasets-title">
	<h1 id="datasets-title">Datasets</h1>
	<p class="lede">
		Choose a benchmark to see how language models compare to human
		fact-checkers. Open a dataset for the full breakdown.
	</p>

	<search class="dataset-search">
		<label for="dataset-query">Search datasets</label>
		<input
			id="dataset-query"
			type="search"
			bind:value={query}
			placeholder="Search datasets"
		/>
	</search>

	<div class="dataset-table" role="region" aria-label="Datasets">
		<div class="dataset-head" aria-hidden="true">
			<span>Dataset</span>
			<span class="dataset-meta-head">
				<span>Source</span>
				<span>Age</span>
			</span>
			<span></span>
		</div>
		{#each filteredDatasets as dataset (dataset.name)}
			<a
				class="dataset-row"
				href={resolve("/datasets/[slug]", { slug: dataset.name })}
			>
				<span>
					<strong>{dataset.name}</strong>
					<small>{dataset.description}</small>
				</span>
				<span class="dataset-meta">
					<span class="dataset-source">
						<span>
							<small class="mobile-label">Source</small>
							{dataset.citation}
						</span>
						<span>
							<small class="mobile-label">Human ICC</small>
							<small class="desktop-icc">· human ICC {dataset.icc}</small>
							<span class="mobile-value">{dataset.icc}</span>
						</span>
					</span>
					<span class="dataset-age">
						<small class="mobile-label">Dataset age</small>
						{dataset.age}
					</span>
				</span>
				<span class="arrow" aria-hidden="true">›</span>
			</a>
		{:else}
			<p class="empty-state">No datasets match that search.</p>
		{/each}
	</div>
</section>

<style>
	section {
		h1 {
			margin: 0 0 8px;
			font-family: "Newsreader", ui-serif, Georgia, serif;
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

	.dataset-search {
		display: block;
		margin-block-end: 22px;

		label {
			position: absolute;
			inline-size: 1px;
			block-size: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}

		input {
			inline-size: min(100%, 26rem);
			border: 1px solid var(--line);
			border-radius: 11px;
			background: var(--panel);
			color: var(--ink);
			padding: 11px 15px;
			font-size: 13.5px;
		}
	}

	.dataset-table {
		overflow: clip;
		border: 1px solid var(--line);
		border-radius: 16px;
		background: var(--panel);
		box-shadow:
			0 1px 2px var(--shadow-color-tight),
			0 10px 30px var(--shadow-color);
	}

	.dataset-head,
	.dataset-row {
		display: grid;
		grid-template-columns: 1.7fr 2.25fr 24px;
		gap: 18px;
		align-items: center;
	}

	.dataset-head {
		padding: 14px 24px;
		border-block-end: 1px solid var(--line);

		span {
			font-family: "IBM Plex Mono", ui-monospace, monospace;
			font-size: 10.5px;
			letter-spacing: 0.1em;
			text-transform: uppercase;
			color: var(--muted);
		}
	}

	.dataset-row {
		inline-size: 100%;
		padding: 19px 24px;
		border-block-end: 1px solid var(--line-soft);
		background: transparent;
		color: var(--ink-soft);
		text-align: start;
		text-decoration: none;
		transition: background 0.15s ease;

		&:hover {
			background: var(--hover);
		}

		strong {
			display: block;
			color: var(--ink);
			font-family: "IBM Plex Mono", ui-monospace, monospace;
			font-size: 14.5px;
			font-weight: 500;
		}

		small {
			display: inline;
			color: var(--muted);
			font-size: 12.5px;
		}

		> span:first-child small {
			display: block;
			margin-block-start: 4px;
		}

		.dataset-age {
			color: var(--ink);
			font-family: "IBM Plex Mono", ui-monospace, monospace;
			font-size: 14px;
		}
	}

	.dataset-source {
		display: block;
	}

	.dataset-meta,
	.dataset-meta-head {
		display: grid;
		grid-template-columns: minmax(0, 1.7fr) minmax(72px, 0.55fr);
		gap: 18px;
		align-items: center;
	}

	.dataset-row .mobile-label,
	.mobile-value {
		display: none;
	}

	.arrow {
		color: var(--dot-muted);
		font-size: 19px;
		line-height: 1;
		text-align: end;
	}

	.empty-state {
		padding: 24px;
		color: var(--muted);
		font-size: 13px;
	}

	@media (max-width: 768px) {
		.dataset-head {
			display: none;
		}

		.dataset-row {
			grid-template-columns: minmax(0, 1fr) 24px;
			gap: 10px 14px;

			.dataset-meta {
				grid-column: 1;
				grid-template-columns: 1fr;
				gap: 12px;
				color: var(--ink-soft);
				font-size: 12.5px;
				line-height: 1.4;
			}

			.dataset-source {
				display: grid;
				grid-template-columns: 1fr;
				gap: 12px;
			}

			.dataset-source > span,
			.dataset-age {
				display: grid;
				gap: 2px;
			}

			.dataset-age {
				color: var(--ink-soft);
				font-size: 12.5px;
			}

			.mobile-label {
				display: block;
				color: var(--ink-soft);
				font-family: "IBM Plex Mono", ui-monospace, monospace;
				font-size: 9.5px;
				font-weight: 500;
				letter-spacing: 0.1em;
				line-height: 1.2;
				text-transform: uppercase;
			}

			.desktop-icc {
				display: none;
			}

			.mobile-value {
				display: inline;
				color: var(--ink-soft);
			}

			.arrow {
				grid-column: 2;
				grid-row: 1 / span 2;
				align-self: center;
			}
		}
	}

</style>
