import React from 'react';
// Comprehensive React Icons Bridge using react-icons/fi, react-icons/fa6, react-icons/gi, react-icons/md, react-icons/hi2, react-icons/tb, react-icons/bi

// Feather / Modern Line Icons
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrendingUp,
  FiArrowRight,
  FiArrowLeft,
  FiDownload,
  FiPrinter,
  FiSearch,
  FiSliders,
  FiTrash2,
  FiEdit,
  FiRefreshCw,
  FiExternalLink,
  FiShield,
  FiLock,
  FiUnlock,
  FiPhone,
  FiMail,
  FiInfo,
  FiEye,
  FiEyeOff,
  FiUserCheck,
  FiCpu,
  FiGlobe,
  FiCompass,
  FiSend,
  FiDatabase,
  FiActivity,
  FiVolume2,
  FiVolumeX,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiX,
  FiCheck,
  FiShare2,
  FiCopy,
  FiCamera,
  FiCloudRain,
  FiKey,
  FiWifi,
  FiBattery,
  FiTrendingDown,
  FiLayers,
  FiArrowDownRight,
  FiMessageSquare
} from 'react-icons/fi';

// FontAwesome 6 Icons
import {
  FaTractor,
  FaWheatAwn,
  FaScaleBalanced,
  FaIndianRupeeSign,
  FaBuildingColumns,
  FaUserTie,
  FaUsers,
  FaShieldHalved,
  FaTruckFast,
  FaFileInvoice,
  FaFileContract,
  FaRegCircleCheck,
  FaArrowsRotate,
  FaHourglassHalf,
  FaQrcode,
  FaBell,
  FaCircleExclamation,
  FaMobileScreenButton,
  FaDesktop,
  FaRightFromBracket,
  FaSeedling,
  FaCoins
} from 'react-icons/fa6';

// Material Icons
import {
  MdOutlineDashboard,
  MdFactCheck,
  MdNotificationsActive,
  MdOutlineAdminPanelSettings,
  MdOutlineVerified,
  MdOutlineReceiptLong,
  MdOutlineLocalShipping,
  MdOutlineSpeed,
  MdOutlineAgriculture,
  MdSensors,
  MdOutlineQrCodeScanner
} from 'react-icons/md';

// Game / Agriculture Rich Icons
import {
  GiWheat,
  GiCorn,
  GiPlantSeed,
  GiWeightScale,
  GiReceiveMoney,
  GiFarmer
} from 'react-icons/gi';

// HeroIcons 2
import {
  HiLanguage,
  HiOutlineSparkles,
  HiOutlineSpeakerWave
} from 'react-icons/hi2';

// Tabler / BoxIcons
import { TbTruckDelivery, TbBuildingWarehouse, TbClockPlay } from 'react-icons/tb';

// Reusable standard Icon props interface
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  color?: string;
}

