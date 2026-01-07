import torch
import torch.nn as nn

class SignModel(nn.Module):
    def __init__(self, input_size=228, hidden_size=128, num_layers=2, num_classes=50):
        super(SignModel, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_size, num_classes)

    def forward(self, x):
        # x: [batch, seq_len, input_size]
        out, _ = self.lstm(x)  # out: [batch, seq_len, hidden_size]
        out = out[:, -1, :]  # pega o último output temporal
        out = self.fc(out)   # saída final: logits para classes
        return out
