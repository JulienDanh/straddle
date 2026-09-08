import { RangeGrid } from '../components/RangeGrid'
import { HoleCards, Action } from '../components/ui'

// Sandbox page for testing RangeGrid display with real combo-data strings.
// Each grid uses the Pio/GTO Wizard export format (0-1 scale per combo).

const SAMPLE_RAISE = '5d5c:0.037,5h5c:0.037,5h5d:0.037,5s5c:0.037,5s5d:0.037,5s5h:0.037,6d6c:0.6014,6h6c:0.6014,6h6d:0.6014,6s6c:0.6014,6s6d:0.6014,6s6h:0.6014,7d7c:1,7h7c:1,7h7d:1,7s7c:1,7s7d:1,7s7h:1,8d8c:1,8h8c:1,8h8d:1,8s8c:1,8s8d:1,8s8h:1,9d9c:1,9h9c:1,9h9d:1,9s9c:1,9s9d:1,9s9h:1,Tc9c:0.0108,Td9d:0.0108,TdTc:1,Th9h:0.0108,ThTc:1,ThTd:1,Ts9s:0.0108,TsTc:1,TsTd:1,TsTh:1,JcTc:1,JdTd:1,JdJc:1,JhTh:1,JhJc:1,JhJd:1,JsTs:1,JsJc:1,JsJd:1,JsJh:1,Qc9c:0.0007,QcTc:1,QcJc:1,QcJd:0.2599,QcJh:0.2599,QcJs:0.2599,Qd9d:0.0007,QdTd:1,QdJc:0.2599,QdJd:1,QdJh:0.2599,QdJs:0.2599,QdQc:0.9999,Qh9h:0.0007,QhTh:1,QhJc:0.2599,QhJd:0.2599,QhJh:1,QhJs:0.2599,QhQc:0.9999,QhQd:0.9999,Qs9s:0.0007,QsTs:1,QsJc:0.2599,QsJd:0.2599,QsJh:0.2599,QsJs:1,QsQc:0.9999,QsQd:0.9999,QsQh:0.9999,Kc4c:0.2723,Kc5c:0.298,Kc6c:0.7539,Kc7c:0.8878,Kc8c:1,Kc9c:1,KcTc:1,KcTd:0.2073,KcTh:0.2073,KcTs:0.2073,KcJc:1,KcJd:1,KcJh:1,KcJs:1,KcQc:1,KcQd:1,KcQh:1,KcQs:1,Kd4d:0.2723,Kd5d:0.298,Kd6d:0.7539,Kd7d:0.8878,Kd8d:1,Kd9d:1,KdTc:0.2073,KdTd:1,KdTh:0.2073,KdTs:0.2073,KdJc:1,KdJd:1,KdJh:1,KdJs:1,KdQc:1,KdQd:1,KdQh:1,KdQs:1,KdKc:1,Kh4h:0.2723,Kh5h:0.298,Kh6h:0.7539,Kh7h:0.8878,Kh8h:1,Kh9h:1,KhTc:0.2073,KhTd:0.2073,KhTh:1,KhTs:0.2073,KhJc:1,KhJd:1,KhJh:1,KhJs:1,KhQc:1,KhQd:1,KhQh:1,KhQs:1,KhKc:1,KhKd:1,Ks4s:0.2723,Ks5s:0.298,Ks6s:0.7539,Ks7s:0.8878,Ks8s:1,Ks9s:1,KsTc:0.2073,KsTd:0.2073,KsTh:0.2073,KsTs:1,KsJc:1,KsJd:1,KsJh:1,KsJs:1,KsQc:1,KsQd:1,KsQh:1,KsQs:1,KsKc:1,KsKd:1,KsKh:1,Ac2c:1,Ac3c:1,Ac4c:1,Ac4d:0.0006,Ac4h:0.0006,Ac4s:0.0006,Ac5c:1,Ac5d:0.6107,Ac5h:0.6107,Ac5s:0.6107,Ac6c:1,Ac7c:1,Ac8c:1,Ac8d:0.2101,Ac8h:0.2101,Ac8s:0.2101,Ac9c:1,Ac9d:1,Ac9h:1,Ac9s:1,AcTc:1,AcTd:1,AcTh:1,AcTs:1,AcJc:1,AcJd:1,AcJh:1,AcJs:1,AcQc:1,AcQd:1,AcQh:1,AcQs:1,AcKc:1,AcKd:1,AcKh:1,AcKs:1,Ad2d:1,Ad3d:1,Ad4c:0.0006,Ad4d:1,Ad4h:0.0006,Ad4s:0.0006,Ad5c:0.6107,Ad5d:1,Ad5h:0.6107,Ad5s:0.6107,Ad6d:1,Ad7d:1,Ad8c:0.2101,Ad8d:1,Ad8h:0.2101,Ad8s:0.2101,Ad9c:1,Ad9d:1,Ad9h:1,Ad9s:1,AdTc:1,AdTd:1,AdTh:1,AdTs:1,AdJc:1,AdJd:1,AdJh:1,AdJs:1,AdQc:1,AdQd:1,AdQh:1,AdQs:1,AdKc:1,AdKd:1,AdKh:1,AdKs:1,AdAc:1,Ah2h:1,Ah3h:1,Ah4c:0.0006,Ah4d:0.0006,Ah4h:1,Ah4s:0.0006,Ah5c:0.6107,Ah5d:0.6107,Ah5h:1,Ah5s:0.6107,Ah6h:1,Ah7h:1,Ah8c:0.2101,Ah8d:0.2101,Ah8h:1,Ah8s:0.2101,Ah9c:1,Ah9d:1,Ah9h:1,Ah9s:1,AhTc:1,AhTd:1,AhTh:1,AhTs:1,AhJc:1,AhJd:1,AhJh:1,AhJs:1,AhQc:1,AhQd:1,AhQh:1,AhQs:1,AhKc:1,AhKd:1,AhKh:1,AhKs:1,AhAc:1,AhAd:1,As2s:1,As3s:1,As4c:0.0006,As4d:0.0006,As4h:0.0006,As4s:1,As5c:0.6107,As5d:0.6107,As5h:0.6107,As5s:1,As6s:1,As7s:1,As8c:0.2101,As8d:0.2101,As8h:0.2101,As8s:1,As9c:1,As9d:1,As9h:1,As9s:1,AsTc:1,AsTd:1,AsTh:1,AsTs:1,AsJc:1,AsJd:1,AsJh:1,AsJs:1,AsQc:1,AsQd:1,AsQh:1,AsQs:1,AsKc:1,AsKd:1,AsKh:1,AsKs:1,AsAc:1,AsAd:1,AsAh:1'

