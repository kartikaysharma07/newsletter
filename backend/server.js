const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const { error } = await supabase
      .from('newsletter')
      .insert([{ email }]);

    if (error) {
      throw new Error(error.message || 'Failed to subscribe');
    }

    return res.status(200).json({
      message: 'Thanks for joining the waitlist! Check your email for confirmation.',
    });
  } catch (error) {
    console.error('Supabase error:', error.message);
    return res.status(500).json({
      error: 'Something went wrong. Please try again later.',
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});