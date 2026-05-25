const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

/* GET ALL TRANSACTIONS */

app.get("/transactions", (req, res) => {

    const transactions = db
        .prepare(
            "SELECT * FROM transactions ORDER BY id DESC"
        )
        .all();

    res.json(transactions);
});

/* ADD TRANSACTION */

app.post("/transactions", (req, res) => {

  try {

    const {
      title,
      amount,
      category,
      type,
      date
    } = req.body;

    db.prepare(`
      INSERT INTO transactions
      (title, amount, category, type, date)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      title,
      amount,
      category,
      type,
      date
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

});
/* UPDATE TRANSACTION */

app.put("/transactions/:id", (req, res) => {

  const { title, amount, category, type, date} = req.body;

  const id = req.params.id;

  db.prepare(`
    UPDATE transactions
    SET title = ?,
        amount = ?,
        category = ?,
        type = ?,
        date = ?
    WHERE id = ?
  `).run(
    title,
    amount,
    category,
    type,
    date,
    id
  );

  res.json({
    message: "Updated"
  });

});

/* DELETE TRANSACTION */

app.delete("/transactions/:id", (req, res) => {

    const id = req.params.id;

    db.prepare(`
        DELETE FROM transactions
        WHERE id = ?
    `).run(id);

    res.json({
        message: "Deleted"
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});