import { Routes } from "tabnews.js"

/** @param {import("tabnews.js").Client} client*/
export default async function fetchChildren(client, author, slug){
    const children = await client.REST.get(Routes.contentChildren(author, slug))

    return children
}