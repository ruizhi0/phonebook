const totalArgv = process.argv.length;

for (let i = 0; i < totalArgv; i++) {
  console.log(i, process.argv[i]);
}
