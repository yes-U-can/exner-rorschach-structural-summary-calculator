import { describe, expect, it } from 'vitest';
import {
  SCORING_CANVAS_DEFAULT_ZOOM,
  SCORING_CANVAS_EDGE_PADDING,
  SCORING_CANVAS_INITIAL_HORIZONTAL_INSET,
  SCORING_CANVAS_INITIAL_TOP_INSET,
  SCORING_CANVAS_MAX_ZOOM,
  SCORING_CANVAS_MIN_ZOOM,
  SCORING_CANVAS_VERTICAL_EDGE_PADDING,
  getBoundedScoringCanvasTransform,
  getInitialScoringCanvasTransform,
  getNextScoringZoom,
  getNormalizedScoringPanDelta,
  getPointerAnchoredScoringTransform,
  getScoringCanvasBackdropPadding,
  getScoringCanvasBaseWidth,
  shouldHandleScoringZoomGesture,
  shouldStartScoringPanGesture,
} from '@/lib/scoringCanvas';

describe('scoring canvas gestures', () => {
  it('reserves Ctrl+wheel and trackpad pinch for browser zoom', () => {
    expect(shouldHandleScoringZoomGesture({ altKey: true, ctrlKey: false, metaKey: false })).toBe(true);
    expect(shouldHandleScoringZoomGesture({ altKey: false, ctrlKey: true, metaKey: false })).toBe(false);
    expect(shouldHandleScoringZoomGesture({ altKey: true, ctrlKey: true, metaKey: false })).toBe(false);
  });

  it('steps and clamps scoring-canvas zoom', () => {
    expect(SCORING_CANVAS_DEFAULT_ZOOM).toBe(0.9);
    expect(getNextScoringZoom(0.9, -100)).toBeCloseTo(0.941, 3);
    expect(getNextScoringZoom(0.9, 100)).toBeCloseTo(0.86, 3);
    expect(getNextScoringZoom(0.9, -4)).toBeCloseTo(0.902, 3);
    expect(getNextScoringZoom(0.9, -3, 1)).toBeCloseTo(0.92, 3);
    expect(getNextScoringZoom(SCORING_CANVAS_MAX_ZOOM, -100)).toBe(SCORING_CANVAS_MAX_ZOOM);
    expect(getNextScoringZoom(SCORING_CANVAS_MIN_ZOOM, 100)).toBe(SCORING_CANVAS_MIN_ZOOM);
  });

  it('keeps a stable logical canvas width for transform-based scaling', () => {
    const baseWidth = getScoringCanvasBaseWidth(1244);
    expect(baseWidth).toBe(1244);
    expect(baseWidth * SCORING_CANVAS_DEFAULT_ZOOM).toBeCloseTo(1119.6, 1);
    expect(SCORING_CANVAS_MIN_ZOOM).toBe(0.4);
    expect(baseWidth * SCORING_CANVAS_MIN_ZOOM).toBeCloseTo(497.6, 1);
    expect(baseWidth * SCORING_CANVAS_MAX_ZOOM).toBe(1555);
  });

  it('preserves the minimum-zoom backdrop allowance at every zoom level', () => {
    expect(getScoringCanvasBackdropPadding(1000, 1500)).toBe(200);
    expect(getScoringCanvasBackdropPadding(800, 700)).toBe(260);
    expect(getScoringCanvasBackdropPadding(500, 1500)).toBe(64);

    const verticalPadding = getScoringCanvasBackdropPadding(1000, 1500);
    const minimumZoomTop = getBoundedScoringCanvasTransform({
      viewportWidth: 1000,
      viewportHeight: 1000,
      canvasWidth: 1500,
      canvasHeight: 1500,
      transform: { x: 0, y: 9999, zoom: SCORING_CANVAS_MIN_ZOOM },
      verticalEdgePadding: verticalPadding,
    });
    const maximumZoomTop = getBoundedScoringCanvasTransform({
      viewportWidth: 1000,
      viewportHeight: 1000,
      canvasWidth: 1500,
      canvasHeight: 1500,
      transform: { x: 0, y: 9999, zoom: SCORING_CANVAS_MAX_ZOOM },
      verticalEdgePadding: verticalPadding,
    });
    const maximumZoomBottom = getBoundedScoringCanvasTransform({
      viewportWidth: 1000,
      viewportHeight: 1000,
      canvasWidth: 1500,
      canvasHeight: 1500,
      transform: { x: 0, y: -9999, zoom: SCORING_CANVAS_MAX_ZOOM },
      verticalEdgePadding: verticalPadding,
    });

    expect(minimumZoomTop.y).toBe(200);
    expect(maximumZoomTop.y).toBe(200);
    expect(
      1000 - (maximumZoomBottom.y + 1500 * SCORING_CANVAS_MAX_ZOOM)
    ).toBe(200);
  });

  it('keeps the pointer coordinate fixed while changing scale', () => {
    const pointerX = 900;
    const pointerY = 420;
    const transform = { x: -120, y: 36, zoom: 0.9 };
    const nextTransform = getPointerAnchoredScoringTransform({
      transform,
      nextZoom: 1.12,
      pointerX,
      pointerY,
    });
    const logicalX = (pointerX - transform.x) / transform.zoom;
    const logicalY = (pointerY - transform.y) / transform.zoom;

    expect(nextTransform.x + logicalX * nextTransform.zoom).toBeCloseTo(pointerX, 8);
    expect(nextTransform.y + logicalY * nextTransform.zoom).toBeCloseTo(pointerY, 8);
  });

  it('fits and horizontally centers the initial canvas with equal side insets', () => {
    const fitted = getInitialScoringCanvasTransform({
      viewportWidth: 1246,
      canvasWidth: 1258,
    });

    expect(SCORING_CANVAS_INITIAL_HORIZONTAL_INSET).toBe(12);
    expect(SCORING_CANVAS_INITIAL_TOP_INSET).toBe(32);
    expect(fitted.zoom).toBe(0.971);
    expect(fitted.x).toBeCloseTo(12.241, 3);
    expect(fitted.y).toBe(32);
  });

  it('keeps a zoomed-out canvas inside finite, equally padded edges', () => {
    const dimensions = {
      viewportWidth: 1200,
      viewportHeight: 800,
      canvasWidth: 1000,
      canvasHeight: 700,
    };
    const farEdge = getBoundedScoringCanvasTransform({
      ...dimensions,
      transform: { x: -9999, y: -9999, zoom: 0.75 },
    });
    const nearEdge = getBoundedScoringCanvasTransform({
      ...dimensions,
      transform: { x: 9999, y: 9999, zoom: 0.75 },
    });

    expect(SCORING_CANVAS_EDGE_PADDING).toBe(64);
    expect(farEdge).toEqual({ x: 64, y: 64, zoom: 0.75 });
    expect(nearEdge).toEqual({ x: 386, y: 211, zoom: 0.75 });
  });

  it('limits panning to the same finite edge allowance on all four sides', () => {
    const dimensions = {
      viewportWidth: 1200,
      viewportHeight: 800,
      canvasWidth: 1400,
      canvasHeight: 1200,
    };
    const farEdge = getBoundedScoringCanvasTransform({
      ...dimensions,
      transform: { x: -9999, y: -9999, zoom: 1 },
    });
    const nearEdge = getBoundedScoringCanvasTransform({
      ...dimensions,
      transform: { x: 9999, y: 9999, zoom: 1 },
    });

    expect(farEdge).toEqual({ x: -264, y: -464, zoom: 1 });
    expect(nearEdge).toEqual({ x: 64, y: 64, zoom: 1 });
  });

  it('keeps finite backdrop space above and below the canvas', () => {
    const dimensions = {
      viewportWidth: 1200,
      viewportHeight: 800,
      canvasWidth: 1400,
      canvasHeight: 1200,
      verticalEdgePadding: SCORING_CANVAS_VERTICAL_EDGE_PADDING,
    };
    const farEdge = getBoundedScoringCanvasTransform({
      ...dimensions,
      transform: { x: -9999, y: -9999, zoom: 1 },
    });
    const nearEdge = getBoundedScoringCanvasTransform({
      ...dimensions,
      transform: { x: 9999, y: 9999, zoom: 1 },
    });

    expect(SCORING_CANVAS_VERTICAL_EDGE_PADDING).toBe(64);
    expect(farEdge).toEqual({ x: -264, y: -464, zoom: 1 });
    expect(nearEdge).toEqual({ x: 64, y: 64, zoom: 1 });
  });

  it('normalizes wheel panning without allowing a single event to jump the canvas', () => {
    expect(getNormalizedScoringPanDelta(40)).toBe(40);
    expect(getNormalizedScoringPanDelta(-3, 1)).toBe(-48);
    expect(getNormalizedScoringPanDelta(500)).toBe(160);
    expect(getNormalizedScoringPanDelta(-500)).toBe(-160);
  });

  it('starts Ctrl+drag panning only on non-row, non-interactive canvas areas', () => {
    expect(shouldStartScoringPanGesture({ button: 0, ctrlKey: true, isRowTarget: false, isInteractiveTarget: false })).toBe(true);
    expect(shouldStartScoringPanGesture({ button: 0, ctrlKey: true, isRowTarget: true, isInteractiveTarget: false })).toBe(false);
    expect(shouldStartScoringPanGesture({ button: 0, ctrlKey: true, isRowTarget: false, isInteractiveTarget: true })).toBe(false);
    expect(shouldStartScoringPanGesture({ button: 0, ctrlKey: false, isRowTarget: false, isInteractiveTarget: false })).toBe(false);
  });
});
