from awlsim.core.main import AwlSim

try:
    from awlsim.awlcompiler.tokenizer import RawAwlOB, RawAwlFC, RawAwlFB, RawAwlDB
    import awlsim.core.cpu
    awlsim.awlcompiler.tokenizer.AwlParser
    awlsim.core.cpu.RawAwlOB = RawAwlOB
    awlsim.core.cpu.RawAwlFC = RawAwlFC
    awlsim.core.cpu.RawAwlFB = RawAwlFB
    awlsim.core.cpu.RawAwlDB = RawAwlDB
except:
    pass

src = """
DATA_BLOCK DB 1
    STRUCT
        Val1 : INT := 123;
        Val2 : WORD := W#16#ABCD;
    END_STRUCT
BEGIN
END_DATA_BLOCK

ORGANIZATION_BLOCK OB 1
BEGIN
    L DB1.DBW 0
    T MW 0
END_ORGANIZATION_BLOCK
"""

parser = awlsim.awlcompiler.tokenizer.AwlParser()
parser.parseText(src)
tree = parser.getParseTree()

sim = AwlSim()
sim.load(tree)
sim.cpu.build()
sim.startup()

sim.runCycle()

# print("DBs:", sim.cpu.datablocks)
print(f"CPU Dir: {dir(sim.cpu)}")
db_0 = sim.cpu.getDB(1) # Try getter
print(f"Get DB 1: {db_0}")
if db_0:
    print(f"DB 1 Struct: {db_0.struct}")
    print(f"DB 1 Struct Dir: {dir(db_0.struct)}")
    if hasattr(db_0.struct, 'getDataBytes'):
        print(f"DB 1 Data: {db_0.struct.getDataBytes().hex()}")

    print(f"DB 1 StructInstance: {db_0.structInstance}")
    if hasattr(db_0, 'structInstance') and db_0.structInstance:
         print(f"DB 1 StructInstance Dir: {dir(db_0.structInstance)}")
         # Assuming AwlStructInstance has getDataBytes?
         if hasattr(db_0.structInstance, 'getDataBytes'):
             print(f"DB 1 Instance Data: {db_0.structInstance.getDataBytes().hex()}")

    if hasattr(db_0.structInstance, 'memory'):
        print(f"DB 1 Memory: {db_0.structInstance.memory}")
        print(f"DB 1 Memory Bytes: {db_0.structInstance.memory.getDataBytes().hex()}")

print("Iterating all DBs:")
for db in sim.cpu.allDBs():
    print(f"Found DB {db.index}")
