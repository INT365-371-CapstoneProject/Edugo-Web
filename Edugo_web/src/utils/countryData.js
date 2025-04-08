// ข้อมูลประเทศ - เพิ่มเติมเพื่อให้ครอบคลุมทั่วโลกมากขึ้น
export const simpleCountries = [
    // เอเชีย
    { name: 'Thailand', code: 'TH' },
    { name: 'China', code: 'CN' },
    { name: 'Japan', code: 'JP' },
    { name: 'South Korea', code: 'KR' },
    { name: 'Singapore', code: 'SG' },
    { name: 'Malaysia', code: 'MY' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'Vietnam', code: 'VN' },
    { name: 'India', code: 'IN' },
    { name: 'Philippines', code: 'PH' },
    { name: 'Turkey', code: 'TR' },
    { name: 'Saudi Arabia', code: 'SA' },
    { name: 'United Arab Emirates', code: 'AE' },
    { name: 'Israel', code: 'IL' },
    { name: 'Kazakhstan', code: 'KZ' },
  
    // อเมริกาเหนือ
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'Mexico', code: 'MX' },
  
    // อเมริกาใต้
    { name: 'Brazil', code: 'BR' },
    { name: 'Argentina', code: 'AR' },
    { name: 'Colombia', code: 'CO' },
    { name: 'Chile', code: 'CL' },
    { name: 'Peru', code: 'PE' },
  
    // ยุโรป
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Germany', code: 'DE' },
    { name: 'France', code: 'FR' },
    { name: 'Italy', code: 'IT' },
    { name: 'Spain', code: 'ES' },
    { name: 'Netherlands', code: 'NL' },
    { name: 'Switzerland', code: 'CH' },
    { name: 'Sweden', code: 'SE' },
    { name: 'Norway', code: 'NO' },
    { name: 'Poland', code: 'PL' },
    { name: 'Russia', code: 'RU' }, // อาจพิจารณาตามสถานการณ์ปัจจุบัน
    { name: 'Greece', code: 'GR' },
    { name: 'Ireland', code: 'IE' },
    { name: 'Austria', code: 'AT' },
    { name: 'Belgium', code: 'BE' },
  
    // แอฟริกา
    { name: 'South Africa', code: 'ZA' },
    { name: 'Nigeria', code: 'NG' },
    { name: 'Egypt', code: 'EG' },
    { name: 'Kenya', code: 'KE' },
    { name: 'Morocco', code: 'MA' },
    { name: 'Ghana', code: 'GH' },
  
    // โอเชียเนีย
    { name: 'Australia', code: 'AU' },
    { name: 'New Zealand', code: 'NZ' },
  ];
  
  // ข้อมูลเมืองตามรหัสประเทศ - เพิ่มเติมให้สอดคล้องกับประเทศที่เพิ่ม
  const citiesByCountry = {
    // เอเชีย
    'TH': ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Hua Hin', 'Khon Kaen', 'Hat Yai', 'Nakhon Ratchasima', 'Udon Thani'],
    'CN': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Hong Kong', 'Chengdu', 'Tianjin', 'Chongqing', 'Hangzhou', 'Xi\'an'],
    'JP': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo', 'Nagoya', 'Fukuoka', 'Kobe', 'Hiroshima'],
    'KR': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan'],
    'SG': ['Singapore'],
    'MY': ['Kuala Lumpur', 'Johor Bahru', 'Penang (George Town)', 'Malacca City', 'Ipoh', 'Kuching', 'Kota Kinabalu', 'Shah Alam'],
    'ID': ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang', 'Yogyakarta', 'Denpasar'],
    'VN': ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Haiphong', 'Can Tho', 'Bien Hoa', 'Hue', 'Nha Trang'],
    'IN': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur'],
    'PH': ['Manila', 'Quezon City', 'Davao City', 'Cebu City', 'Caloocan', 'Zamboanga City'],
    'TR': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana'],
    'SA': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam'],
    'AE': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain'],
    'IL': ['Jerusalem', 'Tel Aviv', 'Haifa', 'Rishon LeZion'],
    'KZ': ['Almaty', 'Astana', 'Shymkent', 'Karaganda'],
  
    // อเมริกาเหนือ
    'US': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'San Francisco', 'Seattle', 'Denver', 'Washington D.C.', 'Boston', 'Miami'],
    'CA': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Quebec City', 'Winnipeg', 'Hamilton'],
    'MX': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Ciudad Juárez'],
  
    // อเมริกาใต้
    'BR': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba'],
    'AR': ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Tucumán'],
    'CO': ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta'],
    'CL': ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta'],
    'PE': ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Cusco'],
  
    // ยุโรป
    'GB': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Edinburgh', 'Bristol', 'Leeds', 'Sheffield'],
    'DE': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
    'FR': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux'],
    'IT': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence'],
    'ES': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma de Mallorca'],
    'NL': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg'],
    'CH': ['Zurich', 'Geneva', 'Basel', 'Lausanne', 'Bern'],
    'SE': ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås'],
    'NO': ['Oslo', 'Bergen', 'Stavanger', 'Trondheim', 'Drammen'],
    'PL': ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk'],
    'RU': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan', 'Nizhny Novgorod', 'Chelyabinsk'],
    'GR': ['Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa'],
    'IE': ['Dublin', 'Cork', 'Limerick', 'Galway'],
    'AT': ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck'],
    'BE': ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège'],
  
    // แอฟริกา
    'ZA': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein'],
    'NG': ['Lagos', 'Kano', 'Ibadan', 'Abuja', 'Port Harcourt', 'Benin City'],
    'EG': ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez'],
    'KE': ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
    'MA': ['Casablanca', 'Rabat', 'Fes', 'Marrakesh', 'Agadir', 'Tangier'],
    'GH': ['Accra', 'Kumasi', 'Tamale', 'Takoradi'],
  
    // โอเชียเนีย
    'AU': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle', 'Wollongong'],
    'NZ': ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Dunedin'],
  };
  
  // ฟังก์ชันสำหรับดึงข้อมูลเมืองตามรหัสประเทศ (ไม่เปลี่ยนแปลง)
  export const getCitiesForCountry = (countryCode) => {
    return citiesByCountry[countryCode] || [];
  };
  
  // ฟังก์ชันค้นหาประเทศจากชื่อ (case insensitive) (ไม่เปลี่ยนแปลง)
  export const findCountryByName = (name) => {
    if (!name) return null;
    // อาจพิจารณาเพิ่ม .trim() เพื่อตัดช่องว่างหน้า-หลังชื่อออก
    const searchName = name.trim().toLowerCase();
    return simpleCountries.find(country =>
      country.name.toLowerCase() === searchName
    );
  };
  
  // ฟังก์ชันค้นหาประเทศจากรหัส (ไม่เปลี่ยนแปลง)
  export const findCountryByCode = (code) => {
    if (!code) return null;
    // อาจพิจารณาเพิ่ม .toUpperCase() เพื่อให้รองรับรหัสตัวพิมพ์เล็ก
    const searchCode = code.toUpperCase();
    return simpleCountries.find(country => country.code === searchCode);
  };