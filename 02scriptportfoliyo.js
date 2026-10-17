
const SUPABASE_URL = "https://gzitfihztwmvxsotihyl.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aXRmaWh6dHdtdnhzb3RpaHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczOTExNzUsImV4cCI6MjEwMjk2NzE3NX0.2jZCMxCC3B-rAE-FeRujPIC5FRf_g2aaHWCVFyNQwBc";
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const contactForm = document.querySelector("#contact");

if (contactForm) {
    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const subject = document.querySelector("#subject").value.trim();
        const message = document.querySelector("#message").value.trim();

        if (!name || !email || !subject || !message) {
            alert("Please fill in all fields!");
            return;
        }

        const submitButton = contactForm.querySelector(
            'button[type="submit"]'
        );

        submitButton.disabled = true;
        submitButton.textContent = "Checking connection...";

        try {
            // STEP 1: Check whether Supabase can reach the table.
            // This query reads no visitor data and inserts nothing.
            const { error: connectionError } = await supabaseClient
                .from("feedback")
                .select("*")
                .limit(0);

            if (connectionError) {
                console.error("Connection/Table Error:", connectionError);

                alert(
                    "Supabase connection/table check failed.\n" +
                    connectionError.message
                );
                return;
            }

            // STEP 2: Insert the form data.
            submitButton.textContent = "Saving data...";

            const { error: insertError } = await supabaseClient
                .from("feedback")
                .insert({
                    NAME: name,
                    EMAIL: email,
                    SUBJECT: subject,
                    MESSAGE: message
                });

            if (insertError) {
                console.error("Insert Error:", insertError);

                alert(
                    "Data save nahi hua!\n" +
                    insertError.message
                );
                return;
            }

            // STEP 3: Show success only after a successful insert.
            alert("Data saved successfully in Supabase!");

            // STEP 4: Clear all form fields after successful insert.
            contactForm.reset();

        } catch (error) {
            console.error("Unexpected Error:", error);

            alert(
                "Something went wrong!\n" +
                (error.message || "Please try again.")
            );

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Send Message 🚀";
        }
    });
}
