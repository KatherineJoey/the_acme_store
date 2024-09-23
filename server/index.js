const express = require('express');
const {
  client,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  createFavorite,
  deleteFavorite,
} = require('./db');

const app = express();
app.use(express.json());

app.get('/api/users', async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.send(users);
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/products', async (req, res, next) => {
  try {
    const products = await fetchProducts();
    res.send(products);
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/users/:id/favorites', async (req, res, next) => {
  try {
    const favorites = await fetchFavorites(req.params.id);
    res.send(favorites);
  } catch (ex) {
    next(ex);
  }
});

app.post('/api/users/:id/favorites', async (req, res, next) => {
  try {
    const favorites = await createFavorite({
      user_id: req.params.id,
      product_id: req.body.product.id,
    });
    res.status(201).send(favorites);
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/users/:userId/favorites/:id', async (req, res, next) => {
  try {
    await deleteFavorite({
      id: req.params.id,
      user_id: req.params.userId,
    });
    res.status(204).send();
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  console.log('connecting to database');
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('tables created');
  const [
    Fatima,
    Charles,
    Eric,
    Hannah,
    Ali,
    Cherry_Garcia,
    Chunky_Monkey,
    Phish_Food,
    Dirt_Cake,
    Boom_Chocolatta,
  ] = await Promise.all([
    createUser({ username: 'Fatima', password: 'G7iFkDgp' }),
    createUser({ username: 'Charles', password: 'fYJfnqeP' }),
    createUser({ username: 'Eric', password: 'EfrMo1kU' }),
    createUser({ username: 'Hannah', password: 'kPso9ji' }),
    createUser({ username: 'Ali', password: 'BckMyrG8' }),
    createProduct({ name: 'Cherry_Garcia' }),
    createProduct({ name: 'Chunky_Monkey' }),
    createProduct({ name: 'Phish_Food' }),
    createProduct({ name: 'Dirt_Cake' }),
    createProduct({ name: 'Boom_Chocolatta' }),
  ]);
  const users = await fetchUsers();
  console.log(users);

  const products = await fetchProducts();
  console.log(products);

  const favorites = await Promise.all([
    createFavorite({ user_id: Fatima.id, product_id: Cherry_Garcia.id }),
    createFavorite({ user_id: Charles.id, product_id: Chunky_Monkey.id }),
    createFavorite({ user_id: Eric.id, product_id: Phish_Food.id }),
    createFavorite({ user_id: Hannah.id, product_id: Dirt_Cake.id }),
    createFavorite({ user_id: Ali.id, product_id: Boom_Chocolatta.id }),
  ]);
  console.log(await fetchFavorites(Fatima.id));
  await deleteFavorite(favorites[0].id);
  console.log(await fetchFavorites(Fatima.id));

  const port = process.env.PORT || 3002;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
