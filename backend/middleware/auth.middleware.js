const admin = require("firebase-admin");
const serviceAccount = require("../firebaseServiceKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = async function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
};
