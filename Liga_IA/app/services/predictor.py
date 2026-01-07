import torch
from app.model.sign_model import SignModel

class Predictor:
    def __init__(self, model_path, device=None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model = SignModel().to(self.device)
        self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        self.model.eval()

    def predict(self, seq):
        # seq: lista de keypoints [seq_len, features]
        import numpy as np
        import torch
        x = torch.tensor(np.array(seq), dtype=torch.float32).unsqueeze(0).to(self.device)
        with torch.no_grad():
            out = self.model(x)
        return int(out.argmax(dim=-1).item())
