document.getElementById("calculate").addEventListener("click", function () {
  // Morse timing rules in milliseconds
  const DOT_TIME = 130;
  const DASH_TIME = 380;
  const SPACING_TIME = 120; // Between dots/dashes in a character
  const INTERVAL_TIME = 370; // Between characters

  // Morse code mapping
  const morseCode = {
    A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.",
    G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..",
    M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.",
    S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-",
    Y: "-.--", Z: "--..", 1: ".----", 2: "..---", 3: "...--",
    4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..",
    9: "----.", 0: "-----"
  };

  // Get user input
  const input = document.getElementById("ident").value.trim().toUpperCase();

  // Validate input
  if (!input || input.length < 3 || input.length > 4 || !/^[A-Z0-9]+$/.test(input)) {
    document.getElementById("result").textContent = "Please enter a valid 3-4 character ident.";
    return;
  }

  // Initialize variables for output and timing
  let totalTime = 0;
  let morseOutput = "";

  // Loop through each character of the input
  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // Get Morse code for the character
    const morse = morseCode[char];
    if (!morse) {
      document.getElementById("result").textContent = `Invalid character detected: ${char}`;
      return;
    }

    // Append Morse code to output
    morseOutput += morse + " ";

    // Calculate time for the Morse code of the current character
    for (let j = 0; j < morse.length; j++) {
      if (morse[j] === ".") {
        totalTime += DOT_TIME;
      } else if (morse[j] === "-") {
        totalTime += DASH_TIME;
      }

      // Add spacing between dots/dashes in the same character
      if (j < morse.length - 1) {
        totalTime += SPACING_TIME;
      }
    }

    // Add interval time between characters (except after the last character)
    if (i < input.length - 1) {
      totalTime += INTERVAL_TIME;
    }
  }

  // Display the result
  document.getElementById("result").textContent = `Morse Code: ${morseOutput.trim()} | Total Time: ${(totalTime / 1000).toFixed(3)} seconds`;
});






