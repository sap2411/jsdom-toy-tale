let addToy = false;
let EDITED_TOY = null;
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection")
  const form = document.getElementsByClassName("add-toy-form")[0]
  const likeButtons = document.querySelectorAll(".like-btn")
  function createToys(toys) {
    toys.forEach((toy) => {
      makeToyCard(toy)
    })
  }
  function makeToyCard(toy) {
    let div = document.createElement('div')
    div.className = "card"
    let name = document.createElement('h2')
    name.innerText = toy.name
    let image = document.createElement('img')
    image.src = toy.image
    image.className = "toy-avatar"
    let like = document.createElement('p')
    like.innerText = `Likes: ${toy.likes}`
    like.id = `like_${toy.id}`
    let button = document.createElement('button')
    button.className = "like-btn"
    button.innerText = "Like <3"
    button.id = `${toy.id}`
    addListenerToButton(button)
    div.appendChild(name)
    div.appendChild(image)
    div.appendChild(like)
    div.appendChild(button)
    toyCollection.appendChild(div)
  }
  function getToys() {
    fetch("http://localhost:3000/toys")
    .then(resp => resp.json())
    .then(json => createToys(json))
  }
  function addListenerToButton(button) {
    console.log("adding listener")
    button.addEventListener('click', (event) => {
      console.log("listener fired!!!")
      editLikes(event)
    })
  }
  function editLikes(event) {
    let toy = event.target.id
    // console.log(event)
    let likes = event.target.parentNode.querySelector("p").textContent.split(" ")[1]
    let newLike = parseInt(likes)
    let newNewLike = newLike + 1
    const data = {
      "likes": newNewLike
    }
    console.log(newNewLike)
    const configObj = {
      method: "PATCH",
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json' 
      },
      body: JSON.stringify(data)
    }
    fetch(`http://localhost:3000/toys/${toy}`, configObj)
    .then(resp => resp.json())
    .then(json => {
      console.log(json)
      document.getElementById(`like_${toy}`).innerText = `Likes: ${parseInt(json.likes)}`
    })
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    let name = event.target.name.value
    event.target.name.value = ""
    debugger
    let img = event.target.image.value
    event.target.image.value = ""
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "name": name,
        "image": img,
        "likes": 0
      })
    })
    .then(resp => resp.json())
    .then(json => makeToyCard(json))
  })
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  getToys()
});
