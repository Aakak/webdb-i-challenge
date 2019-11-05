const express = require('express');

const knex = require('../data/dbConfig');

const router = express.Router();

router.get('/', (req, res) => {
  knex
    .select('*')
    .from('accounts')
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to get posts from database' });
    });
});

router.get('/:id', validateId, (req, res) => {
  knex
    .select('*')
    .from('accounts')
    .where('id', '=', req.params.id)
    .then(account => {
      res.status(200).json(account);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to get post from database' });
    });
});


function validateId(req, res, next) {
  const id = req.params.id;
  knex
    .select('*')
    .from('accounts')
    .where('id', '=', id)
    .then(accounts => {
      console.log(accounts.length)
     if (accounts.length === 0) {
      console.log('empty')
        res.status(400).json({'message': 'Invalid account id'});
     } else{
       next()
     }
    }).catch(error => {
      console.log(error)
      res.status(500).json({ error: 'Failed to get post from database' });
    });
}

router.post('/', (req, res) => {
  knex('accounts')
  .insert(req.body)
    // .into('accounts')
    .then(ids => {
      knex('accounts').select('*')
      .where('id', '=', ids[0])
      .then(account => {
        res.status(200).json(account);
      })
      .catch(error => {
        res.status(500).json({ error: 'Failed to get post from database' });
      });
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: 'Failed to insert post' });
    });
});


router.put('/:id', (req, res) => {
  const changes = req.body;
  knex('accounts')
    .where({id: req.params.id })
    .update(changes)
    .then(count => {
      knex('accounts').select('*')
      .where('id', '=', req.params.id)
      .then(account => {
        res.status(200).json(account);
      })
      .catch(error => {
        res.status(500).json({ error: 'Failed to get post from database' });
      });
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to update post' });
    });
});

router.delete('/:id', (req, res) => {
  const changes = req.body;
  knex('accounts')
    .where({ id: req.params.id })
    .del()
    .then(count => {
        res.status(200).json(count);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to delete account' });
    });
});

module.exports = router;