document.getElementById("calculate1").addEventListener("click", function () {
  // Get input values
  const assignedFrequency = parseFloat(document.getElementById("assigned-frequency").value);
  const offset = parseFloat(document.getElementById("offset").value || 0); // Default to 0 if not provided
  const operation = document.getElementById("offset-operation").value;
  const calculatedFrequency = parseFloat(document.getElementById("calculated-frequency").value);

  // Validate inputs
  if (isNaN(assignedFrequency) || isNaN(offset) || isNaN(calculatedFrequency) ||
      assignedFrequency <= 0 || calculatedFrequency <= 0 || offset < 0) {
    document.getElementById("result1").textContent = "Please enter valid frequencies and offset.";
    return;
  }

  // Convert offset from kHz to MHz
  const offsetInMHz = offset / 1000;

  // Adjust the assigned frequency based on the offset
  const adjustedAssignedFrequency =
    operation === "add" ? assignedFrequency + offsetInMHz : assignedFrequency - offsetInMHz;

  // Calculate accuracy in percentage
  const accuracy = ((Math.abs(calculatedFrequency - adjustedAssignedFrequency) / adjustedAssignedFrequency) * 100).toFixed(6);

  // Display the result
 document.getElementById("result1").textContent = `Accuracy: ${accuracy}%`;

});



 const llzToGpMapX = {
          "108.10": "334.70", "108.30": "334.10", "108.50": "329.90", "108.70": "330.50",
          "108.90": "329.30", "109.10": "311.40", "109.30": "322.00", "109.50": "332.60",
          "109.70": "333.20", "109.90": "333.80", "110.10": "334.40", "110.30": "335.00",
          "110.50": "329.60", "110.70": "330.20", "110.90": "330.80", "111.10": "331.70",
          "111.30": "332.30", "111.50": "332.90", "111.70": "333.50", "111.90": "331.10"
        };
        
        const llzToGpMapY = {
          "108.15": "334.55", "108.35": "333.95", "108.55": "329.75", "108.75": "330.35",
          "108.95": "329.15", "109.15": "331.25", "109.35": "331.85", "109.55": "332.45",
          "109.75": "333.05", "109.95": "333.65", "110.15": "334.25", "110.35": "334.85",
          "110.55": "329.45", "110.75": "330.05", "110.95": "330.65", "111.15": "331.55",
          "111.35": "332.15", "111.55": "332.75", "111.75": "333.35", "111.95": "330.95",
        };
        
        // ----------------------------------------------------
        // Helper Function to Clear Results
        // ----------------------------------------------------
        function clearDmeResults() {
            document.getElementById('channelIdentifier').textContent = '---';
            document.getElementById('navFreq').innerHTML = '---';
            document.getElementById('dmeFreqTxA').textContent = '---';
            document.getElementById('dmeFreqRxA').textContent = '---';
            document.getElementById('errorMsg').textContent = '';
        }

        // ----------------------------------------------------
        // NEW FUNCTION 1: VOR/ILS Freq -> DME Channel Lookup
        // ----------------------------------------------------
        function lookupChannelFromNavFreq() {
            clearDmeResults(); 

            const navFreqInput = document.getElementById('navFreqInput').value.trim();
            const F = parseFloat(navFreqInput);

            if (isNaN(F) || F < 108.00 || F > 117.95) {
                document.getElementById('errorMsg').textContent = "Invalid NAV frequency. Enter a value between 108.00 and 117.95 MHz.";
                return;
            }

            let channelNumber = 0;
            let channelType = '';
            const F_fixed = F.toFixed(2); // Use fixed string for accurate comparison

            // Reverse ICAO Pairing Logic
            // X Channels (ends in .00, .20, .40, .60, .80)
            if (F_fixed.slice(-1) === '0') {
                if (F >= 108.10 && F <= 111.90) { // ILS/LLZ
                    channelNumber = Math.round((F - 108.00) / 0.1 + 17);
                    channelType = 'X';
                } else if (F >= 112.00 && F <= 112.20) { // VOR (57X-59X)
                    channelNumber = Math.round((F - 112.00) / 0.1 + 57);
                    channelType = 'X';
                } else if (F >= 112.30 && F <= 117.90) { // VOR (70X-126X)
                    channelNumber = Math.round((F - 112.30) / 0.1 + 70);
                    channelType = 'X';
                }
            }
            // Y Channels (ends in .05, .25, .45, .65, .85)
            else if (F_fixed.slice(-1) === '5') {
                if (F >= 108.05 && F <= 111.95) { // ILS/LLZ
                    channelNumber = Math.round((F - 108.05) / 0.1 + 17);
                    channelType = 'Y';
                } else if (F >= 112.05 && F <= 112.25) { // VOR (57Y-59Y)
                    channelNumber = Math.round((F - 112.05) / 0.1 + 57);
                    channelType = 'Y';
                } else if (F >= 112.35 && F <= 117.95) { // VOR (70Y-126Y)
                    channelNumber = Math.round((F - 112.35) / 0.1 + 70);
                    channelType = 'Y';
                }
            }
            
            // Validate if a valid channel was found
            if (channelNumber >= 17 && channelNumber <= 126) {
                // Pass the found channel and type to the original lookup function
                document.getElementById('dmeChannel').value = channelNumber;
                document.getElementById('channelTypeSelect').value = channelType;
                lookupFrequencies();
            } else {
                document.getElementById('errorMsg').textContent = `NAV Frequency ${F_fixed} MHz is not a standard ILS/VOR frequency associated with a DME Channel.`;
            }
        }

        // ----------------------------------------------------
        // NEW FUNCTION 2: LLZ Freq -> GP Freq Lookup (Standalone)
        // ----------------------------------------------------
        function lookupGPFromLLZFreq() {
            const llzInput = document.getElementById('llzFreqInput').value.trim();
            const gpDisplay = document.getElementById('gpFreqDisplay');
            gpDisplay.textContent = '---';

            // Normalize input
            const n = parseFloat(llzInput);
            if (isNaN(n) || n < 108.10 || n > 111.95) {
                gpDisplay.textContent = 'Invalid LLZ Freq (108.10 - 111.95)';
                return;
            }
            const key = n.toFixed(2);

            // Look up in both X and Y maps
            const gpX = llzToGpMapX.hasOwnProperty(key) ? llzToGpMapX[key] : null;
            const gpY = llzToGpMapY.hasOwnProperty(key) ? llzToGpMapY[key] : null;

            let result = '';

            if (gpX && gpY) {
                // This shouldn't occur for standard ICAO pairing, but handles edge cases if mapping tables overlap
                result = `X: ${gpX} MHz, Y: ${gpY} MHz`;
            } else if (gpX) {
                result = `X Channel GP: ${gpX} MHz`;
            } else if (gpY) {
                result = `Y Channel GP: ${gpY} MHz`;
            } else {
                result = 'No associated Glide Path found in mapping tables for ' + key + ' MHz.';
            }

            gpDisplay.textContent = result;
        }

        // ----------------------------------------------------
        // Original lookupFrequencies (DME Channel -> All Frequencies)
        // ----------------------------------------------------
        function lookupFrequencies() {
            // 1. Get Inputs
            const channelInput = document.getElementById('dmeChannel').value.trim();
            const type = document.getElementById('channelTypeSelect').value;
            const channelNumber = parseInt(channelInput);
            const K = 63.0; // The fixed 63 MHz offset

            // 2. Clear previous error/setup
            clearDmeResults();

            // 3. Input Validation
            if (isNaN(channelNumber) || channelNumber < 1 || channelNumber > 126) {
                document.getElementById('errorMsg').textContent = "Invalid DME channel number. Please enter a number between 1 and 126.";
                return;
            }

            // Display the full channel identifier
            document.getElementById('channelIdentifier').textContent = `${channelNumber}${type}`;

            // 4. VHF NAV Frequency (VOR/ILS) and Associated Service Determination
            let navFreqMHz;
            let serviceType;
            let associatedGP = "N/A";

            // ICAO VOR/ILS Frequency Calculation
            if (channelNumber >= 17 && channelNumber <= 56 && type=='X') {
                navFreqMHz = 108.00 + 0.1 * (channelNumber - 17);
            } else if (channelNumber >= 57 && channelNumber <= 59 && type=='X') {
                navFreqMHz = 112.00 + 0.1 * (channelNumber - 57);
            } else if (channelNumber >= 70 && channelNumber <= 126 && type=='X') {
                navFreqMHz = 112.30 + 0.1 * (channelNumber - 70);
            } else if (channelNumber >= 17 && channelNumber <= 56 && type=='Y') {
                navFreqMHz = 108.05 + 0.1 * (channelNumber - 17);
            } else if (channelNumber >= 57 && channelNumber <= 59 && type=='Y') {
                navFreqMHz = 112.05 + 0.1 * (channelNumber - 57);
            } else if (channelNumber >= 70 && channelNumber <= 126 && type=='Y') {
                navFreqMHz = 112.35 + 0.1 * (channelNumber - 70);
            } 
            
            // Associated NAVAID Found
            if (navFreqMHz) {
                const navFreqFixed = navFreqMHz.toFixed(2);
                if (navFreqMHz >= 112) {
                    serviceType = "VOR";
                } else {
                    serviceType = "ILS (LLZ)";
                }
                
                // Lookup associated GP if it's an ILS frequency
                const map = (type === 'X') ? llzToGpMapX : llzToGpMapY;
                const foundGP = map.hasOwnProperty(navFreqFixed) ? map[navFreqFixed] : null;

                if (foundGP) {
                    associatedGP = `${foundGP} MHz`;
                }

                // Display VOR/ILS Frequency and Service + Associated GP
                document.getElementById('navFreq').innerHTML = `
                    <p><strong>${serviceType }</strong> ${navFreqFixed} MHz</p>
                    <p><small>Associated Glide Path (GP): ${associatedGP}</small></p>
                `;
            } else {
                // Stand-alone DME Case
                document.getElementById('navFreq').innerHTML = "N/A (Stand-Alone DME)";
            }
            
            // 5. DME Frequency Calculation (UHF) - Applied to ALL channels 1-126
            let groundTx; // Ground Transmit (Aircraft Receive)
            let groundRx; // Ground Receive (Aircraft Transmit)
            
            // Ground RX (Aircraft TX): 1025 + (N-1)
            groundRx = 1025 + (channelNumber - 1) * 1; 
            
            // Ground TX (Aircraft RX): Determine +/- K offset
            const isLowerBand = (type === 'X' && channelNumber >= 1 && channelNumber <= 63) || 
                               (type === 'Y' && channelNumber >= 64 && channelNumber <= 126);
            
            if (isLowerBand) {
                groundTx = groundRx - K; // TX = RX - 63 MHz (Lower Band)
            } else { 
                groundTx = groundRx + K; // TX = RX + 63 MHz (Upper Band)
            }

            // 6. Display DME Results (Aircraft Perspective)
            document.getElementById('dmeFreqTxA').textContent = `${groundRx.toFixed(1)} MHz`; // Aircraft TX = Ground RX
            document.getElementById('dmeFreqRxA').textContent = `${groundTx.toFixed(1)} MHz`; // Aircraft RX = Ground TX
        }

        // ----------------------------------------------------
        // Wiring (Connect the buttons to the functions)
        // ----------------------------------------------------
        document.addEventListener('DOMContentLoaded', () => {
            // Lookup 1: DME Channel -> Frequencies
            const dmeLookupButton = document.getElementById('lookupDMEChannel');
            if (dmeLookupButton) {
                dmeLookupButton.addEventListener('click', lookupFrequencies);
            }
            
            // Lookup 2: VOR/ILS Freq -> Channel & Frequencies
            const navFreqLookupButton = document.getElementById('lookupNAVFreq');
            if (navFreqLookupButton) {
                navFreqLookupButton.addEventListener('click', lookupChannelFromNavFreq);
            }
            
            // Lookup 3: LLZ Freq -> GP Freq Standalone Lookup
            const llzFreqLookupButton = document.getElementById('lookupLLZFreq');
            if (llzFreqLookupButton) {
                llzFreqLookupButton.addEventListener('click', lookupGPFromLLZFreq);
            }

            // Run an initial lookup on load for example data (Channel 17X)
            lookupFrequencies();
        });
