// options.js
import * as constants from './constants.js';
import * as helper from './helper.js';

// Declare profiles and constants
let profiles = [];
const MAX_PROFILES = 10;

// Utility function to generate HTML options
const generateOptions = (options, selectedValue) => {
  return options.map(option => 
      `<option value="${option.value}" ${option.value === selectedValue ? 'selected' : ''}>${option.text}</option>`
  ).join('');
};

// Function to create the HTML template for a profile
const createProfileTemplate = (profile, index) => {
    return `
        <div class="person" id="person${index}">
            <h3>Person ${index}</h3>
            <ul>
                <li>
                    <label for="nationality${index}">Nationality:</label>
                    <select id="nationality${index}">
                    ${generateOptions(constants.COUNTRY_LIST, profile.nationality)}
                    </select>
                </li>
                <li>
                    <label for="name${index}">Full Name:</label>
                    <input type="text" id="name${index}" value="${profile.name || ''}">
                </li>
                <li>
                    <label for="passNo${index}">Passport No:</label>
                    <input type="text" id="passNo${index}" value="${profile.passNo || ''}">
                </li>
                <li>
                    <label for="dob${index}">Date of Birth:</label>
                    <input type="date" id="dob${index}" value="${profile.dob || ''}">
                </li>
                <li>
                    <label for="email${index}">Email:</label>
                    <input type="email" id="email${index}" value="${profile.email || ''}">
                </li>
                <li>
                    <label for="region${index}">Country Code/ Region:</label>
                    <select id="region${index}">
                    ${generateOptions(constants.COUUNTRY_CODES, profile.region)}
                    </select>
                </li>
                <li>
                    <label for="mobile${index}">Mobile Number:</label>
                    <input type="text" id="mobile${index}" value="${profile.mobile || ''}">
                </li>
                <li>
                    <label for="passExpDte${index}">Passport Expiration Date:</label>
                    <input type="date" id="passExpDte${index}" value="${profile.passExpDte || ''}">
                </li>
                <li>
                    <label for="sex${index}">Sex:</label>
                    <select id="sex${index}">
                      ${generateOptions(constants.SEX_OPTIONS, profile.sex)}
                    </select>
                </li>
                <li>
                    <label for="trvlMode${index}">Travel Mode:</label>
                    <select id="trvlMode${index}">
                      ${generateOptions(constants.MODE_OPTIONS, profile.trvlMode)}
                    </select>
                </li>
                <li>
                    <label for="accommodationStay${index}">Accommodation Stay:</label>
                    <select id="accommodationStay${index}">
                      ${generateOptions(constants.ACCOMMODATION_OPTIONS, profile.accommodationStay)}
                    </select>
                </li>
                <li>
                    <label for="accommodationAddress1${index}">Accommodation Address:</label>
                    <input type="text" id="accommodationAddress1${index}" value="${profile.accommodationAddress1 || ''}">
                </li>
                <li>
                    <label for="accommodationState${index}">Accommodation State:</label>
                    <select id="accommodationState${index}">
                        ${generateOptions(constants.MALAYSIA_STATE_OPTIONS, profile.accommodationState)}
                    </select>
                </li>
                <li>
                    <label for="accommodationCity${index}">Accommodation City:</label>
                    <select id="accommodationCity${index}">
                        
                    </select>
                </li>
                <li>
                    <label for="accommodationPostcode${index}">Accommodation Postcode:</label>
                    <input type="text" id="accommodationPostcode${index}" value="${profile.accommodationPostcode || ''}">
                </li>
                <li>
                    <label for="embark${index}">Last port of Embarkment:</label>
                      <select id="embark${index}">
                          ${generateOptions(constants.COUNTRY_LIST, profile.embark)}
                      </select>
                </li>
            </ul>
        </div>
    `;
};

// Function to render all profiles in the DOM
function renderProfiles() {
    const container = document.getElementById('profilesContainer');
    container.innerHTML = '';
    profiles.forEach((profile, index) => {
        container.insertAdjacentHTML('beforeend', createProfileTemplate(profile, index + 1));
    });
    updateProfileSelector();
}

