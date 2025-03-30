const express = require('express');
const connectDB = require('./connection');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
const MedicineOrder = require('./models/MedicineOrder');
const HospitalBed = require('./models/HospitalBed');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Route to create a new user
app.post('/api/users', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Server-side validation
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (phone.length < 10) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to create a new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { fullName, email, phone, department, date, time, message } = req.body;

    // Server-side validation
    if (!fullName || !email || !phone || !department || !date || !time) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (phone.length < 10) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to handle login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to create a new medicine order
app.post('/api/medicine-orders', async (req, res) => {
  try {
    const { address, specialInstructions, cart } = req.body;
    console.log("Received order data:", { address, specialInstructions, cart });
    if (!address || !cart || cart.length === 0) {
      return res.status(400).json({ message: 'Address and cart are required' });
    }
    const order = new MedicineOrder({ address, specialInstructions, cart });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Medicine Order Error:", error);
    res.status(500).json({ message: 'Failed to store order in the database', error: error.message });
  }
});

// Route to create a new hospital bed booking
app.post('/api/hospital-beds', async (req, res) => {
  try {
    const { location, bedType, date } = req.body;
    const booking = new HospitalBed({ location, bedType, date });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));