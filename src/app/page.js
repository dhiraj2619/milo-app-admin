"use client";
import { useState } from "react";
import {
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Coins,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  PackagePlus,
  Search,
  Settings,
  ShoppingCart,
  Users,
  UserRoundPlus,
  X,
  Plus,
  Pencil,
} from "lucide-react";
const nav = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["users", "Users", Users],
  ["customers", "Customers", Users],
  ["plans", "Subscription Plans", CreditCard],
  ["payments", "Payments", CreditCard],
  ["coins", "Coin Store", Coins],
  ["reports", "Reports", ChartNoAxesCombined],
  ["settings", "Settings", Settings],
];
const plans0 = [
  {
    name: "Basic Plan",
    code: "BASIC",
    price: "499",
    duration: "30",
    status: "Active",
  },
  {
    name: "Premium Plan",
    code: "PREMIUM",
    price: "999",
    duration: "30",
    status: "Active",
  },
  {
    name: "Gold Plan",
    code: "GOLD",
    price: "1499",
    duration: "30",
    status: "Active",
  },
];
const coins0 = [
  {
    name: "Starter Pack",
    coins: "70",
    price: "29",
    bonus: "0",
    status: "Active",
  },
  {
    name: "Popular Pack",
    coins: "190",
    price: "59",
    bonus: "20",
    status: "Active",
  },
];
const blankPlan = {
    name: "",
    code: "",
    price: "",
    duration: "30",
    status: "Active",
  },
  blankCoin = { name: "", coins: "", price: "", bonus: "0", status: "Active" };
