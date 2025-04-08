// ข้อมูลประเทศที่มีการใช้งานบ่อย
export const simpleCountries = [
  { name: 'Thailand', code: 'TH' },
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'China', code: 'CN' },
  { name: 'Japan', code: 'JP' },
  { name: 'South Korea', code: 'KR' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'Australia', code: 'AU' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'Canada', code: 'CA' },
  { name: 'India', code: 'IN' },
];

// ข้อมูลเมืองตามรหัสประเทศ
const citiesByCountry = {
  'TH': ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Hua Hin', 'Khon Kaen', 'Hat Yai'],
  'US': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
  'GB': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Edinburgh', 'Bristol'],
  'CN': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Hong Kong', 'Chengdu', 'Tianjin'],
  'JP': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo', 'Nagoya', 'Fukuoka'],
  'KR': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon'],
  'SG': ['Singapore'],
  'MY': ['Kuala Lumpur', 'Johor Bahru', 'Penang', 'Malacca', 'Ipoh', 'Kuching', 'Kota Kinabalu'],
  'ID': ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang'],
  'VN': ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Haiphong', 'Can Tho', 'Bien Hoa', 'Hue'],
  'AU': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra'],
  'DE': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf'],
  'FR': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg'],
  'CA': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Quebec City'],
  'IN': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'],
};

// ฟังก์ชันสำหรับดึงข้อมูลเมืองตามรหัสประเทศ
export const getCitiesForCountry = (countryCode) => {
  return citiesByCountry[countryCode] || [];
};

// ฟังก์ชันค้นหาประเทศจากชื่อ (case insensitive)
export const findCountryByName = (name) => {
  if (!name) return null;
  return simpleCountries.find(country => 
    country.name.toLowerCase() === name.toLowerCase()
  );
};

// ฟังก์ชันค้นหาประเทศจากรหัส
export const findCountryByCode = (code) => {
  if (!code) return null;
  return simpleCountries.find(country => country.code === code);
};
