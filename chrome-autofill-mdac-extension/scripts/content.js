// content.js
// Function to autofill form fields based on the selected profile
function autofillForm(profile) {
  if (!profile) {
      console.error("No profile data available to autofill.");
      return;
  }

  // Mapping of profile fields to form element IDs
  const fieldMapping = {
      name: 'name',
      sex: 'sex',
      nationality: 'nationality',
      passNo: 'passNo',
      dob: 'dob',
      email: 'email',
      confirmEmail: 'confirmEmail',
      passExpDte: 'passExpDte',
      region: 'region',
      mobile: 'mobile',
      trvlMode: 'trvlMode',
      accommodationStay: 'accommodationStay',
      accommodationAddress1: 'accommodationAddress1',
      accommodationState: 'accommodationState',
      accommodationCity: 'accommodationCity',
      accommodationPostcode: 'accommodationPostcode',
      embark: 'embark',
      vesselNm: 'vesselNm' // Assuming 'vesselNm' is a field to be set to "NA"
  };

  // Iterate over each field and set the corresponding form element's value
  for (const [key, elementId] of Object.entries(fieldMapping)) {
      const element = document.getElementById(elementId);
      if (element) {
          if (element.tagName.toLowerCase() === 'select') {
              // For select elements, set the selected value
              element.value = profile[key] || '';
              if(key === 'accommodationState'){
                console.log('accommodationState', profile[key])
                retrieveRefCity(profile[key])
              }
              if(key === 'accommodationCity'){
                setTimeout(() => {element.value = profile[key] || '';}, 1000)
              }
          } else if (element.type === 'checkbox' || element.type === 'radio') {
              // For checkbox or radio inputs, set the checked property
              element.checked = profile[key] === 'checked';
          } else {
              // For other input types, set the value directly
              element.value = profile[key] || '';
          }
      } else {
          console.warn(`Element with ID '${elementId}' not found on the page.`);
      }
  }

  // Specifically set 'vesselNm' to "NA" if it exists
  const vesselNmElement = document.getElementById('vesselNm');
  if (vesselNmElement) {
      vesselNmElement.value = "NA";
  }
}

// Function to load profiles from Chrome storage and autofill the form
function loadAndAutofill() {
  init()
  console.log("Loading profiles from Chrome storage...");
  
  chrome.storage.sync.get(['profiles', 'selectedProfile'], (result) => {
      const profiles = result.profiles;
      const selectedProfileIndex = result.selectedProfile;

      console.log("Retrieved profiles:", profiles);
      console.log("Selected profile index:", selectedProfileIndex);

      if (!profiles || !Array.isArray(profiles) || profiles.length === 0) {
          console.error("No profiles found in storage.");
          return;
      }

      // Validate selectedProfileIndex
      const profileIndex = (typeof selectedProfileIndex === 'number' && selectedProfileIndex >= 0 && selectedProfileIndex < profiles.length)
          ? selectedProfileIndex
          : 0; // Default to first profile if invalid

      const selectedProfile = profiles[profileIndex];

      console.log(`Autofilling form with Profile ${profileIndex + 1}:`, selectedProfile);

      autofillForm(selectedProfile);
  });
}

function init(){
  let confirmEmailElement = document.getElementById('confirmEmail');
  confirmEmailElement.onpaste = true
}

function retrieveRefCity(category) {
  var url = '/mdac/register?retrieveRefCity&state=' + category;
  $.get(url,
          function (data) {
              if (data === 'error') {
                  alert('State selected error');
              } else {
                  $('.accommodationCity').html(data);
              }
          }, 'html');
}


// Wait for the DOM to be fully loaded before attempting to autofill
// document.addEventListener('DOMContentLoaded', loadAndAutofill);

loadAndAutofill();

// Optional: If the form might load elements dynamically after DOMContentLoaded,
// consider using MutationObserver to detect when form elements are available