-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 18-02-2025 a las 01:10:11
-- Versión del servidor: 8.3.0
-- Versión de PHP: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `subasta-autos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pujas`
--

DROP TABLE IF EXISTS `pujas`;
CREATE TABLE IF NOT EXISTS `pujas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `comprador_id` int DEFAULT NULL,
  `subasta_id` int DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `comprador_id` (`comprador_id`),
  KEY `subasta_id` (`subasta_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `pujas`
--

INSERT INTO `pujas` (`id`, `comprador_id`, `subasta_id`, `monto`, `fecha`) VALUES
(1, 2, 1, 15500.00, '2025-02-18 01:09:46'),
(2, 4, 1, 16000.00, '2025-02-18 01:09:46'),
(3, 2, 2, 12500.00, '2025-02-18 01:09:46'),
(4, 4, 4, 14500.00, '2025-02-18 01:09:46'),
(5, 2, 5, 13000.00, '2025-02-18 01:09:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subastas`
--

DROP TABLE IF EXISTS `subastas`;
CREATE TABLE IF NOT EXISTS `subastas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha_inicio` datetime DEFAULT NULL,
  `duracion` int DEFAULT NULL,
  `estado` enum('activa','finalizada','cancelada') COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `subastas`
--

INSERT INTO `subastas` (`id`, `fecha_inicio`, `duracion`, `estado`) VALUES
(1, '2025-02-17 10:00:00', 120, 'activa'),
(2, '2025-02-16 15:00:00', 90, 'finalizada'),
(3, '2025-02-15 18:00:00', 60, 'cancelada'),
(4, '2025-02-14 20:00:00', 180, 'finalizada'),
(5, '2025-02-13 09:00:00', 150, 'activa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `rol` enum('vendedor','comprador','admin') COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password_hash`, `rol`, `estado`) VALUES
(1, 'Juan Pérez', 'juan.perez@example.com', 'hashed_password_1', 'vendedor', 1),
(2, 'Ana Gómez', 'ana.gomez@example.com', 'hashed_password_2', 'comprador', 1),
(3, 'Carlos López', 'carlos.lopez@example.com', 'hashed_password_3', 'vendedor', 1),
(4, 'María Ruiz', 'maria.ruiz@example.com', 'hashed_password_4', 'comprador', 1),
(5, 'Admin', 'admin@example.com', 'hashed_admin_password', 'admin', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculos`
--

DROP TABLE IF EXISTS `vehiculos`;
CREATE TABLE IF NOT EXISTS `vehiculos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vendedor_id` int DEFAULT NULL,
  `marca` varchar(50) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `modelo` varchar(50) COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  `anio` int DEFAULT NULL,
  `precio_base` decimal(10,2) DEFAULT NULL,
  `estado` enum('disponible','subastado','vendido') COLLATE utf8mb3_spanish_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vendedor_id` (`vendedor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish_ci;

--
-- Volcado de datos para la tabla `vehiculos`
--

INSERT INTO `vehiculos` (`id`, `vendedor_id`, `marca`, `modelo`, `anio`, `precio_base`, `estado`) VALUES
(1, 1, 'Toyota', 'Corolla', 2020, 15000.00, 'disponible'),
(2, 1, 'Ford', 'Focus', 2018, 12000.00, 'disponible'),
(3, 3, 'Chevrolet', 'Cruze', 2019, 14000.00, 'subastado'),
(4, 3, 'Honda', 'Civic', 2021, 18000.00, 'disponible'),
(5, 1, 'Nissan', 'Sentra', 2017, 10000.00, 'vendido');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pujas`
--
ALTER TABLE `pujas`
  ADD CONSTRAINT `pujas_ibfk_1` FOREIGN KEY (`comprador_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pujas_ibfk_2` FOREIGN KEY (`subasta_id`) REFERENCES `subastas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD CONSTRAINT `vehiculos_ibfk_1` FOREIGN KEY (`vendedor_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
