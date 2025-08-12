import axios from 'axios';

async function testRegistration() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      fullname: 'Test User',
      email: 'newuser' + Date.now() + '@example.com',
      password: 'password123'
    });
    console.log('✅ Registration successful:', response.data);
  } catch (error) {
    console.log('❌ Registration failed:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Error:', error.response?.data?.error);
    console.log('Full response:', error.response?.data);
  }
}

testRegistration();
