const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const Author = require('./models/authorModel');
const Category = require('./models/categoryModel');
const Book = require('./models/bookModel');

dotenv.config({ path: path.join(__dirname, '.env') });

const seed = async () => {
  await mongoose.connect(process.env.DATABASE_URI);
  console.log('Connected to DB');

  // Clean existing data
  await Author.deleteMany();
  await Category.deleteMany();
  await Book.deleteMany();
  console.log('Cleared existing data');

  // Create 5 categories
  const categories = await Category.insertMany([
    { name: 'horror' },
    { name: 'romance' },
    { name: 'science' },
    { name: 'fantasy' },
    { name: 'thriller' },
  ]);

  console.log('Categories seeded');

  // Create 5 authors
  const authors = await Author.insertMany([
    { name: 'Stephen King', bio: 'Master of the horror genre' },
    { name: 'John Green', bio: 'Young adult romance writer' },
    { name: 'Bill Bryson', bio: 'Science and travel writer' },
    { name: 'J.R.R Tolkien', bio: 'Father of modern fantasy' },
    { name: 'Gillian Flynn', bio: 'Psychological thriller writer' },
  ]);

  console.log('Authors seeded');

  // Create 10 books
  await Book.insertMany([
    {
      name: 'The Shining',
      cover: 'https://via.placeholder.com/150',
      price: 19.99,
      stock: 10,
      author: authors[0]._id,   // Stephen King
      category: categories[0]._id, // horror
    },
    {
      name: 'It Novel',
      cover: 'https://via.placeholder.com/150',
      price: 24.99,
      stock: 7,
      author: authors[0]._id,   // Stephen King
      category: categories[0]._id, // horror
    },
    {
      name: 'Fault In Stars',
      cover: 'https://via.placeholder.com/150',
      price: 14.99,
      stock: 5,
      author: authors[1]._id,   // John Green
      category: categories[1]._id, // romance
    },
    {
      name: 'Looking For Alaska',
      cover: 'https://via.placeholder.com/150',
      price: 12.99,
      stock: 8,
      author: authors[1]._id,   // John Green
      category: categories[1]._id, // romance
    },
    {
      name: 'A Short History',
      cover: 'https://via.placeholder.com/150',
      price: 22.99,
      stock: 6,
      author: authors[2]._id,   // Bill Bryson
      category: categories[2]._id, // science
    },
    {
      name: 'The Body Electric',
      cover: 'https://via.placeholder.com/150',
      price: 18.99,
      stock: 4,
      author: authors[2]._id,   // Bill Bryson
      category: categories[2]._id, // science
    },
    {
      name: 'The Fellowship',
      cover: 'https://via.placeholder.com/150',
      price: 29.99,
      stock: 12,
      author: authors[3]._id,   // Tolkien
      category: categories[3]._id, // fantasy
    },
    {
      name: 'The Two Towers',
      cover: 'https://via.placeholder.com/150',
      price: 29.99,
      stock: 9,
      author: authors[3]._id,   // Tolkien
      category: categories[3]._id, // fantasy
    },
    {
      name: 'Gone Girl',
      cover: 'https://via.placeholder.com/150',
      price: 16.99,
      stock: 15,
      author: authors[4]._id,   // Gillian Flynn
      category: categories[4]._id, // thriller
    },
    {
      name: 'Dark Places',
      cover: 'https://via.placeholder.com/150',
      price: 15.99,
      stock: 11,
      author: authors[4]._id,   // Gillian Flynn
      category: categories[4]._id, // thriller
    },
  ]);

  console.log('Books seeded');
  console.log('✅ All seed data inserted successfully!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});