// Function to update the profile selector dropdown
function updateProfileSelector() {
    const selector = document.getElementById('profileNumber');
    selector.innerHTML = '';
    profiles.forEach((_, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Profile ${index + 1}`;
        selector.appendChild(option);
    });
}

// Function to add a new profile
function addProfile() {
  if (profiles.length >= MAX_PROFILES) {
      alert('Maximum number of profiles reached');
      return;
  }
  profiles.push({
      nationality: '',
      name: '',
      passNo: '',
      dob: '',
      email: '',
      region: '',
      mobile: '',
      passExpDte: '',
      sex: '',
      trvlMode: '',
      accommodationStay: '',
      accommodationAddress1: '',
      accommodationState: '',
      accommodationCity: '',
      accommodationPostcode: '',
      embark: ''
  });
  renderProfiles();

  // Optionally, set the new profile as selected
  const newProfileIndex = profiles.length - 1;
  chrome.storage.sync.set({ selectedProfile: newProfileIndex }, () => {
      console.log(`SelectedProfile set to ${newProfileIndex}`);
      document.getElementById('profileNumber').value = newProfileIndex;
  });
}

// Function to save all profiles to Chrome storage
function saveProfiles() {
  const selector = document.getElementById('profileNumber');
  const selectedProfileIndex = parseInt(selector.value, 10) || 0;

    const savedProfiles = profiles.map((profile, index) => {
        const profileNumber = index + 1;
        return {
            nationality: document.getElementById(`nationality${profileNumber}`).value,
            name: document.getElementById(`name${profileNumber}`).value,
            passNo: document.getElementById(`passNo${profileNumber}`).value,
            dob: document.getElementById(`dob${profileNumber}`).value,
            email: document.getElementById(`email${profileNumber}`).value,
            confirmEmail: document.getElementById(`email${profileNumber}`).value,
            region: document.getElementById(`region${profileNumber}`).value,
            mobile: document.getElementById(`mobile${profileNumber}`).value,
            passExpDte: document.getElementById(`passExpDte${profileNumber}`).value,
            sex: document.getElementById(`sex${profileNumber}`).value,
            trvlMode: document.getElementById(`trvlMode${profileNumber}`).value,
            accommodationStay: document.getElementById(`accommodationStay${profileNumber}`).value,
            accommodationAddress1: document.getElementById(`accommodationAddress1${profileNumber}`).value,
            accommodationState: document.getElementById(`accommodationState${profileNumber}`).value,
            accommodationCity: document.getElementById(`accommodationCity${profileNumber}`).value,
            accommodationPostcode: document.getElementById(`accommodationPostcode${profileNumber}`).value,
            embark: document.getElementById(`embark${profileNumber}`).value
        };
    });

    chrome.storage.sync.set(
      { profiles: savedProfiles, selectedProfile: selectedProfileIndex },
      () => {
          const status = document.getElementById('status');
          status.textContent = 'Options saved.';
          status.style.color = '#28a745';
          console.log("Options saved.");
          console.log(`Saved ${savedProfiles.length} profiles.`);
          console.log(`Selected Profile Index: ${selectedProfileIndex}`);
          console.log("-------");
          setTimeout(() => {
              status.textContent = '';
          }, 750);
      });
}

// Default options for a new profile
const default_options = {
    name: "",
    passNo: "",
    dob: "",
    email: "",
    region: "",
    mobile: "",
    passExpDte: "",
    sex: "",
    nationality: "",
    trvlMode: "",
    accommodationStay: "",
    accommodationAddress1: "",
    accommodationState: "",
    accommodationCity: "",
    accommodationPostcode: "",
    embark: ""
};

// Function to load profiles from Chrome storage
function loadProfiles() {
  chrome.storage.sync.get(['profiles', 'selectedProfile'], (result) => {
      // Initialize profiles with saved data or a default profile
      profiles = result.profiles || [Object.assign({}, default_options)];
      renderProfiles();

      // Retrieve the selectedProfile index
      const selectedProfileIndex = result.selectedProfile;

      // After rendering profiles, populate accommodationCity and set selected option
      profiles.forEach((profile, index) => {
          helper.retrieveRefCity(profile.accommodationState, index + 1, profile.accommodationCity);
      });

      // Reference to the profile selector dropdown
      const selector = document.getElementById('profileNumber');

      // Check if selectedProfileIndex is valid
      if (
          typeof selectedProfileIndex === 'number' &&
          selectedProfileIndex >= 0 &&
          selectedProfileIndex < profiles.length
      ) {
          selector.value = selectedProfileIndex;
      } else {
          // Default to first profile if selectedProfile is invalid or not set
          selector.value = 0;
          chrome.storage.sync.set({ selectedProfile: 0 }, () => {
              console.log("Default selectedProfile set to 0");
          });
      }
  });
}

// Event listeners
document.addEventListener('DOMContentLoaded', loadProfiles);
document.getElementById('addProfile').addEventListener('click', addProfile);
document.getElementById('save').addEventListener('click', saveProfiles);
document.getElementById('load').addEventListener('click', loadProfiles);
document.getElementById('profileNumber').addEventListener('change', (event) => {
  const selectedIndex = parseInt(event.target.value, 10) || 0;
  chrome.storage.sync.set({ selectedProfile: selectedIndex }, () => {
      console.log(`SelectedProfile updated to ${selectedIndex}`);
  });
});

$(document).on('change', '[id^="accommodationState"]', function() {
  const state = $(this).val();
  const index = this.id.replace('accommodationState', '');
  const selectedCity = profiles[index - 1]?.accommodationCity || '';
  helper.retrieveRefCity(state, index, selectedCity);
});