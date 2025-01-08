const fetch = require('node-fetch');

// Login request
async function login() {
  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'hospital_manager@xyz.com',
      password: 'Password@2025',
    }),
  });

  const data = await response.json();
  return data.token; // Returning the token from the login response
}

// Patient creation request
async function createPatient(token) {
  const response = await fetch('http://localhost:3000/api/patients', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test Patient',
      roomNumber: '401',
      bedNumber: 'C',
      floorNumber: '4',
      age: 35,
      gender: 'Male',
      contactInfo: '+1234567890',
      emergencyContact: '+9876543210',
      diseases: ['Asthma'],
      allergies: ['Dust'],
    }),
  });

  const data = await response.json();
  console.log('Patient Creation Response:', data);
}

(async () => {
  try {
    // First login to get the token
    const token = await login();
    console.log('Login Successful. Token:', token);

    // Then create a patient using the token
    await createPatient(token);
  } catch (error) {
    console.error('Error:', error);
  }
})();


// npm install node-fetch

// curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d "{\"email\":\"hospital_manager@xyz.com\",\"password\":\"Password@2025\"}"

// curl -X POST http://localhost:3000/api/patients -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJob3NwaXRhbF9tYW5hZ2VyQHh5ei5jb20iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTczNjM1MTMwOSwiZXhwIjoxNzM2NDM3NzA5fQ._KY1MNFovRbpPPwfcU5B07cNunp903ZQN4tfpoOp5qU" -H "Content-Type: application/json" -d "{\"name\":\"Test Patient\",\"roomNumber\":\"401\",\"bedNumber\":\"C\",\"floorNumber\":\"4\",\"age\":35,\"gender\":\"Male\",\"contactInfo\":\"+1234567890\",\"emergencyContact\":\"+9876543210\",\"diseases\":[\"Asthma\"],\"allergies\":[\"Dust\"]}"


