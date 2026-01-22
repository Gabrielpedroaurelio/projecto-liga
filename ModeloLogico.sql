
DROP DATABASE IF EXISTS vota_aqui;
CREATE DATABASE vota_aqui
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE vota_aqui;

CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_usuario VARCHAR(100) NOT NULL,
    email_usuario VARCHAR(150) NOT NULL UNIQUE,
    senha_usuario VARCHAR(255) NOT NULL,
    caminho_imagem VARCHAR(255),
    ultimo_login DATETIME,
    status ENUM('ativo', 'inativo', 'banido') DEFAULT 'ativo',
    tipo_usuario ENUM('admin', 'usuario') DEFAULT 'usuario'
) ENGINE=InnoDB;


CREATE TABLE Enquete (
    id_enquete INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME,
    status ENUM('ativa', 'encerrada', 'rascunho') DEFAULT 'rascunho',
    id_usuario INT NOT NULL,
    CONSTRAINT fk_enquete_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================
-- TABELA: OpcaoVoto
-- =========================================
CREATE TABLE OpcaoVoto (
    id_opcao_voto INT AUTO_INCREMENT PRIMARY KEY,
    designacao VARCHAR(100) NOT NULL,
    descricao TEXT
) ENGINE=InnoDB;


CREATE TABLE Enquete_Opcao_Voto (
    id_enquete_opcao_voto INT AUTO_INCREMENT PRIMARY KEY,
    id_enquete INT NOT NULL,
    id_opcao_voto INT NOT NULL,
    CONSTRAINT fk_eov_enquete
        FOREIGN KEY (id_enquete)
        REFERENCES Enquete(id_enquete)
        ON DELETE CASCADE,
    CONSTRAINT fk_eov_opcao
        FOREIGN KEY (id_opcao_voto)
        REFERENCES OpcaoVoto(id_opcao_voto)
        ON DELETE CASCADE,
    UNIQUE (id_enquete, id_opcao_voto)
) ENGINE=InnoDB;



CREATE TABLE Voto (
    id_voto INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_opcao_voto INT NOT NULL,
    id_enquete INT NOT NULL,
    data_voto DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_voto_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE,
    CONSTRAINT fk_voto_opcao
        FOREIGN KEY (id_opcao_voto)
        REFERENCES OpcaoVoto(id_opcao_voto),
    CONSTRAINT fk_voto_enquete
        FOREIGN KEY (id_enquete)
        REFERENCES Enquete(id_enquete),
    UNIQUE (id_usuario, id_enquete)
) ENGINE=InnoDB;


CREATE INDEX idx_usuario_email ON Usuario(email_usuario);
CREATE INDEX idx_enquete_status ON Enquete(status);
CREATE INDEX idx_voto_enquete ON Voto(id_enquete);
CREATE INDEX idx_voto_opcao ON Voto(id_opcao_voto);


CREATE VIEW vw_resultado_enquete AS
SELECT
    e.id_enquete,
    e.titulo,
    o.id_opcao_voto,
    o.designacao,
    COUNT(v.id_voto) AS total_votos
FROM Enquete e
JOIN Enquete_Opcao_Voto eov ON e.id_enquete = eov.id_enquete
JOIN OpcaoVoto o ON o.id_opcao_voto = eov.id_opcao_voto
LEFT JOIN Voto v
    ON v.id_opcao_voto = o.id_opcao_voto
    AND v.id_enquete = e.id_enquete
GROUP BY e.id_enquete, o.id_opcao_voto;

CREATE VIEW vw_enquetes_usuario AS
SELECT
    u.id_usuario,
    u.nome_usuario,
    e.id_enquete,
    e.titulo,
    e.status
FROM Usuario u
JOIN Enquete e ON e.id_usuario = u.id_usuario;


DELIMITER $$

CREATE FUNCTION fn_total_votos_enquete(p_id_enquete INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT;
    SELECT COUNT(*) INTO total
    FROM Voto
    WHERE id_enquete = p_id_enquete;
    RETURN total;
END$$

CREATE FUNCTION fn_total_votos_opcao(p_id_enquete INT, p_id_opcao INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT;
    SELECT COUNT(*) INTO total
    FROM Voto
    WHERE id_enquete = p_id_enquete
      AND id_opcao_voto = p_id_opcao;
    RETURN total;
END$$

DELIMITER ;


DELIMITER $$

CREATE TRIGGER trg_bloqueia_voto_enquete_encerrada
BEFORE INSERT ON Voto
FOR EACH ROW
BEGIN
    DECLARE v_status VARCHAR(20);

    SELECT status INTO v_status
    FROM Enquete
    WHERE id_enquete = NEW.id_enquete;

    IF v_status <> 'ativa' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Enquete não está ativa para votação.';
    END IF;
END$$


CREATE TRIGGER trg_encerrar_enquete
BEFORE UPDATE ON Enquete
FOR EACH ROW
BEGIN
    IF NEW.data_fim IS NOT NULL
       AND NEW.data_fim < NOW() THEN
        SET NEW.status = 'encerrada';
    END IF;
END$$

DELIMITER ;
