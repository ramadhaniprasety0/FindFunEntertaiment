-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for findfun_db
CREATE DATABASE IF NOT EXISTS `findfun_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `findfun_db`;

-- Dumping structure for table findfun_db.albums
CREATE TABLE IF NOT EXISTS `albums` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `release_year` int NOT NULL,
  `artist_id` int NOT NULL,
  `deskripsi` text,
  `genre` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_albums_artists` (`artist_id`),
  CONSTRAINT `FK_albums_artists` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.albums: ~4 rows (approximately)
INSERT INTO `albums` (`id`, `title`, `release_year`, `artist_id`, `deskripsi`, `genre`, `image`, `created_at`, `updated_at`) VALUES
	(2, 'Contoh Album', 2024, 5, 'Ini album contoh', 'Pop', 'uploads/albums/0a1b5f2c22e224d792ff13a7f1140d87', '2025-05-24 10:42:44', '2025-06-03 18:51:56'),
	(3, 'The Dark Side of the Moon233', 1973, 7, 'Classic progressive rock album by Pink Floyd', 'Progressive Rock', 'uploads\\albums\\cfe7ee0de697054c78ca3411cf63b40c', '2025-05-24 17:35:09', '2025-06-03 18:52:00'),
	(4, 'Thriller', 1982, 5, 'Michael Jackson\'s best-selling album', 'Pop', 'uploads/albums/0a1b5f2c22e224d792ff13a7f1140d87', '2025-05-24 17:35:09', '2025-06-03 18:52:04'),
	(5, 'Abbey Road', 1969, 7, 'The Beatles\' penultimate studio album', 'Rock', 'uploads/albums/0a1b5f2c22e224d792ff13a7f1140d87', '2025-05-24 17:35:09', '2025-06-03 18:54:32'),
	(21, 'Tulus22', 2015, 5, 'Tulus adalah album studio perdana oleh penyanyi-penulis lagu Indonesia, Tulus. Diproduseri oleh Ari Renaldi, album ini dirilis secara resmi pada 28 September 2011 melalui perusahaan rekaman independen, TulusCompany. Album ini merupakan album perkenalan Tulus serta sebagai penanda debutnya di industri musik Indonesia.', 'Pop ', 'uploads\\albums\\b63252b189beb9f53ef680eff388459b', '2025-06-04 03:05:29', '2025-06-04 13:22:12'),
	(22, 'Hot Jakarta Hari Ini', 2025, 7, 'ajdhaklwhdkhw', 'Pop Jazz', 'uploads\\albums\\97a1446656d26c1160a7ca78d09d43b7', '2025-06-05 08:46:21', '2025-06-05 08:46:21'),
	(23, 'Ngawi', 2025, 5, 'adada', 'Koplo', 'uploads\\albums\\9e4f88efbba1527a05c847d81d22b899', '2025-06-12 16:17:05', '2025-06-12 16:17:19'),
	(24, 'testfinal', 2022, 8, 'adadw', 'Pop Jawa', 'uploads\\albums\\df27c672acdfd51d921ac392a8ff4429', '2025-06-16 17:08:10', '2025-06-16 17:08:10');

-- Dumping structure for table findfun_db.artists
CREATE TABLE IF NOT EXISTS `artists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `bio` text,
  `birth_date` date DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `active_year_start` int DEFAULT NULL,
  `active_year_end` int DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `youtube` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `popularity` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.artists: ~3 rows (approximately)
INSERT INTO `artists` (`id`, `name`, `bio`, `birth_date`, `country`, `genre`, `image`, `active_year_start`, `active_year_end`, `instagram`, `twitter`, `youtube`, `website`, `popularity`, `created_at`, `updated_at`) VALUES
	(5, 'RAMADHANI PRASETYO22', 'ajhdahkdw', '2000-11-20', 'Indonesia', 'Dj', 'uploads/1ac2daf80dd0ef06478af19235a7937b', 2025, NULL, '@ramadhani.prsty_', '@ramadhani.prsty_', '', '', 50, '2025-06-03 16:10:56', '2025-06-03 16:10:56'),
	(7, 'RAMADHANI PRASETYO22333', 'adwdwadshkdhkad', '2000-11-18', 'Indonesia', 'Dj', 'uploads\\artists\\53e9968bd51c6c0127feba2aaa730c33', 2025, NULL, '@ramadhani.prsty_', '@ramadhani.prsty_', 'adasadw23454', 'adad344', 50, '2025-06-03 16:16:38', '2025-06-17 21:44:17'),
	(8, 'Denny Caknan', 'Sebelum ia terkenal, Denny merupakan seorang pegawai harian lepas di Dinas Lingkungan Hidup (DLH) Pemkab Ngawi. Kemudian ia mengawali kariernya sebagai penyanyi solo dengan membawakan genre musik pop. Sayangnya, beberapa lagu pop miliknya tidak laku, hingga akhirnya ia memutuskan untuk berubah haluan menjadi penyanyi Pop Jawa Sejumlah lagu yang dibawakan oleh Denny Caknan mendapatkan sambutan hangat dari para penggemar musik. Dan terbukti, lagu-lagunya sering menduduki trending di platform video YouTube. Tahun 2023, Denny Caknan sukses membawakan lagu yang bertajuk Kalih Welasku, dan trending di berbagai platform musik seperti YouTube dan TikTok.', '1993-12-09', 'Solo Jogja', 'Pop Jawa', 'uploads/artists/ec03307a0d605b959c5697455d7b9242', 2017, NULL, 'https://instagram.com/dennycaknan', 'https://twitter.com/dennycaknan', '-', '-', 98, '2025-06-12 16:24:24', '2025-06-12 16:26:03');

-- Dumping structure for table findfun_db.carousel_items
CREATE TABLE IF NOT EXISTS `carousel_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `carausel_name` varchar(100) DEFAULT NULL,
  `titleImage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.carousel_items: ~5 rows (approximately)
INSERT INTO `carousel_items` (`id`, `carausel_name`, `titleImage`, `image`, `deskripsi`, `status`) VALUES
	(1, 'Wakanda Foreverrrr', 'uploads/carousel_image/wakandatitle.png', 'uploads/carousel_image/wakanda.jpg', 'Action & Adventure | 2022', 1),
	(2, 'Breakingbad', 'uploads/carousel_image/breakingbadtitle.png', 'uploads/carousel_image/breakingbad.jpg', 'Action & Adventure | 2023', 1),
	(3, 'Drive', 'uploads/carousel_image/drivetitle.png', 'uploads/carousel_image/drive.jpg', 'Action & Adventure | 2024', 1),
	(4, 'Theboys', 'uploads/carousel_image/theboystitle.png', 'uploads/carousel_image/theboys.jpg', 'Action & Adventure | 2025', 1),
	(5, 'test Wkanda', 'uploads\\carousel_image\\7ba5ce9569e2f74e1274a1a4909041c4', 'uploads\\carousel_image\\c7d6057b45dc4dfd11ef1523ece6a325', 'Univ Pancasila Teknik Informatika', 1),
	(11, 'adada', 'uploads\\carousel_image\\e52710b08c5d683a4ff2b2500672984c', 'uploads\\carousel_image\\bad4b1fd4d5a5359e9f4391068855198', 'adada', 1);

-- Dumping structure for table findfun_db.cinema_locations
CREATE TABLE IF NOT EXISTS `cinema_locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venue_name` varchar(255) NOT NULL,
  `cinema_type` varchar(50) NOT NULL,
  `film_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `film_id` (`film_id`),
  CONSTRAINT `cinema_locations_ibfk_1` FOREIGN KEY (`film_id`) REFERENCES `films` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.cinema_locations: ~2 rows (approximately)
