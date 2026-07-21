import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const slotSelectSource = readFileSync('components/input/SlotSelect.tsx', 'utf8');
const determinantSlotsSource = readFileSync('components/input/DeterminantSlots.tsx', 'utf8');
const contentSlotsSource = readFileSync('components/input/ContentSlots.tsx', 'utf8');
const specialScoreSlotsSource = readFileSync('components/input/SpecialScoreSlots.tsx', 'utf8');
const inputTableSource = readFileSync('components/input/InputTable.tsx', 'utf8');
const homePageSource = readFileSync('app/page.tsx', 'utf8');
const globalStyles = readFileSync('app/globals.css', 'utf8');
const localeCodes = ['ko', 'en', 'ja', 'es', 'pt'] as const;

describe('scoring select geometry', () => {
  it('keeps filled and empty buttons in the same fixed-height layout box', () => {
    expect(slotSelectSource).toContain('className={`relative mx-auto h-8 ${className}`}');
    expect(slotSelectSource).toContain('relative flex h-8 min-h-8 max-h-8');
    expect(slotSelectSource).toContain('appearance-none items-center justify-center');
    expect(slotSelectSource).toContain('block h-4 w-full truncate leading-4');
  });

  it('styles empty controls separately without changing their geometry', () => {
    expect(globalStyles).toContain('.ui-slot-select-button.is-empty {');
    expect(globalStyles).toContain('.ui-slot-select-button.is-empty .ui-slot-select-chevron {');
    expect(globalStyles).toContain('min-height: 2rem;');
    expect(globalStyles).toContain('max-height: 2rem;');
    expect(globalStyles).not.toContain('.ui-slot-select-button.is-filled + span');
  });

  it('centers single controls and distributes multi-slot controls across each cell', () => {
    expect(determinantSlotsSource).toContain('grid w-full min-w-[11rem] grid-cols-3 place-items-center gap-1');
    expect(contentSlotsSource).toContain('grid w-full min-w-[9.5rem] grid-cols-3 place-items-center gap-1');
    expect(specialScoreSlotsSource).toContain('grid w-full min-w-[18.75rem] grid-cols-4 place-items-center gap-1');
    expect(specialScoreSlotsSource).toContain('className="w-[4.5rem]"');
  });

  it('renders the dragged row inside a table with the source cell widths', () => {
    expect(inputTableSource).toContain("document.createElement('colgroup')");
    expect(inputTableSource).toContain("document.createElement('tbody')");
    expect(inputTableSource).toContain('cell.getBoundingClientRect().width');
    expect(inputTableSource).toContain('ghostBody.appendChild(ghostRow)');
    expect(inputTableSource).toContain('ghostTable.appendChild(ghostBody)');
  });

  it('keeps row-order guidance in the table footer without authored line breaks', () => {
    expect(inputTableSource).toContain("{t('input.rowOrderTip')}");
    expect(homePageSource).not.toContain("<Tooltip content={t('input.rowOrderTip')}>");

    for (const localeCode of localeCodes) {
      const locale = JSON.parse(readFileSync(`i18n/locales/${localeCode}.json`, 'utf8')) as {
        input: { rowOrderTip: string };
      };

      expect(locale.input.rowOrderTip).not.toMatch(/[\r\n]/);
    }
  });

  it('marks every referenced scoring-table header consistently in all five tooltip locales', () => {
    for (const localeCode of localeCodes) {
      const locale = JSON.parse(readFileSync(`i18n/locales/${localeCode}.json`, 'utf8')) as {
        input: { scoreTooltip: string; gphrTooltip: string };
      };

      expect(locale.input.scoreTooltip).toContain('[Card]');
      expect(locale.input.scoreTooltip).toContain('[Z]');
      expect(locale.input.gphrTooltip).toContain('[Contents]');
      expect(locale.input.gphrTooltip).toContain('[Determinants]');
      expect(locale.input.gphrTooltip).toContain('[FQ]');
      expect(locale.input.gphrTooltip).toContain('[Special Score]');
    }
  });

  it('finishes the scoring table with a readable header-colored bottom cap', () => {
    expect(inputTableSource).toContain('<tfoot>');
    expect(inputTableSource).toContain('ui-scoring-table-footer-cap min-h-16 rounded-b-xl border-t-2');
    expect(inputTableSource).toContain('whitespace-normal text-left text-xs font-medium leading-5');
    expect(inputTableSource).not.toContain("{t('footer.scoringCanvasCopyright')}");
    expect(inputTableSource).not.toContain('ui-scoring-footer-easter-egg');
    expect(globalStyles).not.toContain('ui-scoring-footer-easter-egg');
  });

  it('centers calculate and reset while keeping row controls at the left', () => {
    expect(inputTableSource).toContain('actions?: ReactNode;');
    expect(inputTableSource).toContain('{actions}');
    expect(inputTableSource).toContain('ui-scoring-action-bar grid grid-cols-[1fr_auto_1fr] items-center gap-3');
    expect(inputTableSource).toContain('<div className="justify-self-center">{actions}</div>');
    expect(homePageSource).toContain('ui-input-action-buttons flex flex-wrap items-center justify-center gap-3');
    expect(homePageSource).toContain('actions={inputActionButtons}');

    const actionBarIndex = inputTableSource.indexOf('ui-scoring-action-bar grid grid-cols-[1fr_auto_1fr] items-center gap-3');
    const actionsIndex = inputTableSource.indexOf('{actions}', actionBarIndex);
    const rowControlsIndex = inputTableSource.indexOf('Tooltip content={rowTooltipText}', actionBarIndex);
    const calculateIndex = homePageSource.indexOf("{t('buttons.calculate')}");
    const resetIndex = homePageSource.indexOf("{t('buttons.reset')}");

    expect(rowControlsIndex).toBeGreaterThan(actionBarIndex);
    expect(actionsIndex).toBeGreaterThan(rowControlsIndex);
    expect(calculateIndex).toBeGreaterThan(-1);
    expect(resetIndex).toBeGreaterThan(calculateIndex);
  });

  it('scales the table and all scoring actions inside one canvas', () => {
    expect(inputTableSource).toContain('getPointerAnchoredScoringTransform');
    expect(inputTableSource).toContain('getInitialScoringCanvasTransform');
    expect(inputTableSource).toContain('const canvasHasInteractedRef = useRef(false);');
    expect(inputTableSource).toContain('const isAltKeyPressedRef = useRef(false);');
    expect(inputTableSource).toContain("window.addEventListener('keydown', handleAltKeyDown);");
    expect(inputTableSource).toContain("window.addEventListener('keyup', handleAltKeyUp);");
    expect(inputTableSource).toContain('isAltKeyPressedRef.current');
    expect(inputTableSource).not.toContain('zoom: tableZoom');
    expect(globalStyles).toContain(".ui-scoring-table-stage[data-scoring-motion='direct']");
    expect(globalStyles).toContain('transition: transform 110ms cubic-bezier(0.22, 1, 0.36, 1);');
    expect(globalStyles).toContain('html.ui-scoring-canvas-active');
    expect(globalStyles).toContain('height: 100dvh;');
  });
});
