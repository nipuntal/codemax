// CodeMirror 6, assembled from parts (no basicSetup) and loaded as its own
// chunk, so the shell paints before the editor arrives.
import { EditorState, type Extension } from '@codemirror/state';
import {
  EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter,
  drawSelection, highlightSpecialChars, dropCursor, rectangularSelection,
} from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import {
  indentOnInput, bracketMatching, syntaxHighlighting, HighlightStyle, StreamLanguage, indentUnit,
} from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { python } from '@codemirror/lang-python';
import { sql, PostgreSQL } from '@codemirror/lang-sql';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { tags as t } from '@lezer/highlight';
import type { Lang } from './data';

// Colours come from CSS variables, so light/dark follows the page theme.
const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.definitionKeyword, t.moduleKeyword], color: 'var(--syn-kw)' },
  { tag: [t.string, t.special(t.string), t.regexp], color: 'var(--syn-str)' },
  { tag: [t.number, t.bool, t.null, t.atom], color: 'var(--syn-num)' },
  { tag: [t.comment, t.lineComment, t.blockComment, t.meta], color: 'var(--syn-com)', fontStyle: 'italic' },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.definition(t.function(t.variableName))], color: 'var(--syn-fn)' },
  { tag: [t.typeName, t.className, t.standard(t.variableName)], color: 'var(--syn-type)' },
  { tag: [t.special(t.variableName), t.variableName], color: 'var(--syn-var)' },
  { tag: [t.operator, t.punctuation, t.bracket], color: 'var(--syn-op)' },
]);

const theme = EditorView.theme({
  '&': { height: '100%', fontSize: '13px', backgroundColor: 'transparent', color: 'var(--text)' },
  '.cm-scroller': { fontFamily: 'var(--mono)', lineHeight: '1.6' },
  '.cm-content': { padding: '12px 0', caretColor: 'var(--accent)' },
  '.cm-gutters': { backgroundColor: 'transparent', border: 'none', color: 'var(--text-3)' },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 12px 0 16px', minWidth: '40px' },
  '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'var(--line-active)' },
  '.cm-cursor': { borderLeftColor: 'var(--accent)', borderLeftWidth: '2px' },
  '&.cm-focused': { outline: 'none' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': { backgroundColor: 'var(--selection) !important' },
  '.cm-matchingBracket': { backgroundColor: 'var(--line-active)', outline: '1px solid var(--border)' },
  '.cm-selectionMatch': { backgroundColor: 'var(--selection-match)' },
  '.cm-panels': { backgroundColor: 'var(--surface-2)', color: 'var(--text)', borderColor: 'var(--border)' },
});

const languages: Record<Lang, () => Extension> = {
  shell: () => StreamLanguage.define(shell),
  python: () => python(),
  sql: () => sql({ dialect: PostgreSQL }),
  text: () => [],
};

const base: Extension = [
  lineNumbers(), highlightActiveLineGutter(), highlightSpecialChars(), history(), drawSelection(),
  dropCursor(), indentOnInput(), bracketMatching(), closeBrackets(), rectangularSelection(),
  highlightActiveLine(), highlightSelectionMatches(), syntaxHighlighting(highlight), theme,
  indentUnit.of('    '), EditorState.tabSize.of(4),
  keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...searchKeymap, ...historyKeymap, indentWithTab]),
];

export function createState(doc: string, lang: Lang, opts: { readOnly?: boolean; onChange?: (doc: string) => void }) {
  return EditorState.create({
    doc,
    extensions: [
      base,
      languages[lang](),
      opts.readOnly ? [EditorState.readOnly.of(true), EditorView.editable.of(false)] : [],
      opts.onChange ? EditorView.updateListener.of((u) => u.docChanged && opts.onChange!(u.state.doc.toString())) : [],
    ],
  });
}

export function createView(parent: HTMLElement) {
  return new EditorView({ parent });
}

export type { EditorState, EditorView };
