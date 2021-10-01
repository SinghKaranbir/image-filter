import express from 'express';
import {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    try {
      const image_url: string = req.query.image_url;

      if(!image_url) {
        return res.status(400)
                  .send(`image_url is required`);
      }

      const filteredImage: string = await filterImageFromURL(image_url)
      let tempFiles: string[]  = [filteredImage]
      res.status(200).sendFile(filteredImage, (err) => {
        deleteLocalFiles(tempFiles);
      });

    }  catch (err) {
      return res.send(err.message);
    }

  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
