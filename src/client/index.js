import { handleSearch } from './js/app'

import './styles/style.scss'

// alert("i am here")

import img_demo from './media/cat1.jpg';

const demoData = [
  {theSummary:"Possible Light Rain",
   theLow:"42.32",
   theHigh:"57.85",
   theImage: img_demo,
   tripDays:"30 days left",
   mainTripDifference:8,
   departureDate: "02/12/2020",
   fromText: "London,England",
   theSummar: "Rainy Day."
 }]

let remBtn = document.querySelector('.btn-remove');
remBtn.addEventListener('click', () => {
  remBtn.textContent = 'removed'
  view_prev(demoData)
}, false)



// Check that service workers are supported
if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}

export {
    handleSearch,

}
