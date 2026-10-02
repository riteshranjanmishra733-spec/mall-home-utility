
import bcrypt from "bcrypt";
import prisma from "./src/lib/prisma.js";

const categories = [
  {
    name: "Plumbing",
    description: "Professional plumbing repair and installation services",
    icon: "wrench",
    services: [
      "Pipe Leak Repair",
      "Tap & Faucet Repair",
      "Bathroom Plumbing",
      "Water Tank Repair",
    ],
  },
  {
    name: "Electrical",
    description: "Electrical repair, installation and maintenance services",
    icon: "zap",
    services: [
      "Fan Installation",
      "Switch & Socket Repair",
      "Wiring & Electrical Repair",
      "Light Installation",
    ],
  },
  {
    name: "Cleaning",
    description: "Professional home and household cleaning services",
    icon: "sparkles",
    services: [
      "Home Deep Cleaning",
      "Bathroom Cleaning",
      "Kitchen Cleaning",
      "Sofa Cleaning",
    ],
  },
  {
    name: "AC & Appliance Repair",
    description: "AC and home appliance repair and maintenance",
    icon: "settings",
    services: [
      "AC Service",
      "AC Repair",
      "Washing Machine Repair",
      "Refrigerator Repair",
    ],
  },
  {
    name: "Carpentry",
    description: "Furniture repair, installation and carpentry services",
    icon: "hammer",
    services: [
      "Furniture Repair",
      "Door Repair",
      "Furniture Assembly",
      "Shelf Installation",
    ],
  },
  {
    name: "Painting",
    description: "Interior, exterior and wall painting services",
    icon: "paintbrush",
    services: [
      "Interior Painting",
      "Exterior Painting",
      "Wall Touch-up",
      "Texture Painting",
    ],
  },
  {
    name: "Pest Control",
    description: "Professional pest control and prevention services",
    icon: "bug",
    services: [
      "General Pest Control",
      "Cockroach Control",
      "Termite Control",
      "Mosquito Control",
    ],
  },
  {
    name: "Beauty & Salon",
    description: "Beauty and grooming services at your doorstep",
    icon: "scissors",
    services: [
      "Haircut at Home",
      "Hair Styling",
      "Facial at Home",
      "Grooming Service",
    ],
  },
];

const providers = [
  {
    name: "Rajesh Kumar",
    email: "demo.plumber@mhutility.test",
    bio: "Experienced plumber providing residential plumbing solutions.",
    city: "Jaipur",
    area: "Vaishali Nagar",
    pincode: "302021",
    phone: "9000000001",
    services: [
      "Pipe Leak Repair",
      "Tap & Faucet Repair",
      "Bathroom Plumbing",
    ],
  },
  {
    name: "Amit Sharma",
    email: "demo.electrician@mhutility.test",
    bio: "Professional electrician for home electrical installation and repair.",
    city: "Jaipur",
    area: "Malviya Nagar",
    pincode: "302017",
    phone: "9000000002",
    services: [
      "Fan Installation",
      "Switch & Socket Repair",
      "Light Installation",
    ],
  },
  {
    name: "Priya Verma",
    email: "demo.cleaning@mhutility.test",
    bio: "Professional home cleaning specialist.",
    city: "Jaipur",
    area: "Mansarovar",
    pincode: "302020",
    phone: "9000000003",
    services: [
      "Home Deep Cleaning",
      "Bathroom Cleaning",
      "Kitchen Cleaning",
    ],
  },
  {
    name: "Mohit Singh",
    email: "demo.appliance@mhutility.test",
    bio: "Experienced AC and home appliance technician.",
    city: "Jaipur",
    area: "C-Scheme",
    pincode: "302001",
    phone: "9000000004",
    services: [
      "AC Service",
      "AC Repair",
      "Washing Machine Repair",
    ],
  },
];

async function main() {
  console.log("Starting Mall & Home Utility seed...\n");

  const serviceMap = new Map();

  // ----------------------------------------
  // Categories and Services
  // ----------------------------------------

  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: {
        name: categoryData.name,
      },
      update: {
        description: categoryData.description,
        icon: categoryData.icon,
      },
      create: {
        name: categoryData.name,
        description: categoryData.description,
        icon: categoryData.icon,
      },
    });

    console.log(`Category: ${category.name}`);

    for (const serviceName of categoryData.services) {
      let service = await prisma.service.findFirst({
        where: {
          name: serviceName,
          categoryId: category.id,
        },
      });

      if (!service) {
        service = await prisma.service.create({
          data: {
            name: serviceName,
            description: `${serviceName} provided by verified service professionals.`,
            categoryId: category.id,
            isActive: true,
          },
        });

        console.log(`  + Service: ${serviceName}`);
      } else {
        console.log(`  ✓ Service already exists: ${serviceName}`);
      }

      serviceMap.set(serviceName, service.id);
    }
  }

  // ----------------------------------------
  // Demo Provider Password
  // ----------------------------------------

  const passwordHash = await bcrypt.hash("Demo@12345", 10);

  // ----------------------------------------
  // Providers
  // ----------------------------------------

  for (const providerData of providers) {
    const user = await prisma.user.upsert({
      where: {
        email: providerData.email,
      },
      update: {
        name: providerData.name,
        role: "PROVIDER",
      },
      create: {
        name: providerData.name,
        email: providerData.email,
        password: passwordHash,
        role: "PROVIDER",
      },
    });

    const profile = await prisma.providerProfile.upsert({
      where: {
        userId: user.id,
      },
      update: {
        bio: providerData.bio,
        city: providerData.city,
        area: providerData.area,
        pincode: providerData.pincode,
        phone: providerData.phone,
        isAvailable: true,
      },
      create: {
        userId: user.id,
        bio: providerData.bio,
        city: providerData.city,
        area: providerData.area,
        pincode: providerData.pincode,
        phone: providerData.phone,
        isAvailable: true,
      },
    });

    console.log(`\nProvider: ${providerData.name}`);

    for (const serviceName of providerData.services) {
      const serviceId = serviceMap.get(serviceName);

      if (!serviceId) {
        console.log(`  ! Service not found: ${serviceName}`);
        continue;
      }

      await prisma.providerService.upsert({
        where: {
          providerId_serviceId: {
            providerId: profile.id,
            serviceId: serviceId,
          },
        },
        update: {
          isAvailable: true,
        },
        create: {
          providerId: profile.id,
          serviceId: serviceId,
          isAvailable: true,
        },
      });

      console.log(`  + ${serviceName}`);
    }
  }

  // ----------------------------------------
  // Final counts
  // ----------------------------------------

  const categoryCount = await prisma.category.count();
  const serviceCount = await prisma.service.count();
  const providerCount = await prisma.providerProfile.count();
  const providerServiceCount = await prisma.providerService.count();

  console.log("\n----------------------------------------");
  console.log("Seed completed successfully!");
  console.log("----------------------------------------");
  console.log(`Categories:        ${categoryCount}`);
  console.log(`Services:          ${serviceCount}`);
  console.log(`Providers:         ${providerCount}`);
  console.log(`Provider Services: ${providerServiceCount}`);
  console.log("----------------------------------------");
}

main()
  .catch((error) => {
    console.error("\nSeed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

