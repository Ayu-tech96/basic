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



// ----------------------------------------------------
// LLZ -> GP mapping table (used by DME lookup below)
// ----------------------------------------------------
// Key format must match navFreqMHz.toFixed(2) (e.g. "108.10")
const llzToGpMapX = {
  "108.10": "334.70",
  "108.30": "334.10",
  "108.50": "329.90",
  "108.70": "330.50",
  "108.90": "329.30",
  "109.10": "311.40",
  "109.30": "322.00",
  "109.50": "332.6",
  "109.70": "333.20",
  "109.90": "333.80",
  "110.10": "334.40",
  "110.30": "335.00",
  "110.50": "329.60",
  "110.70": "330.20",
  "110.90": "330.80",
  "111.10": "331.70",
  "111.30": "332.30",
  "111.50": "332.90",
  "111.70": "333.50",
  "111.90": "331.10" 
  // Add more LLZ:GP pairs as needed. Keep keys as strings with two decimals.
};

const llzToGpMapY = {
  "108.15": "334.55",
  "108.35": "333.95",
  "108.55": "329.75",
  "108.75": "330.35",
  "108.95": "329.15",
  "109.15": "331.25",
  "109.35": "331.85",
  "109.55": "332.45",
  "109.75": "333.05",
  "109.95": "333.65",
  "110.15": "334.25",
  "110.35": "334.85",
  "110.55": "329.45",
  "110.75": "330.05",
  "110.95": "330.65",
  "111.15": "331.55",
  "111.35": "332.15",
  "111.55": "332.75",
  "111.75": "333.35",
  "111.95": "330.95",
  // Add mapping pairs for Y side here
};

// Optional: a function to lookup GP by LLZ string input (standalone UI)
function lookupGPFromLLZString(llzString) {
  if (!llzString) return null;
  // Normalize: allow inputs like "108.1" or "108.10" -> convert to two decimals
  const n = parseFloat(llzString);
  if (isNaN(n)) return null;
  const key = n.toFixed(2);
  return llzToGpMap.hasOwnProperty(key) ? llzToGpMap[key] : null;
}

// If your HTML includes a simple LLZ lookup UI (ids: llzFreq, lookupLLZ, gpFreq), wire it up:
if (document.getElementById("lookupLLZ")) {
  document.getElementById("lookupLLZ").addEventListener("click", function () {
    const llzInput = document.getElementById("llzFreq").value.trim();
    const gpDisplay = document.getElementById("gpFreq");
    gpDisplay.textContent = '---';
    const gp = lookupGPFromLLZString(llzInput);
    gpDisplay.textContent = gp ? `${gp} MHz` : 'Not found';
  });
}



