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
