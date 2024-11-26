export function retrieveRefCity(state, index, selectedCity = '') {
    const url = `https://imigresen-online.imi.gov.my/mdac/register?retrieveRefCity&state=${encodeURIComponent(state)}`;
    
    $.get(url, function (data) {
        if (data === 'error') {
            alert('State selection error');
        } else {
            const $citySelect = $(`#accommodationCity${index}`);
            $citySelect.html(data);
            
            if (selectedCity) {
                $citySelect.val(selectedCity);
            }
        }
    }, 'html');
}

// HTML string with option tags
export function optionHtmlToJSON(htmlString) {
    // Convert HTML string to a DOM object
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Select all option elements
    const options = doc.querySelectorAll('option');

    // Convert options to JSON
    return Array.from(options).map(option => ({
        value: option.value.trim(),
        text: option.textContent.trim()
    }));
}
