const resumeFile = document.getElementById("resumeFile");
const fileName = document.getElementById("fileName");
const jobDescription = document.getElementById("jobDescription");
const charCount = document.getElementById("charCount");

const analyzeBtn = document.getElementById("analyzeBtn");
const results = document.getElementById("results");
const newAnalysis = document.getElementById("newAnalysis");


// ==========================================
// FILE UPLOAD
// ==========================================

resumeFile.addEventListener("change", function () {

    if (this.files.length > 0) {

        const file = this.files[0];

        if (file.type !== "application/pdf") {

            alert("Please upload a PDF file.");

            this.value = "";

            return;
        }

        fileName.textContent =
            "✓ " + file.name;

    }

});


// ==========================================
// CHARACTER COUNT
// ==========================================

jobDescription.addEventListener(
    "input",
    function () {

        charCount.textContent =
            this.value.length;

    }
);


// ==========================================
// ANALYZE RESUME
// ==========================================

analyzeBtn.addEventListener(
    "click",
    async function () {

        // Check resume

        if (!resumeFile.files.length) {

            alert(
                "Please upload your resume PDF."
            );

            return;
        }


        // Check job description

        if (!jobDescription.value.trim()) {

            alert(
                "Please paste the job description."
            );

            return;
        }


        // Loading state

        analyzeBtn.disabled = true;

        analyzeBtn.innerHTML =
            "<span>Analyzing...</span>";


        // Create form data

        const formData = new FormData();

        formData.append(
            "resume",
            resumeFile.files[0]
        );

        formData.append(
            "job_description",
            jobDescription.value
        );


        try {

            // Send request to FastAPI

            const response = await fetch(
                "http://127.0.0.1:8123/analyze",
                {
                    method: "POST",
                    body: formData
                }
            );


            // Check response

            if (!response.ok) {

                throw new Error(
                    "Backend returned an error."
                );

            }


            // Convert response to JSON

            const result =
                await response.json();


            console.log(
                "Backend response:",
                result
            );


            // Display result

            displayResults(result);


        } catch (error) {

            console.error(error);

            alert(
                "Could not connect to the backend.\n\n" +
                "Make sure FastAPI is running on port 8123."
            );

        } finally {

            analyzeBtn.disabled = false;

            analyzeBtn.innerHTML = `
                <span>Analyze Resume</span>
                <span>→</span>
            `;

        }

    }
);


// ==========================================
// DISPLAY RESULTS
// ==========================================

function displayResults(result) {

    const scoreValue = Number(result.score) || 0;

    // Score

    document.getElementById(
        "score"
    ).textContent =
        Math.round(scoreValue) + "%";


    // Counts

    document.getElementById(
        "matchingCount"
    ).textContent =
        result.matching_keywords.length;


    document.getElementById(
        "missingCount"
    ).textContent =
        result.missing_keywords.length;


    // Matching skills

    const matchingContainer =
        document.getElementById(
            "matchingSkills"
        );

    matchingContainer.innerHTML = "";


    if (
        result.matching_keywords.length === 0
    ) {

        matchingContainer.innerHTML =
            "<p>No matching skills found.</p>";

    } else {

        result.matching_keywords.forEach(
            function (skill) {

                const element =
                    document.createElement(
                        "span"
                    );

                element.className = "skill";

                element.textContent = skill;

                matchingContainer.appendChild(
                    element
                );

            }
        );

    }


    // Missing skills

    const missingContainer =
        document.getElementById(
            "missingSkills"
        );

    missingContainer.innerHTML = "";


    if (
        result.missing_keywords.length === 0
    ) {

        missingContainer.innerHTML =
            "<p>No major missing skills.</p>";

    } else {

        result.missing_keywords.forEach(
            function (skill) {

                const element =
                    document.createElement(
                        "span"
                    );

                element.className =
                    "missing";

                element.textContent = skill;

                missingContainer.appendChild(
                    element
                );

            }
        );

    }


    // Suggestions

    const suggestionsContainer =
        document.getElementById(
            "suggestions"
        );

    suggestionsContainer.innerHTML = "";


    result.suggestions.forEach(
        function (suggestion) {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "suggestion";

            element.textContent =
                "💡 " + suggestion;

            suggestionsContainer.appendChild(
                element
            );

        }
    );


    // Show results

    results.classList.remove(
        "hidden"
    );


    // Scroll to results

    results.scrollIntoView({
        behavior: "smooth"
    });

}


// ==========================================
// NEW ANALYSIS
// ==========================================

newAnalysis.addEventListener(
    "click",
    function () {

        results.classList.add(
            "hidden"
        );

        resumeFile.value = "";

        fileName.textContent = "";

        jobDescription.value = "";

        charCount.textContent = "0";


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);