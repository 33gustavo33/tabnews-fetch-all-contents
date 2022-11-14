import fs from "fs"

const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"))

fs.writeFileSync("./data2.json", JSON.stringify(data, null, "\t"))

console.log("Confira o arquivo data2.json")