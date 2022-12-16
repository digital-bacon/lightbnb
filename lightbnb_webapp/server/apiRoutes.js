module.exports = function(router, database) {

  router.get('/properties', (req, res) => {
    database.getAllProperties(req.query, 20)
    .then(properties => res.send({properties}))
    .catch(e => {
      console.error(e);
      res.send(e)
    }); 
  });

  router.get('/reservations', (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(403).send('401 - Unauthorized. You need to be logged in to perform that action.');
      return;
    }
    database.getAllReservations(userId)
    .then(reservations => res.send({reservations}))
    .catch(e => {
      console.error(e);
      res.send(e)
    });
  });

  router.post('/properties', (req, res) => {
    const userId = req.session.userId;
    database.addProperty({...req.body, owner_id: userId})
      .then(property => {
        res.send(property);
      })
      .catch(e => {
        console.error(e);
        res.send(e)
      });
  });

  router.post('/reservations', (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(403).send('401 - Unauthorized. You need to be logged in to perform that action.');
    }
    database.addReservation({...req.body, guest_id: userId})
      .then(reservation => {
        res.send(reservation);
      })
      .catch(e => {
        console.error(e);
        res.send(e)
      });
  });

  return router;
}