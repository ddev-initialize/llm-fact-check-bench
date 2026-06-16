import { iccSearchResults, type IccSearchResult } from '$lib/iccSearchResults';

const MODEL_LABELS: Partial<Record<string, string>> = {
	modelsmode: 'Mode ensemble',
	gemini3flash: 'Gemini 3 Flash',
	gemini31pro: 'Gemini 3.1 Pro',
	grok4: 'Grok 4',
	gpt4osearch: 'GPT-4o Search',
	gemini31flashlite: 'Gemini 3.1 Flash Lite',
	sonarprosearch: 'Sonar Pro Search',
	grok42: 'Grok 4.2',
	gpt54: 'GPT-5.4',
	claude46: 'Claude Opus 4.6',
	gpt52pro: 'GPT-5.2 Pro'
};

const CHART_WIDTH = 920;
const CHART_LEFT = 155;
const CHART_RIGHT = 34;
const CHART_TOP = 38;
const CHART_ROW_HEIGHT = 44;
const TICK_STEP = 0.02;

export type BenchmarkRow = IccSearchResult & {
	rank: number;
	displayName: string;
	confidenceLabel: string;
	pValueLabel: string;
	significantlyAboveHumans: boolean;
};

export type ChartTick = {
	value: number;
	x: number;
	label: string;
};

export type ChartPoint = {
	row: BenchmarkRow;
	y: number;
	x: number;
	xLower: number;
	xUpper: number;
};

export type ChartGeometry = {
	width: number;
	height: number;
	left: number;
	right: number;
	plotTop: number;
	plotBottom: number;
	tickLabelY: number;
	axisLabelY: number;
	xMin: number;
	xMax: number;
	ticks: ChartTick[];
	points: ChartPoint[];
};

function displayName(model: string): string {
	return MODEL_LABELS[model] ?? model;
}

function roundDown(value: number, step: number): number {
	return Math.floor(value / step) * step;
}

function roundUp(value: number, step: number): number {
	return Math.ceil(value / step) * step;
}

function fixed(value: number, digits: number): string {
	return value.toFixed(digits).replace(/^-0\.000$/, '0.000');
}

function signedFixed(value: number, digits: number): string {
	const prefix = value > 0 ? '+' : '';
	return `${prefix}${fixed(value, digits)}`;
}

function pValueLabel(value: number): string {
	if (value < 0.001) {
		return '< .001';
	}

	return fixed(value, 3).replace(/^0/, '');
}

function xPosition(value: number, xMin: number, xMax: number): number {
	const plotWidth = CHART_WIDTH - CHART_LEFT - CHART_RIGHT;
	return CHART_LEFT + ((value - xMin) / (xMax - xMin)) * plotWidth;
}

export function formatDelta(value: number): string {
	return signedFixed(value, 3);
}

export function formatStandardError(value: number): string {
	return fixed(value, 3);
}

export function formatHeterogeneity(value: number): string {
	return `${fixed(value, 1)}%`;
}

export const benchmarkRows: BenchmarkRow[] = [...iccSearchResults]
	.sort((a, b) => b.beta_coefficient - a.beta_coefficient)
	.map((result, index) => ({
		...result,
		rank: index + 1,
		displayName: displayName(result.model),
		confidenceLabel: `${signedFixed(result.confidence_interval_lower, 3)} to ${signedFixed(result.confidence_interval_upper, 3)}`,
		pValueLabel: pValueLabel(result.pval),
		significantlyAboveHumans: result.confidence_interval_lower > 0
	}));

const xMin = roundDown(
	Math.min(0, ...benchmarkRows.map((row) => row.confidence_interval_lower)),
	TICK_STEP
);

const xMax = roundUp(
	Math.max(0, ...benchmarkRows.map((row) => row.confidence_interval_upper)),
	TICK_STEP
);

const plotBottom = CHART_TOP + CHART_ROW_HEIGHT * (benchmarkRows.length - 1);
const tickLabelY = plotBottom + 35;
const axisLabelY = plotBottom + 61;

const ticks: ChartTick[] = Array.from(
	{ length: Math.round((xMax - xMin) / TICK_STEP) + 1 },
	(_, index) => {
		const value = Number((xMin + index * TICK_STEP).toFixed(2));

		return {
			value,
			x: xPosition(value, xMin, xMax),
			label: fixed(value, 2)
		};
	}
);

export const chartGeometry: ChartGeometry = {
	width: CHART_WIDTH,
	height: axisLabelY + 16,
	left: CHART_LEFT,
	right: CHART_RIGHT,
	plotTop: CHART_TOP - 22,
	plotBottom: plotBottom + 18,
	tickLabelY,
	axisLabelY,
	xMin,
	xMax,
	ticks,
	points: benchmarkRows.map((row, index) => ({
		row,
		y: CHART_TOP + index * CHART_ROW_HEIGHT,
		x: xPosition(row.beta_coefficient, xMin, xMax),
		xLower: xPosition(row.confidence_interval_lower, xMin, xMax),
		xUpper: xPosition(row.confidence_interval_upper, xMin, xMax)
	}))
};
