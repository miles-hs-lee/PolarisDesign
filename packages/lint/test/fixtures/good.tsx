// Should produce ZERO lint errors — uses Polaris tokens correctly
const styles = {
  color: 'var(--polaris-brand-primary)',
  backgroundColor: 'var(--polaris-surface-canvas)',
  fontFamily: 'var(--polaris-font-sans)',
};

export function GoodButton() {
  return (
    <button
      className="bg-brand-primary text-text-on-brand p-4 rounded-polaris-md font-polaris hover:bg-brand-primary-hover"
      style={styles}
    >
      Click
    </button>
  );
}

const css = `
  font-family: var(--polaris-font-sans);
  color: var(--polaris-text-primary);
`;
