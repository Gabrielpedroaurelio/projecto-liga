import cv2
from collections import deque
from app.services.keypoints_extractor import KeypointsExtractor
from app.services.predictor import Predictor
from app.services.avatar_3d import Avatar3D
import numpy as np

SEQ_LEN = 32  # tamanho da sequência
MODEL_PATH = "sign_model.pth"


# ────────────────────────────────────────────────────────────────
# FUNÇÃO PARA GARANTIR QUE O VETOR SEMPRE TENHA 228 FEATURES
# ────────────────────────────────────────────────────────────────
def normalize_vector(vec, expected_len=228):
    """Garante que o vetor tenha sempre o tamanho correto."""
    if len(vec) == expected_len:
        return vec

    if len(vec) < expected_len:
        # Completa com zeros
        return vec + [0.0] * (expected_len - len(vec))

    # Se vier maior por erro, corta
    return vec[:expected_len]



# ────────────────────────────────────────────────────────────────
# LOOP PRINCIPAL
# ────────────────────────────────────────────────────────────────
def run():
    cap = cv2.VideoCapture(0)
    extractor = KeypointsExtractor()
    predictor = Predictor(MODEL_PATH)
    seq = deque(maxlen=SEQ_LEN)

    # Avatar 3D
    avatar = Avatar3D()

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Extrai keypoints (retorna lista de floats)
        kp = extractor.extract(frame)

        # 🔥 AQUI aplicamos a normalização que evita o erro 228 vs 225!
        kp = normalize_vector(kp)

        seq.append(kp)

        # Quando a sequência estiver completa = enviamos ao modelo
        if len(seq) == SEQ_LEN:
            pred_class = predictor.predict(list(seq))
            print(f"Predicted Sign: {pred_class}")

            # Atualiza o avatar com a sequência
            avatar.run_demo(list(seq)) #DESATIVADO TEMPORARIAMENTE POS NAO 

        # Mostra webcam
        cv2.imshow("Sign Detection Webcam", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()



if __name__ == "__main__":
    run()
