// require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
// import { connect, disconnect } from 'mongoose';
// import { deleteMany, create } from '../models/Admin';
// import { deleteMany as _deleteMany, insertMany } from '../models/Artisan';
// import { deleteMany as __deleteMany, insertMany as _insertMany } from '../models/Tourist';
// import { deleteMany as ___deleteMany, insertMany as __insertMany } from '../models/Workshop';
// import { deleteMany as ____deleteMany, insertMany as ___insertMany } from '../models/Booking';
// import { deleteMany as _____deleteMany, insertMany as ____insertMany } from '../models/Review';
// import { deleteMany as ______deleteMany, insertMany as _____insertMany } from '../models/ActivityLog';

// async function seed() {
//   await connect(process.env.MONGODB_URI);
//   console.log('Connected to MongoDB');

//   // Clear existing data
//   await Promise.all([
//     deleteMany(), _deleteMany(), __deleteMany(),
//     ___deleteMany(), ____deleteMany(), _____deleteMany(), ______deleteMany(),
//   ]);
//   console.log('Cleared existing data');

//   // Admin
//   await create({
//     name: 'Admin User',
//     email: process.env.ADMIN_SEED_EMAIL || 'admin@lankacraft.lk',
//     password: process.env.ADMIN_SEED_PASSWORD || 'Admin@1234',
//     role: 'super_admin',
//   });
//   console.log('Admin created');

//   // Artisans
//   const artisans = await insertMany([
//     { name: 'Nimal Perera', craft: 'Kandyan Lacquerwork', region: 'Kandy', email: 'nimal.perera@example.com', phone: '+94 77 123 4567', status: 'pending', rating: 4.9, experience: '40 years', bio: 'Master craftsman specializing in traditional Kandyan lacquerwork.', initials: 'NP', color: '#C65D3B', certifications: ['UNESCO Heritage', 'National Crafts Council'], workshops: 12 },
//     { name: 'Kamala Wijesinghe', craft: 'Batik Textiles', region: 'Kandy', email: 'kamala.w@example.com', phone: '+94 71 234 5678', status: 'verified', rating: 4.8, experience: '28 years', bio: 'Expert batik artist creating intricate wax-resist patterns.', initials: 'KW', color: '#2F5D50', certifications: ['National Crafts Council'], workshops: 8 },
//     { name: 'Suresh Fernando', craft: 'Mask Carving', region: 'Ambalangoda', email: 'suresh.f@example.com', phone: '+94 76 345 6789', status: 'pending', rating: 4.7, experience: '35 years', bio: 'Third-generation mask carver from Ambalangoda.', initials: 'SF', color: '#C9A227', certifications: ['Heritage Artisan Certificate'], workshops: 15 },
//     { name: 'Priya Rajapaksa', craft: 'Palmyra Weaving', region: 'Jaffna', email: 'priya.r@example.com', phone: '+94 75 456 7890', status: 'verified', rating: 4.9, experience: '22 years', bio: 'Carries forward the Jaffna tradition of palmyra weaving.', initials: 'PR', color: '#C65D3B', certifications: ['Northern Province Arts Board'], workshops: 6 },
//     { name: 'Anura Dissanayake', craft: 'Brasswork', region: 'Colombo', email: 'anura.d@example.com', phone: '+94 77 567 8901', status: 'rejected', rating: 4.6, experience: '31 years', bio: 'Master metalsmith specializing in traditional brass vessels.', initials: 'AD', color: '#2F5D50', certifications: [], workshops: 4 },
//     { name: 'Nilmini Senanayake', craft: 'Gem Polishing', region: 'Ratnapura', email: 'nilmini.s@example.com', phone: '+94 71 678 9012', status: 'pending', rating: 4.5, experience: '18 years', bio: 'Expert gem polisher from Ratnapura, the City of Gems.', initials: 'NS', color: '#C9A227', certifications: ['Gem & Jewellery Authority'], workshops: 3 },
//     { name: 'Rohan De Silva', craft: 'Pottery', region: 'Kelaniya', email: 'rohan.ds@example.com', phone: '+94 76 789 0123', status: 'verified', rating: 4.8, experience: '25 years', bio: 'Shapes unglazed earthenware on ancient wheels.', initials: 'RD', color: '#C65D3B', certifications: ['National Crafts Council', 'Heritage Artisan Certificate'], workshops: 10 },
//   ]);
//   console.log(`${artisans.length} Artisans created`);

