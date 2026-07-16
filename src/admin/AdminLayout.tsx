import { useState } from "react";
import { supabase } from "../lib/supabase";
import { entityConfigs } from "./entityConfigs";
import EntityAdmin from "./EntityAdmin";
import ProfileAdmin from "./ProfileAdmin";
import ContactMessagesAdmin from "./ContactMessagesAdmin";

function AdminLayout() {
  const [activeKey, setActiveKey] = useState("profile");

  return (
    <section className="max-container">
      <div className="flex items-center justify-between mb-8">
        <h1 className="head-text">Admin</h1>
        <button
          type="button"
          className="btn bg-slate-500"
          onClick={() => supabase.auth.signOut()}
        >
          Sign out
        </button>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        <button
          type="button"
          className={`btn ${activeKey === "profile" ? "" : "bg-slate-400"}`}
          onClick={() => setActiveKey("profile")}
        >
          Profile
        </button>
        {Object.entries(entityConfigs).map(([key, config]) => (
          <button
            key={key}
            type="button"
            className={`btn ${activeKey === key ? "" : "bg-slate-400"}`}
            onClick={() => setActiveKey(key)}
          >
            {config.label}
          </button>
        ))}
        <button
          type="button"
          className={`btn ${activeKey === "messages" ? "" : "bg-slate-400"}`}
          onClick={() => setActiveKey("messages")}
        >
          Messages
        </button>
      </div>

      {activeKey === "profile" ? (
        <ProfileAdmin />
      ) : activeKey === "messages" ? (
        <ContactMessagesAdmin />
      ) : (
        <EntityAdmin config={entityConfigs[activeKey]} />
      )}
    </section>
  );
}

export default AdminLayout;
