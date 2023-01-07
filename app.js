window.onload = () => {
  hideOrders(7);
  allCustomers();
  main();
};
let isFiltered = false,
  statusValue,
  paymentValue;
function main() {
  const toggle = document.querySelector(".toggle"),
    navigation = document.querySelector("nav"),
    main = document.querySelector("main"),
    viewAllBtn = document.getElementById("viewAllBtn"),
    filterBtn = document.getElementById("filterBtn"),
    navList = navigation.querySelectorAll("li");

  // toggle navigation
  toggle.addEventListener("click", () => {
    main.classList.toggle("active");
    toggle.classList.toggle("active");
    navigation.classList.toggle("active");
  });

  // add active navbar of active class
  navList.forEach((item) => {
    item.addEventListener("click", () => {
      if (item == navList[0]) return;
      navigation.querySelector(".active").classList.remove("active");
      item.classList.add("active");
    });
  });

  // view all order details
  viewAllBtn.addEventListener("click", () => {
    if (viewAllBtn.classList.contains("viewAll")) {
      hideOrders(customers.length);

      viewAllBtn.classList.remove("viewAll");
      viewAllBtn.innerHTML = "Hide All";
      viewAllBtn.classList.add("hideAll");

      // add filter button
      filterBtn.classList.add("active");
      filterBtn.innerHTML = "Filter";
    } else {
      hideOrders(7);
    }
  });

  filterBtn.addEventListener("click", () => {
    if (isFiltered) {
      return;
    } else {
      isFiltered = true;
      filter();
    }
  });
}
// show all customers
function allCustomers() {
  const tbody = document.querySelector(".recentCustomers tbody");

  tbody.innerHTML = "";
  for (let i = 0; i < customers.length; i++) {
    let { name, img, country } = customers[i];
    tbody.innerHTML += `
    <tr>
        <td width="60px">
            <div class="imgBox">
                <img src="${img}" alt="">
            </div>
        </td>
        <td>
            <h4>${name}<br><span>${country}</span></h4>
        </td>
    </tr>
    `;
  }
}
// hide order details
function hideOrders(length) {
  const tbody = document.querySelector(".recentOrders tbody"),
    filterBtn = document.getElementById("filterBtn"),
    hideAll = document.querySelector(".hideAll");

  tbody.innerHTML = "";
  for (let i = 0; i < length; i++) {
    let { name, price, payment, status } = customers[i];
    tbody.innerHTML += `
    <tr>
      <td class='capitalize'>${i + 1}) ${name}</td>
      <td>${price} $</td>
      <td class="paymentEle">${payment}</td>
      
       <td class="statusEl"><span class="status ${status} capitalize">${status}</span></td>
    </tr>
    `;
    if (hideAll) {
      hideAll.classList.remove("hideAll");
      hideAll.innerHTML = "View All";
      hideAll.classList.add("viewAll");

      // remove filter button
      filterBtn.classList.remove("active");
      filterBtn.innerHTML = "";
    }
  }
  if (isFiltered) {
    removeDropdown();
    isFiltered = false;
  }
}
//add dropdown element in table heading
function filter() {
  let obj = {};
  const payment = document.getElementById("payment");
  const status = document.getElementById("status");

  const filterEl = Array(
    document.querySelectorAll(".paymentEle"),
    document.querySelectorAll(".statusEl")
  );

  if (payment.children.length === 0 && status.children.length === 0) {
    createElement(payment);
    createElement(status);
  }

  const tableFilter = document.querySelectorAll(".table_filter");

  for (let i = 0; i < filterEl.length; i++) {
    let objKey = i === 0 ? "payment" : "status";

    filterEl[i].forEach((ele) => {
      let cell_value = ele.innerText;
      if (obj.hasOwnProperty(objKey)) {
        if (obj[objKey].includes(cell_value)) {
        } else {
          obj[objKey].push(cell_value);
        }
      } else {
        obj[objKey] = new Array(cell_value);
      }
    });

    addDropdown(obj, tableFilter[i], objKey);
  }

  [...tableFilter].forEach((ele) => {
    ele.onchange = function () {
      applyFilter(ele);
    };
  });
}
//add dropdown option
function addDropdown(obj, parentEle, key) {
  obj[key].forEach((ele) => {
    parentEle.innerHTML += `
    <option value='${ele}'>${ele}</option>
    `;
  });
  getValue();
}

//create select and option element
function createElement(parentNode) {
  let select = document.createElement("select");
  select.classList.add("table_filter");
  select.id = parentNode.id === "payment" ? "paymentEle" : "statusEle";
  let option = document.createElement("option");
  option.setAttribute("value", "all");
  select.appendChild(option);
  parentNode.appendChild(select);
}
//remove dropdown
function removeDropdown() {
  let tableFilter = document.querySelectorAll(".table_filter");

  tableFilter[0].remove();
  tableFilter[1].remove();
}

//get payment and status value
function getValue() {
  let paymentEle = document.querySelector("#paymentEle");
  let statusEle = document.querySelector("#statusEle");

  paymentEle.addEventListener("change", function (event) {
    let value = event.target.value;
    if (value !== paymentEle.children[0].innerHTML) {
      paymentValue = value;
    }
  });
  statusEle.addEventListener("change", function (event) {
    let value = event.target.value;
    if (statusEle.children[0].innerHTML !== value) {
      statusValue = value;
    }
  });
}

// //apply filter
function applyFilter(ele) {
  let filterCutomersObj = [];
  const length = ele.children.length;

  let paymentEle = document.querySelector("#paymentEle");
  let statusEle = document.querySelector("#statusEle");

  for (let i = 0; i < length; i++) {
    if (ele.children[i].selected) {
      if (ele.children[i] !== ele.children[0]) {
        customers.forEach((customer) => {
          if (
            paymentValue &&
            statusValue &&
            paymentValue !== "all" &&
            statusValue !== "all"
          ) {
            if (
              statusValue.toLowerCase() == customer.status &&
              paymentValue == customer.payment
            ) {
              filterCutomersObj.push(customer);
            }
          } else if (ele.children[i].innerHTML == customer.payment) {
            filterCutomersObj.push(customer);
          } else if (
            ele.children[i].innerHTML.toLowerCase() == customer.status
          ) {
            filterCutomersObj.push(customer);
          }
        });
      } else {
        if (paymentEle.children[0].selected && statusEle.children[0].selected) {
          Object.assign(filterCutomersObj, customers);
        } else {
          customers.forEach((customer) => {
            if (paymentValue == customer.payment) {
              filterCutomersObj.push(customer);
            } else if (statusValue.toLowerCase() == customer.status) {
              filterCutomersObj.push(customer);
            }
          });
        }
      }
    }
  }

  filteredCustomers(filterCutomersObj);
}

// //search order by payment and status
function filteredCustomers(obj) {
  const tbody = document.querySelector("tbody");

  tbody.innerHTML = "";
  for (let i = 0; i < obj.length; i++) {
    let { name, price, payment, status } = obj[i];
    tbody.innerHTML += `
    <tr>
    <td class='capitalize'>${i + 1}) ${name}</td>
    <td>${price} $</td>
    <td class="paymentEle">${payment}</td>
    <td class="statusEl"><span class="status ${status} capitalize">${status}</span></td>
    </tr>
    `;
  }

  if (obj.length === 0) {
    tbody.innerHTML = "";
    tbody.innerHTML = `<tr class='no-data-found'><td colspan='4' style='text-align:center;font-weight:bold'>NO DATA FOUND...!</td></tr>`;
  }
}
