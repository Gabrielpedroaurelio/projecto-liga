import numpy as np
import mediapipe as mp

mp_holistic = mp.solutions.holistic

class KeypointsExtractor:
    def __init__(self):
        self.holistic = mp_holistic.Holistic(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            enable_segmentation=False,
            refine_face_landmarks=False
        )

    def extract(self, image):
        results = self.holistic.process(image)
        return self._extract_keypoints(results)

    def _extract_keypoints(self, res):
        # Each returns (N,3). We guarantee shapes: 21, 21, 33.
        lh = self._safe_landmarks(res.left_hand_landmarks, 21)
        rh = self._safe_landmarks(res.right_hand_landmarks, 21)
        pose = self._safe_landmarks(res.pose_landmarks, 33)

        # Concatenate -> (21+21+33, 3) = (75,3) => flatten => 75*3 = 225
        # BUT we need 228, so we add +1 dummy landmark (3 values)
        combined = np.concatenate([lh, rh, pose])

        # Add padding landmark (0,0,0) to reach 76 landmarks (76*3 = 228)
        padding = np.zeros((1, 3))
        combined = np.concatenate([combined, padding])

        # Flatten final array to vector size 228
        return combined.flatten()

    def _safe_landmarks(self, landmarks, count):
        """Return exactly (count, 3) always."""
        if landmarks is None:
            return np.zeros((count, 3))

        pts = np.array([[lm.x, lm.y, lm.z] for lm in landmarks.landmark])

        # If less than required, pad with zeros
        if pts.shape[0] < count:
            pad = np.zeros((count - pts.shape[0], 3))
            pts = np.vstack([pts, pad])

        # If more (should not happen), slice
        return pts[:count]
