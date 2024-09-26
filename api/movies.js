// api/movies.js
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI; // Conexión a MongoDB

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const client = new MongoClient(MONGO_URI);

    try {
      await client.connect();
      const db = client.db('sample_mflix'); // Base de datos
      const movies = await db.collection('movies').find().limit(10).toArray(); // Obtiene las primeras 10 películas
      res.status(200).json(movies); // Responde con los datos
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to fetch movies' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
