class FullName {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

class UI {
  addNameToList(fullName) {
    const list = document.getElementById("name-list");
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${fullName.firstName}</td>
        <td>${fullName.lastName}</td>
        <td><a href="#" class="delete">x</a></td>`;
    list.appendChild(tr);
  }

  removeNameFromList(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }
  // Clears input fields
  clearFields() {
    const fields = document.querySelectorAll("input[type=text]");
    for (let i = 0; i < fields.length; i++) {
      fields[i].value = "";
    }
  }

  // show alert in case of success or error
  showAlert(alertMsg, alertType) {
    const div = document.createElement("div");
    const msg = document.createTextNode(alertMsg);
    div.className = `alert ${alertType}`;
    div.appendChild(msg);

    const container = document.querySelector(".container");
    const form = document.querySelector("#name-form");

    container.insertBefore(div, form);

    // remove alert after x seconds
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  pickName(names) {
    let h3 = document.querySelector(".randomized-name");
    let index;
    let counter = 0;
    let factor = 5;
    let times = 70;
    var myFunction = function () {
      counter++;

      if (--times >= 0) {
        setTimeout(myFunction, counter * factor);
        index = Math.floor(Math.random() * names.length);
        h3.textContent = `${names[index].firstName} ${names[index].lastName}`;
        console.log("hello there");
      } else {
        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti();
        console.log("under 0");
      }
    };

    setTimeout(myFunction, counter);
  }
}

class Store {
  static getNames() {
    let names = localStorage.getItem("names");
    // get names or create it
    if (names === null) {
      names = [];
    } else {
      names = JSON.parse(localStorage.getItem("names"));
    }
    return names;
  }
  static displayNames() {
    const names = Store.getNames();
    names.forEach((name) => {
      const ui = new UI();
      ui.addNameToList(name);
    });
  }
  static addName(name) {
    const names = Store.getNames();
    names.push(name);
    localStorage.setItem("names", JSON.stringify(names));
  }
  static removeName(firstName, lastName) {
    const names = Store.getNames();
    names.forEach((fullName, index) => {
      if (fullName.firstName === firstName && fullName.lastName === lastName) {
        // remove this one from storage
        names.splice(index, 1);
      }
    });
    localStorage.setItem("names", JSON.stringify(names));
  }
}

// Page loaded event listener
document.addEventListener("DOMContentLoaded", Store.displayNames);

// Add name event listener
document.getElementById("name-form").addEventListener("submit", function (e) {
  // Get values
  const firstName = document.getElementById("fname").value;
  const lastName = document.getElementById("lname").value;
  const fullName = new FullName(firstName, lastName);

  const ui = new UI();
  // Add name to list
  let alertMsg;
  if (firstName === "" || lastName == "") {
    alertMsg = "Please check your inputs and try again";
    alertType = "error";
    ui.showAlert(alertMsg, alertType);
  } else {
    alertMsg = `${firstName} ${lastName} has been added to the list`;
    alertType = "success";
    ui.showAlert(alertMsg, alertType);
    ui.addNameToList(fullName);
    // Add name to LS
    Store.addName(fullName);
  }

  // Clear fields
  ui.clearFields();

  e.preventDefault();
});

// remove name event listner - use event delegation
document.getElementById("name-list").addEventListener("click", function (e) {
  const ui = new UI();
  ui.removeNameFromList(e.target);
  const firstName =
    e.target.parentElement.previousElementSibling.previousElementSibling
      .textContent;
  const lastName = e.target.parentElement.previousElementSibling.textContent;

  console.log(firstName, lastName);
  Store.removeName(firstName, lastName);
  e.preventDefault();
});

// Draw name event listener
document.getElementById("draw-name").addEventListener("click", function (e) {
  const names = Store.getNames();
  const ui = new UI();
  ui.pickName(names);
  e.preventDefault();
});
