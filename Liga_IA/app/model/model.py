import torch
import torch.nn as nn

class SignClassifier(nn.Module):
    def __init__(self, input_size=150, hidden_size=128, num_classes=10):
        super(SignClassifier, self).__init__()

        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=2,
            batch_first=True
        )

        self.fc = nn.Linear(hidden_size, num_classes)

    def forward(self, x):
        out, _ = self.lstm(x)
        out = out[:, -1, :]  # último frame
        out = self.fc(out)
        return out