export function DesignSystemPage() {
  return (
    <div className="rv-page">
      <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 700 }}>Design System</h2>

      <div style={{ marginBottom: 40 }}>
        <h3 style={{ marginBottom: 12, fontSize: 14, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Hole Cards</h3>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <HoleCards cards="AsKd" size="sm" />
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--muted)' }}>sm · AsKd</div>
          </div>
          <div>
            <HoleCards cards="AhKh" size="md" />
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--muted)' }}>md · AhKh</div>
          </div>
          <div>
            <HoleCards cards="7c2d" size="lg" />
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--muted)' }}>lg · 7c2d</div>
          </div>
          <div>
            <HoleCards cards="ThTd" size="md" />
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--muted)' }}>md · ThTd</div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h3 style={{ marginBottom: 12, fontSize: 14, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Action badges</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <Action variant="fold">Fold</Action>
          <Action variant="call">Call</Action>
          <Action variant="check">Check</Action>
          <Action variant="bet">Bet</Action>
          <Action variant="raise">Raise 6bb</Action>
          <Action variant="allIn">All-in</Action>
        </div>
        <div style={{ marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>
          Inline: <Action variant="raise">Raise</Action> the <Action variant="call">Call</Action> and <Action variant="fold">Fold</Action> the rest.
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h3 style={{ marginBottom: 12, fontSize: 14, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Compact range (inline)</h3>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>UTG RFI</div>
            <RangeGrid compact raise={SAMPLE_RAISE} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>BB vs UTG (call + raise)</div>
            <RangeGrid compact raise={SAMPLE_RAISE} call="5d5c:0.037,6d6c:0.6,7d7c:0.5,8d8c:0.3,Kc4c:0.2723,Kc5c:0.298,KcTd:0.2073,Ac4d:0.0006,Ac5d:0.6107,Ac8d:0.2101,QcJd:0.2599,Tc9c:0.0108,Qc9c:0.0007" />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h3 style={{ marginBottom: 12, fontSize: 14, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Single action (raise only)</h3>
        <RangeGrid
          title="UTG RFI · 20bb"
          subtitle="ChipEV"
          raise={SAMPLE_RAISE}
        />
      </div>

      <div style={{ marginBottom: 40 }}>
        <h3 style={{ marginBottom: 12, fontSize: 14, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Raise + Call</h3>
        <RangeGrid
          title="BB vs UTG RFI · 20bb"
          subtitle="ChipEV · 20bb"
          raise={SAMPLE_RAISE}
          call="5d5c:0.037,6d6c:0.6,7d7c:0.5,8d8c:0.3,Kc4c:0.2723,Kc5c:0.298,KcTd:0.2073,Ac4d:0.0006,Ac5d:0.6107,Ac8d:0.2101,Ad4c:0.0006,Ad5c:0.6107,Ad8c:0.2101,Ah4c:0.0006,Ah5c:0.6107,Ah8c:0.2101,As4c:0.0006,As5c:0.6107,As8c:0.2101,QcJd:0.2599,QcJh:0.2599,QcJs:0.2599,QdJc:0.2599,QdJh:0.2599,QdJs:0.2599,QhJc:0.2599,QhJd:0.2599,QhJs:0.2599,QsJc:0.2599,QsJd:0.2599,QsJh:0.2599,Tc9c:0.0108,Td9d:0.0108,Th9h:0.0108,Ts9s:0.0108,Qc9c:0.0007,Qd9d:0.0007,Qh9h:0.0007,Qs9s:0.0007"
        />
      </div>

      <div style={{ marginBottom: 40 }}>
        <h3 style={{ marginBottom: 12, fontSize: 14, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.6 }}>All-in spot (fold + call all-in)</h3>
        <RangeGrid
          title="BB vs UTG All-in · 20bb"
          subtitle="ChipEV · 20bb"
          fold="72o:1,73o:1,74o:1,82o:1,83o:1,92o:1,93o:1,T2o:1,T3o:1,J2o:1,J3o:1,J4o:1,Q2o:1,Q3o:1,Q4o:1,K2o:1,K3o:1,K4o:1,A2o:0.3,A3o:0.2,A4o:0.1,32s:1,42s:1,43s:1,52s:1,53s:1,62s:1,63s:1,72s:1,73s:1,74s:1,82s:1,83s:1,84s:1,92s:1,93s:1,94s:1,95s:1,T2s:1,T3s:1,T4s:0.5,T5s:0.3,J2s:1,J3s:1,J4s:0.2,Q2s:1,Q3s:1,Q4s:0.1,Q5s:0.05,K2s:1,K3s:0.8,K4s:0.3,K5s:0.1,A2s:0.05,A3s:0.03,A4s:0.01"
          allIn="AA:1,KK:1,QQ:1,JJ:1,TT:1,99:1,88:1,77:1,66:1,55:1,44:1,33:1,22:1,AKs:1,AQs:1,AJs:1,ATs:1,A9s:1,A8s:0.8,A7s:0.6,A6s:0.4,A5s:0.5,A4s:0.3,A3s:0.2,A2s:0.1,AKo:1,AQo:1,AJo:1,ATo:0.8,A9o:0.5,A8o:0.3,A7o:0.1,KQs:1,KJs:1,KTs:0.8,K9s:0.5,KQo:1,KJo:0.8,KTo:0.5,QJs:1,QTs:0.5,JTs:0.3,T9s:0.2,98s:0.1"
        />
      </div>
    </div>
  )
}

export default DesignSystemPage
