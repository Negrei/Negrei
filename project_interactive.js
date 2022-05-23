
const modal = document.querySelector('#my-modal');
const modalBtn = document.querySelector('#modal-btn');
const closeBtn = document.querySelector('.close');

modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', outsideClick);

function openModal() {
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
}

function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = 'none';
  }
}


/**
 * @constructor
 * @param {number} itemId
 * @param {string} name
 * @param {number} price
 * @param {number} stock
 */
class ItemEntry {
    constructor(itemId, name, price, stock) {
        this.itemId = itemId;
        this.button = null;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }

    /**
     * @param {object} parent 
     * @param {EventListenerObject} handleButtonClick 
     */
    createButton(parent, handleButtonClick) {
        this.button = document.createElement('div');
        this.button.innerText = this.buttonCaption();
        this.button.classList.add('entryButton');
        this.button.addEventListener('click', handleButtonClick);
        parent.appendChild(this.button);
    }

    /**
     */
    updateButton() {
        if (this.button)
        {
            this.button.innerText = this.buttonCaption();
        }
    }

    /**
     */
    deleteButton() {
        this.button.parentElement.removeChild(this.button);
        this.button = null;
    }

    /**
     * @returns {string}
     */
    buttonCaption() {
        return this.name + ' | ' + this.price + ' | ' + this.stock;
    }
}

/**
 * @constructor
 * @param {HTMLElment}
 * @param {EventListenerObject}
 */
class Container {
    constructor(element, handleButtonClick) {
        this.list = [];
        this.element = element;
        this.handleButtonClick = handleButtonClick;
    }

    /**
    @param {string} name
    @param {number} price
    @param {number} stock
    @param {number} [itemId]
    @returns {ItemEntry}
     */
    addEntry(name, price, stock, itemId = this.list.length) {
        let newEntry = new ItemEntry(itemId, name, price, stock);
        newEntry.createButton(this.element, this.handleButtonClick);
        this.list.push(newEntry);
        return newEntry;
    }

    /**
    @param {number} itemId
     @returns {ItemEntry}
     */
    getEntryById(itemId) {
        for (const item of this.list) {
            if (item.itemId == itemId) {
                return item;
            }
        }
    }

    /**
     @param {HTMLElement} button
     @returns {ItemEntry} 
     */
    getEntryByButton(button) {
        for (const item of this.list) {
            if (item.button === button) {
                return item;
            }
        }
    }

    /**
    @param {number} itemId 
     */
    deleteEntryById(itemId) {
        this.list.every((item, index) => {
            if (item.itemId == itemId) {
                this.list.splice(index, 1);
                return false;
            } else {
                return true;
            }
        })
    }
}

/**
 @constructor
 @param {HTMLElement} storeElement
 @param {HTMLElement} cartElement 
 @param {HTMLElement} totalElement 
*/
class Shop {
    constructor(storeElement, cartElement, totalElement) {
        this.store = new Container(storeElement, (event) => {
            handleStoreButtonClick.call(this, event);
        });
        this.cart = new Container(cartElement, (event) => {
            handleCartButtonClick.call(this, event);
        });
        this.total = 0;
        this.totalElement = totalElement;
    }

    /**
     * @param {number} itemId
     */
    moveToCart(itemId) {
        let storeEntry = this.store.getEntryById(itemId);
        if (storeEntry.stock > 0) {
            storeEntry.stock--;
            let cartEntry = (this.cart.getEntryById(itemId) || 
                this.cart.addEntry(storeEntry.name, storeEntry.price, 0, storeEntry.itemId));
            cartEntry.stock++;
            this.total += storeEntry.price;
        }
    }

    /**
     * @param {number} itemId
     *
     */
    moveToStore(itemId) {
        let cartEntry = this.cart.getEntryById(itemId);
        let storeEntry = this.store.getEntryById(itemId);
        cartEntry.stock--;
        storeEntry.stock++;
        this.total -= storeEntry.price;
        if (cartEntry.stock === 0) {
            cartEntry.deleteButton();
            this.cart.deleteEntryById(itemId);
        }
    }

    /**
     * 
     */
    updateTotal() {
        this.totalElement.innerText = 'Подтвердить оплату: ' + this.total;
    }
}

/**
 * 
 * 
 * @param {MouseEvent} event 
 */
