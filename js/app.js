// Initialize Firebase
var config = {
    apiKey: "AIzaSyB_O-N-451D3HGA4ZMpDyPBMub6THA0ork",
    authDomain: "lovecommerce-ddada.firebaseapp.com",
    databaseURL: "https://lovecommerce-ddada.firebaseio.com",
    projectId: "lovecommerce-ddada",
    storageBucket: "lovecommerce-ddada.appspot.com",
    messagingSenderId: "639464110271"
};
firebase.initializeApp(config);


//Inicializamos collapse se materiliza
//    $('.collapsible').collapsible();




//LLAMAMOS A LOS CONTENEDORES DE LAS TABS Y DE CHECKOUT
const sectionTabs = document.querySelector("#tabs");
const sectionCheckout = document.querySelector("#paypal-button-container");
sectionCheckout.classList.add("hide");



const callGeneralProductsApi = () => {
    const url = `https://cors-anywhere.herokuapp.com/https://openapi.etsy.com/v2/listings/active?keywords=jewelry&includes=MainImage,Images:3&limit=50&category=jewelry&api_key=wsx5gs9dbm720tz6pzr1a3pl`;
    let sectionName = "jewelry";

    fetch(url)
        .then(r => r.json())
        .then(data => {
            const dataInfo = data.results;
            printData(dataInfo, sectionName)
        })
        .catch(e => console.log(e));

}
callGeneralProductsApi();


//FUNCIÓN PARA LLAMAR A LA API EN CADA CLICK EN EL NOMBRE DE LA SECCIÓN
const callApi = e => {
    const sectionClick = event.currentTarget;
    const sectionName = sectionClick.dataset.section;

    const url = `https://cors-anywhere.herokuapp.com/https://openapi.etsy.com/v2/listings/active?keywords=${sectionName}&includes=MainImage,Images:3&limit=50&category=jewelry&api_key=wsx5gs9dbm720tz6pzr1a3pl`;


    fetch(url)
        .then(r => r.json())
        .then(data => {
            const dataInfo = data.results;
            printData(dataInfo, sectionName)
        })
        .catch(e => console.log('Something went wrong'));
}


//FUNCIÓN PARA PINTAR PRODUCTOS EN CADA SECCIÓN
const printData = (data, sectionName) => {

    sectionTabs.classList.remove("hide");
    sectionCheckout.classList.add("hide");

    const containerSection = document.querySelector(`#${sectionName}`);

    data.forEach(item => {
        let photo = item.Images;

        let titleItem = item.title.split(/[,.*-]/g);
        let descriptionItem = item.description.split(/[,.*-]/g);

        let template = `
        <div class="card">
          <div class="card-image waves-effect waves-block waves-light">
            <img class="activator" src=${item.MainImage.url_570xN}>
          </div>
          <div class="card-content">
            <span class="card-title activator grey-text text-darken-4">${titleItem[0]}<i class="material-icons right">more_vert</i></span>
            <p>Price: ${item.price}${item.currency_code}</p>
            <p>Quedan: ${item.quantity}</p>
            <button data-product-id=${item.listing_id} onclick="changeButtonMode(this, ${item.listing_id})" class='btn btn-primary'>Add to cart</button>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">${titleItem[0]}<i class="material-icons right">close</i></span>
            <p>${descriptionItem[0]}</p>
            <p>Materials: ${item.materials}</p>
          </div>

        </div>
        `;
        const containerProduct = document.createElement("div");
        containerProduct.classList.add("col");
        containerProduct.classList.add("m4");
        containerProduct.innerHTML = template;
        containerSection.appendChild(containerProduct);

    })
}

function changeButtonMode(button, id) {
    if (button.innerHTML === 'Add to cart'){
      button.innerHTML = 'Remove from cart'
      button.classList.add("red")
      addToCart(button, id)
    }else{
      button.innerHTML = 'Add to cart'
      button.classList.remove("red");
      removeFromCart(button);
   }
}
  
