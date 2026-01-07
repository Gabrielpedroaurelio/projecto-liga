import pygame
from pygame.locals import *
from OpenGL.GL import *
from OpenGL.GLU import *
import numpy as np

# Conexões simplificadas para desenhar "esqueleto" (pose + mãos)
CONNECTIONS = [
    (0, 1), (1, 2), (2, 3), (3, 7),  # Braço direito
    (0, 4), (4, 5), (5, 6), (6, 8),  # Braço esquerdo
    (0, 9), (9, 10), (10, 11),        # Tronco
    (11, 12), (12, 13)                # Pernas
]

class Avatar3D:
    def __init__(self, width=800, height=600):
        pygame.init()
        self.width = width
        self.height = height
        self.display = (width, height)
        pygame.display.set_mode(self.display, DOUBLEBUF | OPENGL)
        
        gluPerspective(45, (self.display[0] / self.display[1]), 0.1, 50.0)
        glTranslatef(0.0, -1.0, -5)
        glEnable(GL_DEPTH_TEST)

    def draw_skeleton(self, keypoints):
        """
        keypoints: array de shape (num_points, 3)
        """
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        glPointSize(5)
        
        # Desenha pontos
        glBegin(GL_POINTS)
        for x, y, z in keypoints:
            glVertex3f(x * 2 - 1, -y * 2 + 1, -z)
        glEnd()

        # Desenha conexões
        glColor3f(0, 1, 0)
        glBegin(GL_LINES)
        for a, b in CONNECTIONS:
            if a < len(keypoints) and b < len(keypoints):
                xa, ya, za = keypoints[a]
                xb, yb, zb = keypoints[b]
                glVertex3f(xa * 2 - 1, -ya * 2 + 1, -za)
                glVertex3f(xb * 2 - 1, -yb * 2 + 1, -zb)
        glEnd()

        pygame.display.flip()

    def run_demo(self, sequence):
        """
        sequence: lista de frames, cada frame = keypoints (num_points,3)
        """
        clock = pygame.time.Clock()
        for kp in sequence:
            arr = np.array(kp).reshape(-1, 3)
            self.draw_skeleton(arr)
            clock.tick(30)  # 30 FPS
        # NUNCA chamar pygame.quit() aqui