export default function Home() {
  const [active, setActive] = useState("dashboard"),
    [plans, setPlans] = useState(plans0),
    [coins, setCoins] = useState(coins0),
    [modal, setModal] = useState(null),
    [form, setForm] = useState(blankPlan),
    [profileOpen, setProfileOpen] = useState(false);
  let current = nav.find((x) => x[0] === active)[1];
  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.assign("/login"); };
  const open = (type, item, index) => {
    setModal(type);
    setForm(
      item ? { ...item, index } : type === "plans" ? blankPlan : blankCoin,
    );
  };
  const save = (e) => {
    e.preventDefault();
    let set = modal === "plans" ? setPlans : setCoins;
    set((rows) =>
      form.index === undefined
        ? [...rows, form]
        : rows.map((row, i) => (i === form.index ? form : row)),
    );
    setModal(null);
  };
  return (
    <main className="app">
      <aside>
        <div className="logo">
          <b>M</b>
          <strong>MILO</strong>
        </div>
        <nav>
          {nav.map(([key, label, Icon]) => (
            <button
              className={active === key ? "selected" : ""}
              onClick={() => setActive(key)}
              key={key}
            >
              <Icon size={20} />
              <span>{label}</span>
              {["users", "customers", "plans", "payments"].includes(key) && (
                <ChevronRight size={16} />
              )}
            </button>
          ))}
        </nav>
        <div className="system">
          <i />{" "}
          <div>
            <b>System Online</b>
            <small>All services are running smoothly.</small>
          </div>
        </div>
      </aside>
      <section className="workspace">
        <header>
          <div className="search">
            <Search size={18} />
            <input placeholder="Search users, cities, or transactions..." />
          </div>
          <div className="topright">
            <button className="bell">
              <Bell size={20} />
              <i />
            </button>
            <div className="profileMenu">
              <button className="admin" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen}>
                <b>A</b>
                <span><strong>Admin</strong><small>Super Admin</small></span>
                <ChevronDown size={15} />
              </button>
              {profileOpen && <div className="profileDropdown"><div><b>A</b><span><strong>Admin</strong><small>Super Admin</small></span></div><button onClick={logout}><LogOut size={16} />Logout</button></div>}
            </div>
          </div>
        </header>
        <div className="content">
          {active === "dashboard" ? (
            <Dashboard />
          ) : (
            <Manage active={active} plans={plans} coins={coins} open={open} />
          )}
        </div>
      </section>
      {modal && (
        <Modal
          type={modal}
          form={form}
          setForm={setForm}
          save={save}
          close={() => setModal(null)}
        />
      )}
    </main>
  );
}
function Dashboard() {
  let metrics = [
    [Users, "Total Users", "48,230", "+12%", "purple"],
    [MessageCircle, "Active Subscribers", "3,482", "+18%", "green"],
    [CircleDollarSign, "Coins Sold", "1,24,850", "+22%", "orange"],
    [UserRoundPlus, "New Customers", "892", "+15%", "pink"],
    [CreditCard, "Plan Purchases", "286", "+8%", "blue"],
  ];
  return (
    <>
      <div className="welcome">
        <div>
          <small>ADMIN DASHBOARD</small>
          <h1>Welcome back, Admin Ã°Å¸â€˜â€¹</h1>
          <p>HereÃ¢â‚¬â„¢s whatÃ¢â‚¬â„¢s happening with your Milo platform today.</p>
        </div>
        <div>
          <button>
            <CalendarDays size={17} />
            Apr 26, 2025
            <ChevronDown size={15} />
          </button>
          <button className="live">
            <i />
            Live data <ChartNoAxesCombined size={16} />
          </button>
        </div>
      </div>
      <div className="metrics">
        {metrics.map(([Icon, title, value, growth, color]) => (
          <article key={title}>
            <span className={color}>
              <Icon size={20} />
            </span>
            <p>{title}</p>
            <h2>{value}</h2>
            <b>Ã¢â€ â€˜ {growth}</b>
            <small>vs last 30 days</small>
          </article>
        ))}
      </div>
      <div className="gridtop">
        <section className="card revenue">
          <div className="cardtitle">
            <div>
              <ChartNoAxesCombined size={22} />
              <h3>Revenue Overview</h3>
            </div>
            <div className="range">
              <b>7D</b>
              <b className="on">30D</b>
              <b>3M</b>
              <b>6M</b>
            </div>
          </div>
          <p>Total revenue from verified payments (Ã¢â€šÂ¹)</p>
          <div className="linechart">
            <span>Ã¢â€šÂ¹1.5L</span>
            <span>Ã¢â€šÂ¹1.0L</span>
            <span>Ã¢â€šÂ¹50K</span>
            <span>Ã¢â€šÂ¹0</span>
            <svg viewBox="0 0 650 210" preserveAspectRatio="none">
              <defs>
                <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                  <stop stopColor="#7543ff" stopOpacity=".28" />
                  <stop offset="1" stopColor="#7543ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 180 L55 148 L105 148 L150 116 L185 136 L245 105 L280 118 L340 78 L390 115 L440 90 L475 111 L515 82 L570 82 L620 42 L650 0 V210 H0Z"
                fill="url(#fill)"
              />
              <path
                d="M0 180 L55 148 L105 148 L150 116 L185 136 L245 105 L280 118 L340 78 L390 115 L440 90 L475 111 L515 82 L570 82 L620 42 L650 0"
                fill="none"
                stroke="#7543ff"
                strokeWidth="3"
              />
              <circle cx="340" cy="78" r="5" fill="#7543ff" />
            </svg>
            <div className="tooltip">
              <b>Ã¢â€šÂ¹1,24,860</b>
              <small>Apr 18, 2025</small>
            </div>
          </div>
          <div className="chartdates">
            <span>Apr 1</span>
            <span>Apr 7</span>
            <span>Apr 13</span>
            <span>Apr 19</span>
            <span>Apr 25</span>
            <span>Apr 30</span>
          </div>
        </section>
        <section className="card distribution">
          <div className="cardtitle">
            <div>
              <Users size={20} />
              <h3>User Distribution</h3>
            </div>
          </div>
          <div className="donut">
            <div>
              <b>48,230</b>
              <small>Total Users</small>
            </div>
          </div>
          <ul>
            <li>
              <i className="m" />
              Male <b>42%</b>
              <span>20,306</span>
            </li>
            <li>
              <i className="f" />
              Female <b>54%</b>
              <span>26,032</span>
            </li>
            <li>
              <i className="o" />
              Others <b>4%</b>
              <span>1,892</span>
            </li>
          </ul>
        </section>
        <Activity />
      </div>
      <div className="gridbottom">
        <Plans />
        <RecentUsers />
        <Cities />
      </div>
    </>
  );
}
function Activity() {
  let a = [
    ["Ã°Å¸â€˜Â©Ã°Å¸ÂÂ»", "New user registered", "Aanya Sharma", "2 mins ago"],
    ["Ã°Å¸â€ºâ€™", "Subscription purchased", "Rohan Mehta", "5 mins ago"],
    ["Ã°Å¸Âªâ„¢", "Coin purchase", "Kiara Joshi", "12 mins ago"],
    ["Ã°Å¸â€™Â¬", "New chat started", "Arjun Patel", "18 mins ago"],
    ["Ã°Å¸â€œÂ", "User joined from Nearby", "Meera Singh", "25 mins ago"],
  ];
  return (
    <section className="card activity">
      <div className="cardtitle">
        <h3>Recent Activity</h3>
        <a>View all Ã¢â€ â€™</a>
      </div>
      {a.map((x) => (
        <div className="activityrow" key={x[1]}>
          <b>{x[0]}</b>
          <span>
            <strong>{x[1]}</strong>
            <small>{x[2]}</small>
          </span>
          <em>{x[3]}</em>
        </div>
      ))}
    </section>
  );
}
function Plans() {
  return (
    <section className="card plans">
      <div className="cardtitle">
        <div>
          Ã¢â„¢â€º<h3>Top Performing Subscription Plans</h3>
        </div>
        <a>View all Ã¢â€ â€™</a>
      </div>
      {[
        ["Basic Plan", "Basic", "Ã¢â€šÂ¹499 / month", "1,246 sold", "#8a55f6"],
        ["Premium Plan", "Premium", "Ã¢â€šÂ¹999 / month", "892 sold", "#4385fa"],
        ["Gold Plan", "Gold", "Ã¢â€šÂ¹1,499 / month", "541 sold", "#ffb62d"],
      ].map((x) => (
        <div className="plan" key={x[0]}>
          <b style={{ background: x[4] }}>Ã¢Ëœâ€¦</b>
          <div>
            <strong>
              {x[0]} <i>{x[1]}</i>
            </strong>
            <small>{x[2]}</small>
            <span>
              <u
                style={{
                  width:
                    x[0] === "Basic Plan"
                      ? "62%"
                      : x[0] === "Premium Plan"
                        ? "50%"
                        : "37%",
                  background: x[4],
                }}
              />
            </span>
          </div>
          <em>{x[3]}</em>
        </div>
      ))}
    </section>
  );
}
function RecentUsers() {
  let users = [
    ["Ã°Å¸â€˜Â©Ã°Å¸ÂÂ»", "Aanya Sharma", "Hindi", "0.4 km"],
    ["Ã°Å¸â€˜Â¨Ã°Å¸ÂÂ»", "Rohan Mehta", "Marathi", "0.8 km"],
    ["Ã°Å¸Â§â€˜Ã°Å¸ÂÂ»", "Kiara Joshi", "Gujarati", "1.2 km"],
    ["Ã°Å¸â€˜Â©Ã°Å¸ÂÂ½", "Arjun Patel", "Hindi", "1.9 km"],
  ];
  return (
    <section className="card recent">
      <div className="cardtitle">
        <div>
          <Users size={19} />
          <h3>Recent Users</h3>
        </div>
        <a>View all Ã¢â€ â€™</a>
      </div>
      {users.map((x) => (
        <div className="userrow" key={x[1]}>
          <b>{x[0]}</b>
          <strong>{x[1]}</strong>
          <i>{x[2]}</i>
          <span>{x[3]}</span>
          <button>Join Call</button>
        </div>
      ))}
    </section>
  );
}
function Cities() {
  return (
    <section className="card cities">
      <div className="cardtitle">
        <div>
          <MapPin size={19} />
          <h3>Top Cities</h3>
        </div>
        <a>View all Ã¢â€ â€™</a>
      </div>
      {[
        ["Pune", "2,845", "18%"],
        ["Mumbai", "2,432", "14%"],
        ["Bangalore", "1,892", "12%"],
        ["Hyderabad", "1,524", "10%"],
        ["Delhi", "1,203", "8%"],
      ].map((x, i) => (
        <div key={x[0]}>
          <b>{i + 1}</b>
          <span>Ã°Å¸Ââ„¢Ã¯Â¸Â</span>
          <strong>{x[0]}</strong>
          <em>{x[1]}</em>
          <i>Ã¢â€ â€˜ {x[2]}</i>
        </div>
      ))}
    </section>
  );
}
function Manage({ active, plans, coins, open }) {
  let isPlan = active === "plans",
    isCoin = active === "coins",
    rows = isPlan ? plans : isCoin ? coins : [];
  let label = isPlan ? "Subscription Plans" : isCoin ? "Coin Store" : active;
  return (
    <section className="card manage">
      <div className="cardtitle">
        <div>
          <h2>{label}</h2>
          <p>Manage your Milo platform data.</p>
        </div>
        {(isPlan || isCoin) && (
          <button onClick={() => open(active)}>
            <Plus size={16} />
            Add {isPlan ? "plan" : "package"}
          </button>
        )}
      </div>
      {rows.length ? (
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>{isPlan ? "CODE" : "COINS"}</th>
              <th>PRICE</th>
              <th>STATUS</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name}>
                <td>{r.name}</td>
                <td>{isPlan ? r.code : r.coins}</td>
                <td>Ã¢â€šÂ¹{r.price}</td>
                <td>
                  <em>{r.status}</em>
                </td>
                <td>
                  <button onClick={() => open(active, r, i)}>
                    <Pencil size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty">
          Choose Subscription Plans or Coin Store to manage products.
        </div>
      )}
    </section>
  );
}
function Modal({ type, form, setForm, save, close }) {
  let plan = type === "plans",
    fields = plan
      ? [
          ["name", "Plan name"],
          ["code", "Plan code"],
          ["price", "Price (Ã¢â€šÂ¹)"],
          ["duration", "Duration (days)"],
        ]
      : [
          ["name", "Package name"],
          ["coins", "Coins"],
          ["price", "Price (Ã¢â€šÂ¹)"],
          ["bonus", "Bonus coins"],
        ];
  return (
    <div className="overlay" onMouseDown={close}>
      <form
        className="modal"
        onSubmit={save}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modalhead">
          <div>
            <h2>
              {form.index === undefined ? "Add" : "Edit"}{" "}
              {plan ? "subscription plan" : "coin package"}
            </h2>
            <p>Set the product details below.</p>
          </div>
          <button type="button" onClick={close}>
            <X />
          </button>
        </div>
        <div className="formgrid">
          {fields.map(([key, label]) => (
            <label key={key}>
              {label}
              <input
                required
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </label>
          ))}
          <label>
            Status
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
        </div>
        <div className="modalactions">
          <button type="button" onClick={close}>
            Cancel
          </button>
          <button className="primary">
            <PackagePlus size={16} />
            {form.index === undefined ? "Create" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
