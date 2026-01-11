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

sim = AwlSim()
sim.cpu.build()
sim.startup()

t0 = sim.cpu.timers[0]
print(f"Initial deadline: {t0.deadline}")

# Set a value by remaining
t0.remaining = 10.0
print(f"Set remaining=10.0. Deadline: {t0.deadline}. Now: {time.time()}")
expected_deadline = time.time() + 10.0
diff = abs(t0.deadline - expected_deadline)
print(f"Diff from expected: {diff}")

# Try setting deadline directly
new_deadline = time.time() + 20.0
try:
    t0.deadline = new_deadline
    print(f"Set deadline manually to {new_deadline}. Remaining: {t0.remaining}")
except Exception as e:
    print(f"Set deadline failed: {e}")
