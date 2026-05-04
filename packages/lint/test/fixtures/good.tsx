// Should produce ZERO lint errors — uses Polaris tokens correctly
const styles = {
  color: 'var(--polaris-brand-primary)',
  backgroundColor: 'var(--polaris-surface-canvas)',
  fontFamily: 'var(--polaris-font-sans)',
};

export function GoodCard() {
  return (
    <div
      className="bg-brand-primary text-text-on-brand p-4 rounded-polaris-md font-polaris"
      style={styles}
    >
      Click
    </div>
  );
}

const css = `
  font-family: var(--polaris-font-sans);
  color: var(--polaris-text-primary);
`;
