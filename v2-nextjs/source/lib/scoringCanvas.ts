export const SCORING_CANVAS_DEFAULT_ZOOM = 0.9;
export const SCORING_CANVAS_MIN_ZOOM = 0.4;
export const SCORING_CANVAS_MAX_ZOOM = 1.25;
export const SCORING_CANVAS_EDGE_PADDING = 64;
export const SCORING_CANVAS_VERTICAL_EDGE_PADDING = 64;
export const SCORING_CANVAS_INITIAL_HORIZONTAL_INSET = 12;
export const SCORING_CANVAS_INITIAL_TOP_INSET = 32;
const SCORING_CANVAS_ZOOM_SENSITIVITY = 0.00045;
const SCORING_CANVAS_MAX_WHEEL_DELTA = 180;
const SCORING_CANVAS_MAX_PAN_DELTA = 160;

interface ScoringZoomModifiers {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

interface ScoringPanGesture {
  button: number;
  ctrlKey: boolean;
  isRowTarget: boolean;
  isInteractiveTarget: boolean;
}

export interface ScoringCanvasTransform {
  x: number;
  y: number;
  zoom: number;
}

interface PointerAnchoredScoringTransform {
  transform: ScoringCanvasTransform;
  nextZoom: number;
  pointerX: number;
  pointerY: number;
}

interface BoundedScoringCanvasTransform {
  transform: ScoringCanvasTransform;
  viewportWidth: number;
  viewportHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  horizontalEdgePadding?: number;
  verticalEdgePadding?: number;
}

interface InitialScoringCanvasTransform {
  viewportWidth: number;
  canvasWidth: number;
  horizontalInset?: number;
  topInset?: number;
}

function getBoundedCanvasOffset(
  offset: number,
  viewportSize: number,
  canvasSize: number,
  zoom: number,
  edgePadding: number
) {
  const safeViewportSize = Math.max(0, viewportSize);
  const renderedCanvasSize = Math.max(0, canvasSize) * zoom;
  const safePadding = Math.min(Math.max(0, edgePadding), safeViewportSize / 2);
  const oppositeEdgeOffset = safeViewportSize - renderedCanvasSize - safePadding;
  const minimumOffset = Math.min(safePadding, oppositeEdgeOffset);
  const maximumOffset = Math.max(safePadding, oppositeEdgeOffset);
  return Math.min(maximumOffset, Math.max(minimumOffset, offset));
}

export function shouldHandleScoringZoomGesture(
  modifiers: ScoringZoomModifiers,
  isAltKeyPressed = false
) {
  return (modifiers.altKey || isAltKeyPressed) && !modifiers.metaKey;
}

export function getNextScoringZoom(currentZoom: number, deltaY: number, deltaMode = 0) {
  if (deltaY === 0) return currentZoom;

  const deltaMultiplier = deltaMode === 1 ? 16 : deltaMode === 2 ? 100 : 1;
  const normalizedDelta = Math.min(
    SCORING_CANVAS_MAX_WHEEL_DELTA,
    Math.max(-SCORING_CANVAS_MAX_WHEEL_DELTA, deltaY * deltaMultiplier)
  );
  const nextZoom = currentZoom * Math.exp(-normalizedDelta * SCORING_CANVAS_ZOOM_SENSITIVITY);
  const clampedZoom = Math.min(SCORING_CANVAS_MAX_ZOOM, Math.max(SCORING_CANVAS_MIN_ZOOM, nextZoom));
  return Math.round(clampedZoom * 1000) / 1000;
}

export function getScoringCanvasBaseWidth(
  viewportClientWidth: number,
  paddingLeft = 0,
  paddingRight = 0
) {
  return Math.max(1, viewportClientWidth - Math.max(0, paddingLeft) - Math.max(0, paddingRight));
}

export function getScoringCanvasBackdropPadding(
  viewportSize: number,
  canvasSize: number,
  minimumPadding = SCORING_CANVAS_EDGE_PADDING
) {
  const safeViewportSize = Math.max(0, viewportSize);
  const safeCanvasSize = Math.max(0, canvasSize);
  const centeredPaddingAtMinimumZoom = (
    safeViewportSize - safeCanvasSize * SCORING_CANVAS_MIN_ZOOM
  ) / 2;

  return centeredPaddingAtMinimumZoom > 0
    ? centeredPaddingAtMinimumZoom
    : Math.max(0, minimumPadding);
}

export function getPointerAnchoredScoringTransform({
  transform,
  nextZoom,
  pointerX,
  pointerY,
}: PointerAnchoredScoringTransform): ScoringCanvasTransform {
  const logicalX = (pointerX - transform.x) / transform.zoom;
  const logicalY = (pointerY - transform.y) / transform.zoom;

  return {
    x: pointerX - logicalX * nextZoom,
    y: pointerY - logicalY * nextZoom,
    zoom: nextZoom,
  };
}

export function getInitialScoringCanvasTransform({
  viewportWidth,
  canvasWidth,
  horizontalInset = SCORING_CANVAS_INITIAL_HORIZONTAL_INSET,
  topInset = SCORING_CANVAS_INITIAL_TOP_INSET,
}: InitialScoringCanvasTransform): ScoringCanvasTransform {
  const safeViewportWidth = Math.max(1, viewportWidth);
  const safeCanvasWidth = Math.max(1, canvasWidth);
  const safeInset = Math.min(Math.max(0, horizontalInset), safeViewportWidth / 2);
  const availableWidth = Math.max(1, safeViewportWidth - safeInset * 2);
  const fittedZoom = Math.min(1, availableWidth / safeCanvasWidth);
  const zoom = Math.round(
    Math.min(SCORING_CANVAS_MAX_ZOOM, Math.max(SCORING_CANVAS_MIN_ZOOM, fittedZoom)) * 1000
  ) / 1000;

  return {
    x: (safeViewportWidth - safeCanvasWidth * zoom) / 2,
    y: Math.max(0, topInset),
    zoom,
  };
}

export function getBoundedScoringCanvasTransform({
  transform,
  viewportWidth,
  viewportHeight,
  canvasWidth,
  canvasHeight,
  horizontalEdgePadding = SCORING_CANVAS_EDGE_PADDING,
  verticalEdgePadding = SCORING_CANVAS_EDGE_PADDING,
}: BoundedScoringCanvasTransform): ScoringCanvasTransform {
  return {
    x: getBoundedCanvasOffset(
      transform.x,
      viewportWidth,
      canvasWidth,
      transform.zoom,
      horizontalEdgePadding
    ),
    y: getBoundedCanvasOffset(
      transform.y,
      viewportHeight,
      canvasHeight,
      transform.zoom,
      verticalEdgePadding
    ),
    zoom: transform.zoom,
  };
}

export function getNormalizedScoringPanDelta(delta: number, deltaMode = 0) {
  const deltaMultiplier = deltaMode === 1 ? 16 : deltaMode === 2 ? 100 : 1;
  return Math.min(
    SCORING_CANVAS_MAX_PAN_DELTA,
    Math.max(-SCORING_CANVAS_MAX_PAN_DELTA, delta * deltaMultiplier)
  );
}

export function shouldStartScoringPanGesture({
  button,
  ctrlKey,
  isRowTarget,
  isInteractiveTarget,
}: ScoringPanGesture) {
  return button === 0 && ctrlKey && !isRowTarget && !isInteractiveTarget;
}
