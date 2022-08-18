'use strict'

document.addEventListener('submit', e=> {
    if(e.target.matches('.form-auth')){
        
        if(e.target.password.value !== e.target.confirmPassword.value){
            e.preventDefault()
            
            const formError = document.querySelector('.form-auth__error')
            formError.textContent = ' Password and confirm password are different'

            e.target.password.value = ''
            e.target.confirmPassword.value = ''

            e.target.password.focus()
        }
    }
})