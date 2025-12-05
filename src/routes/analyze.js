import vision from "@google-cloud/vision";
import { normalizeText } from "../utils/normalizeText.js";
import { reasoneParkingSign } from "../utils/reasoner.js";

console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export default async function analyzeRoutes(app) {
  app.post("/", async (req, reply) => {
    try {
      // Support multipart upload (file field) or fallback to imageUrl in JSON body
      let imageParam;

      if (req.isMultipart && req.isMultipart()) {
        // read first file
        const part = await req.file();
        if (!part) {
          return reply.code(400).send({ error: "file is required in multipart/form-data" });
        }

        const chunks = [];
        for await (const chunk of part.file) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        imageParam = { content: buffer };
      } else {
        const { imageUrl } = req.body;

        if (!imageUrl) {
          return reply.code(400).send({ error: "imageUrl is required" });
        }

        imageParam = { source: { imageUri: imageUrl } };
      }

      const [result] = await client.annotateImage({
        image: imageParam,
        features: [
          { type: "TEXT_DETECTION" },
        ],
      });

      const texts = result.textAnnotations?.map(t => t.description) || [];

      let ocrText = texts.join(" ");

      // Add sign type prefix if "P" is detected


      if (ocrText.trim() === "") {
        return {
          "parking_allowed": null,
          "days": [],
          "hours": { "start": null, "end": null },
          "exceptions": []
        }
      }

      if (ocrText.includes(" P ")) {
        ocrText = "Sign: Parking Sign\n" + ocrText;
      } else {
        ocrText = "Sign: No Parking Sign\n" + ocrText;
      }



      const reasoningResult = await reasoneParkingSign(ocrText);
      return reasoningResult.response;
    } catch (err) {
      req.log.error(err);
      return reply.code(500).send({ error: "Vision API error" });
    }
  });
}
