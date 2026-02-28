const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const Author = require('./models/authorModel');
const Category = require('./models/categoryModel');
const Book = require('./models/bookModel');

dotenv.config({ path: path.join(__dirname, '.env') });

// ── Helper: upsert by name (returns the doc) ─────────────────────────────────
const upsertCategory = async (data) => {
  return Category.findOneAndUpdate(
    { name: data.name },
    { $setOnInsert: data },
    { upsert: true, new: true }
  );
};

const upsertAuthor = async (data) => {
  return Author.findOneAndUpdate(
    { name: data.name },
    { $setOnInsert: data },
    { upsert: true, new: true }
  );
};

const upsertBook = async (data) => {
  return Book.findOneAndUpdate(
    { name: data.name },
    { $setOnInsert: data },
    { upsert: true, new: true }
  );
};

const seed = async () => {
  await mongoose.connect(process.env.DATABASE_URI);
  console.log('✅ Connected to DB');

  // ── Categories (12) ──────────────────────────────────────────────────────────
  const catData = [
    { name: 'horror' },
    { name: 'romance' },
    { name: 'science' },
    { name: 'fantasy' },
    { name: 'thriller' },
    { name: 'mystery' },
    { name: 'biography' },
    { name: 'history' },
    { name: 'self-help' },
    { name: 'adventure' },
    { name: 'dystopia' },
    { name: 'philosophy' },
  ];

  const cats = {};
  for (const c of catData) {
    cats[c.name] = await upsertCategory(c);
  }
  console.log(`✅ Categories ready (${catData.length})`);

  // ── Authors (12) ───────────────────────────────────────────────────────────
  const authorData = [
    { name: 'Stephen King', bio: 'Master of the horror genre' },
    { name: 'John Green', bio: 'Young adult romance writer' },
    { name: 'Bill Bryson', bio: 'Science and travel writer' },
    { name: 'J.R.R Tolkien', bio: 'Father of modern fantasy' },
    { name: 'Gillian Flynn', bio: 'Psychological thriller writer' },
    { name: 'Agatha Christie', bio: 'The Queen of Mystery' },
    { name: 'Walter Isaacson', bio: 'Celebrated biographer' },
    { name: 'Yuval Noah Harari', bio: 'Historian and futurist' },
    { name: 'James Clear', bio: 'Self-improvement and habits expert' },
    { name: 'George Orwell', bio: 'Political and dystopian fiction writer' },
    { name: 'Arthur Conan Doyle', bio: 'Creator of Sherlock Holmes' },
    { name: 'Mark Manson', bio: 'Modern self-help author' },
  ];

  const auths = {};
  for (const a of authorData) {
    auths[a.name] = await upsertAuthor(a);
  }
  console.log(`✅ Authors ready (${authorData.length})`);

  // ── Books (35) ────────────────────────────────────────────────────────────
  // Using real Cloudinary-hosted covers for a polished look
  const books = [
    // ── Stephen King / horror
    { name: 'The Shining', cover: 'https://covers.openlibrary.org/b/id/8231856-L.jpg', price: 19.99, stock: 10, author: auths['Stephen King']._id, category: cats['horror']._id },
    { name: 'It Novel', cover: 'https://covers.openlibrary.org/b/id/7984916-L.jpg', price: 24.99, stock: 7, author: auths['Stephen King']._id, category: cats['horror']._id },
    { name: 'Misery', cover: 'https://covers.openlibrary.org/b/id/8739161-L.jpg', price: 17.99, stock: 5, author: auths['Stephen King']._id, category: cats['horror']._id },
    { name: 'Pet Sematary', cover: 'https://covers.openlibrary.org/b/id/8261614-L.jpg', price: 18.99, stock: 8, author: auths['Stephen King']._id, category: cats['horror']._id },
    // ── John Green / romance
    { name: 'Fault In Stars', cover: 'https://covers.openlibrary.org/b/id/7898938-L.jpg', price: 14.99, stock: 5, author: auths['John Green']._id, category: cats['romance']._id },
    { name: 'Looking For Alaska', cover: 'https://covers.openlibrary.org/b/id/7984396-L.jpg', price: 12.99, stock: 8, author: auths['John Green']._id, category: cats['romance']._id },
    { name: 'Paper Towns', cover: 'https://covers.openlibrary.org/b/id/8224451-L.jpg', price: 13.99, stock: 6, author: auths['John Green']._id, category: cats['romance']._id },
    // ── Bill Bryson / science
    { name: 'A Short History', cover: 'https://covers.openlibrary.org/b/id/8108478-L.jpg', price: 22.99, stock: 6, author: auths['Bill Bryson']._id, category: cats['science']._id },
    { name: 'The Body Electric', cover: 'https://covers.openlibrary.org/b/id/8739141-L.jpg', price: 18.99, stock: 4, author: auths['Bill Bryson']._id, category: cats['science']._id },
    { name: 'In Sunburned Country', cover: 'https://covers.openlibrary.org/b/id/8255044-L.jpg', price: 16.99, stock: 9, author: auths['Bill Bryson']._id, category: cats['adventure']._id },
    // ── Tolkien / fantasy
    { name: 'The Fellowship', cover: 'https://covers.openlibrary.org/b/id/8743157-L.jpg', price: 29.99, stock: 12, author: auths['J.R.R Tolkien']._id, category: cats['fantasy']._id },
    { name: 'The Two Towers', cover: 'https://covers.openlibrary.org/b/id/8743100-L.jpg', price: 29.99, stock: 9, author: auths['J.R.R Tolkien']._id, category: cats['fantasy']._id },
    { name: 'Return of the King', cover: 'https://covers.openlibrary.org/b/id/8743093-L.jpg', price: 29.99, stock: 11, author: auths['J.R.R Tolkien']._id, category: cats['fantasy']._id },
    // ── Gillian Flynn / thriller
    { name: 'Gone Girl', cover: 'https://covers.openlibrary.org/b/id/8261565-L.jpg', price: 16.99, stock: 15, author: auths['Gillian Flynn']._id, category: cats['thriller']._id },
    { name: 'Dark Places', cover: 'https://covers.openlibrary.org/b/id/8254991-L.jpg', price: 15.99, stock: 11, author: auths['Gillian Flynn']._id, category: cats['thriller']._id },
    { name: 'Sharp Objects', cover: 'https://covers.openlibrary.org/b/id/8224263-L.jpg', price: 14.99, stock: 7, author: auths['Gillian Flynn']._id, category: cats['thriller']._id },
    // ── Agatha Christie / mystery
    { name: 'Murder on Orient', cover: 'https://covers.openlibrary.org/b/id/8224517-L.jpg', price: 11.99, stock: 20, author: auths['Agatha Christie']._id, category: cats['mystery']._id },
    { name: 'And Then None', cover: 'https://covers.openlibrary.org/b/id/8109086-L.jpg', price: 11.99, stock: 18, author: auths['Agatha Christie']._id, category: cats['mystery']._id },
    { name: 'The ABC Murders', cover: 'https://covers.openlibrary.org/b/id/8271166-L.jpg', price: 10.99, stock: 14, author: auths['Agatha Christie']._id, category: cats['mystery']._id },
    // ── Walter Isaacson / biography
    { name: 'Steve Jobs', cover: 'https://covers.openlibrary.org/b/id/8261616-L.jpg', price: 26.99, stock: 9, author: auths['Walter Isaacson']._id, category: cats['biography']._id },
    { name: 'Leonardo da Vinci', cover: 'https://covers.openlibrary.org/b/id/8894817-L.jpg', price: 28.99, stock: 7, author: auths['Walter Isaacson']._id, category: cats['biography']._id },
    // ── Yuval Noah Harari / history
    { name: 'Sapiens', cover: 'https://covers.openlibrary.org/b/id/8739181-L.jpg', price: 21.99, stock: 16, author: auths['Yuval Noah Harari']._id, category: cats['history']._id },
    { name: 'Homo Deus', cover: 'https://covers.openlibrary.org/b/id/8224557-L.jpg', price: 22.99, stock: 10, author: auths['Yuval Noah Harari']._id, category: cats['history']._id },
    { name: '21 Lessons', cover: 'https://covers.openlibrary.org/b/id/8894963-L.jpg', price: 20.99, stock: 8, author: auths['Yuval Noah Harari']._id, category: cats['self-help']._id },
    // ── James Clear / self-help
    { name: 'Atomic Habits', cover: 'https://covers.openlibrary.org/b/id/10110415-L.jpg', price: 18.99, stock: 25, author: auths['James Clear']._id, category: cats['self-help']._id },
    // ── George Orwell / dystopia
    { name: 'Nineteen Eighty-Four', cover: 'https://covers.openlibrary.org/b/id/8743174-L.jpg', price: 13.99, stock: 30, author: auths['George Orwell']._id, category: cats['dystopia']._id },
    { name: 'Animal Farm', cover: 'https://covers.openlibrary.org/b/id/8739164-L.jpg', price: 10.99, stock: 22, author: auths['George Orwell']._id, category: cats['dystopia']._id },
    // ── Arthur Conan Doyle / mystery
    { name: 'Hound Baskervilles', cover: 'https://covers.openlibrary.org/b/id/8224472-L.jpg', price: 12.99, stock: 13, author: auths['Arthur Conan Doyle']._id, category: cats['mystery']._id },
    { name: 'A Study in Scarlet', cover: 'https://covers.openlibrary.org/b/id/7984557-L.jpg', price: 11.99, stock: 11, author: auths['Arthur Conan Doyle']._id, category: cats['mystery']._id },
    // ── Mark Manson / self-help / philosophy
    { name: 'The Subtle Art', cover: 'https://covers.openlibrary.org/b/id/8224582-L.jpg', price: 16.99, stock: 20, author: auths['Mark Manson']._id, category: cats['self-help']._id },
    { name: 'Everything Is Fckd', cover: 'https://covers.openlibrary.org/b/id/9255234-L.jpg', price: 17.99, stock: 12, author: auths['Mark Manson']._id, category: cats['philosophy']._id },
  ];

  let inserted = 0;
  let skipped = 0;
  for (const b of books) {
    const existing = await Book.findOne({ name: b.name });
    if (existing) { skipped++; continue; }
    await Book.create(b);
    inserted++;
  }

  console.log(`✅ Books done — ${inserted} inserted, ${skipped} already existed`);

  // ── Reviews ────────────────────────────────────────────────────────────────
  // Use real users + books from DB — no hard-coded IDs needed
  const Review = require('./models/reviewModel');
  const User = require('./models/userModel');

  const users = await User.find({}).limit(10).select('_id');
  if (users.length === 0) {
    console.log('⚠️  No users found — skipping review seed. Register at least one user first.');
    process.exit(0);
  }

  // Pick up to 20 books
  const booksForReview = await Book.find({}).limit(20).select('_id name');

  const reviewTemplates = [
    { rating: 5, comment: 'Absolutely loved it!' },
    { rating: 5, comment: 'One of the best books I have read.' },
    { rating: 4, comment: 'Really good, highly recommend.' },
    { rating: 4, comment: 'Great read, engaging from start.' },
    { rating: 3, comment: 'Decent book, a bit slow at times.' },
    { rating: 3, comment: 'Average experience overall.' },
    { rating: 2, comment: 'Did not meet my expectations.' },
    { rating: 5, comment: 'A masterpiece, truly unforgettable.' },
    { rating: 4, comment: 'Enjoyed every chapter!' },
    { rating: 5, comment: 'Could not put it down!' },
  ];

  let reviewsInserted = 0;
  let reviewsSkipped = 0;

  for (const book of booksForReview) {
    // Give each book 2–5 reviews from different users
    const reviewCount = 2 + Math.floor(Math.random() * 4);
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5).slice(0, reviewCount);

    for (const user of shuffledUsers) {
      const alreadyExists = await Review.findOne({ book: book._id, user: user._id });
      if (alreadyExists) { reviewsSkipped++; continue; }

      const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
      await Review.create({ book: book._id, user: user._id, rating: template.rating, comment: template.comment });
      reviewsInserted++;
    }
  }

  console.log(`✅ Reviews done — ${reviewsInserted} inserted, ${reviewsSkipped} already existed`);
  console.log('🎉 Seed complete!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});