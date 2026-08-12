const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // GET /businesses
  if (method === "GET" && url === "/businesses") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        message: "Businesses endpoint",
      })
    );

    return;
  }

  // Route not found
  res.writeHead(404, {
    "Content-Type": "application/json",
  });

  res.end(
    JSON.stringify({
      message: "Route not found",
    })
  );
});

server.listen(PORT, () => {
  console.log(`QueueLess server running on http://localhost:${PORT}`);
});