//   // Tourists
//   const tourists = await _insertMany([
//     { name: 'Sarah Mitchell', email: 'sarah.m@gmail.com', phone: '+1 555 234 5678', country: 'United States', status: 'active', initials: 'SM', color: '#2F5D50', totalBookings: 4, workshopsAttended: [{ workshop: 'Kandyan Lacquerwork', artisan: 'Nimal Perera', date: new Date('2024-01-15'), craft: 'Lacquerwork' }] },
//     { name: 'James Thornton', email: 'j.thornton@outlook.com', phone: '+44 7911 123456', country: 'United Kingdom', status: 'active', initials: 'JT', color: '#C65D3B', totalBookings: 2, workshopsAttended: [] },
//     { name: 'Yuki Tanaka', email: 'yuki.t@yahoo.co.jp', phone: '+81 90 1234 5678', country: 'Japan', status: 'suspended', initials: 'YT', color: '#C9A227', totalBookings: 1, workshopsAttended: [] },
//     { name: 'Marie Dubois', email: 'marie.d@gmail.com', phone: '+33 6 12 34 56 78', country: 'France', status: 'active', initials: 'MD', color: '#2F5D50', totalBookings: 6, workshopsAttended: [] },
//     { name: 'Carlos Rivera', email: 'c.rivera@hotmail.com', phone: '+34 612 345 678', country: 'Spain', status: 'active', initials: 'CR', color: '#C65D3B', totalBookings: 3, workshopsAttended: [] },
//     { name: 'Anna Kowalski', email: 'anna.k@wp.pl', phone: '+48 512 345 678', country: 'Poland', status: 'suspended', initials: 'AK', color: '#C9A227', totalBookings: 0, workshopsAttended: [] },
//     { name: 'David Chen', email: 'david.chen@gmail.com', phone: '+65 9123 4567', country: 'Singapore', status: 'active', initials: 'DC', color: '#2F5D50', totalBookings: 5, workshopsAttended: [] },
//   ]);
//   console.log(`${tourists.length} Tourists created`);

