from awlsim.core.main import AwlSim
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

print(f"timers type: {type(sim.cpu.timers)}")
print(f"timers len: {len(sim.cpu.timers)}")
if len(sim.cpu.timers) > 0:
    t0 = sim.cpu.timers[0]
    print(f"Timer 0 status: {t0.status}")
    print(f"Timer 0 running: {t0.running}")
    print(f"Timer 0 remaining: {t0.remaining}")
    
    # Try setting
    print("Trying to set values...")
    try:
        t0.status = 1
        t0.running = True
        t0.remaining = 10.5
        print(f"Set OK: status={t0.status}, running={t0.running}, remaining={t0.remaining}")
    except Exception as e:
        print(f"Set failed: {e}")
