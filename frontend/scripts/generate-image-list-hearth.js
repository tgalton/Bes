const fs = require("fs");
const path = require("path");

const imagesDir = path.join(__dirname, "../src/assets/hearth-images");
const images = fs.readdirSync(imagesDir).map((file) => {
  return {
    name: file.replace(".png", ""),
    path: `assets/hearth-images/${file}`,
  };
});

fs.writeFileSync(
  path.join(__dirname, "../src/assets/hearth-images.json"),
  JSON.stringify(images)
);
