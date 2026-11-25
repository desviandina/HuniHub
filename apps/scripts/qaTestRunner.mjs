import * as authService from '../services/authService.js';
import * as listingService from '../services/listingService.js';
import * as rentalService from '../services/rentalService.js';
import { ROLES } from '../constants/roles.js';
import { PROPERTY_CATEGORIES, AVAILABILITY_STATUS, RENTAL_STATUS } from '../constants/listing.js';

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failedCount++;
  }
}

async function runQATests() {
  console.log('====================================================');
  console.log('   HUNIHUB QA & FUNCTIONAL AUTOMATED TEST SUITE    ');
  console.log('====================================================\n');

  // ----------------------------------------------------
  // TEST GROUP 1: Registration & Email Validation
  // ----------------------------------------------------
  console.log('--- TEST GROUP 1: Registration & Validation ---');

  // Test 1.1: Invalid Email Rejection
  try {
    await authService.registerWithEmail({
      name: 'Tester',
      email: 'not-an-email',
      password: 'password123',
    });
    assert(false, 'Reject malformed email (missing @ and domain)');
  } catch (err) {
    assert(err.message.includes('Format email tidak valid'), 'Reject malformed email: ' + err.message);
  }

  // Test 1.2: Short Password Rejection
  try {
    await authService.registerWithEmail({
      name: 'Tester',
      email: 'valid@hunihub.test',
      password: '123',
    });
    assert(false, 'Reject short password (< 6 chars)');
  } catch (err) {
    assert(err.message.includes('minimal'), 'Reject short password: ' + err.message);
  }

  // Test 1.3: Empty Name Rejection
  try {
    await authService.registerWithEmail({
      name: '',
      email: 'valid2@hunihub.test',
      password: 'password123',
    });
    assert(false, 'Reject empty name');
  } catch (err) {
    assert(err.message.includes('Nama lengkap wajib diisi'), 'Reject empty name: ' + err.message);
  }

  // ----------------------------------------------------
  // TEST SCENARIO A: Account A Lifecycle & Mode Switching
  // ----------------------------------------------------
  console.log('\n--- TEST SCENARIO A: Account A ---');
  const emailA = `user_a_${Date.now()}@hunihub.test`;
  const passA = 'passwordA123';
  const nameA = 'Mitra Pemilik A';

  // 1. Register Account A
  const sessionA1 = await authService.registerWithEmail({
    name: nameA,
    email: emailA,
    password: passA,
    initialMode: ROLES.SEEKER,
  });
  assert(sessionA1 && sessionA1.uid && sessionA1.email === emailA, 'Account A registered successfully with UID: ' + sessionA1.uid);

  // 2. Prevent duplicate email registration
  try {
    await authService.registerWithEmail({
      name: 'Duplicate A',
      email: emailA,
      password: 'differentPassword',
    });
    assert(false, 'Prevent duplicate email registration');
  } catch (err) {
    assert(err.message.includes('sudah terdaftar'), 'Prevent duplicate email: ' + err.message);
  }

  // 3. Log in with Account A
  const loggedInA = await authService.loginWithEmail({ email: emailA, password: passA });
  assert(loggedInA.uid === sessionA1.uid, 'Account A logged in with identical UID');
  assert(loggedInA.activeMode === ROLES.SEEKER, 'Account A initial mode is Pencari Hunian');

  // 4. Switch Account A to Pemilik Hunian mode (seamless switching without logout)
  const switchedA1 = await authService.switchMode(loggedInA, ROLES.OWNER);
  assert(switchedA1.activeMode === ROLES.OWNER && switchedA1.uid === loggedInA.uid, 'Account A switched to Pemilik Hunian (same UID maintained)');

  // 5. Account A adds Property A1 (Kost)
  const propA1 = await listingService.createListing({
    title: 'Kost Mahasiswa A1 Teuku Umar',
    type: PROPERTY_CATEGORIES.KOST,
    price: 600000,
    rentalDuration: 'bulan',
    location: 'Jl. Alue Peunyareng, Meureubo, Aceh Barat',
    ownerId: loggedInA.uid,
    ownerName: loggedInA.name,
    availabilityStatus: AVAILABILITY_STATUS.AVAILABLE,
  });
  assert(propA1 && propA1.id && propA1.ownerId === loggedInA.uid, 'Account A created Property A1 (Kost) with ownerId: ' + propA1.ownerId);

  // 6. Account A adds Property A2 (Homestay)
  const propA2 = await listingService.createListing({
    title: 'Homestay Nyaman A2 Johan Pahlawan',
    type: PROPERTY_CATEGORIES.HOMESTAY,
    price: 400000,
    rentalDuration: 'hari',
    location: 'Jl. Manek Roo, Meulaboh, Aceh Barat',
    ownerId: loggedInA.uid,
    ownerName: loggedInA.name,
    availabilityStatus: AVAILABILITY_STATUS.AVAILABLE,
  });
  assert(propA2 && propA2.id && propA2.ownerId === loggedInA.uid, 'Account A created Property A2 (Homestay)');

  // 7. Verify Account A sees exactly Property A1 and A2 in Owner Dashboard
  const ownerListingsA = await listingService.getListingsByOwner(loggedInA.uid);
  assert(ownerListingsA.length === 2, 'Account A owner dashboard retrieves exactly 2 owned properties');
  assert(ownerListingsA.every(p => p.ownerId === loggedInA.uid), 'All listings retrieved belong strictly to Account A');

  // 8. Switch Account A back to Pencari Hunian mode
  const switchedA2 = await authService.switchMode(switchedA1, ROLES.SEEKER);
  assert(switchedA2.activeMode === ROLES.SEEKER && switchedA2.uid === loggedInA.uid, 'Account A switched back to Pencari Hunian mode (session intact)');

  // ----------------------------------------------------
  // TEST SCENARIO B: Account B Lifecycle & Property B1
  // ----------------------------------------------------
  console.log('\n--- TEST SCENARIO B: Account B ---');
  const emailB = `user_b_${Date.now()}@hunihub.test`;
  const passB = 'passwordB123';
  const nameB = 'Keluarga Budi';

  // 1. Register Account B
  const sessionB1 = await authService.registerWithEmail({
    name: nameB,
    email: emailB,
    password: passB,
    initialMode: ROLES.OWNER,
  });
  assert(sessionB1 && sessionB1.uid && sessionB1.uid !== loggedInA.uid, 'Account B registered with distinct UID: ' + sessionB1.uid);

  // 2. Log in with Account B
  const loggedInB = await authService.loginWithEmail({ email: emailB, password: passB });
  assert(loggedInB.uid === sessionB1.uid, 'Account B logged in successfully');

  // 3. Verify Account B starts with 0 properties (Empty State)
  const initialListingsB = await listingService.getListingsByOwner(loggedInB.uid);
  assert(initialListingsB.length === 0, 'Account B has 0 initial properties (Empty State: "Anda Belum Memiliki Hunian")');

  // 4. Account B adds Property B1 (Sewa Rumah)
  const propB1 = await listingService.createListing({
    title: 'Sewa Rumah Keluarga B1 Suak Ribee',
    type: PROPERTY_CATEGORIES.SEWA_RUMAH,
    price: 2500000,
    rentalDuration: 'bulan',
    location: 'Jl. Suak Ribee, Johan Pahlawan, Aceh Barat',
    ownerId: loggedInB.uid,
    ownerName: loggedInB.name,
    availabilityStatus: AVAILABILITY_STATUS.AVAILABLE,
  });
  assert(propB1 && propB1.id && propB1.ownerId === loggedInB.uid, 'Account B created Property B1 (Sewa Rumah)');

  // 5. Verify Account B owner dashboard shows strictly Property B1
  const ownerListingsB = await listingService.getListingsByOwner(loggedInB.uid);
  assert(ownerListingsB.length === 1 && ownerListingsB[0].id === propB1.id, 'Account B owner dashboard displays ONLY Property B1');

  // ----------------------------------------------------
  // TEST GROUP 3: Data Isolation & Ownership Protection
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 3: Data Isolation & Ownership Protection ---');

  // Account A tries to edit Property B1 (must fail)
  try {
    await listingService.updateListing(propB1.id, { title: 'Hacked title by A' }, loggedInA.uid);
    assert(false, 'Account A unauthorized edit of Property B1');
  } catch (err) {
    assert(err.message.includes('Akses ditolak'), 'Account A prevented from editing Property B1: ' + err.message);
  }

  // Account A tries to delete Property B1 (must fail)
  try {
    await listingService.deleteListing(propB1.id, loggedInA.uid);
    assert(false, 'Account A unauthorized delete of Property B1');
  } catch (err) {
    assert(err.message.includes('Akses ditolak'), 'Account A prevented from deleting Property B1: ' + err.message);
  }

  // Account B tries to delete Property A1 (must fail)
  try {
    await listingService.deleteListing(propA1.id, loggedInB.uid);
    assert(false, 'Account B unauthorized delete of Property A1');
  } catch (err) {
    assert(err.message.includes('Akses ditolak'), 'Account B prevented from deleting Property A1: ' + err.message);
  }

  // Both accounts can browse all published properties in Seeker mode
  const allSeekerListings = await listingService.searchListings({});
  const hasA1 = allSeekerListings.some(l => l.id === propA1.id);
  const hasA2 = allSeekerListings.some(l => l.id === propA2.id);
  const hasB1 = allSeekerListings.some(l => l.id === propB1.id);
  assert(hasA1 && hasA2 && hasB1, 'Seeker mode browses all published properties from all owners (A1, A2, and B1 present)');

  // ----------------------------------------------------
  // TEST GROUP 4: Property Category Validation
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 4: Property Category Validation ---');

  // Reject unsupported property category (e.g. 'apartemen', 'villa')
  try {
    await listingService.createListing({
      title: 'Invalid Villa',
      type: 'villa',
      price: 1000000,
      ownerId: loggedInA.uid,
    });
    assert(false, 'Reject unsupported category');
  } catch (err) {
    assert(err.message.includes('Kategori hunian tidak valid'), 'Rejects non-allowed category: ' + err.message);
  }

  // ----------------------------------------------------
  // TEST GROUP 5: Rental Application Workflow
  // ----------------------------------------------------
  console.log('\n--- TEST GROUP 5: Rental Application Workflow ---');

  // Account B cannot apply to rent own property B1
  try {
    await rentalService.createRentalRequest({
      listingId: propB1.id,
      seekerId: loggedInB.uid,
      seekerName: loggedInB.name,
      startDate: '2026-12-01',
      endDate: '2027-01-01',
      durationDays: 31,
      totalPrice: 2500000,
    });
    assert(false, 'Owner cannot rent own property');
  } catch (err) {
    assert(err.message.includes('pemilik hunian ini'), 'Disallow owner renting own property: ' + err.message);
  }

  // Account A submits rental application for Property B1
  const reqAtoB1 = await rentalService.createRentalRequest({
    listingId: propB1.id,
    seekerId: loggedInA.uid,
    seekerName: loggedInA.name,
    startDate: '2026-12-01',
    endDate: '2027-01-01',
    durationDays: 31,
    totalPrice: 2500000,
  });
  assert(reqAtoB1 && reqAtoB1.id && reqAtoB1.status === RENTAL_STATUS.PENDING, 'Account A submitted rental request for Property B1 (Status: Menunggu)');

  // Account A tries to submit a duplicate pending request for Property B1
  try {
    await rentalService.createRentalRequest({
      listingId: propB1.id,
      seekerId: loggedInA.uid,
      seekerName: loggedInA.name,
      startDate: '2026-12-05',
      endDate: '2027-01-05',
      durationDays: 31,
      totalPrice: 2500000,
    });
    assert(false, 'Reject duplicate pending request');
  } catch (err) {
    assert(err.message.includes('menunggu konfirmasi'), 'Prevent duplicate pending application: ' + err.message);
  }

  // Account B checks rental requests (must receive application from A)
  const ownerRequestsB = await rentalService.getRequestsByOwner(loggedInB.uid);
  const foundReq = ownerRequestsB.find(r => r.id === reqAtoB1.id);
  assert(foundReq && foundReq.seekerId === loggedInA.uid, 'Account B received rental request for Property B1 from Account A');

  // Account A checks rental history (only sees applications submitted by A)
  const seekerHistoryA = await rentalService.getRequestsBySeeker(loggedInA.uid);
  assert(seekerHistoryA.some(r => r.id === reqAtoB1.id), 'Account A sees application in rental history');
  assert(seekerHistoryA.every(r => r.seekerId === loggedInA.uid), 'Rental history isolated strictly to Account A');

  // Account B approves the rental application
  await rentalService.updateRequestStatus(reqAtoB1.id, RENTAL_STATUS.ACCEPTED, loggedInB.uid);
  const updatedReq = await rentalService.getRequestById(reqAtoB1.id);
  assert(updatedReq.status === RENTAL_STATUS.ACCEPTED, 'Account B approved application (Status: Disetujui)');

  // Account A checks updated status
  const refreshedHistoryA = await rentalService.getRequestsBySeeker(loggedInA.uid);
  const approvedItem = refreshedHistoryA.find(r => r.id === reqAtoB1.id);
  assert(approvedItem.status === RENTAL_STATUS.ACCEPTED, 'Account A sees updated status "Disetujui" in rental history');

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`   TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED   `);
  console.log('====================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runQATests().catch(err => {
  console.error('Fatal error during QA tests:', err);
  process.exit(1);
});
