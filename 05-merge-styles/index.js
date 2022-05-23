const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');

async function mergeStyle() {
  try {
    const filesPath = path.join(__dirname, 'styles');
    const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
    const filesFromSourse = await readdir(filesPath);

    for (const file of filesFromSourse) {
      if (path.parse(file).ext === '.css') {
        const input = fs.createReadStream(path.join(filesPath, file), 'utf-8');
        input.on('data', (data) => output.write(data + '\n'));
      }
    }
  } catch (error) {
    console.error(error);
  }
}

mergeStyle();
