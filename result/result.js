//selection of elements that are used 
const score = localStorage.getItem('finalScore')
const finalScore = document.querySelector('#finalScore')
const finalImg = document.querySelector('#finalImg')
const finalMsg = document.querySelector('#finalMsg')
const finalTitle = document.querySelector('#finalTitle')
const loader = document.querySelector(".loader")

//event listener that onload show the img of the question and hidde the loader
finalImg.addEventListener('load',()=>{
    loader.style.display ='none'
    finalImg.style.display ='block'
})

//request the information from the API and pass it two the showResult function
const getResult = ()=>{
    fetch('https://proto.io/en/jobs/candidate-exercise/result.json')
    .then(res=>res.json())
    .then(data=> showResult(data))
}

//depending on the score, populates with the data from the API the information that is going to be shown in the final page.
const showResult = (results)=>{
    if(score>= 0 && score <= 33){
        finalTitle.innerText =results.results[0].title
        finalScore.innerText = `Your score is ${score}%`
        finalImg.src = results.results[0].img
        finalMsg.innerText = results.results[0].message
    }
    if(score>= 34 && score <= 66){
        finalTitle.innerText =results.results[1].title
        finalScore.innerText = `You score ${score}%`
        finalImg.src = results.results[1].img
        finalMsg.innerText = results.results[1].message
    }
    if(score>= 67 && score <= 100){
        finalTitle.innerText =results.results[2].title
        finalScore.innerText = `You score ${score}%`
        finalImg.src = results.results[2].img
        finalMsg.innerText = results.results[2].message
    }
}