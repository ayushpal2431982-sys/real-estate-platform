const sendEmail = async (options) => {
    console.log("=== sendEmail called ===");
    console.log("Sending to:", options.email);
    console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY?.slice(0, 15));
    console.log("EMAIL_USER:", process.env.EMAIL_USER);

    try {
        const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim();
        if (!BREVO_API_KEY) {
            console.error("Missing BREVO_API_KEY in environment variable");
            throw new Error("Missing email API key");
        }

        const data = {
            sender: {
                name: "Real Estate Platform",
                email: process.env.EMAIL_USER
            },
            to: [{ email: options.email }],
            subject: options.subject,
            htmlContent: options.message
        };

        console.log("Sending data:", JSON.stringify(data, null, 2)); // 👈 log full payload

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "api-key": BREVO_API_KEY,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log("Brevo response status:", response.status); // 👈 log status
        console.log("Brevo response body:", result);            // 👈 log full response

        if (response.ok) {
            console.log("✅ Email sent successfully:", result.messageId);
        } else {
            console.error("❌ Brevo API Error:", result);
            throw new Error(result.message || "Could not send email via Brevo");
        }

    } catch (error) {
        console.error("❌ Brevo Email Error:", error.message);
        throw new Error("Could not send email via Brevo");
    }
};

export default sendEmail;