//   // Workshops
//   const workshops = await __insertMany([
//     { name: 'Traditional Batik Textiles Workshop', artisan: 'Kamala Wijesinghe', artisanInitials: 'KW', artisanColor: '#2F5D50', craft: 'Batik Textiles', region: 'Kandy', location: '45 Peradeniya Road, Kandy', capacity: 8, duration: '3 hours', price: 3500, status: 'pending', description: 'Learn the ancient art of batik wax-resist dyeing.', schedule: 'Mon, Wed, Fri - 9:00 AM & 2:00 PM', totalBookings: 0 },
//     { name: 'Kandyan Lacquerwork Masterclass', artisan: 'Nimal Perera', artisanInitials: 'NP', artisanColor: '#C65D3B', craft: 'Lacquerwork', region: 'Kandy', location: '12 Katugastota Lane, Kandy', capacity: 6, duration: '2.5 hours', price: 4200, status: 'approved', description: 'Master the traditional Kandyan lacquerwork technique.', schedule: 'Tue, Thu, Sat - 10:00 AM', totalBookings: 47, rating: 4.9 },
//     { name: 'Ambalangoda Mask Carving Experience', artisan: 'Suresh Fernando', artisanInitials: 'SF', artisanColor: '#C9A227', craft: 'Mask Carving', region: 'Ambalangoda', location: '8 Mask Museum Road, Ambalangoda', capacity: 5, duration: '4 hours', price: 5000, status: 'pending', description: 'Carve and paint your own traditional kolam or sanni mask.', schedule: 'Daily - 9:00 AM & 1:00 PM', totalBookings: 0 },
//     { name: 'Jaffna Palmyra Weaving Workshop', artisan: 'Priya Rajapaksa', artisanInitials: 'PR', artisanColor: '#C65D3B', craft: 'Palmyra Weaving', region: 'Jaffna', location: '23 Nallur Street, Jaffna', capacity: 10, duration: '2 hours', price: 2800, status: 'approved', description: 'Weave traditional palmyra leaf products.', schedule: 'Mon-Sat - 8:00 AM & 3:00 PM', totalBookings: 31, rating: 4.8 },
//     { name: 'Ratnapura Gem Polishing Session', artisan: 'Nilmini Senanayake', artisanInitials: 'NS', artisanColor: '#2F5D50', craft: 'Gem Polishing', region: 'Ratnapura', location: '5 Gem Bazaar, Ratnapura', capacity: 4, duration: '3 hours', price: 6500, status: 'rejected', description: 'Polish and identify precious and semi-precious gems.', schedule: 'Weekdays - 10:00 AM', totalBookings: 0 },
//     { name: 'Kelaniya Pottery & Earthenware', artisan: 'Rohan De Silva', artisanInitials: 'RD', artisanColor: '#C65D3B', craft: 'Pottery', region: 'Kelaniya', location: '17 Temple Road, Kelaniya', capacity: 8, duration: '3 hours', price: 3200, status: 'pending', description: 'Shape clay on ancient wheels and fire traditional unglazed earthenware.', schedule: 'Tue, Thu, Sat - 9:00 AM & 2:00 PM', totalBookings: 0 },
//   ]);
//   console.log(`${workshops.length} Workshops created`);

//   // Bookings
//   await ___insertMany([
//     { workshopId: workshops[1]._id, workshopName: 'Kandyan Lacquerwork Masterclass', craft: 'Lacquerwork', artisan: 'Nimal Perera', artisanColor: '#C65D3B', tourist: 'Sarah Mitchell', touristInitials: 'SM', touristColor: '#2F5D50', country: 'United Kingdom', email: 'sarah.m@gmail.com', phone: '+1 555 234 5678', date: new Date('2024-02-05'), time: '10:00 AM', groupSize: 2, status: 'confirmed', region: 'Kandy' },
//     { workshopId: workshops[3]._id, workshopName: 'Jaffna Palmyra Weaving Workshop', craft: 'Palmyra Weaving', artisan: 'Priya Rajapaksa', artisanColor: '#C65D3B', tourist: 'Marie Dubois', touristInitials: 'MD', touristColor: '#C9A227', country: 'France', email: 'marie.d@gmail.com', phone: '+33 6 12 34 56 78', date: new Date('2024-02-06'), time: '08:00 AM', groupSize: 3, status: 'confirmed', region: 'Jaffna' },
//     { workshopId: workshops[1]._id, workshopName: 'Kandyan Lacquerwork Masterclass', craft: 'Lacquerwork', artisan: 'Nimal Perera', artisanColor: '#C65D3B', tourist: 'David Chen', touristInitials: 'DC', touristColor: '#2F5D50', country: 'Singapore', email: 'david.chen@gmail.com', phone: '+65 9123 4567', date: new Date('2024-02-07'), time: '10:00 AM', groupSize: 1, status: 'confirmed', region: 'Kandy' },
//     { workshopId: workshops[3]._id, workshopName: 'Jaffna Palmyra Weaving Workshop', craft: 'Palmyra Weaving', artisan: 'Priya Rajapaksa', artisanColor: '#C65D3B', tourist: 'James Thornton', touristInitials: 'JT', touristColor: '#C65D3B', country: 'United Kingdom', email: 'j.thornton@outlook.com', phone: '+44 7911 123456', date: new Date('2024-02-08'), time: '03:00 PM', groupSize: 2, status: 'pending', region: 'Jaffna' },
//   ]);
//   console.log('Bookings created');

