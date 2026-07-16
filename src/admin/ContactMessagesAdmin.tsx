import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { ContactMessageRow } from "../types";
import { Alert } from "../components";
import useAlert from "../hooks/useAlert";

function ContactMessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { alert, showAlert } = useAlert(3000);

  const loadMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) showAlert({ text: error.message, type: "danger" });
    setMessages((data ?? []) as ContactMessageRow[]);
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Delete this message?")) return;
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);
    if (error) {
      showAlert({ text: error.message, type: "danger" });
      return;
    }
    setMessages((current) => current.filter((message) => message.id !== id));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl relative">
      {alert.show && <Alert {...alert} />}

      <h2 className="text-xl font-semibold mb-4">Messages</h2>

      {messages.length === 0 ? (
        <p className="text-slate-500">No messages yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {message.name}{" "}
                  <span className="text-slate-400 font-normal">
                    &lt;{message.email}&gt;
                  </span>
                </span>
                <button
                  type="button"
                  className="btn bg-red-600"
                  onClick={() => deleteMessage(message.id)}
                >
                  Delete
                </button>
              </div>
              <p className="text-slate-600 whitespace-pre-wrap">
                {message.message}
              </p>
              <span className="text-xs text-slate-400">
                {new Date(message.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ContactMessagesAdmin;
