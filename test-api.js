import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  fullname: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

let authToken = '';

// Test functions
async function testHealthCheck() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', response.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
}

async function testRegister() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, testUser);
    authToken = response.data.data.token;
    console.log('✅ Registration passed:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Registration failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testLogin() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    authToken = response.data.data.token;
    console.log('✅ Login passed:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testCreateTodo() {
  try {
    const response = await axios.post(`${BASE_URL}/todos`, {
      title: 'Test Todo',
      content: 'This is a test todo item'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Create todo passed:', response.data.message);
    return response.data.data._id;
  } catch (error) {
    console.log('❌ Create todo failed:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testGetTodos() {
  try {
    const response = await axios.get(`${BASE_URL}/todos`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get todos passed:', `Found ${response.data.count} todos`);
    return true;
  } catch (error) {
    console.log('❌ Get todos failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testUpdateTodo(todoId) {
  try {
    const response = await axios.put(`${BASE_URL}/todos/${todoId}`, {
      title: 'Updated Test Todo',
      status: 'completed'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Update todo passed:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Update todo failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testDeleteTodo(todoId) {
  try {
    const response = await axios.delete(`${BASE_URL}/todos/${todoId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Delete todo passed:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Delete todo failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetProfile() {
  try {
    const response = await axios.get(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get profile passed:', response.data.data.fullname);
    return true;
  } catch (error) {
    console.log('❌ Get profile failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  await testHealthCheck();
  console.log('');
  
  const registered = await testRegister();
  console.log('');
  
  if (!registered) {
    await testLogin();
    console.log('');
  }
  
  const todoId = await testCreateTodo();
  console.log('');
  
  await testGetTodos();
  console.log('');
  
  if (todoId) {
    await testUpdateTodo(todoId);
    console.log('');
    
    await testDeleteTodo(todoId);
    console.log('');
  }
  
  await testGetProfile();
  console.log('');
  
  console.log('🏁 API tests completed!');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export {
  testHealthCheck,
  testRegister,
  testLogin,
  testCreateTodo,
  testGetTodos,
  testUpdateTodo,
  testDeleteTodo,
  testGetProfile
};
