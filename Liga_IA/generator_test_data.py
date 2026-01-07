import numpy as np
import os

DATA_DIR = "C:/Users/Pc/Desktop/projecto-liga/Liga_IA/data"
os.makedirs(DATA_DIR, exist_ok=True)

NUM_FILES = 10       # número de arquivos de teste
SEQ_LEN = 64         # frames por sequência
FEATURES = 228       # features por frame (21*3 mãos + 33*3 pose)

for i in range(NUM_FILES):
    data = np.random.rand(SEQ_LEN, FEATURES)  # valores aleatórios
    np.save(os.path.join(DATA_DIR, f"sign_{i}.npy"), data)

print("Arquivos de teste criados com sucesso!")