// Map Lucide-equivalent and React-Icon components with full styling pass-through
export const Calendar: React.FC<IconProps> = (props) => <FiCalendar {...props} />;
export const Clock: React.FC<IconProps> = (props) => <FiClock {...props} />;
export const MapPin: React.FC<IconProps> = (props) => <FiMapPin {...props} />;
export const CheckCircle: React.FC<IconProps> = (props) => <FiCheckCircle {...props} />;
export const CheckCircle2: React.FC<IconProps> = (props) => <FaRegCircleCheck {...props} />;
export const AlertTriangle: React.FC<IconProps> = (props) => <FiAlertTriangle {...props} />;
export const AlertCircle: React.FC<IconProps> = (props) => <FaCircleExclamation {...props} />;
export const TrendingUp: React.FC<IconProps> = (props) => <FiTrendingUp {...props} />;
export const ArrowRight: React.FC<IconProps> = (props) => <FiArrowRight {...props} />;
export const ArrowLeft: React.FC<IconProps> = (props) => <FiArrowLeft {...props} />;
export const Download: React.FC<IconProps> = (props) => <FiDownload {...props} />;
export const Printer: React.FC<IconProps> = (props) => <FiPrinter {...props} />;
export const Search: React.FC<IconProps> = (props) => <FiSearch {...props} />;
export const Sliders: React.FC<IconProps> = (props) => <FiSliders {...props} />;
export const RefreshCw: React.FC<IconProps> = (props) => <FiRefreshCw {...props} />;
export const RotateCcw: React.FC<IconProps> = (props) => <FaArrowsRotate {...props} />;
export const ShieldCheck: React.FC<IconProps> = (props) => <FaShieldHalved {...props} />;
export const Shield: React.FC<IconProps> = (props) => <FiShield {...props} />;
export const Lock: React.FC<IconProps> = (props) => <FiLock {...props} />;
export const Unlock: React.FC<IconProps> = (props) => <FiUnlock {...props} />;
export const Phone: React.FC<IconProps> = (props) => <FiPhone {...props} />;
export const Mail: React.FC<IconProps> = (props) => <FiMail {...props} />;
export const Info: React.FC<IconProps> = (props) => <FiInfo {...props} />;
export const Eye: React.FC<IconProps> = (props) => <FiEye {...props} />;
export const EyeOff: React.FC<IconProps> = (props) => <FiEyeOff {...props} />;
export const Globe: React.FC<IconProps> = (props) => <FiGlobe {...props} />;
export const Compass: React.FC<IconProps> = (props) => <FiCompass {...props} />;
export const Cpu: React.FC<IconProps> = (props) => <FiCpu {...props} />;
export const Activity: React.FC<IconProps> = (props) => <FiActivity {...props} />;
export const Database: React.FC<IconProps> = (props) => <FiDatabase {...props} />;
export const Volume2: React.FC<IconProps> = (props) => <FiVolume2 {...props} />;
export const VolumeX: React.FC<IconProps> = (props) => <FiVolumeX {...props} />;
export const ChevronRight: React.FC<IconProps> = (props) => <FiChevronRight {...props} />;
export const ChevronDown: React.FC<IconProps> = (props) => <FiChevronDown {...props} />;
export const ChevronUp: React.FC<IconProps> = (props) => <FiChevronUp {...props} />;
export const ChevronLeft: React.FC<IconProps> = (props) => <FiChevronLeft {...props} />;
export const X: React.FC<IconProps> = (props) => <FiX {...props} />;
export const Check: React.FC<IconProps> = (props) => <FiCheck {...props} />;
export const Share2: React.FC<IconProps> = (props) => <FiShare2 {...props} />;
export const Copy: React.FC<IconProps> = (props) => <FiCopy {...props} />;
export const Camera: React.FC<IconProps> = (props) => <FiCamera {...props} />;
export const XCircle: React.FC<IconProps> = (props) => <FiX {...props} />;
export const CloudRain: React.FC<IconProps> = (props) => <FiCloudRain {...props} />;
export const KeyRound: React.FC<IconProps> = (props) => <FiKey {...props} />;
export const Wifi: React.FC<IconProps> = (props) => <FiWifi {...props} />;
export const Battery: React.FC<IconProps> = (props) => <FiBattery {...props} />;
export const Signal: React.FC<IconProps> = (props) => <FiActivity {...props} />;
export const TrendingDown: React.FC<IconProps> = (props) => <FiTrendingDown {...props} />;
export const Layers: React.FC<IconProps> = (props) => <FiLayers {...props} />;
export const ArrowDownRight: React.FC<IconProps> = (props) => <FiArrowDownRight {...props} />;
export const MessageSquare: React.FC<IconProps> = (props) => <FiMessageSquare {...props} />;

