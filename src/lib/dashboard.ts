import { DATASETS, MODELS, MODELS_BY_DATASET, type Dataset, type ModelResult } from '$lib/data';

export type View = 'overview' | 'datasets' | 'dataset';
export type SortMode = 'delta' | 'cost';
export type { Dataset, ModelResult } from '$lib/data';

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

export { DATASETS, MODELS } from '$lib/data';

const MODEL_COSTS = new Map(MODELS.map((model) => [model.name, model.cost]));

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
		return sorted.sort(
			(a, b) => (a.cost ?? Number.POSITIVE_INFINITY) - (b.cost ?? Number.POSITIVE_INFINITY)
		);
	}

	return sorted.sort((a, b) => b.delta - a.delta);
}

/**
 * Get model rows for a specific leaderboard scope.
 *
 * Parameters
 * ----------
 * datasetName
 *     Dataset route slug. When omitted, returns the pooled overview rows.
 *
 * Returns
 * -------
 * ModelResult[]
 *     Raw model rows for the requested scope.
 */
export function getModelResults(datasetName?: string): ModelResult[] {
	if (!datasetName) {
		return MODELS;
	}

	return (MODELS_BY_DATASET[datasetName] ?? []).map((row) => ({
		name: row.name,
		delta: row.delta,
		low: row.low,
		high: row.high,
		cost: MODEL_COSTS.get(row.name) ?? null
	}));
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
		cost: model.cost === null ? 'n/a' : `$${model.cost.toFixed(2)}`,
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
	const maxDelta = Math.max(...models.map((model) => model.delta));

	return models.map((model) => modelToForestRow(model, maxDelta));
}
