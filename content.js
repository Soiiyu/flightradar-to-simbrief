chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extract-flight') {
        try {
            // Grab the origin and destination from the hidden tooltip
            const hidden = document.querySelectorAll('[data-testid=base-tooltip__content]');
            let origin, destination;

            // Find the offset of the origin and destination
            for (let i = 1; i < hidden.length; i++) {
                origin = hidden[i].textContent.slice(-5, -1);
                destination = hidden[i + 1].textContent.slice(-5, -1);

                if (origin.toUpperCase() == origin) i = hidden.length;
            }

            // Grab the call sign and split it into airline and flight number
            const callsign = document.querySelector("[data-testid=aircraft-panel__header__callsign]").textContent;
            const airline = callsign.substring(0, 3)
            const flightNumber = callsign.substring(3)

            // Grab the aircraft ICAO type code
            const aircraftType = document.querySelector("[data-testid=aircraft-panel__header__model]").textContent

            sendResponse({
                status: 'SUCCESS',
                origin, destination, airline, flightNumber, aircraftType
            })
        } catch (error) {
            sendResponse({
                status: 'ERROR',
                error: {
                    message: error.message,
                    arguments: error.arguments,
                    type: error.type,
                    name: error.name,
                    stack: error.stack,
                },
            })
        }
    }
})