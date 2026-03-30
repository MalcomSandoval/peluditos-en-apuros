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
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/['"]http:\/\/localhost:5000([^'"]*)['"]/g, '`${import.meta.env.VITE_API_URL}$1`');
  content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${import.meta.env.VITE_API_URL}$1`');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed', file);
});
