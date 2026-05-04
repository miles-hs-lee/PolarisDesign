import type { Rule } from 'eslint';

const HEX_REGEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
const COLOR_FN_REGEX = /\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\s*\(/g;

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded color values; use Polaris design tokens (CSS variables or @polaris/ui token imports).',
    },
    schema: [],
    messages: {
      hex: 'Hardcoded hex color "{{value}}" is not allowed. Use a Polaris token (e.g. var(--polaris-brand-primary), bg-brand-primary class, or import from @polaris/ui/tokens).',
      fn: 'Hardcoded color function "{{value}}" is not allowed. Use a Polaris token instead.',
    },
  },
  create(context) {
    function check(value: string, node: Rule.Node) {
      const hexMatches = value.match(HEX_REGEX);
      if (hexMatches) {
        for (const match of hexMatches) {
          context.report({ node, messageId: 'hex', data: { value: match } });
        }
      }
      const fnMatches = value.match(COLOR_FN_REGEX);
      if (fnMatches) {
        for (const match of fnMatches) {
          context.report({ node, messageId: 'fn', data: { value: match.trim() } });
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
