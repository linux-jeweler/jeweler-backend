import createServer from './server';
import './data-source';


const port = process.env.PORT || 3001;
const app = createServer();


app.listen(port, () => {
  console.log(`App running on Port ${port}`);
});
