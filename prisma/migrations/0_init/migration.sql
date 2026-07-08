-- CreateTable
CREATE TABLE `AssetHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `table_name` VARCHAR(50) NOT NULL,
    `asset_id` INTEGER NOT NULL,
    `asset_code` VARCHAR(20) NULL,
    `action` ENUM('Dibuat', 'Diperbarui', 'Dipindah_Lokasi', 'Diserahkan', 'Dikembalikan', 'Kondisi_Berubah', 'Dihapus') NOT NULL,
    `from_employee` VARCHAR(100) NULL,
    `to_employee` VARCHAR(100) NULL,
    `from_location` VARCHAR(100) NULL,
    `to_location` VARCHAR(100) NULL,
    `old_condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NULL,
    `new_condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NULL,
    `changed_by` VARCHAR(100) NULL,
    `notes` TEXT NULL,
    `event_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Camera` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `pic` VARCHAR(100) NULL,
    `brand` VARCHAR(50) NULL,
    `model` VARCHAR(100) NULL,
    `accessories` JSON NULL,
    `location` VARCHAR(100) NULL,
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
CREATE TABLE `Cctv` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `brand` VARCHAR(50) NULL,
    `model` VARCHAR(50) NULL,
    `location` VARCHAR(100) NULL,
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
CREATE TABLE `Dashcam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `vehicle_name` VARCHAR(100) NOT NULL,
    `plate_number` VARCHAR(20) NULL,
    `location` VARCHAR(100) NULL,
    `project` VARCHAR(100) NULL,
    `install_status` VARCHAR(50) NOT NULL DEFAULT 'Belum Terpasang',
    `install_date` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `azdome_email` VARCHAR(150) NULL,
    `azdome_password` VARCHAR(255) NULL,
    `gmail` VARCHAR(150) NULL,
    `gmail_password` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Dashcam_asset_code_key`(`asset_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ht` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `pic_name` VARCHAR(100) NULL,
    `department` VARCHAR(100) NULL,
    `division` VARCHAR(100) NULL,
    `job_level` VARCHAR(100) NULL,
    `branch` VARCHAR(100) NULL,
    `handover_date` DATETIME(3) NULL,
    `return_date` DATETIME(3) NULL,
    `brand` VARCHAR(50) NULL,
    `type` VARCHAR(100) NULL,
    `accessories` VARCHAR(255) NULL,
    `condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NOT NULL DEFAULT 'Baik',
    `notes` TEXT NULL,
    `form_path` VARCHAR(255) NULL,
    `it_handover` VARCHAR(100) NULL,
    `it_receiver` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Ht_asset_code_key`(`asset_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Laptop` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `pic` VARCHAR(100) NULL,
    `department` VARCHAR(100) NULL,
    `division` VARCHAR(100) NULL,
    `job_level` VARCHAR(50) NULL,
    `branch` VARCHAR(100) NULL,
    `brand` VARCHAR(50) NULL,
    `model` VARCHAR(100) NULL,
    `ram` VARCHAR(50) NULL,
    `storage` VARCHAR(50) NULL,
    `processor` VARCHAR(100) NULL,
    `screen_size` VARCHAR(50) NULL,
    `mac_address` VARCHAR(17) NULL,
    `handover_date` DATETIME(3) NULL,
    `return_date` DATETIME(3) NULL,
    `condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NOT NULL DEFAULT 'Baik',
    `attachment_name` VARCHAR(255) NULL,
    `attachment_path` VARCHAR(500) NULL,
    `notes` TEXT NULL,
    `it_handover` VARCHAR(100) NULL,
    `it_receiver` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Laptop_asset_code_key`(`asset_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GeneralInventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `pic_name` VARCHAR(100) NOT NULL,
    `department` VARCHAR(100) NULL,
    `division` VARCHAR(100) NULL,
    `job_level` VARCHAR(100) NULL,
    `branch` VARCHAR(100) NULL,
    `asset_type` VARCHAR(100) NULL,
    `brand` VARCHAR(100) NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `handover_date` DATETIME(3) NULL,
    `return_date` DATETIME(3) NULL,
    `condition` ENUM('Baik', 'Rusak', 'Hilang') NOT NULL DEFAULT 'Baik',
    `notes` TEXT NULL,
    `handover_form` VARCHAR(255) NULL,
    `return_form` VARCHAR(255) NULL,
    `it_handover` VARCHAR(100) NULL,
    `it_receiver` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `GeneralInventory_asset_code_key`(`asset_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NetworkDevice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `name` VARCHAR(100) NOT NULL,
    `device_type` VARCHAR(50) NULL,
    `mac_address` VARCHAR(17) NULL,
    `location` VARCHAR(100) NULL,
    `purchase_date` DATETIME(3) NULL,
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
    `location` VARCHAR(100) NULL,
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
CREATE TABLE `Starlink` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `location` VARCHAR(100) NULL,
    `serial_number` VARCHAR(50) NULL,
    `account_email` VARCHAR(150) NULL,
    `install_date` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Starlink_asset_code_key`(`asset_code`),
    UNIQUE INDEX `Starlink_serial_number_key`(`serial_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tablet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asset_code` VARCHAR(20) NULL,
    `pic_name` VARCHAR(100) NULL,
    `department` VARCHAR(100) NULL,
    `division` VARCHAR(100) NULL,
    `job_level` VARCHAR(100) NULL,
    `branch` VARCHAR(100) NULL,
    `handover_date` DATETIME(3) NULL,
    `return_date` DATETIME(3) NULL,
    `asset_type` VARCHAR(100) NULL,
    `brand` VARCHAR(50) NULL,
    `type` VARCHAR(100) NULL,
    `ram` VARCHAR(50) NULL,
    `storage` VARCHAR(50) NULL,
    `condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NOT NULL DEFAULT 'Baik',
    `notes` TEXT NULL,
    `form_path` VARCHAR(255) NULL,
    `it_handover` VARCHAR(100) NULL,
    `it_receiver` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Tablet_asset_code_key`(`asset_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssetCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `prefix` VARCHAR(10) NOT NULL,
    `icon` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GeneralAsset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NOT NULL,
    `asset_code` VARCHAR(50) NULL,
    `pic` VARCHAR(100) NULL,
    `location` VARCHAR(100) NULL,
    `brand` VARCHAR(50) NULL,
    `model` VARCHAR(100) NULL,
    `handover_date` DATETIME(3) NULL,
    `purchase_date` DATETIME(3) NULL,
    `condition` ENUM('Baru', 'Baik', 'Perlu_Servis', 'Rusak', 'Hilang', 'Tidak_Aktif') NOT NULL DEFAULT 'Baik',
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `GeneralAsset_asset_code_key`(`asset_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `divisi` VARCHAR(100) NULL,
    `department` VARCHAR(100) NULL,
    `job_level` VARCHAR(100) NULL,
    `branch` VARCHAR(100) NULL,
    `email` VARCHAR(150) NOT NULL,
    `domain` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'Aktif',
    `deleted_at` DATETIME(3) NULL,
    `deleted_reason` TEXT NULL,
    `keterangan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmailAccount_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VpnAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `divisi` VARCHAR(100) NULL,
    `department` VARCHAR(100) NULL,
    `job_level` VARCHAR(100) NULL,
    `branch` VARCHAR(100) NULL,
    `ip_address` VARCHAR(45) NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'Aktif',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SynologyAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `divisi` VARCHAR(100) NULL,
    `department` VARCHAR(100) NULL,
    `job_level` VARCHAR(100) NULL,
    `branch` VARCHAR(100) NULL,
    `email` VARCHAR(150) NULL,
    `password` VARCHAR(255) NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'Aktif',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExternalAppAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `app_name` VARCHAR(150) NOT NULL,
    `app_link` VARCHAR(255) NULL,
    `email_username` VARCHAR(150) NULL,
    `password` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminSoftwareAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `app_name` VARCHAR(150) NOT NULL,
    `app_link` VARCHAR(255) NULL,
    `email_username` VARCHAR(150) NULL,
    `password` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InfrastructureAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_akun` VARCHAR(100) NOT NULL,
    `email_username` VARCHAR(150) NULL,
    `password` VARCHAR(255) NULL,
    `from_ip` VARCHAR(45) NULL,
    `to_ip` VARCHAR(45) NULL,
    `mac_address` VARCHAR(17) NULL,
    `keterangan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OfficePhoneAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_akun` VARCHAR(100) NOT NULL,
    `username` VARCHAR(100) NULL,
    `password` VARCHAR(255) NULL,
    `reg_sip_account` VARCHAR(100) NULL,
    `reg_sip_password` VARCHAR(255) NULL,
    `ip_address` VARCHAR(45) NULL,
    `mac_address` VARCHAR(17) NULL,
    `keterangan` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GeneralAsset` ADD CONSTRAINT `GeneralAsset_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `AssetCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

