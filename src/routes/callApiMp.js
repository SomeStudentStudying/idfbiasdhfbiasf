import fs from "fs";
import path from "path";

export default async function registerCallApiMp(app) {
  app.post("/", async (req, reply) => {
    try {
      // Récupère les fichiers ET les champs
      const data = await req.saveRequestFiles();

      if (!data || data.length === 0) {
        return reply.code(400).send({ error: "No image uploaded" });
      }

      const file = data[0]; // Le fichier envoyé sous "image"
      const fields = req.body; // Les champs envoyés (timestamp, app_version)

      // Sauvegarde du fichier sur le serveur
      const uploadPath = path.join("./uploads", file.filename);
      await fs.promises.mkdir("./uploads", { recursive: true });

      await fs.promises.rename(file.filepath, uploadPath);

      // Construction de la réponse
      const responseJson = toJsonTest();

      return reply.send(responseJson);

    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Server error receiving image" });
    }
  });
}

// Fonction pour construire un JSON propre
// Fonction pour construire un JSON propre avec toutes les données à la racine
function toJson(data) {
  return {
    success: true,
    message: data.message,
    filename: data.filename,
    mimetype: data.mimetype,
    savedAt: data.savedAt,
    timestamp: data.timestamp,
    appVersion: data.appVersion,
    parking_allowed: data.parking_allowed ?? false,
    confidence: data.confidence ?? 0.0,
    sign_type: data.sign_type ?? "Unknown",
    restrictions: data.restrictions ?? [],
    recommendation: data.recommendation ?? "",
  };
}

// Fonction pour test avec données fixes
function toJsonTest() {
  return {
    success: true,
    message: "Test image received successfully!",
    filename: "test_photo.jpg",
    mimetype: "image/jpeg",
    savedAt: "./uploads/test_photo.jpg",
    timestamp: "2025-02-17T22:55:00Z",
    appVersion: "1.0.0",
    parking_allowed: false,
    confidence: 1.0,
    sign_type: "No Parking",
    restrictions: [
      "No parking 8AM - 6PM",
      "Monday through Friday",
      "Loading zone for commercial vehicles only"
    ],
    recommendation: "Parking is not allowed at this location during weekdays from 8AM to 6PM. This is a loading zone reserved for commercial vehicles."
  };
}