const open = document.querySelectorAll('[data-modal-target]')
const close = document.querySelectorAll('[data-close-button]')

open.forEach(button => {
button.addEventListener('click', () => {
  const tab = document.querySelector(button.dataset.modalTarget)
  openTab(tab)
})
})
function openTab(tab) {
    if (tab == null) return
    tab.classList.add('active')
}

close.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.add')
      closeTab(modal)
    })
  })
function closeTab(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
  }