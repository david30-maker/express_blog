const express = require('express');
const Article = require('../models/article');
const router = express.Router();

router.get('/new', (req, res) => {
    res.render('articles/new', { article: {} });
});

router.get('/:id/edit', async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (article) {
        res.render('articles/edit', { article: article });
    } else {
        res.redirect('/');
    }
});

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

router.post('/', upload.single('images'), async (req, res, next) => {
    req.article = new Article();
    if (req.file) {
        req.article.image = `/uploads/${req.filename}`;
    }
    next();
}, saveArticleAndRedirect('new'));

router.put('/:id', upload.single('image'), async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    if (req.file) {
        req.article.image = `/uploads/${req.filename}`;
    }
    next();
}, saveArticleAndRedirect('edit'));

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

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
