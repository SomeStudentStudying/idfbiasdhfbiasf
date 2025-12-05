export default async function reasonerRoutes(app) {
    /**
     * Test route to verify Llama integration
     */
    app.get("/test", async (req, reply) => {
        try {
            const response = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "llama3",
                    prompt: "Donne moi un fait intéressant aléatoire",
                    stream: false,
                }),
            });

            const data = await response.json();

            return {
                message: "Test successful",
                llama_example: data.response,
            };
        } catch (error) {
            app.log.error(error);
            reply.status(500).send({ error: "Erreur lors de l'appel à Llama" });
        }
    });
}

async function reasoneParkingSign(input) {
    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "parking-sign-ai",
            prompt: input,
            stream: false,
        }),
    });

    const data = await response.json();

    return data;
}

// export for use in routes
export { reasoneParkingSign };
