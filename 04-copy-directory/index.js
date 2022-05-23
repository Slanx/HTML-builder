const { mkdir, copyFile, readdir, rm } = require('fs/promises');
const path = require('path');

const filesPath = path.join(__dirname, 'files');
const dirCopyPath = path.join(__dirname, 'files-copy');

async function copyDir(filesPath, copyFilesPath) {
  try {
    await rm(copyFilesPath, { force: true, recursive: true });
    await mkdir(copyFilesPath, { recursive: true });
    const filesFromSourse = await readdir(filesPath, { withFileTypes: true });
    for (const file of filesFromSourse) {
      if (file.isFile()) {
        await copyFile(path.join(filesPath, file.name), path.join(copyFilesPath, file.name));
      }
    }
  } catch (error) {
    console.error(error);
  }
}

copyDir(filesPath, dirCopyPath);
