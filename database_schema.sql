-- -------------------------------------------------------------
-- --- SCRIPT DE CREACIÓN DE BASE DE DATOS PARA CREDIPEP/DSF ---
-- -------------------------------------------------------------
-- Este script define la estructura completa de la base de datos
-- para soportar todas las funcionalidades de la aplicación.

-- --- 1. Módulo de Personal y Usuarios ---

-- Tabla para el personal interno de la empresa
CREATE TABLE staff (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    avatar_url VARCHAR(255),
    role VARCHAR(50) -- Ej: 'Admin', 'Gestor', 'Abogado'
);

-- Tabla para los mensajeros
CREATE TABLE couriers (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    vehicle ENUM('Motocicleta', 'Automóvil') NOT NULL
);

-- --- 2. Módulo de Clientes y Leads ---

-- Tabla para leads o clientes potenciales
CREATE TABLE leads (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100),
    phone VARCHAR(20),
    registered_on DATE NOT NULL,
    avatar_url VARCHAR(255),
    juicios INT DEFAULT 0,
    manchas INT DEFAULT 0,
    puesto ENUM('Interino', 'En Propiedad'),
    antiguedad VARCHAR(50),
    salario_base DECIMAL(15, 2),
    salario_neto DECIMAL(15, 2),
    assigned_to_id VARCHAR(20),
    FOREIGN KEY (assigned_to_id) REFERENCES staff(id)
);

-- Tabla para clientes consolidados
CREATE TABLE clients (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100),
    phone VARCHAR(20),
    client_status ENUM('Activo', 'Moroso', 'En cobro', 'Fallecido', 'Inactivo') NOT NULL,
    active_credits INT DEFAULT 0,
    registered_on DATE NOT NULL,
    avatar_url VARCHAR(255)
);

-- --- 3. Módulo de Créditos y Oportunidades ---

-- Tabla para oportunidades de venta de créditos
CREATE TABLE opportunities (
    id VARCHAR(20) PRIMARY KEY,
    lead_cedula VARCHAR(20) NOT NULL,
    credit_type ENUM('Regular', 'Micro-crédito') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status ENUM('En proceso', 'Rechazada', 'Aceptada', 'Convertido') NOT NULL,
    start_date DATE NOT NULL,
    assigned_to_id VARCHAR(20) NOT NULL,
    FOREIGN KEY (lead_cedula) REFERENCES leads(cedula),
    FOREIGN KEY (assigned_to_id) REFERENCES staff(id)
);

-- Tabla principal de créditos
CREATE TABLE credits (
    operation_number VARCHAR(20) PRIMARY KEY,
    client_id VARCHAR(20) NOT NULL,
    employer VARCHAR(100),
    type ENUM('Regular', 'Micro-crédito') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL,
    fee DECIMAL(15, 2) NOT NULL,
    rate DECIMAL(5, 2) NOT NULL,
    term_months INT NOT NULL,
    status ENUM('Al día', 'En mora', 'Cancelado', 'En cobro judicial') NOT NULL,
    overdue_fees INT DEFAULT 0,
    days_in_arrears INT DEFAULT 0,
    deducting_entity VARCHAR(100),
    creation_date DATE NOT NULL,
    due_date DATE NOT NULL,
    expediente_judicial VARCHAR(50) UNIQUE,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Tabla de abonos o pagos realizados por los deudores
CREATE TABLE payments (
    id VARCHAR(20) PRIMARY KEY,
    operation_number VARCHAR(20) NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    difference DECIMAL(15, 2) DEFAULT 0,
    source ENUM('Planilla', 'Ventanilla', 'Transferencia') NOT NULL,
    FOREIGN KEY (operation_number) REFERENCES credits(operation_number)
);

-- --- 4. Módulo de Inversiones ---

-- Tabla para los inversionistas
CREATE TABLE investors (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100),
    phone VARCHAR(20),
    status ENUM('Activo', 'Inactivo') NOT NULL,
    registered_on DATE NOT NULL,
    avatar_url VARCHAR(255)
);

-- Tabla de inversiones
CREATE TABLE investments (
    investment_number VARCHAR(20) PRIMARY KEY,
    investor_id VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency ENUM('CRC', 'USD') NOT NULL,
    rate DECIMAL(5, 2) NOT NULL,
    interest_frequency ENUM('Mensual', 'Trimestral', 'Semestral', 'Anual') NOT NULL,
    is_capitalizable BOOLEAN DEFAULT FALSE,
    status ENUM('Activa', 'Finalizada', 'Liquidada') NOT NULL,
    FOREIGN KEY (investor_id) REFERENCES investors(id)
);

-- Tabla para los cupones de pago a inversionistas (incluye retenciones)
CREATE TABLE investment_coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    investment_number VARCHAR(20) NOT NULL,
    payment_date DATE NOT NULL,
    interest_amount_bruto DECIMAL(15, 2) NOT NULL,
    retention_amount DECIMAL(15, 2) NOT NULL,
    net_paid_amount DECIMAL(15, 2) NOT NULL,
    status ENUM('Pagado', 'Pendiente') NOT NULL,
    FOREIGN KEY (investment_number) REFERENCES investments(investment_number)
);

-- --- 5. Módulo Legal (Amparos y Cobro Judicial) ---

-- Tabla para los casos legales (amparos, ejecuciones, etc.)
CREATE TABLE cases (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    assigned_to_id VARCHAR(20),
    last_update DATE,
    category ENUM('Contenciosa', 'No Contenciosa'),
    opportunity_lifecycle INT,
    amparo_original_id VARCHAR(20),
    FOREIGN KEY (assigned_to_id) REFERENCES staff(id)
);

