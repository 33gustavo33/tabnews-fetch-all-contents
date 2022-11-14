const USER_EMAIL = ""
const USER_PASSWORD = ""
const DELAY = 140;
const DOMAIN = "https://www.tabnews.com.br/"

import tabnews from "tabnews.js"
import {getNumberOfPages, fetchChildren} from "./lib/index.js"
import fs from "fs"
import ora from "ora"

const client = new tabnews.Client({
    tabnewsUrl: DOMAIN
})

const sleep = (ms) => new Promise((r)=>setTimeout(r, ms))
const numberOfPages = await getNumberOfPages(DOMAIN)
const approximateNumberOfContents = numberOfPages * 30 - 15
const allContents = []

client.on("ready", user => {
    console.log(`> Logado na conta de ${user.username} (${user.email}:${user.tabcoins})`)
})

console.log("> Logando na conta")
await client.login({
    email: USER_EMAIL,
    password: USER_PASSWORD
})

console.log(`> Numero de paginas: ${numberOfPages} páginas`)
console.log(`> Numero aproximado de conteúdos: ${approximateNumberOfContents} conteúdos`)

const spinner = ora({
    text: `Baixando conteúdos (Atualmente na pagina 1) (${(allContents.length / approximateNumberOfContents) * 100}% Baixado)`,
    spinner: "material"    
})

spinner.start()

async function fetchPage(pageNumber){
    const contents = await client.contents.getContents("new", pageNumber)

    let index = 0;
    for(const content of contents){
        index++

        const contentFetched = await client.contents.get(content.owner.username, content.slug)
        const rawContentData = contentFetched.getRaw()

        rawContentData.page = pageNumber
        rawContentData.number = (pageNumber-1) * 30 + index
        rawContentData.children = await fetchChildren(client, content.owner.username, content.slug)

        allContents.push(rawContentData)
        await sleep(DELAY)
    }

    return
}

for (let index = 1; index <= numberOfPages; index++) {
    await fetchPage(index)
    spinner.text = `Baixando conteúdos (Atualmente na pagina ${index}) (${(allContents.length / approximateNumberOfContents) * 100}% Baixado)`
}

spinner.succeed("Conteúdos baixados!")

console.log(`> Todos os ${allContents.length} conteúdos foram obtidos.`)
console.log("> Salvando no arquivo data.json")

save()

async function save(){
    fs.writeFile("./data.json", JSON.stringify(allContents), async (err) => {
        if(err){
            console.log("> Erro enquanto os dados eram salvos no arquivo data.json, tentando novamente em 1.5 segundo")
            await sleep(1500)
            return save()
        }
        console.log("> Os dados foram salvos no arquivo data.json, aproveite-eles!")
    })
}