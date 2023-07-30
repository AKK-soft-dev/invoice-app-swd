// selectors

const products = [
  {
    id: 1,
    name: "Apple",
    price: 1200,
  },
  {
    id: 2,
    name: "Orange",
    price: 1400,
  },
  {
    id: 3,
    name: "Lime",
    price: 50,
  },
  {
    id: 4,
    name: "Banana",
    price: 200,
  },
];

let rowCount = 1;

const app = document.querySelector("#app");
const newRecord = document.querySelector("#newRecord");
const product = document.querySelector("#product");
const quantity = document.querySelector("#quantity");
const records = document.querySelector("#records");
const inventories = document.querySelector("#inventories");
const recordRows = document.querySelector("#record-rows");
const recordsTotal = document.querySelector(".records-total");
const recordsTax = document.querySelector(".records-tax");
const recordsTotalCost = document.querySelector(".records-total-cost");
const newItem = document.querySelector("#newItem");
const newItemName = document.querySelector("#newItemName");
const newItemPrice = document.querySelector("#newItemPrice");

// functions

const createItem = (name, price) => {
  const div = document.createElement("div");
  div.className =
    "item-list border border-2 p-3 mb-3 d-flex justify-content-between";
  div.innerHTML = `
  <p class=" mb-0 item-name">${name}</p>
  <p class="text-black-50 mb-0 item-price">${price.toLocaleString()} mmk</p>
  `;
  return div;
};

const createRecordRow = (productId, quantity) => {
  // information
  const currentProduct = products.find((el) => el.id == productId);
  const price = currentProduct.price;
  const formattedPrice = price.toLocaleString();
  const cost = price * quantity.valueAsNumber;
  const formattedCost = cost.toLocaleString();
  const qty = quantity.valueAsNumber;
  const formattedQty = qty.toLocaleString();

  const tableRow = document.createElement("tr");
  tableRow.classList.add("record-row");
  tableRow.setAttribute("product-id", productId);
  tableRow.innerHTML = `
          <td class='record-no'></td>
          <td class="text-start record-product">${currentProduct.name}</td>
          <td class="text-end record-price" data-value=${price}>${formattedPrice}</td>
          <td class="text-end ">
          <span>
            <i class="record-quantity-control record-quantity-decrement bi bi-dash"></i>
          </span>
          <span class='record-quantity user-select-none' data-value=${qty}>
            ${formattedQty}
          </span>
          <span>
            <i class=" record-quantity-control record-quantity-increment bi bi-plus"></i>
          </span>
          </td>
          <td class="text-end position-relative">
            <span class='record-cost' data-value=${cost}>${formattedCost}</span>
            <button class=" d-print-none btn btn-sm btn-primary record-row-del position-absolute start-100 top-50">
              <i class=" bi bi-trash3"></i>
            </button>
          </td>
      `;

  tableRow.querySelector(".record-row-del").addEventListener("click", () => {
    if (confirm(`Are U sure to remove product ${currentProduct.name}?`)) {
      tableRow.classList.add("animate__animated", "animate__fadeOut");
      tableRow.addEventListener("animationend", () => {
        tableRow.remove();
        calculateTotal();
      });
    }
  });

  const incrementBtn = tableRow.querySelector(".record-quantity-increment");
  const decrementBtn = tableRow.querySelector(".record-quantity-decrement");
  const recordQty = tableRow.querySelector(".record-quantity");
  const recordCost = tableRow.querySelector(".record-cost");

  const updateCost = (qty) => {
    const cost = qty * price;
    const formattedCost = cost.toLocaleString();
    recordCost.setAttribute("data-value", cost);
    recordCost.textContent = formattedCost;
  };

  incrementBtn.addEventListener("click", () => {
    const newQty = parseFloat(recordQty.dataset.value) + 1;
    recordQty.textContent = newQty.toLocaleString();
    recordQty.setAttribute("data-value", newQty);
    updateCost(newQty);
    calculateTotal();
  });
  decrementBtn.addEventListener("click", () => {
    const qty = parseFloat(recordQty.dataset.value);
    if (qty > 1) {
      const newQty = qty - 1;
      recordQty.textContent = newQty.toLocaleString();
      recordQty.setAttribute("data-value", newQty);
      updateCost(newQty);
      calculateTotal();
    }
  });

  return tableRow;
};

const calculateTotal = () => {
  const total = [...document.querySelectorAll(".record-cost")].reduce(
    (pv, cv) => pv + parseFloat(cv.dataset.value),
    0
  );
  const formattedTotal = total.toLocaleString();

  let totalCost = 0;
  let tax = 0;
  if (total > 0) {
    tax = total * (parseFloat(recordsTax.dataset.tax) / 100);
    totalCost = total + tax;
  }
  recordsTax.textContent = tax.toLocaleString();
  const formattedTotalCost = totalCost.toLocaleString();
  recordsTotal.textContent = formattedTotal;
  recordsTotalCost.textContent = formattedTotalCost;
};

// initialize product
products.forEach((el) => {
  product.append(new Option(el.name, el.id));
  inventories.append(createItem(el.name, el.price));
});

// process

// add record
newRecord.addEventListener("submit", (e) => {
  e.preventDefault();

  const isExistedRow = document.querySelector(
    `[product-id='${product.value}']`
  );

  if (isExistedRow) {
    let currentPrice = isExistedRow.querySelector(".record-price");
    let currentQuantity = isExistedRow.querySelector(".record-quantity");
    let currentCost = isExistedRow.querySelector(".record-cost");

    let newQuantity =
      parseFloat(currentQuantity.dataset.value) + quantity.valueAsNumber;
    let newCost = parseFloat(currentPrice.dataset.value) * newQuantity;

    currentQuantity.textContent = newQuantity.toLocaleString();
    currentQuantity.setAttribute("data-value", newQuantity);
    currentCost.textContent = newCost.toLocaleString();
    currentCost.setAttribute("data-value", newCost);
  } else {
    // create new row
    recordRows.append(createRecordRow(product.value, quantity));
  }

  // clear form
  newRecord.reset();

  // calculate total cost
  calculateTotal();
});

newItem.addEventListener("submit", (e) => {
  e.preventDefault();

  const newProductName = newItemName.value;
  const newProductPrice = newItemPrice.valueAsNumber;

  // products array update
  let newItemId = products[products.length - 1].id + 1;
  const newItemObj = {
    id: newItemId,
    name: newProductName,
    price: newProductPrice,
  };

  products.push(newItemObj);

  // form reset
  newItem.reset();

  // ui update
  product.append(new Option(newProductName, newItemId));
  inventories.append(createItem(newProductName, newProductPrice));
});