function addToCart (button, id) {

    let cartStorage = localStorage.getItem("cart");
    let cartIds;
      if (cartStorage === null) {
        cartIds = [];
      } else {
        cartIds = JSON.parse(cartStorage);
      }
    cartIds.push(id);
    localStorage.setItem("cart", JSON.stringify(cartIds));
    console.log(cartStorage);
    increaseCounter()
  }


  function increaseCounter() {
    let containerCounter = document.getElementById("counter-items");
    let stringIds = localStorage.getItem("cart")
    let strIdToArr = (JSON.parse(stringIds)).length;
    containerCounter.innerText = strIdToArr;
  }


  function removeFromCart (id) {

    let cartInfo = JSON.parse(localStorage.getItem("cart"));
    console.log(cartInfo);
    let indexOfItemToDelete = cartInfo.indexOf(id);
    console.log(indexOfItemToDelete)
    cartInfo.splice(indexOfItemToDelete, 1);
    localStorage.setItem("cart", JSON.stringify(cartInfo));
    decreaseCounter()
  }


  function decreaseCounter() {

    let containerCounter = document.getElementById("counter-items");
    let stringIds = localStorage.getItem("cart")
    let strIdToArr = (JSON.parse(stringIds)).length;
    console.log(strIdToArr);
    containerCounter.innerText = strIdToArr;

  }


(function ($) {

    $(document).ready(function () {
        $('#etsy-search').bind('submit', function () {
            api_key = "your_api_key";
            terms = $('#etsy-terms').val();
            etsyURL = "https://openapi.etsy.com/v2/listings/active.js?keywords=" +
                terms + "&limit=12&includes=Images:1&category=jewelry&api_key=wsx5gs9dbm720tz6pzr1a3pl";

            $('#etsy-images').empty();
            $('<p></p>').text('Searching for ' + terms).appendTo('#etsy-images');

            $.ajax({
                url: etsyURL,
                dataType: 'jsonp',
                success: function (data) {
                    if (data.ok) {
                        $('#etsy-images').empty();
                        if (data.count > 0) {
                            $.each(data.results, function (i, item) {
                                $("<img/>").attr("src", item.Images[0].url_75x75).appendTo("#etsy-images").wrap(
                                    "<a href='" + item.url + "'></a>"
                                );
                                if (i % 4 == 3) {
                                    $('<br/>').appendTo('#etsy-images');
                                }
                            });
                        } else {
                            $('<p>No results.</p>').appendTo('#etsy-images');
                        }
                    } else {
                        $('#etsy-images').empty();
                        alert(data.error);
                    }
                }
            });

            return false;
        })
    });

})(jQuery);



//CUANDO DAMOS CLICK EN CHECKOUT OCULTAMOS LAS TABS Y MOSTRAMOS LA VISTA DE CHECKOUT
const payment = () => {
    sectionTabs.classList.add("hide");
    sectionCheckout.classList.remove("hide");
}

const checkoutLink = document.querySelector("#checkout-link");
checkoutLink.addEventListener("click", payment);


const precio = 12;

paypal.Button.render({
    env: 'sandbox', // sandbox | production

    // PayPal Client IDs - replace with your own
    // Create a PayPal app: https://developer.paypal.com/developer/applications/create
    client: {
        sandbox: 'AR7YFz66UBmZT2ujQ13MVC2Wcbrbb168hFA855qN5i-DtD9Uqx6Bk980zpYA_9zEfsVrX3GVy-SSYv_E',
        production: 'AZwtebwVV7oNYII1ZGc4tZF74uhotXDvle87uMGMeSvwvVvZ4oJTQ6JtR611__YSOvXFDyUVaa0aT70V'
    },

    // Show the buyer a 'Pay Now' button in the checkout flow
    commit: true,

    // payment() is called when the button is clicked
    payment: function (data, actions) {

        // Make a call to the REST api to create the payment
        return actions.payment.create({
            payment: {
                transactions: [
                    {
                        amount: { total: `${precio}`, currency: 'USD' }

                    }
                ]
            }
        });
    },

    // onAuthorize() is called when the buyer approves the payment
    onAuthorize: function (data, actions) {

        // Make a call to the REST api to execute the payment
        return actions.payment.execute().then(function () {
            window.alert('Payment Complete!');
        });
    }

}, '#paypal-button-container');







