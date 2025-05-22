exports.createReport = (req, res) => {
  res.json({ message: "Hazard report created" });
};

exports.getAllReports = (req, res) => {
  res.json({ message: "Fetching all reports" });
};
