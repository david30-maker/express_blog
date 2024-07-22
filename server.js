const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article');
const articleRouter = require('./routes/articles');
const app = express();

// MongoDB connection string
const mongoURL = 'mongodb://localhost:27017/blog';

mongoose.connect(mongoURL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' });
  res.render('articles/index', { articles: articles });
});

app.use('/articles', articleRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
