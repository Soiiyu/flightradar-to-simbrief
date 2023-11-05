const extractButton = document.getElementById('extractFlight')
const data = document.getElementById('data')

const departureElement = document.getElementById('departure');
const arrivalElement = document.getElementById('arrival');
const airlineElement = document.getElementById('airline');
const flightNumberElement = document.getElementById('flightNumber');
const aircraftElement = document.getElementById('aircraftType');

// Open the new flight plan in a new SimBrief tab if there is a url
extractButton.addEventListener('click', () => {
    if (simBriefURL !== '') chrome.tabs.create({ url: simBriefURL });
});

let simBriefURL = ''

function getFlight() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];

        // Request flight details from content.js
        chrome.tabs.sendMessage(tab.id, { action: 'extract-flight' }, res => {
            if (res.status && res.status == 'SUCCESS') {
                // If we successfully got the data, update the according elements
                const { origin, destination, airline, flightNumber, aircraftType } = res

                departureElement.textContent = origin
                arrivalElement.textContent = destination
                airlineElement.textContent = airline
                flightNumberElement.textContent = flightNumber
                aircraftElement.textContent = aircraftType

                data.textContent = ''

                simBriefURL = `https://dispatch.simbrief.com/options/custom?airline=${airline}&fltnum=${flightNumber}&type=${aircraftType}&orig=${origin}&dest=${destination}`;
            } else {
                // If something goes wrong, reset the url and display this message
                simBriefURL = ''
                data.textContent = `An error occured loading the flight.\nThis usually happens if no flight is selected.`
            }
        })
    });
}

getFlight()