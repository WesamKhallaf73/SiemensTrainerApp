from awlsim.core.main import AwlSim
import time

try:
    from awlsim.awlcompiler.tokenizer import RawAwlOB, RawAwlFC, RawAwlFB, RawAwlDB
    import awlsim.core.cpu
    awlsim.core.cpu.RawAwlOB = RawAwlOB
    awlsim.core.cpu.RawAwlFC = RawAwlFC
    awlsim.core.cpu.RawAwlFB = RawAwlFB
    awlsim.core.cpu.RawAwlDB = RawAwlDB
except:
    pass

# English Mnemonics: SD = On-Delay
# SE in English is Extended Pulse.
# Let's try SD for "On Delay" behavior.
src = """
ORGANIZATION_BLOCK OB 1
BEGIN
    A I 0.0
    L S5T#5S
    SD T 0     // On-Delay
    A T 0
    = Q 0.0
END_ORGANIZATION_BLOCK
"""

print("Initializing Persistent Sim...")
parser = awlsim.awlcompiler.tokenizer.AwlParser()
parser.parseText(src)
tree = parser.getParseTree()

sim = AwlSim()
sim.load(tree)
sim.cpu.build()
sim.startup()

# Simulating 5 cycles with 1s delays
# Input I0.0 = True
print("Starting Cycle Loop (Persistent)...")
for i in range(6):
    # Set Input
    sim.cpu.storeInputByte(0, 1) # I0.0 = 1
    
    # Run
    sim.runCycle()
    
    # Check Timer
    t0 = sim.cpu.timers[0]
    q0 = sim.cpu.outputs.getDataBytes()[0] & 1
    
    print(f"Cycle {i}: T0={t0.remaining:.3f}s, Running={t0.running}, Q0.0={q0}")
    
    time.sleep(1.0) # Real time wait
