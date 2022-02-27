const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// get all posts for dashboard
router.get('/', withAuth, (req, res) => {
    console.log(req.session);
    console.log('======================');
    Post.findAll({
        where: {
        user_id: req.session.user_id
    },
    attributes: [
        'id',
        'post_words',
        'title',
        'created_at'
    ],
    include: [
        {
        model: Comment,
        attributes: ['id', 'comment_words', 'post_id', 'user_id', 'created_at'],
        include: {
            model: User,
            attributes: ['username']
        }
    },
    {
        model: User,
        attributes: ['username']
        }
    ]
})
    .then(dataPost => {
        const posts = dataPost.map(post => post.get({ plain: true }));
        res.render('dashboard', { posts, loggedIn: true });
    })
    .catch(mistake => {
        console.log(mistake);
        res.status(500).json(mistake);
    });
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findByPk(req.params.id, {
        attributes: [
        'id',
        'post_words',
        'title',
        'created_at'
    ],
    include: [
        {
        model: Comment,
        attributes: ['id', 'comment_words', 'post_id', 'user_id', 'created_at'],
        include: {
            model: User,
            attributes: ['username']
        }
    },
    {
        model: User,
        attributes: ['username']
    }
    ]
})
    .then(dataPost => {
        if (dataPost) {
            const post = dataPost.get({ plain: true });
        
        res.render('edit-post', {
            post,
            loggedIn: true
        });
    } else {
        res.status(404).end();
    }
    })
    .catch(mistake => {
        res.status(500).json(mistake);
    });
});

module.exports = router;