require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Lesson = require('./models/Lesson');
const Testimonial = require('./models/Testimonial');

const config = require("./config/config")

const seedData = async () => {
    try {
        await mongoose.connect(config.mongoURI);
        console.log('✅ Connected to MongoDB');

        await User.deleteMany({});
        await Lesson.deleteMany({});
        await Testimonial.deleteMany({});
        console.log('🗑️  Cleared existing data');

        const coach = await User.create({
            name: 'Daniil Khitrou',
            email: 'khitroudaniil@gmail.com',
            bio: 'Professional tennis coach with 10 years of experience. Specializing in advanced techniques and match strategy.',
            ntrpRating: 5.5,
            yearsExperience: 10,
            specialties: ['Serve technique', 'Match strategy', 'Mental game'],
            role: 'admin',
            password: "admin1234"
        });

        console.log('✅ Created coach:', coach.name);

        const lessons = await Lesson.insertMany([
            {
                title: 'Beginner Single Lesson',
                description: 'Learn the basics of tennis including proper grip, stance, footwork, and fundamental strokes. Perfect for those new to the game!',
                duration: 60,
                price: 100,
                level: 'Beginner',
                maxStudents: 1,
                coach: coach._id,
            },
            {
                title: 'Beginner Group Session',
                description: 'A fun, social introduction to tennis. Practice foundational skills alongside other beginners in a supportive group environment.',
                duration: 60,
                price: 100,
                priceLabel: '/h per person',
                level: 'Beginner',
                maxStudents: 4,
                coach: coach._id,
            },
            {
                title: 'Intermediate Single Lesson',
                description: 'Develop tactical awareness and strategic thinking for competitive matches. Learn to read your opponent and adjust your game.',
                duration: 60,
                price: 120,
                level: 'Intermediate',
                maxStudents: 1,
                coach: coach._id,
            },
            {
                title: 'Intermediate Drill Session',
                description: 'High-repetition drills designed to build consistency and muscle memory across all strokes. Ideal for players looking to sharpen their technique.',
                duration: 120,
                price: 55,
                priceLabel: '/h per person',
                level: 'Intermediate',
                minStudents: 3,
                maxStudents: 3,
                coach: coach._id,
            },
            {
                title: 'Advanced Private Coaching',
                description: 'One-on-one coaching focused on refining advanced technique, footwork, and match strategy to elevate your competitive game.',
                duration: 60,
                price: 135,
                level: 'Advanced',
                maxStudents: 1,
                coach: coach._id,
            },
            {
                title: 'Advanced Match Play',
                description: 'Simulate real match conditions with guided play, tactical analysis, and in-session feedback to sharpen your competitive edge.',
                duration: 90,
                price: 135,
                priceLabel: '/h per person',
                level: 'Advanced',
                maxStudents: 2,
                coach: coach._id,
            },
        ]);

        console.log(`✅ Created ${lessons.length} lessons`);

        const Booking = require('./models/Booking');
        await Booking.deleteMany({});

        const sampleBookings = [
            { studentName: 'Alex Dill', studentEmail: 'alex@example.com', lesson: lessons[2]._id, amount: 135, totalSessions: 8, ntrp: 4.5 },
            { studentName: 'Gemma Sun', studentEmail: 'gemma@example.com', lesson: lessons[1]._id, amount: 120, totalSessions: 6, ntrp: 3.5 },
            { studentName: 'Jordan Smith', studentEmail: 'jordan@example.com', lesson: lessons[2]._id, amount: 135, totalSessions: 5, ntrp: 4.0 },
            { studentName: 'Taylor Brown', studentEmail: 'taylor@example.com', lesson: lessons[0]._id, amount: 100, totalSessions: 4, ntrp: 2.5 },
            { studentName: 'Casey Miller', studentEmail: 'casey@example.com', lesson: lessons[1]._id, amount: 120, totalSessions: 2, ntrp: 3.0 },
        ];

        for (const s of sampleBookings) {
            for (let i = 0; i < s.totalSessions; i++) {
                await Booking.create({
                    lesson: s.lesson,
                    studentName: s.studentName,
                    studentEmail: s.studentEmail,
                    paymentMethod: 'zelle',
                    paymentStatus: 'paid',
                    amount: s.amount,
                    studentNtrp: s.ntrp,
                });
            }
        }

        console.log('✅ Created sample bookings for rankings');

        await Testimonial.insertMany([
            { name: 'Sarah Johnson', role: 'Intermediate Player', initials: 'SJ', rating: 5, text: 'Daniil transformed my game completely! His patient teaching style and attention to detail helped me improve my serve by 40%. Highly recommend!' },
            { name: 'Michael Chen', role: 'Advanced Player', initials: 'MC', rating: 5, text: "Best tennis coach I've ever had. The strategic approach to match play has taken my game to the next level. Worth every penny!" },
            { name: 'Emily Rodriguez', role: 'Beginner', initials: 'ER', rating: 5, text: 'As a beginner, I was nervous about starting tennis. Daniil made me feel comfortable from day one. Now I play twice a week and love it!' },
        ]);
        console.log('✅ Created testimonials');

        console.log('🎉 Database seeded successfully!');

        // process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

module.exports = seedData;



// seedData();