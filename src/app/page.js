"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { createSubscriptionPlan, fetchSubscriptionPlans } from "./redux/slices/subscriptionPlanSlice";
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
const PLAN_FEATURES = [
  ["dailyBonusCoins", "Daily bonus coins"], ["monthlyBonusCoins", "Monthly bonus coins"], ["premiumBadge", "Premium badge"], ["extraCallRequests", "Extra call requests"], ["priorityConnect", "Priority Connect"], ["nearbyUsers", "Nearby users"], ["languageFiltersBasic", "Language filters (Basic)"], ["languageFiltersAdvanced", "Language filters (Advanced)"], ["profileVisibilityBoost", "Profile visibility boost"], ["profilePriority", "Profile priority"], ["dailyProfileBoost", "Daily profile boost"], ["fasterConnectMatching", "Faster Connect matching"], ["higherCallChatPriority", "Higher call/chat priority"], ["exclusiveAvatarStyles", "Exclusive avatar styles"],
];
const blankPlan = {
  name: "", code: "", price: "", duration: "30", planType: "subscription", status: "Active",
  shortDescription: "", detailedDescription: "", sortOrder: "0", isPopular: false,
  dailyBonusCoins: "0", monthlyBonusCoins: "0",
  features: Object.fromEntries(PLAN_FEATURES.map(([key]) => [key, false])),
};
const blankCoin = { name: "", coins: "", price: "", bonus: "0", status: "Active" };export default function Home() {
  const [active, setActive] = useState("dashboard"),
    [submitError, setSubmitError] = useState(""),
    [coins, setCoins] = useState(coins0),
    [modal, setModal] = useState(null),
    [form, setForm] = useState(blankPlan),
    [profileOpen, setProfileOpen] = useState(false);
  let current = nav.find((x) => x[0] === active)[1];
  const dispatch = useAppDispatch();
  const { items: remotePlans, loading: plansLoading, saving: planSaving } = useAppSelector((state) => state.subscriptionPlans);
  useEffect(() => {
    if (active === "plans") dispatch(fetchSubscriptionPlans());
  }, [active, dispatch]);
  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.assign("/login"); };
  const open = (type, item, index) => {
    setModal(type);
    if (type === "plans" && item) {
      setForm({ ...blankPlan, ...item, index, duration: String(item.durationDays ?? item.duration ?? 30), price: String(item.price?.amount ?? item.price ?? ""), status: item.isActive === false ? "Inactive" : "Active", dailyBonusCoins: String(item.bonusCoins?.daily ?? 0), monthlyBonusCoins: String(item.bonusCoins?.monthly ?? 0), features: { ...blankPlan.features, ...item.features } });
      return;
    }
    setForm(item ? { ...item, index } : type === "plans" ? { ...blankPlan, features: { ...blankPlan.features } } : blankCoin);
  };
  const save = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (modal === "plans") {
      try {
        await dispatch(createSubscriptionPlan({ name: form.name, code: form.code, planType: form.planType, shortDescription: form.shortDescription, detailedDescription: form.detailedDescription, durationDays: Number(form.duration), price: { amount: Number(form.price), currency: "INR" }, bonusCoins: { daily: Number(form.dailyBonusCoins), monthly: Number(form.monthlyBonusCoins) }, features: form.features, sortOrder: Number(form.sortOrder), isPopular: form.isPopular, isActive: form.status === "Active" })).unwrap();
        setModal(null);
      } catch (error) { setSubmitError(error.message || "Unable to add subscription plan."); }
      return;
    }
    setCoins((rows) => form.index === undefined ? [...rows, form] : rows.map((row, i) => i === form.index ? form : row));
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
            <Manage active={active} plans={remotePlans} coins={coins} open={open} loading={plansLoading} />
          )}
        </div>
      </section>
      {modal && (
        <Modal
          type={modal}
          form={form}
          setForm={setForm}
          save={save}
          close={() => { setSubmitError(""); setModal(null); }}
          saving={planSaving}
          error={submitError}
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
          <h1>Welcome back, Admin</h1>
          <p>Here's what's happening with your Milo platform today.</p>
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
            <b> {growth}</b>
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
          <p>Total revenue from verified payments ()</p>
          <div className="linechart">
            <span>1.5L</span>
            <span>1.0L</span>
            <span>50K</span>
            <span>0</span>
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
              <b>1,24,860</b>
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
  const activities = [
    [Users, "New user registered", "Aanya Sharma", "2 mins ago", "#f1eaff", "#7649f4"],
    [ShoppingCart, "Subscription purchased", "Rohan Mehta", "5 mins ago", "#eee8ff", "#7044e7"],
    [Coins, "Coin purchase", "Kiara Joshi", "12 mins ago", "#fff3d9", "#e39a14"],
    [MessageCircle, "New chat started", "Arjun Patel", "18 mins ago", "#e6efff", "#4a82f8"],
    [MapPin, "User joined from Nearby", "Meera Singh", "25 mins ago", "#ffe9f5", "#e44591"],
  ];
  return (
    <section className="card activity">
      <div className="cardtitle"><h3>Recent Activity</h3><a>View all</a></div>
      {activities.map(([Icon, title, person, time, background, color]) => (
        <div className="activityrow" key={title}>
          <b style={{ width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: "50%", background, color }}><Icon size={17} /></b>
          <span><strong>{title}</strong><small>{person}</small></span>
          <em>{time}</em>
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
          <h3>Top Performing Subscription Plans</h3>
        </div>
        <a>View all</a>
      </div>
      {[
        ["Basic Plan", "Basic", "499 / month", "1,246 sold", "#8a55f6"],
        ["Premium Plan", "Premium", "999 / month", "892 sold", "#4385fa"],
        ["Gold Plan", "Gold", "1,499 / month", "541 sold", "#ffb62d"],
      ].map((x) => (
        <div className="plan" key={x[0]}>
          <b style={{ background: x[4] }}></b>
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
    ["", "Aanya Sharma", "Hindi", "0.4 km"],
    ["", "Rohan Mehta", "Marathi", "0.8 km"],
    ["", "Kiara Joshi", "Gujarati", "1.2 km"],
    ["", "Arjun Patel", "Hindi", "1.9 km"],
  ];
  return (
    <section className="card recent">
      <div className="cardtitle">
        <div>
          <Users size={19} />
          <h3>Recent Users</h3>
        </div>
        <a>View all</a>
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
        <a>View all</a>
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
          <span></span>
          <strong>{x[0]}</strong>
          <em>{x[1]}</em>
          <i> {x[2]}</i>
        </div>
      ))}
    </section>
  );
}
function Manage({ active, plans, coins, open, loading }) {
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
      {loading && isPlan ? <div className="empty">Loading subscription plans...</div> : rows.length ? (
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
                <td>{isPlan ? `Rs. ${r.price?.amount ?? r.price}` : r.price}</td>
                <td>
                  <em>{isPlan ? (r.isActive ? "Active" : "Inactive") : r.status}</em>
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
function Modal({ type, form, setForm, save, close, saving, error }) {
  if (type !== "plans") return null;
  const update = (key, value) => setForm({ ...form, [key]: value });
  const toggleFeature = (key) => setForm({ ...form, features: { ...form.features, [key]: !form.features[key] } });
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4" onMouseDown={close}>
      <form className="max-h-[94vh] w-[min(960px,96vw)] overflow-y-auto rounded-2xl bg-white p-7 shadow-2xl" onSubmit={save} onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between"><div><h2 className="text-2xl font-bold text-slate-900">{form.index === undefined ? "Add Subscription Plan" : "Edit Subscription Plan"}</h2><p className="mt-1 text-sm text-slate-500">Set the plan details and included features for your users.</p></div><button type="button" onClick={close} className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-800"><X size={23}/></button></div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_.9fr]">
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Input label="Plan name *" hint="e.g. Milo Connect, Milo Pro" value={form.name} onChange={(value) => update("name", value)} placeholder="Milo Connect"/><Input label="Plan code *" hint="Unique code (e.g. milo_connect)" value={form.code} onChange={(value) => update("code", value)} placeholder="milo_connect"/><Input label="Price (Rs.) *" type="number" value={form.price} onChange={(value) => update("price", value)} placeholder="299"/><Input label="Duration (days) *" type="number" value={form.duration} onChange={(value) => update("duration", value)} placeholder="30"/><Select label="Plan type *" value={form.planType} onChange={(value) => update("planType", value)} options={[["subscription","Subscription"],["trial","Trial"]]}/><Select label="Status *" value={form.status} onChange={(value) => update("status", value)} options={[["Active","Active"],["Inactive","Inactive"]]}/></div>
            <TextArea label="Short description *" value={form.shortDescription} onChange={(value) => update("shortDescription", value)} maxLength={150}/><TextArea label="Detailed description (Optional)" value={form.detailedDescription} onChange={(value) => update("detailedDescription", value)} maxLength={500}/>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Input label="Plan order (Optional)" hint="Lower number will be shown first" type="number" value={form.sortOrder} onChange={(value) => update("sortOrder", value)} placeholder="1"/><label className="block text-sm font-semibold text-slate-800">Is popular plan?<span className="mt-2 flex items-center gap-3"><input className="h-5 w-9 accent-violet-600" type="checkbox" checked={form.isPopular} onChange={(event) => update("isPopular",event.target.checked)}/><small className="text-xs font-normal text-slate-500">Show Popular badge</small></span></label></div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><h3 className="font-bold text-slate-900">Bonus Coins (Optional)</h3><p className="mb-3 text-xs text-slate-500">Set the coin rewards for this plan.</p><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Input label="Daily bonus coins" type="number" value={form.dailyBonusCoins} onChange={(value) => update("dailyBonusCoins", value)} placeholder="50"/><Input label="Monthly bonus coins" type="number" value={form.monthlyBonusCoins} onChange={(value) => update("monthlyBonusCoins", value)} placeholder="300"/></div></div>
          </div>
          <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-4"><h3 className="font-bold text-slate-900">Included Features</h3><p className="mb-3 text-xs text-slate-500">Select the features available in this plan.</p><div className="space-y-2">{PLAN_FEATURES.map(([key,label]) => <label key={key} className="flex cursor-pointer items-center gap-3 text-sm text-slate-800"><input className="h-5 w-5 rounded accent-violet-600" type="checkbox" checked={Boolean(form.features[key])} onChange={() => toggleFeature(key)}/>{label}</label>)}</div><div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><span className="float-right rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">{form.status}</span><h3 className="font-bold text-slate-900">{form.name || "Plan Preview"}</h3><p className="mt-1 font-semibold text-slate-800">Rs. {form.price || 0} / {form.duration || 0} days</p>{PLAN_FEATURES.filter(([key]) => form.features[key]).slice(0,5).map(([,label]) => <p className="mt-1 text-sm text-violet-700" key={label}>+ {label}</p>)}</div></div>
        </div>
        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}<div className="mt-5 flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" onClick={close} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700">Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-60"><Plus size={17}/>{saving ? "Adding..." : "Add Plan"}</button></div>
      </form>
    </div>
  );
}
function Input({ label, hint, value, onChange, placeholder, type = "text" }) { return <label className="block text-sm font-semibold text-slate-800">{label}<input required type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"/>{hint && <small className="mt-1 block text-xs font-normal text-slate-500">{hint}</small>}</label>; }
function Select({ label, value, onChange, options }) { return <label className="block text-sm font-semibold text-slate-800">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100">{options.map(([key,text]) => <option key={key} value={key}>{text}</option>)}</select></label>; }
function TextArea({ label, value, onChange, maxLength }) { return <label className="block text-sm font-semibold text-slate-800">{label}<textarea value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} className="mt-2 h-20 w-full resize-y rounded-lg border border-slate-300 p-3 text-sm font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"/><small className="block text-right text-xs font-normal text-slate-500">{value.length}/{maxLength}</small></label>; }