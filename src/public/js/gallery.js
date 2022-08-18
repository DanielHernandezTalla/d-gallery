'use strict'
import {ApiFetch} from './helpers/apiFetch.js'
// ===============================================
// Drag and drop zone
// ===============================================
const dragZone = document.getElementById('gallery-drop-zone')

async function progressUpload(item){
    // console.log(item)
    const formData = new FormData()
    formData.set('file', item)

    try{
        let data = await fetch('https://d-gallery-app.herokuapp.com/gallery',{
            method: 'POST',
            body: formData
        })
        
        if (!data.ok)throw {
            status: data.status,
            message: data.statusText
        }
        
        let res = await data.json()
        
        // console.log(res)
        
        // Reload info
        reloadData()

    } catch (e) {
        console.error(e)
    }
}

dragZone.addEventListener('dragover', e=>{
    e.preventDefault()
    e.stopPropagation()
    dragZone.classList.add('gallery-images-selected')
})

dragZone.addEventListener('dragleave', e=>{
    e.preventDefault()
    e.stopPropagation()
    dragZone.classList.remove('gallery-images-selected')
})

dragZone.addEventListener('drop', e=>{
    e.preventDefault()
    e.stopPropagation()
    dragZone.classList.remove('gallery-images-selected')

    const files = Array.from(e.dataTransfer.files)

    files.forEach(item => progressUpload(item))
})

// ===============================================
// Get search
// ===============================================
document.addEventListener('submit', e=>{
    e.preventDefault()
    // if(e.target.matches('#gallery-nav-form')){

    //     let search = e.target.search.value

    //     request(search)
    // }
})

document.addEventListener('click', e=>{
    if(e.target.matches('.gallery-image') || e.target.matches('.gallery-image *')){
        let id = e.target.parentNode.parentNode.dataset.id
        console.log(id)

        let api = new ApiFetch()

        let url = `https://d-gallery-app.herokuapp.com/gallery/${id}`

        api.execute({
            url,
            method: 'DELETE',
            success: res=> reloadData(),
            error: err=>{
                console.log(err)
            }
        })

    }
})

document.addEventListener('input', e=>{
    // console.log(e)
    if(e.target.matches('#gallery-nav-input')){
        // e.preventDefault()

        let search = e.target.value
        // console.log(search)

        request(search)
    }
})

async function request(search) {
        
    let url = `https://d-gallery-app.herokuapp.com/gallery/search?search=${search}`
    
    let api = new ApiFetch()

    api.execute({
        url,
        success: res=> loadImages(res),
        error: err=>{
            console.log(err)
        }
    })
}

function reloadData(){
    let api = new ApiFetch()

    let url = `https://d-gallery-app.herokuapp.com/gallery/api`

    api.execute({
        url,
        success: res=> loadImages(res),
        error: err=>{
            console.log(err)
        }
    })
}

function loadImages(res){
    const zone = document.getElementById('gallery-drop-zone')

    zone.innerHTML = ''

    res.success.forEach(item=>{
        const figure = document.createElement('figure')
        figure.classList.add('gallery-image')
        figure.dataset.id = item._id

        figure.innerHTML = `
            <div>
                <img src="${item.url}" alt="${item.name}">
            </div>
            <div>
                <figcaption>${item.name.substring(0, item.name.length - 37) }</figcaption>
                <div class="gallery-image__description">
                    <p>${item.format}</p>
                    <p>${item.size/1000} kb</p>
                    <p>${item.width} x ${item.height}</p>
                </div>
            </div>
        `
        
        zone.appendChild(figure)
    })
}