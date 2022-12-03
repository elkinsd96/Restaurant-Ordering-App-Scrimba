import { menuArray } from './data.js'
import { cartArray } from './data.js'

// Generates menu html
function getMenuHTML(){
    let menuHTML = ''
    menuArray.forEach(function(menuItem){
        menuHTML += `
            <div class="menu">
                <div class="menu-inner">
                    <p class="menu-icon">${menuItem.emoji}</p>
                    <div class="menu-item">
                        <p class="menu-name">${menuItem.name}</p>
                        <p class="ingredients">${menuItem.ingredients.join(', ')}</p>
                        <p class="price">$${menuItem.price}</p>
                    </div>
                    <div class="add-btns" id="add-btns">
                            <button class="add-btn"
                            data-add="${menuItem.id}"
                            >+</button>
                    </div>
                </div>
            </div>
        `
    })
    return menuHTML
}

// Generates checkout html
function getCheckoutHTML(){
    let checkoutHTML = ''
    checkoutHTML += `
                <div class="hidden" id="checkout">
                    <div class="order-header">
                        <p>Your Order</p>
                    </div>
                </div>
                `
    cartArray.forEach(function(cartItem){
        checkoutHTML += `
                    <div class="order-item">
                        <p class="order-name">${cartItem.name}</p>
                        <p class="order-amount">(x${cartItem.amount})</p>
                        <button class="order-remove" data-remove="${cartItem.id}">remove</button>
                        <p class="order-price">$${cartItem.price * cartItem.amount}</p>
                    </div>
        `
    })
    checkoutHTML += `
            <div class="hidden" id="total">
                <div class="total">
                    <p class="total-price-header">Total price:</p>
                    <p class="total-price">$${getTotal()}</p>
                </div>>
                <div class="order-btn-container">
                    <button class="order-btn" data-order="order">Complete order</button>
                </div>
            </div>
        `
    return checkoutHTML
}

// Render menu and cart
function render(){
        document.getElementById("menu-container").innerHTML = getMenuHTML()
        document.getElementById("checkout-container").innerHTML = getCheckoutHTML()
        if(cartArray.length > 0){
            toggleCart()
        }
}

document.addEventListener('click', function(e){
    // Add item event
    if(e.target.dataset.add){
        addCartItem(e.target.dataset.add)  
        // Remove item event
    } else if(e.target.dataset.remove){
        removeCartItem(e.target.dataset.remove)
        // Order item event
    } else if(e.target.dataset.order){
        togglePaymentForm()
        toggleButtons(true)
        //Close payment form event
    } else if(e.target.dataset.close){
        togglePaymentForm(false)
    }
})

// Submit order event
document.addEventListener('submit', function(e){
    e.preventDefault()
    togglePaymentForm()
    getOrderConfirmHTML()
})

// Adds item to cart
function addCartItem(itemId){
    menuArray.forEach(function(menuItem){
        if(menuItem.id == itemId){
            if(isInCart(cartArray, itemId) === true){
                increaseAmount(itemId)
            } else {
                cartArray.push(menuItem)
                cartArray.forEach(function(cartItem){
                    if(cartItem.id == itemId){
                        cartItem['amount'] = 0
                    }
                })
                increaseAmount(itemId)
            }
        }
    })
    render()
}

// Removes cart item
function removeCartItem(itemId){
    cartArray.forEach(function(cartItem){
        if(cartItem.id == itemId) {
           if(cartItem.amount > 1){
               decreaseAmount(itemId)
           } else {
               decreaseAmount(itemId)
               let index = cartArray.indexOf(cartItem)
               cartArray.splice(index, 1)
           }
        }      
    })
    // Hides cart if empty
    if(cartArray.length === 0){
        toggleCart()
    }
    render()
}

// Checks if item's in cart
function isInCart(array, itemId){
    let isTrue = false
    if(array != null){
        array.forEach(function(cartItem){
            if(cartItem.id == itemId){
                isTrue = true
            }
        })
    }
    return isTrue
}

// Increases item amount
function increaseAmount(itemId){
    cartArray.forEach(function(cartItem){
        if(cartItem.id == itemId){
            cartItem.amount += 1
        }
    })
}

// Decreases item amount
function decreaseAmount(itemId){
    cartArray.forEach(function(cartItem){
        if(cartItem.id == itemId){
            cartItem.amount -= 1
        }
    })
}

// Gets total price of cart
function getTotal() {
    let total = 0
    cartArray.forEach(function(cartItem){
            total += cartItem.price * cartItem.amount   
    })
    return total
}

// Shows and hides cart
function toggleCart(){
    document.getElementById('checkout').classList.toggle('hidden')
    document.getElementById('total').classList.toggle('hidden')
}

// Shows and hides payment form
function togglePaymentForm(){
    document.getElementById('payment-form-container').classList.toggle('hidden')
}

// Enables and disables buttons
function toggleButtons(bool){
    let addBtns = document.querySelector('.add-btn')
    let orderBtn = document.querySelector('.order-btn')
    if(bool == true) {
        addBtns.disabled = true
        orderBtn.disabled = true
    } else {
        addBtns.disabled = false
        orderBtn.disabled = false
    }
}

// Generates order confirmatiob html
function getOrderConfirmHTML(){
    let orderConfirmHTML = document.getElementById('checkout-container')
    orderConfirmHTML.innerHTML = `
        <div class="order-confirm">
            <p class="order-confirm-text">Thanks, ${document.getElementById('name').value}! Your order is on its way!</p>
        </div>
        `
    return orderConfirmHTML
}

render()