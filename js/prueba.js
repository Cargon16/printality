const open = document.getElementById('submit_add')
const close = document.getElementById('close_modal')

window.onload = function () {
    open.addEventListener('click', () => {
        const tab = document.querySelector(open.dataset.modelTarget)
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