-- Tabla para notificaciones judiciales clasificadas
CREATE TABLE judicial_notifications (
    id VARCHAR(20) PRIMARY KEY,
    expediente_judicial VARCHAR(50) NOT NULL,
    acto VARCHAR(100) NOT NULL,
    fecha DATETIME NOT NULL,
    status ENUM('Leída', 'Pendiente') NOT NULL,
    assigned_to_id VARCHAR(20),
    document_url VARCHAR(255),
    FOREIGN KEY (assigned_to_id) REFERENCES staff(id)
);

-- Tabla para notificaciones por correo sin clasificar
CREATE TABLE undefined_notifications (
    id VARCHAR(20) PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    received_date DATETIME NOT NULL,
    assigned_to_id VARCHAR(20),
    email_body TEXT,
    FOREIGN KEY (assigned_to_id) REFERENCES staff(id)
);

-- --- 6. Módulo de Tareas y Comunicaciones ---

-- Tabla de tareas generales
CREATE TABLE tasks (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    case_id VARCHAR(20), -- Puede ser un ID de caso, crédito, etc.
    assigned_to_id VARCHAR(20) NOT NULL,
    due_date DATE,
    priority ENUM('Alta', 'Media', 'Baja') NOT NULL,
    status ENUM('Pendiente', 'En Progreso', 'Completada') NOT NULL,
    FOREIGN KEY (assigned_to_id) REFERENCES staff(id)
);

-- Tabla de conversaciones
CREATE TABLE conversations (
    id VARCHAR(20) PRIMARY KEY,
    related_entity_id VARCHAR(20) NOT NULL, -- ID del caso, crédito, etc.
    client_id VARCHAR(20),
    status ENUM('Abierto', 'Resuelto', 'Pendiente') NOT NULL,
    last_message_time DATETIME,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Tabla para mensajes de chat
CREATE TABLE chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id VARCHAR(20) NOT NULL,
    sender_type ENUM('client', 'agent') NOT NULL,
    sender_id VARCHAR(20) NOT NULL, -- ID del cliente o del staff
    text TEXT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

-- Tabla para notas internas
CREATE TABLE internal_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id VARCHAR(20) NOT NULL,
    staff_id VARCHAR(20) NOT NULL,
    text TEXT NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

-- --- 7. Módulo de Rutas y Logística ---

-- Tabla para puntos autorizados o sucursales
CREATE TABLE branches (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    manager_id VARCHAR(20),
    FOREIGN KEY (manager_id) REFERENCES staff(id)
);

-- Tabla para documentos pendientes de recogida
CREATE TABLE pending_pickups (
    id VARCHAR(20) PRIMARY KEY,
    case_id VARCHAR(20) NOT NULL,
    branch_id VARCHAR(20) NOT NULL,
    document_count INT NOT NULL,
    status ENUM('Pendiente de Retiro', 'Asignado a Ruta') NOT NULL,
    FOREIGN KEY (case_id) REFERENCES cases(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- Tabla de rutas planificadas
CREATE TABLE routes (
    id VARCHAR(30) PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    courier_id VARCHAR(20) NOT NULL,
    route_date DATE NOT NULL,
    status ENUM('Planificada', 'En Progreso', 'Completada', 'Cancelada') NOT NULL,
    FOREIGN KEY (courier_id) REFERENCES couriers(id)
);

-- Tabla de paradas dentro de una ruta
CREATE TABLE route_stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id VARCHAR(30) NOT NULL,
    branch_id VARCHAR(20) NOT NULL,
    stop_order INT NOT NULL, -- Orden de la parada en la ruta
    status ENUM('Pendiente', 'Visitada') NOT NULL,
    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);

-- --- 8. Módulo de Ventas ---

CREATE TABLE sales_visits (
    id VARCHAR(20) PRIMARY KEY,
    institution_id VARCHAR(20) NOT NULL,
    salesperson_id VARCHAR(20) NOT NULL,
    visit_date DATE NOT NULL,
    status ENUM('Planificada', 'Completada', 'Cancelada') NOT NULL,
    notes TEXT,
    FOREIGN KEY (institution_id) REFERENCES patronos(id),
    FOREIGN KEY (salesperson_id) REFERENCES staff(id)
);

CREATE TABLE sales_goals (
    id VARCHAR(20) PRIMARY KEY,
    salesperson_id VARCHAR(20) NOT NULL,
    month_year VARCHAR(7) NOT NULL, -- Formato 'YYYY-MM'
    goal_amount DECIMAL(15, 2) NOT NULL,
    achieved_amount DECIMAL(15, 2) DEFAULT 0.00,
    FOREIGN KEY (salesperson_id) REFERENCES staff(id)
);

-- --- 9. Módulo de Configuración ---

-- Tabla para patronos
CREATE TABLE patronos (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    payment_date_description VARCHAR(100)
);

-- Tabla para entidades deductoras
CREATE TABLE deductoras (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    payment_date_description VARCHAR(100),
    commission_rate DECIMAL(5, 2) NOT NULL
);

-- Tabla para configuración general de créditos
CREATE TABLE credit_configs (
    type ENUM('Regular', 'Micro-crédito') PRIMARY KEY,
    min_amount DECIMAL(15, 2) NOT NULL,
    max_amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    min_term_months INT NOT NULL,
    max_term_months INT NOT NULL
);

-- --- 10. Módulo de Voluntarios (si aplica) ---
CREATE TABLE volunteers (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    expertise VARCHAR(100),
    availability VARCHAR(255),
    avatar_url VARCHAR(255)
);

-- ----------------------------
-- --- Fin del Script ---
-- ----------------------------
