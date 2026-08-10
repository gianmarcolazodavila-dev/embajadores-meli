CREATE TABLE ambassadors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  mercado ENUM('wilson','polvos_azules','polvos_rosados') NOT NULL,
  coins_balance INT DEFAULT 0,
  median_asp DECIMAL(10,2),
  coupon_code VARCHAR(12) UNIQUE,
  estado ENUM('activo','inactivo') DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE referrals_mgm (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ambassador_id INT NOT NULL,
  nombre_negocio VARCHAR(255) NOT NULL,
  ruc VARCHAR(20) NOT NULL,
  referred_email VARCHAR(255),
  estado ENUM('pendiente','validado','rechazado','activo') DEFAULT 'pendiente',
  motivo_rechazo TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ambassador_id) REFERENCES ambassadors(id),
  INDEX idx_ambassador (ambassador_id),
  INDEX idx_estado (estado)
);

CREATE TABLE milestones_mgm (
  id INT AUTO_INCREMENT PRIMARY KEY,
  referral_id INT NOT NULL,
  tipo ENUM('catalogo_10','catalogo_30','catalogo_100',
            'primera_venta','seller_desarrollo','seller_activado') NOT NULL,
  coins INT NOT NULL,
  achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (referral_id) REFERENCES referrals_mgm(id),
  UNIQUE KEY unique_milestone (referral_id, tipo)
);

CREATE TABLE referrals_mgb (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ambassador_id INT NOT NULL,
  buyer_email VARCHAR(255),
  buyer_dni VARCHAR(20),
  coupon_redeemed BOOLEAN DEFAULT FALSE,
  estado ENUM('pendiente','activo') DEFAULT 'pendiente',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ambassador_id) REFERENCES ambassadors(id),
  INDEX idx_ambassador (ambassador_id),
  INDEX idx_dni (buyer_dni)
);

CREATE TABLE milestones_mgb (
  id INT AUTO_INCREMENT PRIMARY KEY,
  referral_mgb_id INT NOT NULL,
  tipo ENUM('primera_compra','recurrencia','buyer_desarrollado') NOT NULL,
  coins INT NOT NULL,
  achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (referral_mgb_id) REFERENCES referrals_mgb(id),
  UNIQUE KEY unique_milestone (referral_mgb_id, tipo)
);

CREATE TABLE wallet_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ambassador_id INT NOT NULL,
  coins INT NOT NULL,
  tipo ENUM('credito','debito') NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ambassador_id) REFERENCES ambassadors(id),
  INDEX idx_ambassador (ambassador_id)
);

CREATE TABLE auth_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(64) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_token (token)
);
