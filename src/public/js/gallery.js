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
        let data = await fetch('/gallery',{
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

    if(e.target.matches('.gallery-nav__search'))
        e.preventDefault()
    // if(e.target.matches('#gallery-nav-form')){

    //     let search = e.target.search.value

    //     request(search)
    // }
})

document.addEventListener('click', e=>{

    if(e.target.matches('#show-options') || e.target.matches('#show-options *')){
        let text = document.querySelector('#show-options').querySelector('p')
        const gallery = document.querySelectorAll('.gallery-image')

        gallery.forEach(item => {
            if(text.textContent === "Show")
                item.querySelector('.gallery-image-options').classList.remove('d-none')
            else
                item.querySelector('.gallery-image-options').classList.add('d-none')
        })

        text.textContent = text.textContent ==="Show"? "Hide": "Show"
    }

    if(e.target.matches("#gallery-nav-btn") || e.target.matches("#gallery-nav-btn *")){
        
        const menu = document.getElementById('gallery-nav-menu-hide')

        if(menu.classList.contains('d-none'))
            menu.classList.remove('d-none')
        else
            menu.classList.add('d-none')

        return
    }else
        document.getElementById('gallery-nav-menu-hide').classList.add('d-none')

    if(!(e.target.matches('#form-upload-image') || e.target.matches('#form-upload-image *')))
        document.getElementById('form-upload-image').classList.add('form-upload-none')

    if(!(e.target.matches('#form-upload-folder') || e.target.matches('#form-upload-folder *')))
        document.getElementById('form-upload-folder').classList.add('form-upload-none')

    if(e.target.matches("#upload-image") || e.target.matches("#upload-image *")){
        document.getElementById('form-upload-image').classList.remove('form-upload-none')
        return
    }

    if(e.target.matches("#upload-folder") || e.target.matches("#upload-folder *")){
        document.getElementById('form-upload-folder').classList.remove('form-upload-none')
        return
    }

    if(e.target.matches('.delete-image')){
        let id = e.target.parentNode.parentNode.dataset.id
        console.log(id)

        let api = new ApiFetch()

        let url = `/gallery/${id}`

        api.execute({
            url,
            method: 'DELETE',
            success: res=> reloadData(),
            error: err=>{
                console.log(err)
            }
        })
        return;
    }

    if(e.target.matches('.gallery-image') || e.target.matches('.gallery-image *')){
        let img = e.target.parentNode.parentNode.querySelector('img')

        if(img){
            copy(img.src)
        }

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

// ===============================================
// Fetch funtions
// ===============================================
async function request(search) {
        
    let url = `/gallery/search?search=${search}`
    
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

    let url = `/gallery/api`

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
            <div class="gallery-image-options ">
                <i class="fas fa-link"></i>
                <i class="delete-image fas fa-trash"></i>
            </div>
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

function notification(value){
    let notification = document.getElementById('notification')

    notification.querySelector('p').textContent = value

    notification.classList.add('notification-show')
    
    setTimeout(()=>{
        notification.classList.remove('notification-show')
    }, 1000)
}

function copy(value){

    let input = document.createElement('input')

    input.setAttribute("value", value);
    document.body.appendChild(input)

    input.select()
    document.execCommand('copy');
    document.body.removeChild(input)

    notification("Copied")
}