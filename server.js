const express = require("express");
const apiRoutes = require("./routes/apiRoutes.js");
const htmlRoutes = require("./routes/htmlRoutes");

// Initialize app and set the port
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data, and for routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api", apiRoutes);
app.use("/", htmlRoutes);

// Start the server on the specified port
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