//   // Reviews
//   await ____insertMany([
//     { touristName: 'Arjun Mehta', touristInitials: 'AM', touristColor: '#C1440E', artisanName: 'Nimal Perera', workshopName: 'Kandyan Lacquerwork Session', rating: 5, text: "An absolutely transformative experience. Nimal's patience and depth of knowledge made this workshop unforgettable.", status: 'active', datePosted: new Date('2025-02-15'), reportCount: 0 },
//     { touristName: 'Sofia Reyes', touristInitials: 'SR', touristColor: '#2F5D50', artisanName: 'Kamala Wijesinghe', workshopName: 'Batik Textile Workshop', rating: 5, text: "I've attended craft workshops in Japan and Morocco, and this was on par with the very best.", status: 'active', datePosted: new Date('2025-01-28'), reportCount: 0 },
//     { touristName: 'Kenji Tanaka', touristInitials: 'KT', touristColor: '#C9A227', artisanName: 'Suresh Fernando', workshopName: 'Mask Carving Workshop', rating: 2, text: 'This workshop was a complete waste of money. The artisan was rude and the materials were cheap. DO NOT BOOK!!!', status: 'flagged', datePosted: new Date('2025-01-10'), flagReason: 'Potentially abusive language', reportCount: 3 },
//     { touristName: 'Priya Nair', touristInitials: 'PN', touristColor: '#1A6B6B', artisanName: 'Priya Rajapaksa', workshopName: 'Palmyra Weaving Class', rating: 5, text: 'Came here as part of a cultural tour and it was the highlight of my entire Sri Lanka trip.', status: 'active', datePosted: new Date('2024-12-22'), reportCount: 0 },
//     { touristName: 'Marcus Weber', touristInitials: 'MW', touristColor: '#6366f1', artisanName: 'Rohan De Silva', workshopName: 'Clay & Wheel Pottery', rating: 1, text: 'Spam content promoting external website.', status: 'removed', datePosted: new Date('2024-12-10'), flagReason: 'Spam / promotional content', reportCount: 7 },
//     { touristName: 'Emma Thompson', touristInitials: 'ET', touristColor: '#2F5D50', artisanName: 'Nimal Perera', workshopName: 'Kandyan Lacquerwork Session', rating: 4, text: 'Very good workshop overall. The technique is fascinating and Nimal explains each step clearly.', status: 'active', datePosted: new Date('2024-11-15'), reportCount: 0 },
//   ]);
//   console.log('Reviews created');

//   // Activity logs
//   await _____insertMany([
//     { type: 'register', user: 'Rohan De Silva', initials: 'RD', color: '#2F5D50', description: 'New artisan registration', page: '/register' },
//     { type: 'booking', user: 'Sarah Mitchell', initials: 'SM', color: '#C9A227', description: 'Workshop booking confirmed: Batik Workshop', page: '/book' },
//     { type: 'verify', user: 'Kamala Wijesinghe', initials: 'KW', color: '#2F5D50', description: 'Artisan verified', page: '/admin/artisan-verification' },
//     { type: 'suspend', user: 'Yuki Tanaka', initials: 'YT', color: '#C65D3B', description: 'Tourist account suspended', page: '/admin/tourist-management' },
//     { type: 'listing', user: 'Galle Lace Center', initials: 'GL', color: '#C9A227', description: 'New workshop listing submitted', page: '/admin/workshop-verification' },
//     { type: 'reject', user: 'Anura Dissanayake', initials: 'AD', color: '#C65D3B', description: 'Verification rejected', page: '/admin/artisan-verification' },
//   ]);
//   console.log('Activity logs created');

//   console.log('\nDatabase seeded successfully!');
//   console.log(`Admin email: ${process.env.ADMIN_SEED_EMAIL || 'admin@lankacraft.lk'}`);
//   console.log(`Admin password: ${process.env.ADMIN_SEED_PASSWORD || 'Admin@1234'}`);
//   await disconnect();
// }

// seed().catch((err) => { console.error(err); process.exit(1); });
