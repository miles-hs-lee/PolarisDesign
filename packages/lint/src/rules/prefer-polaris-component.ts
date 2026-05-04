import type { Rule } from 'eslint';

/**
 * Map from native HTML element to its @polaris/ui replacement.
 * Used to flag JSX usage of bare native elements that should be replaced.
 */
const REPLACEMENTS: Record<string, string> = {
  button: 'Button',
  input: 'Input',
  textarea: 'Textarea',
  select: 'Select',
  dialog: 'Dialog',
};

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prefer @polaris/ui components over native HTML elements that have a Polaris equivalent (button, input, textarea, select, dialog).',
    },
    schema: [],
    messages: {
      replace:
        'Native <{{native}}> in feature code is not allowed — use <{{replacement}}> from @polaris/ui instead. (If this is inside @polaris/ui itself or a primitive layer, disable with a per-line eslint-disable comment.)',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node: any) {
        const name = node.name;
        if (!name || name.type !== 'JSXIdentifier') return;
        const native = name.name;
        if (typeof native !== 'string') return;
        const replacement = REPLACEMENTS[native];
        if (!replacement) return;
        context.report({
          node,
          messageId: 'replace',
          data: { native, replacement },
        });
      },
    };
  },
};

export default rule;
