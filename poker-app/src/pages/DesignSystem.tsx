export function DesignSystemPage() {
  return (
    <div className="rv-page">
      <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 700 }}>Design System</h2>
      <p style={{ marginBottom: 20, fontSize: 13, color: 'var(--muted)' }}>
        Full component documentation available in <a href="./storybook/" style={{ color: 'var(--accent)' }}>Storybook</a>.
      </p>
      <p style={{ fontSize: 13, color: 'var(--muted)' }}>
        All components, variants, and interactive demos have been moved to Storybook.
        Run <code style={{ background: 'var(--dark)', border: '1px solid var(--line)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>npm run storybook</code> locally,
        or view the hosted version at <a href="./storybook/" style={{ color: 'var(--accent)' }}>/straddle/storybook/</a>.
      </p>
    </div>
  )
}

export default DesignSystemPage
