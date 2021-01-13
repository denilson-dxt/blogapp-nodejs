
function showComentAnswers(coment){
    
    let coment_answers_div = document.getElementById(coment, event )
    let answers_div = document.getElementById(`answers${coment}`, event )
    if (coment_answers_div.style.display == "" || coment_answers_div.style.display == "none"){
        coment_answers_div.style.display = "flex"
        event.target.innerHTML = "Esconder respostas"

        fetch(`http://localhost:8081/post/coments/object/${coment}/answers`, {
        method: "GET",
        "Content-Type": "application/json"
    })
    .then(res=>res.json())
    .then(res=>{
        console.log(res)
        answers_div.innerHTML = ""
        coment_answers_div.children[1].innerHTML = ""
        answerForm(coment_answers_div.children[1],coment)

        placeAnswer(answers_div, res)
        //coment_answers_div.children[1].innerHTML = ""
        console.log(coment_answers_div.children)

      
    })
    }else{
        coment_answers_div.style.display = "none"
        event.target.innerHTML = "ver respostas"
    }
}

function placeAnswer(answers_div, data){
    data.forEach(answer => {
        let answer_div = document.createElement("div")
        answer_div.className = "coment"
        answers_div.appendChild(answer_div)

        let user_div = document.createElement("div")
        user_div.className = "user"
        answer_div.appendChild(user_div)

        let avatar = document.createElement("img")
        avatar.src = "/images/diary2.jpg"
        user_div.appendChild(avatar)

        let username_span = document.createElement("span")
        username_span.innerHTML = `${answer.user.username} respondeu:`
        user_div.appendChild(username_span)

        //coment content
        let coment_content_div = document.createElement("div")
        coment_content_div.className = "coment-content"
        coment_content_div.innerHTML = answer.content
        answer_div.appendChild(coment_content_div)

    });
}


function placeComent(coments_div, data){
    data.forEach(coment => {
        let coment_div = document.createElement("div")
        coment_div.className = "coment"
        coments_div.appendChild(coment_div)

        let user_div = document.createElement("div")
        user_div.className = "user"
        coment_div.appendChild(user_div)

        let avatar = document.createElement("img")
        avatar.src = "/images/diary2.jpg"
        user_div.appendChild(avatar)

        let username_span = document.createElement("span")
        username_span.innerHTML = `${coment.user.username} disse:`
        user_div.appendChild(username_span)

        //coment content
        let coment_content_div = document.createElement("div")
        coment_content_div.className = "coment-content"
        coment_content_div.innerHTML = coment.content
        coment_div.appendChild(coment_content_div)

        let answers_div = document.createElement("div")
        answers_div.className = "coment-answers"
        answers_div.id = coment.coment._id
        coment_div.appendChild(answers_div)

        let btn_see_answers = document.createElement("button")
        btn_see_answers.className = "link-btn-style"
        btn_see_answers.innerHTML = "Ver respostas"
        btn_see_answers.onclick = (event)=>{
            showComentAnswers(`${coment.coment._id}`)
        }
        coment_div.appendChild(btn_see_answers)

    });
}


function answerForm(coment_div, coment_id){
    //Answer form
    let answer_form = document.createElement("form")
    answer_form.className = "new-coment"
    
    coment_div.appendChild(answer_form)
    
    let lbl_answer = document.createElement("label")
    lbl_answer.innerHTML = "Deixe uma resposta"
    answer_form.appendChild(lbl_answer)

    let textarea = document.createElement("textarea")
    textarea.name = "content"
    textarea.placeholder = "Escreva sua resposta aqui"
    answer_form.appendChild(textarea)

    let send_input = document.createElement("input")
    send_input.type = "submit"
    send_input.value = "Enviar resposta"
    send_input.className = "link-btn-style"
    answer_form.appendChild(send_input)

    answer_form.onsubmit = (event)=>{
        console.log({answer: textarea.value, coment: coment_id})
        fetch(`/post/coments/object/${coment_id}/answer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({answer: textarea.value})
        })
            .then(data=>data.json())
            .then(data=>{
                console.log(data)
                if (data.status){
                    placeAnswer(document.getElementById(`answers${coment_id}`), [data.data])
                    textarea.value = ""
                }
                })
        event.preventDefault()
    }
}

function sendComent(event, post){
    //alert(event)
    let coment = document.getElementById("coment-textarea")
    let coments_div = document.getElementById("coments")
    fetch("/post/coments/new-coment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({content: coment.value, post: post})
    })
    .then(data=>data.json())
    .then(data=>{
        console.log(data)
        if (data.status){
            placeComent(coments_div, [data.data])
            coment.value = ""
        }
    })
    event.preventDefault()
}

function search(event){
    let search_textarea = document.getElementById("search-textarea")
    event.target.action = `/post/search/keyword=${search_textarea.value}/results`
}


function vote(vote_type, post, emoji){
    console.log(emoji)
    let emojis = document.getElementsByClassName("classification-value")
    for (let i=0; i<3; i++){
        emojis[i].style.display = "block"
    }
    fetch(`/post/object/${post}/vote`, {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({post: post, vote_type: vote_type})
    })
        .then(res=>res.json())
        .then(res=>{
            console.log(res.post)
            emojis[0].innerHTML = res.post.verry_good_votes
            emojis[1].innerHTML = res.post.usefull_votes
            emojis[2].innerHTML = res.post.bad_votes
        })
}

function teste(){
    
}

