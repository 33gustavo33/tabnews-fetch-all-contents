import fetch from "node-fetch"

export default async function getNumberOfPages(DOMAIN){
    const response = await fetch(DOMAIN+"api/v1/contents?strategy=new")
    const lastPageInfo = parseLinkHeader(response.headers.get("Link"))

    return lastPageInfo.page

    function parseLinkHeader(header){
        const lastPageUrl = header.split(",")[2].split(";")[0]
        const cleanLastPageUrl = lastPageUrl.substring(1, lastPageUrl.length-1)

        return parseQuerystring(cleanLastPageUrl.split("?")[1])
    }

    function parseQuerystring(querystring){
        const result = {}

        for(const querystringDefinition of querystring.split("&")){
            const [key, value] = querystringDefinition.split("=")
            result[key] = value
        }

        return result
    }
}