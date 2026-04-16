const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5001/api/register', {
      name: "Test User",
      email: "testuser999@test.com",
      password: "password123"
    });
    console.log("Register Success:", res.data);
  } catch (err) {
    console.log("Register Error:", err.response ? err.response.data : err.message);
  }

  try {
    const res = await axios.post('http://localhost:5001/api/login', {
      email: "testuser999@test.com",
      password: "password123"
    });
    console.log("Login Success:", res.data);
  } catch (err) {
    console.log("Login Error:", err.response ? err.response.data : err.message);
  }
}

test();
