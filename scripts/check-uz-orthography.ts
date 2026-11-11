import fs from "fs";
import path from "path";

const uzLocalePath = path.resolve(__dirname, "../apps/web/src/locales/uz.json");
const content = fs.readFileSync(uzLocalePath, "utf-8");

const forbiddenChars = [
  { char: "'", name: "ASCII apostrophe" },
  { char: "‘", name: "Left single quote U+2018" },
  { char: "’", name: "Right single quote U+2019" },
  { char: "`", name: "Backtick" },
];

let errors = 0;
for (const f of forbiddenChars) {
  const matches = content.split(f.char).length - 1;
  if (matches > 0) {
    console.error(`Found ${matches} forbidden characters: ${f.name} in uz.json`);
    errors++;
  }
}

if (errors > 0) {
  console.error("FAIL: Uz orthography check failed! Use ʻ (U+02BB) and ʼ (U+02BC) exclusively.");
  process.exit(1);
} else {
  console.log("PASS: Uzbek orthography check passed perfectly! (ʻ and ʼ correctly used).");
}