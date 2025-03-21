const navbarMobileToggle = document.querySelector('.navbar-mobile svg');
const navMobileBackdrop = document.querySelector('.mobile-menu-backdrop');
const closeButton = document.querySelector('.close-button');

navMobileBackdrop.style.display='none'

navbarMobileToggle.addEventListener('click',()=>{
  navMobileBackdrop.style.display='block'

  navMobileBackdrop.addEventListener('click',(e)=>{
    if(e.target=== navMobileBackdrop){
      navMobileBackdrop.style.display='none'
    }; 
  });
  closeButton.addEventListener('click',()=>{
    navMobileBackdrop.style.display='none'
  });
})