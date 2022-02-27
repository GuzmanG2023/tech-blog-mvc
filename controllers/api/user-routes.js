const router = require('express').Router();
const { User, Post, Comment} = require('../../models');

// get all users
router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password'] }
  })
    .then(dataUser => res.json(dataUser))
    .catch(mistake => {
      console.log(mistake);
      res.status(500).json(mistake);
    });
});

router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_words', 'created_at']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_words', 'created_at'],
        include: {
          model: Post,
          attributes: ['title']
        }
      }
    ]
  })
    .then(dataUser => {
      if (!dataUser) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dataUser);
    })
    .catch(mistake => {
      console.log(mistake);
      res.status(500).json(mistake);
    });
});

router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(dataUser => {
      req.session.save(() => {
        req.session.user_id = dataUser.id;
        req.session.username = dataUser.username;
        req.session.loggedIn = true;
  
        res.json(dataUser);
      });
    })
    .catch(mistake => {
      console.log(mistake);
      res.status(500).json(mistake);
    });
});

router.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dataUser => {
    if (!dataUser) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }

    const validPassword = dataUser.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = dataUser.id;
      req.session.username = dataUser.username;
      req.session.loggedIn = true;
  
      res.json({ user: dataUser, message: 'You are now logged in!' });
    });
  });
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
});

router.put('/:id', (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dataUser => {
      if (!dataUser) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dataUser);
    })
    .catch(mistake => {
      console.log(mistake);
      res.status(500).json(mistake);
    });
});

router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dataUser => {
      if (!dataUser) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dataUser);
    })
    .catch(mistake => {
      console.log(mistake);
      res.status(500).json(mistake);
    });
});

module.exports = router;