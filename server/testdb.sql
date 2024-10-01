-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 02, 2024 at 03:12 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `testdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `gym_registration`
--

CREATE TABLE `gym_registration` (
  `id` int(11) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `mname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(50) NOT NULL,
  `complete_address` varchar(255) CHARACTER SET latin1 COLLATE latin1_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `member_only`
--

CREATE TABLE `member_only` (
  `id` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `dateofbirth` date NOT NULL,
  `address` varchar(255) NOT NULL,
  `contactNum` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `dateJoined` date NOT NULL,
  `membershipType` varchar(50) NOT NULL,
  `medicalCondition` varchar(255) NOT NULL,
  `emergencyContact` varchar(50) NOT NULL,
  `relationship` varchar(50) NOT NULL,
  `emergencyContactNum` varchar(50) NOT NULL,
  `waiver` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`email`, `subject`, `message`) VALUES
('chiyokogaming02@gmail.com', 'asd21321', 'asdaas'),
('jal.devecais@lccbonline.edu.ph', 'test', '123123'),
('chiyokogaming02@gmail.com', 'asd', 'afs 123'),
('betheltisuela@gmail.com', 'GYM FITNESS REVIEW', 'kanami'),
('chiyokogaming02@gmail.com', 'hakdog', 'sdasd');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_waiver`
--

CREATE TABLE `tbl_waiver` (
  `id` int(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phoneNumber` int(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `training` varchar(255) NOT NULL,
  `termsandcondition` varchar(255) NOT NULL,
  `emergencyContact` text NOT NULL,
  `relationship` varchar(255) NOT NULL,
  `emergencyPhoneNumber` int(255) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_waiver`
--

INSERT INTO `tbl_waiver` (`id`, `firstName`, `lastName`, `address`, `phoneNumber`, `gender`, `training`, `termsandcondition`, `emergencyContact`, `relationship`, `emergencyPhoneNumber`, `status`) VALUES
(23, 'Jal', 'Ilon', 'Murcia, block 1, street devecais', 123456790, 'male', 'Boxing', 'Agree', 'Ladyann', 'Sister', 123123712, ''),
(24, 'Andrei ', 'Devecais', 'Talisay city, block 7, lot 8', 2147483647, 'male', 'Muay Thai', 'Agree', 'Alerose', 'Brother', 1234569702, ''),
(25, 'Nepthen ', 'Laguda', 'Gardenville, Californi, Block 69', 2131473192, 'male', 'Muay Thai', 'Agree', 'Sak Ka Bee', 'Bestie', 2147483647, ''),
(26, 'EJ', 'AP', 'Banago bulls, Japan', 98478329, 'female', 'Jiu Jitsu', 'Agree', 'Gabriel', 'Sister', 21471239, ''),
(27, 'FJ', 'Cutie', 'Brgy. Alijis, Purok Asayti', 948327592, 'female', 'Taekwondo', 'Agree', 'Charles', 'Thesis Partner', 2131471823, ''),
(28, 'Rafael', 'Lacson', 'Silay, Prk Swimming Pool', 2147483647, 'male', 'Muay Thai', 'Agree', 'Charles', 'Brother', 2147483647, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `gym_registration`
--
ALTER TABLE `gym_registration`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `member_only`
--
ALTER TABLE `member_only`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_waiver`
--
ALTER TABLE `tbl_waiver`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `gym_registration`
--
ALTER TABLE `gym_registration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `member_only`
--
ALTER TABLE `member_only`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_waiver`
--
ALTER TABLE `tbl_waiver`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
