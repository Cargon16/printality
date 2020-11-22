const open_printers = document.getElementById('submit_add')
const show_works = document.getElementById('show-works')
const close = document.getElementById('close_modal')

window.onload = function () {
    open_printers.addEventListener('click', () => {
        const tab = document.querySelector(open_printers.dataset.modelTarget)
        openTab(tab)
    })
    show_works.addEventListener('click', () => {
        const tab = document.querySelector(show_works.dataset.modelTarget)
        openTab(tab)
    })
    close.addEventListener('click', () => {
        const modal = close.closest('.add')
        closeTab(modal)
    })
}

function openTab(tab) {
    if (tab == null) return
    tab.classList.add('active')
}
function closeTab(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
  }