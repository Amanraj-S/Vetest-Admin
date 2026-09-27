const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const AdminUser = require('./models/AdminUser');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Solution = require('./models/Solution');
const Industry = require('./models/Industry');
const Technology = require('./models/Technology');
const Project = require('./models/Project');
const Resource = require('./models/Resource');
const Enquiry = require('./models/Enquiry');
const Page = require('./models/Page');
const SiteSetting = require('./models/SiteSetting');
const MediaAsset = require('./models/MediaAsset');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI is not set in environment!');
      process.exit(1);
    }

    await mongoose.connect(mongoUri, { dbName: 'vtest_admin' });
    console.log('Connected to MongoDB Atlas for seeding...');

    // 1. Create Default Admin User
    const existingAdmin = await AdminUser.findOne({ email: 'admin@vtest.local' });
    if (!existingAdmin) {
      await AdminUser.create({
        name: 'Vtest Lead Administrator',
        email: 'admin@vtest.local',
        password: 'ChangeMe123!',
        role: 'SUPER_ADMIN',
        status: 'ACTIVE'
      });
      console.log('✓ Created default dev admin: admin@vtest.local / ChangeMe123!');
    } else {
      console.log('- Default dev admin already exists');
    }

    // 2. Categories
    const categoryCount = await Category.countDocuments();
    let categories = [];
    if (categoryCount === 0) {
      categories = await Category.insertMany([
        {
          name: 'Automotive Inspection Lanes',
          slug: 'automotive-inspection-lanes',
          description: 'Turnkey periodic technical inspection (PTI) equipment and automated testing lanes for private and commercial vehicles.',
          status: 'PUBLISHED',
          displayOrder: 1
        },
        {
          name: 'Computer Vision & AI Systems',
          slug: 'computer-vision-ai-systems',
          description: 'High-speed camera vision inspection and AI anomaly detection platforms for vehicle body and component defect analysis.',
          status: 'PUBLISHED',
          displayOrder: 2
        },
        {
          name: 'Industrial Automation & IoT',
          slug: 'industrial-automation-iot',
          description: 'Smart IoT sensors, DAQ hardware, and programmable automation controllers for manufacturing testbeds.',
          status: 'PUBLISHED',
          displayOrder: 3
        },
        {
          name: 'Emissions & Brake Testing Equipment',
          slug: 'emissions-brake-testing-equipment',
          description: 'Roller brake testers, suspension analyzers, gas analyzers, and smoke meters for regulatory compliance.',
          status: 'PUBLISHED',
          displayOrder: 4
        }
      ]);
      console.log(`✓ Seeded ${categories.length} categories`);
    } else {
      categories = await Category.find();
    }

    // 3. Products
    const productCount = await Product.countDocuments();
    if (productCount === 0 && categories.length > 0) {
      await Product.insertMany([
        {
          name: 'Vtest PTI Lane Pro-9000',
          slug: 'vtest-pti-lane-pro-9000',
          shortDescription: 'Integrated multi-lane vehicle safety inspection system with automated vehicle profiling.',
          fullDescription: 'The Vtest PTI Lane Pro-9000 is a centralized automated inspection line designed for transport authorities and vehicle testing facilities. Includes brake test bench, wheel alignment meter, and headlamp test module.',
          productType: 'HARDWARE',
          category: categories[0]._id,
          heroContent: 'Automated Vehicle Roadworthiness Testing with Zero Human Error',
          heroImage: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
          features: [
            { title: 'Automated License Plate Recognition (ALPR)', description: 'Retrieves vehicle registry profile instantly', icon: 'Camera' },
            { title: 'High Precision Brake Analyzer', description: 'Dual-plate roller measurement up to 15-ton axle loads', icon: 'Gauge' }
          ],
          applications: ['Government PTI Centers', 'Commercial Fleet Maintenance Depot', 'Pre-registration Inspection Facilities'],
          specifications: [
            { groupName: 'Performance', specKey: 'Max Axle Load', specValue: '18,000 kg', unit: 'kg' },
            { groupName: 'Electrical', specKey: 'Operating Voltage', specValue: '400V 3-Phase', unit: 'V' }
          ],
          status: 'PUBLISHED'
        },
        {
          name: 'VisionAI Chassis Inspector',
          slug: 'visionai-chassis-inspector',
          shortDescription: 'Underbody AI camera scanner for automated rust, oil leak, and structural damage detection.',
          fullDescription: '3D high-resolution array scanner that creates a digital twin of vehicle undercarriage in 4 seconds. Trained on over 10M synthetic vehicle chassis images.',
          productType: 'SOFTWARE',
          category: categories[1]._id,
          heroContent: 'AI-Powered Undercarriage Scanning in 4 Seconds',
          heroImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
          features: [
            { title: 'Real-time Anomaly Highlight', description: 'Pins structural hairline cracks and fluid leak origins', icon: 'Cpu' }
          ],
          applications: ['EV Battery Casing Inspection', 'Automotive OEM Quality Gate', 'Used Vehicle Certification'],
          specifications: [
            { groupName: 'Optics', specKey: 'Camera Resolution', specValue: '4x 8K Line-scan Cameras', unit: 'px' }
          ],
          status: 'PUBLISHED'
        },
        {
          name: 'Vtest IoT Fleet Controller',
          slug: 'vtest-iot-fleet-controller',
          shortDescription: 'Industrial telemetry gateway with OBD-II & CAN-Bus multi-protocol support.',
          fullDescription: 'Ruggedized edge compute gateway for real-time vehicle diagnostic telemetry transmission to cloud inspection platforms.',
          productType: 'HARDWARE',
          category: categories[2]._id,
          heroContent: 'Edge Analytics Gateway for Connected Fleet Inspection',
          heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
          features: [
            { title: 'Dual 5G & Satellite Failover', description: 'Uninterrupted telemetry delivery in remote regions', icon: 'Wifi' }
          ],
          applications: ['Autonomous Transport Testing', 'Municipal Transit Telemetry', 'Heavy Industrial Equipment Monitoring'],
          specifications: [
            { groupName: 'Compute', specKey: 'Processor', specValue: 'Quad-Core ARM Cortex A72', unit: 'GHz' }
          ],
          status: 'PUBLISHED'
        }
      ]);
      console.log('✓ Seeded 3 products');
    }

    // 4. Solutions
    const solutionCount = await Solution.countDocuments();
    if (solutionCount === 0) {
      await Solution.insertMany([
        {
          name: 'Centralized Transport Authority PTI Platform',
          slug: 'centralized-transport-authority-pti-platform',
          description: 'A unified solution for periodic, compliance-based, and end-of-line vehicle inspections ensuring safety, accuracy, and regulatory control across nationwide testing stations.',
          heroImage: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80',
          features: ['Real-time Licensing Database Sync', 'Tamper-proof Digital Roadworthiness Certificate', 'Centralized Testing Center Monitoring'],
          benefits: ['Reduce road accidents caused by mechanical failure by 35%', 'Eliminate fraudulent inspection certificates', 'Streamline vehicle throughput by 50%'],
          applications: ['National Transport Ministries', 'Regional Motor Vehicle Departments'],
          status: 'PUBLISHED'
        },
        {
          name: 'Automotive OEM Quality Gate Automation',
          slug: 'automotive-oem-quality-gate-automation',
          description: 'End-of-line (EOL) automated quality check stations for EV battery assembly and complete vehicle roll-off testing.',
          heroImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
          features: ['360-degree Vision Defect Scanning', 'Acoustic Sound & Vibration Analysis', 'Automated Pass/Fail Interlock'],
          benefits: ['100% inspection coverage without slowing assembly line', 'Zero defect escape to dealership network'],
          applications: ['Passenger Car Assembly Plants', 'Electric Bus & Commercial Vehicle Factories'],
          status: 'PUBLISHED'
        }
      ]);
      console.log('✓ Seeded 2 solutions');
    }

    // 5. Industries
    const industryCount = await Industry.countDocuments();
    if (industryCount === 0) {
      await Industry.insertMany([
        {
          industryName: 'Government Transport & Public Safety',
          slug: 'government-transport-public-safety',
          description: 'Regulatory solutions for public transport authorities overseeing annual vehicle safety certifications and emissions compliance.',
          heroImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80',
          applications: ['Periodic Technical Inspection (PTI)', 'Roadside Enforcement Testing'],
          benefits: ['Standardized testing procedures', 'Real-time anti-corruption audit trails'],
          status: 'PUBLISHED'
        },
        {
          industryName: 'Commercial Fleet Operations',
          slug: 'commercial-fleet-operations',
          description: 'Proactive maintenance & safety inspection workflows for logistics, heavy transport, and municipal transit fleets.',
          heroImage: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
          applications: ['Pre-trip Automated Inspection', 'Preventive Maintenance Scheduling'],
          benefits: ['Minimizes unplanned vehicle downtime', 'Extends commercial vehicle lifespan'],
          status: 'PUBLISHED'
        }
      ]);
      console.log('✓ Seeded 2 industries');
    }

    // 6. Technology
    const techCount = await Technology.countDocuments();
    if (techCount === 0) {
      await Technology.insertMany([
        {
          technologyName: 'Vtest Neural Vision Analytics Engine',
          slug: 'vtest-neural-vision-analytics-engine',
          description: 'Deep neural network trained on millions of vehicle defect instances for sub-millimeter chassis scratch, dent, and weld inspection.',
          technologyCategory: 'Computer Vision',
          icon: 'Eye',
          features: ['Sub-millimeter crack detection', 'Multi-exposure HDR image synthesis', 'Edge AI inference in <100ms'],
          applications: ['Underbody inspection', 'Paint defect analysis'],
          status: 'PUBLISHED',
          displayOrder: 1
        },
        {
          technologyName: 'High-Frequency CAN-Bus Telemetry DAQ',
          slug: 'high-frequency-can-bus-telemetry-daq',
          description: 'Ultra-low latency data acquisition hardware capturing 10,000 samples/sec across dual CAN-FD networks.',
          technologyCategory: 'Hardware & IoT',
          icon: 'Cpu',
          features: ['CAN-FD & LIN bus decoding', 'Galvanic isolation up to 2.5kV', 'Mil-spec aluminum enclosure'],
          applications: ['Dyno test bench telemetry', 'Vehicle brake performance recording'],
          status: 'PUBLISHED',
          displayOrder: 2
        }
      ]);
      console.log('✓ Seeded 2 technology entries');
    }

    // 7. Projects / Case Studies
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          projectTitle: 'Demo Project: Automated PTI Lane Modernization for Metropolitan Transit (Placeholder)',
          slug: 'demo-project-automated-pti-lane-modernization',
          clientName: 'Metropolitan Public Transport Authority (Demo/Placeholder)',
          industry: 'Government Transport',
          location: 'Regional Testing Hub',
          summary: 'Implementation of 12 multi-lane automated vehicle testing lines equipped with ALPR and digital certificate issuing kiosks.',
          challenge: 'High vehicle queue times exceeding 45 minutes during peak renewal periods and manual paper certificate vulnerability.',
          solution: 'Deployed Vtest PTI Lane Pro-9000 hardware linked to centralized cloud software database.',
          implementation: 'Phase 1 completed in 6 months across 4 stations, processing 1,200 vehicles per day.',
          results: ['Average inspection time reduced from 22 minutes to 7 minutes', '100% elimination of paper certificate forging'],
          technologies: ['Vtest PTI Lane Pro-9000', 'ALPR Camera Grid', 'Mongoose DB Cloud Sync'],
          status: 'PUBLISHED',
          featured: true
        }
      ]);
      console.log('✓ Seeded 1 demo project');
    }

    // 8. Resources
    const resourceCount = await Resource.countDocuments();
    if (resourceCount === 0) {
      await Resource.insertMany([
        {
          title: 'The Future of AI-Driven Vehicle Roadworthiness Testing 2026',
          slug: 'future-ai-driven-vehicle-roadworthiness-testing-2026',
          type: 'WHITEPAPER',
          description: 'Comprehensive technical whitepaper exploring computer vision, underbody scanning, and regulatory standards in modern vehicle inspection.',
          content: 'As electric vehicles and connected ADAS technology become standard, traditional manual inspection lines are evolving into sensor-dense digital diagnostic hubs...',
          author: 'Vtest R&D Engineering Team',
          status: 'PUBLISHED',
          featured: true
        },
        {
          title: 'Vtest Product Ecosystem Overview Brochure',
          slug: 'vtest-product-ecosystem-overview-brochure',
          type: 'BROCHURE',
          description: 'Download the full product overview featuring inspection lanes, brake testers, and cloud management software.',
          content: 'Detailed specifications and architectural diagrams for the complete Vtest inspection family.',
          author: 'Vtest Marketing Team',
          status: 'PUBLISHED',
          featured: false
        }
      ]);
      console.log('✓ Seeded 2 resources');
    }

    // 9. Enquiries
    const enquiryCount = await Enquiry.countDocuments();
    if (enquiryCount === 0) {
      await Enquiry.insertMany([
        {
          name: 'Sarah Jenkins',
          email: 'sarah.jenkins@autotest-demo.org',
          phone: '+1 555-0192',
          company: 'AutoTest Municipal Station',
          country: 'United States',
          enquiryType: 'Commercial Quote',
          message: 'Interested in procuring 4 units of Vtest PTI Lane Pro-9000 for our new commercial inspection depot. Please send pricing datasheet.',
          source: 'Website Product Page',
          status: 'NEW'
        },
        {
          name: 'Marcus Vance',
          email: 'marcus.v@fleetlogistics-demo.de',
          phone: '+49 89 901234',
          company: 'EuroFleet Logistics GmbH',
          country: 'Germany',
          enquiryType: 'Technical Support',
          message: 'Requesting integration guide for connecting Vtest IoT Fleet Controller with SAP Fleet ERP.',
          source: 'Contact Us Form',
          status: 'IN_PROGRESS',
          internalNotes: 'Assigned to Solutions Architect Team on Sept 25.'
        }
      ]);
      console.log('✓ Seeded 2 sample enquiries');
    }

    // 10. CMS Pages
    const pageCount = await Page.countDocuments();
    if (pageCount === 0) {
      await Page.insertMany([
        {
          pageName: 'About Vtest Technologies',
          slug: 'about-us',
          title: 'Smart Vehicle Inspection & Compliance Platform',
          subtitle: 'Leading the global transition towards intelligent, automated, and error-free vehicle safety testing.',
          content: 'Vtest Vehicle Inspection Management System is a centralized solution that facilitates connecting to governmental vehicle licensing databases to retrieve registration information and captures all vehicle inspection details in order to manage end-to-end vehicle inspection in compliance with road transport policies.',
          status: 'PUBLISHED'
        },
        {
          pageName: 'Privacy Policy',
          slug: 'privacy-policy',
          title: 'Vtest Data Privacy Policy',
          subtitle: 'How we collect, protect, and process diagnostic telemetry and administrative user data.',
          content: 'At Vtest Technologies, we take data privacy and regulatory security with utmost seriousness. All telemetry transmission is encrypted using TLS 1.3...',
          status: 'PUBLISHED'
        }
      ]);
      console.log('✓ Seeded 2 CMS pages');
    }

    // 11. Site Settings
    let settings = await SiteSetting.findOne({ key: 'global_settings' });
    if (!settings) {
      await SiteSetting.create({ key: 'global_settings' });
      console.log('✓ Created default site settings');
    }

    console.log('\n==================================================');
    console.log('🎉 Seed process completed successfully!');
    console.log('==================================================');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
