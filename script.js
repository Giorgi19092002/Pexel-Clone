const imagesWrapper = document.querySelector('.images')
const loadMoreBtn = document.querySelector('.load-more')
const searchInput = document.querySelector('.search-box input')
const lightBox = document.querySelector('.lightbox')
const closeBtn = document.querySelector('.bi-x-lg')
const downloadBtn = document.querySelector('.bi-download')

const apiKey = 'zSAkrUmzv60U30RQQerqWawxVi4bXWrqegb82sCckzxPtvpkLHaAK1FQ'
const perPage = 15
let currentpage = 1
let searchTerm = null


const downloadImg = (imgUrl) => {
    fetch(imgUrl).then(resp => resp.blob()).then(file => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(file)
        a.download = new Date().getTime()
        a.click()
    }).catch(() => alert('Failed to download image'))
}

const showLightBox = (name,img) => {
    lightBox.querySelector('img').src = img
    lightBox.querySelector('span').innerText = name
    lightBox.classList.add('show')
    downloadBtn.setAttribute('data-img',img)
    document.body.style.overflow = 'hidden'
}

const hideLightBox = () => {
    lightBox.classList.remove('show')
    document.body.style.overflow = 'auto'
}

const generateHTML = (images) => {
   imagesWrapper.innerHTML += images.map(img => 
        `<li class="card" onclick = "showLightBox('${img.photographer}', '${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="img">
        <div class="details">
          <div class="photographer">
            <i class="bi bi-camera-fill"></i>
            <span>${img.photographer}</span>
          </div>
          <button onclick = "downloadImg('${img.src.large2x}');event.stopPropagation()">
            <i class="bi bi-download"></i>
          </button>
        </div>
        </li>`
    ).join('')
}



const getImages = (apiUrl) => {
    loadMoreBtn.innerText = 'Loading...'
    loadMoreBtn.classList.add('disabled')
    fetch(apiUrl, {
        headers: {Authorization : apiKey}
    }).then(resp => resp.json()).then(data => {
        generateHTML(data.photos)
        loadMoreBtn.innerText = 'Load More'
        loadMoreBtn.classList.remove('disabled')
    }).catch(() => alert('Failed to load images'))
}

const loadMoreImages = () => {
    currentpage++
    let apiUrl = `https://api.pexels.com/v1/curated?page=${currentpage}per_page=${perPage}`
    apiUrl = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentpage}per_page=${perPage}` : apiUrl
    getImages(apiUrl)
}

const loadSearchImages = (e) => {
    if(e.target.value === '') return searchTerm === null
    if(e.key === 'Enter'){
        currentpage = 1
        searchTerm = e.target.value
        imagesWrapper.innerHTML = ''
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentpage}per_page=${perPage}`)
    }
}



getImages(`https://api.pexels.com/v1/curated?page=${currentpage}per_page=${perPage}`)

loadMoreBtn.addEventListener('click',loadMoreImages)
searchInput.addEventListener('keyup',loadSearchImages)
closeBtn.addEventListener('click', hideLightBox)
downloadBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img))