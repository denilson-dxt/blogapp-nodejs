function changeSlug(event){
    let slug = document.getElementById("slug")
    let str = event.target.value.toLowerCase()
   
    str.split(" ").forEach(char=>{
        str = str.replace(" ", "-")
    })
    slug.value = str
}