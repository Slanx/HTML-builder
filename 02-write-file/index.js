const fs = require('fs');
const path = require('path');
const readline = require('readline');

const writebleStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

process.stdout.write('Введите текст' + '\n');

rl.on('line', (line) => {
  if (line.trim().toLowerCase() === 'exit') {
    rl.close();
  } else {
    writebleStream.write(line);
  }
});

rl.on('close', () => {
  console.log('Goodbye');
});

rl.on('error', (error) => console.log('Error', error.message));
