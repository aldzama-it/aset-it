-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `address` TEXT NULL,
    `type` ENUM('Head_Office', 'Site', 'Gudang', 'Server_Room', 'Kendaraan') NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `division` VARCHAR(100) NULL,
    `position` VARCHAR(100) NULL,
    `email` VARCHAR(150) NULL,
    `phone` VARCHAR(20) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NetworkDevice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `name` VARCHAR(100) NOT NULL,
    `device_type` VARCHAR(50) NULL,
    `brand` VARCHAR(50) NULL,
    `model` VARCHAR(100) NULL,
    `mac_address` VARCHAR(17) NULL,
    `ip_address` VARCHAR(45) NULL,
    `location_id` INTEGER NULL,
    `purchase_date` DATETIME(3) NULL,
    `condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NOT NULL DEFAULT 'Baik',
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NetworkDevice_asset_code_key`(`asset_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Printer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `brand` VARCHAR(50) NULL,
    `model` VARCHAR(100) NULL,
    `location_id` INTEGER NULL,
    `condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NOT NULL DEFAULT 'Baik',
    `ink_type` VARCHAR(50) NULL,
    `mac_address` VARCHAR(17) NULL,
    `ip_address` VARCHAR(45) NULL,
    `connection` ENUM('WiFi', 'LAN', 'USB', 'Cellular', 'Satelit') NULL,
    `purchase_date` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Printer_asset_code_key`(`asset_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cctv` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `brand` VARCHAR(50) NULL,
    `model` VARCHAR(50) NULL,
    `location_id` INTEGER NULL,
    `position_label` VARCHAR(100) NULL,
    `ip_address` VARCHAR(45) NULL,
    `mac_address` VARCHAR(17) NULL,
    `install_date` DATETIME(3) NULL,
    `condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NOT NULL DEFAULT 'Baik',
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Cctv_asset_code_key`(`asset_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Laptop` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `assigned_to` INTEGER NULL,
    `location_id` INTEGER NULL,
    `brand` VARCHAR(50) NULL,
    `model` VARCHAR(100) NULL,
    `mac_address` VARCHAR(17) NULL,
    `handover_date` DATETIME(3) NULL,
    `return_date` DATETIME(3) NULL,
    `condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NOT NULL DEFAULT 'Baik',
    `attachment_name` VARCHAR(255) NULL,
    `attachment_path` VARCHAR(500) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Laptop_asset_code_key`(`asset_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LaptopAccessory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `assigned_to` INTEGER NULL,
    `item_name` VARCHAR(100) NOT NULL,
    `model` VARCHAR(100) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `location_id` INTEGER NULL,
    `handover_date` DATETIME(3) NULL,
    `return_date` DATETIME(3) NULL,
    `condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NOT NULL DEFAULT 'Baik',
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `LaptopAccessory_asset_code_key`(`asset_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ht` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `assigned_to` INTEGER NULL,
    `brand` VARCHAR(50) NULL,
    `model` VARCHAR(100) NULL,
    `accessories` JSON NULL,
    `location_id` INTEGER NULL,
    `handover_date` DATETIME(3) NULL,
    `return_date` DATETIME(3) NULL,
    `condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NOT NULL DEFAULT 'Baik',
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Ht_asset_code_key`(`asset_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tablet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `assigned_to` INTEGER NULL,
    `brand` VARCHAR(50) NULL,
    `model` VARCHAR(100) NULL,
    `storage_gb` INTEGER NULL,
    `ram_gb` INTEGER NULL,
    `accessories` JSON NULL,
    `location_id` INTEGER NULL,
    `handover_date` DATETIME(3) NULL,
    `return_date` DATETIME(3) NULL,
    `condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NOT NULL DEFAULT 'Baik',
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Tablet_asset_code_key`(`asset_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Camera` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `assigned_to` INTEGER NULL,
    `brand` VARCHAR(50) NULL,
    `model` VARCHAR(100) NULL,
    `accessories` JSON NULL,
    `location_id` INTEGER NULL,
    `handover_date` DATETIME(3) NULL,
    `return_date` DATETIME(3) NULL,
    `purchase_date` DATETIME(3) NULL,
    `condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NOT NULL DEFAULT 'Baik',
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Camera_asset_code_key`(`asset_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Starlink` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `serial_number` VARCHAR(50) NULL,
    `location_id` INTEGER NULL,
    `account_email` VARCHAR(150) NULL,
    `active_since` DATETIME(3) NULL,
    `subscription_plan` VARCHAR(50) NULL,
    `ip_address` VARCHAR(45) NULL,
    `condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NOT NULL DEFAULT 'Baik',
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Starlink_asset_code_key`(`asset_code`),
    UNIQUE INDEX `Starlink_serial_number_key`(`serial_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dashcam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicle_name` VARCHAR(100) NOT NULL,
    `plate_number` VARCHAR(20) NULL,
    `location_id` INTEGER NULL,
    `project` VARCHAR(100) NULL,
    `dashcam_brand` VARCHAR(50) NULL,
    `dashcam_model` VARCHAR(50) NULL,
    `install_date` DATETIME(3) NULL,
    `is_installed` BOOLEAN NOT NULL DEFAULT false,
    `condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NOT NULL DEFAULT 'Baik',
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssetHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `table_name` VARCHAR(50) NOT NULL,
    `asset_id` INTEGER NOT NULL,
    `asset_code` VARCHAR(20) NULL,
    `action` ENUM('Dibuat', 'Diperbarui', 'Dipindah_Lokasi', 'Diserahkan', 'Dikembalikan', 'Kondisi_Berubah', 'Dihapus') NOT NULL,
    `from_employee_id` INTEGER NULL,
    `to_employee_id` INTEGER NULL,
    `from_location_id` INTEGER NULL,
    `to_location_id` INTEGER NULL,
    `old_condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NULL,
    `new_condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NULL,
    `changed_by` VARCHAR(100) NULL,
    `notes` TEXT NULL,
    `event_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `NetworkDevice` ADD CONSTRAINT `NetworkDevice_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Printer` ADD CONSTRAINT `Printer_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cctv` ADD CONSTRAINT `Cctv_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Laptop` ADD CONSTRAINT `Laptop_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Laptop` ADD CONSTRAINT `Laptop_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaptopAccessory` ADD CONSTRAINT `LaptopAccessory_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaptopAccessory` ADD CONSTRAINT `LaptopAccessory_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ht` ADD CONSTRAINT `Ht_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ht` ADD CONSTRAINT `Ht_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tablet` ADD CONSTRAINT `Tablet_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tablet` ADD CONSTRAINT `Tablet_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Camera` ADD CONSTRAINT `Camera_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Camera` ADD CONSTRAINT `Camera_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Starlink` ADD CONSTRAINT `Starlink_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dashcam` ADD CONSTRAINT `Dashcam_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssetHistory` ADD CONSTRAINT `AssetHistory_from_employee_id_fkey` FOREIGN KEY (`from_employee_id`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssetHistory` ADD CONSTRAINT `AssetHistory_to_employee_id_fkey` FOREIGN KEY (`to_employee_id`) REFERENCES `Employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssetHistory` ADD CONSTRAINT `AssetHistory_from_location_id_fkey` FOREIGN KEY (`from_location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssetHistory` ADD CONSTRAINT `AssetHistory_to_location_id_fkey` FOREIGN KEY (`to_location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
