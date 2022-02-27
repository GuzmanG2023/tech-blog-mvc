const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment} = require('../../models');
const withAuth = require('../../utils/auth');

// get all users
router.get('/', (req, res) => {
  console.log('======================');
  Post.findAll({
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
    .then(dataPost => res.json(dataPost))
    .catch(mistake => {
      console.log(mistake);
      res.status(500).json(mistake);
    });
});

router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
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
      if (!dataPost) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dataPost);
    })
    .catch(mistake => {
      console.log(mistake);
      res.status(500).json(mistake);
    });
});

router.post('/', withAuth, (req, res) => {
    Post.create({
      title: req.body.title,
      post_words: req.body.post_words,
      user_id: req.session.user_id
    })
      .then(dataPost => res.json(dataPost))
      .catch(mistake => {
        console.log(mistake);
        res.status(500).json(mistake);
      });
});

router.put('/:id', withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dataPost => {
      if (!dataPost) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dataPost);
    })
    .catch(mistake => {
      console.log(mistake);
      res.status(500).json(mistake);
    });
});

router.delete('/:id', withAuth, (req, res) => {
  console.log('id', req.params.id);
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dataPost => {
      if (!dataPost) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dataPost);
    })
    .catch(mistake => {
      console.log(mistake);
      res.status(500).json(mistake);
    });
});

module.exports = router;