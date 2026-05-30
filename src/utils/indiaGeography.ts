/**
 * Comprehensive India Geography Mapping
 * Contains all 28 States and 8 Union Territories and their key districts,
 * with authentic default rural village names for high-fidelity seeding.
 */

import { VillageCommunity } from '../types';

export interface IndiaStateData {
  districts: string[];
  defaultVillages: string[];
}

export const INDIA_GEOGRAPHY_MAP: Record<string, IndiaStateData> = {
  "Andhra Pradesh": {
    districts: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Chittoor", "Kadapa", "Anantapur", "Srikakulam", "East Godavari"],
    defaultVillages: ["Kovvur Panchayat", "Gollaprolu", "Mandapeta Gram", "Vemuluru", "Chinnampet", "Rajupalem", "Penugonda"]
  },
  "Arunachal Pradesh": {
    districts: ["Itanagar", "Tawang", "Changlang", "Tirap", "Papum Pare", "West Kameng", "East Siang", "Lower Subansiri"],
    defaultVillages: ["Namsing", "Dirang basti", "Shergaon Community", "Yachuli Block", "Ziro Valley Panchayat", "Mukto"]
  },
  "Assam": {
    districts: ["Kamrup Rural", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tezpur", "Tinsukia", "Barpeta", "Cachar", "Sivasagar"],
    defaultVillages: ["Sualkuchi Craft Village", "Hajo Gram", "Numaligarh Block", "Majuli Riverside", "Dispur Basti", "Khetri"]
  },
  "Bihar": {
    districts: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah", "Begusarai", "Madhubani", "Nalanda", "Saran", "Rohtas"],
    defaultVillages: ["Madhubani Ward 10", "Digha Panchayat", "Rajgir Dehat", "Bodhgaya Rural", "Sonpur Block", "Jehanabad Simri", "Kishanpur Dev"]
  },
  "Chhattisgarh": {
    districts: ["Raipur", "Bilaspur", "Durg", "Bhilai Zone", "Korba", "Rajnandgaon", "Jagdalpur", "Ambikapur", "Dhamtari", "Kanker"],
    defaultVillages: ["Arang Rural", "Abhanpur Basti", "Kondagaon Tribal Gram", "Kawardha Block", "Sirpur", "Kurud Panchayat"]
  },
  "Goa": {
    districts: ["North Goa", "South Goa"],
    defaultVillages: ["Aldona", "Chorao Panchayat", "Assagao Dev", "Curtorim Village", "Cavelossim Shore", "Loutolim"]
  },
  "Gujarat": {
    districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar Rural", "Anand", "Kutch", "Mehsana"],
    defaultVillages: ["Dholera Smart village", "Dharmaj", "Punsari Model Village", "Madhavpur", "Hodka Desert Block", "Bardoli Rural", "Anjar Basti"]
  },
  "Haryana": {
    districts: ["Gurugram Rural", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Karnal", "Sonipat", "Kurukshetra", "Sirsa"],
    defaultVillages: ["Chautala Gram", "Manesar Panchayat", "Sohna Block", "Pataudi Dehat", "Assandh", "Gharaunda", "Samalkha Rural"]
  },
  "Himachal Pradesh": {
    districts: ["Shimla", "Dharamshala Zone", "Solan", "Mandi", "Bilaspur HP", "Kullu", "Chamba", "Hamirpur", "Kangra", "Una", "Kinnaur"],
    defaultVillages: ["Pragpur Heritage Village", "Masrur Rock", "Barog Block", "Naggar Gram", "Kasol Community", "Jibhi Valley Dev", "Keylong"]
  },
  "Jharkhand": {
    districts: ["Ranchi", "Jamshedpur Zone", "Dhanbad Rural", "Bokaro", "Deoghar", "Hazaribagh", "Giridih", "Dumka", "Palamu", "Singhbhum"],
    defaultVillages: ["McCluskieganj Panchayat", "Netarhat Block", "Patratu Village", "Ormanjhi Rural", "Ghatshila", "Rikhia Ashram Gram"]
  },
  "Karnataka": {
    districts: ["Bengaluru Rural", "Mysuru", "Hubli-Dharwad Rural", "Mangaluru Zone", "Belagavi", "Kalaburagi", "Davanagere", "Ballari", "Udupi", "Tumakuru"],
    defaultVillages: ["Halli Mysuru", "Mundur Gram", "Ramanagara Silk Block", "Kokrebellur Heritage", "Halebidu", "Channapatna Craft Area"]
  },
  "Kerala": {
    districts: ["Thiruvananthapuram Rural", "Ernakulam Rural", "Kozhikode", "Thrissur", "Kollam", "Alappuzha Waterworld", "Palakkad", "Kannur", "Wayanad", "Kottayam"],
    defaultVillages: ["Kumarakom Backwater Village", "Mararikulam Shore", "Munnar Tea Panchayat", "Kanthalloor Model", "Vythiri Tribal Gram", "Kalpetta"]
  },
  "Madhya Pradesh": {
    districts: ["Indore Rural", "Bhopal Rural", "Jabalpur", "Gwalior Rural", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam", "Rewa", "Chhindwara", "Khajuraho Zone"],
    defaultVillages: ["Chanderi Weavers Village", "Orchha Heritage", "Bhedaghat Block", "Pachmarhi Tribal Dev", "Budhni Rural", "Mandla Gram"]
  },
  "Maharashtra": {
    districts: ["Pune Rural", "Nagpur", "Thane Rural", "Nashik", "Aurangabad (Chhatrapati Sambhaji Nagar)", "Solapur", "Amravati", "Kolhapur", "Satara", "Raigad", "Ratnagiri"],
    defaultVillages: ["Ralegan Siddhi Eco-Village", "Hiware Bazar Model Gram", "Uruli Kanchan", "Koregaon Mul Bhg", "Velneshwar Shore", "Mahad Block"]
  },
  "Manipur": {
    districts: ["Imphal West", "Thoubal", "Bishnupur", "Churachandpur", "Ukhrul", "Senapati", "Chandel"],
    defaultVillages: ["Moirang Loktak Gram", "Andro Craft Village", "Phayeng Eco-Gram", "Chandel Basti", "Siroi Lily Village"]
  },
  "Meghalaya": {
    districts: ["East Khasi Hills", "West Garo Hills", "Jaintia Hills", "Ri-Bhoi", "South West Khasi Hills"],
    defaultVillages: ["Mawlynnong Cleanest Village", "Nongriat Root Bridge Gram", "Cherrapunji Sohra", "Jakrem Hot Springs", "Smit Cultural Block"]
  },
  "Mizoram": {
    districts: ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip"],
    defaultVillages: ["Reiek Cultural Mountain", "Hmuifang Dehat", "Falkawn Village", "Thenzawl Handloom Panchayat", "Vanzau"]
  },
  "Nagaland": {
    districts: ["Kohima Rural", "Dimapur Rural", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Phek", "Mon"],
    defaultVillages: ["Khonoma Green Village", "Kisama Heritage Gram", "Ungma Ancestral", "Longwa Border", "Pfutsero Highland"]
  },
  "Odisha": {
    districts: ["Khurda (Bhubaneswar)", "Cuttack Rural", "Rourkela Zone", "Ganjam", "Sambalpur", "Puri Rural", "Balasore", "Bhadrak", "Koraput", "Mayurbhanj"],
    defaultVillages: ["Pipli Applique Village", "Raghurajpur Heritage Crafts", "Konark Konark Block", "Chilika Fishing Gram", "Baripada", "Hirakud Area"]
  },
  "Punjab": {
    districts: ["Amritsar Rural", "Ludhiana Rural", "Jalandhar Rural", "Patiala Rural", "Bathinda", "Mohali SAS Nagar", "Hoshiarpur", "Pathankot", "Moga", "Firozpur"],
    defaultVillages: ["Sansarpur Hockey Cradle", "Kila Raipur Sports Gram", "Harike Wetland Village", "Hoshiarpur Orchid Block", "Mehta Panchayat"]
  },
  "Rajasthan": {
    districts: ["Jaipur Rural", "Jodhpur Rural", "Udaipur Rural", "Kota Zone", "Ajmer", "Bikaner", "Alwar", "Bhilwara", "Sikar", "Jaisalmer Frontier", "Barmer"],
    defaultVillages: ["Chokhi Dhani Block", "Narlai Heritage", "Khejarli Eco-Gram", "Sam Sand Dunes", "Abhaneri Stepwell Panchayat", "Mandawa Fort Zone"]
  },
  "Sikkim": {
    districts: ["Gangtok Zone", "Namchi", "Geyzing", "Mangan", "Pakyong", "Soreng"],
    defaultVillages: ["Lachen Highland Village", "Lachung Orchard Gram", "Temi Tea Garden Block", "Ravangla Valley", "Yuksom Birthplace"]
  },
  "Tamil Nadu": {
    districts: ["Coimbatore Rural", "Madurai Rural", "Tiruchirappalli Rural", "Salem", "Tirunelveli", "Vellore Rural", "Erode", "Thanjavur Rural", "Kanyakumari", "Ooty Zone"],
    defaultVillages: ["Nilgiri Sholur Gram", "Chettinad Karaikudi Area", "Tharamangalam Complex", "Poompuhar Port Area", "Kallidaikurichi Agraharam"]
  },
  "Telangana": {
    districts: ["Hyderabad Outer", "Warangal Rural", "Nizamabad", "Karimnagar", "Khammam", "Mahbubnagar", "Nalgonda", "Rangareddy Rural", "Adilabad", "Medak"],
    defaultVillages: ["Pochampally Ikat Village", "Pemberthi Metal Craft", "Ananthagiri Forest Gram", "Mulugu", "Ramappa Heritage", "Kondapalli Block"]
  },
  "Tripura": {
    districts: ["West Tripura", "South Tripura", "North Tripura", "Dhalai", "Unakoti", "Gomati"],
    defaultVillages: ["Unakoti Bas-relief Gram", "Neermahal Lakeshore", "Kamalasagar", "Jampui Hills Orange Orchard", "Ambassa Basti"]
  },
  "Uttar Pradesh": {
    districts: ["Bareilly", "Lucknow Dehat", "Kanpur Dehat", "Ghaziabad Outer", "Agra Rural", "Meerut Zone", "Varanasi Outer", "Prayagraj Rural", "Aligarh Rural", "Gorakhpur", "Moradabad Rural", "Jhansi Block"],
    defaultVillages: ["Baheri Block North", "Faridpur Devra", "Kalyanpur Rural", "Kakori Mango Grove", "Sarnath Sanchi Gram", "Naimisharanya Forest Area", "Bithoor Ganges Block"]
  },
  "Uttarakhand": {
    districts: ["Dehradun Hills", "Haridwar Rural", "Nainital Lakeshore", "Udham Singh Nagar", "Pithoragarh", "Almora", "Pauri Garhwal", "Tehri Garhwal", "Chamoli Village"],
    defaultVillages: ["Mana First Indian Village", "Malari Indo-Tibet, Border", "Lansdowne Cantonment Village", "Mukteshwar Apple Orchard", "Kausani Himalayan Range"]
  },
  "West Bengal": {
    districts: ["North 24 Parganas", "South 24 Parganas", "Darjeeling Hills", "Murshidabad Rural", "Purulia Tribal Block", "Howrah Outer", "Nadia", "Bankura Clay Gram", "Birbhum (Shantiniketan)"],
    defaultVillages: ["Gopalnagar", "Sundarbans Sajnekhali Delta", "Chowrasta Hill Block", "Bishnupur Terracotta Gram", "Tarapith Temple Compound", "Shantiniketan Rural"]
  },
  
  // Union Territories
  "Andaman and Nicobar Islands": {
    districts: ["South Andaman (Port Blair)", "North and Middle Andaman", "Nicobar Islands"],
    defaultVillages: ["Chidiyatapu", "Havelock Island Shore", "Baratang Cave Settlement", "Radhanagar Swaraj Dweep"]
  },
  "Chandigarh": {
    districts: ["Chandigarh District"],
    defaultVillages: ["Khuda Alisher Village", "Kaimbwala Panchayat", "Sarangpur Chandigarh Block"]
  },
  "Dadra and Nagar Haveli and Daman and Diu": {
    districts: ["Dadra and Nagar Haveli", "Daman District", "Diu District"],
    defaultVillages: ["Silvassa Khanvel Forest", "Marwad Shore Daman", "Buchharwada Island Village"]
  },
  "Delhi": {
    districts: ["North Delhi Rural", "South West Delhi Rural", "North West Delhi Rural", "West Delhi", "East Delhi"],
    defaultVillages: ["Narela Grain Mandi Gram", "Najafgarh Outer Block", "Alipur Greenfield", "Madanpur Khadar", "Chhawla Dairy"]
  },
  "Jammu and Kashmir": {
    districts: ["Srinagar Lake district", "Jammu Rural", "Anantnag", "Baramulla Border", "Kathua", "Udhampur", "Pulwama", "Kupwara", "Poonch"],
    defaultVillages: ["Aru Valley Meadows", "Pahalgam Pine Valley", "Drass Coldest Habitation", "Gulmarg Marg Village", "Akhnoor Riverbank"]
  },
  "Ladakh": {
    districts: ["Leh Ladakh", "Kargil District"],
    defaultVillages: ["Dah Hanu Aryan Village", "Diskit Nubra Sand Dunes", "Alchi Monastery Gram", "Hemis Settlement", "Mulbekh Rock"]
  },
  "Lakshadweep": {
    districts: ["Lakshadweep District"],
    defaultVillages: ["Minicoy Atoll Coral Village", "Agatti Island Cove", "Kavaratti Coastline", "Amini Lagoon"]
  },
  "Puducherry": {
    districts: ["Puducherry Town", "Karaikal Zone", "Mahe Enclave", "Yanam Enclave"],
    defaultVillages: ["Auroville International Township", "Ariyankuppam Fishery", "Thirunallar Temple Village", "Mahe Estuary"]
  }
};

export const ALL_INDIAN_STATES = Object.keys(INDIA_GEOGRAPHY_MAP);

export function getDistricts(state: string): string[] {
  return INDIA_GEOGRAPHY_MAP[state]?.districts || [];
}

export function getDefaultVillages(state: string, district: string): VillageCommunity[] {
  // Returns highly specialized name format based on selected location
  const defaults = INDIA_GEOGRAPHY_MAP[state]?.defaultVillages || ["Rampur Central", "Kalyanpur Gram", "Mohanpur Basti"];
  return defaults.map((name, i) => ({
    id: `${state.substring(0,2).toLowerCase()}_${district.substring(0,3).toLowerCase()}_v${i+1}`,
    name: name,
    state: state,
    district: district,
    region: `${district} Local Dev Block`,
    population: Math.floor(Math.random() * 2000) + 1200
  }));
}
