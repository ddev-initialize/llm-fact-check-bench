<script lang="ts">
	import { tick } from "svelte";
	import {
		costPosition,
		formatDelta,
		formatInterval,
		toPercent,
		Y_MAX,
		type ModelResult,
		type ScaleMode,
	} from "$lib/dashboard";

	interface Props {
		model: ModelResult;
		scaleMode: ScaleMode;
	}

	let { model, scaleMode }: Props = $props();
	let tooltipElement: HTMLDivElement | undefined = $state();
	let tooltipX = $state("0px");
	let tooltipY = $state("0px");
	let closeTimer: ReturnType<typeof setTimeout> | undefined;
	let tooltipId = $derived(
		`cost-point-tooltip-${model.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
	);

	function cancelCloseTooltip(): void {
		if (!closeTimer) {
			return;
		}

		clearTimeout(closeTimer);
		closeTimer = undefined;
	}

	// TODO could use anchor positioning with a fallback
	function positionTooltip(target: EventTarget | null): void {
		if (!(target instanceof HTMLElement)) {
			return;
		}

		const rect = target.getBoundingClientRect();
		const tooltipHalfWidth = 130;
		const inlineStart = Math.min(
			Math.max(rect.left + rect.width / 2, tooltipHalfWidth + 12),
			window.innerWidth - tooltipHalfWidth - 12,
		);

		tooltipX = `${inlineStart}px`;
		tooltipY = `${Math.max(12, rect.top - 10)}px`;
	}

	async function openTooltip(
		event: PointerEvent | FocusEvent,
	): Promise<void> {
		cancelCloseTooltip();
		positionTooltip(event.currentTarget);
		await tick();
		tooltipElement?.showPopover();
	}

	function closeTooltip(): void {
		cancelCloseTooltip();
		tooltipElement?.hidePopover();
	}

	function queueCloseTooltip(): void {
		cancelCloseTooltip();
		closeTimer = setTimeout(closeTooltip, 90);
	}
</script>

<button
	type="button"
	class={{
		"scatter-point": true,
		muted: model.low < 0,
	}}
	aria-label={`${model.name}: ${formatDelta(model.delta)}, 95% CI ${formatInterval(model.low, model.high)}, $${model.cost.toFixed(2)} per 100 fact-checks`}
	aria-describedby={tooltipId}
	style:--left={toPercent(costPosition(model.cost, scaleMode))}
	style:--bottom={toPercent(model.delta / Y_MAX)}
	onpointerenter={openTooltip}
	onpointerleave={queueCloseTooltip}
	onfocus={openTooltip}
	onblur={queueCloseTooltip}
></button>

<div
	id={tooltipId}
	class="point-tooltip"
	role="tooltip"
	popover="auto"
	bind:this={tooltipElement}
	style:--tooltip-x={tooltipX}
	style:--tooltip-y={tooltipY}
	onpointerenter={cancelCloseTooltip}
	onpointerleave={queueCloseTooltip}
>
	<strong>{model.name}</strong>
	<dl>
		<div>
			<dt>Δ ICC</dt>
			<dd>{formatDelta(model.delta)}</dd>
		</div>
		<div>
			<dt>95% CI</dt>
			<dd>{formatInterval(model.low, model.high)}</dd>
		</div>
		<div>
			<dt>Cost</dt>
			<dd>${model.cost.toFixed(2)} / 100 checks</dd>
		</div>
	</dl>
</div>

<style>
	.scatter-point {
		position: absolute;
		inset-inline-start: var(--left);
		inset-block-end: var(--bottom);
		inline-size: 13px;
		block-size: 13px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: var(--accent);
		cursor: help;
		opacity: 0.9;
		transform: translate(-50%, 50%);

		&.muted {
			background: var(--dot-muted);
		}

		&:hover {
			outline: 2px solid var(--ink);
		}

		&:focus-visible {
			outline: 2px solid var(--ink);
			outline-offset: 4px;
		}
	}

	.point-tooltip {
		position: fixed;
		inset-block-start: var(--tooltip-y);
		inset-inline-start: var(--tooltip-x);
		inline-size: min(260px, calc(100vw - 32px));
		margin: 0;
		padding: 13px 14px;
		border: 1px solid var(--line);
		border-radius: 10px;
		background: var(--panel);
		box-shadow:
			0 1px 2px var(--shadow-color-tight),
			0 18px 42px var(--shadow-color);
		color: var(--ink);
		font-size: 12px;
		line-height: 1.35;
		translate: -50% -100%;

		&::backdrop {
			background: transparent;
		}

		strong {
			display: block;
			margin-block-end: 9px;
			font-size: 13px;
			font-weight: 600;
		}

		dl {
			display: grid;
			gap: 7px;
			margin: 0;
		}

		div {
			display: flex;
			justify-content: space-between;
			gap: 18px;
			padding-block-start: 7px;
			border-block-start: 1px solid var(--line-soft);
		}

		dt,
		dd {
			margin: 0;
			font-family: "IBM Plex Mono", ui-monospace, monospace;
			font-size: 11px;
		}

		dt {
			color: var(--muted);
		}

		dd {
			color: var(--ink);
			text-align: end;
			white-space: nowrap;
		}
	}
</style>