// ----------------------------------------------------
// DME Channel/Frequency lookup logic (your original)
// ----------------------------------------------------
function lookupFrequencies() {
    // 1. Get Inputs
    const channelInput = document.getElementById('dmeChannel').value.trim();
    const type = document.getElementById('channelTypeSelect').value;
    const channelNumber = parseInt(channelInput);

    // 2. Clear previous results & setup
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = '';

    document.getElementById('channelIdentifier').textContent = '---';
    document.getElementById('navFreq').innerHTML = '<p>---</p>';
    document.getElementById('dmeFreqTxA').textContent = '---';
    document.getElementById('dmeFreqRxA').textContent = '---';

    // 3. Input Validation
    if (isNaN(channelNumber) || channelNumber < 1 || channelNumber > 126) {
        errorMsg.textContent = "Invalid DME channel number. Please enter a number between 1 and 126.";
        return;
    }

    // Display the full channel identifier
    document.getElementById('channelIdentifier').textContent = `${channelNumber}${type}`;

    // 4. VHF NAV Frequency (VOR/ILS) and Associated Service Determination (ICAO Standard)
    let navFreqMHz;
    let serviceType;
    let associatedGP = "N/A";
    const K = 63.0; // The fixed 63 MHz offset (used in both sections)

    // ICAO VOR/ILS Frequency Calculation
    if (channelNumber >= 17 && channelNumber <= 56 && type=='X') {
        navFreqMHz = 108.00 + 0.1 * (channelNumber - 17);
    } else if (channelNumber >= 57 && channelNumber <= 59 && type=='X') {
        navFreqMHz = 112.00 + 0.1 * (channelNumber - 57);
    }
    else if (channelNumber >= 70 && channelNumber <= 126 && type=='X') {
        navFreqMHz = 112.3 + 0.1 * (channelNumber - 70);
    }
    else if (channelNumber >= 17 && channelNumber <= 56 && type=='Y') {
        navFreqMHz = 108.05 + 0.1 * (channelNumber - 17);
    }
    else if (channelNumber >= 57 && channelNumber <= 59 && type=='Y') {
        navFreqMHz = 112.05 + 0.1 * (channelNumber - 57);
    }
    else if (channelNumber >= 70 && channelNumber <= 126 && type=='Y') {
        navFreqMHz = 112.35 + 0.1 * (channelNumber - 70);
    }
    else {
        errorMsg.textContent = "NOT ANY ASSOCIATED NAVAIDS";
        let groundTx; // Ground Transmit (Aircraft Receive)
        let groundRx; // Ground Receive (Aircraft Transmit)

        if (type === 'X') {
            if (channelNumber >= 1 && channelNumber <= 63) {
                // Formula: Ground RX = 1025 + (Channel - 1) * 1; Ground TX = Ground RX - K
                groundRx = 1025 + (channelNumber - 1) * 1; // Aircraft TX
                groundTx = groundRx - K; // Aircraft RX
            } else if (channelNumber >= 64 && channelNumber <= 126) {
                // Formula: Ground RX = 1025 + (Channel - 1) * 1; Ground TX = Ground RX + K
                groundRx = 1025 + (channelNumber - 1) * 1; // Aircraft TX
                groundTx = groundRx + K; // Aircraft RX
            }
        } else if (type === 'Y') {
            if (channelNumber >= 1 && channelNumber <= 63) {
                // Formula: Ground RX = 1025 + (Channel - 1) * 1; Ground TX = Ground RX + K
                groundRx = 1025 + (channelNumber - 1) * 1; // Aircraft TX
                groundTx = groundRx + K; // Aircraft RX
            } else if (channelNumber >= 64 && channelNumber <= 126) {
                // Formula: Ground RX = 1025 + (Channel - 1) * 1; Ground TX = Ground RX - K
                groundRx = 1025 + (channelNumber - 1) * 1; // Aircraft TX
                groundTx = groundRx - K; // Aircraft RX
            }
        }
        document.getElementById('dmeFreqTxA').textContent = `${groundRx.toFixed(1)} MHz`; // Aircraft TX = Ground RX
        document.getElementById('dmeFreqRxA').textContent = `${groundTx.toFixed(1)} MHz`; // Aircraft RX = Ground TX
        return;
    }

    // Determine the associated service based on ICAO Annex 10 pairing rules
    const freqDecimals = navFreqMHz.toFixed(2).split('.')[1];

    if (navFreqMHz >= 112) {
        serviceType = "VOR";
    } else {
        serviceType = "ILS";
    }

    // ----- NEW: lookup GP mapping using llzToGpMap -----
    const navKey = navFreqMHz.toFixed(2); // key format matches mapping
    const foundGPX = llzToGpMapX.hasOwnProperty(navKey) ? llzToGpMapX[navKey] : null;
  const foundGPY = llzToGpMapY.hasOwnProperty(navKey) ? llzToGpMapY[navKey] : null;
    
  if (type === 'X'){
    if (foundGPX) {
        associatedGP = `${foundGPX} MHz`;
    } else {
        associatedGP = "N/A"; // mapping not present
    }}
  else {
    if (foundGPY) {
        associatedGP = `${foundGPY} MHz`;
    } else {
        associatedGP = "N/A"; // mapping not present
    }
  }
    // ---------------------------------------------------

    // Display VOR/ILS Frequency and Service + Associated GP (if found)
    document.getElementById('navFreq').innerHTML = `
        <p><strong>${serviceType }</strong> ${navFreqMHz.toFixed(2)} MHz</p>
        <p><small>Associated Glide Path (GP): ${associatedGP}</small></p>
    `;

    // 5. DME Frequency Calculation (UHF) - USING YOUR CUSTOM FORMULAS
    let groundTx; // Ground Transmit (Aircraft Receive)
    let groundRx; // Ground Receive (Aircraft Transmit)

    if (type === 'X') {
        if (channelNumber >= 1 && channelNumber <= 63) {
            // Formula: Ground RX = 1025 + (Channel - 1) * 1; Ground TX = Ground RX - K
            groundRx = 1025 + (channelNumber - 1) * 1; // Aircraft TX
            groundTx = groundRx - K; // Aircraft RX
        } else if (channelNumber >= 64 && channelNumber <= 126) {
            // Formula: Ground RX = 1025 + (Channel - 1) * 1; Ground TX = Ground RX + K
            groundRx = 1025 + (channelNumber - 1) * 1; // Aircraft TX
            groundTx = groundRx + K; // Aircraft RX
        }
    } else if (type === 'Y') {
        if (channelNumber >= 1 && channelNumber <= 63) {
            // Formula: Ground RX = 1025 + (Channel - 1) * 1; Ground TX = Ground RX + K
            groundRx = 1025 + (channelNumber - 1) * 1; // Aircraft TX
            groundTx = groundRx + K; // Aircraft RX
        } else if (channelNumber >= 64 && channelNumber <= 126) {
            // Formula: Ground RX = 1025 + (Channel - 1) * 1; Ground TX = Ground RX - K
            groundRx = 1025 + (channelNumber - 1) * 1; // Aircraft TX
            groundTx = groundRx - K; // Aircraft RX
        }
    }

    // 6. Display DME Results (Aircraft Perspective)
    document.getElementById('dmeFreqTxA').textContent = `${groundRx.toFixed(1)} MHz`; // Aircraft TX = Ground RX
    document.getElementById('dmeFreqRxA').textContent = `${groundTx.toFixed(1)} MHz`; // Aircraft RX = Ground TX
}

// Keep your original inline onclick or wire the button to lookupFrequencies
// Example: if your button has onclick already, no change needed. Otherwise:
// document.getElementById('yourLookupButtonId').addEventListener('click', lookupFrequencies);
