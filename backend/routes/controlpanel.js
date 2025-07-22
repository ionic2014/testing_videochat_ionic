import express from "express";
const router = express.Router();

let systemConfig = {
  enableRegistration: true,
  messageDelay: 0,
  chatTheme: "default",
  userlistBg: "#1c2230",
  chatboxBg: "#22283b",
  textColor: "#f4f4f4"
};

router.get("/config", (req, res) => {
  res.json(systemConfig);
});
router.post("/config", (req, res) => {
  Object.assign(systemConfig, req.body);
  res.json(systemConfig);
});

export default router;