// Agricultural & Mandi Domain Icons (powered by React Icons)
export const Tractor: React.FC<IconProps> = (props) => <FaTractor {...props} />;
export const Wheat: React.FC<IconProps> = (props) => <GiWheat {...props} />;
export const Corn: React.FC<IconProps> = (props) => <GiCorn {...props} />;
export const Seedling: React.FC<IconProps> = (props) => <FaSeedling {...props} />;
export const FarmerIcon: React.FC<IconProps> = (props) => <GiFarmer {...props} />;
export const Scale: React.FC<IconProps> = (props) => <FaScaleBalanced {...props} />;
export const WeighScale: React.FC<IconProps> = (props) => <GiWeightScale {...props} />;
export const Truck: React.FC<IconProps> = (props) => <FaTruckFast {...props} />;
export const Warehouse: React.FC<IconProps> = (props) => <TbBuildingWarehouse {...props} />;
export const IndianRupee: React.FC<IconProps> = (props) => <FaIndianRupeeSign {...props} />;
export const CreditCard: React.FC<IconProps> = (props) => <GiReceiveMoney {...props} />;
export const Building2: React.FC<IconProps> = (props) => <FaBuildingColumns {...props} />;
export const User: React.FC<IconProps> = (props) => <FaUserTie {...props} />;
export const Users: React.FC<IconProps> = (props) => <FaUsers {...props} />;
export const UserCheck: React.FC<IconProps> = (props) => <FiUserCheck {...props} />;
export const QrCode: React.FC<IconProps> = (props) => <FaQrcode {...props} />;
export const QrScanner: React.FC<IconProps> = (props) => <MdOutlineQrCodeScanner {...props} />;
export const Bell: React.FC<IconProps> = (props) => <FaBell {...props} />;
export const Smartphone: React.FC<IconProps> = (props) => <FaMobileScreenButton {...props} />;
export const Monitor: React.FC<IconProps> = (props) => <FaDesktop {...props} />;
export const LogOut: React.FC<IconProps> = (props) => <FaRightFromBracket {...props} />;
export const Sparkles: React.FC<IconProps> = (props) => <HiOutlineSparkles {...props} />;
export const SpeakerWave: React.FC<IconProps> = (props) => <HiOutlineSpeakerWave {...props} />;
export const Language: React.FC<IconProps> = (props) => <HiLanguage {...props} />;
export const BarChart3: React.FC<IconProps> = (props) => <MdOutlineDashboard {...props} />;
export const FileSpreadsheet: React.FC<IconProps> = (props) => <MdOutlineReceiptLong {...props} />;
export const FileText: React.FC<IconProps> = (props) => <FaFileInvoice {...props} />;
export const Radio: React.FC<IconProps> = (props) => <MdSensors {...props} />;
export const Speedometer: React.FC<IconProps> = (props) => <MdOutlineSpeed {...props} />;
export const Hourglass: React.FC<IconProps> = (props) => <FaHourglassHalf {...props} />;
export const Home: React.FC<IconProps> = (props) => <MdOutlineAgriculture {...props} />;
export const Filter: React.FC<IconProps> = (props) => <FiSliders {...props} />;
export const Send: React.FC<IconProps> = (props) => <FiSend {...props} />;
export const Calculator: React.FC<IconProps> = (props) => <FaCoins {...props} />;

// Direct exports of icon libraries for custom usage
export {
  FiCalendar, FiClock, FiMapPin, FiCheckCircle, FiAlertTriangle, FiTrendingUp,
  FaTractor, FaWheatAwn, FaScaleBalanced, FaIndianRupeeSign, FaBuildingColumns,
  FaUserTie, FaUsers, FaShieldHalved, FaTruckFast, FaQrcode, FaBell,
  MdOutlineDashboard, MdFactCheck, MdNotificationsActive, MdOutlineAdminPanelSettings,
  GiWheat, GiCorn, GiPlantSeed, GiWeightScale, GiReceiveMoney, GiFarmer,
  HiLanguage, HiOutlineSparkles, HiOutlineSpeakerWave, TbTruckDelivery, TbBuildingWarehouse
};
