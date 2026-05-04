import type { Rule } from 'eslint';

const ARBITRARY_REGEX = /\b[a-z][a-z0-9-]*-\[[^\]]+\]/g;

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow Tailwind arbitrary values; use Polaris token-based classes (e.g. bg-brand-primary, p-4) instead.',
    },
    schema: [],
    messages: {
      arbitrary: 'Tailwind arbitrary value "{{value}}" is not allowed. Use a token-based class (bg-brand-primary, text-fg-primary, p-4, rounded-polaris-md, etc.) instead.',
    },
  },
  create(context) {
    function check(value: string, node: Rule.Node) {
      const matches = value.match(ARBITRARY_REGEX);
      if (matches) {
        for (const match of matches) {
          context.report({ node, messageId: 'arbitrary', data: { value: match } });
        }
      }
    }
    return {
      Literal(node) {
        if (typeof node.value === 'string') check(node.value, node as Rule.Node);
      },
      TemplateElement(node) {
        check(node.value.raw, node as unknown as Rule.Node);
      },
    };
  },
};

export default rule;
