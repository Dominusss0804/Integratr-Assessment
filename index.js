let selectedItem = null;

// Function to add item to a basket
function addItem(basketId, fruitInputId, quantityInputId, countClass) {
    const fruitNameOriginal = document.getElementById(fruitInputId).value.trim(); // Preserve original case
    const fruitNameLower = fruitNameOriginal.toLowerCase(); // For comparison
    const quantity = parseInt(document.getElementById(quantityInputId).value.trim());

    if (fruitNameOriginal && quantity) {
        const inventoryList = document.getElementById(basketId);
        let itemExists = false;

        // Check if the item already exists in the basket
        const items = inventoryList.getElementsByClassName('inventory-item');
        for (let item of items) {
            const itemText = item.querySelector('span').textContent.toLowerCase();
            if (itemText.includes(`fruit: ${fruitNameLower}`)) {
                // Extract the current quantity and update it
                const currentQuantity = parseInt(itemText.match(/quantity: (\d+)/)[1]);
                const newQuantity = currentQuantity + quantity;
                item.querySelector('span').textContent = `Fruit: ${fruitNameOriginal}, Quantity: ${newQuantity}`; // Preserve case in display
                itemExists = true;
                break;
            }
        }

        // If the item doesn't exist, create a new one
        if (!itemExists) {
            // Create a new div for the fruit item
            const newItem = document.createElement('div');
            newItem.classList.add('inventory-item');

            // Create the text node for the fruit item
            const itemText = document.createElement('span');
            itemText.textContent = `Fruit: ${fruitNameOriginal}, Quantity: ${quantity}`; // Preserve case in display

            // Create the delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'x';
            deleteButton.classList.add('delete-button');

            // Add an event listener to the delete button to remove the item
            deleteButton.addEventListener('click', function() {
                newItem.remove();
                updateBasketCount(countClass, basketId);
            });

            // Add event listener for selecting an item
            newItem.addEventListener('click', function() {
                if (selectedItem) {
                    selectedItem.classList.remove('selected');
                }
                selectedItem = newItem;
                selectedItem.classList.add('selected');
            });

            // Append the text and delete button to the new item div
            newItem.appendChild(itemText);
            newItem.appendChild(deleteButton);

            // Append the new item to the inventory list
            inventoryList.appendChild(newItem);
        }

        // Clear the input fields after adding
        document.getElementById(fruitInputId).value = '';
        document.getElementById(quantityInputId).value = '';

        // Update the item count
        updateBasketCount(countClass, basketId);
    } else {
        alert("Please enter both fruit name and quantity.");
    }
}

// Function to update the count of items in a basket
function updateBasketCount(countClass, basketId) {
    const itemCount = document.querySelectorAll(`#${basketId} .inventory-item`).length;
    document.querySelector(`.${countClass}`).textContent = itemCount;
}

// Function to move the selected item to the other basket
function moveItemToBasket(targetBasketId, targetCountClass, sourceCountClass) {
    if (selectedItem) {
        const targetBasket = document.getElementById(targetBasketId);
        targetBasket.appendChild(selectedItem);
        selectedItem.classList.remove('selected');
        selectedItem = null;

        // Update item counts
        updateBasketCount(targetCountClass, targetBasketId);
        updateBasketCount(sourceCountClass, targetBasketId === 'inventoryListA' ? 'inventoryListB' : 'inventoryListA');
    } else {
        alert("Please select an item to move.");
    }
}

// Add event listeners for adding items
document.querySelector('.addItem.A').addEventListener('click', function() {
    addItem('inventoryListA', 'fruitA', 'quantityA', 'basketA');
});

document.querySelector('.addItem.B').addEventListener('click', function() {
    addItem('inventoryListB', 'fruitB', 'quantityB', 'basketB');
});

// Add event listeners for moving items between baskets
document.getElementById('moveToRight').addEventListener('click', function() {
    moveItemToBasket('inventoryListB', 'basketB', 'basketA');
});

document.getElementById('moveToLeft').addEventListener('click', function() {
    moveItemToBasket('inventoryListA', 'basketA', 'basketB');
});
