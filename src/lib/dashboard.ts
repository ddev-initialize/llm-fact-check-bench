export type View = 'overview' | 'datasets' | 'dataset';
export type SortMode = 'delta' | 'cost';

export type ModelResult = {
	name: string;
	delta: number;
	low: number;
	high: number;
	cost: number;
};

export type Dataset = {
	name: string;
	description: string;
	citation: string;
	icc: string;
	models: number;
	age: string;
	meta: string;
};

export type ForestRow = {
	name: string;
	estimate: string;
	interval: string;
	cost: string;
	crossesParity: boolean;
	ciLeft: string;
	ciWidth: string;
	pointLeft: string;
	barWidth: string;
};

export const X_MIN = -0.06;
export const X_MAX = 0.2;

export const MODELS: ModelResult[] = [
	{ name: 'Gemini 3 Flash', delta: 0.108, low: 0.07, high: 0.14, cost: 14.13 },
	{ name: 'Gemini 3.1 Pro', delta: 0.108, low: 0.05, high: 0.17, cost: 15.31 },
	{ name: 'Grok 4', delta: 0.104, low: 0.03, high: 0.18, cost: 7.01 },
	{ name: 'GPT-4o Search', delta: 0.093, low: 0.02, high: 0.16, cost: 4.14 },
	{ name: 'Gemini 3.1 Flash Lite', delta: 0.092, low: 0.04, high: 0.14, cost: 14.07 },
	{ name: 'Sonar Pro Search', delta: 0.07, low: 0.02, high: 0.12, cost: 1.74 },
	{ name: 'Grok 4.2', delta: 0.052, low: 0.01, high: 0.09, cost: 6.25 },
	{ name: 'GPT-5.4', delta: 0.039, low: -0.03, high: 0.11, cost: 3.88 },
	{ name: 'Claude Opus 4.6', delta: 0.027, low: -0.02, high: 0.07, cost: 20.05 },
	{ name: 'GPT-5.2 Pro', delta: 0.016, low: -0.06, high: 0.09, cost: 72.46 }
];

export const DATASETS: Dataset[] = [
	{
		name: 'allen2024',
		description: 'News-headline veracity ratings',
		citation: 'Allen et al. (2024)',
		icc: '0.76',
		models: 10,
		age: '~2 yr',
		meta: 'Allen et al. (2024) · human ICC 0.76 · 10 models · news-headline veracity'
	},
	{
		name: 'crowdtangle',
		description: 'Social headline fact-checks',
		citation: 'CrowdTangle set',
		icc: '0.72',
		models: 10,
		age: '~3 yr',
		meta: 'CrowdTangle set · human ICC 0.72 · 10 models · social headline fact-checks'
	},
	{
		name: 'allen2021',
		description: 'News-headline veracity ratings',
		citation: 'Allen et al. (2021)',
		icc: '0.54',
		models: 10,
		age: '~5 yr',
		meta: 'Allen et al. (2021) · human ICC 0.54 · 10 models · news-headline veracity'
	}
];

/**
 * Sort dashboard model rows by the selected metric.
 *
 * Parameters
 * ----------
 * models
 *     Model rows from the static dashboard data.
 * sortMode
 *     Sort order requested by the UI.
 *
 * Returns
 * -------
 * ModelResult[]
 *     A new sorted array.
 */
export function sortModels(models: ModelResult[], sortMode: SortMode): ModelResult[] {
	const sorted = [...models];

	if (sortMode === 'cost') {
		return sorted.sort((a, b) => a.cost - b.cost);
	}

	return sorted.sort((a, b) => b.delta - a.delta);
}

/**
 * Filter the dataset list with a plain text query.
 *
 * Parameters
 * ----------
 * datasets
 *     Static dataset rows.
 * query
 *     User-entered search text.
 *
 * Returns
 * -------
 * Dataset[]
 *     Matching datasets, preserving source order.
 */
export function filterDatasets(datasets: Dataset[], query: string): Dataset[] {
	const normalized = query.trim().toLowerCase();

	if (!normalized) {
		return datasets;
	}

	return datasets.filter((dataset) =>
		[dataset.name, dataset.description, dataset.citation].some((value) =>
			value.toLowerCase().includes(normalized)
		)
	);
}

/**
 * Find a dataset by route slug.
 *
 * Parameters
 * ----------
 * slug
 *     Dataset route slug.
 *
 * Returns
 * -------
 * Dataset | undefined
 *     Matching dataset when present.
 */
export function findDataset(slug: string): Dataset | undefined {
	return DATASETS.find((dataset) => dataset.name === slug);
}

/**
 * Format a delta estimate for dashboard display.
 *
 * Parameters
 * ----------
 * value
 *     Numeric delta estimate.
 *
 * Returns
 * -------
 * string
 *     Fixed-width display value.
 */
export function formatDelta(value: number): string {
	return value.toFixed(3).replace(/^-0\.000$/, '0.000');
}

/**
 * Format confidence interval bounds for dashboard display.
 *
 * Parameters
 * ----------
 * low
 *     Lower interval bound.
 * high
 *     Upper interval bound.
 *
 * Returns
 * -------
 * string
 *     Bracketed interval label.
 */
export function formatInterval(low: number, high: number): string {
	return `[${low.toFixed(2)}, ${high.toFixed(2)}]`;
}

/**
 * Convert a ratio to a clamped CSS percentage.
 *
 * Parameters
 * ----------
 * value
 *     Ratio where 1 is 100%.
 *
 * Returns
 * -------
 * string
 *     CSS percentage string.
 */
export function toPercent(value: number): string {
	return `${Math.max(0, Math.min(100, value * 100)).toFixed(2)}%`;
}

/**
 * Map an ICC delta value to the chart's horizontal scale.
 *
 * Parameters
 * ----------
 * value
 *     ICC delta value.
 *
 * Returns
 * -------
 * number
 *     Position ratio on the forest plot axis.
 */
export function deltaPosition(value: number): number {
	return (value - X_MIN) / (X_MAX - X_MIN);
}

/**
 * Build display data for one forest plot row.
 *
 * Parameters
 * ----------
 * model
 *     Raw model result.
 * maxDelta
 *     Maximum delta used to scale mobile bars.
 *
 * Returns
 * -------
 * ForestRow
 *     Render-ready row values.
 */
export function modelToForestRow(model: ModelResult, maxDelta: number): ForestRow {
	const left = deltaPosition(model.low);
	const right = deltaPosition(model.high);

	return {
		name: model.name,
		estimate: formatDelta(model.delta),
		interval: formatInterval(model.low, model.high),
		cost: `$${model.cost.toFixed(2)}`,
		crossesParity: model.low < 0,
		ciLeft: toPercent(left),
		ciWidth: toPercent(right - left),
		pointLeft: toPercent(deltaPosition(model.delta)),
		barWidth: toPercent(model.delta / maxDelta)
	};
}

/**
 * Build render-ready rows for the leaderboard views.
 *
 * Parameters
 * ----------
 * models
 *     Sorted raw model rows.
 *
 * Returns
 * -------
 * ForestRow[]
 *     Render-ready forest and mobile rows.
 */
export function buildForestRows(models: ModelResult[]): ForestRow[] {
	const maxDelta = Math.max(...MODELS.map((model) => model.delta));

	return models.map((model) => modelToForestRow(model, maxDelta));
}
