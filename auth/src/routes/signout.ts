import express from 'express';

const router = express.Router();


//we are going to instruct the user's browser to empty out all the info inside the cookie, including the jwt
//cookie session library has you set req.session to null to achieve this
router.post('/api/users/signout', (req, res) => {
  req.session = null;

  res.send({});
});

export { router as signoutRouter };                                                                                                                                                            