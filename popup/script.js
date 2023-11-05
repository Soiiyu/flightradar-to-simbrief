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

        chrome.tabs.sendMessage(tab.id, { action: 'extract-flight' }, res => {
            if (res.status == 'SUCCESS') {
                const { origin, destination, airline, flightNumber, aircraftType } = res

                departureElement.textContent = origin
                arrivalElement.textContent = destination
                airlineElement.textContent = airline
                flightNumberElement.textContent = flightNumber
                aircraftElement.textContent = aircraftType

                data.textContent = ''

                simBriefURL = `https://dispatch.simbrief.com/options/custom?airline=${airline}&fltnum=${flightNumber}&type=${aircraftType}&orig=${origin}&dest=${destination}`;
            } else {
                simBriefURL = ''
                data.textContent = `An error occured loading the flight.\nThis usually happens if no flight is selected.`
            }
        })
    });
}

getFlight()

function extractFlight() {
    const hidden = document.querySelectorAll('[data-testid=base-tooltip__content]');
    const origin = hidden[1].textContent;
    const destination = hidden[2].textContent;

    const callsign = document.querySelector("[data-testid=aircraft-panel__header__callsign]").textContent;
    const airline = callsign.substring(0, 3)
    const flightNumber = callsign.substring(3)

    const aircraftType = document.querySelector("[data-testid=aircraft-panel__header__model]").textContent

    const simBriefURL = `https://dispatch.simbrief.com/options/custom?airline=${airline}&fltnum=${flightNumber}&type=${aircraftType}&orig=${origin}&dest=${destination}`;

    console.log(origin, destination, airline, flightNumber, aircraftType)
    console.log(simBriefURL)
    chrome.tabs.create({ url: simBriefURL });
}