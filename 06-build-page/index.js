const path = require('path');
const fs = require('fs');
const { mkdir, copyFile, readdir, rm, readFile, writeFile } = require('fs/promises');

const pathProjectDist = path.join(__dirname, 'project-dist');

const pathAssets = path.join(__dirname, 'assets');
const pathStyles = path.join(__dirname, 'styles');
const pathComponents = path.join(__dirname, 'components');
const pathHtml = path.join(__dirname, 'template.html');
const pathNewAssets = path.join(__dirname, 'project-dist', 'assets');

async function createDir(path) {
  try {
    await mkdir(path, { recursive: true });
  } catch (error) {
    console.log(error);
  }
}

async function createFile(path, content) {
  await writeFile(path, content);
}

async function copyDir(filesPath, copyFilesPath) {
  try {
    await rm(copyFilesPath, { force: true, recursive: true, maxRetries: 100 });
    await mkdir(copyFilesPath, { recursive: true });
    const filesFromSourse = await readdir(filesPath, { withFileTypes: true });
    for (const file of filesFromSourse) {
      if (file.isFile()) {
        await copyFile(path.join(filesPath, file.name), path.join(copyFilesPath, file.name));
      } else {
        await copyDir(path.join(filesPath, file.name), path.join(copyFilesPath, file.name));
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function mergeStyle(pathStyles, pathBundle) {
  try {
    const output = fs.createWriteStream(path.join(pathBundle, 'style.css'));
    const filesFromSourse = await readdir(pathStyles);
    for (const file of filesFromSourse) {
      if (path.parse(file).ext === '.css') {
        const input = fs.createReadStream(path.join(pathStyles, file), 'utf-8');
        input.on('data', (data) => output.write(data + '\n'));
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function componentCreate(pathComponents, pathHtml, pathDist) {
  try {
    let inputTemplate = await readFile(pathHtml);
    let strTemplate = inputTemplate.toString();

    const filesFromSourse = await readdir(pathComponents);

    for (const file of filesFromSourse) {
      const { name, ext } = path.parse(file);
      if (ext === '.html') {
        let input = await readFile(path.join(pathComponents, file));
        let strInput = input.toString();

        strTemplate = strTemplate.replace(`{{${name}}}`, strInput);
      }
    }
    createFile(path.join(pathDist, 'index.html'), strTemplate);
  } catch (error) {
    console.log(error);
  }
}

createDir(pathProjectDist);
copyDir(pathAssets, pathNewAssets);
mergeStyle(pathStyles, pathProjectDist);
componentCreate(pathComponents, pathHtml, pathProjectDist);
