console.log("MovieWatchlist Project")
import { v4 as uuidv4 } from "https://jspm.dev/uuid"

const searchInput = document.getElementById("search")
const sidebarTwo = document.getElementById("sidebar-two")
const movies = document.getElementById("movies")
const htwoOfMovies = document.getElementById("htwo-of-movies")

document.addEventListener("click", function (e) {
  // console.log(e.target.id)
  // console.log(e.target.dataset)
  if (e.target.id === "search-btn") {
    if (searchInput.value === "") {
      console.log("empty")
    } else {
      handleClick(searchInput.value)
      searchInput.value = ""
    }
  } else if (e.target.dataset.movies) {
    const imdbIDmovie = e.target.dataset.movies
    hanldeAddClick(imdbIDmovie)
  } else if (e.target.id === "watchlist-btn-site") {
    filterLocalStorage()
  } else if (e.target.dataset.moviestoremove) {
    deleteFilterLocalStorage(e.target.dataset.moviestoremove)
  }
})

const sidebar2Arr = []

async function getSideBarOnStart() {
  const resp = await fetch(`https://www.omdbapi.com/?apikey=40cffa7f&t=The+Boys`)
  const data = await resp.json()
  sidebar2Arr.push(data)

  const resp2 = await fetch(`https://www.omdbapi.com/?apikey=40cffa7f&t=Dune:+Part+Two`)
  const data2 = await resp2.json()
  sidebar2Arr.push(data2)

  const resp3 = await fetch(`https://www.omdbapi.com/?apikey=40cffa7f&t=Shōgun`)
  const data3 = await resp3.json()
  sidebar2Arr.push(data3)

  renderSideBarOnStart()
}

getSideBarOnStart()

const renderSideBarOnStart = () => {
  const postArr = sidebar2Arr
    .map(item => {
      return `
        <div class="movie-container w-full h-32">
            <img class="sidebar-movie-poster" src="${item.Poster}" alt="">
            <div class="movie-container-text">
                <p class="sidebar-movie-title">${item.Title}</p>
                <p class="sidebar-movie-genre">${item.Genre}</p>
                <p class="sidebar-movie-actors">${item.Actors}</p>
            </div>
        </div>
        `
    })
    .join("")
  sidebarTwo.innerHTML = postArr
}

async function handleClick(item) {
  const resp = await fetch(`https://www.omdbapi.com/?apikey=40cffa7f&s=${item}`)
  const data = await resp.json()

  if (data.Response === "True") {
    render(data)
  } else {
    htwoOfMovies.textContent = "Unable to find what you’re looking for. Please try another search."
    const moiveSearchHideId = document.getElementById("moive-search-hide-id")
    if (moiveSearchHideId.classList.contains("moive-search-hide")) {
      moiveSearchHideId.classList.toggle("moive-search-hide")
    }
  }
}

const render = async item => {
  console.log(item)
  const moviesArr = item.Search
  const postArr = await Promise.all(
    moviesArr.map(async objects => {
      let description = await movieDescription(objects.imdbID)
      if (objects.Poster === "N/A") {
        objects.Poster = "https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
      }
      if (description === "N/A") {
        description = "We cant find description for this movie, sorry!"
      }
      htwoOfMovies.textContent = `Your search results for: ${searchInput.value}`
      const movieRender = `
  <div class="search-container bg-slate-200 w-full h-60" data-movies="${objects.imdbID}">
      <img class="search-movie-poster" src="${objects.Poster}" alt="">
      <button class="bg-fg-500 watchlist-btn text-fg-50" data-movies="${objects.imdbID}"><i class="fa-solid fa-plus"></i>  Add to watchlist</button>
      <div class="search-container-text">
          <p class="search-movie-title">${objects.Title}</p>
          <p class="search-movie-genre">${objects.Type} ${objects.Year}</p>
          <p class="search-movie-description">${description}</p>
      </div>
  </div>
  `
      return movieRender
    })
  )
  movies.innerHTML = postArr.join("")

  const moiveSearchHideId = document.getElementById("moive-search-hide-id")
  if (moiveSearchHideId.classList.contains("moive-search-hide")) {
    moiveSearchHideId.classList.toggle("moive-search-hide")
  }
}

async function movieDescription(item) {
  const resp = await fetch(`https://www.omdbapi.com/?apikey=40cffa7f&i=${item}`)
  const data = await resp.json()
  let plot = data.Plot
  return plot
}

let verifyImdbIds = []
let verifyUniqs = []

const hanldeAddClick = item => {
  localStorage.setItem(uuidv4(), item)
  for (let i = 0; i < localStorage.length; i++) {
    // console.log(localStorage.getItem(localStorage.key(i)))
    verifyImdbIds.push(localStorage.getItem(localStorage.key(i)))
  }
  verifyUniqs = [...new Set(verifyImdbIds)]
  localStorage.clear()
  for (let i = 0; i < verifyUniqs.length; i++) {
    localStorage.setItem(uuidv4(), verifyUniqs[i])
  }
}

// const hanldeAddClick = item => {
//   console.log(item)
//   localStorage.setItem(uuidv4(), item)
// }

let imdbIds = []
let uniq
let objectPr = []

const filterLocalStorage = () => {
  for (let i = 0; i < localStorage.length; i++) {
    // console.log(localStorage.getItem(localStorage.key(i)))
    imdbIds.push(localStorage.getItem(localStorage.key(i)))
  }
  uniq = [...new Set(imdbIds)]
  renderWatchlistQ(uniq)
}

async function renderWatchlistQ() {
  for (let item of uniq) {
    const resp = await fetch(`https://www.omdbapi.com/?apikey=40cffa7f&i=${item}`)
    const data = await resp.json()
    objectPr.push(data)
  }
  renderWatchlist()
}

const renderWatchlist = async () => {
  const postArr = await Promise.all(
    objectPr.map(async item => {
      htwoOfMovies.textContent = `Your watchlist:`
      let description = await movieDescription(item.imdbID)
      return `
    <div class="search-container bg-slate-200 w-full h-60" data-moviestoremove="${item.imdbID}">
        <img class="search-movie-poster" src="${item.Poster}" alt="">
        <button class="bg-fg-500 removewatchlist-btn text-fg-50" data-moviestoremove="${item.imdbID}"><i class="fa-solid fa-minus"></i>  Remove</button>
        <div class="search-container-text">
            <p class="search-movie-title">${item.Title}</p>
            <p class="search-movie-genre">${item.Type} ${item.Year}</p>
            <p class="search-movie-description">${description}</p>
        </div>
    </div>`
    })
  )
  movies.innerHTML = postArr.join("")

  const moiveSearchHideId = document.getElementById("moive-search-hide-id")
  if (moiveSearchHideId.classList.contains("moive-search-hide")) {
    moiveSearchHideId.classList.toggle("moive-search-hide")
  }
  objectPr = []
}

const deleteFilterLocalStorage = item => {
  console.log(item)

  const arrayLocal = Object.entries(localStorage)

  const post = arrayLocal.filter(items => {
    return items[1] === item
  })
  localStorage.removeItem(post[0][0])

  const moiveSearchHideId = document.getElementById("moive-search-hide-id")
  moiveSearchHideId.classList.toggle("moive-search-hide")
  imdbIds = []
  uniq
  objectPr = []
  movies.inert = ``
  filterLocalStorage()
}
