import { Mark } from '@tiptap/core';

export const Subscript = Mark.create({
  name: 'subscript',
  excludes: 'superscript',
  parseHTML() {
    return [{ tag: 'sub' }];
  },
  renderHTML() {
    return ['sub', 0];
  },
  addCommands() {
    return {
      toggleSubscript: () => ({ commands }) => commands.toggleMark(this.name),
    };
  },
});

export const Superscript = Mark.create({
  name: 'superscript',
  excludes: 'subscript',
  parseHTML() {
    return [{ tag: 'sup' }];
  },
  renderHTML() {
    return ['sup', 0];
  },
  addCommands() {
    return {
      toggleSuperscript: () => ({ commands }) => commands.toggleMark(this.name),
    };
  },
});
