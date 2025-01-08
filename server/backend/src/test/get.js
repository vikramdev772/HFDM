fetch('http://localhost:3000/api/patients', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiZW1haWwiOiJob3NwaXRhbF9tYW5hZ2VyQHh5ei5jb20iLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTczNjM1MDYxNiwiZXhwIjoxNzM2NDM3MDE2fQ.O56bGz9iom4gQSSvPI9f7koZqLshthFuVNhyKHVtVbE'
    }
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log('Error:', error));
  


  