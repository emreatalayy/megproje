const app = require("./src/app");

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`MEG Mimarlık → http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\nPort ${PORT} zaten kullanımda (muhtemelen önceki "npm run dev" hâlâ açık).\n` +
        `  • Eski süreci kapat: Get-NetTCPConnection -LocalPort ${PORT} | % { Stop-Process -Id $_.OwningProcess -Force }\n` +
        `  • Veya farklı port:  $env:PORT=3001; npm run dev\n`
    );
    process.exit(1);
  }
  throw err;
});
