const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/AdminDashboard.jsx',
  'src/pages/AdoptionForm.jsx',
  'src/pages/AnimalGallery.jsx',
  'src/pages/Home.jsx',
  'src/pages/Register.jsx',
  'src/pages/Login.jsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Reemplazar patron 'http://localhost:5000' o "http://localhost:5000" o `http://localhost:5000...`
  // We need to carefully replace just the root url with ${import.meta.env.VITE_API_URL} AND change the quotes to backticks if they are ' or ".
  
  // First, find all axios calls. We can just regex replace "http://localhost:5000" -> `${import.meta.env.VITE_API_URL}`
  // But if the original string was 'http://localhost:5000/api/animals', it becomes '`${import.meta.env.VITE_API_URL}/api/animals`' which is invalid.
  // So we must change the enclosing quotes to backticks.
  
  content = content.replace(/['"]http:\/\/localhost:5000([^'"]*)['"]/g, '`${import.meta.env.VITE_API_URL}$1`');
  
  // What if it was already in backticks like `http://localhost:5000/api/animals/${id}`?
  content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${import.meta.env.VITE_API_URL}$1`');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed', file);
});
