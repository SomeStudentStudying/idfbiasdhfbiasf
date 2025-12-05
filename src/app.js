import Fastify from 'fastify';
import analyzeRoutes from "./routes/analyze.js";
import reasonerRoutes from './routes/reasoner.js';

// Import necessaire pour les appels API
import cors from '@fastify/cors';
import multipart from "@fastify/multipart";
import registerCallApiMp from "./routes/callApiMp.js";
import registerCallApiHistory from "./routes/callApiHistory.js";

export const buildApp = async () => {
    const app = Fastify();

    // Garantie que le plugin Cors et Multipart sont chargé pour l'API
    await app.register(cors, { origin: '*' });
    await app.register(multipart);

    // Lecture de donnée
    app.get("/", async () => {
        return { message: "ParkGuide API is ready!" };
    });
    
    // Register les call API multipart (avec image)
    app.register(registerCallApiMp, { prefix: "/callApiMp" });
    app.register(registerCallApiHistory, { prefix: "/callApiHistory" });

    app.register(analyzeRoutes, { prefix: "/analyze" });
    app.register(reasonerRoutes, { prefix: "/reasoner" });

    return app;
};