INSERT INTO `cinema_locations` (`id`, `venue_name`, `cinema_type`, `film_id`) VALUES
	(1, 'AEON MALL TANJUNG BARAT', 'XXI', 19),
	(2, 'BLOK M SQUARE', 'XXI', 19),
	(3, 'AEON MALL TANJUNG BARAT III', 'XXI', 20),
	(4, 'D Mall Depok Margonda', 'Cinepolis1', 22),
	(5, 'D Mall Depok Margonda', 'Cinepolis', 23);

-- Dumping structure for table findfun_db.films
CREATE TABLE IF NOT EXISTS `films` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `deskripsi` text,
  `release_year` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `genre1` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `genre2` varchar(100) DEFAULT NULL,
  `genre3` varchar(100) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `image_poster` varchar(255) DEFAULT NULL,
  `director` varchar(255) DEFAULT NULL,
  `status_film` int DEFAULT NULL,
  `netflix_link` varchar(255) DEFAULT NULL,
  `appletv_link` varchar(255) DEFAULT NULL,
  `hbogo_link` varchar(255) DEFAULT NULL,
  `bioskop_link` varchar(255) DEFAULT NULL,
  `like_user` int DEFAULT NULL,
  `dislike` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.films: ~4 rows (approximately)
INSERT INTO `films` (`id`, `title`, `deskripsi`, `release_year`, `rating`, `genre1`, `genre2`, `genre3`, `duration`, `image`, `image_poster`, `director`, `status_film`, `netflix_link`, `appletv_link`, `hbogo_link`, `bioskop_link`, `like_user`, `dislike`, `created_at`, `updated_at`) VALUES
	(19, 'Jumbo', 'dadadawdawdaw', 2025, 10, 'Drama', 'Happy', 'adada', 102, 'uploads\\films\\9e38b9206116b2ccfd6ee772e5b3dd92', 'uploads\\films\\abd4740faa6903cf512f17666b17e34c', 'Ryan Adriandhy', 2, '-', '-', '-', '-', 0, 0, '2025-06-06 18:37:14', '2025-06-07 04:32:08'),
	(20, 'Jumbo22', 'Jumbo adalah film petualangan dengan genre fantasi animasi Indonesia tahun 2025 yang disutradarai oleh Ryan Adriandhy dalam debut penyutradaraannya. Film produksi Visinema Studios bersama Springboard dan Anami Films ini dibintangi oleh Prince Poetiray, Quinn Salman; Bunga Citra Lestari, dan Ariel', 2025, 10, 'Drama', 'Happy', 'adada', 102, 'uploads\\films\\d2c88e8eb868dd190b994c9883862400', 'uploads\\films\\ba6f53cc39f6de256fc9b36d855177c3', 'Ryan Adriandhy', 2, '-', '-', '-', '-', 0, 0, '2025-06-07 03:38:21', '2025-06-07 04:41:31'),
	(22, 'Agak Laen', 'adada', 2012, 1, 'adada', '', '', 133, 'uploads\\films\\0ec5993fa05b3e007138439f6a425c5d', 'uploads\\films\\5c0d6c034a5ac2fb78d05d9df7041271', 'niko', 1, '', '', '', '', 0, 0, '2025-06-12 16:03:33', '2025-06-12 16:04:33'),
	(23, 'testfinal123', 'adada1232', 2022, 10, 'adada12', 'adada23', '', 130, 'uploads\\films\\9a0e36caf04d5d2f19e6771889582c75', 'uploads\\films\\9530f1e8e24f9c6fd267be36280a75ec', 'Ryan Adriandhy', 1, 'da', 'dada', 'ada', 'ada', 0, 0, '2025-06-16 18:29:23', '2025-06-16 18:31:58');

-- Dumping structure for table findfun_db.film_artists
CREATE TABLE IF NOT EXISTS `film_artists` (
  `film_id` int NOT NULL,
  `artist_id` int NOT NULL,
  `pemeran` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`film_id`,`artist_id`) USING BTREE,
  KEY `FK2_artist` (`artist_id`),
  CONSTRAINT `FK1_films` FOREIGN KEY (`film_id`) REFERENCES `films` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK2_artist` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.film_artists: ~5 rows (approximately)
INSERT INTO `film_artists` (`film_id`, `artist_id`, `pemeran`) VALUES
	(19, 5, 'Madara'),
	(19, 7, 'Naruto'),
	(20, 5, 'Madara'),
	(20, 7, 'Naruto'),
	(22, 5, 'adada'),
	(23, 8, 'adada');

-- Dumping structure for table findfun_db.konser
CREATE TABLE IF NOT EXISTS `konser` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_konser` varchar(255) NOT NULL,
  `deskripsi_acara` text,
  `lokasi` varchar(255) NOT NULL,
  `tanggal` date NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `maps_embed_url` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.konser: ~15 rows (approximately)
