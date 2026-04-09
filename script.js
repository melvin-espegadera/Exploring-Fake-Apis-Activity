const personalUser = {
  id: "2023-005419",
  firstName: "Melvin",
  lastName: "Espegadera",
  username: "Zenith",
  email: "melvin.espegadera@nmsc.edu.ph",
  zipcode: "7215"
};

const tableBody = document.getElementById("user-table-body");
const statusText = document.getElementById("status");

function setStatus(message, type) {
  statusText.textContent = message;
  statusText.className = "badge rounded-pill px-3 py-2 status-pill";

  if (type === "success") {
    statusText.classList.add("text-bg-success");
    return;
  }

  if (type === "error") {
    statusText.classList.add("text-bg-danger");
    return;
  }

  statusText.classList.add("text-bg-warning");
}

function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ")
  };
}

function mapApiUser(user) {
  const { firstName, lastName } = splitName(user.name);

  return {
    id: user.id,
    firstName,
    lastName,
    username: user.username,
    email: user.email,
    zipcode: user.address.zipcode
  };
}

function rowTemplate(user, isPersonal = false) {
  return `
    <tr class="${isPersonal ? "personal-row" : ""}">
      <td>${user.id}</td>
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.zipcode}</td>
    </tr>
  `;
}

function renderTable(users) {
  tableBody.innerHTML = users
    .map((user, index) => rowTemplate(user, index === 0))
    .join("");
}

async function loadUsers() {
  try {
    setStatus("Loading API data...", "loading");

    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const apiUsers = await response.json();
    const combinedUsers = [personalUser, ...apiUsers.map(mapApiUser)];

    renderTable(combinedUsers);
    setStatus(`Loaded ${combinedUsers.length} records successfully.`, "success");
  } catch (error) {
    renderTable([personalUser]);
    tableBody.insertAdjacentHTML(
      "beforeend",
      `
        <tr>
          <td colspan="6" class="error-cell">
            API data could not be loaded right now. Your personal information is still displayed first.
          </td>
        </tr>
      `
    );
    setStatus("API request failed. Showing available local data.", "error");
    console.error(error);
  }
}

loadUsers();
