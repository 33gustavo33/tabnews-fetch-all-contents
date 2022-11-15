const USER_EMAIL = ""
const USER_PASSWORD = ""
const DELAY = 140;
const DOMAIN = "https://www.tabnews.com.br/"

import tabnews from "tabnews.js"
import {getAllUsernames} from "./lib/index.js"
import fs from "fs"
import ora from "ora"
import contents from "./data.json" assert {type: "json"}

const client = new tabnews.Client({
    tabnewsUrl: DOMAIN
})

console.log(`> Conteúdos carregados (${contents.length} conteúdos), buscando todos os usernames.`)
const sleep = (ms) => new Promise((r)=>setTimeout(r, ms))
const allUsernames = await getAllUsernames(contents)
const allUsers = []
console.log(`> Todos os usernames relevantes foram descobertos (${allUsernames.length} usernames)`)

client.on("ready", user => {
    console.log(`> Logado na conta de ${user.username} (${user.email}:${user.tabcoins} tabcoins)`)
})

console.log("> Logando na conta")
await client.login({
    email: USER_EMAIL,
    password: USER_PASSWORD
})

const spinner = ora({
    text: `Baixando usuários (${(allUsers.length / allUsernames.length) * 100}% Baixado)`,
    spinner: "material"    
})

spinner.start()

for(const username of allUsernames){
    const user = await client.users.get(username)
    allUsers.push(user.getRaw())

    spinner.text = `Baixando usuários (${(allUsers.length / allUsernames.length) * 100}% Baixado)`

    await sleep(DELAY)
}

spinner.succeed("Usuários baixados!")

console.log(`> Todos os ${allUsers.length} usuários foram obtidos.`)
console.log("> Salvando no arquivo data-users.json")

save()

async function save(){
    fs.writeFile("./data-users.json", JSON.stringify(allUsers), async (err) => {
        if(err){
            console.log("> Erro enquanto os dados eram salvos no arquivo data-users.json, tentando novamente em 1.5 segundo")
            await sleep(1500)
            return save()
        }
        console.log("> Os dados foram salvos no arquivo data-users.json, aproveite-eles!")
    })
}