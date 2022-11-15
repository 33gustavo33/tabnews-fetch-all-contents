export default async function getAllUsernames(data){
    const result = []

    for(const content of data){
        getUsernameOfContent(content)
    }

    return result

    function getUsernameOfContent(content){
        if(!result.includes(content.owner_username)){
            result.push(content.owner_username)
        }
        for(const childContent of content.children){
            getUsernameOfContent(childContent)
        }
    }
}