INSERT INTO `konser` (`id`, `nama_konser`, `deskripsi_acara`, `lokasi`, `tanggal`, `image`, `created_at`, `updated_at`, `maps_embed_url`) VALUES
	(1, 'Konser Musik Rock', 'Konser musik rock dengan penampilan band-band terkenal Indonesia', 'Gelora Bung Karno, Jakarta', '2023-12-15', 'konser_rock.jpg', '2025-06-14 08:09:42', '2025-06-14 08:09:42', NULL),
	(2, 'Festival Jazz Tahunan', 'Festival jazz dengan musisi jazz internasional dan lokal', 'Prambanan, Yogyakarta', '2023-11-20', 'jazz_festival.jpg', '2025-06-14 08:09:42', '2025-06-14 08:09:42', NULL),
	(3, 'Konser Musik Pop', 'Konser musik pop dengan penyanyi-penyanyi top Indonesia', 'ICE BSD, Tangerang', '2023-12-25', 'konser_pop.jpg', '2025-06-14 08:09:42', '2025-06-14 08:09:42', NULL),
	(4, 'Konser Musik Klasik', 'Konser musik klasik dengan orkestra terkenal', 'Aula Simfonia Jakarta', '2024-01-10', 'konser_klasik.jpg', '2025-06-14 08:09:42', '2025-06-14 08:09:42', NULL),
	(5, 'Festival Musik Indie', 'Festival musik indie dengan band-band indie lokal', 'Lapangan D Senayan, Jakarta', '2024-02-05', 'festival_indie.jpg', '2025-06-14 08:09:42', '2025-06-14 08:09:42', NULL),
	(6, 'Tetst', 'dada', 'aadada', '2025-06-15', 'uploads/konser/a9b30e0e3d0bd77be0737bcd883fa582', '2025-06-14 08:41:26', '2025-06-14 08:41:26', NULL),
	(7, 'adada', 'adada', 'adada', '2025-06-14', 'uploads/konser/8ebe089850b220e8475b35583f637611', '2025-06-14 09:20:44', '2025-06-14 09:20:44', NULL),
	(8, 'adadaad22', 'dadad', 'aadada', '2025-06-14', 'uploads/konser/bcac2731511e39c96ac30a0be0729898', '2025-06-14 09:29:12', '2025-06-14 09:29:12', NULL),
	(9, 'adada212', 'adwad', 'ada', '2025-06-14', 'uploads/konser/8e2bdda3798e32e47597f59235a319f6', '2025-06-14 09:36:05', '2025-06-14 09:36:05', NULL),
	(10, 'dwwd', 'dada', 'adad', '2025-06-14', 'uploads/konser/c796b5945c9593b27bb14ffc0e689728', '2025-06-14 09:38:22', '2025-06-14 09:38:22', NULL),
	(11, 'Tetst213245', 'adada', 'adada', '2025-06-14', 'uploads/konser/ab205c68a69feb88fe742f5d7908ac6c', '2025-06-14 09:40:24', '2025-06-14 09:40:24', NULL),
	(12, '123', 'adad', 'adada', '2025-06-15', 'uploads/konser/26a1426d515cbe615a70d2ddbfc7adb9', '2025-06-14 11:51:43', '2025-06-17 19:10:51', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.341673098422!2d106.80039117586813!3d-6.218595260909177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14d30079f01%3A0x2e74f2341fff266d!2sStadion%20Utama%20Gelora%20Bung%20Karno!5e0!3m2!1sid!2sid!4v1750187430098!5m2!1sid!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade'),
	(14, 'Test Peta', 'Tetst Peta', 'Jakata ', '2025-06-19', 'uploads/konser/447cf7e992b497a431be67ba79a1cb9d', '2025-06-17 18:51:26', '2025-06-17 18:51:26', NULL),
	(15, 'TEST GBK', 'GBK', 'GBK', '2025-06-19', 'uploads/konser/5d0584d72352e1298d7942e62348442d', '2025-06-17 19:12:12', '2025-06-17 19:12:12', NULL),
	(16, 'NCT DREAM TOUR THE DREAM SHOW 4 : DREAM THE FUTURE 2025', 'Jakarta International Stadium adalah sebuah stadion sepak bola yang berlokasi di Kelurahan Papanggo, Kecamatan Tanjung Priok, Jakarta Utara. Stadion ini merupakan stadion sepak bola pertama di Indonesia yang memiliki fasilitas atap buka-tutup.', 'Jakarta Internasional Stadium', '2025-06-20', 'uploads/konser/bdca59e68433bb48a98ca003c099652f', '2025-06-17 19:16:32', '2025-06-17 21:43:28', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.341673098422!2d106.80039117586813!3d-6.218595260909177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14d30079f01%3A0x2e74f2341fff266d!2sStadion%20Utama%20Gelora%20Bung%20Karno!5e0!3m2!1sid!2sid!4v1750187430098!5m2!1sid!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade');

-- Dumping structure for table findfun_db.konser_artist
CREATE TABLE IF NOT EXISTS `konser_artist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `konser_id` int NOT NULL,
  `artist_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `konser_id` (`konser_id`),
  KEY `artist_id` (`artist_id`),
  CONSTRAINT `konser_artist_ibfk_1` FOREIGN KEY (`konser_id`) REFERENCES `konser` (`id`) ON DELETE CASCADE,
  CONSTRAINT `konser_artist_ibfk_2` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.konser_artist: ~5 rows (approximately)
INSERT INTO `konser_artist` (`id`, `konser_id`, `artist_id`, `created_at`, `updated_at`) VALUES
	(1, 11, 8, '2025-06-14 09:40:24', '2025-06-14 09:40:24'),
	(2, 12, 7, '2025-06-14 11:51:43', '2025-06-14 11:51:43'),
	(5, 14, 8, '2025-06-17 18:51:26', '2025-06-17 18:51:26'),
	(6, 15, 8, '2025-06-17 19:12:12', '2025-06-17 19:12:12'),
	(7, 16, 7, '2025-06-17 19:16:32', '2025-06-17 19:16:32');

-- Dumping structure for table findfun_db.konser_pembayaran
CREATE TABLE IF NOT EXISTS `konser_pembayaran` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `konser_id` int NOT NULL,
  `nama` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `total_harga` decimal(10,2) NOT NULL,
  `payment_id` varchar(255) DEFAULT NULL,
  `bukti_pembayaran` varchar(255) DEFAULT NULL,
  `status` enum('WAITING','ACCEPT','REJECT') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'WAITING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `konser_tiket_id` (`konser_id`) USING BTREE,
  KEY `FK_konser_pembayaran_users` (`users_id`),
  CONSTRAINT `FK_konser_pembayaran_konser` FOREIGN KEY (`konser_id`) REFERENCES `konser` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_konser_pembayaran_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.konser_pembayaran: ~8 rows (approximately)
INSERT INTO `konser_pembayaran` (`id`, `users_id`, `konser_id`, `nama`, `email`, `total_harga`, `payment_id`, `bukti_pembayaran`, `status`, `created_at`, `updated_at`) VALUES
	(1, 1, 7, 'wqdq', 'ada', 3000000.00, 'PAY-ROCK-001', 'bukti_bayar_1.jpg', 'REJECT', '2025-06-14 08:13:36', '2025-06-16 19:52:17'),
	(3, 2, 9, 'sss', 'ada', 3000000.00, 'PAY-POP-001', 'bukti_bayar_3.jpg', 'REJECT', '2025-06-14 08:13:36', '2025-06-17 10:28:00'),
	(4, 3, 10, 'ss', 'dada', 2400000.00, 'PAY-KLASIK-001', 'bukti_bayar_4.jpg', 'ACCEPT', '2025-06-14 08:13:36', '2025-06-16 20:12:14'),
	(5, 4, 11, 's', 'ada', 2600000.00, 'PAY-INDIE-001', 'bukti_bayar_5.jpg', 'REJECT', '2025-06-14 08:13:36', '2025-06-16 20:12:06'),
	(8, 4, 12, 'akjhd', 'akldjklajw@ajkhdjkah.com', 246.00, NULL, NULL, 'REJECT', '2025-06-17 08:27:20', '2025-06-17 10:27:48'),
	(10, 4, 10, 'akjhdgh', 'akldjklajw@ajkhdjkah.com', 369.00, 'VA-000010-72469299-49', 'uploads/konser_payment/6014ac9f043819b7ca738b94854b35ea', 'ACCEPT', '2025-06-17 08:43:09', '2025-06-17 12:24:05'),
	(11, 4, 12, 'akjdhkahdk', 'dakjhdk@kksw.ed', 3000.00, 'VA-000011-98375507-46', 'uploads/konser_payment/3fc854b63eb0d446665e5f309f67042b', 'WAITING', '2025-06-17 14:20:30', '2025-06-17 19:46:45'),
	(12, 4, 7, 'jdakjd', 'kajw@ajkdka', 11615.00, 'VA-000012-63620872-37', 'uploads/konser_payment/3fc854b63eb0d446665e5f309f67042b', 'ACCEPT', '2025-06-17 16:14:27', '2025-06-17 16:41:56'),
	(13, 4, 16, 'RamadhaniPrasetyo', 'RamadhaniPrasetyo@gamail.coa', 9000000.00, 'VA-000013-94484729-51', 'uploads/konser_payment/be33007fc722eca2776244586c314176', 'WAITING', '2025-06-17 21:46:32', '2025-06-17 21:46:47');

-- Dumping structure for table findfun_db.konser_tiket_detail
CREATE TABLE IF NOT EXISTS `konser_tiket_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `konser_tiket_id` int NOT NULL,
  `jenis_tiket` varchar(100) NOT NULL,
  `harga` decimal(10,2) NOT NULL,
  `jumlah` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `konser_tiket_id` (`konser_tiket_id`),
  CONSTRAINT `FK_konser_tiket_detail_konser_pembayaran` FOREIGN KEY (`konser_tiket_id`) REFERENCES `konser_pembayaran` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.konser_tiket_detail: ~9 rows (approximately)
INSERT INTO `konser_tiket_detail` (`id`, `konser_tiket_id`, `jenis_tiket`, `harga`, `jumlah`) VALUES
	(8, 3, 'VIP', 1500000.00, 2),
	(9, 1, 'Gold', 1200000.00, 1),
	(11, 4, 'Festival', 1000000.00, 3),
	(12, 3, 'Premium', 1200000.00, 2),
	(14, 1, 'Premium', 2000000.00, 1),
	(15, 8, 'VIP2', 123.00, 2),
	(16, 10, 'VIP', 123.00, 3),
	(17, 11, 'GOLD', 1000.00, 3),
	(18, 12, 'VIP', 2323.00, 5),
	(19, 13, 'SILVER', 4500000.00, 2);

-- Dumping structure for table findfun_db.konser_tiket_jenis
CREATE TABLE IF NOT EXISTS `konser_tiket_jenis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `konser_id` int NOT NULL,
  `jenis_tiket` varchar(100) NOT NULL,
  `harga` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `konser_id` (`konser_id`),
  CONSTRAINT `konser_tiket_jenis_ibfk_1` FOREIGN KEY (`konser_id`) REFERENCES `konser` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.konser_tiket_jenis: ~36 rows (approximately)
INSERT INTO `konser_tiket_jenis` (`id`, `konser_id`, `jenis_tiket`, `harga`) VALUES
	(1, 1, 'VIP', 1500000.00),
	(2, 1, 'Festival', 750000.00),
	(3, 1, 'Reguler', 350000.00),
	(4, 2, 'Premium', 2000000.00),
	(5, 2, 'Gold', 1200000.00),
	(6, 2, 'Silver', 800000.00),
	(7, 3, 'VVIP', 2500000.00),
	(8, 3, 'VIP', 1800000.00),
	(9, 3, 'Festival', 1000000.00),
	(10, 3, 'Reguler', 500000.00),
	(11, 4, 'Premium', 1200000.00),
	(12, 4, 'Reguler', 600000.00),
	(13, 5, 'Early Bird', 450000.00),
	(14, 5, 'Presale', 650000.00),
	(15, 5, 'On The Spot', 850000.00),
	(16, 6, 'VIP', 1000.00),
	(17, 6, 'GOLD', 12323.00),
	(18, 6, 'SILVER', 1323545.00),
	(19, 7, 'VIP', 2323.00),
	(20, 7, 'GOLD', 1323.00),
	(21, 7, 'SILVER', 13123.00),
	(22, 8, 'VIP', 12.00),
	(23, 8, 'GOLD', 212.00),
	(24, 8, 'SILVER', 133.00),
	(25, 9, 'VIP', 212.00),
	(26, 9, 'GOLD', 1323.00),
	(27, 9, 'SILVER', 1319.00),
	(28, 10, 'VIP', 123.00),
	(29, 10, 'GOLD', 134.00),
	(30, 10, 'SILVER', 1233.00),
	(31, 11, 'VIP', 122.00),
	(32, 11, 'GOLD', 1232.00),
	(33, 11, 'SILVER', 1232.00),
	(34, 12, 'VIP2', 123.00),
	(35, 12, 'GOLD', 1000.00),
	(36, 12, 'SILVER', 1000.00),
	(41, 14, 'VIP', 123.00),
	(42, 14, 'GOLD', 321.00),
	(43, 14, 'SILVER', 123.00),
	(44, 15, 'VIP', 12.00),
	(45, 15, 'GOLD', 32.00),
	(46, 15, 'SILVER', 43.00),
	(47, 16, 'VIP', 12300000.00),
	(48, 16, 'GOLD', 7000000.00),
	(49, 16, 'SILVER', 4500000.00);

-- Dumping structure for table findfun_db.music
CREATE TABLE IF NOT EXISTS `music` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `lirik` text,
  `release_year` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `genre1` varchar(100) DEFAULT NULL,
  `genre2` varchar(100) DEFAULT NULL,
  `genre3` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `like_user` int DEFAULT NULL,
  `dislike` int DEFAULT NULL,
  `spotify_link` varchar(255) DEFAULT NULL,
  `apple_link` varchar(255) DEFAULT NULL,
  `youtube_link` varchar(255) DEFAULT NULL,
  `deezer_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.music: ~6 rows (approximately)
INSERT INTO `music` (`id`, `title`, `lirik`, `release_year`, `rating`, `genre1`, `genre2`, `genre3`, `image`, `like_user`, `dislike`, `spotify_link`, `apple_link`, `youtube_link`, `deezer_link`, `created_at`, `updated_at`) VALUES
	(3, 'Cupid', 'dadwd', 2022, 1, 'POP', '', '', 'uploads/e63d4b181e1097ee82a731e961eb1f64', 0, 0, 'http://localhost:5173/dashboard/addmusic', 'http://localhost:5173/dashboard/addmusic', 'http://localhost:3000/api/music/', 'http://localhost:5173/dashboard/addmusic', '2025-05-31 09:18:07', '2025-06-04 11:16:08'),
	(5, 'Super Shy', 'asdw', 2021, 1, 'POP', '', '', 'uploads/9ae57b6eefa8d71595517cab83e249de', 0, 0, 'http://localhost:5173/dashboard/addmusic', 'http://localhost:5173/dashboard/addmusic', 'http://localhost:3000/api/music/', 'http://localhost:5173/dashboard/addmusic', '2025-06-01 07:58:01', '2025-06-06 14:01:49'),
	(6, 'Dandelions', 'gfdhghgfh', 2020, 1, 'POP', 'Happy', '', 'uploads/fd2e814980474ca3d118cd91974acf90', 0, 0, 'http://localhost:5173/dashboard/addmusic', 'http://localhost:5173/dashboard/addmusic', 'http://localhost:3000/api/music/', 'http://localhost:5173/dashboard/addmusic', '2025-06-01 08:15:07', '2025-06-06 14:02:33'),
	(7, 'Dive Into You', 'awad', 2012, 1, 'POP', '', '', 'uploads/c974003d9cb2f01f4cf4aaa3a210bb27', 0, 0, 'http://localhost:5173/dashboard/addmusic', 'http://localhost:5173/dashboard/addmusic', 'http://localhost:3000/api/music/', 'http://localhost:5173/dashboard/addmusic', '2025-06-01 08:28:41', '2025-06-04 11:13:27'),
	(8, 'TULUS - Tujuh Belas', '(Muda jiwa, selamanya muda)\r\n(Kisah kita abadi selamanya)\r\n(Muda jiwa, selamanya muda)\r\n(Kisah kita abadi selamanya)\r\nMasihkah kau mengingat di saat kita masih 17?\r\nWaktu di mana tanggal-tanggal merah terasa sungguh meriah\r\nMasihkah kauingat cobaan terberat kita, Matematika?\r\nMasihkah engkau ingat lagu di radio yang merdu mengudara?\r\nKita masih sebebas itu\r\nRasa takut yang tak pernah mengganggu\r\nBatas naluri bahaya\r\nDulu tingginya lebihi logika\r\nPutaran Bumi dan waktu yang terus berjalan menempa kita\r\nWalau kini kita terpisah, namun, jiwaku tetap di sana (hey)\r\n(Di masa masih sebebas itu) oh, di masa\r\nRasa takut yang tak pernah mengganggu\r\nDi masa naluri bahaya\r\nDulu tingginya lebihi logika\r\nMuda jiwa, selamanya muda\r\nKisah kita abadi selamanya\r\n(Kita masih sebebas itu) kita masih sebebas itu\r\n(Rasa takut yang tak pernah mengganggu)\r\nRasa takut yang tak pernah mengganggu\r\n(Batas naluri bahaya, oh-oh)\r\n(Dulu tingginya lebihi logika)\r\nSederas apa pun arus di hidupmu\r\nGenggam terus kenangan tentang kita\r\nSeberapa pun dewasa mengujimu\r\nTakkan lebih dari yang engkau bisa\r\nDan kisah kita abadi untuk s\'lama-lamanya', 2022, 1, 'POP', 'Jazz', '', 'uploads/2165bef95407b5614bb922d2c6b7f9bf', 0, 0, 'http://localhost:5173/dashboard/addmusic', 'http://localhost:5173/dashboard/addmusic', 'http://localhost:3000/api/music/', 'http://localhost:5173/dashboard/addmusic', '2025-06-04 02:34:56', '2025-06-04 02:34:56'),
	(9, 'Cupid', 'adawd', 2022, 1, 'adada', '', '', 'uploads/96974b6b2d7676459f15772e7a2ae6db', 0, 0, '-', '-', '-', '-', '2025-06-12 16:06:24', '2025-06-12 16:07:33'),
	(10, 'testt', 'adada', 2002, 10, 'adada12', 'ada gebre', '', 'uploads/f3ceeaf0f2441df6187b264ac0a9b223', 0, 0, '-', '-', '-', '-', '2025-06-16 19:12:42', '2025-06-16 19:14:40');

-- Dumping structure for table findfun_db.music_albums
CREATE TABLE IF NOT EXISTS `music_albums` (
  `music_id` int NOT NULL,
  `album_id` int NOT NULL,
  PRIMARY KEY (`music_id`,`album_id`),
  KEY `album_id` (`album_id`),
  CONSTRAINT `music_albums_ibfk_1` FOREIGN KEY (`music_id`) REFERENCES `music` (`id`) ON DELETE CASCADE,
  CONSTRAINT `music_albums_ibfk_2` FOREIGN KEY (`album_id`) REFERENCES `albums` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.music_albums: ~9 rows (approximately)
INSERT INTO `music_albums` (`music_id`, `album_id`) VALUES
	(5, 2),
	(6, 2),
	(8, 2),
	(3, 3),
	(5, 3),
	(7, 3),
	(8, 3),
	(9, 3),
	(6, 5),
	(10, 21);

-- Dumping structure for table findfun_db.music_artists
CREATE TABLE IF NOT EXISTS `music_artists` (
  `music_id` int NOT NULL,
  `artist_id` int NOT NULL,
  PRIMARY KEY (`music_id`,`artist_id`),
  KEY `artist_id` (`artist_id`),
  CONSTRAINT `music_artists_ibfk_1` FOREIGN KEY (`music_id`) REFERENCES `music` (`id`) ON DELETE CASCADE,
  CONSTRAINT `music_artists_ibfk_2` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.music_artists: ~8 rows (approximately)
INSERT INTO `music_artists` (`music_id`, `artist_id`) VALUES
	(5, 5),
	(6, 5),
	(7, 5),
	(9, 5),
	(3, 7),
	(5, 7),
	(6, 7),
	(8, 7),
	(10, 8);

-- Dumping structure for table findfun_db.reserved_seats
CREATE TABLE IF NOT EXISTS `reserved_seats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `schedule_id` int NOT NULL,
  `seat_id` varchar(5) NOT NULL,
  `user_id` int NOT NULL,
  `status` enum('reserved','available') DEFAULT 'reserved',
  `reserved_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `schedule_id` (`schedule_id`) USING BTREE,
  CONSTRAINT `FK_reserved_seats_schedules` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`),
  CONSTRAINT `reserved_seats_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.reserved_seats: ~77 rows (approximately)
INSERT INTO `reserved_seats` (`id`, `schedule_id`, `seat_id`, `user_id`, `status`, `reserved_at`) VALUES
	(3, 1, 'A2', 1, 'reserved', '2025-06-08 08:49:00'),
	(4, 1, 'A1', 1, 'reserved', '2025-06-08 08:49:00'),
	(5, 2, 'A3', 1, 'reserved', '2025-06-08 08:48:59'),
	(6, 1, 'A4', 1, 'reserved', '2025-06-08 08:48:58'),
	(7, 3, 'A5', 1, 'reserved', '2025-06-08 08:48:57'),
	(8, 3, 'A1', 1, 'reserved', '2025-06-08 08:48:57'),
	(9, 3, 'B2', 1, 'reserved', '2025-06-08 08:48:56'),
	(10, 3, '3', 1, 'reserved', '2025-06-08 08:48:54'),
	(11, 3, 'A1', 1, 'reserved', '2025-06-08 08:48:55'),
	(12, 3, 'A1', 1, 'reserved', '2025-06-08 08:48:53'),
	(13, 3, 'A1', 1, 'reserved', '2025-06-08 08:48:52'),
	(14, 3, 'A1', 1, 'reserved', '2025-06-08 08:48:52'),
	(15, 3, 'A1', 1, 'reserved', '2025-06-08 08:48:50'),
	(16, 3, 'C1', 1, 'reserved', '2025-06-08 09:00:07'),
	(17, 3, 'C2', 1, 'reserved', '2025-06-08 09:00:07'),
	(18, 3, 'C1', 1, 'reserved', '2025-06-08 09:01:45'),
	(19, 3, 'C2', 1, 'reserved', '2025-06-08 09:01:45'),
	(20, 2, 'B4', 1, 'reserved', '2025-06-08 10:19:24'),
	(21, 2, 'B5', 1, 'reserved', '2025-06-08 10:19:24'),
	(22, 3, 'C6', 1, 'reserved', '2025-06-08 10:26:05'),
	(23, 3, 'C7', 1, 'reserved', '2025-06-08 10:26:05'),
	(24, 3, 'C8', 1, 'reserved', '2025-06-08 10:26:05'),
	(25, 3, 'C9', 1, 'reserved', '2025-06-08 10:26:05'),
	(26, 3, 'C10', 1, 'reserved', '2025-06-08 10:26:05'),
	(27, 1, 'C1', 1, 'reserved', '2025-06-09 05:06:27'),
	(28, 1, 'C2', 1, 'reserved', '2025-06-09 05:06:27'),
	(29, 1, 'C3', 1, 'reserved', '2025-06-09 05:06:27'),
	(30, 1, 'C4', 1, 'reserved', '2025-06-09 05:06:27'),
	(31, 1, 'C5', 1, 'reserved', '2025-06-09 05:06:27'),
	(32, 1, 'C6', 1, 'reserved', '2025-06-09 05:06:27'),
	(33, 1, 'C7', 1, 'reserved', '2025-06-09 05:06:27'),
	(34, 1, 'C8', 1, 'reserved', '2025-06-09 05:06:27'),
	(35, 1, 'D4', 1, 'reserved', '2025-06-09 05:06:27'),
	(36, 1, 'D5', 1, 'reserved', '2025-06-09 05:06:27'),
	(37, 1, 'D6', 1, 'reserved', '2025-06-09 05:06:27'),
	(38, 1, 'D7', 1, 'reserved', '2025-06-09 05:06:27'),
	(39, 1, 'D8', 1, 'reserved', '2025-06-09 05:06:27'),
	(40, 3, 'F6', 1, 'reserved', '2025-06-09 09:31:18'),
	(41, 3, 'F7', 1, 'reserved', '2025-06-09 09:31:18'),
	(42, 3, 'E1', 1, 'reserved', '2025-06-10 12:21:49'),
	(43, 3, 'E2', 1, 'reserved', '2025-06-10 12:21:49'),
	(44, 3, 'E3', 1, 'reserved', '2025-06-10 12:21:49'),
	(45, 3, 'E4', 1, 'reserved', '2025-06-10 12:21:49'),
	(46, 3, 'E5', 1, 'reserved', '2025-06-10 12:21:49'),
	(47, 3, 'E6', 1, 'reserved', '2025-06-10 12:21:49'),
	(48, 3, 'E7', 1, 'reserved', '2025-06-10 12:21:49'),
	(49, 3, 'E8', 1, 'reserved', '2025-06-10 12:21:49'),
	(50, 3, 'E9', 1, 'reserved', '2025-06-10 12:21:49'),
	(51, 3, 'E10', 1, 'reserved', '2025-06-10 12:21:49'),
	(52, 2, 'C2', 1, 'reserved', '2025-06-10 12:53:18'),
	(53, 2, 'C3', 1, 'reserved', '2025-06-10 12:53:18'),
	(54, 2, 'D3', 1, 'reserved', '2025-06-10 12:53:18'),
	(55, 2, 'E3', 1, 'reserved', '2025-06-10 12:53:18'),
	(56, 2, 'E2', 1, 'reserved', '2025-06-10 12:53:18'),
	(57, 2, 'E1', 1, 'reserved', '2025-06-10 12:53:18'),
	(58, 2, 'D1', 1, 'reserved', '2025-06-10 12:53:18'),
	(59, 2, 'C1', 1, 'reserved', '2025-06-10 12:53:18'),
	(60, 2, 'D2', 1, 'reserved', '2025-06-10 13:03:11'),
	(61, 3, 'H7', 1, 'reserved', '2025-06-10 17:19:45'),
	(62, 3, 'H8', 1, 'reserved', '2025-06-10 17:19:45'),
	(63, 3, 'H9', 1, 'reserved', '2025-06-10 17:19:45'),
	(64, 2, 'F7', 1, 'reserved', '2025-06-12 12:44:51'),
	(65, 2, 'G7', 1, 'reserved', '2025-06-12 12:44:51'),
	(66, 2, 'G8', 1, 'reserved', '2025-06-12 12:44:51'),
	(67, 2, 'E11', 3, 'reserved', '2025-06-12 13:35:40'),
	(68, 2, 'E12', 3, 'reserved', '2025-06-12 13:35:40'),
	(69, 3, 'E12', 3, 'reserved', '2025-06-13 09:27:36'),
	(70, 3, 'E13', 3, 'reserved', '2025-06-13 09:27:36'),
	(71, 3, 'F13', 3, 'reserved', '2025-06-13 09:27:36'),
	(72, 3, 'F12', 3, 'reserved', '2025-06-13 09:27:36'),
	(73, 2, 'E5', 3, 'reserved', '2025-06-13 19:53:01'),
	(74, 2, 'E6', 3, 'reserved', '2025-06-13 19:53:01'),
	(75, 2, 'F6', 3, 'reserved', '2025-06-13 19:53:01'),
	(76, 2, 'G6', 3, 'reserved', '2025-06-13 19:53:01'),
	(77, 2, 'H6', 3, 'reserved', '2025-06-13 19:53:01'),
	(78, 2, 'H7', 3, 'reserved', '2025-06-13 19:53:01'),
	(79, 1, 'G6', 3, 'reserved', '2025-06-13 20:01:18'),
	(80, 1, 'G7', 3, 'reserved', '2025-06-13 20:01:18'),
	(81, 7, 'F7', 4, 'reserved', '2025-06-17 05:47:03'),
	(82, 7, 'F9', 4, 'reserved', '2025-06-17 05:47:03'),
	(83, 7, 'F8', 4, 'reserved', '2025-06-17 05:47:03'),
	(84, 7, 'G8', 4, 'reserved', '2025-06-17 05:47:03'),
	(85, 7, 'H8', 4, 'reserved', '2025-06-17 05:47:03'),
	(86, 7, 'D8', 4, 'reserved', '2025-06-17 06:02:19'),
	(87, 7, 'D9', 4, 'reserved', '2025-06-17 06:02:19'),
	(88, 7, 'E4', 4, 'reserved', '2025-06-17 06:20:06'),
	(89, 7, 'E5', 4, 'reserved', '2025-06-17 06:20:06'),
	(90, 7, 'F5', 4, 'reserved', '2025-06-17 06:20:06'),
	(91, 7, 'G5', 4, 'reserved', '2025-06-17 06:20:06'),
	(92, 7, 'G6', 4, 'reserved', '2025-06-17 06:20:06'),
	(93, 2, 'F9', 4, 'reserved', '2025-06-17 14:35:05'),
	(94, 2, 'F10', 4, 'reserved', '2025-06-17 14:35:05'),
	(95, 2, 'G10', 4, 'reserved', '2025-06-17 14:35:05'),
	(96, 8, 'C3', 4, 'reserved', '2025-06-17 16:44:22'),
	(97, 8, 'C4', 4, 'reserved', '2025-06-17 16:44:22'),
	(98, 8, 'C5', 4, 'reserved', '2025-06-17 16:44:22'),
	(99, 8, 'C6', 4, 'reserved', '2025-06-17 16:44:22'),
	(100, 8, 'C7', 4, 'reserved', '2025-06-17 16:44:22'),
	(101, 8, 'C8', 4, 'reserved', '2025-06-17 16:44:22'),
	(102, 8, 'D8', 4, 'reserved', '2025-06-17 16:44:22'),
	(103, 8, 'E8', 4, 'reserved', '2025-06-17 16:44:22'),
	(104, 8, 'F8', 4, 'reserved', '2025-06-17 16:44:22'),
	(105, 8, 'F7', 4, 'reserved', '2025-06-17 16:44:22'),
	(106, 8, 'F6', 4, 'reserved', '2025-06-17 16:44:22'),
	(107, 8, 'F5', 4, 'reserved', '2025-06-17 16:44:22'),
	(108, 8, 'F4', 4, 'reserved', '2025-06-17 16:44:22'),
	(109, 8, 'F3', 4, 'reserved', '2025-06-17 16:44:22'),
	(110, 8, 'E3', 4, 'reserved', '2025-06-17 16:44:22'),
	(111, 8, 'D3', 4, 'reserved', '2025-06-17 16:44:22'),
	(112, 8, 'D5', 4, 'reserved', '2025-06-17 16:44:22'),
	(113, 8, 'E5', 4, 'reserved', '2025-06-17 16:44:22'),
	(114, 8, 'E6', 4, 'reserved', '2025-06-17 16:44:22'),
	(115, 8, 'D6', 4, 'reserved', '2025-06-17 16:44:22');

-- Dumping structure for table findfun_db.schedules
CREATE TABLE IF NOT EXISTS `schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `film_id` int DEFAULT NULL,
  `cinema_location_id` int DEFAULT NULL,
  `show_time` time DEFAULT NULL,
  `price_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `film_id` (`film_id`),
  KEY `price_id` (`price_id`),
  KEY `cinema_location_id` (`cinema_location_id`),
  CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`film_id`) REFERENCES `films` (`id`) ON DELETE CASCADE,
  CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`price_id`) REFERENCES `ticket_prices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `schedules_ibfk_3` FOREIGN KEY (`cinema_location_id`) REFERENCES `cinema_locations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.schedules: ~8 rows (approximately)
INSERT INTO `schedules` (`id`, `film_id`, `cinema_location_id`, `show_time`, `price_id`, `created_at`, `updated_at`) VALUES
	(1, 19, 1, '10:20:00', 1, '2025-06-07 17:31:23', '2025-06-15 04:29:45'),
	(2, 19, 1, '11:55:00', 1, '2025-06-07 17:52:36', '2025-06-15 04:55:50'),
	(3, 19, 2, '10:30:29', 1, '2025-06-07 18:16:32', '2025-06-15 05:55:59'),
	(5, 19, 2, '13:42:00', 1, '2025-06-15 05:36:46', '2025-06-15 05:36:46'),
	(7, 19, 1, '17:00:00', 1, '2025-06-15 05:54:39', '2025-06-15 05:54:39'),
	(8, 19, 2, '15:00:00', 1, '2025-06-15 05:54:53', '2025-06-15 05:54:53'),
	(11, 20, 3, '16:00:00', 3, '2025-06-15 16:44:50', '2025-06-17 19:44:42'),
	(12, 20, 3, '15:26:00', 3, '2025-06-16 06:24:56', '2025-06-16 06:24:56'),
	(13, 23, 5, '04:52:00', 5, '2025-06-17 21:52:57', '2025-06-17 21:52:57');

-- Dumping structure for table findfun_db.tickets
CREATE TABLE IF NOT EXISTS `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `film_id` int DEFAULT NULL,
  `schedule_id` int DEFAULT NULL,
  `seats` json DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `payment_id` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('ACCEPT','REJECT','WAITING') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'WAITING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `film_id` (`film_id`),
  KEY `schedule_id` (`schedule_id`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`film_id`) REFERENCES `films` (`id`),
  CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.tickets: ~19 rows (approximately)
INSERT INTO `tickets` (`id`, `user_id`, `nama`, `email`, `film_id`, `schedule_id`, `seats`, `total_price`, `payment_id`, `image`, `status`, `created_at`, `updated_at`) VALUES
	(1, 1, 'Dhani', 'dhani@gmail.com', 19, 3, '[18, 19]', 120000.00, NULL, NULL, 'REJECT', '2025-06-08 09:01:45', '2025-06-09 09:37:50'),
	(2, 1, '', '', 19, 2, '[20, 21]', 70000.00, NULL, NULL, 'REJECT', '2025-06-08 10:19:24', '2025-06-09 09:37:50'),
	(3, 1, 'testt', 'findfund@gmail.com', 19, 3, '[22, 23, 24, 25, 26]', 250000.00, NULL, NULL, 'REJECT', '2025-06-08 10:26:05', '2025-06-09 09:37:50'),
	(4, 1, 'Fajarsurya', 'fajar@gmail.com', 19, 1, '[27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]', 455000.00, NULL, NULL, 'REJECT', '2025-06-09 05:06:27', '2025-06-09 09:37:50'),
	(5, 1, 'Nadia Ayu Rahmawati', 'Nadia@gmail.com', 19, 3, '"F6,F7"', 100000.00, 'VA-8542703408-32', 'uploads/artists/0783f4d21cedd9075cff9b5499dae463', 'ACCEPT', '2025-06-09 09:31:18', '2025-06-13 09:23:09'),
	(6, 1, 'Ramadhani Prasetyo', 'ramadhani@gmail.com', 19, 3, '"E1,E10,E2,E3,E4,E5,E6,E7,E8,E9"', 500000.00, 'VA-1245102833-38', 'uploads/artists/0783f4d21cedd9075cff9b5499dae463', 'ACCEPT', '2025-06-10 12:21:49', '2025-06-13 09:23:04'),
	(7, 1, 'Ramadhani Prasetyo22', 'ramadhani22@gmail.com', 19, 2, '"C1,C2,C3,D1,D3,E1,E2,E3"', 280000.00, 'VA-8656994171-65', NULL, 'REJECT', '2025-06-10 12:53:18', '2025-06-10 12:53:25'),
	(8, 1, 'Nadia Ayu Rahmawati', 'Nadia@gmail.com', 19, 2, '"D2"', 35000.00, 'VA-4136994792-36', 'uploads/artists/0783f4d21cedd9075cff9b5499dae463', 'ACCEPT', '2025-06-10 13:03:11', '2025-06-13 09:11:42'),
	(9, 1, 'Nadia Ayu Rahmawati', 'Nadia@gmail.com', 19, 3, '[61, 62, 63]', 150000.00, NULL, NULL, 'REJECT', '2025-06-10 17:19:45', '2025-06-10 17:19:45'),
	(10, 1, 'Nadia Ayu Rahmawati22', 'Nadia@gmail.com', 19, 2, '[64, 65, 66]', 105000.00, NULL, 'uploads/artists/0783f4d21cedd9075cff9b5499dae463', 'REJECT', '2025-06-12 12:44:51', '2025-06-13 09:11:59'),
	(11, 1, 'Ramadhani Prasetyo22', 'ramadhani22@gmail.com', 19, 2, '"E11,E12"', 70000.00, 'VA-4130124688-55', 'uploads/artists/0783f4d21cedd9075cff9b5499dae463', 'REJECT', '2025-06-12 13:35:40', '2025-06-16 12:46:01'),
	(12, 1, 'Surya', 'surya20@gmail.com', 19, 3, '"E12,E13,F12,F13"', 200000.00, 'VA-8999550022-31', NULL, 'WAITING', '2025-06-13 09:27:36', '2025-06-13 09:27:50'),
	(13, 1, 'SuryaGanteng', 'ramadhani22@gmail.com', 19, 2, '"E5,E6,F6,G6,H6,H7"', 210000.00, 'VA-3354704524-55', NULL, 'WAITING', '2025-06-13 19:53:01', '2025-06-13 19:53:13'),
	(14, 3, 'SuryaGanteng', 'ramadhani22@gmail.com', 19, 1, '"G6,G7"', 70000.00, 'VA-7890409710-9', NULL, 'WAITING', '2025-06-13 20:01:18', '2025-06-13 20:01:28'),
	(15, 4, 'djkahk', 'dakkdjhak@dahkjd.com', 19, 7, '"F7,F8,F9,G8,H8"', 175000.00, 'VA-9144630835-16', NULL, 'WAITING', '2025-06-17 05:47:03', '2025-06-17 05:47:12'),
	(16, 4, 'adad', 'ada@dad.com', 19, 7, '"D8,D9"', 70000.00, 'VA-3039891093-18', NULL, 'WAITING', '2025-06-17 06:02:19', '2025-06-17 06:17:39'),
	(17, 4, 'test123', 'adakjh@gmail.com', 19, 7, '"E4,E5,F5,G5,G6"', 175000.00, 'VA-2604705833-2', 'uploads\\payment\\7113c17eb64fcac81106f79810888b10', 'ACCEPT', '2025-06-17 06:20:06', '2025-06-17 12:26:25'),
	(18, 4, 'test123jjh', 'adakjhghgh@gmail.com', 19, 2, '"F10,F9,G10"', 105000.00, 'VA-7574314365-18', 'uploads\\payment\\0fba452b255ec1dc30d8464f7cd5cc19', 'WAITING', '2025-06-17 14:35:05', '2025-06-17 14:35:18'),
	(19, 4, 'test123jjh', 'adakjhghgh@gmail.com', 19, 8, '"C3,C4,C5,C6,C7,C8,D3,D5,D6,D8,E3,E5,E6,E8,F3,F4,F5,F6,F7,F8"', 1000000.00, 'VA-1122465321-18', 'uploads\\payment\\7f7ea18025e3075f5860dd3b506ef3ea', 'ACCEPT', '2025-06-17 16:44:22', '2025-06-17 19:45:49');

-- Dumping structure for table findfun_db.ticket_prices
CREATE TABLE IF NOT EXISTS `ticket_prices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticket_type` varchar(50) NOT NULL,
  `price` int NOT NULL,
  `film_id` int NOT NULL,
  `cinema_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `film_id` (`film_id`),
  KEY `FK_ticket_prices_cinema_locations` (`cinema_id`),
  CONSTRAINT `FK_ticket_prices_cinema_locations` FOREIGN KEY (`cinema_id`) REFERENCES `cinema_locations` (`id`),
  CONSTRAINT `ticket_prices_ibfk_1` FOREIGN KEY (`film_id`) REFERENCES `films` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.ticket_prices: ~2 rows (approximately)
INSERT INTO `ticket_prices` (`id`, `ticket_type`, `price`, `film_id`, `cinema_id`) VALUES
	(1, 'Silver', 35000, 19, 1),
	(2, 'Gold', 50000, 19, 2),
	(3, 'Reguler', 20000, 20, 3),
	(4, 'Biasa Aja', 10000, 22, 4),
	(5, 'Reguler', 40000, 23, 5);

-- Dumping structure for table findfun_db.ticket_seats
CREATE TABLE IF NOT EXISTS `ticket_seats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticket_id` int NOT NULL,
  `seat_id` varchar(5) NOT NULL,
  `status` enum('reserved','available') DEFAULT 'reserved',
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `ticket_seats_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.ticket_seats: ~0 rows (approximately)

-- Dumping structure for table findfun_db.ulasan
CREATE TABLE IF NOT EXISTS `ulasan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `film_id` int DEFAULT NULL,
  `music_id` int DEFAULT NULL,
  `album_id` int DEFAULT NULL,
  `title_review` text,
  `alur_review` text,
  `sinematografi_review` text,
  `pemeran_review` text,
  `review_lain` text,
  `kategori` varchar(50) DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT '0.0',
  `like_ulasan` int DEFAULT '0',
  `dislike_ulasan` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_user` (`user_id`),
  KEY `fk_album` (`album_id`),
  KEY `fk_film` (`film_id`),
  KEY `fk_music` (`music_id`),
  CONSTRAINT `fk_album` FOREIGN KEY (`album_id`) REFERENCES `albums` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_film` FOREIGN KEY (`film_id`) REFERENCES `films` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_music` FOREIGN KEY (`music_id`) REFERENCES `music` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.ulasan: ~8 rows (approximately)
INSERT INTO `ulasan` (`id`, `user_id`, `film_id`, `music_id`, `album_id`, `title_review`, `alur_review`, `sinematografi_review`, `pemeran_review`, `review_lain`, `kategori`, `rating`, `like_ulasan`, `dislike_ulasan`, `created_at`, `updated_at`) VALUES
	(2, 3, 19, NULL, NULL, NULL, 'tadad', 'ladjla', 'dadkakjd', 'adajl;dja', '1', 2.0, 0, 0, '2025-06-13 18:13:54', '2025-06-13 18:13:54'),
	(3, 3, 20, NULL, NULL, NULL, 'adada', 'adad', 'adada', 'adad', '1', 2.0, 0, 0, '2025-06-13 19:31:16', '2025-06-13 19:31:16'),
	(4, 3, 20, NULL, NULL, NULL, 'akdjlajdl', 'dajldjal', 'aldkjaldj', 'dlkajlda', '1', 2.0, 0, 0, '2025-06-13 19:32:27', '2025-06-13 19:32:27'),
	(5, 3, 20, NULL, NULL, NULL, 'akdjlajdl', 'dajldjal', 'aldkjaldj', 'dlkajlda', '2', 2.0, 0, 0, '2025-06-13 19:32:44', '2025-06-13 19:32:44'),
	(6, 3, 20, NULL, NULL, NULL, 'akdjlajdl', 'dajldjal', 'aldkjaldj', 'dlkajlda', '1', 4.0, 0, 0, '2025-06-13 19:35:58', '2025-06-13 19:35:58'),
	(7, 3, 20, NULL, NULL, 'Oke Mantap sekali', 'adaw', 'adad', 'adad', 'adada', '2', 0.0, 0, 0, '2025-06-13 19:40:33', '2025-06-13 19:40:33'),
	(8, 3, 22, NULL, NULL, 'jahdkjhk', 'adw', 'dadw', 'dawdaw', 'dawdw', '1', 5.0, 0, 0, '2025-06-16 11:41:43', '2025-06-16 11:41:43'),
	(9, 3, 22, NULL, NULL, 'lkajdlkjldw', 'djakldlw', 'ajkldjalwjl', 'dkalwjdlkjwlk', 'adjaklwdjlk', '1', 5.0, 0, 0, '2025-06-16 11:42:05', '2025-06-16 11:42:05'),
	(10, 4, 19, NULL, NULL, 'adad', 'adad', 'adada', 'adad', 'adad', '1', 0.0, 0, 0, '2025-06-16 18:51:49', '2025-06-16 18:51:49');

-- Dumping structure for table findfun_db.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table findfun_db.users: ~6 rows (approximately)
INSERT INTO `users` (`id`, `email`, `username`, `password`, `role`, `image`, `created_at`, `updated_at`, `reset_token`, `reset_token_expires`) VALUES
	(1, 'admin@finfun.com', 'Admin', '$2b$10$VG7JvZZ8orYsRBLHhqY0YOaT.4wxK07Sq3kNXKJWHtqJ9.t8psOMK', 'user', 'uploads\\profile_images\\54e7694c6af37cb7d73e267413d2ae64', '2025-06-12 06:01:35', '2025-06-17 17:27:44', NULL, NULL),
	(2, 'rd711705@gmail.com', 'AdminDhani', '$2b$10$PBeO/HPDXnQa.PmeSrRpUurw9m8DIKLuLIIzxXcr9zi/.OTTdxbTS', 'admin', 'uploads\\profile_images\\6262c0469847a778c67783b9191bb583', '2025-06-12 06:55:28', '2025-06-17 17:41:20', NULL, NULL),
	(3, 'softwareseleb20@gmail.com', 'dhani', '$2b$10$fUpPnDrBBA69tyO5QmRBkOzi0JDP8HgUtWfC3fkvlF359wwsIjn/C', 'admin', 'uploads\\profile_images\\accf7079b230413986acad8bca51bf8c', '2025-06-12 10:00:15', '2025-06-17 17:29:04', NULL, NULL),
	(4, 'ramadhaniprasetyo2000@gmail.com', 'Ramadhani Prasetyo', '$2b$10$CpyAOIMeiq0srO74Up9eoejD63F4puuMj384mp1l7HjBc2vvyAJKu', 'user', 'uploads\\profile_images\\9fa7772783d27b1765ee847549b2bf88', '2025-06-16 12:21:44', '2025-06-17 22:26:04', NULL, NULL),
	(6, 'tseet12@gmail.com', 'tseet12', '$2b$10$gQobWxrfY1ljuR9UuTZ4IOKPkRoddDb8pr28K7NKSdrVYnpEbVd12', 'user', 'uploads\\profile_images\\d07135f97d47fc0eea538c54ce5826cd', '2025-06-17 17:41:00', '2025-06-17 17:41:00', NULL, NULL),
	(7, 'SuperAdmin@admin.com', 'SuperAdmin', '$2b$10$qERvpgttzk9aoXi9KS8XWuFt0d37XM9TX2CXjwK4.AnhFC5Z/XUOm', 'admin', 'uploads\\profile_images\\6f50dfce0dfcb3aa6915102de6c262c9', '2025-06-17 17:47:07', '2025-06-17 17:47:26', NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
