//to find out company domain..
// const apiToken = "6934acb0e7f5a55ad942a23c7422823c53907d44";
// const url = "https://api.pipedrive.com/v1/users/me?api_token=" + apiToken;

// console.log("Sending request...");

// fetch(url)
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   })
//   .then((data) => {
//     if (data && data.data && data.data.company_domain) {
//       console.log("User company_domain is: " + data.data.company_domain);
//     }
//   })
//   .catch((error) => console.error("Error:", error));
// ..which is: nutty-gorilla

const apiToken = "6934acb0e7f5a55ad942a23c7422823c53907d44";
const companyDomain = "nutty-gorilla";
// const url = `https://${companyDomain}.pipedrive.com/api/v1/dealFields?api_token=${apiToken}`;
// fetch(url)
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     return response.json();
//   })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => console.error("Error:", error));

//CREATING A NEW DEAL VIA PIPEDRIVE API
document
  .getElementById("jobForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Form data
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    //
    const jobType = document.getElementById("jobType").value;
    const jobSource = document.getElementById("jobSource").value;
    const jobDescription = document.getElementById("jobDescription").value;
    //
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zipCode = document.getElementById("zipCode").value;
    const locationType = document.getElementById("locationType").value;
    //
    const date = document.getElementById("date");
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const technician = document.getElementById("technician").value;

    // Custom fields
    const firstNameKey = await createCustomField("First name", "varchar");
    const lastNameKey = await createCustomField("Last name", "varchar");
    const phoneKey = await createCustomField("Phone", "phone");
    const emailKey = await createCustomField("Email", "varchar");
    //
    const jobTypeKey = await createCustomField("Job type", "enum", [
      "Option1",
      "Option2",
      "Option3",
    ]);
    const jobSourceKey = await createCustomField("Job source", "enum", [
      "Source1",
      "Source2",
      "Source3",
    ]);
    const jobDescriptionKey = await createCustomField("Job comment", "text");
    //
    const addressKey = await createCustomField("Address", "address");
    const cityKey = await createCustomField("City", "varchar");
    const stateKey = await createCustomField("State", "varchar");
    const zipCodeKey = await createCustomField("Zip Code", "varchar");
    const locationTypeKey = await createCustomField("Location Type", "enum", [
      "Tampa",
      "Other",
    ]);
    //
    const dateKey = await createCustomField("Date", "date");
    const startTimeKey = await createCustomField("Start Time", "time");
    const endTimeKey = await createCustomField("End Time", "time");
    const technicianKey = await createCustomField("Technician", "user");

    // Set the deal parameters
    const dealData = {
      title: `Job for ${firstName} ${lastName}`,
      [firstNameKey]: firstName,
      [lastNameKey]: lastName,
      [phoneKey]: phone,
      [emailKey]: email,
      [jobTypeKey]: jobType,
      [jobSourceKey]: jobSource,
      [jobDescriptionKey]: jobDescription,
      [addressKey]: address,
      [cityKey]: city,
      [stateKey]: state,
      [zipCodeKey]: zipCode,
      [locationTypeKey]: locationType,
      [dateKey]: date,
      [startTimeKey]: startTime,
      [endTimeKey]: endTime,
      [technicianKey]: technician,
    };

    //API endpoint URL
    const apiUrl = `https://${companyDomain}.pipedrive.com/api/v1/deals?api_token=${apiToken}`;

    axios
      .post(apiUrl, dealData)
      .then((response) => {
        console.log("Deal created successfully:", response.data.data);
        updateButtonStyle("red", "Request is sent");
        document.getElementById("jobForm").reset();
      })
      .catch((error) => {
        console.error("Error creating deal:", error.response.data);
        updateButtonStyle("", "Create job");
      });
  });

// CUSTOM FIELDS
// API endpoint URL for creating custom fields
const apiUrl = `https://YOUR_COMPANY_DOMAIN.pipedrive.com/api/v1/dealFields?api_token=${apiToken}`;

// to create a new custom field
async function createCustomField(
  name,
  fieldType,
  options = [],
  addVisibleFlag = true
) {
  try {
    const response = await axios.post(apiUrl, {
      name,
      field_type: fieldType,
      options,
      add_visible_flag: addVisibleFlag,
    });

    console.log(
      `Custom field '${name}' created successfully. Key: ${response.data.data.key}`
    );
    return response.data.data.key;
  } catch (error) {
    console.error("Error creating custom field:", error.response.data);
    throw error;
  }
}

//to handle button change
function updateButtonStyle(color, newText) {
  const button = document.getElementById("createJobButton");
  button.style.backgroundColor = color;
  button.innerText = newText;
}
document
  .getElementById("closeFormButton")
  .addEventListener("click", function () {
    toggleFormVisibility();
    updateButtonStyle("", "Create job");
  });

document
  .getElementById("openFormButton")
  .addEventListener("click", toggleFormVisibility);

function toggleFormVisibility() {
  const formContainer = document.getElementById("jobFormContainer");
  const overlay = document.getElementById("overlay");
  if (formContainer.style.display === "none") {
    formContainer.style.display = "block";
    overlay.style.display = "block";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  } else {
    formContainer.style.display = "none";
    overlay.style.display = "none";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
  }
}

//to format phone number
const phoneNumberInput = document.getElementById("phone");
phoneNumberInput.addEventListener("input", function () {
  const cleaned = phoneNumberInput.value.replace(/\D/g, "");
  const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  phoneNumberInput.value = formatted;
});
