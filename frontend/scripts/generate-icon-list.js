const fs = require("fs");
const path = require("path");

const iconsDir = path.join(__dirname, "../src/assets/icons");
const icons = fs.readdirSync(iconsDir).map((file) => {
  return {
    name: file.replace(".png", ""),
    path: `assets/icons/${file}`,
  };
});

fs.writeFileSync(
  path.join(__dirname, "../src/assets/icons.json"),
  JSON.stringify(icons)
);
