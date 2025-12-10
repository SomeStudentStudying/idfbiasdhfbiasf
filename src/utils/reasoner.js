export default async function reasonerRoutes(app) {
    /**
     * Test route to verify Llama integration
     */
    const RUNPOD_URL = "http://69.30.85.204:11434/api/generate"; //"https://<pod-id>-11434.proxy.runpod.net/api/generate";
    
    app.get("/test", async (req, reply) => {
        try {
            const response = await fetch(RUNPOD_URL, {
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
    const response = await fetch("RUNPOD_URL", {
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
