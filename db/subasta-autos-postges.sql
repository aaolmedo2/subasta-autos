CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('VENDEDOR', 'COMPRADOR', 'ADMINISTRADOR')),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE autos (
    id SERIAL PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    año INT NOT NULL,
    precio_base DECIMAL(10, 2) NOT NULL,
    vendedor_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    vendido BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subastas (
    id SERIAL PRIMARY KEY,
    auto_id INT REFERENCES autos(id) ON DELETE CASCADE,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    precio_minimo DECIMAL(10, 2) NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    ganador_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    CHECK (fecha_fin > fecha_inicio)
);

CREATE TABLE pujas (
    id SERIAL PRIMARY KEY,
    subasta_id INT REFERENCES subastas(id) ON DELETE CASCADE,
    comprador_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_puja TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (monto > 0)
);

-- Insertar un usuario vendedor
INSERT INTO usuarios (nombre, email, contraseña_hash, rol) 
VALUES ('Juan Perez', 'juan@example.com', 'hashed_password', 'VENDEDOR');

-- Insertar un auto
INSERT INTO autos (marca, modelo, año, precio_base, vendedor_id) 
VALUES ('Toyota', 'Corolla', 2020, 15000.00, 1);

-- Crear una subasta
INSERT INTO subastas (auto_id, fecha_inicio, fecha_fin, precio_minimo) 
VALUES (1, '2023-10-01 10:00:00', '2023-10-01 12:00:00', 16000.00);

-- Insertar una puja
INSERT INTO pujas (subasta_id, comprador_id, monto) 
VALUES (1, 2, 16500.00);