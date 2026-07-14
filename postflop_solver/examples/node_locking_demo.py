"""Demo of node locking in the Python API.

Build first:  maturin develop --release
Run:          python examples/node_locking_demo.py
"""
from postflop_solver import Solver

# Create a solver for a river spot
s = Solver(
    oop_range="66+,A8s+,A5s-A4s,AJo+,K9s+,KQo,QTs+,JTs,96s+,85s+,75s+,65s,54s",
    ip_range="QQ-22,AQs-A2s,ATo+,K5s+,KJo+,Q8s+,J8s+,T7s+,96s+,86s+,75s+,64s+,53s+",
    board="Td9d6hQc2d",  # River
    starting_pot=200,
    effective_stack=900,
    bet_sizes="60%, e, a",
    raise_sizes="2.5x",
)

# Initial solve (no locks)
print("=== Initial solve (no locks) ===")
s.solve(iterations=100, verbose=True)
initial_ev = s.average_ev("oop")
print(f"Exploitability: {s.exploitability():.2f}")
print(f"OOP average EV: {initial_ev:.1f} chips

# Lock IP's response to a bet: force AhKh to fold 90% of the time
print("\n=== Locking IP's strategy ===")
s.play("Bet(120)")  # Navigate to IP's node after OOP bets 120
print(f"IP's available actions: {s.available_actions()}")
s.lock_strategy({"AhKh": {"Fold": 0.9, "Call": 0.1}})
print("Locked AhKh: Fold 90%, Call 10%")
s.back_to_root()

# Re-solve: OOP's strategy now exploits IP's locked hands
print("\n=== Re-solving with locked strategy ===")
s.solve(iterations=100, verbose=True)
print(f"Exploitability: {s.exploitability():.2f}")
print(f"OOP EV before lock: {initial_ev:.1f} chips")
print(f"OOP EV after lock:  {s.average_ev('oop'):.1f} chips")
print(f"Exploit gain:       +{s.average_ev('oop') - initial_ev:.1f} chips")

# Show OOP's strategy at root (max-exploit)
print("\n=== OOP's root strategy (exploiting IP's lock) ===")
strat = s.strategy()
print(f"Available actions: {s.available_actions()}")
print(f"Strategy for AhKh (strong hand): {strat['AhKh']}")  # OOP should bet more with AhKh
print(f"Strategy for 5c4c (weak hand): {strat['5c4c']}")  # OOP should check weak hands

# Navigate back to IP's node to inspect the locked vs. unlocked strategy
print("\n=== IP's strategy (locked vs. unlocked) ===")
s.play("Bet(120)")
ip_strat = s.strategy()
print("Locked hand (AhKh):")
print(f"  Fold: {ip_strat['AhKh']['Fold']:.1%}, Call: {ip_strat['AhKh']['Call']:.1%}")  # Matches the lock
print("Unlocked hand (5c4c):")
print(f"  Fold: {ip_strat['5c4c']['Fold']:.1%}, Call: {ip_strat['5c4c']['Call']:.1%}")  # Optimized by solver