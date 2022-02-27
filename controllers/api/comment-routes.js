const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth')

router.get('/', (req, res) => {
Comment.findAll()
    .then(dataComment => res.json(dataComment))
    .catch(mistake => {
        console.log(mistake);
        res.status(500).json(mistake);
    });
});

router.post('/', withAuth, (req, res) => {
        Comment.create({
            comment_words: req.body.comment_words,
            user_id: req.session.user_id,
            post_id: req.body.post_id
        })
        .then(dataComment => res.json(dataComment))
        .catch(mistake => {
            console.log(mistake);
            res.status(400).json(mistake);
        });
});

router.delete('/:id', withAuth, (req, res) => {
Comment.destroy({
    where: {
        id: req.params.id
    }
})
    .then(dataComment => {
        if (!dataComment) {
        res.status(404).json({ message: 'No comment found with this id!' });
        return;
    }
        res.json(dataComment);
    })
    .catch(mistake => {
        console.log(mistake);
        res.status(500).json(mistake);
    });
});

module.exports = router;