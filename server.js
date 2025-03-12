const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_API_KEY = "your-api-key-here";  // cannot add API key due to security reasons add your own api key to access chatbot//

mongoose.connect('mongodb://localhost:27017/collegeDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// 📌 User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['student', 'faculty', 'admin'], required: true }
});
const User = mongoose.model('User', UserSchema);

// 📌 Student Registration Schema
const StudentSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    usn: { type: String, required: true, unique: true }
});
const Student = mongoose.model('Student', StudentSchema);

// 📌 Student Grade Submission Schema
const StudentGradeSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    usn: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
const StudentGrade = mongoose.model('StudentGrade', StudentGradeSchema);

// 📌 User Login
app.post('/login', async (req, res) => {
    try {
        let { email, password, role } = req.body;
        email = email.trim();
        role = role.trim().toLowerCase();

        console.log(`🔍 Login attempt: Email=${email}, Role=${role}`);

        const user = await User.findOne({ email });
        console.log("🔍 User found:", user);

        if (!user) return res.status(400).json({ message: "❌ Invalid email or role" });

        if (user.role !== role) {
            console.log("❌ Role mismatch");
            return res.status(400).json({ message: "❌ Invalid role" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔍 Password Match:", isMatch);

        if (!isMatch) return res.status(400).json({ message: "❌ Invalid password" });

        const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey', { expiresIn: '1d' });

        res.json({ message: "✅ Login successful", token });

    } catch (error) {
        console.error("❌ Error in login:", error);
        res.status(500).json({ message: "❌ Server error" });
    }
});

// 📌 Register Student ID & USN
app.post('/register-student', async (req, res) => {
    try {
        const { studentId, usn } = req.body;

        if (!studentId || !usn) {
            return res.status(400).json({ message: "❌ Student ID and USN are required" });
        }

        const newStudent = new Student({ studentId, usn });
        await newStudent.save();

        res.status(200).json({ message: "✅ Student registered successfully!" });

    } catch (error) {
        console.error("❌ Error in student registration:", error);
        res.status(500).json({ message: "❌ Server error" });
    }
});

// 📌 Submit Student ID & USN (Fixed Validation)
app.post('/submit-grade', async (req, res) => {
    try {
        let { studentId, usn } = req.body;

        console.log(`🔍 Checking Student ID: ${studentId}, USN: ${usn}`);

        if (!studentId || !usn) {
            return res.status(400).json({ message: "❌ Student ID and USN are required" });
        }

        // ✅ Normalize Input Data (remove spaces, enforce uppercase USN)
        studentId = studentId.trim();
        usn = usn.trim().toUpperCase();

        // ✅ Check if student exists (Case-Insensitive Match)
        const studentExists = await Student.findOne({
            studentId: { $regex: `^${studentId}$`, $options: "i" }, 
            usn: { $regex: `^${usn}$`, $options: "i" }
        });

        if (!studentExists) {
            console.log("❌ Invalid Student ID or USN (No match in DB)");
            return res.status(400).json({ message: "❌ Invalid Student ID or USN" });
        }

        // ✅ Save Student ID & USN to `StudentGrade` Collection
        const newStudentGrade = new StudentGrade({ studentId, usn });
        await newStudentGrade.save();

        console.log("✅ Student details verified and stored!");
        res.status(200).json({ message: "✅ Student details verified and submitted!" });

    } catch (error) {
        console.error("❌ Error in submitting student details:", error);
        res.status(500).json({ message: "❌ Server error" });
    }
});

// 📌 Fetch All Submitted Grades
app.get('/get-grades', async (req, res) => {
    try {
        const grades = await StudentGrade.find();
        res.status(200).json(grades);
    } catch (error) {
        console.error("❌ Error fetching grades:", error);
        res.status(500).json({ message: "❌ Server error" });
    }
});

// 📌 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
