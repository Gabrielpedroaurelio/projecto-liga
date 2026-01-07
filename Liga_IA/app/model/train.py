import torch
from torch.utils.data import DataLoader
import torch.nn as nn
import torch.optim as optim
from app.model.dataset import SignDataset
from app.model.sign_model import SignModel

# Configurações
DATA_DIR = "C:/Users/Pc/Desktop/projecto-liga/Liga_IA/data"
SEQ_LEN = 64
BATCH_SIZE = 16
EPOCHS = 20
LEARNING_RATE = 1e-3
NUM_CLASSES = 50
INPUT_SIZE = 228

# Dataset e DataLoader
dataset = SignDataset(DATA_DIR, SEQ_LEN)
dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

# Modelo
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = SignModel(INPUT_SIZE, hidden_size=128, num_layers=2, num_classes=NUM_CLASSES).to(device)

# Loss e optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

# Treino
for epoch in range(EPOCHS):
    for i, data in enumerate(dataloader):
        inputs = data.to(device)         # [batch, seq_len, input_size]
        labels = torch.randint(0, NUM_CLASSES, (inputs.size(0),)).to(device)  # labels fictícios para teste
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
    print(f"Epoch [{epoch+1}/{EPOCHS}], Loss: {loss.item():.4f}")

# Salvar modelo
torch.save(model.state_dict(), "sign_model.pth")
