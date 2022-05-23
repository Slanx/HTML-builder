const { readdir, stat } = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

async function checkFile(dirPath) {
  try {
    const files = await readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(dirPath, file.name);
        const { name: fileName, ext: fileExt } = path.parse(filePath);
        const size = (await stat(filePath)).size;
        console.log(`${fileName} - ${fileExt.split('.')[1]} - ${size}kb `);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

checkFile(dirPath);