function handleCartButtonClick(event) {
    let button = event.target;
    let cartEntry = this.cart.getEntryByButton(button);
    let storeEntry = this.store.getEntryById(cartEntry.itemId);
    this.moveToStore(cartEntry.itemId); 
    cartEntry.updateButton();
    storeEntry.updateButton();
    this.updateTotal();
}

/**

 * @param {MouseEvent} event 
 */
function handleStoreButtonClick(event) {
    let button = event.target;
    let storeEntry = this.store.getEntryByButton(button);
    this.moveToCart(storeEntry.itemId);
    let cartEntry = this.cart.getEntryById(storeEntry.itemId);
    cartEntry.updateButton();
    storeEntry.updateButton();
    this.updateTotal();
}

let storeElement = document.getElementById('store');
let cartElement = document.getElementById('cart')
let cartTotalElement = document.getElementById('total');

let myShop = new Shop(storeElement, cartElement, cartTotalElement);


myShop.store.addEntry('Екатерининский дворец', 200, 24);
myShop.store.addEntry('Камеронова галерея', 150, 20);
myShop.store.addEntry('Верхняя ванна', 180, 16);
myShop.store.addEntry('Эрмитажная кухня', 120, 13);
myShop.store.addEntry('Эрмитаж', 180, 15);
myShop.store.addEntry('Мраморный мост', 130, 18);
myShop.store.addEntry('Морейская колонна', 200, 30);
myShop.store.addEntry('Гранитная терраса', 50, 40);
myShop.store.addEntry('Грот', 80, 10);
myShop.store.addEntry('Холодная баня', 120, 17);
myShop.store.addEntry('Адмиралтейство', 200, 23);
myShop.store.addEntry('Чесменская колонна', 210, 15);
myShop.store.addEntry('Ворота «Любезным моим сослуживцам»', 200, 13);
myShop.store.addEntry('Турецкая баня', 140, 27);
myShop.store.addEntry('Пирамида', 80, 25);
myShop.store.addEntry('Красный каскад', 250, 10);
myShop.store.addEntry('Готические ворота', 180, 15);
myShop.store.addEntry('Скрипучая беседка', 130, 10);
myShop.store.addEntry('Кагульский обелиск', 200, 12);
myShop.store.addEntry('Концертный зал', 50, 29);
myShop.store.addEntry('Орловские ворота', 80, 50);
myShop.store.addEntry('Кухня-руина', 100, 25);
myShop.store.addEntry('Нижняя ванна', 180, 25);
myShop.store.addEntry('Зал на острову', 300, 10);

window.onload = init;

function init(){
    var button = document.getElementById("total")
    button.onclick = handleButtonClick;
}

function handleButtonClick() {
    alert("Вы подтвердили оплату на сайте.");
}



function showPrompt(html, callback) { 
    window["prompt-message"].innerHTML = html;    


    window["prompt-form-container"].hidden = false; 
    window["prompt-form"].text.focus();        
}


button.addEventListener("click", () => showPrompt("Введите данные банковской карты", function(value) {
  alert(value);
}));


window["prompt-form"].cancel.addEventListener("keydown", function(event) {
    if (event.code == "Tab" && !event.shiftKey) { 
        window["prompt-form"].text.focus();     
        event.preventDefault();                   
}});


window["prompt-form"].text.addEventListener("keydown", function(event) {
    if (event.code == "Tab" && event.shiftKey) { 
        window["prompt-form"].cancel.focus();   
        event.preventDefault();                 
    }
});




    function onExit() {                                
        window["prompt-form"].text.value = "";        
        window["prompt-form-container"].hidden = true; 

        window["prompt-form"].removeEventListener("submit", onSubmit);
        window["prompt-form"].cancel.removeEventListener("click", onCancel);
        document.removeEventListener("keydown", onEscape);
    }

   
    window["prompt-form"].addEventListener("submit", onSubmit);
    function onSubmit() {
        event.preventDefault();                    
        callback(window["prompt-form"].text.value); 
        onExit();                                
    }

    window["prompt-form"].cancel.addEventListener("click", onCancel);
    function onCancel() {
        callback(null);
        onExit();
    }
  
    document.addEventListener("keydown", onEscape);
    function onEscape(event) {                  
        if (event.code == "Escape") onCancel();
    }

  masking.init();
