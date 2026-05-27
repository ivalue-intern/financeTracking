import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveAs } from "file-saver";


import {
  Pie
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function App() {

  const [transactions, setTransactions] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [date, setDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  /* FETCH TRANSACTIONS */

const fetchTransactions = async () => {

  setLoading(true);

  const res = await axios.get(
    "http://13.201.52.72:5000/transactions"
  );

  setTransactions(res.data);

  setLoading(false);
};

  useEffect(() => {
    fetchTransactions();
  }, []);

  /* ADD TRANSACTION */

  const addTransaction = async () => {
if (editingId) {
  await axios.put(
    `http://13.201.52.72:5000/transactions/${editingId}`,
    {
      title,
      amount,
      category,
      type,
      date
    }
  );

  fetchTransactions();

  setTitle("");
  setAmount("");
  setCategory("");
  setType("expense");
  setEditingId(null);
  setDate("")

  return;
}
    
    await axios.post(
      "http://13.201.52.72:5000/transactions",
      {
        title,
        amount,
        category,
        type,
        date
      }
    );
    toast.success("Transaction Added!");

    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
    fetchTransactions();
  };
  const updateTransaction = async () => {

  await axios.put(
    `http://13.201.52.72:5000/transactions/${editingId}`,
    {
      title,
      amount,
      category,
      type,
      date
    }
  );
  toast.info("Transaction Updated!");

  fetchTransactions();

  setTitle("");
  setAmount("");
  setCategory("");
  setType("expense");
  setDate("");
  setEditingId(null);
};



  /* DELETE TRANSACTION */

  const deleteTransaction = async (id) => {

    await axios.delete(
      `http://13.201.52.72:5000/transactions/${id}`
    );
    toast.error("Transaction Deleted!");

    fetchTransactions();
  };

  /* TOTALS */

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);
  const categoryTotals = {};

transactions.forEach((t) => {

  if (t.type === "expense") {

    if (categoryTotals[t.category]) {
      categoryTotals[t.category] += Number(t.amount);
    } else {
      categoryTotals[t.category] = Number(t.amount);
    }

  }

});
    const chartData = {
  labels: ["Income", "Expense"],

  datasets: [
    {
      data: [income, expense],

      backgroundColor: [
        "#22c55e",
        "#ef4444"
      ],

      borderWidth: 1
    }
  ]
};

const categoryChartData = {

  labels: Object.keys(categoryTotals),

  datasets: [
    {
      label: "Expenses by Category",

      data: Object.values(categoryTotals),

      backgroundColor: [
        "#ef4444",
        "#3b82f6",
        "#22c55e",
        "#f59e0b",
        "#8b5cf6",
        "#ec4899"
      ]
    }
  ]
};

  const balance = income - expense;
  
const exportCSV = () => {

  const headers = [
    "Title",
    "Amount",
    "Category",
    "Type",
    "Date"
  ];

  const rows = transactions.map((t) => [
    t.title,
    t.amount,
    t.category,
    t.type,
    t.date
  ]);

  let csvContent =
    headers.join(",") + "\n";

  rows.forEach((row) => {
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob(
    [csvContent],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  saveAs(blob, "transactions.csv");

};
  return (
  <>
  <div className={`container ${
  darkMode ? "dark" : ""
}`}>
  <button
  className="button"
  onClick={() =>
    setDarkMode(!darkMode)
  }
  style={{
    marginBottom: "20px"
  }}
>
  {darkMode
    ? "Light Mode"
    : "Dark Mode"}
</button>
    <h1 className="title">
      Personal Finance Tracker
    </h1>

    <div className="balance-container">

      <div className="card">
        <h2>Balance</h2>
        <h1>₹{balance}</h1>
      </div>

      <div className="card">
        <h2>Income</h2>
        <h1>₹{income}</h1>
      </div>

      <div className="card">
        <h2>Expense</h2>
        <h1>₹{expense}</h1>
      </div>

    </div>

    <div className="form-container">
      <input
  className="input"
  placeholder="Search transactions..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
/>
<select
  className="select"
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
>
  <option value="all">All</option>
  <option value="income">Income</option>
  <option value="expense">Expense</option>
</select>
<select
  className="select"
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
>
  <option value="latest">Latest</option>
  <option value="oldest">Oldest</option>
  <option value="highest">Highest Amount</option>
  <option value="lowest">Lowest Amount</option>
</select>

      <h2>Add Transaction</h2>

      <input
        className="input"
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <input
        className="input"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
      />
   <input
  type="date"
  className="input"
  value={date}
  onChange={(e) => setDate(e.target.value)}
/>

      <input
        className="input"
        placeholder="Category"
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      />

      <select
        className="select"
        value={type}
        onChange={(e) =>
          setType(e.target.value)
        }
      >
        <option value="expense">
          Expense
        </option>

        <option value="income">
          Income
        </option>
      </select>

      <button
        className="button"
        onClick={
  editingId
    ? updateTransaction
    : addTransaction
}
      >
        {editingId
  ? "Update Transaction"
  : "Add Transaction"}
      </button>

    </div>
    
    
<div className="card">



  <h2>Finance Overview</h2>

  <div
    style={{
      width: "300px",
      margin: "auto"
    }}
  >
    <Pie data={chartData} />
  </div>

</div>

<div className="card">

  <h2>Expenses By Category</h2>

  <div
    style={{
      width: "300px",
      margin: "auto"
    }}
  >
    <Pie data={categoryChartData} />
  </div>

</div>
    <div className="transactions">
    <button
  className="button"
  onClick={exportCSV}
>
  Export CSV
</button>
      <h2>Transactions</h2>
      {loading && <h3>Loading...</h3>}

{!loading && transactions.length === 0 && (
  <h3>No transactions yet 😭</h3>
)}

      {transactions
 .filter((t) => {
  const matchesSearch = t.title
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesFilter =
    filter === "all" || t.type === filter;

  return matchesSearch && matchesFilter;
})
.sort((a, b) => {

  if (sortBy === "latest") {
    return new Date(b.date) - new Date(a.date);
  }

  if (sortBy === "oldest") {
    return new Date(a.date) - new Date(b.date);
  }

  if (sortBy === "highest") {
    return b.amount - a.amount;
  }

  if (sortBy === "lowest") {
    return a.amount - b.amount;
  }

  return 0;

})
  .map((t) => (

        <div
          key={t.id}
          className="transaction-card"
        >

          <h2>{t.title}</h2>

          <p><strong>Amount:</strong> ₹{t.amount}</p>

          <p><strong>Category:</strong> {t.category}</p>

          <p><strong>Type:</strong> {t.type}</p>
          <p><strong>Date:</strong> {t.date}</p>
  


    

    

<button
  style={{ marginRight: "10px" }}
  onClick={() => {
    setTitle(t.title);
    setAmount(t.amount);
    setCategory(t.category);
    setType(t.type);
    setEditingId(t.id);
    setDate(t.date);
  }}
>
  Edit
</button>
  


<button
  className="delete-btn"
  onClick={() => deleteTransaction(t.id)}
>
  Delete
</button>


</div>

      ))}

    </div>

  </div>

<ToastContainer />
</>

);


}

export default App;