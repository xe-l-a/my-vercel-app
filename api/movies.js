// api/movies.js
import { MongoClient } from 'mongodb';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

const MONGO_URI = process.env.MONGO_URI;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
      await client.connect();
      const db = client.db('sample_mflix');
      const movies = await db.collection('movies').find().limit(10).toArray();

      // Leer el archivo EJS y renderizarlo
      const filePath = path.join(process.cwd(), 'views', 'index.ejs');
      const template = fs.readFileSync(filePath, 'utf-8');
      const html = ejs.render(template, { movies }); // Pasar datos a la plantilla

      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
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
