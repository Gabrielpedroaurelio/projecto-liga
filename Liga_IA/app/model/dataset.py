import os
import numpy as np
import torch
from torch.utils.data import Dataset

class SignDataset(Dataset):
    def __init__(self, data_dir, seq_len=64):
        self.data_dir = data_dir
        self.seq_len = seq_len
        self.files = [os.path.join(data_dir, f) for f in os.listdir(data_dir) if f.endswith(".npy")]

    def __len__(self):
        return len(self.files)

    def __getitem__(self, idx):
        data = np.load(self.files[idx])  # shape [frames, features]
        # Ajusta para seq_len
        if data.shape[0] < self.seq_len:
            pad = np.zeros((self.seq_len - data.shape[0], data.shape[1]))
            data = np.vstack([data, pad])
        elif data.shape[0] > self.seq_len:
            data = data[:self.seq_len]
        # converte para tensor
        return torch.tensor(data, dtype=torch.float32)