/*

const printData = (data, sectionName) => {


    const containerSection = document.querySelector(`#${sectionName}`);

    data.forEach(item => {
      let photo = item.Images;
      console.log(photo);
        let descriptionItem = item.description.split(".");
        let template =`

        <h5>${item.title}</h5>
        <p>${descriptionItem[0]}</p>
        <img src=${item.MainImage.url_570xN}>
        <p>Materials: ${item.materials}</p>
        <p>Price: ${item.price}${item.currency_code}</p>
        <p>Quedan: ${item.quantity}</p>

        `;

        const containerProduct = document.createElement("div");
        containerProduct.classList.add("col");
        containerProduct.classList.add("m3");
        containerProduct.innerHTML = template;
        containerSection.appendChild(containerProduct)


        photo.forEach(photoGallery => {

        let templateGallery =`
          <img class="responsive-img" src=${photoGallery.url_170x135}>
=======
    apiKey: "AIzaSyB_O-N-451D3HGA4ZMpDyPBMub6THA0ork",
    authDomain: "lovecommerce-ddada.firebaseapp.com",
    databaseURL: "https://lovecommerce-ddada.firebaseio.com",
    projectId: "lovecommerce-ddada",
    storageBucket: "lovecommerce-ddada.appspot.com",
    messagingSenderId: "639464110271"
  };
  firebase.initializeApp(config);
  
  
  const callGeneralProductsApi = () => {
    const url = `https://cors-anywhere.herokuapp.com/https://openapi.etsy.com/v2/listings/active?keywords=jewelry&includes=MainImage,Images:3&limit=50&category=jewelry&api_key=wsx5gs9dbm720tz6pzr1a3pl`;
    let sectionName = "jewelry";
  
    fetch( url )
        .then( r => r.json() )
        .then( data => { const dataInfo = data.results;
            printData(dataInfo, sectionName) })
        .catch( e => console.log( e ) );
  
  }
  callGeneralProductsApi();
  
  //FUNCIÓN PARA LLAMAR A LA API EN CADA CLICK EN EL NOMBRE DE LA SECCIÓN
  const callApi = e => {
    const sectionClick = event.currentTarget;
    const sectionName = sectionClick.dataset.section;
  
    const url = `https://cors-anywhere.herokuapp.com/https://openapi.etsy.com/v2/listings/active?keywords=${sectionName}&includes=MainImage,Images:3&limit=50&category=jewelry&api_key=wsx5gs9dbm720tz6pzr1a3pl`;
  
  
    fetch( url )
        .then( r => r.json() )
        .then( data => { const dataInfo = data.results;
            printData(dataInfo, sectionName) })
        .catch( e => console.log( 'Something went wrong' ) );
  }
  
  
  //FUNCIÓN PARA PINTAR PRODUCTOS EN CADA SECCIÓN
  const printData = (data, sectionName) => {
  
      const containerSection = document.querySelector(`#${sectionName}`);
  
      data.forEach(item => {
        let photo = item.Images;
  
          let titleItem = item.title.split(".");
          let template =`
          <img class="responsive-img" src=${item.MainImage.url_570xN}>
          <h5>${titleItem[0]}</h5>
          <p>Price: ${item.price}${item.currency_code}</p>
          <p>Quedan: ${item.quantity}</p>
          <button data-product-id=${item.listing_id} onclick="changeButtonMode(this,${item.listing_id})" class='btn btn-primary'>Add to cart</button>
          `;
  
          const containerProduct = document.createElement("div");
          containerProduct.classList.add("col");
          containerProduct.classList.add("m4");
          containerProduct.innerHTML = template;
          containerSection.appendChild(containerProduct);
  
      })
  }

  function changeButtonMode(button, id) {
    if (button.innerHTML === 'Add to cart'){
      button.innerHTML = 'Remove from cart'
      button.classList.add("red")
      addToCart(button, id)
    }else{
      button.innerHTML = 'Add to cart'
      button.classList.remove("red");
      removeFromCart(button);
   }
}
  
function addToCart (button, id) {

    let cartStorage = localStorage.getItem("cart");
    let cartIds;
      if (cartStorage === null) {
        cartIds = [];
      } else {
        cartIds = JSON.parse(cartStorage);
      }
    cartIds.push(id);
    localStorage.setItem("cart", JSON.stringify(cartIds));
    console.log(cartStorage);
    increaseCounter()
  }


  function increaseCounter() {
    let containerCounter = document.getElementById("counter-items");
    let stringIds = localStorage.getItem("cart")
    let strIdToArr = (JSON.parse(stringIds)).length;
    containerCounter.innerText = strIdToArr;
  }


  function removeFromCart (id) {

    let cartInfo = JSON.parse(localStorage.getItem("cart"));
    console.log(cartInfo);
    let indexOfItemToDelete = cartInfo.indexOf(id);
    console.log(indexOfItemToDelete)
    cartInfo.splice(indexOfItemToDelete, 1);
    localStorage.setItem("cart", JSON.stringify(cartInfo));
    decreaseCounter()
  }


  function decreaseCounter() {

    let containerCounter = document.getElementById("counter-items");
    let stringIds = localStorage.getItem("cart")
    let strIdToArr = (JSON.parse(stringIds)).length;
    console.log(strIdToArr);
    containerCounter.innerText = strIdToArr;

  }

  

  
  
  (function($){
  
      $(document).ready(function(){
          $('#etsy-search').bind('submit', function() {
              api_key = "your_api_key";
              terms = $('#etsy-terms').val();
              etsyURL = "https://openapi.etsy.com/v2/listings/active.js?keywords="+
                  terms+"&limit=12&includes=Images:1&category=jewelry&api_key=wsx5gs9dbm720tz6pzr1a3pl";
  
              $('#etsy-images').empty();
              $('<p></p>').text('Searching for '+terms).appendTo('#etsy-images');
  
              $.ajax({
                  url: etsyURL,
                  dataType: 'jsonp',
                  success: function(data) {
                      if (data.ok) {
                          $('#etsy-images').empty();
                          if (data.count > 0) {
                              $.each(data.results, function(i,item) {
                                  $("<img/>").attr("src", item.Images[0].url_75x75).appendTo("#etsy-images").wrap(
                                      "<a href='" + item.url + "'></a>"
                                  );
                                  if (i%4 == 3) {
                                      $('<br/>').appendTo('#etsy-images');
                                  }
                              });
                          } else {
                              $('<p>No results.</p>').appendTo('#etsy-images');
                          }
                      } else {
                          $('#etsy-images').empty();
                          alert(data.error);
                      }
                  }
              });
  
              return false;
          })
      });
  
  })(jQuery);
  /*
  const printData = (data, sectionName) => {
      const containerSection = document.querySelector(`#${sectionName}`);
      data.forEach(item => {
        let photo = item.Images;
        console.log(photo);
          let descriptionItem = item.description.split(".");
          let template =`
          <h5>${item.title}</h5>
          <p>${descriptionItem[0]}</p>
          <img src=${item.MainImage.url_570xN}>
          <p>Materials: ${item.materials}</p>
          <p>Price: ${item.price}${item.currency_code}</p>
          <p>Quedan: ${item.quantity}</p>

          `;
          const containerProduct = document.createElement("div");
          containerProduct.classList.add("col");
          containerProduct.classList.add("m3");
          containerProduct.innerHTML = template;
          containerSection.appendChild(containerProduct)
          photo.forEach(photoGallery => {
          let templateGallery =`
            <img class="responsive-img" src=${photoGallery.url_170x135}>
            `;
          containerProduct.insertAdjacentHTML('afterend', templateGallery);
          })
      })
  }
  */
