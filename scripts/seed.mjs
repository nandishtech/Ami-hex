import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting RESQFOOD database seed...");

  // Clear existing records in proper foreign key order
  await prisma.auditLog.deleteMany();
  await prisma.impactRecord.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.pickup.deleteMany();
  await prisma.route.deleteMany();
  await prisma.rescue.deleteMany();
  await prisma.matchScore.deleteMany();
  await prisma.match.deleteMany();
  await prisma.foodItem.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.aIInsight.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.driverProfile.deleteMany();
  await prisma.recipientProfile.deleteMany();
  await prisma.donorProfile.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();
  await prisma.city.deleteMany();

  console.log("🧹 Cleared existing data.");

  // 1. Seed Cities
  const cities = await Promise.all([
    prisma.city.create({
      data: {
        id: "city-blr",
        name: "Bengaluru",
        country: "India",
        latitude: 12.9716,
        longitude: 77.5946,
        status: "ACTIVE",
      },
    }),
    prisma.city.create({
      data: {
        id: "city-mum",
        name: "Mumbai",
        country: "India",
        latitude: 19.076,
        longitude: 72.8777,
        status: "ACTIVE",
      },
    }),
    prisma.city.create({
      data: {
        id: "city-del",
        name: "Delhi NCR",
        country: "India",
        latitude: 28.6139,
        longitude: 77.209,
        status: "ACTIVE",
      },
    }),
    prisma.city.create({
      data: {
        id: "city-hyd",
        name: "Hyderabad",
        country: "India",
        latitude: 17.385,
        longitude: 78.4867,
        status: "ACTIVE",
      },
    }),
  ]);

  // 2. Seed Admin User
  const adminUser = await prisma.user.create({
    data: {
      id: "user-admin-1",
      name: "Super Admin (City Operations)",
      email: "admin@resqfood.org",
      phone: "+91 98800 11001",
      passwordHash: "hash_admin_secret",
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      status: "ACTIVE",
    },
  });

  // 3. Seed Organizations (10 Donors + 8 Recipient Shelters/Kitchens)
  // Donors
  const orgGreenFork = await prisma.organization.create({
    data: {
      id: "org-greenfork",
      name: "GreenFork Restaurant",
      type: "RESTAURANT",
      logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150",
      description: "Artisanal farm-to-table organic kitchen and catering service in Indiranagar.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 4123 4567",
      email: "donations@greenfork.com",
      address: "100 Feet Road, Indiranagar, Bengaluru",
      latitude: 12.9784,
      longitude: 77.6408,
    },
  });

  const orgTajGrand = await prisma.organization.create({
    data: {
      id: "org-taj-grand",
      name: "Grand Palace Hotel & Banquets",
      type: "HOTEL",
      logo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150",
      description: "5-Star Luxury banquet and hospitality conference suites.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 4999 8888",
      email: "sustainability@grandpalace.com",
      address: "MG Road, Bengaluru",
      latitude: 12.9742,
      longitude: 77.6085,
    },
  });

  const orgOrganicEarth = await prisma.organization.create({
    data: {
      id: "org-organic-earth",
      name: "Organic Earth Supermarket",
      type: "GROCERY",
      logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150",
      description: "Daily organic produce, bakery, and premium dairy retail store.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 2555 3322",
      email: "store@organicearth.in",
      address: "Koramangala 4th Block, Bengaluru",
      latitude: 12.9345,
      longitude: 77.6256,
    },
  });

  const orgCatererPro = await prisma.organization.create({
    data: {
      id: "org-caterer-pro",
      name: "Heritage Royal Caterers",
      type: "CATERER",
      description: "Premier event caterer for weddings and corporate galas.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 2233 4455",
      email: "info@heritagecaterers.in",
      address: "HSR Layout Sector 1, Bengaluru",
      latitude: 12.9121,
      longitude: 77.6446,
    },
  });

  const orgSiliconCafeteria = await prisma.organization.create({
    data: {
      id: "org-silicon-cafe",
      name: "Silicon Tech Hub Cafeteria",
      type: "CAFETERIA",
      description: "Multi-cuisine tech campus cafeteria serving 4,000 employees daily.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 6789 0123",
      email: "facility@siliconhub.com",
      address: "Outer Ring Road, Bellandur, Bengaluru",
      latitude: 12.9299,
      longitude: 77.6833,
    },
  });

  const orgArtisanBakery = await prisma.organization.create({
    data: {
      id: "org-artisan-bakery",
      name: "Golden Crust Artisanal Bakery",
      type: "RESTAURANT",
      description: "Fresh daily sourdoughs, croissants, baguettes, and artisanal pastries.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 3456 7890",
      email: "contact@goldencrust.co",
      address: "CMH Road, Indiranagar, Bengaluru",
      latitude: 12.9798,
      longitude: 77.6432,
    },
  });

  const orgMetroSuper = await prisma.organization.create({
    data: {
      id: "org-metro-super",
      name: "Metro Daily Hypermarket",
      type: "GROCERY",
      description: "High-volume FMCG, fruits, vegetables, and packaged dairy hub.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 8765 4321",
      email: "rescues@metrohyper.com",
      address: "Whitefield Main Road, Bengaluru",
      latitude: 12.9698,
      longitude: 77.7499,
    },
  });

  const orgOliveBistro = await prisma.organization.create({
    data: {
      id: "org-olive-bistro",
      name: "Olive & Thyme Bistro",
      type: "RESTAURANT",
      description: "Mediterranean bistro focusing on fresh pasta, grains, and salads.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 2345 6789",
      email: "manager@olivethyme.com",
      address: "Lavelle Road, Bengaluru",
      latitude: 12.9719,
      longitude: 77.5976,
    },
  });

  const orgConventionCenter = await prisma.organization.create({
    data: {
      id: "org-convention-center",
      name: "Bengaluru International Expo Center Banquets",
      type: "EVENT",
      description: "Large-scale summit banqueting and hospitality service.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 5678 1234",
      email: "food@biec-events.org",
      address: "Tumkur Road, Bengaluru",
      latitude: 13.0645,
      longitude: 77.4789,
    },
  });

  const orgSpiceGarden = await prisma.organization.create({
    data: {
      id: "org-spice-garden",
      name: "Spice Garden Family Restaurant",
      type: "RESTAURANT",
      description: "Authentic North & South Indian buffet and banquet.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 9012 3456",
      email: "contact@spicegarden.in",
      address: "Sarjapur Road, Bengaluru",
      latitude: 12.9189,
      longitude: 77.6854,
    },
  });

  // Recipients (Shelters, Food Banks, Community Kitchens)
  const orgHopeShelter = await prisma.organization.create({
    data: {
      id: "org-hope-shelter",
      name: "Hope Community Shelter",
      type: "SHELTER",
      logo: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=150",
      description: "24/7 transition shelter providing daily hot meals and beds for 200 residents.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 2521 8899",
      email: "kitchen@hopeshelter.org",
      address: "Old Airport Road, Kodihalli, Bengaluru",
      latitude: 12.9612,
      longitude: 77.6534,
    },
  });

  const orgStJudeFoodBank = await prisma.organization.create({
    data: {
      id: "org-st-jude",
      name: "St. Jude Mercy Food Bank",
      type: "FOOD_BANK",
      logo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=150",
      description: "Regional distribution hub supplying dry rations and prepared meals to 12 local orphanages.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 2553 1122",
      email: "relief@stjudefoodbank.org",
      address: "Victoria Road, Bengaluru",
      latitude: 12.9678,
      longitude: 77.6189,
    },
  });

  const orgAnandaKitchen = await prisma.organization.create({
    data: {
      id: "org-ananda-kitchen",
      name: "Ananda Community Kitchen",
      type: "COMMUNITY_KITCHEN",
      description: "Free lunch and dinner community dining hall feeding over 600 laborers and elderly daily.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 2665 4433",
      email: "seva@anandakitchen.org",
      address: "Ulsoor Lake Road, Bengaluru",
      latitude: 12.9823,
      longitude: 77.6211,
    },
  });

  const orgSunriseHome = await prisma.organization.create({
    data: {
      id: "org-sunrise-home",
      name: "Sunrise Youth & Children's Home",
      type: "NGO",
      description: "Residential care and education facility for 85 destitute children.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 2845 7766",
      email: "contact@sunrisehome.org",
      address: "Domlur 2nd Stage, Bengaluru",
      latitude: 12.9634,
      longitude: 77.6389,
    },
  });

  const orgSevaKrupa = await prisma.organization.create({
    data: {
      id: "org-seva-krupa",
      name: "Seva Krupa Night Shelter",
      type: "SHELTER",
      description: "Urban municipal night refuge for homeless migrant families.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 2288 3344",
      email: "support@sevakrupa.org",
      address: "Shivajinagar, Bengaluru",
      latitude: 12.9867,
      longitude: 77.6033,
    },
  });

  const orgLighthouseCenter = await prisma.organization.create({
    data: {
      id: "org-lighthouse",
      name: "Lighthouse Care Center",
      type: "COMMUNITY_KITCHEN",
      description: "Community pantry and nutritional rehabilitation clinic.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 4112 9900",
      email: "meals@lighthouseblr.org",
      address: "Ejipura Main Road, Bengaluru",
      latitude: 12.9423,
      longitude: 77.6301,
    },
  });

  const orgAnnapoornaTrust = await prisma.organization.create({
    data: {
      id: "org-annapoorna",
      name: "Annapoorna Welfare Trust",
      type: "NGO",
      description: "Network of 5 soup kitchens serving underprivileged school students.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 2334 5566",
      email: "info@annapoornatrust.org",
      address: "Malleswaram 8th Cross, Bengaluru",
      latitude: 13.0034,
      longitude: 77.5698,
    },
  });

  const orgCityHarvest = await prisma.organization.create({
    data: {
      id: "org-city-harvest",
      name: "City Harvest Relief Mission",
      type: "FOOD_BANK",
      description: "Emergency cold-storage food bank and disaster relief dispatch.",
      verificationStatus: "VERIFIED",
      phone: "+91 80 2991 4455",
      email: "dispatch@cityharvestmission.org",
      address: "Kalyan Nagar, Bengaluru",
      latitude: 13.0234,
      longitude: 77.6489,
    },
  });

  console.log("🏢 Seeded 18 Organizations.");

  // 4. Seed Donor Profile Users
  const donorUser1 = await prisma.user.create({
    data: {
      id: "user-donor-greenfork",
      name: "Chef Vikram Adiga (GreenFork)",
      email: "vikram@greenfork.com",
      phone: "+91 98450 12345",
      passwordHash: "hash_donor_secret",
      role: "DONOR",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150",
      status: "ACTIVE",
      donorProfile: {
        create: {
          organizationId: orgGreenFork.id,
          foodCategories: JSON.stringify(["Prepared Meals", "Bakery", "Produce"]),
          defaultPickupLocation: orgGreenFork.address,
          verificationStatus: "VERIFIED",
        },
      },
    },
  });

  const donorUser2 = await prisma.user.create({
    data: {
      id: "user-donor-grandpalace",
      name: "Marcus D'Souza (Grand Palace)",
      email: "marcus@grandpalace.com",
      phone: "+91 98450 54321",
      passwordHash: "hash_donor_secret",
      role: "DONOR",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      status: "ACTIVE",
      donorProfile: {
        create: {
          organizationId: orgTajGrand.id,
          foodCategories: JSON.stringify(["Prepared Meals", "Bakery", "Dairy"]),
          defaultPickupLocation: orgTajGrand.address,
          verificationStatus: "VERIFIED",
        },
      },
    },
  });

  // 5. Seed Recipient Profile Users
  const recipientUser1 = await prisma.user.create({
    data: {
      id: "user-recipient-hope",
      name: "Sister Teresa Mathews (Hope Shelter)",
      email: "teresa@hopeshelter.org",
      phone: "+91 98800 22334",
      passwordHash: "hash_recipient_secret",
      role: "RECIPIENT",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      status: "ACTIVE",
      recipientProfile: {
        create: {
          organizationId: orgHopeShelter.id,
          capacity: 180, // kg capacity
          currentNeeds: JSON.stringify([
            { category: "Prepared Meals", urgency: "HIGH", neededKg: 40, receivedKg: 12 },
            { category: "Bakery", urgency: "MEDIUM", neededKg: 20, receivedKg: 15 },
            { category: "Dairy", urgency: "LOW", neededKg: 15, receivedKg: 5 },
          ]),
          foodPreferences: JSON.stringify(["Prepared Meals", "Bakery", "Produce", "Dairy"]),
          operatingHours: "07:00 - 22:30",
          availabilityStatus: "OPEN",
        },
      },
    },
  });

  const recipientUser2 = await prisma.user.create({
    data: {
      id: "user-recipient-stjude",
      name: "Father Joseph Paul (St. Jude)",
      email: "joseph@stjudefoodbank.org",
      phone: "+91 98800 33445",
      passwordHash: "hash_recipient_secret",
      role: "RECIPIENT",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      status: "ACTIVE",
      recipientProfile: {
        create: {
          organizationId: orgStJudeFoodBank.id,
          capacity: 350,
          currentNeeds: JSON.stringify([
            { category: "Produce", urgency: "HIGH", neededKg: 80, receivedKg: 25 },
            { category: "Prepared Meals", urgency: "MEDIUM", neededKg: 50, receivedKg: 30 },
          ]),
          foodPreferences: JSON.stringify(["Produce", "Packaged", "Canned", "Prepared Meals"]),
          operatingHours: "08:00 - 20:00",
          availabilityStatus: "OPEN",
        },
      },
    },
  });

  const recipientUser3 = await prisma.user.create({
    data: {
      id: "user-recipient-ananda",
      name: "Rameshwar Rao (Ananda Kitchen)",
      email: "ramesh@anandakitchen.org",
      phone: "+91 98800 44556",
      passwordHash: "hash_recipient_secret",
      role: "RECIPIENT",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      status: "ACTIVE",
      recipientProfile: {
        create: {
          organizationId: orgAnandaKitchen.id,
          capacity: 250,
          currentNeeds: JSON.stringify([
            { category: "Prepared Meals", urgency: "HIGH", neededKg: 60, receivedKg: 20 },
          ]),
          foodPreferences: JSON.stringify(["Prepared Meals", "Vegetarian"]),
          operatingHours: "06:00 - 21:00",
          availabilityStatus: "OPEN",
        },
      },
    },
  });

  // 6. Seed 12 Drivers
  const driverDefs = [
    {
      id: "driver-rahul",
      name: "Rahul Sharma",
      email: "rahul.driver@resqfood.org",
      phone: "+91 98765 43210",
      vehicle: "CAR",
      capacity: 85,
      availability: "AVAILABLE",
      lat: 12.9752,
      lng: 77.6354, // 1.2km from GreenFork!
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    },
    {
      id: "driver-priya",
      name: "Priya Nair",
      email: "priya.driver@resqfood.org",
      phone: "+91 98765 43211",
      vehicle: "VAN",
      capacity: 250,
      availability: "AVAILABLE",
      lat: 12.9645,
      lng: 77.6412,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
    {
      id: "driver-amit",
      name: "Amit Patel",
      email: "amit.driver@resqfood.org",
      phone: "+91 98765 43212",
      vehicle: "EV_CAR",
      capacity: 70,
      availability: "AVAILABLE",
      lat: 12.9812,
      lng: 77.6256,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    },
    {
      id: "driver-suresh",
      name: "Suresh Kumar",
      email: "suresh.driver@resqfood.org",
      phone: "+91 98765 43213",
      vehicle: "VAN",
      capacity: 300,
      availability: "BUSY",
      lat: 12.9341,
      lng: 77.6189,
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
    },
    {
      id: "driver-rajesh",
      name: "Rajesh Verma",
      email: "rajesh.driver@resqfood.org",
      phone: "+91 98765 43214",
      vehicle: "CAR",
      capacity: 90,
      availability: "AVAILABLE",
      lat: 12.9712,
      lng: 77.6102,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    },
    {
      id: "driver-deepa",
      name: "Deepa Sundaram",
      email: "deepa.driver@resqfood.org",
      phone: "+91 98765 43215",
      vehicle: "CARGO_BIKE",
      capacity: 45,
      availability: "AVAILABLE",
      lat: 12.9856,
      lng: 77.6489,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    },
    {
      id: "driver-vikram",
      name: "Vikram Singh",
      email: "vikram.driver@resqfood.org",
      phone: "+91 98765 43216",
      vehicle: "BIKE",
      capacity: 30,
      availability: "AVAILABLE",
      lat: 12.9554,
      lng: 77.6601,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
    {
      id: "driver-ananya",
      name: "Ananya Joshi",
      email: "ananya.driver@resqfood.org",
      phone: "+91 98765 43217",
      vehicle: "EV_CAR",
      capacity: 75,
      availability: "AVAILABLE",
      lat: 12.9389,
      lng: 77.6321,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    },
    {
      id: "driver-rohit",
      name: "Rohit Menon",
      email: "rohit.driver@resqfood.org",
      phone: "+91 98765 43218",
      vehicle: "VAN",
      capacity: 180,
      availability: "OFFLINE",
      lat: 12.9211,
      lng: 77.6789,
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
    },
    {
      id: "driver-karan",
      name: "Karan Malhotra",
      email: "karan.driver@resqfood.org",
      phone: "+91 98765 43219",
      vehicle: "CAR",
      capacity: 80,
      availability: "AVAILABLE",
      lat: 12.9789,
      lng: 77.6012,
      avatar: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=150",
    },
    {
      id: "driver-sneha",
      name: "Sneha Roy",
      email: "sneha.driver@resqfood.org",
      phone: "+91 98765 43220",
      vehicle: "CARGO_BIKE",
      capacity: 40,
      availability: "AVAILABLE",
      lat: 12.9699,
      lng: 77.6388,
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150",
    },
    {
      id: "driver-farooq",
      name: "Mohammad Farooq",
      email: "farooq.driver@resqfood.org",
      phone: "+91 98765 43221",
      vehicle: "VAN",
      capacity: 350,
      availability: "AVAILABLE",
      lat: 12.9456,
      lng: 77.6212,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    },
  ];

  for (const d of driverDefs) {
    await prisma.user.create({
      data: {
        id: d.id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        passwordHash: "hash_driver_secret",
        role: "DRIVER",
        avatar: d.avatar,
        status: "ACTIVE",
        driverProfile: {
          create: {
            vehicleType: d.vehicle,
            vehicleCapacity: d.capacity,
            availability: d.availability,
            currentLatitude: d.lat,
            currentLongitude: d.lng,
            serviceRadius: 15,
            verificationStatus: "VERIFIED",
          },
        },
      },
    });
  }
  console.log("🚚 Seeded 12 Drivers with GPS coordinates.");

  // 7. Seed Primary Demo Donation: GreenFork 30 KG Paneer Rice + Naan
  const now = new Date();
  const prepTime = new Date(now.getTime() - 45 * 60 * 1000); // 45 mins ago
  const windowTime = new Date(now.getTime() + 105 * 60 * 1000); // 1h 45m left (URGENT / HIGH)

  const demoDonation = await prisma.donation.create({
    data: {
      id: "donation-demo-101",
      donorId: donorUser1.id,
      organizationId: orgGreenFork.id,
      foodName: "Paneer Butter Masala, Jeera Rice & Garlic Naan",
      category: "Prepared Meals",
      quantity: 30,
      unit: "KG",
      estimatedMeals: 120,
      preparedAt: prepTime,
      availableUntil: windowTime,
      storageCondition: "HOT_HELD",
      pickupAddress: "100 Feet Road, Indiranagar, Bengaluru",
      latitude: 12.9784,
      longitude: 77.6408,
      imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600",
      notes: "Freshly prepared for evening corporate banquet; packed in thermal insulated food catering containers.",
      status: "MATCHED",
      urgencyLevel: "HIGH",
      foodItems: {
        create: [
          {
            name: "Paneer Butter Masala",
            category: "Prepared Meals",
            quantity: 12,
            unit: "KG",
            storageCondition: "HOT_HELD",
            allergens: JSON.stringify(["Dairy"]),
            notes: "Mildly spiced, fresh cottage cheese",
          },
          {
            name: "Steamed Jeera Basmati Rice",
            category: "Prepared Meals",
            quantity: 12,
            unit: "KG",
            storageCondition: "HOT_HELD",
            allergens: JSON.stringify([]),
            notes: "Aromatic cumin tempered basmati",
          },
          {
            name: "Garlic Butter Naan (40 pcs)",
            category: "Bakery",
            quantity: 6,
            unit: "KG",
            storageCondition: "HOT_HELD",
            allergens: JSON.stringify(["Gluten", "Dairy"]),
            notes: "Tandoor baked bread wrapped in foil",
          },
        ],
      },
    },
  });

  // Seed Primary Demo Match & MatchScore (96/100)
  const demoMatch = await prisma.match.create({
    data: {
      id: "match-demo-96",
      donationId: demoDonation.id,
      recipientId: orgHopeShelter.id,
      driverId: "driver-rahul",
      score: 96,
      distance: 3.8,
      estimatedTime: 18,
      status: "ACCEPTED",
      matchScore: {
        create: {
          urgencyScore: 25,
          distanceScore: 23,
          capacityScore: 20,
          compatibilityScore: 15,
          driverScore: 13,
          explanation: JSON.stringify([
            "Recipient has enough capacity (Hope Shelter available: 168 KG)",
            "Food category matches current critical need (Prepared Meals needed: 40 KG)",
            "Recipient is only 3.8 KM away via Old Airport Road",
            "Driver Rahul Sharma is available and only 1.2 KM from pickup point",
            "Food remains within active rescue window (1h 45m remaining)",
          ]),
        },
      },
    },
  });

  // Seed Active Demo Rescue: RF-10283
  const demoRescue = await prisma.rescue.create({
    data: {
      id: "RF-10283",
      donationId: demoDonation.id,
      matchId: demoMatch.id,
      recipientId: orgHopeShelter.id,
      driverId: "driver-rahul",
      status: "IN_TRANSIT",
      rescueScore: 96,
      estimatedPickupTime: new Date(now.getTime() - 20 * 60 * 1000),
      estimatedDeliveryTime: new Date(now.getTime() + 12 * 60 * 1000),
      actualPickupTime: new Date(now.getTime() - 15 * 60 * 1000),
      routes: {
        create: {
          startLatitude: 12.9784,
          startLongitude: 77.6408,
          endLatitude: 12.9612,
          endLongitude: 77.6534,
          distance: 3.8,
          estimatedDuration: 18,
          trafficStatus: "NORMAL",
          routeData: JSON.stringify([
            [12.9784, 77.6408],
            [12.9752, 77.6415],
            [12.9701, 77.6432],
            [12.9664, 77.6481],
            [12.9612, 77.6534],
          ]),
        },
      },
      pickups: {
        create: {
          status: "CONFIRMED",
          timestamp: new Date(now.getTime() - 15 * 60 * 1000),
          latitude: 12.9784,
          longitude: 77.6408,
          qrCode: "RESQ-PICKUP-RF10283-GF01",
          photoUrl: "https://images.unsplash.com/photo-1547496502-affa22d38842?w=400",
          notes: "Containers verified hot (68°C), securely strapped into transport boot.",
        },
      },
    },
  });

  // Seed Audit Logs for Demo Rescue
  await prisma.auditLog.createMany({
    data: [
      {
        userId: donorUser1.id,
        action: "DONATION_CREATED",
        entityType: "Donation",
        entityId: demoDonation.id,
        metadata: JSON.stringify({ foodName: demoDonation.foodName, quantityKg: 30 }),
        timestamp: new Date(now.getTime() - 35 * 60 * 1000),
      },
      {
        userId: adminUser.id,
        action: "AI_MATCH_CALCULATED",
        entityType: "Match",
        entityId: demoMatch.id,
        metadata: JSON.stringify({ score: 96, recipient: "Hope Community Shelter", driver: "Rahul Sharma" }),
        timestamp: new Date(now.getTime() - 34 * 60 * 1000),
      },
      {
        userId: "driver-rahul",
        action: "DRIVER_ACCEPTED",
        entityType: "Rescue",
        entityId: demoRescue.id,
        metadata: JSON.stringify({ driver: "Rahul Sharma", etaMinutes: 18 }),
        timestamp: new Date(now.getTime() - 30 * 60 * 1000),
      },
      {
        userId: "driver-rahul",
        action: "PICKUP_CONFIRMED",
        entityType: "Rescue",
        entityId: demoRescue.id,
        metadata: JSON.stringify({ qrScanned: true, photoCaptured: true, tempCelsius: 68 }),
        timestamp: new Date(now.getTime() - 15 * 60 * 1000),
      },
    ],
  });

  // 8. Seed 29 Additional Realistic Donations across Categories & Statuses
  const sampleDonations = [
    {
      org: orgTajGrand,
      donor: donorUser2,
      foodName: "Continental Breakfast Buffet Trays (Croissants, Quiche, Fruit)",
      category: "Bakery",
      qty: 45,
      unit: "KG",
      meals: 180,
      storage: "ROOM_TEMP",
      status: "DELIVERED",
      urgency: "MEDIUM",
      hoursAgo: 6,
    },
    {
      org: orgOrganicEarth,
      donor: donorUser1,
      foodName: "Fresh Organic Spinach, Bell Peppers & Broccoli Crates",
      category: "Produce",
      qty: 65,
      unit: "KG",
      meals: 260,
      storage: "REFRIGERATED",
      status: "DELIVERED",
      urgency: "LOW",
      hoursAgo: 14,
    },
    {
      org: orgSiliconCafeteria,
      donor: donorUser2,
      foodName: "Vegetable Biryani & Dal Makhani Thermal Kettles",
      category: "Prepared Meals",
      qty: 55,
      unit: "KG",
      meals: 220,
      storage: "HOT_HELD",
      status: "POSTED",
      urgency: "CRITICAL", // 42 mins left!
      hoursAgo: 0.5,
    },
    {
      org: orgArtisanBakery,
      donor: donorUser1,
      foodName: "Artisanal Sourdough Loaves & Focaccia Baskets",
      category: "Bakery",
      qty: 25,
      unit: "KG",
      meals: 100,
      storage: "ROOM_TEMP",
      status: "ASSIGNED",
      urgency: "MEDIUM",
      hoursAgo: 1.5,
    },
    {
      org: orgMetroSuper,
      donor: donorUser2,
      foodName: "Cartons of UHT Whole Milk & Greek Yogurt Cups",
      category: "Dairy",
      qty: 40,
      unit: "KG",
      meals: 160,
      storage: "REFRIGERATED",
      status: "DELIVERED",
      urgency: "MEDIUM",
      hoursAgo: 24,
    },
    {
      org: orgOliveBistro,
      donor: donorUser1,
      foodName: "Roasted Vegetable Lasagna & Garlic Baguettes",
      category: "Prepared Meals",
      qty: 35,
      unit: "KG",
      meals: 140,
      storage: "HOT_HELD",
      status: "IN_TRANSIT",
      urgency: "HIGH",
      hoursAgo: 1.2,
    },
    {
      org: orgCatererPro,
      donor: donorUser2,
      foodName: "Wedding Feast: Pulao, Paneer Tikka & Malai Kofta",
      category: "Prepared Meals",
      qty: 90,
      unit: "KG",
      meals: 360,
      storage: "HOT_HELD",
      status: "DELIVERED",
      urgency: "HIGH",
      hoursAgo: 36,
    },
    {
      org: orgOrganicEarth,
      donor: donorUser1,
      foodName: "Sweet Melons, Bananas and Apple Crates",
      category: "Produce",
      qty: 50,
      unit: "KG",
      meals: 200,
      storage: "ROOM_TEMP",
      status: "MATCHING",
      urgency: "LOW",
      hoursAgo: 0.8,
    },
    {
      org: orgSpiceGarden,
      donor: donorUser2,
      foodName: "South Indian Sambar, Lemon Rice & Curd Rice",
      category: "Prepared Meals",
      qty: 40,
      unit: "KG",
      meals: 160,
      storage: "HOT_HELD",
      status: "DELIVERED",
      urgency: "MEDIUM",
      hoursAgo: 48,
    },
    {
      org: orgTajGrand,
      donor: donorUser2,
      foodName: "Banquet Dessert Platters (Gulab Jamun, Pastries)",
      category: "Bakery",
      qty: 20,
      unit: "KG",
      meals: 80,
      storage: "REFRIGERATED",
      status: "DELIVERED",
      urgency: "MEDIUM",
      hoursAgo: 50,
    },
  ];

  let counter = 102;
  for (const s of sampleDonations) {
    const donationDate = new Date(now.getTime() - s.hoursAgo * 60 * 60 * 1000);
    const validUntilDate = new Date(donationDate.getTime() + 3 * 60 * 60 * 1000);

    const createdDonation = await prisma.donation.create({
      data: {
        id: `donation-${counter}`,
        donorId: s.donor.id,
        organizationId: s.org.id,
        foodName: s.foodName,
        category: s.category,
        quantity: s.qty,
        unit: s.unit,
        estimatedMeals: s.meals,
        preparedAt: donationDate,
        availableUntil: validUntilDate,
        storageCondition: s.storage,
        pickupAddress: s.org.address,
        latitude: s.org.latitude,
        longitude: s.org.longitude,
        status: s.status,
        urgencyLevel: s.urgency,
        notes: "Certified handled under standard operational temperatures.",
      },
    });

    // If delivered or in transit, create a rescue record
    if (s.status === "DELIVERED" || s.status === "IN_TRANSIT" || s.status === "ASSIGNED") {
      const rescueId = `RF-${10200 + counter}`;
      const isDelivered = s.status === "DELIVERED";

      const r = await prisma.rescue.create({
        data: {
          id: rescueId,
          donationId: createdDonation.id,
          recipientId: orgStJudeFoodBank.id,
          driverId: "driver-priya",
          status: isDelivered ? "DELIVERED" : "IN_TRANSIT",
          rescueScore: 92,
          actualPickupTime: donationDate,
          actualDeliveryTime: isDelivered ? new Date(donationDate.getTime() + 45 * 60 * 1000) : null,
          pickups: {
            create: {
              status: "CONFIRMED",
              timestamp: donationDate,
              latitude: s.org.latitude,
              longitude: s.org.longitude,
              qrCode: `QR-PICKUP-${rescueId}`,
            },
          },
          ...(isDelivered
            ? {
                deliveries: {
                  create: {
                    status: "CONFIRMED",
                    timestamp: new Date(donationDate.getTime() + 45 * 60 * 1000),
                    latitude: orgStJudeFoodBank.latitude,
                    longitude: orgStJudeFoodBank.longitude,
                    qrCode: `QR-DELIVERY-${rescueId}`,
                    recipientConfirmation: "Verified by Pantry Manager Joseph",
                  },
                },
                impactRecords: {
                  create: {
                    foodWeight: s.qty,
                    estimatedMeals: s.meals,
                    estimatedCo2e: +(s.qty * 2.5).toFixed(1), // 2.5 kg CO2e / kg food
                    waterSavedLitres: +(s.qty * 520).toFixed(0),
                    organizationsSupported: 1,
                  },
                },
              }
            : {}),
        },
      });
    }

    counter++;
  }

  // 9. Seed AI Insights
  await prisma.aIInsight.createMany({
    data: [
      {
        organizationId: orgGreenFork.id,
        type: "SURPLUS_FORECAST",
        title: "Upcoming Weekend Banquet Surplus Spike",
        description: "Historical data indicates 45-60 KG surplus anticipated this Saturday evening between 8-10 PM.",
        confidence: 0.94,
      },
      {
        organizationId: orgGreenFork.id,
        type: "ROUTE_OPTIMIZATION",
        title: "Hope Shelter Direct Corridor Recommended",
        description: "Average transit time on Old Airport Road drops by 6 minutes if dispatched before 7:15 PM.",
        confidence: 0.91,
      },
      {
        organizationId: orgTajGrand.id,
        type: "DEMAND_SPIKE",
        title: "Shelter Bed Capacity Surging in East Hub",
        description: "St. Jude Food Bank current demand for dairy and produce is at 180% normal volume.",
        confidence: 0.88,
      },
    ],
  });

  // 10. Seed Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: donorUser1.id,
        type: "CRITICAL",
        title: "Critical rescue window: 42 minutes remaining",
        message: "Silicon Tech Hub cafeteria donation RF-10104 needs immediate driver dispatch.",
      },
      {
        userId: donorUser1.id,
        type: "RESCUE",
        title: "Driver Rahul Sharma accepted RF-10283",
        message: "Driver is 1.2 KM away and en route for pickup from GreenFork Restaurant.",
      },
      {
        userId: donorUser1.id,
        type: "IMPACT",
        title: "Rescue Delivery Verified!",
        message: "Your donation of 45 KG continental breakfast provided 180 meals to St. Jude Mercy.",
      },
      {
        userId: recipientUser1.id,
        type: "RESCUE",
        title: "Incoming Rescue RF-10283",
        message: "30 KG Paneer Butter Masala & Naan from GreenFork is in transit. ETA: 12 minutes.",
      },
    ],
  });

  console.log("✅ Seed completed successfully!");
  console.log("📊 Summary:");
  console.log("   - 4 Cities");
  console.log("   - 18 Organizations (10 Donors, 8 Recipients)");
  console.log("   - 12 Verified Drivers with GPS coords");
  console.log("   - Primary Demo Rescue: RF-10283 (30 KG Paneer Rice -> Hope Shelter via Rahul Sharma, Score: 96)");
  console.log("   - Full Impact, Route, Audit Log, and AI Insights seeded");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
