const express = require('express');
const Article = require('../models/article');
const router = express.Router();

// Route for rendering the new article form
router.get('/new', (req, res) => {
    res.render('articles/new', { article: {} });
});

// Route for rendering the edit article form
router.get('/:id/edit', async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (article) {
        res.render('articles/edit', { article: article });
    } else {
        res.redirect('/');
    }
});

// Route for displaying an article based on its slug
router.get('/:slug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (article == null) {
            return res.redirect('/');
        }
        res.render('articles/show', { article: article });
    } catch (e) {
        console.error(e);
        res.redirect('/');
    }
});

// Route for creating a new article
router.post('/', async (req, res, next) => {
    req.article = new Article();
    next();
}, saveArticleAndRedirect('new'));

// Route for updating an existing article
router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect('edit'));

// Route for deleting an article
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// Function to handle saving an article and redirecting
function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        try {
            article = await article.save();
            res.redirect(`/articles/${article.slug}`);
        } catch (e) {
            res.render(`articles/${path}`, { article: article });
        }
    }
}

module.exports = router;
