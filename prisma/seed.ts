import { PrismaClient, CollegeType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const colleges = [
  {
    name: "Indian Institute of Technology Bombay",
    slug: "iit-bombay",
    location: "Powai, Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    type: CollegeType.GOVERNMENT,
    establishedIn: 1958,
    rating: 4.8,
    reviewCount: 2340,
    totalFees: 250000,
    ranking: 1,
    nirf: 3,
    description:
      "IIT Bombay is one of India's premier engineering institutions, consistently ranked among the top engineering colleges. Known for its cutting-edge research, world-class faculty, and exceptional placement record.",
    accreditation: "A++",
    affiliation: "Autonomous",
    avgPackage: 22.5,
    highestPackage: 2.4,
    placementRate: 96,
    topRecruiters: ["Google", "Microsoft", "Goldman Sachs", "McKinsey", "Amazon"],
    examsAccepted: ["JEE Advanced"],
    website: "https://www.iitb.ac.in",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 250000, seats: 120 },
      { name: "B.Tech Electrical Engineering", duration: 4, fees: 250000, seats: 90 },
      { name: "M.Tech AI & Data Science", duration: 2, fees: 150000, seats: 60 },
      { name: "MBA", duration: 2, fees: 400000, seats: 80 },
    ],
  },
  {
    name: "Indian Institute of Technology Delhi",
    slug: "iit-delhi",
    location: "Hauz Khas, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    type: CollegeType.GOVERNMENT,
    establishedIn: 1961,
    rating: 4.7,
    reviewCount: 1980,
    totalFees: 245000,
    ranking: 2,
    nirf: 2,
    description:
      "IIT Delhi is a leading technical institution located in the heart of India's capital. It offers a vibrant academic environment with strong industry connections and alumni network.",
    accreditation: "A++",
    affiliation: "Autonomous",
    avgPackage: 20.8,
    highestPackage: 2.1,
    placementRate: 95,
    topRecruiters: ["Apple", "Adobe", "Flipkart", "BCG", "Deloitte"],
    examsAccepted: ["JEE Advanced"],
    website: "https://home.iitd.ac.in",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 245000, seats: 110 },
      { name: "B.Tech Mechanical Engineering", duration: 4, fees: 245000, seats: 85 },
      { name: "M.Tech VLSI", duration: 2, fees: 140000, seats: 45 },
    ],
  },
  {
    name: "BITS Pilani",
    slug: "bits-pilani",
    location: "Vidya Vihar, Pilani, Rajasthan",
    city: "Pilani",
    state: "Rajasthan",
    type: CollegeType.DEEMED,
    establishedIn: 1964,
    rating: 4.6,
    reviewCount: 3120,
    totalFees: 520000,
    ranking: 3,
    nirf: 16,
    description:
      "BITS Pilani is a premier engineering institution known for its unique dual-degree programs and Practice School. It produces some of India's finest engineers and entrepreneurs.",
    accreditation: "A",
    affiliation: "Deemed University",
    avgPackage: 17.5,
    highestPackage: 1.8,
    placementRate: 88,
    topRecruiters: ["Qualcomm", "Samsung", "Oracle", "Salesforce", "Walmart Labs"],
    examsAccepted: ["BITSAT"],
    website: "https://www.bits-pilani.ac.in",
    courses: [
      { name: "B.E. Computer Science", duration: 4, fees: 520000, seats: 180 },
      { name: "B.E. Electronics", duration: 4, fees: 520000, seats: 150 },
      { name: "M.Sc. Mathematics", duration: 5, fees: 520000, seats: 60 },
    ],
  },
  {
    name: "National Institute of Technology Trichy",
    slug: "nit-trichy",
    location: "Tiruchirappalli, Tamil Nadu",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    type: CollegeType.GOVERNMENT,
    establishedIn: 1964,
    rating: 4.4,
    reviewCount: 1560,
    totalFees: 130000,
    ranking: 4,
    nirf: 10,
    description:
      "NIT Trichy is considered the crown jewel among NITs, known for its excellent academic programs and high placement rates. Its lush 800-acre campus is one of the best in India.",
    accreditation: "A+",
    affiliation: "NIT",
    avgPackage: 12.4,
    highestPackage: 1.2,
    placementRate: 92,
    topRecruiters: ["TCS", "Infosys", "Zoho", "Honeywell", "L&T"],
    examsAccepted: ["JEE Main"],
    website: "https://www.nitt.edu",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 130000, seats: 90 },
      { name: "B.Tech Civil Engineering", duration: 4, fees: 130000, seats: 75 },
      { name: "MBA", duration: 2, fees: 200000, seats: 60 },
    ],
  },
  {
    name: "Vellore Institute of Technology",
    slug: "vit-vellore",
    location: "Katpadi Road, Vellore, Tamil Nadu",
    city: "Vellore",
    state: "Tamil Nadu",
    type: CollegeType.DEEMED,
    establishedIn: 1984,
    rating: 4.1,
    reviewCount: 4780,
    totalFees: 195000,
    ranking: 11,
    nirf: 11,
    description:
      "VIT Vellore is one of India's most well-known private universities, famous for VITEEE and its massive campus. Known for strong industry collaborations and international MOUs.",
    accreditation: "A++",
    affiliation: "Deemed University",
    avgPackage: 8.2,
    highestPackage: 0.45,
    placementRate: 82,
    topRecruiters: ["Wipro", "HCL", "Cognizant", "Ford", "Robert Bosch"],
    examsAccepted: ["VITEEE", "JEE Main"],
    website: "https://vit.ac.in",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 195000, seats: 600 },
      { name: "B.Tech Biotech", duration: 4, fees: 195000, seats: 120 },
      { name: "M.Tech Software Engineering", duration: 2, fees: 150000, seats: 90 },
    ],
  },
  {
    name: "Indian Institute of Technology Madras",
    slug: "iit-madras",
    location: "Chennai, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    type: CollegeType.GOVERNMENT,
    establishedIn: 1959,
    rating: 4.9,
    reviewCount: 2100,
    totalFees: 242000,
    ranking: 1,
    nirf: 1,
    description:
      "IIT Madras is India's top-ranked engineering institution. Known for its research output, startup ecosystem, and scenic forested campus within Chennai city.",
    accreditation: "A++",
    affiliation: "Autonomous",
    avgPackage: 23.1,
    highestPackage: 2.8,
    placementRate: 97,
    topRecruiters: ["Google", "Meta", "Uber", "ISRO", "DRDO"],
    examsAccepted: ["JEE Advanced"],
    website: "https://www.iitm.ac.in",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 242000, seats: 100 },
      { name: "B.Tech Aerospace", duration: 4, fees: 242000, seats: 40 },
      { name: "M.Tech AI", duration: 2, fees: 140000, seats: 50 },
    ],
  },
  {
    name: "Manipal Institute of Technology",
    slug: "manipal-institute-of-technology",
    location: "Manipal, Udupi, Karnataka",
    city: "Udupi",
    state: "Karnataka",
    type: CollegeType.PRIVATE,
    establishedIn: 1957,
    rating: 4.0,
    reviewCount: 3890,
    totalFees: 410000,
    ranking: 20,
    nirf: 43,
    description:
      "Manipal Institute of Technology is a prestigious private engineering college under Manipal Academy of Higher Education. Known for great campus life and strong alumni connections globally.",
    accreditation: "A++",
    affiliation: "MAHE",
    avgPackage: 9.4,
    highestPackage: 0.72,
    placementRate: 78,
    topRecruiters: ["Infosys", "Accenture", "Capgemini", "IBM", "Cisco"],
    examsAccepted: ["MET", "JEE Main"],
    website: "https://manipal.edu/mit.html",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 410000, seats: 300 },
      { name: "B.Tech Mechatronics", duration: 4, fees: 410000, seats: 60 },
    ],
  },
  {
    name: "Delhi Technological University",
    slug: "delhi-technological-university",
    location: "Shahbad Daulatpur, Rohini, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    type: CollegeType.GOVERNMENT,
    establishedIn: 1941,
    rating: 4.2,
    reviewCount: 2200,
    totalFees: 175000,
    ranking: 15,
    nirf: 36,
    description:
      "DTU (formerly DCE) is one of India's oldest and most reputed engineering institutions. Located in Delhi, it offers exceptional placements and access to India's startup capital.",
    accreditation: "A",
    affiliation: "Delhi Government",
    avgPackage: 13.2,
    highestPackage: 1.5,
    placementRate: 90,
    topRecruiters: ["Microsoft", "Amazon", "Paytm", "Zomato", "Ola"],
    examsAccepted: ["JEE Main"],
    website: "https://dtu.ac.in",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 175000, seats: 200 },
      { name: "B.Tech Software Engineering", duration: 4, fees: 175000, seats: 120 },
      { name: "MBA", duration: 2, fees: 250000, seats: 60 },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const hashedPw = await bcrypt.hash("demo1234", 10);
  await prisma.user.create({
    data: {
      email: "demo@campusiq.in",
      name: "Rahul Verma",
      password: hashedPw,
    },
  });

  // Seed colleges
  for (const college of colleges) {
    const { courses, ...collegeData } = college;
    await prisma.college.create({
      data: {
        ...collegeData,
        courses: {
          create: courses,
        },
      },
    });
  }

  console.log(`✅ Seeded ${colleges.length} colleges`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
