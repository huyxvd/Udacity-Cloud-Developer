import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app: Express = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    const imageUrl: string = req.query.image_url || '';
    // 1. validate the image_url query
    if (imageUrl) {
      // 2. call filterImageFromURL(image_url) to filter the image
      const filteredpath: string = await filterImageFromURL(req.query.image_url);

      // 3. send the resulting file in the response
      res.sendFile(filteredpath)

      // 4. deletes any files on the server on finish of the response
      setTimeout(async () => {
        // if this code run immidiate we will got trouble when sendFile at step 3
        await deleteLocalFiles([filteredpath]);
      }, 5000);
    } else {
      res.send("image_url incorrect");
    }
  });

  // the reason need to put here is:
  // if i make bad request on the first point the ebs status will alway failed dual to the alb health check
  app.get("/badRequest", async (req: Request, res: Response) => {
    res.status(400).send("bad request");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();